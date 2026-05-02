/**
 * AssemblyAIStreamingService
 *
 * Browser-side wrapper around AssemblyAI's Universal Streaming v3 WebSocket
 * for live transcription. Drop-in replacement for `LiveSpeechService`
 * (Web Speech API) with much better quality and 10-language support.
 *
 * Architecture:
 *   1. Server mints a single-use temp token via /api/transcribe-token
 *   2. Browser opens WebSocket to wss://streaming.assemblyai.com/v3/ws?token=...
 *   3. Mic audio is captured via getUserMedia + AudioWorklet
 *   4. Audio is downsampled to 16kHz mono PCM16 and sent as binary frames
 *   5. AssemblyAI sends Turn events with partial / final transcripts
 *   6. On stop, we send {"type":"Terminate"} to close cleanly (avoids billing
 *      until the 3-hour cap)
 */

import { authFetch } from "@/lib/api-client";

const WS_URL = "wss://streaming.assemblyai.com/v3/ws";
const SAMPLE_RATE = 16_000;
const CHUNK_MS = 100; // 50–1000 ms required by AssemblyAI

/** Map a UI / i18n code to a target spoken language for AssemblyAI multilingual.
 *  "auto" → enable language_detection.
 *  Other codes are passed through as ISO 639-1 (e.g. "fr", "en"). */
type LangCode =
  | "auto"
  | "en"
  | "fr"
  | "es"
  | "de"
  | "it"
  | "pt"
  | "nl"
  | "zh"
  | "ja"
  | "ko";

type TurnCallback = (text: string, isFinal: boolean) => void;

/** Rich payload for finalized turns — sent to Claude for analysis. */
export interface FinalTurnEvent {
  /** Cleaned, formatted, punctuated transcript text. */
  text: string;
  /** Detected language code (ISO 639-1) — present when language_detection is on. */
  language?: string;
  /** Speaker label when diarization is enabled (e.g. "A", "B"). */
  speaker?: string;
  /** Timestamp (ms since epoch) the turn was finalized. */
  timestamp: number;
}

type FinalTurnCallback = (event: FinalTurnEvent) => void;

interface StartOptions {
  /** Audio language; `"auto"` triggers AssemblyAI's `language_detection`. */
  language?: LangCode;
  /** Domain-specific terms to bias the model (max 100 entries, ≤50 chars each). */
  keyterms?: string[];
  /** Optional callback fired when a turn is finalized — used for analysis pipeline. */
  onFinalTurn?: FinalTurnCallback;
  /**
   * Optional pre-existing MediaStream to consume audio from.
   * When provided we use this stream instead of calling `getUserMedia` ourselves —
   * this is the way to capture *combined* audio (mic + screen-share system audio)
   * so prospects on Zoom/Discord/Meet are transcribed too, not just the local user.
   * If omitted, falls back to a fresh `getUserMedia({ audio: true })`.
   */
  audioStream?: MediaStream;
}

interface AssemblyAITurnMessage {
  type: "Turn";
  transcript: string;
  end_of_turn: boolean;
  /** Speaker label when diarization is on. */
  speaker_label?: string;
  /** Detected language when language_detection is on. */
  language_code?: string;
}

interface AssemblyAIBeginMessage {
  type: "Begin";
  id: string;
  expires_at: number;
}

interface AssemblyAITerminationMessage {
  type: "Termination";
}

type AssemblyAIServerMessage =
  | AssemblyAIBeginMessage
  | AssemblyAITurnMessage
  | AssemblyAITerminationMessage
  | { type: string; [k: string]: unknown };

export class AssemblyAIStreamingService {
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private onResult: TurnCallback | null = null;
  private onFinalTurn: FinalTurnCallback | null = null;
  private currentLanguage: LangCode = "auto";
  private currentKeyterms: string[] = [];
  private terminated = false;
  private starting = false;
  // When the consumer provides their own MediaStream we must NOT stop its tracks
  // on cleanup — they're owned by the caller (typically AudioCaptureService).
  private streamOwnedByCaller = false;

  /** Always supported in modern browsers (requires WebSocket + AudioContext + getUserMedia). */
  get supported(): boolean {
    if (typeof window === "undefined") return false;
    return (
      typeof WebSocket !== "undefined" &&
      typeof AudioContext !== "undefined" &&
      !!navigator.mediaDevices?.getUserMedia
    );
  }

  /** Set the spoken-audio language. Restarts the session if running. */
  setLanguage(lang: string): void {
    const next = normalizeLang(lang);
    if (next === this.currentLanguage) return;
    this.currentLanguage = next;
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      // Mid-session language change requires a reconnect (AssemblyAI fixes language at handshake)
      this.restart();
    }
  }

  /**
   * Start a streaming session. `onResult(text, isFinal)` is fired:
   *   - With `isFinal=false` for partial turns (interim captions)
   *   - With `isFinal=true` for completed turns (formatted final text)
   */
  async start(onResult: TurnCallback, opts: StartOptions = {}): Promise<void> {
    if (this.starting || this.ws) return;
    this.starting = true;
    this.terminated = false;
    this.onResult = onResult;
    this.onFinalTurn = opts.onFinalTurn ?? null;
    if (opts.language) this.currentLanguage = opts.language;
    if (opts.keyterms) this.currentKeyterms = opts.keyterms.slice(0, 100);

    // If the caller passed an existing stream (e.g. mic+system audio combined),
    // reuse it instead of grabbing a fresh getUserMedia inside startMicPump.
    if (opts.audioStream) {
      this.mediaStream = opts.audioStream;
      this.streamOwnedByCaller = true;
    } else {
      this.streamOwnedByCaller = false;
    }

    try {
      // 1) Mint a temp token from our server (raw API key never leaves backend)
      const tokenRes = await authFetch("/api/transcribe-token", { method: "POST" });
      if (!tokenRes.ok) {
        throw new Error(`Token mint failed: ${tokenRes.status}`);
      }
      const { token } = (await tokenRes.json()) as { token: string };

      // 2) Build the WebSocket URL with streaming params
      const url = new URL(WS_URL);
      url.searchParams.set("token", token);
      url.searchParams.set("sample_rate", String(SAMPLE_RATE));
      url.searchParams.set("speech_model", "universal-streaming-multilingual");
      url.searchParams.set("format_turns", "true");
      // Identify who said what — used by the Speaker Breakdown in the post-call report.
      // Silently ignored on streaming variants that don't support it.
      url.searchParams.set("speaker_diarization", "true");
      if (this.currentLanguage === "auto") {
        url.searchParams.set("language_detection", "true");
      } else {
        // Steer the multilingual model toward a specific language via prompt
        url.searchParams.set(
          "prompt",
          `Transcribe ${LANG_NAME[this.currentLanguage] ?? "the conversation"}.`,
        );
      }
      if (this.currentKeyterms.length > 0) {
        // The streaming v3 endpoint accepts keyterms_prompt as a JSON array
        url.searchParams.set("keyterms_prompt", JSON.stringify(this.currentKeyterms));
      }

      // 3) Open the WebSocket
      const ws = new WebSocket(url.toString());
      this.ws = ws;

      ws.onopen = async () => {
        // 4) Start capturing mic audio and pumping PCM16 frames
        try {
          await this.startMicPump();
        } catch (err) {
          console.error("[assemblyai-stream] mic pump failed:", err);
          this.stop();
        }
      };

      ws.onmessage = (event) => {
        let msg: AssemblyAIServerMessage;
        try {
          msg = JSON.parse(typeof event.data === "string" ? event.data : "") as AssemblyAIServerMessage;
        } catch {
          return; // ignore non-JSON frames
        }
        if (msg.type === "Turn") {
          const turn = msg as AssemblyAITurnMessage;
          if (turn.transcript) {
            // Always fire the lightweight interim/final callback for UI
            this.onResult?.(turn.transcript, !!turn.end_of_turn);
            // Fire the rich callback only on finalized turns (for analysis pipeline)
            if (turn.end_of_turn && this.onFinalTurn) {
              this.onFinalTurn({
                text: turn.transcript,
                language: turn.language_code,
                speaker: turn.speaker_label,
                timestamp: Date.now(),
              });
            }
          }
        } else if (msg.type === "Termination") {
          this.terminated = true;
        }
      };

      ws.onerror = (err) => {
        console.error("[assemblyai-stream] WebSocket error:", err);
      };

      ws.onclose = (event) => {
        // 1008 unauthorized, 3007 chunk size, 3008 expired, etc. — see AssemblyAI docs
        if (!this.terminated && event.code !== 1000) {
          console.warn(
            `[assemblyai-stream] WebSocket closed unexpectedly (${event.code}): ${event.reason}`,
          );
        }
        this.cleanupAudio();
        this.ws = null;
      };
    } finally {
      this.starting = false;
    }
  }

  /** Stop the session gracefully. Sends Terminate, closes WS, releases mic. */
  stop(): void {
    if (this.ws) {
      try {
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ type: "Terminate" }));
        }
        this.ws.close(1000, "client stop");
      } catch {
        // ignored
      }
    }
    this.cleanupAudio();
    this.onResult = null;
    this.onFinalTurn = null;
  }

  /** Internal: tear down and re-open with current settings (used on language change). */
  private async restart(): Promise<void> {
    const cb = this.onResult;
    const finalCb = this.onFinalTurn;
    const lang = this.currentLanguage;
    const kt = this.currentKeyterms.slice();
    this.stop();
    if (cb) {
      // small delay to let the WS close
      await new Promise((r) => setTimeout(r, 80));
      await this.start(cb, {
        language: lang,
        keyterms: kt,
        onFinalTurn: finalCb ?? undefined,
      });
    }
  }

  /** Capture audio → AudioWorklet → PCM16 16kHz mono → ws.send(binary).
   *  Uses caller-provided MediaStream when available (mic + system audio combined),
   *  otherwise falls back to a fresh getUserMedia for mic-only capture. */
  private async startMicPump(): Promise<void> {
    if (!this.mediaStream) {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      });
      this.mediaStream = stream;
      this.streamOwnedByCaller = false;
    }

    // Create an AudioContext at native rate (usually 44.1k or 48k); we'll downsample to 16k.
    const ctx = new AudioContext({ latencyHint: "interactive" });
    this.audioContext = ctx;
    if (ctx.state === "suspended") await ctx.resume();

    // Inline the AudioWorklet processor as a Blob URL — no static asset needed.
    const workletCode = `
      class AAIPump extends AudioWorkletProcessor {
        constructor(opts) {
          super();
          this.targetRate = opts.processorOptions.targetRate;
          this.chunkSamples = Math.round(this.targetRate * (opts.processorOptions.chunkMs / 1000));
          this.buffer = new Float32Array(0);
        }
        process(inputs) {
          const input = inputs[0];
          if (!input || input.length === 0 || !input[0]) return true;
          const channelData = input[0];

          // Downsample (linear) from sampleRate (global) to targetRate
          const ratio = sampleRate / this.targetRate;
          const downsampledLen = Math.floor(channelData.length / ratio);
          const downsampled = new Float32Array(downsampledLen);
          for (let i = 0; i < downsampledLen; i++) {
            const srcIdx = i * ratio;
            const i0 = Math.floor(srcIdx);
            const i1 = Math.min(i0 + 1, channelData.length - 1);
            const frac = srcIdx - i0;
            downsampled[i] = channelData[i0] * (1 - frac) + channelData[i1] * frac;
          }

          // Append to ring buffer
          const merged = new Float32Array(this.buffer.length + downsampled.length);
          merged.set(this.buffer, 0);
          merged.set(downsampled, this.buffer.length);
          this.buffer = merged;

          // Emit chunks of chunkSamples
          while (this.buffer.length >= this.chunkSamples) {
            const chunk = this.buffer.slice(0, this.chunkSamples);
            this.buffer = this.buffer.slice(this.chunkSamples);

            // Float32 [-1,1] → Int16 little-endian
            const pcm16 = new Int16Array(chunk.length);
            for (let i = 0; i < chunk.length; i++) {
              const s = Math.max(-1, Math.min(1, chunk[i]));
              pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
            }
            this.port.postMessage(pcm16.buffer, [pcm16.buffer]);
          }
          return true;
        }
      }
      registerProcessor("aai-pump", AAIPump);
    `;
    const blobUrl = URL.createObjectURL(
      new Blob([workletCode], { type: "application/javascript" }),
    );
    try {
      await ctx.audioWorklet.addModule(blobUrl);
    } finally {
      URL.revokeObjectURL(blobUrl);
    }

    const source = ctx.createMediaStreamSource(this.mediaStream);
    const node = new AudioWorkletNode(ctx, "aai-pump", {
      processorOptions: { targetRate: SAMPLE_RATE, chunkMs: CHUNK_MS },
    });
    node.port.onmessage = (e) => {
      const ws = this.ws;
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      ws.send(e.data as ArrayBuffer);
    };
    source.connect(node);
    // Connecting the worklet to destination ensures it runs (some browsers cull silent nodes).
    // Use a muted gain so the user doesn't hear themselves.
    const muted = ctx.createGain();
    muted.gain.value = 0;
    node.connect(muted).connect(ctx.destination);

    this.sourceNode = source;
    this.workletNode = node;
  }

  private cleanupAudio(): void {
    try { this.workletNode?.disconnect(); } catch { /* ignored */ }
    try { this.sourceNode?.disconnect(); } catch { /* ignored */ }
    // Only stop tracks we created ourselves — don't kill caller-owned streams
    if (!this.streamOwnedByCaller) {
      try { this.mediaStream?.getTracks().forEach((t) => t.stop()); } catch { /* ignored */ }
    }
    try { this.audioContext?.close(); } catch { /* ignored */ }
    this.workletNode = null;
    this.sourceNode = null;
    this.mediaStream = null;
    this.audioContext = null;
    this.streamOwnedByCaller = false;
  }
}

/* --------------------------------------------------------------- */
/*  Helpers                                                         */
/* --------------------------------------------------------------- */

function normalizeLang(lang: string): LangCode {
  const l = lang.toLowerCase().trim();
  if (l === "auto") return "auto";
  // Accept locale strings ("fr-FR" → "fr")
  const short = l.slice(0, 2);
  if (
    short === "en" || short === "fr" || short === "es" || short === "de" ||
    short === "it" || short === "pt" || short === "nl" || short === "zh" ||
    short === "ja" || short === "ko"
  ) {
    return short as LangCode;
  }
  // Unknown — fall back to auto-detect
  return "auto";
}

const LANG_NAME: Record<Exclude<LangCode, "auto">, string> = {
  en: "English",
  fr: "French",
  es: "Spanish",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  nl: "Dutch",
  zh: "Chinese",
  ja: "Japanese",
  ko: "Korean",
};

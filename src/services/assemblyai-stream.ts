/**
 * AssemblyAIStreamingService
 *
 * Browser-side wrapper around AssemblyAI's Universal Streaming v3 WebSocket
 * for live transcription.
 *
 * Architecture:
 *   1. Server mints a single-use temp token via /api/transcribe-token
 *   2. Browser opens WebSocket to wss://streaming.assemblyai.com/v3/ws?token=...
 *   3. `start()` resolves only once AssemblyAI sends `Begin` (rejects on Error,
 *      close or timeout) so callers can fall back when streaming is unavailable
 *   4. Audio is captured via AudioWorklet, downsampled to 16kHz mono PCM16 and
 *      sent as binary frames
 *   5. AssemblyAI sends Turn events; each finalized turn fires `onFinalTurn` once
 *   6. Unexpected disconnects reconnect automatically with a fresh token
 *   7. On stop, we send {"type":"Terminate"} (billing is per open session)
 *
 * Model choice (probed 2026-10-04):
 *   - en/es/fr/de/it/pt/auto → universal-streaming-multilingual + language_detection
 *     ($0.15/h). Do NOT send `prompt`: this model rejects it with error 3006.
 *   - nl/zh/ja/ko → universal-3-5-pro + language_code ($0.45/h), the only
 *     streaming model that covers them.
 *   - Diarization param is `speaker_labels` (`speaker_diarization` is silently ignored).
 */

import { authFetch } from "@/lib/api-client";

const WS_URL = "wss://streaming.assemblyai.com/v3/ws";
const SAMPLE_RATE = 16_000;
const CHUNK_MS = 100; // 50–1000 ms required by AssemblyAI
const WORKLET_URL = "/worklets/aai-pump.js";
const HANDSHAKE_TIMEOUT_MS = 6_000;
const RECONNECT_DELAYS_MS = [500, 1_000, 2_000, 4_000, 4_000];

export type LangCode =
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

/** Languages covered by the cheaper universal-streaming-multilingual model. */
const MULTILINGUAL_LANGS: ReadonlySet<LangCode> = new Set(["auto", "en", "fr", "es", "de", "it", "pt"]);

export type StreamStatus = "connecting" | "live" | "reconnecting" | "failed" | "stopped";

/** Which side of the call a stream carries (dual-stream meeting mode). */
export type StreamLabel = "me" | "them";

type TurnCallback = (text: string, isFinal: boolean) => void;

/** Rich payload for finalized turns — sent to Claude for analysis. */
export interface FinalTurnEvent {
  /** Cleaned, formatted, punctuated transcript text. */
  text: string;
  /** Detected language code (ISO 639-1) — present when language_detection is on. */
  language?: string;
  /** "me" / "them" in dual-stream mode, else the diarization label ("A", "B"). */
  speaker?: string;
  /** Timestamp (ms since epoch) the turn was finalized. */
  timestamp: number;
}

type FinalTurnCallback = (event: FinalTurnEvent) => void;

export interface StartOptions {
  /** Audio language; `"auto"` triggers AssemblyAI's `language_detection`. */
  language?: string;
  /** Domain-specific terms to bias the model (max 100 entries, ≤50 chars each). */
  keyterms?: string[];
  /** Fired once per finalized turn — drives the analysis pipeline. */
  onFinalTurn?: FinalTurnCallback;
  /** Connection lifecycle, for the session status pill. */
  onStatus?: (status: StreamStatus) => void;
  /**
   * Pre-existing MediaStream to consume audio from (e.g. mic+system audio mixed,
   * or one side of the call). Its tracks are never stopped by this service.
   * If omitted, falls back to a fresh `getUserMedia({ audio: true })`.
   */
  audioStream?: MediaStream;
  /** Tag every final turn with this side of the call; disables diarization. */
  label?: StreamLabel;
}

interface AssemblyAITurnMessage {
  type: "Turn";
  transcript: string;
  end_of_turn: boolean;
  turn_is_formatted?: boolean;
  turn_order?: number;
  speaker_label?: string;
  language_code?: string;
}

/** Build the WebSocket query params for a session. Exported for tests. */
export function buildStreamingParams(
  lang: LangCode,
  keyterms: string[],
  opts: { speakerLabels: boolean },
): Record<string, string> {
  const params: Record<string, string> = { sample_rate: String(SAMPLE_RATE) };
  if (MULTILINGUAL_LANGS.has(lang)) {
    params.speech_model = "universal-streaming-multilingual";
    params.format_turns = "true";
    params.language_detection = "true";
  } else {
    params.speech_model = "universal-3-5-pro";
    params.language_code = lang;
  }
  if (opts.speakerLabels) {
    params.speaker_labels = "true";
  }
  if (keyterms.length > 0) {
    params.keyterms_prompt = JSON.stringify(keyterms.slice(0, 100));
  }
  return params;
}

/** Map a UI / i18n code to a supported streaming language. Exported for tests. */
export function normalizeLang(lang: string | undefined | null): LangCode {
  const l = (lang ?? "auto").toLowerCase().trim();
  if (l === "auto") return "auto";
  const short = l.slice(0, 2);
  const known: LangCode[] = ["en", "fr", "es", "de", "it", "pt", "nl", "zh", "ja", "ko"];
  return (known as string[]).includes(short) ? (short as LangCode) : "auto";
}

/** AssemblyAI emits placeholder labels before diarization settles. */
export function normalizeSpeakerLabel(label: string | undefined): string | undefined {
  if (!label) return undefined;
  const upper = label.toUpperCase();
  if (upper === "PENDING" || upper === "UNKNOWN") return undefined;
  return label;
}

/**
 * Should this Turn message fire `onFinalTurn`? Only formatted end-of-turn
 * messages with a non-empty transcript and a turn_order we haven't emitted.
 * Exported for tests.
 */
export function isNewFinalTurn(msg: AssemblyAITurnMessage, lastEmittedOrder: number): boolean {
  if (!msg.end_of_turn || !msg.turn_is_formatted) return false;
  if (!msg.transcript || !msg.transcript.trim()) return false;
  if (typeof msg.turn_order === "number" && msg.turn_order <= lastEmittedOrder) return false;
  return true;
}

export class AssemblyAIStreamingService {
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private ownsStream = false;
  private workletNode: AudioWorkletNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private onResult: TurnCallback | null = null;
  private onFinalTurn: FinalTurnCallback | null = null;
  private onStatus: ((status: StreamStatus) => void) | null = null;
  private currentLanguage: LangCode = "auto";
  private currentKeyterms: string[] = [];
  private label: StreamLabel | undefined;
  private callerStream: MediaStream | null = null;
  private active = false;
  private stopped = true;
  private lastEmittedOrder = -1;
  private lastServerError = "";
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private status: StreamStatus = "stopped";

  /** Requires WebSocket + AudioContext + getUserMedia. */
  get supported(): boolean {
    if (typeof window === "undefined") return false;
    return (
      typeof WebSocket !== "undefined" &&
      typeof AudioContext !== "undefined" &&
      !!navigator.mediaDevices?.getUserMedia
    );
  }

  get currentStatus(): StreamStatus {
    return this.status;
  }

  /** Set the spoken-audio language. Reconnects if a session is running. */
  setLanguage(lang: string): void {
    const next = normalizeLang(lang);
    if (next === this.currentLanguage) return;
    this.currentLanguage = next;
    if (this.active && !this.stopped) {
      this.dropSocket();
      this.reconnectAttempts = 0;
      this.scheduleReconnect(0);
    }
  }

  /**
   * Start a streaming session. Resolves once AssemblyAI has accepted the
   * session (`Begin`). Rejects if the token, handshake or audio pump fails —
   * callers should then fall back to batch transcription.
   *
   * `onResult(text, isFinal)` fires for partial turns (isFinal=false) and once
   * per finalized turn (isFinal=true).
   */
  async start(onResult: TurnCallback, opts: StartOptions = {}): Promise<void> {
    if (this.active) return;
    this.active = true;
    this.stopped = false;
    this.onResult = onResult;
    this.onFinalTurn = opts.onFinalTurn ?? null;
    this.onStatus = opts.onStatus ?? null;
    this.currentLanguage = normalizeLang(opts.language);
    this.currentKeyterms = (opts.keyterms ?? []).slice(0, 100);
    this.label = opts.label;
    this.callerStream = opts.audioStream ?? null;
    this.reconnectAttempts = 0;

    this.setStatus("connecting");
    try {
      await this.connect();
      await this.ensureAudioPump();
    } catch (err) {
      this.teardown();
      this.setStatus("failed");
      throw err;
    }
  }

  /** Stop the session gracefully. Sends Terminate, closes WS, releases audio. */
  stop(): void {
    if (!this.active && this.stopped) return;
    this.stopped = true;
    this.teardown();
    this.setStatus("stopped");
    this.onResult = null;
    this.onFinalTurn = null;
    this.onStatus = null;
  }

  /* ------------------------------------------------------------------ */
  /*  Connection                                                         */
  /* ------------------------------------------------------------------ */

  /** Mint a token, open the socket and wait for `Begin`. */
  private async connect(): Promise<void> {
    const tokenRes = await authFetch("/api/transcribe-token", { method: "POST" });
    if (!tokenRes.ok) {
      throw new Error(`Token mint failed: ${tokenRes.status}`);
    }
    const { token } = (await tokenRes.json()) as { token?: string };
    if (!token) throw new Error("Token mint returned no token");
    if (this.stopped) throw new Error("Stream stopped during connect");

    const url = new URL(WS_URL);
    url.searchParams.set("token", token);
    const params = buildStreamingParams(this.currentLanguage, this.currentKeyterms, {
      speakerLabels: !this.label,
    });
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

    const ws = new WebSocket(url.toString());
    ws.binaryType = "arraybuffer";
    this.ws = ws;
    this.lastEmittedOrder = -1;
    this.lastServerError = "";

    await new Promise<void>((resolve, reject) => {
      let settled = false;
      const timer = setTimeout(() => fail(new Error("AssemblyAI handshake timeout")), HANDSHAKE_TIMEOUT_MS);
      const succeed = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve();
      };
      const fail = (err: Error) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        if (this.ws === ws) this.ws = null;
        try { ws.close(); } catch { /* ignored */ }
        reject(err);
      };

      ws.onmessage = (event) => {
        if (ws !== this.ws) return; // stale socket
        const msg = parseMessage(event.data);
        if (!msg) return;
        if (msg.type === "Begin") {
          succeed();
        } else if (msg.type === "Error") {
          const code = (msg as { error_code?: unknown }).error_code;
          const text = (msg as { error?: unknown }).error;
          this.lastServerError = `${String(code ?? "")} ${String(text ?? "")}`.trim();
          fail(new Error(`AssemblyAI error ${this.lastServerError}`));
        } else if (msg.type === "Turn") {
          this.handleTurn(msg as unknown as AssemblyAITurnMessage);
        }
      };

      ws.onclose = (event) => {
        if (!settled) {
          fail(new Error(`AssemblyAI closed (${event.code}) ${event.reason || this.lastServerError}`.trim()));
          return;
        }
        this.handleClose(ws, event);
      };

      ws.onerror = () => {
        // A close event always follows; handled there.
      };
    });

    this.reconnectAttempts = 0;
    this.setStatus("live");
  }

  private handleTurn(turn: AssemblyAITurnMessage): void {
    const text = turn.transcript;
    if (!text) return;
    if (!turn.end_of_turn) {
      this.onResult?.(text, false);
      return;
    }
    if (!isNewFinalTurn(turn, this.lastEmittedOrder)) return;
    if (typeof turn.turn_order === "number") this.lastEmittedOrder = turn.turn_order;
    this.onResult?.(text, true);
    this.onFinalTurn?.({
      text,
      language: turn.language_code || undefined,
      speaker: this.label ?? normalizeSpeakerLabel(turn.speaker_label),
      timestamp: Date.now(),
    });
  }

  private handleClose(ws: WebSocket, event: CloseEvent): void {
    if (ws !== this.ws) return; // a newer socket already replaced this one
    this.ws = null;
    if (this.stopped) return;
    console.warn(
      `[assemblyai-stream] socket closed (${event.code}) ${event.reason || this.lastServerError}; reconnecting`,
    );
    this.scheduleReconnect();
  }

  private scheduleReconnect(delayOverride?: number): void {
    if (this.stopped) return;
    if (this.reconnectTimer) return;
    if (this.reconnectAttempts >= RECONNECT_DELAYS_MS.length) {
      console.error("[assemblyai-stream] reconnect attempts exhausted");
      this.teardown();
      this.active = false;
      this.setStatus("failed");
      return;
    }
    const delay = delayOverride ?? RECONNECT_DELAYS_MS[this.reconnectAttempts];
    this.reconnectAttempts += 1;
    this.setStatus("reconnecting");
    this.reconnectTimer = setTimeout(async () => {
      this.reconnectTimer = null;
      if (this.stopped) return;
      try {
        await this.connect();
      } catch (err) {
        console.warn("[assemblyai-stream] reconnect failed:", err instanceof Error ? err.message : err);
        this.scheduleReconnect();
      }
    }, delay);
  }

  /** Close the current socket without triggering a reconnect from its close event. */
  private dropSocket(): void {
    const ws = this.ws;
    this.ws = null;
    if (!ws) return;
    try {
      if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: "Terminate" }));
      ws.close(1000, "client stop");
    } catch {
      // ignored
    }
  }

  private teardown(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.dropSocket();
    this.cleanupAudio();
    this.active = false;
  }

  private setStatus(status: StreamStatus): void {
    if (this.status === status) return;
    this.status = status;
    this.onStatus?.(status);
  }

  /* ------------------------------------------------------------------ */
  /*  Audio pump                                                         */
  /* ------------------------------------------------------------------ */

  /** Capture audio → AudioWorklet → PCM16 16kHz mono → ws.send(binary).
   *  Built once per session and kept across reconnects: frames go to whatever
   *  socket is current. Uses the caller's MediaStream when provided. */
  private async ensureAudioPump(): Promise<void> {
    if (this.workletNode) return;

    if (this.callerStream) {
      this.mediaStream = this.callerStream;
      this.ownsStream = false;
    } else {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      });
      this.ownsStream = true;
    }

    const ctx = new AudioContext({ latencyHint: "interactive" });
    this.audioContext = ctx;
    if (ctx.state === "suspended") await ctx.resume();

    // Static module (public/worklets/aai-pump.js): the CSP script-src allows
    // 'self' but not blob: URLs, and worklets are governed by script-src.
    await ctx.audioWorklet.addModule(WORKLET_URL);

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
    // Only stop tracks we created ourselves — never kill caller-owned streams
    if (this.ownsStream) {
      try { this.mediaStream?.getTracks().forEach((t) => t.stop()); } catch { /* ignored */ }
    }
    try { void this.audioContext?.close(); } catch { /* ignored */ }
    this.workletNode = null;
    this.sourceNode = null;
    this.mediaStream = null;
    this.audioContext = null;
    this.ownsStream = false;
  }
}

/* --------------------------------------------------------------- */
/*  Helpers                                                         */
/* --------------------------------------------------------------- */

function parseMessage(data: unknown): ({ type: string } & Record<string, unknown>) | null {
  if (typeof data !== "string") return null;
  try {
    const msg = JSON.parse(data) as unknown;
    if (msg && typeof msg === "object" && typeof (msg as { type?: unknown }).type === "string") {
      return msg as { type: string } & Record<string, unknown>;
    }
  } catch {
    // ignore non-JSON frames
  }
  return null;
}

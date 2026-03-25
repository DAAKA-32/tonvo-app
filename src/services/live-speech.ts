/**
 * LiveSpeechService — Browser-native Web Speech API for instant interim transcription.
 *
 * Provides zero-latency live captions while Whisper processes audio in the background.
 * Falls back gracefully on unsupported browsers (Firefox, Safari <17).
 */

// Web Speech API types (not all TS configs include these)
interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  [index: number]: { transcript: string; confidence: number };
}
interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
}
interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  start(): void;
  stop(): void;
}
interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

type InterimCallback = (text: string, isFinal: boolean) => void;

export class LiveSpeechService {
  private recognition: SpeechRecognitionInstance | null = null;
  private onResult: InterimCallback | null = null;
  private running = false;
  private restartTimer: ReturnType<typeof setTimeout> | null = null;
  private _supported = false;

  /** Whether the browser supports Web Speech API. */
  get supported(): boolean {
    return this._supported;
  }

  constructor() {
    const SpeechRecognitionCtor =
      (globalThis as unknown as { SpeechRecognition?: SpeechRecognitionConstructor }).SpeechRecognition ??
      (globalThis as unknown as { webkitSpeechRecognition?: SpeechRecognitionConstructor }).webkitSpeechRecognition;
    this._supported = !!SpeechRecognitionCtor;
    if (!SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (!this.onResult) return;
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }
      if (final) this.onResult(final.trim(), true);
      if (interim) this.onResult(interim.trim(), false);
    };

    // Auto-restart on end (browser stops after silence)
    recognition.onend = () => {
      if (this.running) {
        this.restartTimer = setTimeout(() => {
          try { this.recognition?.start(); } catch { /* already started */ }
        }, 100);
      }
    };

    recognition.onerror = (event) => {
      // "no-speech" and "aborted" are normal — just restart
      if (event.error === "no-speech" || event.error === "aborted") return;
      console.warn("SpeechRecognition error:", event.error);
    };

    this.recognition = recognition;
  }

  /** Set the recognition language (e.g., "en-US", "fr-FR"). */
  setLanguage(lang: string): void {
    if (this.recognition) {
      // Map short codes to full BCP-47 for better accuracy
      const langMap: Record<string, string> = {
        en: "en-US", fr: "fr-FR", es: "es-ES", de: "de-DE",
        pt: "pt-BR", it: "it-IT", nl: "nl-NL", pl: "pl-PL",
        ja: "ja-JP", ko: "ko-KR", zh: "zh-CN", ar: "ar-SA",
      };
      this.recognition.lang = langMap[lang] || lang;
    }
  }

  /** Start listening. Calls onResult with (text, isFinal) for each speech segment. */
  start(onResult: InterimCallback): void {
    if (!this.recognition) return;
    this.onResult = onResult;
    this.running = true;
    try {
      this.recognition.start();
    } catch {
      // Already started — ignore
    }
  }

  /** Stop listening. */
  stop(): void {
    this.running = false;
    if (this.restartTimer) {
      clearTimeout(this.restartTimer);
      this.restartTimer = null;
    }
    try {
      this.recognition?.stop();
    } catch {
      // Already stopped
    }
    this.onResult = null;
  }
}

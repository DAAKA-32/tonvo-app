export interface CaptureOptions {
  /** Enable screen capture (video for visual analysis). */
  screenEnabled: boolean;
  /** Enable audio capture (mic + optionally system audio for transcription). */
  audioEnabled: boolean;
  /** Capture system audio from other apps (Discord, Zoom, etc.) */
  systemAudioEnabled?: boolean;
}

export class AudioCaptureService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private displayStream: MediaStream | null = null;
  private onChunkReady: ((blob: Blob) => void) | null = null;
  private sending = false;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private _hasAudio = false;
  private _hasVideo = false;
  private _audioEnabled = false;
  private canvasRef: HTMLCanvasElement | null = null;
  private videoRef: HTMLVideoElement | null = null;
  private audioContext: AudioContext | null = null;
  private analyserNode: AnalyserNode | null = null;
  private _currentAudioLevel = 0; // 0-1 normalized audio energy
  private _hasSystemAudio = false;

  /** Whether audio capture is active AND producing audio data. */
  get hasAudio(): boolean {
    return this._hasAudio && this._audioEnabled;
  }

  /** Whether the current capture includes screen video for visual analysis. */
  get hasVideo(): boolean {
    return this._hasVideo;
  }

  /** Whether audio was explicitly enabled by the user. */
  get audioEnabled(): boolean {
    return this._audioEnabled;
  }

  /** Whether system audio (from other apps) is being captured. */
  get hasSystemAudio(): boolean {
    return this._hasSystemAudio;
  }

  /** Current audio energy level (0-1). Use to detect true silence vs Whisper noise. */
  get audioLevel(): number {
    if (!this.analyserNode) return 0;
    const data = new Uint8Array(this.analyserNode.fftSize);
    this.analyserNode.getByteTimeDomainData(data);
    // Calculate RMS
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      const val = (data[i] - 128) / 128;
      sum += val * val;
    }
    this._currentAudioLevel = Math.sqrt(sum / data.length);
    return this._currentAudioLevel;
  }

  async start(onChunkReady: (blob: Blob) => void, options: CaptureOptions): Promise<void> {
    this.onChunkReady = onChunkReady;
    const { screenEnabled, audioEnabled, systemAudioEnabled = true } = options;
    this._audioEnabled = audioEnabled;

    if (screenEnabled) {
      // Request screen capture with system audio support.
      // systemAudio: "include" tells Chrome to capture audio from ALL apps (Discord, Zoom, etc.)
      // even when sharing a window or entire screen. Supported in Chrome 105+.
      // Falls back gracefully on browsers that don't support it.
      let displayStream: MediaStream;
      try {
        const displayMediaOptions: DisplayMediaStreamOptions & Record<string, unknown> = {
          video: true,
          audio: audioEnabled ? {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
          } : false,
        };

        // Request system-level audio (all apps) when enabled
        if (audioEnabled && systemAudioEnabled) {
          displayMediaOptions.systemAudio = "include";
          // preferCurrentTab: false ensures user can pick any screen/window
          displayMediaOptions.preferCurrentTab = false;
          // Exclude Tonvo tab from the screen-share picker (Chrome 107+, ignored elsewhere)
          displayMediaOptions.selfBrowserSurface = "exclude";
        }

        displayStream = await navigator.mediaDevices.getDisplayMedia(
          displayMediaOptions as DisplayMediaStreamOptions
        );
      } catch (err) {
        if (err instanceof DOMException && err.name === "NotAllowedError") {
          throw new Error("PERMISSION_DENIED:screen");
        }
        throw err;
      }

      this.displayStream = displayStream;
      this._hasVideo = displayStream.getVideoTracks().length > 0;

      // Set up hidden video element for frame capture
      if (this._hasVideo) {
        this.videoRef = document.createElement("video");
        this.videoRef.srcObject = displayStream;
        this.videoRef.muted = true;
        this.videoRef.play();
        this.canvasRef = document.createElement("canvas");
      }

      // Only set up audio if user explicitly enabled it
      if (audioEnabled) {
        let micStream: MediaStream | null = null;
        try {
          micStream = await navigator.mediaDevices.getUserMedia({
            audio: { echoCancellation: true, noiseSuppression: true },
          });
        } catch {
          // Mic not available
        }

        const screenAudioTracks = displayStream.getAudioTracks();
        const hasScreenAudio = screenAudioTracks.length > 0;
        this._hasSystemAudio = hasScreenAudio;
        const hasMic = micStream !== null;
        this._hasAudio = hasScreenAudio || hasMic;

        if (this._hasAudio) {
          const audioContext = new AudioContext();
          this.audioContext = audioContext;
          const destination = audioContext.createMediaStreamDestination();

          // Create analyser for energy detection
          this.analyserNode = audioContext.createAnalyser();
          this.analyserNode.fftSize = 256;

          if (hasScreenAudio) {
            const screenSource = audioContext.createMediaStreamSource(
              new MediaStream(screenAudioTracks)
            );
            screenSource.connect(destination);
            screenSource.connect(this.analyserNode!);
          }

          if (hasMic) {
            const micSource = audioContext.createMediaStreamSource(micStream!);
            micSource.connect(destination);
            micSource.connect(this.analyserNode!);
          }

          this.stream = destination.stream;
        }
      } else {
        // Audio disabled: explicitly do NOT capture any audio
        // Stop any audio tracks that the browser may have included
        displayStream.getAudioTracks().forEach((track) => track.stop());
        this._hasAudio = false;
      }

      // Listen for screen share ending
      displayStream.getVideoTracks().forEach((track) => {
        track.onended = () => this.stop();
      });

    } else if (audioEnabled) {
      // Audio-only mode (no screen)
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
        });
        this._hasAudio = true;
      } catch (err) {
        if (err instanceof DOMException && err.name === "NotAllowedError") {
          throw new Error("PERMISSION_DENIED:microphone");
        }
        throw err;
      }
    }

    // Only start MediaRecorder if audio is enabled AND we have an audio stream
    if (!audioEnabled || !this.stream) return;

    const mimeType = this.getSupportedMimeType();
    this.mediaRecorder = new MediaRecorder(this.stream, { mimeType });

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    // Record in 10-second chunks to give Whisper more context per call
    // (reduces fragmentation: fewer cuts mid-sentence)
    this.mediaRecorder.start(10000);

    this.intervalId = setInterval(() => {
      if (this.audioChunks.length > 0 && !this.sending) {
        this.sendChunks();
      }
    }, 10500);
  }

  /** Stop only the screen capture (video tracks) while keeping audio running. */
  stopScreenCapture(): void {
    if (this.displayStream) {
      // Only stop video tracks, keep audio tracks alive
      this.displayStream.getVideoTracks().forEach((track) => track.stop());
    }
    if (this.videoRef) {
      this.videoRef.srcObject = null;
      this.videoRef = null;
    }
    this.canvasRef = null;
    this._hasVideo = false;
  }

  /** Capture a single frame from the screen share as a JPEG blob. */
  async captureFrame(): Promise<Blob | null> {
    if (!this.videoRef || !this.canvasRef || !this._hasVideo) return null;

    const video = this.videoRef;
    const canvas = this.canvasRef;

    if (video.readyState < 2) return null;

    const scale = Math.min(1, 1280 / video.videoWidth);
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob),
        "image/jpeg",
        0.7
      );
    });
  }

  private sendChunks() {
    if (this.audioChunks.length === 0 || !this.onChunkReady || this.sending) return;
    this.sending = true;

    // Use the actual MIME type from MediaRecorder (e.g. "audio/webm;codecs=opus")
    const actualMime = this.mediaRecorder?.mimeType || "audio/webm";
    const blob = new Blob(this.audioChunks, { type: actualMime });
    this.audioChunks = [];
    this.onChunkReady(blob);

    this.sending = false;
  }

  stop(): Blob | null {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop();
    }

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.displayStream) {
      this.displayStream.getTracks().forEach((track) => track.stop());
      this.displayStream = null;
    }

    if (this.videoRef) {
      this.videoRef.srcObject = null;
      this.videoRef = null;
    }
    this.canvasRef = null;
    this._hasVideo = false;

    this.mediaRecorder = null;
    if (this.audioContext) {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
    this.analyserNode = null;

    if (this.audioChunks.length > 0) {
      const blob = new Blob(this.audioChunks, { type: "audio/webm" });
      this.audioChunks = [];
      return blob;
    }

    return null;
  }

  private getSupportedMimeType(): string {
    const types = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus"];
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) return type;
    }
    return "audio/webm";
  }
}

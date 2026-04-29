"use client";

export interface FpsSample {
  fps: number;
  rolling: number;
}

type Listener = (sample: FpsSample) => void;

export class FpsMonitor {
  private rafId: number | null = null;
  private last = 0;
  private frames = 0;
  private rolling = 60;
  private current = 60;
  private listeners = new Set<Listener>();
  private alpha = 0.15;

  start() {
    if (this.rafId != null) return;
    if (typeof window === "undefined") return;
    this.last = performance.now();
    this.frames = 0;
    const tick = (now: number) => {
      this.frames += 1;
      const dt = now - this.last;
      if (dt >= 500) {
        this.current = (this.frames * 1000) / dt;
        this.rolling = this.rolling * (1 - this.alpha) + this.current * this.alpha;
        this.frames = 0;
        this.last = now;
        const sample = { fps: this.current, rolling: this.rolling };
        this.listeners.forEach((l) => l(sample));
      }
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  stop() {
    if (this.rafId != null && typeof window !== "undefined") {
      cancelAnimationFrame(this.rafId);
    }
    this.rafId = null;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  get rollingFps() {
    return this.rolling;
  }
}

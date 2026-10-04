/**
 * Echo filter for dual-stream meetings.
 *
 * When the user is on speakers instead of a headset, their mic also picks up
 * the other side of the call, so the "me" stream transcribes the prospect a
 * second time. A "me" turn whose words largely overlap a recent "them" turn is
 * treated as echo and dropped.
 */

const WINDOW_MS = 8_000;
const THRESHOLD = 0.6;

function tokens(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .split(/[^\p{L}\p{N}]+/u)
      .filter((w) => w.length > 1),
  );
}

/** Jaccard similarity of the two texts' word sets (0..1). */
export function jaccard(a: string, b: string): number {
  const ta = tokens(a);
  const tb = tokens(b);
  if (ta.size === 0 || tb.size === 0) return 0;
  let inter = 0;
  for (const w of ta) if (tb.has(w)) inter += 1;
  return inter / (ta.size + tb.size - inter);
}

export class EchoFilter {
  private them: Array<{ text: string; at: number }> = [];

  constructor(
    private readonly windowMs = WINDOW_MS,
    private readonly threshold = THRESHOLD,
  ) {}

  /** Record a turn heard on the shared-tab ("them") stream. */
  addThem(text: string, at: number): void {
    this.them.push({ text, at });
    this.prune(at);
  }

  /** True when a "me" turn is most likely the prospect's voice leaking into the mic. */
  isEcho(text: string, at: number): boolean {
    this.prune(at);
    return this.them.some((t) => Math.abs(at - t.at) <= this.windowMs && jaccard(text, t.text) >= this.threshold);
  }

  reset(): void {
    this.them = [];
  }

  private prune(now: number): void {
    this.them = this.them.filter((t) => now - t.at <= this.windowMs);
  }
}

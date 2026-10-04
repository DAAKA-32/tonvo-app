/**
 * CopilotAnalysisQueue — drives /api/analyze during a live session.
 *
 * - One request in flight at a time. Turns that arrive meanwhile are merged
 *   into the next request, so results never land out of order and bursts of
 *   short turns don't trip the rate limit.
 * - In dual-stream meetings (speaker "me" / "them"), every "them" turn triggers
 *   an analysis; "me" turns only do when the copilot has been quiet for a while,
 *   otherwise they ride along as context with the next request.
 * - 5xx / network / timeout → one quick retry, then the batch counts as a
 *   failure (the transcript is kept by the caller either way).
 * - 429 → the batch is re-queued and retried after a short pause.
 */

export interface CopilotTurn {
  id: string;
  text: string;
  /** "me" / "them" in dual-stream mode, else a diarization label or undefined. */
  speaker?: string;
  language?: string;
  timestamp: number;
}

export type AnalyzeOutcome<A> =
  | { ok: true; analysis: A }
  | { ok: false; status: number | "network" | "timeout" };

export interface CopilotQueueOptions<A> {
  /** Perform the request for this batch (oldest first). Must not throw. */
  analyze: (batch: CopilotTurn[]) => Promise<AnalyzeOutcome<A>>;
  onAnalysis: (batch: CopilotTurn[], analysis: A) => void;
  /** Called after each failed batch with the running count of consecutive failures. */
  onFailure?: (consecutiveFailures: number, batch: CopilotTurn[]) => void;
  /** Called after a successful batch when failures had been reported. */
  onRecovered?: () => void;
  onBusyChange?: (busy: boolean) => void;
  /** Minimum quiet time before a "me" turn triggers on its own. */
  meMinIntervalMs?: number;
  retryDelayMs?: number;
  rateLimitDelayMs?: number;
  now?: () => number;
  sleep?: (ms: number) => Promise<void>;
}

const MAX_BATCH_TURNS = 8;

function isRetryable(status: number | "network" | "timeout"): boolean {
  return status === "network" || status === "timeout" || (typeof status === "number" && status >= 500);
}

export class CopilotAnalysisQueue<A> {
  private pending: CopilotTurn[] = [];
  private inflight: Promise<void> | null = null;
  private triggerPending = false;
  private lastAnalysisAt = 0;
  private failures = 0;
  private stopped = false;
  private readonly opts: Required<Omit<CopilotQueueOptions<A>, "onFailure" | "onRecovered" | "onBusyChange">> &
    Pick<CopilotQueueOptions<A>, "onFailure" | "onRecovered" | "onBusyChange">;

  constructor(options: CopilotQueueOptions<A>) {
    this.opts = {
      meMinIntervalMs: 20_000,
      retryDelayMs: 800,
      rateLimitDelayMs: 3_000,
      now: () => Date.now(),
      sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
      ...options,
    };
  }

  get consecutiveFailures(): number {
    return this.failures;
  }

  get busy(): boolean {
    return this.inflight !== null;
  }

  /** Add finalized turns. Triggers an analysis unless they are only quiet-period "me" turns. */
  push(...turns: CopilotTurn[]): void {
    if (this.stopped || turns.length === 0) return;
    this.pending.push(...turns);
    const shouldTrigger = turns.some((t) => this.triggers(t));
    if (shouldTrigger) this.kick();
  }

  /** Force an analysis of whatever is pending (e.g. a "Retry" button). */
  retryNow(): void {
    if (this.stopped || this.pending.length === 0) return;
    this.kick();
  }

  /** Resolve once no request is in flight, or after `timeoutMs`. */
  async waitIdle(timeoutMs: number): Promise<void> {
    const deadline = this.opts.now() + timeoutMs;
    while (this.inflight && this.opts.now() < deadline) {
      await Promise.race([this.inflight, this.opts.sleep(Math.max(0, deadline - this.opts.now()))]);
    }
  }

  stop(): void {
    this.stopped = true;
    this.pending = [];
  }

  private triggers(turn: CopilotTurn): boolean {
    if (turn.speaker !== "me") return true;
    return this.opts.now() - this.lastAnalysisAt >= this.opts.meMinIntervalMs;
  }

  private kick(): void {
    if (this.inflight) {
      this.triggerPending = true;
      return;
    }
    this.inflight = this.drain().finally(() => {
      this.inflight = null;
      this.opts.onBusyChange?.(false);
    });
    this.opts.onBusyChange?.(true);
  }

  private async drain(): Promise<void> {
    do {
      this.triggerPending = false;
      if (this.stopped || this.pending.length === 0) return;
      const batch = this.pending.splice(0, MAX_BATCH_TURNS);
      if (this.pending.length > 0) this.triggerPending = true;

      let outcome = await this.opts.analyze(batch);
      if (!outcome.ok && isRetryable(outcome.status) && !this.stopped) {
        await this.opts.sleep(this.opts.retryDelayMs);
        outcome = await this.opts.analyze(batch);
      }
      if (this.stopped) return;

      if (outcome.ok) {
        this.lastAnalysisAt = this.opts.now();
        const hadFailures = this.failures > 0;
        this.failures = 0;
        this.opts.onAnalysis(batch, outcome.analysis);
        if (hadFailures) this.opts.onRecovered?.();
      } else if (outcome.status === 429) {
        // Rate limited: keep the turns and try again shortly with whatever has accumulated.
        this.pending.unshift(...batch);
        await this.opts.sleep(this.opts.rateLimitDelayMs);
        this.triggerPending = true;
      } else {
        this.failures += 1;
        this.opts.onFailure?.(this.failures, batch);
      }
    } while (this.triggerPending && !this.stopped);
  }
}

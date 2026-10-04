import { describe, it, expect, vi } from "vitest";
import { CopilotAnalysisQueue, type AnalyzeOutcome, type CopilotTurn } from "./copilot-queue";

let seq = 0;
function turn(text: string, speaker?: string): CopilotTurn {
  seq += 1;
  return { id: `t${seq}`, text, speaker, timestamp: seq };
}

function deferred<T>() {
  let resolve!: (v: T) => void;
  const promise = new Promise<T>((r) => { resolve = r; });
  return { promise, resolve };
}

const flush = () => new Promise((r) => setTimeout(r, 0));

describe("CopilotAnalysisQueue", () => {
  it("keeps one request in flight and merges turns that arrive meanwhile", async () => {
    const calls: string[][] = [];
    const gates: Array<ReturnType<typeof deferred<AnalyzeOutcome<string>>>> = [];
    const results: string[] = [];
    const q = new CopilotAnalysisQueue<string>({
      analyze: (batch) => {
        calls.push(batch.map((t) => t.text));
        const d = deferred<AnalyzeOutcome<string>>();
        gates.push(d);
        return d.promise;
      },
      onAnalysis: (_b, a) => results.push(a),
      sleep: async () => {},
    });

    q.push(turn("one"));
    q.push(turn("two"));
    q.push(turn("three"));
    expect(calls).toEqual([["one"]]);

    gates[0].resolve({ ok: true, analysis: "A1" });
    await flush();
    expect(calls).toEqual([["one"], ["two", "three"]]);
    gates[1].resolve({ ok: true, analysis: "A2" });
    await q.waitIdle(1000);
    expect(results).toEqual(["A1", "A2"]);
  });

  it("lets quiet-period 'me' turns ride along instead of triggering", async () => {
    let now = 100_000;
    const calls: string[][] = [];
    const q = new CopilotAnalysisQueue<string>({
      analyze: async (batch) => { calls.push(batch.map((t) => t.text)); return { ok: true, analysis: "x" }; },
      onAnalysis: () => {},
      now: () => now,
      sleep: async () => {},
    });
    q.push(turn("price?", "them"));
    await q.waitIdle(1000);
    now += 5_000;
    q.push(turn("let me explain", "me"));
    await q.waitIdle(1000);
    expect(calls).toEqual([["price?"]]);
    q.push(turn("ok and the timeline?", "them"));
    await q.waitIdle(1000);
    expect(calls).toEqual([["price?"], ["let me explain", "ok and the timeline?"]]);
    now += 25_000;
    q.push(turn("long monologue", "me"));
    await q.waitIdle(1000);
    expect(calls.at(-1)).toEqual(["long monologue"]);
  });

  it("retries a 5xx once, then reports a failure", async () => {
    const analyze = vi.fn(async (): Promise<AnalyzeOutcome<string>> => ({ ok: false, status: 500 }));
    const onFailure = vi.fn();
    const q = new CopilotAnalysisQueue<string>({ analyze, onAnalysis: () => {}, onFailure, sleep: async () => {} });
    q.push(turn("hello"));
    await q.waitIdle(1000);
    expect(analyze).toHaveBeenCalledTimes(2);
    expect(onFailure).toHaveBeenCalledWith(1, expect.any(Array));
    expect(q.consecutiveFailures).toBe(1);
  });

  it("re-queues a rate-limited batch and recovers", async () => {
    const outcomes: AnalyzeOutcome<string>[] = [{ ok: false, status: 429 }, { ok: true, analysis: "ok" }];
    const calls: string[][] = [];
    const onAnalysis = vi.fn();
    const q = new CopilotAnalysisQueue<string>({
      analyze: async (batch) => { calls.push(batch.map((t) => t.text)); return outcomes.shift()!; },
      onAnalysis,
      sleep: async () => {},
    });
    q.push(turn("a"));
    await q.waitIdle(1000);
    expect(calls).toEqual([["a"], ["a"]]);
    expect(onAnalysis).toHaveBeenCalledWith([expect.objectContaining({ text: "a" })], "ok");
  });

  it("calls onRecovered after a success that follows failures", async () => {
    const outcomes: AnalyzeOutcome<string>[] = [{ ok: false, status: 400 }, { ok: true, analysis: "ok" }];
    const onRecovered = vi.fn();
    const q = new CopilotAnalysisQueue<string>({
      analyze: async () => outcomes.shift()!,
      onAnalysis: () => {},
      onRecovered,
      sleep: async () => {},
    });
    q.push(turn("a"));
    await q.waitIdle(1000);
    q.push(turn("b"));
    await q.waitIdle(1000);
    expect(onRecovered).toHaveBeenCalledTimes(1);
    expect(q.consecutiveFailures).toBe(0);
  });
});

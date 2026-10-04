import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const { authFetchMock } = vi.hoisted(() => ({ authFetchMock: vi.fn() }));
vi.mock("@/lib/api-client", () => ({ authFetch: authFetchMock }));

import {
  AssemblyAIStreamingService,
  buildStreamingParams,
  isNewFinalTurn,
  normalizeLang,
  normalizeSpeakerLabel,
  type FinalTurnEvent,
  type StreamStatus,
} from "./assemblyai-stream";

/* ------------------------------------------------------------------ */
/*  Fake WebSocket                                                     */
/* ------------------------------------------------------------------ */

class FakeWebSocket {
  static OPEN = 1;
  static instances: FakeWebSocket[] = [];
  readyState = 1;
  binaryType = "blob";
  sent: unknown[] = [];
  onmessage: ((e: { data: unknown }) => void) | null = null;
  onclose: ((e: { code: number; reason: string }) => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(public url: string) {
    FakeWebSocket.instances.push(this);
  }
  send(data: unknown) {
    this.sent.push(data);
  }
  close() {
    this.readyState = 3;
  }
  emit(msg: object) {
    this.onmessage?.({ data: JSON.stringify(msg) });
  }
  serverClose(code: number, reason = "") {
    this.readyState = 3;
    this.onclose?.({ code, reason });
  }
}

function lastSocket(): FakeWebSocket {
  return FakeWebSocket.instances[FakeWebSocket.instances.length - 1];
}

/* ------------------------------------------------------------------ */
/*  Pure helpers                                                       */
/* ------------------------------------------------------------------ */

describe("buildStreamingParams", () => {
  it("never sends `prompt` and uses language detection on the multilingual model", () => {
    const p = buildStreamingParams("fr", ["Tonvo"], { speakerLabels: true });
    expect(p.prompt).toBeUndefined();
    expect(p.speech_model).toBe("universal-streaming-multilingual");
    expect(p.language_detection).toBe("true");
    expect(p.format_turns).toBe("true");
    expect(p.speaker_labels).toBe("true");
    expect(p.speaker_diarization).toBeUndefined();
    expect(JSON.parse(p.keyterms_prompt)).toEqual(["Tonvo"]);
  });

  it("routes languages outside the multilingual set to universal-3-5-pro", () => {
    const p = buildStreamingParams("ja", [], { speakerLabels: false });
    expect(p.speech_model).toBe("universal-3-5-pro");
    expect(p.language_code).toBe("ja");
    expect(p.speaker_labels).toBeUndefined();
    expect(p.keyterms_prompt).toBeUndefined();
  });
});

describe("helpers", () => {
  it("normalizes languages", () => {
    expect(normalizeLang("fr-FR")).toBe("fr");
    expect(normalizeLang("auto")).toBe("auto");
    expect(normalizeLang("sv")).toBe("auto");
    expect(normalizeLang(undefined)).toBe("auto");
  });

  it("drops placeholder speaker labels", () => {
    expect(normalizeSpeakerLabel("PENDING")).toBeUndefined();
    expect(normalizeSpeakerLabel("UNKNOWN")).toBeUndefined();
    expect(normalizeSpeakerLabel("A")).toBe("A");
  });

  it("emits only formatted, non-empty, unseen final turns", () => {
    const base = { type: "Turn" as const, transcript: "Hello.", end_of_turn: true, turn_is_formatted: true, turn_order: 3 };
    expect(isNewFinalTurn(base, 2)).toBe(true);
    expect(isNewFinalTurn(base, 3)).toBe(false);
    expect(isNewFinalTurn({ ...base, turn_is_formatted: false }, 2)).toBe(false);
    expect(isNewFinalTurn({ ...base, end_of_turn: false }, 2)).toBe(false);
    expect(isNewFinalTurn({ ...base, transcript: "  " }, 2)).toBe(false);
  });
});

/* ------------------------------------------------------------------ */
/*  Session lifecycle                                                  */
/* ------------------------------------------------------------------ */

describe("AssemblyAIStreamingService", () => {
  beforeEach(() => {
    FakeWebSocket.instances = [];
    vi.stubGlobal("WebSocket", FakeWebSocket);
    authFetchMock.mockReset();
    authFetchMock.mockImplementation(async () => new Response(JSON.stringify({ token: "tok" }), { status: 200 }));
    vi.spyOn(AssemblyAIStreamingService.prototype as unknown as { ensureAudioPump: () => Promise<void> }, "ensureAudioPump")
      .mockResolvedValue(undefined);
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  async function startLive(svc: AssemblyAIStreamingService, opts = {}) {
    const p = svc.start(() => {}, opts);
    await vi.waitFor(() => expect(FakeWebSocket.instances.length).toBeGreaterThan(0));
    lastSocket().emit({ type: "Begin", id: "x" });
    await p;
  }

  it("resolves only after Begin", async () => {
    const svc = new AssemblyAIStreamingService();
    const statuses: StreamStatus[] = [];
    await startLive(svc, { onStatus: (s: StreamStatus) => statuses.push(s) });
    expect(statuses).toEqual(["connecting", "live"]);
    expect(lastSocket().url).not.toContain("prompt=");
    expect(lastSocket().url).toContain("speaker_labels=true");
  });

  it("rejects when AssemblyAI sends an Error before Begin", async () => {
    const svc = new AssemblyAIStreamingService();
    const p = svc.start(() => {}, {});
    await vi.waitFor(() => expect(FakeWebSocket.instances.length).toBe(1));
    lastSocket().emit({ type: "Error", error_code: 3006, error: "bad param" });
    await expect(p).rejects.toThrow(/3006/);
  });

  it("rejects when the token mint fails", async () => {
    authFetchMock.mockResolvedValueOnce(new Response("{}", { status: 500 }));
    const svc = new AssemblyAIStreamingService();
    await expect(svc.start(() => {}, {})).rejects.toThrow(/Token mint failed: 500/);
    expect(svc.currentStatus).toBe("failed");
  });

  it("fires each final turn once and tags it with the stream label", async () => {
    const svc = new AssemblyAIStreamingService();
    const turns: FinalTurnEvent[] = [];
    await startLive(svc, { label: "them", onFinalTurn: (t: FinalTurnEvent) => turns.push(t) });
    const ws = lastSocket();
    expect(ws.url).not.toContain("speaker_labels");
    ws.emit({ type: "Turn", transcript: "How much", end_of_turn: false, turn_order: 0 });
    ws.emit({ type: "Turn", transcript: "How much is it?", end_of_turn: true, turn_is_formatted: true, turn_order: 0, language_code: "en" });
    ws.emit({ type: "Turn", transcript: "How much is it?", end_of_turn: true, turn_is_formatted: true, turn_order: 0 });
    expect(turns).toHaveLength(1);
    expect(turns[0]).toMatchObject({ text: "How much is it?", speaker: "them", language: "en" });
  });

  it("reconnects after an unexpected close and ignores the stale socket", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    const svc = new AssemblyAIStreamingService();
    const statuses: StreamStatus[] = [];
    const turns: FinalTurnEvent[] = [];
    await startLive(svc, { onStatus: (s: StreamStatus) => statuses.push(s), onFinalTurn: (t: FinalTurnEvent) => turns.push(t) });
    const first = lastSocket();
    first.serverClose(1011, "network");
    expect(statuses.at(-1)).toBe("reconnecting");
    await vi.advanceTimersByTimeAsync(500);
    await vi.waitFor(() => expect(FakeWebSocket.instances.length).toBe(2));
    const second = lastSocket();
    second.emit({ type: "Begin", id: "y" });
    await vi.waitFor(() => expect(statuses.at(-1)).toBe("live"));
    // A late message on the old socket must be ignored
    first.emit({ type: "Turn", transcript: "ghost", end_of_turn: true, turn_is_formatted: true, turn_order: 9 });
    second.emit({ type: "Turn", transcript: "Real turn.", end_of_turn: true, turn_is_formatted: true, turn_order: 0 });
    expect(turns.map((t) => t.text)).toEqual(["Real turn."]);
  });

  it("reports failed after exhausting reconnects", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    const svc = new AssemblyAIStreamingService();
    const statuses: StreamStatus[] = [];
    await startLive(svc, { onStatus: (s: StreamStatus) => statuses.push(s) });
    authFetchMock.mockImplementation(async () => new Response("{}", { status: 502 }));
    lastSocket().serverClose(1011);
    for (let i = 0; i < 6; i++) await vi.advanceTimersByTimeAsync(5_000);
    expect(statuses.at(-1)).toBe("failed");
  });

  it("does not reconnect after stop()", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    const svc = new AssemblyAIStreamingService();
    await startLive(svc);
    const ws = lastSocket();
    svc.stop();
    expect(ws.sent).toContainEqual(JSON.stringify({ type: "Terminate" }));
    ws.serverClose(1000);
    await vi.advanceTimersByTimeAsync(10_000);
    expect(FakeWebSocket.instances).toHaveLength(1);
    expect(svc.currentStatus).toBe("stopped");
  });
});

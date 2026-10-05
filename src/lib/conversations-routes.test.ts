import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

/* ------------------------------------------------------------------ */
/*  Fakes: auth, rate limit, and a chainable Supabase query builder    */
/* ------------------------------------------------------------------ */

const { state } = vi.hoisted(() => ({
  state: {
    user: { uid: "user-1", email: "u1@example.com" } as { uid: string; email: string } | null,
    calls: [] as Array<{ table: string; ops: Array<[string, unknown[]]> }>,
    results: [] as Array<{ data: unknown; error: unknown; count?: number }>,
  },
}));

vi.mock("@/lib/auth-server", () => ({ verifyAuth: async () => state.user }));
vi.mock("@/lib/security", () => ({
  assertJsonSize: () => null,
  getClientIp: () => "127.0.0.1",
  rateLimitGuard: async () => null,
}));
vi.mock("@/lib/subscription", () => ({ getUserSubscription: async () => ({ plan: "free" }) }));
vi.mock("@/lib/supabase-admin", () => {
  const builder = (table: string) => {
    const call = { table, ops: [] as Array<[string, unknown[]]> };
    state.calls.push(call);
    const result = () => state.results.shift() ?? { data: null, error: null };
    const b: Record<string, unknown> = {};
    for (const op of ["select", "insert", "update", "upsert", "eq", "in", "gte", "order", "limit"]) {
      b[op] = (...args: unknown[]) => { call.ops.push([op, args]); return b; };
    }
    b.single = async () => result();
    b.maybeSingle = async () => result();
    b.then = (resolve: (v: unknown) => void) => resolve(result());
    return b;
  };
  return { supabaseAdmin: { from: builder } };
});

import { GET as listRoute, POST as createRoute } from "@/app/api/conversations/route";
import { GET as getRoute, PATCH as patchRoute } from "@/app/api/conversations/[id]/route";
import { POST as segmentsRoute } from "@/app/api/conversations/[id]/segments/route";

const ID = "6f1c2b9e-4d1a-4c3e-9f2a-1b2c3d4e5f60";
const params = { params: Promise.resolve({ id: ID }) };
const req = (url: string, init?: { method?: string; body?: unknown }) =>
  new NextRequest(`http://localhost${url}`, {
    method: init?.method ?? "GET",
    headers: { "content-type": "application/json" },
    body: init?.body === undefined ? undefined : JSON.stringify(init.body),
  });
const eqs = (i: number) => state.calls[i].ops.filter(([op]) => op === "eq").map(([, a]) => a);

beforeEach(() => {
  state.user = { uid: "user-1", email: "u1@example.com" };
  state.calls = [];
  state.results = [];
});

describe("conversation routes", () => {
  it("rejects anonymous requests", async () => {
    state.user = null;
    const res = await listRoute(req("/api/conversations"));
    expect(res.status).toBe(401);
    expect(state.calls).toHaveLength(0);
  });

  it("lists only the caller's sessions, with Free retention applied", async () => {
    state.results.push({ data: [{ id: ID }], error: null, count: 1 });
    const res = await listRoute(req("/api/conversations"));
    expect(res.status).toBe(200);
    expect(eqs(0)).toEqual([["user_id", "user-1"]]);
    expect(state.calls[0].ops.some(([op]) => op === "gte")).toBe(true);
  });

  it("creates a session owned by the caller, ignoring any client user_id", async () => {
    state.results.push({ data: { id: ID }, error: null });
    const res = await createRoute(req("/api/conversations", { method: "POST", body: { title: "Call" } }));
    expect(res.status).toBe(201);
    expect(state.calls[0].ops.find(([op]) => op === "insert")?.[1][0]).toEqual({ user_id: "user-1", title: "Call" });

    const forged = await createRoute(req("/api/conversations", { method: "POST", body: { title: "x", user_id: "victim" } }));
    expect(forged.status).toBe(400);
  });

  it("reads and updates a session only with an owner filter", async () => {
    state.results.push({ data: null, error: null });
    const missing = await getRoute(req(`/api/conversations/${ID}`), params);
    expect(missing.status).toBe(404);
    expect(eqs(0)).toEqual([["id", ID], ["user_id", "user-1"]]);

    state.results.push({ data: { id: ID }, error: null });
    const ok = await patchRoute(req(`/api/conversations/${ID}`, { method: "PATCH", body: { overall_tone: "positive", ended_at: new Date().toISOString() } }), params);
    expect(ok.status).toBe(200);
    expect(eqs(1)).toEqual([["id", ID], ["user_id", "user-1"]]);
  });

  it("rejects unknown columns and invalid tones on update", async () => {
    const bad = await patchRoute(req(`/api/conversations/${ID}`, { method: "PATCH", body: { user_id: "victim" } }), params);
    expect(bad.status).toBe(400);
    const badTone = await patchRoute(req(`/api/conversations/${ID}`, { method: "PATCH", body: { overall_tone: "excited" } }), params);
    expect(badTone.status).toBe(400);
  });

  it("refuses to add segments to someone else's session", async () => {
    state.results.push({ data: null, error: null });
    const res = await segmentsRoute(
      req(`/api/conversations/${ID}/segments`, { method: "POST", body: { segments: [{ timestamp: 1, transcript: "hi", tone: "neutral", confidence: 0.5 }] } }),
      params,
    );
    expect(res.status).toBe(404);
    expect(state.calls.some((c) => c.ops.some(([op]) => op === "insert"))).toBe(false);
  });
});

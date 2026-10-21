import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const { inserted, authUser } = vi.hoisted(() => ({
  inserted: [] as Array<Record<string, unknown>>,
  authUser: { value: null as null | { uid: string; email: string | null } },
}));

vi.mock("@/lib/supabase-admin", () => ({
  supabaseAdmin: {
    from: () => ({
      insert: async (row: Record<string, unknown>) => {
        inserted.push(row);
        return { error: null };
      },
    }),
  },
}));
vi.mock("@/lib/auth-server", () => ({ verifyAuth: async () => authUser.value }));
vi.mock("@/lib/security", async () => {
  const actual = await vi.importActual<typeof import("@/lib/security")>("@/lib/security");
  return { ...actual, rateLimitGuard: async () => null };
});

import { POST } from "@/app/api/track/route";
import { computeFunnel, deviceFromUA, isBot, languageOfPath, type StoredEvent } from "@/lib/analytics/server";
import { deriveSource } from "@/lib/analytics/events";

const BROWSER = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 Safari/605.1.15";

function post(body: unknown, headers: Record<string, string> = {}) {
  return POST(
    new NextRequest("http://localhost/api/track", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "content-type": "application/json", "user-agent": BROWSER, ...headers },
    }),
  );
}

describe("deriveSource", () => {
  it("prefers ref, then utm_source, then the referring site, else direct", () => {
    expect(deriveSource({ ref: "S1", utm_source: "linkedin" })).toBe("s1");
    expect(deriveSource({ utm_source: "LinkedIn", referrer_host: "google.com" })).toBe("linkedin");
    expect(deriveSource({ referrer_host: "google.com" })).toBe("google.com");
    expect(deriveSource({})).toBe("direct");
    expect(deriveSource(undefined)).toBe("direct");
  });
});

describe("user agent helpers", () => {
  it("flags bots and empty agents, classifies devices", () => {
    expect(isBot("Googlebot/2.1")).toBe(true);
    expect(isBot(null)).toBe(true);
    expect(isBot(BROWSER)).toBe(false);
    expect(deviceFromUA("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Mobile")).toBe("mobile");
    expect(deviceFromUA("Mozilla/5.0 (iPad; CPU OS 17_0)")).toBe("tablet");
    expect(deviceFromUA(BROWSER)).toBe("desktop");
  });
});

describe("POST /api/track", () => {
  beforeEach(() => {
    inserted.length = 0;
    authUser.value = null;
  });

  const base = { event: "page_view", anonId: "abcdef0123456789", path: "/pricing?x=1" };

  it("stores a page view without query string, with the derived source and no IP", async () => {
    const res = await post(
      { ...base, attribution: { ref: "s2", utm_campaign: "wave2" } },
      { "x-vercel-ip-country": "US", "x-forwarded-for": "203.0.113.9" },
    );
    expect(res.status).toBe(204);
    expect(inserted).toHaveLength(1);
    const row = inserted[0];
    expect(row).toMatchObject({ event: "page_view", path: "/pricing", source: "s2", ref: "s2", utm_campaign: "wave2", country: "US", device: "desktop", user_id: null });
    expect(JSON.stringify(row)).not.toContain("203.0.113.9");
  });

  it("ignores bots without storing anything", async () => {
    const res = await post(base, { "user-agent": "Googlebot/2.1 (+http://www.google.com/bot.html)" });
    expect(res.status).toBe(204);
    expect(inserted).toHaveLength(0);
  });

  it("rejects unknown and server-only events, bad visitor ids and extra fields", async () => {
    expect((await post({ ...base, event: "checkout_completed" })).status).toBe(400);
    expect((await post({ ...base, event: "nope" })).status).toBe(400);
    expect((await post({ ...base, anonId: "x" })).status).toBe(400);
    expect((await post({ ...base, email: "a@b.co" })).status).toBe(400);
    expect(inserted).toHaveLength(0);
  });

  it("requires a signed-in user for signup and links the account", async () => {
    expect((await post({ ...base, event: "signup" })).status).toBe(401);
    authUser.value = { uid: "uid-123", email: "x@y.co" };
    const res = await post({ ...base, event: "signup", props: { method: "google" } }, { authorization: "Bearer t" });
    expect(res.status).toBe(204);
    expect(inserted[0]).toMatchObject({ event: "signup", user_id: "uid-123", props: { method: "google" } });
    expect(JSON.stringify(inserted[0])).not.toContain("x@y.co");
  });
});

describe("computeFunnel", () => {
  const ev = (event: StoredEvent["event"], o: Partial<StoredEvent>, t: string): StoredEvent => ({
    event,
    anon_id: null,
    user_id: null,
    path: "/",
    source: "direct",
    props: null,
    created_at: `2026-10-0${t}T10:00:00.000Z`,
    ...o,
  });

  it("counts each step once per visitor or account and attributes by source", () => {
    const rows: StoredEvent[] = [
      ev("page_view", { anon_id: "a1", source: "s1" }, "1"),
      ev("page_view", { anon_id: "a1", source: "s1", path: "/pricing" }, "1"),
      ev("cta_click", { anon_id: "a1", source: "s1" }, "2"),
      ev("signup", { anon_id: "a1", user_id: "u1", source: "s1" }, "2"),
      ev("session_started", { user_id: "u1" }, "3"),
      ev("first_session", { user_id: "u1" }, "3"),
      ev("checkout_started", { user_id: "u1" }, "4"),
      ev("checkout_completed", { user_id: "u1" }, "4"),
      ev("page_view", { anon_id: "a2", source: "linkedin" }, "1"),
      ev("page_view", { anon_id: "a3" }, "1"),
      ev("cta_click", { anon_id: "a3" }, "1"),
      ev("first_session", { user_id: "old-user" }, "5"),
      ev("vsl_sound", { anon_id: "a2", source: "linkedin" }, "1"),
    ];
    const r = computeFunnel(rows);
    expect(r.totals).toEqual({ visitors: 3, clicks: 2, signups: 1, activated: 2, checkoutStarted: 1, paid: 1 });
    const s1 = r.bySource.find((b) => b.source === "s1")!;
    expect(s1).toMatchObject({ visitors: 1, clicks: 1, signups: 1, activated: 1, checkoutStarted: 1, paid: 1 });
    expect(r.bySource.find((b) => b.source === "before tracking")).toMatchObject({ activated: 1, signups: 0 });
    expect(r.bySource.find((b) => b.source === "linkedin")).toMatchObject({ visitors: 1, clicks: 0 });
    expect(r.topPages[0]).toEqual({ path: "/", visitors: 3 });
    expect(r.vsl).toEqual({ sound: 1, fullscreen: 0 });
  });

  it("splits the funnel by the language of the first public page a visitor saw", () => {
    const rows: StoredEvent[] = [
      ev("page_view", { anon_id: "f1", path: "/fr" }, "1"),
      ev("page_view", { anon_id: "f1", path: "/pricing" }, "1"), // later English page does not change the language
      ev("cta_click", { anon_id: "f1", path: "/fr" }, "1"),
      ev("signup", { anon_id: "f1", user_id: "uf" }, "2"),
      ev("checkout_completed", { user_id: "uf" }, "3"),
      ev("page_view", { anon_id: "f2", path: "/fr/pricing?utm_source=x" }, "1"),
      ev("page_view", { anon_id: "e1", path: "/" }, "1"),
      ev("page_view", { anon_id: "d1", path: "/dashboard" }, "1"), // app page: no language
      ev("page_view", { anon_id: "d1", path: "/de/about" }, "1"),
    ];
    const r = computeFunnel(rows);
    const lang = (l: string) => r.byLanguage.find((b) => b.language === l);
    expect(lang("fr")).toMatchObject({ visitors: 2, clicks: 1, signups: 1, paid: 1 });
    expect(lang("en")).toMatchObject({ visitors: 1, signups: 0 });
    expect(lang("de")).toMatchObject({ visitors: 1 });
    expect(languageOfPath("/dashboard")).toBeNull();
    expect(languageOfPath("/ja/blog/x")).toBe("ja");
    expect(languageOfPath(null)).toBe("en");
  });
});

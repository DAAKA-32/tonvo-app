import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

const { queried, purged } = vi.hoisted(() => ({ queried: [] as string[], purged: [] as string[] }));
vi.mock("@/lib/supabase-admin", () => ({
  supabaseAdmin: {
    from: (table: string) => ({
      select: async () => {
        queried.push(table);
        return { count: 1, error: null };
      },
      delete: () => ({
        lt: async (column: string, value: string) => {
          purged.push(`${table}.${column}<${value.slice(0, 7)}`);
          return { error: null };
        },
      }),
    }),
  },
}));

import { GET } from "@/app/api/cron/keepalive/route";

const call = (auth?: string) =>
  GET(new NextRequest("http://localhost/api/cron/keepalive", { headers: auth ? { authorization: auth } : {} }));

describe("cron keepalive", () => {
  beforeEach(() => { queried.length = 0; purged.length = 0; });
  afterEach(() => { vi.unstubAllEnvs(); });

  it("refuses calls without the cron secret", async () => {
    vi.stubEnv("CRON_SECRET", "s3cret-value-123456");
    expect((await call()).status).toBe(401);
    expect((await call("Bearer wrong")).status).toBe(401);
    expect(queried).toEqual([]);
  });

  it("refuses everything when no secret is configured", async () => {
    vi.stubEnv("CRON_SECRET", "");
    expect((await call("Bearer ")).status).toBe(401);
  });

  it("runs two real database reads for Vercel Cron", async () => {
    vi.stubEnv("CRON_SECRET", "s3cret-value-123456");
    const res = await call("Bearer s3cret-value-123456");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(queried.sort()).toEqual(["conversations", "subscriptions"]);
  });

  it("deletes analytics events older than 25 months", async () => {
    vi.stubEnv("CRON_SECRET", "s3cret-value-123456");
    await call("Bearer s3cret-value-123456");
    expect(purged).toHaveLength(1);
    const cutoffMonth = purged[0].split("<")[1];
    const expected = new Date(Date.now() - 25 * 30.44 * 864e5).toISOString().slice(0, 7);
    expect(purged[0].startsWith("analytics_events.created_at<")).toBe(true);
    expect(cutoffMonth).toBe(expected);
  });
});

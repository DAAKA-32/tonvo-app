import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { computeFunnel, type StoredEvent } from "@/lib/analytics/server";
import { getClientIp, rateLimitGuard } from "@/lib/security";
import { RATE_LIMITS } from "@/lib/rate-limit";

/**
 * GET /api/admin/analytics?days=7|30|90 — funnel report for the Tonvo team only.
 * Access: a valid Firebase ID token whose email is listed in ANALYTICS_ADMIN_EMAILS or ADMIN_EMAILS
 * (comma-separated, server env). The dashboard has its own list so read-only viewers get no other admin power.
 * Returns aggregates only (counts per step, per source, per page), never visitor ids or accounts.
 */
const ALLOWED_DAYS = new Set([7, 30, 90]);
const PAGE = 1000; // PostgREST max rows per request
const MAX_ROWS = 50_000;

function isAdmin(email: string | null): boolean {
  if (!email) return false;
  const admins = `${process.env.ANALYTICS_ADMIN_EMAILS ?? ""},${process.env.ADMIN_EMAILS ?? ""}`
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.toLowerCase());
}

export async function GET(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin(user.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const limited = await rateLimitGuard("data", `${user.uid}:${getClientIp(req)}`, RATE_LIMITS.data);
  if (limited) return limited;

  const daysParam = Number(req.nextUrl.searchParams.get("days"));
  const days = ALLOWED_DAYS.has(daysParam) ? daysParam : 30;
  const since = new Date(Date.now() - days * 864e5).toISOString();

  const rows: StoredEvent[] = [];
  for (let from = 0; from < MAX_ROWS; from += PAGE) {
    const { data, error } = await supabaseAdmin
      .from("analytics_events")
      .select("event, anon_id, user_id, path, source, props, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: true })
      .range(from, from + PAGE - 1);
    if (error) {
      console.error("[admin/analytics] query failed:", error.message);
      return NextResponse.json({ error: "Database error" }, { status: 503 });
    }
    rows.push(...((data ?? []) as StoredEvent[]));
    if (!data || data.length < PAGE) break;
  }

  return NextResponse.json({
    days,
    since,
    truncated: rows.length >= MAX_ROWS,
    ...computeFunnel(rows),
  });
}

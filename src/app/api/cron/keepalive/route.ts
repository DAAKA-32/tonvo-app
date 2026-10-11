import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

/**
 * GET /api/cron/keepalive — Vercel Cron, 3 times a day (vercel.json).
 *
 * Supabase pauses Free projects that get too little database activity over a
 * week ("a few user requests to the database each day" is typically enough).
 * Each run makes two real, read-only queries. Nothing is returned but booleans.
 * Vercel sends `Authorization: Bearer $CRON_SECRET` on every cron invocation.
 * It also enforces the analytics retention promised on the privacy page: events older than 25 months are deleted.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [conversations, subscriptions] = await Promise.all([
    supabaseAdmin.from("conversations").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("subscriptions").select("id", { count: "exact", head: true }),
  ]);
  const cutoff = new Date(Date.now() - 25 * 30.44 * 864e5).toISOString();
  const purge = await supabaseAdmin.from("analytics_events").delete().lt("created_at", cutoff);
  if (purge.error) console.error("[keepalive] analytics retention purge failed:", purge.error.message);

  const ok = !conversations.error && !subscriptions.error;
  if (!ok) {
    console.error("[keepalive] database query failed:", conversations.error?.message ?? subscriptions.error?.message);
  }
  return NextResponse.json({ ok }, { status: ok ? 200 : 503 });
}

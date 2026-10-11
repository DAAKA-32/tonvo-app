import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getUserSubscription } from "@/lib/subscription";
import { getPlanFeatures } from "@/lib/plan-features";
import { badRequest, dbError, guard, readJson } from "@/lib/conversations-server";
import { afterResponse, recordServerEvent } from "@/lib/analytics/server";

/**
 * GET  /api/conversations             → the user's sessions (history), plan retention applied
 * GET  /api/conversations?limit=5&stats=1
 *                                      → recent sessions + total count + tone stats (dashboard)
 * POST /api/conversations { title }   → start a session record, returns { id }
 */

const createSchema = z.object({ title: z.string().min(1).max(200) }).strict();

export async function GET(req: NextRequest) {
  const auth = await guard(req);
  if (auth instanceof NextResponse) return auth;

  const limitParam = Number(req.nextUrl.searchParams.get("limit"));
  const limit = Number.isInteger(limitParam) && limitParam > 0 ? Math.min(limitParam, 500) : 500;
  const withStats = req.nextUrl.searchParams.get("stats") === "1";

  // Retention is a plan feature: enforce it here, not in the browser.
  const sub = await getUserSubscription(auth.uid, auth.email);
  const retentionDays = getPlanFeatures(sub.plan).historyRetentionDays;

  let query = supabaseAdmin
    .from("conversations")
    .select("*", { count: "exact" })
    .eq("user_id", auth.uid)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (retentionDays > 0) {
    const cutoff = new Date(Date.now() - retentionDays * 864e5).toISOString();
    query = query.gte("created_at", cutoff);
  }
  const { data, count, error } = await query;
  if (error) return dbError("list", error);

  const conversations = data ?? [];
  if (!withStats) return NextResponse.json({ conversations, total: count ?? conversations.length });

  const ids = conversations.map((c) => c.id as string);
  let tones: Array<{ tone: string; confidence: number }> = [];
  if (ids.length > 0) {
    const segs = await supabaseAdmin
      .from("analysis_segments")
      .select("tone, confidence")
      .in("conversation_id", ids);
    if (segs.error) return dbError("stats", segs.error);
    tones = segs.data ?? [];
  }
  return NextResponse.json({ conversations, total: count ?? conversations.length, tones });
}

export async function POST(req: NextRequest) {
  const auth = await guard(req, { jsonBody: true });
  if (auth instanceof NextResponse) return auth;

  const parsed = createSchema.safeParse(await readJson(req));
  if (!parsed.success) return badRequest(parsed.error);

  const { data, error } = await supabaseAdmin
    .from("conversations")
    .insert({ user_id: auth.uid, title: parsed.data.title })
    .select("id")
    .single();
  if (error || !data) return dbError("create", error);

  // Funnel analytics, after the response: every LIVE session, and the account's first one (activation).
  const uid = auth.uid;
  afterResponse(async () => {
    await recordServerEvent("session_started", uid);
    const { count } = await supabaseAdmin
      .from("conversations")
      .select("id", { count: "exact", head: true })
      .eq("user_id", uid);
    if (count === 1) await recordServerEvent("first_session", uid);
  });
  return NextResponse.json({ id: data.id }, { status: 201 });
}

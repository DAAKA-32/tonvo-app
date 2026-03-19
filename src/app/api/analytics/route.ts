import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyAuth } from "@/lib/auth-server";

interface ConversationRow {
  id: string;
  created_at: string;
  ended_at: string | null;
  overall_tone: string | null;
  score: { overall: number; engagement: number; tone: number; fluidity: number; interest: number } | null;
  social_score: number | null;
}

export async function POST(req: NextRequest) {
  const authUser = await verifyAuth(req);
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await req.json();

  if (userId && userId !== authUser.uid) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  // Fetch all completed conversations for this user (with scores)
  const { data: conversations, error } = await supabaseAdmin
    .from("conversations")
    .select("id, created_at, ended_at, overall_tone, score, social_score")
    .eq("user_id", userId)
    .not("ended_at", "is", null)
    .not("score", "is", null)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }

  const rows = (conversations || []) as ConversationRow[];

  if (rows.length === 0) {
    return NextResponse.json({
      totalSessions: 0,
      progression: [],
      averages: { overall: 0, engagement: 0, tone: 0, fluidity: 0, interest: 0, social: 0 },
      toneDistribution: { positive: 0, neutral: 0, negative: 0, hesitant: 0 },
      toneBreakdown: {},
      streaks: { current: 0, best: 0 },
      recentTrend: "stable",
      weeklyActivity: [],
    });
  }

  // Build progression timeline (each session = one data point)
  const progression = rows.map((r) => ({
    date: r.created_at,
    overall: r.score?.overall ?? 0,
    engagement: r.score?.engagement ?? 0,
    tone: r.score?.tone ?? 0,
    fluidity: r.score?.fluidity ?? 0,
    interest: r.score?.interest ?? 0,
    social: r.social_score ?? 0,
    overallTone: r.overall_tone,
  }));

  // Compute averages
  const sum = { overall: 0, engagement: 0, tone: 0, fluidity: 0, interest: 0, social: 0 };
  for (const r of rows) {
    sum.overall += r.score?.overall ?? 0;
    sum.engagement += r.score?.engagement ?? 0;
    sum.tone += r.score?.tone ?? 0;
    sum.fluidity += r.score?.fluidity ?? 0;
    sum.interest += r.score?.interest ?? 0;
    sum.social += r.social_score ?? 0;
  }
  const n = rows.length;
  const averages = {
    overall: Math.round(sum.overall / n),
    engagement: Math.round(sum.engagement / n),
    tone: Math.round(sum.tone / n),
    fluidity: Math.round(sum.fluidity / n),
    interest: Math.round(sum.interest / n),
    social: Math.round(sum.social / n),
  };

  // Tone distribution
  const toneDistribution: Record<string, number> = { positive: 0, neutral: 0, negative: 0, hesitant: 0 };
  for (const r of rows) {
    const t = r.overall_tone;
    if (t && t in toneDistribution) toneDistribution[t]++;
  }

  // Tone breakdown (same as toneDistribution but kept for frontend compat)
  const toneBreakdown: Record<string, number> = {};
  for (const r of rows) {
    const t = r.overall_tone;
    if (t) toneBreakdown[t] = (toneBreakdown[t] || 0) + 1;
  }

  // Streaks: consecutive sessions with overall >= 60
  let current = 0;
  let best = 0;
  for (const r of rows) {
    if ((r.score?.overall ?? 0) >= 60) {
      current++;
      if (current > best) best = current;
    } else {
      current = 0;
    }
  }

  // Recent trend: compare last 3 sessions avg vs previous 3
  let recentTrend: "improving" | "declining" | "stable" = "stable";
  if (rows.length >= 6) {
    const recent3 = rows.slice(-3);
    const prev3 = rows.slice(-6, -3);
    const avgRecent = recent3.reduce((a, r) => a + (r.score?.overall ?? 0), 0) / 3;
    const avgPrev = prev3.reduce((a, r) => a + (r.score?.overall ?? 0), 0) / 3;
    if (avgRecent - avgPrev > 5) recentTrend = "improving";
    else if (avgPrev - avgRecent > 5) recentTrend = "declining";
  } else if (rows.length >= 2) {
    const last = rows[rows.length - 1].score?.overall ?? 0;
    const prev = rows[rows.length - 2].score?.overall ?? 0;
    if (last - prev > 5) recentTrend = "improving";
    else if (prev - last > 5) recentTrend = "declining";
  }

  // Weekly activity (last 8 weeks)
  const now = new Date();
  const weeklyActivity: { week: string; count: number; avgScore: number }[] = [];
  for (let w = 7; w >= 0; w--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() - w * 7);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const weekRows = rows.filter((r) => {
      const d = new Date(r.created_at);
      return d >= weekStart && d < weekEnd;
    });
    const label = weekStart.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    const avg = weekRows.length > 0
      ? Math.round(weekRows.reduce((a, r) => a + (r.score?.overall ?? 0), 0) / weekRows.length)
      : 0;
    weeklyActivity.push({ week: label, count: weekRows.length, avgScore: avg });
  }

  return NextResponse.json({
    totalSessions: n,
    progression,
    averages,
    toneDistribution,
    toneBreakdown,
    streaks: { current, best },
    recentTrend,
    weeklyActivity,
  });
}

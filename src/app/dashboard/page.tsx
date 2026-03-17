"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import AppShell from "@/components/AppShell";
import ToneIndicator from "@/components/ToneIndicator";
import type { Conversation } from "@/types/database";
import type { Tone } from "@/types/analysis";

interface Stats {
  totalSessions: number;
  totalSegments: number;
  avgConfidence: number;
  toneCounts: { positive: number; neutral: number; negative: number; hesitant: number };
}

function computeSentimentPercents(toneCounts: Stats["toneCounts"]) {
  const total = toneCounts.positive + toneCounts.neutral + toneCounts.negative + toneCounts.hesitant;
  if (total === 0) return { positive: 0, neutral: 0, negative: 0 };
  return {
    positive: Math.round(((toneCounts.positive) / total) * 100),
    neutral: Math.round(((toneCounts.neutral + toneCounts.hesitant) / total) * 100),
    negative: Math.round(((toneCounts.negative) / total) * 100),
  };
}

function useGreeting() {
  const { t } = useTranslation();
  const h = new Date().getHours();
  if (h < 12) return t("dashboard.greetingMorning");
  if (h < 18) return t("dashboard.greetingAfternoon");
  return t("dashboard.greetingEvening");
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalSessions: 0,
    totalSegments: 0,
    avgConfidence: 0,
    toneCounts: { positive: 0, neutral: 0, negative: 0, hesitant: 0 },
  });
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      // Run conversations + count in parallel (saves 1 round-trip)
      const [recentResult, countResult] = await Promise.all([
        supabase
          .from("conversations")
          .select("*")
          .eq("user_id", user!.uid)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("conversations")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user!.uid),
      ]);

      const convos = recentResult.data;
      if (convos) setConversations(convos);

      // Fetch segment stats only if we have conversations
      const convoIds = (convos || []).map((c) => c.id);
      const segments = convoIds.length > 0
        ? (await supabase
            .from("analysis_segments")
            .select("tone, confidence")
            .in("conversation_id", convoIds)
          ).data
        : null;

      const toneCounts = { positive: 0, neutral: 0, negative: 0, hesitant: 0 };
      let confidenceSum = 0;

      if (segments) {
        for (const seg of segments) {
          if (seg.tone in toneCounts) {
            toneCounts[seg.tone as keyof typeof toneCounts]++;
          }
          confidenceSum += seg.confidence;
        }
      }

      setStats({
        totalSessions: countResult.count || 0,
        totalSegments: segments?.length || 0,
        avgConfidence: segments && segments.length > 0
          ? Math.round((confidenceSum / segments.length) * 100)
          : 0,
        toneCounts,
      });

      setLoadingData(false);
    }

    fetchData();
  }, [user]);

  const sentimentPct = useMemo(() => computeSentimentPercents(stats.toneCounts), [stats.toneCounts]);
  const dominantTone = useMemo(() => sentimentPct.positive >= sentimentPct.negative ? "positive" : "negative", [sentimentPct]);

  return (
    <AppShell>
      <div style={{ maxWidth: 1100 }}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-heading text-glow mb-1">
            {useGreeting()}, {user?.displayName?.split(" ")[0] || "there"}
          </h1>
          <p className="body-muted text-sm m-0">
            {t("dashboard.subtitle")}
          </p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <Link
            href="/session"
            className="no-underline glass-card glass-card-hover flex items-center gap-4 p-5"
            style={{ borderColor: "rgba(52, 211, 153, 0.2)" }}>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(52, 211, 153, 0.1)" }}>
              <div className="w-2.5 h-2.5 rounded-full pulse-positive" style={{ backgroundColor: "var(--color-positive)" }} />
            </div>
            <div>
              <span className="text-sm font-semibold block" style={{ color: "var(--color-text)" }}>
                {t("dashboard.startSession")}
              </span>
              <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                {t("dashboard.startSessionDesc")}
              </span>
            </div>
          </Link>
          <Link
            href="/analyze-text"
            className="no-underline glass-card glass-card-hover flex items-center gap-4 p-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(200, 200, 216, 0.06)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--color-accent-light)" }}>
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div>
              <span className="text-sm font-semibold block" style={{ color: "var(--color-text)" }}>
                {t("dashboard.analyzeText")}
              </span>
              <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                {t("dashboard.analyzeTextDesc")}
              </span>
            </div>
          </Link>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="kpi-card">
            <div className="kpi-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "var(--color-accent-light)" }}>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
            <p className="text-xs font-medium uppercase tracking-wider m-0 mb-1" style={{ color: "var(--color-text-muted)" }}>
              {t("dashboard.sessions")}
            </p>
            <p className="text-2xl m-0 metric-text">
              {loadingData ? "--" : stats.totalSessions}
            </p>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "var(--color-accent-light)" }}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="text-xs font-medium uppercase tracking-wider m-0 mb-1" style={{ color: "var(--color-text-muted)" }}>
              {t("dashboard.segments")}
            </p>
            <p className="text-2xl m-0 metric-text">
              {loadingData ? "--" : stats.totalSegments}
            </p>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "var(--color-accent-light)" }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <p className="text-xs font-medium uppercase tracking-wider m-0 mb-1" style={{ color: "var(--color-text-muted)" }}>
              {t("dashboard.avgConfidence")}
            </p>
            <p className="text-2xl m-0 metric-text">
              {loadingData ? "--" : `${stats.avgConfidence}%`}
            </p>
          </div>
          <div className={`kpi-card ${stats.totalSegments > 0 ? (dominantTone === "positive" ? "kpi-card-positive" : "kpi-card-negative") : ""}`}>
            <div className="kpi-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{
                color: stats.totalSegments === 0
                  ? "var(--color-accent-light)"
                  : dominantTone === "positive"
                    ? "var(--color-positive)"
                    : "var(--color-negative)",
              }}>
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" x2="9.01" y1="9" y2="9" />
                <line x1="15" x2="15.01" y1="9" y2="9" />
              </svg>
            </div>
            <p className="text-xs font-medium uppercase tracking-wider m-0 mb-1" style={{ color: "var(--color-text-muted)" }}>
              {t("dashboard.dominantTone")}
            </p>
            <p className="text-2xl font-bold m-0 capitalize" style={{
              color: stats.totalSegments === 0
                ? "var(--color-text-muted)"
                : dominantTone === "positive"
                  ? "var(--color-positive)"
                  : "var(--color-negative)",
            }}>
              {loadingData ? "--" : stats.totalSegments === 0 ? t("common.na") : t(`common.${dominantTone}`)}
            </p>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Sentiment Overview - takes 1 col */}
          <div className="glass-card-static p-6">
            <h3 className="card-title mb-5 m-0">
              {t("dashboard.sentimentOverview")}
            </h3>

            {stats.totalSegments === 0 && !loadingData ? (
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                {t("dashboard.noData")}
              </p>
            ) : (
              <div className="space-y-4">
                {/* Bar */}
                <div className="sentiment-bar">
                  <div style={{ width: `${sentimentPct.positive}%`, backgroundColor: "var(--color-positive)" }} />
                  <div style={{ width: `${sentimentPct.neutral}%`, backgroundColor: "var(--color-neutral)" }} />
                  <div style={{ width: `${sentimentPct.negative}%`, backgroundColor: "var(--color-negative)" }} />
                </div>

                {/* Legend */}
                <div className="space-y-3">
                  {[
                    { label: t("common.positive"), pct: sentimentPct.positive, color: "var(--color-positive)" },
                    { label: t("common.neutral"), pct: sentimentPct.neutral, color: "var(--color-neutral)" },
                    { label: t("common.negative"), pct: sentimentPct.negative, color: "var(--color-negative)" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                          {item.label}
                        </span>
                      </div>
                      <span className="text-xs font-medium" style={{ color: "var(--color-text)" }}>
                        {loadingData ? "--" : `${item.pct}%`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recent Sessions - takes 2 cols */}
          <div className="glass-card-static p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h3 className="card-title m-0">
                {t("dashboard.recentSessions")}
              </h3>
              <Link
                href="/history"
                className="text-xs no-underline font-medium"
                style={{ color: "var(--color-accent-light)" }}>
                {t("common.viewAll")}
              </Link>
            </div>

            {loadingData ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 rounded-lg shimmer" style={{ backgroundColor: "var(--color-surface-2)" }} />
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--color-text-muted)" }}>
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" x2="12" y1="19" y2="22" />
                  </svg>
                </div>
                <p className="text-sm font-medium m-0 mb-1" style={{ color: "var(--color-text)" }}>
                  {t("dashboard.noSessions")}
                </p>
                <p className="text-xs m-0 mb-4" style={{ color: "var(--color-text-muted)" }}>
                  {t("dashboard.noSessionsDesc")}
                </p>
                <Link
                  href="/session"
                  className="inline-flex items-center gap-2 text-xs font-medium no-underline px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: "rgba(200, 200, 216, 0.08)",
                    color: "var(--color-accent-light)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                  }}>
                  {t("dashboard.startSessionBtn")}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.map((conv) => (
                  <Link
                    key={conv.id}
                    href={`/summary/${conv.id}`}
                    className="no-underline flex items-center gap-4 p-3 rounded-xl transition-all"
                    style={{ backgroundColor: "transparent" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}>
                    {conv.overall_tone ? (
                      <ToneIndicator tone={conv.overall_tone as Tone} size="sm" showLabel={false} />
                    ) : (
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--color-border)" }} />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium m-0 truncate" style={{ color: "var(--color-text)" }}>
                        {conv.title}
                      </p>
                      <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                        {new Date(conv.created_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    {conv.overall_tone && (
                      <span
                        className="tone-badge"
                        style={{
                          backgroundColor:
                            conv.overall_tone === "positive"
                              ? "rgba(52, 211, 153, 0.1)"
                              : conv.overall_tone === "negative"
                                ? "rgba(248, 113, 113, 0.1)"
                                : "rgba(251, 191, 36, 0.1)",
                          color:
                            conv.overall_tone === "positive"
                              ? "var(--color-positive)"
                              : conv.overall_tone === "negative"
                                ? "var(--color-negative)"
                                : "var(--color-neutral)",
                        }}>
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor:
                              conv.overall_tone === "positive"
                                ? "var(--color-positive)"
                                : conv.overall_tone === "negative"
                                  ? "var(--color-negative)"
                                  : "var(--color-neutral)",
                          }}
                        />
                        {conv.overall_tone}
                      </span>
                    )}
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" style={{ color: "var(--color-text-muted)", flexShrink: 0 }}>
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Insights row */}
        {conversations.length > 0 && conversations[0].insights && (
          <div className="glass-card-static p-6 mt-4">
            <h3 className="card-title mb-4 m-0">
              {t("dashboard.latestInsights")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {conversations[0].insights.slice(0, 4).map((insight, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-xs font-bold mt-0.5"
                    style={{
                      backgroundColor: "rgba(200, 200, 216, 0.08)",
                      color: "var(--color-accent-light)",
                    }}>
                    {i + 1}
                  </div>
                  <p className="text-xs leading-relaxed m-0" style={{ color: "var(--color-text-silver)" }}>
                    {insight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

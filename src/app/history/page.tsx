"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import AppShell from "@/components/AppShell";
import { usePlan } from "@/hooks/usePlan";
import type { Conversation } from "@/types/database";
import type { Tone } from "@/types/analysis";

function ToneBadge({ tone }: { tone: string }) {
  const colors: Record<string, { bg: string; text: string; label: string }> = {
    positive: { bg: "rgba(52, 211, 153, 0.1)", text: "var(--color-positive)", label: "Positive" },
    neutral: { bg: "rgba(251, 191, 36, 0.1)", text: "var(--color-neutral)", label: "Neutral" },
    negative: { bg: "rgba(248, 113, 113, 0.1)", text: "var(--color-negative)", label: "Negative" },
    hesitant: { bg: "rgba(251, 191, 36, 0.1)", text: "var(--color-neutral)", label: "Hesitant" },
  };
  const c = colors[tone] || colors.neutral;

  return (
    <span
      className="tone-badge"
      style={{ backgroundColor: c.bg, color: c.text }}>
      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.text }} />
      {c.label}
    </span>
  );
}

function formatDuration(startStr: string, endStr: string | null): string {
  if (!endStr) return "--";
  const diff = Math.floor((new Date(endStr).getTime() - new Date(startStr).getTime()) / 1000);
  if (diff < 0) return "--";
  const m = Math.floor(diff / 60);
  const s = diff % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

function ScorePill({ score }: { score: number }) {
  const color = score >= 70 ? "var(--color-positive)" : score >= 40 ? "var(--color-neutral)" : "var(--color-negative)";
  return (
    <span
      className="text-xs font-bold px-2 py-0.5 rounded-md"
      style={{ backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`, color }}>
      {score}
    </span>
  );
}

export default function HistoryPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { features } = usePlan();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [filter, setFilter] = useState<"all" | Tone>("all");

  useEffect(() => {
    if (!user) return;

    async function fetchHistory() {
      let query = supabase
        .from("conversations")
        .select("*")
        .eq("user_id", user!.uid)
        .order("created_at", { ascending: false });

      // Enforce retention: free plan = last 7 days only
      if (features.historyRetentionDays > 0) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - features.historyRetentionDays);
        query = query.gte("created_at", cutoff.toISOString());
      }

      const { data } = await query;
      if (data) setConversations(data);
      setLoadingData(false);
    }

    fetchHistory();
  }, [user]);

  const filtered = filter === "all"
    ? conversations
    : conversations.filter((c) => c.overall_tone === filter);

  const toneCounts = conversations.reduce(
    (acc, c) => {
      const tone = c.overall_tone as string;
      if (tone && tone in acc) acc[tone as keyof typeof acc]++;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0, hesitant: 0 }
  );

  return (
    <AppShell>
      <div style={{ maxWidth: 1000 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="section-heading text-glow mb-1">{t("history.title")}</h1>
            <p className="body-muted text-sm m-0">
              {t("history.sessionCount", { count: conversations.length })}
            </p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="filter-bar mb-6">
          {[
            { key: "all", label: t("common.all"), count: conversations.length },
            { key: "positive", label: t("common.positive"), count: toneCounts.positive },
            { key: "neutral", label: t("common.neutral"), count: toneCounts.neutral },
            { key: "negative", label: t("common.negative"), count: toneCounts.negative },
          ].map((chip) => (
            <button
              key={chip.key}
              onClick={() => setFilter(chip.key as typeof filter)}
              className={`filter-chip ${filter === chip.key ? "active" : ""}`}>
              {chip.label}
              <span style={{ opacity: 0.4, marginLeft: 6 }}>
                {chip.count}
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="glass-card-static overflow-hidden">
          {loadingData ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 rounded-lg shimmer" style={{ backgroundColor: "var(--color-surface-2)" }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--color-text-muted)" }}>
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M12 7v5l4 2" />
                </svg>
              </div>
              <p className="text-sm font-medium m-0 mb-1" style={{ color: "var(--color-text)" }}>
                {filter === "all" ? t("history.noSessions") : t("history.noFilterResults", { filter })}
              </p>
              <p className="text-xs m-0" style={{ color: "var(--color-text-muted)" }}>
                {filter === "all"
                  ? t("history.noSessionsDesc")
                  : t("history.noFilterResultsDesc")}
              </p>
            </div>
          ) : (
            <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t("history.session")}</th>
                  <th>{t("history.date")}</th>
                  <th>{t("history.tone")}</th>
                  <th>Score</th>
                  <th>{t("history.duration")}</th>
                  <th style={{ width: 40 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((conv) => {
                  const start = new Date(conv.created_at);
                  const duration = formatDuration(conv.created_at, conv.ended_at);

                  return (
                    <tr key={conv.id}>
                      <td>
                        <Link
                          href={`/summary/${conv.id}`}
                          className="no-underline font-medium"
                          style={{ color: "var(--color-text)" }}>
                          {conv.title}
                        </Link>
                        {conv.summary && (
                          <p className="text-xs m-0 mt-1 truncate" style={{ color: "var(--color-text-muted)", maxWidth: 320 }}>
                            {conv.summary}
                          </p>
                        )}
                      </td>
                      <td>
                        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                          {start.toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </td>
                      <td>
                        {conv.overall_tone ? (
                          <ToneBadge tone={conv.overall_tone} />
                        ) : (
                          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>--</span>
                        )}
                      </td>
                      <td>
                        {conv.score?.overall != null ? (
                          <ScorePill score={conv.score.overall} />
                        ) : (
                          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>--</span>
                        )}
                      </td>
                      <td>
                        <span className="text-xs font-medium" style={{ color: duration !== "--" ? "var(--color-text)" : "var(--color-text-muted)" }}>
                          {duration}
                        </span>
                      </td>
                      <td>
                        <Link
                          href={`/summary/${conv.id}`}
                          className="no-underline"
                          style={{ color: "var(--color-text-muted)" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { useTranslateFields } from "@/hooks/useTranslateFields";
import AppShell from "@/components/AppShell";
import ToneIndicator from "@/components/ToneIndicator";
import type { Conversation, AnalysisSegment } from "@/types/database";
import type { Tone, ConversationClassification } from "@/types/analysis";

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs w-20 shrink-0" style={{ color: "var(--color-text-muted)" }}>{label}</span>
      <div className="score-bar-track flex-1">
        <div className="score-bar-fill" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-bold w-8 text-right" style={{ color }}>{value}</span>
    </div>
  );
}

function getScoreColor(score: number) {
  if (score >= 70) return "var(--color-positive)";
  if (score >= 40) return "var(--color-neutral)";
  return "var(--color-negative)";
}

function formatDuration(start: string, end: string | null) {
  if (!end) return "--";
  const diff = Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 1000);
  const m = Math.floor(diff / 60);
  const s = diff % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

export default function SummaryPage() {
  const { user } = useAuth();
  const params = useParams();
  const { t, i18n } = useTranslation();
  const id = params.id as string;
  const { translate, translating } = useTranslateFields();

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [segments, setSegments] = useState<AnalysisSegment[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Translated fields for non-English users
  const [tDiagnosis, setTDiagnosis] = useState<string>("");
  const [tSummary, setTSummary] = useState<string>("");
  const [tInsights, setTInsights] = useState<string[]>([]);
  const [tFollowUp, setTFollowUp] = useState<string[]>([]);
  const [tStrengths, setTStrengths] = useState<string[]>([]);
  const [tImprovements, setTImprovements] = useState<string[]>([]);

  useEffect(() => {
    if (!user || !id) return;

    async function fetchData() {
      const [convRes, segRes] = await Promise.all([
        supabase.from("conversations").select("*").eq("id", id).single(),
        supabase
          .from("analysis_segments")
          .select("*")
          .eq("conversation_id", id)
          .order("timestamp", { ascending: true }),
      ]);

      if (convRes.data) setConversation(convRes.data);
      if (segRes.data) setSegments(segRes.data);
      setLoadingData(false);
    }

    fetchData();
  }, [user, id]);

  // Auto-translate when conversation loads and language is not English
  useEffect(() => {
    if (!conversation || i18n.language === "en") {
      if (conversation) {
        setTDiagnosis(conversation.diagnosis || "");
        setTSummary(conversation.summary || "");
        setTInsights(conversation.insights || []);
        setTFollowUp(conversation.follow_up_actions || []);
        setTStrengths(conversation.strengths || []);
        setTImprovements(conversation.improvements || []);
      }
      return;
    }

    const fields: Record<string, string | string[]> = {};
    if (conversation.diagnosis) fields.diagnosis = conversation.diagnosis;
    if (conversation.summary) fields.summary = conversation.summary;
    if (conversation.insights?.length) fields.insights = conversation.insights;
    if (conversation.follow_up_actions?.length) fields.followUpActions = conversation.follow_up_actions;
    if (conversation.strengths?.length) fields.strengths = conversation.strengths;
    if (conversation.improvements?.length) fields.improvements = conversation.improvements;

    if (Object.keys(fields).length === 0) return;

    translate(fields).then((tr) => {
      setTDiagnosis((tr.diagnosis as string) || conversation.diagnosis || "");
      setTSummary((tr.summary as string) || conversation.summary || "");
      setTInsights((tr.insights as string[]) || conversation.insights || []);
      setTFollowUp((tr.followUpActions as string[]) || conversation.follow_up_actions || []);
      setTStrengths((tr.strengths as string[]) || conversation.strengths || []);
      setTImprovements((tr.improvements as string[]) || conversation.improvements || []);
    });
  }, [conversation, i18n.language, translate]);

  // Classification labels via i18n
  const CLASSIFICATION_LABELS: Record<ConversationClassification, string> = {
    very_positive: t("report.veryPositive"),
    positive: t("report.positive"),
    neutral: t("report.neutral"),
    awkward: t("report.awkward"),
    negative: t("report.negative"),
  };

  const CLASSIFICATION_COLORS: Record<ConversationClassification, { color: string; bg: string }> = {
    very_positive: { color: "var(--color-positive)", bg: "rgba(52, 211, 153, 0.12)" },
    positive:      { color: "var(--color-positive)", bg: "rgba(52, 211, 153, 0.08)" },
    neutral:       { color: "var(--color-neutral)",  bg: "rgba(251, 191, 36, 0.08)" },
    awkward:       { color: "var(--color-neutral)",  bg: "rgba(251, 191, 36, 0.12)" },
    negative:      { color: "var(--color-negative)", bg: "rgba(248, 113, 113, 0.12)" },
  };

  // Tone label translation
  const toneLabel = (tone: string) => {
    if (tone === "positive") return t("common.positive");
    if (tone === "negative") return t("common.negative");
    return t("common.neutral");
  };

  // Calculate tone distribution
  const toneCount: Record<string, number> = {};
  segments.forEach((s) => {
    toneCount[s.tone] = (toneCount[s.tone] || 0) + 1;
  });
  const total = segments.length || 1;

  const classification = conversation?.classification as ConversationClassification | null;
  const classColors = classification ? CLASSIFICATION_COLORS[classification] : null;
  const classLabel = classification ? CLASSIFICATION_LABELS[classification] : null;
  const score = conversation?.score;
  const duration = conversation ? formatDuration(conversation.created_at, conversation.ended_at) : "--";

  return (
    <AppShell>
      <div style={{ maxWidth: 800 }}>
        {loadingData ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-xl shimmer" style={{ backgroundColor: "var(--color-surface-2)" }} />
            ))}
          </div>
        ) : !conversation ? (
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold mb-4">{t("report.notFound")}</h1>
            <Link href="/dashboard" style={{ color: "var(--color-accent-light)" }}>
              {t("report.backToDashboard")}
            </Link>
          </div>
        ) : (
          <>
            <Link
              href="/history"
              className="text-xs mb-6 inline-flex items-center gap-1 no-underline"
              style={{ color: "var(--color-text-muted)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              {t("report.backToHistory")}
            </Link>

            <h1 className="section-heading text-glow mb-1">{t("report.title")}</h1>
            <p className="text-sm mb-8" style={{ color: "var(--color-text-muted)" }}>
              {conversation.title}
            </p>

            {/* Top KPI row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
              <div className="kpi-card flex flex-col items-center text-center">
                <span className="text-xs mb-2" style={{ color: "var(--color-text-muted)" }}>{t("report.score")}</span>
                <span className="text-3xl font-bold" style={{ color: score ? getScoreColor(score.overall) : "var(--color-text-muted)" }}>
                  {score?.overall ?? "--"}
                </span>
                <span className="text-[10px] mt-1" style={{ color: "var(--color-text-muted)" }}>/100</span>
              </div>

              {classColors && classLabel && (
                <div className="kpi-card flex flex-col items-center text-center">
                  <span className="text-xs mb-2" style={{ color: "var(--color-text-muted)" }}>{t("report.verdict")}</span>
                  <span className="text-sm font-bold px-3 py-1 rounded-md" style={{ backgroundColor: classColors.bg, color: classColors.color }}>
                    {classLabel}
                  </span>
                </div>
              )}

              {conversation.overall_tone && (
                <div className="kpi-card flex flex-col items-center text-center">
                  <span className="text-xs mb-2" style={{ color: "var(--color-text-muted)" }}>{t("report.tone")}</span>
                  <ToneIndicator tone={conversation.overall_tone as Tone} size="md" />
                </div>
              )}

              <div className="kpi-card flex flex-col items-center text-center">
                <span className="text-xs mb-2" style={{ color: "var(--color-text-muted)" }}>{t("report.duration")}</span>
                <span className="text-xl font-bold">{duration}</span>
              </div>

              <div className="kpi-card flex flex-col items-center text-center">
                <span className="text-xs mb-2" style={{ color: "var(--color-text-muted)" }}>{t("report.segments")}</span>
                <span className="text-xl font-bold">{segments.length}</span>
              </div>
            </div>

            {/* Score Breakdown */}
            {score && (
              <div className="glass-card p-4 sm:p-6 mb-6">
                <span className="text-xs font-medium uppercase tracking-wider block mb-4" style={{ color: "var(--color-accent-light)" }}>
                  {t("report.performanceBreakdown")}
                </span>
                <div className="space-y-3">
                  <ScoreBar label={t("report.engagement")} value={score.engagement} color={getScoreColor(score.engagement)} />
                  <ScoreBar label={t("report.toneScore")} value={score.tone} color={getScoreColor(score.tone)} />
                  <ScoreBar label={t("report.fluidity")} value={score.fluidity} color={getScoreColor(score.fluidity)} />
                  <ScoreBar label={t("report.interest")} value={score.interest} color={getScoreColor(score.interest)} />
                </div>
              </div>
            )}

            {/* Social Attractiveness Score */}
            {conversation.social_score != null && conversation.social_score > 0 && (
              <div className="glass-card p-4 sm:p-6 mb-6 flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider block mb-1" style={{ color: "var(--color-accent-light)" }}>
                    {t("report.socialAttractiveness")}
                  </span>
                  <p className="text-xs m-0" style={{ color: "var(--color-text-muted)" }}>
                    {t("report.socialAttractivenessDesc")}
                  </p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold" style={{ color: getScoreColor(conversation.social_score) }}>
                    {conversation.social_score}
                  </span>
                  <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>/100</span>
                </div>
              </div>
            )}

            {/* Tone distribution bar */}
            {segments.length > 0 && (
              <div className="glass-card p-5 mb-6">
                <span className="text-xs font-medium uppercase tracking-wider block mb-3" style={{ color: "var(--color-text-muted)" }}>
                  {t("report.toneDistribution")}
                </span>
                <div className="sentiment-bar" style={{ height: 8 }}>
                  {Object.entries(toneCount).map(([tone, count]) => (
                    <div
                      key={tone}
                      style={{
                        width: `${(count / total) * 100}%`,
                        backgroundColor:
                          tone === "positive" ? "var(--color-positive)"
                          : tone === "negative" ? "var(--color-negative)"
                          : "var(--color-neutral)",
                      }}
                    />
                  ))}
                </div>
                <div className="flex gap-4 mt-3">
                  {Object.entries(toneCount).map(([tone, count]) => (
                    <div key={tone} className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            tone === "positive" ? "var(--color-positive)"
                            : tone === "negative" ? "var(--color-negative)"
                            : "var(--color-neutral)",
                        }}
                      />
                      <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                        {toneLabel(tone)}: {count} ({Math.round((count / total) * 100)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Diagnosis */}
            {conversation.diagnosis && (
              <div className="glass-card p-4 sm:p-6 mb-6" style={{ borderColor: "rgba(200, 200, 216, 0.15)" }}>
                <span className="text-xs font-medium uppercase tracking-wider block mb-3" style={{ color: "var(--color-accent-light)" }}>
                  {t("report.diagnosis")}
                </span>
                <p className="text-sm m-0 leading-relaxed" style={{ color: "var(--color-text)" }}>
                  {tDiagnosis || conversation.diagnosis}
                  {translating && <span className="text-xs ml-2" style={{ color: "var(--color-text-muted)" }}>...</span>}
                </p>
              </div>
            )}

            {/* Insights */}
            {(tInsights.length > 0 || (conversation.insights && conversation.insights.length > 0)) && (
              <div className="glass-card p-4 sm:p-6 mb-6">
                <span className="text-xs font-medium uppercase tracking-wider block mb-4"
                  style={{ color: "var(--color-accent-light)" }}>
                  {t("report.keyInsights")}
                </span>
                <div className="space-y-3">
                  {(tInsights.length > 0 ? tInsights : conversation.insights || []).map((insight, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-xs font-bold"
                        style={{ backgroundColor: "rgba(200,200,216,0.08)", color: "var(--color-accent-light)" }}>
                        {i + 1}
                      </div>
                      <p className="text-sm m-0 leading-relaxed" style={{ color: "var(--color-text)" }}>
                        {insight}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendation */}
            {conversation.summary && (
              <div className="glass-card p-4 sm:p-6 mb-6" style={{ borderColor: "rgba(52,211,153,0.15)" }}>
                <span className="text-xs font-medium uppercase tracking-wider block mb-3"
                  style={{ color: "var(--color-positive)" }}>
                  {t("report.recommendation")}
                </span>
                <p className="text-sm m-0 leading-relaxed" style={{ color: "var(--color-text)" }}>
                  {tSummary || conversation.summary}
                </p>
              </div>
            )}

            {/* Follow-up Actions */}
            {(tFollowUp.length > 0 || (conversation.follow_up_actions && conversation.follow_up_actions.length > 0)) && (
              <div className="glass-card p-4 sm:p-6 mb-6">
                <span className="text-xs font-medium uppercase tracking-wider block mb-4"
                  style={{ color: "var(--color-neutral)" }}>
                  {t("report.followUpActions")}
                </span>
                <div className="space-y-2">
                  {(tFollowUp.length > 0 ? tFollowUp : conversation.follow_up_actions || []).map((action, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-4 h-4 rounded border shrink-0 mt-0.5" style={{ borderColor: "var(--color-text-muted)" }} />
                      <p className="text-sm m-0 leading-relaxed" style={{ color: "var(--color-text)" }}>
                        {action}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths & Improvements */}
            {(tStrengths.length > 0 || tImprovements.length > 0 || conversation.strengths?.length || conversation.improvements?.length) ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {(tStrengths.length > 0 || (conversation.strengths && conversation.strengths.length > 0)) && (
                  <div className="glass-card p-4 sm:p-6" style={{ borderLeft: "3px solid var(--color-positive)" }}>
                    <span className="text-xs font-medium uppercase tracking-wider block mb-3" style={{ color: "var(--color-positive)" }}>{t("report.strengths")}</span>
                    <div className="space-y-2">
                      {(tStrengths.length > 0 ? tStrengths : conversation.strengths || []).map((s, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5" style={{ color: "var(--color-positive)" }}><polyline points="20 6 9 17 4 12" /></svg>
                          <p className="text-sm m-0" style={{ color: "var(--color-text)" }}>{s}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {(tImprovements.length > 0 || (conversation.improvements && conversation.improvements.length > 0)) && (
                  <div className="glass-card p-4 sm:p-6" style={{ borderLeft: "3px solid var(--color-neutral)" }}>
                    <span className="text-xs font-medium uppercase tracking-wider block mb-3" style={{ color: "var(--color-neutral)" }}>{t("report.toImprove")}</span>
                    <div className="space-y-2">
                      {(tImprovements.length > 0 ? tImprovements : conversation.improvements || []).map((imp, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5" style={{ color: "var(--color-neutral)" }}><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                          <p className="text-sm m-0" style={{ color: "var(--color-text)" }}>{imp}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {/* Full transcript */}
            <h2 className="card-title text-base mb-4">{t("report.fullTranscript")}</h2>
            <div className="glass-card overflow-hidden">
              {segments.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    {t("report.noTranscript")}
                  </p>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: "rgba(39,39,42,0.5)" }}>
                  {segments.map((seg) => (
                    <div key={seg.id} className="p-4 flex items-start gap-4">
                      <ToneIndicator tone={seg.tone} size="sm" showLabel={false} />
                      <div className="flex-1">
                        <p className="text-sm m-0" style={{ color: "var(--color-text)" }}>
                          {seg.transcript}
                        </p>
                        <span className="text-xs mt-1 block" style={{ color: "var(--color-text-muted)" }}>
                          {new Date(seg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}

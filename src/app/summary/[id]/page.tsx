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

/* ------------------------------------------------------------------ */
/*  Score Ring — circular gauge for the hero score                     */
/* ------------------------------------------------------------------ */
function ScoreRing({ value, size = 96 }: { value: number; size?: number }) {
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(value, 0), 100);
  const offset = circumference - (progress / 100) * circumference;
  const color = getScoreColor(value);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="score-ring-svg">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="score-ring-progress"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold leading-none" style={{ color }}>{value}</span>
        <span className="text-[10px] mt-0.5" style={{ color: "var(--color-text-muted)" }}>/100</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Compact Score Bar                                                  */
/* ------------------------------------------------------------------ */
function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = getScoreColor(value);
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="text-[11px] w-17 shrink-0 truncate" style={{ color: "var(--color-text-muted)" }}>{label}</span>
      <div className="score-bar-track flex-1">
        <div className="score-bar-fill" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-[11px] font-semibold w-6 text-right tabular-nums" style={{ color }}>{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ------------------------------------------------------------------ */
/*  Classification config                                              */
/* ------------------------------------------------------------------ */
const CLASSIFICATION_COLORS: Record<ConversationClassification, { color: string; bg: string }> = {
  very_positive: { color: "var(--color-positive)", bg: "rgba(52, 211, 153, 0.12)" },
  positive:      { color: "var(--color-positive)", bg: "rgba(52, 211, 153, 0.08)" },
  neutral:       { color: "var(--color-neutral)",  bg: "rgba(251, 191, 36, 0.08)" },
  awkward:       { color: "var(--color-neutral)",  bg: "rgba(251, 191, 36, 0.12)" },
  negative:      { color: "var(--color-negative)", bg: "rgba(248, 113, 113, 0.12)" },
};

/* ================================================================== */
/*  MAIN PAGE                                                          */
/* ================================================================== */
export default function SummaryPage() {
  const { user } = useAuth();
  const params = useParams();
  const { t, i18n } = useTranslation();
  const id = params.id as string;
  const { translate, translating } = useTranslateFields();

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [segments, setSegments] = useState<AnalysisSegment[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [transcriptOpen, setTranscriptOpen] = useState(false);

  // Translated fields
  const [tDiagnosis, setTDiagnosis] = useState("");
  const [tSummary, setTSummary] = useState("");
  const [tInsights, setTInsights] = useState<string[]>([]);
  const [tFollowUp, setTFollowUp] = useState<string[]>([]);
  const [tStrengths, setTStrengths] = useState<string[]>([]);
  const [tImprovements, setTImprovements] = useState<string[]>([]);

  /* ---- Data fetch ---- */
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

  /* ---- Translation ---- */
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

  /* ---- Derived data ---- */
  const CLASSIFICATION_LABELS: Record<ConversationClassification, string> = {
    very_positive: t("report.veryPositive"),
    positive: t("report.positive"),
    neutral: t("report.neutral"),
    awkward: t("report.awkward"),
    negative: t("report.negative"),
  };

  const toneLabel = (tone: string) => {
    if (tone === "positive") return t("common.positive");
    if (tone === "negative") return t("common.negative");
    if (tone === "hesitant") return t("common.neutral");
    return t("common.neutral");
  };

  const toneCount: Record<string, number> = {};
  segments.forEach((s) => { toneCount[s.tone] = (toneCount[s.tone] || 0) + 1; });
  const total = segments.length || 1;

  const classification = conversation?.classification as ConversationClassification | null;
  const classColors = classification ? CLASSIFICATION_COLORS[classification] : null;
  const classLabel = classification ? CLASSIFICATION_LABELS[classification] : null;
  const score = conversation?.score;
  const duration = conversation ? formatDuration(conversation.created_at, conversation.ended_at) : "--";

  const diagnosis = tDiagnosis || conversation?.diagnosis || "";
  const summary = tSummary || conversation?.summary || "";
  const insights = tInsights.length > 0 ? tInsights : conversation?.insights || [];
  const followUp = tFollowUp.length > 0 ? tFollowUp : conversation?.follow_up_actions || [];
  const strengths = tStrengths.length > 0 ? tStrengths : conversation?.strengths || [];
  const improvements = tImprovements.length > 0 ? tImprovements : conversation?.improvements || [];

  const hasAnalysis = diagnosis || insights.length > 0 || summary;
  const hasActions = strengths.length > 0 || improvements.length > 0 || followUp.length > 0;

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */
  return (
    <AppShell>
      <div style={{ maxWidth: 720 }}>
        {loadingData ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-2xl shimmer" style={{ backgroundColor: "var(--color-surface-2)" }} />
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
            {/* Navigation */}
            <Link
              href="/history"
              className="text-xs mb-8 inline-flex items-center gap-1.5 no-underline transition-colors hover:opacity-80"
              style={{ color: "var(--color-text-muted)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              {t("report.backToHistory")}
            </Link>

            {/* Page header */}
            <div className="mb-8">
              <h1 className="text-xl font-bold mb-1" style={{ color: "var(--color-text)" }}>
                {t("report.title")}
              </h1>
              <p className="text-xs m-0" style={{ color: "var(--color-text-muted)" }}>
                {conversation.title} &middot; {formatDate(conversation.created_at)}
              </p>
            </div>

            {/* ============================================ */}
            {/*  BLOCK 1 — Overview                          */}
            {/* ============================================ */}
            <div className="glass-card p-6 mb-5">
              <div className="flex items-start gap-6">
                {/* Score ring */}
                {score && (
                  <div className="shrink-0">
                    <ScoreRing value={score.overall} />
                  </div>
                )}

                {/* Meta + bars */}
                <div className="flex-1 min-w-0">
                  {/* Quick meta row */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    {classColors && classLabel && (
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-md"
                        style={{ backgroundColor: classColors.bg, color: classColors.color }}>
                        {classLabel}
                      </span>
                    )}
                    {conversation.overall_tone && (
                      <ToneIndicator tone={conversation.overall_tone as Tone} size="sm" />
                    )}
                    <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                      {duration}
                    </span>
                  </div>

                  {/* Score bars — compact 2-column grid */}
                  {score && (
                    <div className="grid grid-cols-2 gap-x-5 gap-y-2">
                      <ScoreBar label={t("report.engagement")} value={score.engagement} />
                      <ScoreBar label={t("report.toneScore")} value={score.tone} />
                      <ScoreBar label={t("report.fluidity")} value={score.fluidity} />
                      <ScoreBar label={t("report.interest")} value={score.interest} />
                    </div>
                  )}
                </div>
              </div>

              {/* Tone distribution mini-bar */}
              {segments.length > 0 && (
                <div className="mt-5 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="sentiment-bar" style={{ height: 6 }}>
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
                  <div className="flex gap-4 mt-2">
                    {Object.entries(toneCount).map(([tone, count]) => (
                      <div key={tone} className="flex items-center gap-1.5">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor:
                              tone === "positive" ? "var(--color-positive)"
                              : tone === "negative" ? "var(--color-negative)"
                              : "var(--color-neutral)",
                          }}
                        />
                        <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                          {toneLabel(tone)} {Math.round((count / total) * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ============================================ */}
            {/*  BLOCK 2 — Analysis                          */}
            {/*  (diagnosis + insights + recommendation)     */}
            {/* ============================================ */}
            {hasAnalysis && (
              <div className="glass-card p-6 mb-5">
                <span className="text-[11px] font-semibold uppercase tracking-wider block mb-4"
                  style={{ color: "var(--color-accent-light)" }}>
                  {t("report.analysis")}
                </span>

                {/* Diagnosis paragraph */}
                {diagnosis && (
                  <p className="text-sm m-0 leading-relaxed mb-4" style={{ color: "var(--color-text)" }}>
                    {diagnosis}
                    {translating && <span className="text-xs ml-2" style={{ color: "var(--color-text-muted)" }}>...</span>}
                  </p>
                )}

                {/* Key takeaways */}
                {insights.length > 0 && (
                  <div className="mb-4">
                    <span className="text-[11px] font-medium uppercase tracking-wider block mb-3"
                      style={{ color: "var(--color-text-muted)" }}>
                      {t("report.keyTakeaways")}
                    </span>
                    <div className="space-y-2.5">
                      {insights.map((insight, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div
                            className="w-4.5 h-4.5 rounded flex items-center justify-center shrink-0 text-[10px] font-bold"
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

                {/* Recommendation callout */}
                {summary && (
                  <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.1)" }}>
                    <div className="flex items-start gap-2.5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-positive)" strokeWidth="2" className="shrink-0 mt-0.5">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                      </svg>
                      <p className="text-sm m-0 leading-relaxed" style={{ color: "var(--color-text)" }}>
                        {summary}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ============================================ */}
            {/*  BLOCK 3 — Strengths / Improvements / Next   */}
            {/* ============================================ */}
            {hasActions && (
              <div className="mb-5">
                {/* Strengths + Improvements side by side */}
                {(strengths.length > 0 || improvements.length > 0) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {strengths.length > 0 && (
                      <div className="glass-card p-5" style={{ borderLeft: "3px solid var(--color-positive)" }}>
                        <span className="text-[11px] font-semibold uppercase tracking-wider block mb-3"
                          style={{ color: "var(--color-positive)" }}>
                          {t("report.strengths")}
                        </span>
                        <div className="space-y-2">
                          {strengths.map((s, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                                className="shrink-0 mt-0.5" style={{ color: "var(--color-positive)" }}>
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              <p className="text-sm m-0" style={{ color: "var(--color-text)" }}>{s}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {improvements.length > 0 && (
                      <div className="glass-card p-5" style={{ borderLeft: "3px solid var(--color-neutral)" }}>
                        <span className="text-[11px] font-semibold uppercase tracking-wider block mb-3"
                          style={{ color: "var(--color-neutral)" }}>
                          {t("report.toImprove")}
                        </span>
                        <div className="space-y-2">
                          {improvements.map((imp, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                className="shrink-0 mt-0.5" style={{ color: "var(--color-neutral)" }}>
                                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                              </svg>
                              <p className="text-sm m-0" style={{ color: "var(--color-text)" }}>{imp}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Next Steps */}
                {followUp.length > 0 && (
                  <div className="glass-card p-5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider block mb-3"
                      style={{ color: "var(--color-accent-light)" }}>
                      {t("report.nextSteps")}
                    </span>
                    <div className="space-y-2">
                      {followUp.map((action, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div className="w-4 h-4 rounded border shrink-0 mt-0.5"
                            style={{ borderColor: "rgba(200,200,216,0.2)" }} />
                          <p className="text-sm m-0 leading-relaxed" style={{ color: "var(--color-text)" }}>
                            {action}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ============================================ */}
            {/*  BLOCK 4 — Transcript (collapsible)          */}
            {/* ============================================ */}
            <button
              onClick={() => setTranscriptOpen(!transcriptOpen)}
              className="w-full text-left glass-card p-4 flex items-center justify-between cursor-pointer border-0 bg-transparent transition-all hover:opacity-80"
              style={{ color: "var(--color-text-muted)" }}>
              <span className="text-xs font-medium">
                {t("report.fullTranscript")} ({segments.length})
              </span>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2"
                className="transition-transform"
                style={{ transform: transcriptOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {transcriptOpen && (
              <div className="glass-card overflow-hidden mt-1 mb-5">
                {segments.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-sm m-0" style={{ color: "var(--color-text-muted)" }}>
                      {t("report.noTranscript")}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y" style={{ borderColor: "rgba(39,39,42,0.5)" }}>
                    {segments.map((seg) => (
                      <div key={seg.id} className="p-3.5 flex items-start gap-3">
                        <ToneIndicator tone={seg.tone} size="sm" showLabel={false} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm m-0 leading-relaxed" style={{ color: "var(--color-text)" }}>
                            {seg.transcript}
                          </p>
                          <span className="text-[10px] mt-1 block" style={{ color: "var(--color-text-muted)" }}>
                            {new Date(seg.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}

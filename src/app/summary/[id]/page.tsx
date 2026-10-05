"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth-context";
import { getConversation } from "@/lib/conversations-client";
import { useTranslateFields } from "@/hooks/useTranslateFields";
import AppShell from "@/components/AppShell";
import ToneIndicator from "@/components/ToneIndicator";
import CountUp from "@/components/motion/CountUp";
import type { Conversation, AnalysisSegment } from "@/types/database";
import type { Tone, ConversationClassification } from "@/types/analysis";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ */
/*  Score Ring — circular gauge with vibrant glow                     */
/* ------------------------------------------------------------------ */
function ScoreRing({ value, size = 144, reduce }: { value: number; size?: number; reduce?: boolean | null }) {
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(value, 0), 100);
  const dashLen = (progress / 100) * circumference;
  const color = getScoreColor(value);
  const rgba = getScoreRgba(value);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)", overflow: "visible" }}
      >
        <defs>
          <filter id={`score-glow-${value}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="color-mix(in srgb, var(--color-text) 5%, transparent)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDashoffset={0}
          initial={reduce ? undefined : { strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: `${dashLen} ${circumference}` }}
          transition={{ duration: 1.4, ease: EASE_OUT, delay: 0.3 }}
          style={{ filter: `url(#score-glow-${value})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="font-extralight tabular-nums leading-none"
          animate={reduce ? undefined : { opacity: [0.92, 1, 0.92] }}
          transition={
            reduce
              ? undefined
              : { duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 1.6 }
          }
          style={{
            fontSize: size > 120 ? "clamp(40px, 5vw, 56px)" : "clamp(28px, 3.4vw, 38px)",
            color,
            letterSpacing: "-0.04em",
            textShadow: `0 0 24px rgba(${rgba}, 0.35), 0 0 4px rgba(${rgba}, 0.4)`,
          }}
        >
          <CountUp value={value} duration={1.4} />
        </motion.span>
        <span
          className="text-[10px] uppercase tracking-[0.18em] mt-1"
          style={{ color: "var(--color-text-muted)" }}
        >
          / 100
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Compact Score Bar                                                  */
/* ------------------------------------------------------------------ */
function ScoreBar({ label, value, delay = 0, reduce }: { label: string; value: number; delay?: number; reduce?: boolean | null }) {
  const color = getScoreColor(value);
  const rgba = getScoreRgba(value);
  return (
    <div className="flex items-center gap-3 min-w-0">
      <span
        className="text-[10px] uppercase tracking-[0.16em] shrink-0 truncate"
        style={{ color: "var(--color-text-muted)", width: 84 }}
      >
        {label}
      </span>
      <div
        className="flex-1 relative rounded-full overflow-hidden"
        style={{ height: 4, background: "color-mix(in srgb, var(--color-text) 4%, transparent)" }}
      >
        <motion.span
          className="absolute inset-y-0 left-0 rounded-full"
          initial={reduce ? { width: `${value}%` } : { width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: EASE_OUT, delay: delay + 0.4 }}
          style={{
            background: `linear-gradient(90deg, ${color}, rgba(${rgba}, 0.7))`,
            boxShadow: `0 0 12px rgba(${rgba}, 0.45)`,
          }}
        />
      </div>
      <span
        className="text-xs font-medium tabular-nums shrink-0 text-right"
        style={{ color, width: 28 }}
      >
        <CountUp value={value} duration={1} />
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function getScoreColor(score: number) {
  if (score >= 70) return "var(--color-positive)";
  if (score >= 40) return "#fb923c";
  return "var(--color-negative)";
}

function getScoreRgba(score: number) {
  if (score >= 70) return "52, 211, 153";
  if (score >= 40) return "251, 146, 60";
  return "239, 68, 68";
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
/*  Classification config — vibrant green / orange / red               */
/* ------------------------------------------------------------------ */
const CLASSIFICATION_COLORS: Record<ConversationClassification, { color: string; bg: string; border: string }> = {
  very_positive: { color: "var(--color-positive)", bg: "rgba(52, 211, 153, 0.12)", border: "rgba(52, 211, 153, 0.28)" },
  positive:      { color: "var(--color-positive)", bg: "rgba(52, 211, 153, 0.08)", border: "rgba(52, 211, 153, 0.22)" },
  neutral:       { color: "#fb923c", bg: "rgba(251, 146, 60, 0.08)", border: "rgba(251, 146, 60, 0.22)" },
  awkward:       { color: "#fb923c", bg: "rgba(251, 146, 60, 0.12)", border: "rgba(251, 146, 60, 0.28)" },
  negative:      { color: "var(--color-negative)", bg: "rgba(239, 68, 68, 0.12)", border: "rgba(239, 68, 68, 0.28)" },
};

/* ================================================================== */
/*  MAIN PAGE                                                          */
/* ================================================================== */
export default function SummaryPage() {
  const { user } = useAuth();
  const params = useParams();
  const { t, i18n } = useTranslation();
  const reduce = useReducedMotion();
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
      try {
        const res = await getConversation<Conversation, AnalysisSegment>(id);
        if (res) {
          setConversation(res.conversation);
          setSegments(res.segments);
        }
      } catch (err) {
        console.error("Summary fetch failed:", err);
      } finally {
        setLoadingData(false);
      }
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
      <div style={{ position: "relative", maxWidth: 880, margin: "0 auto", paddingBottom: 80 }}>
        {/* Ambient orb */}
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            top: -130,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "radial-gradient(circle, color-mix(in srgb, var(--color-text) 5%, transparent), transparent 65%)",
            filter: "blur(70px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
          animate={reduce ? undefined : { x: [-15, 15, -15], y: [-12, 12, -12] }}
          transition={reduce ? undefined : { duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          {loadingData ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 rounded-2xl shimmer" style={{ backgroundColor: "color-mix(in srgb, var(--color-text) 2%, transparent)" }} />
              ))}
            </div>
          ) : !conversation ? (
            <div className="text-center py-20">
              <h1 className="text-2xl font-light mb-4" style={{ color: "var(--color-text)" }}>{t("report.notFound")}</h1>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-sm no-underline px-4 py-2 rounded-full"
                style={{
                  background: "color-mix(in srgb, var(--color-text) 4%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--color-text) 8%, transparent)",
                  color: "var(--color-text)",
                }}
              >
                {t("report.backToDashboard")}
              </Link>
            </div>
          ) : (
            <>
              {/* Back link */}
              <Link
                href="/history"
                className="inline-flex items-center gap-1.5 mb-6 text-[11px] uppercase tracking-[0.18em] no-underline group"
                style={{ color: "var(--color-text-muted)" }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="transition-transform group-hover:-translate-x-0.5"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                {t("report.backToHistory")}
              </Link>

              {/* ========== HERO ========== */}
              <motion.div
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
                className="mb-8"
              >
                <div className="flex items-center gap-2.5 mb-4 flex-wrap">
                  <span className="relative inline-flex w-1.5 h-1.5">
                    <span
                      className="absolute inset-0 rounded-full"
                      style={{
                        backgroundColor: "color-mix(in srgb, var(--color-text) 85%, transparent)",
                        opacity: 0.5,
                        animation: "pulseRing 2.4s ease-in-out infinite",
                      }}
                    />
                    <span
                      className="relative w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: "color-mix(in srgb, var(--color-text) 90%, transparent)" }}
                    />
                  </span>
                  <span
                    className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {t("report.title")} · {formatDate(conversation.created_at)} · {duration}
                  </span>
                </div>

                <motion.h1
                  className="m-0 wrap-break-word"
                  animate={reduce ? undefined : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={
                    reduce
                      ? undefined
                      : { duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }
                  }
                  style={{
                    fontSize: "clamp(28px, 4.4vw, 44px)",
                    fontWeight: 200,
                    letterSpacing: "-0.035em",
                    lineHeight: 1.08,
                    background:
                      "linear-gradient(115deg, var(--color-text) 0%, var(--color-text) 30%, var(--color-text-silver) 50%, var(--color-text) 70%, var(--color-text) 100%)",
                    backgroundSize: "240% 100%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {conversation.title}
                </motion.h1>

                {/* meta row */}
                <div className="flex items-center gap-2 mt-4 flex-wrap">
                  {classColors && classLabel && (
                    <span
                      className="text-[10px] uppercase tracking-[0.18em] font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: classColors.bg,
                        color: classColors.color,
                        border: `1px solid ${classColors.border}`,
                      }}
                    >
                      {classLabel}
                    </span>
                  )}
                  {conversation.overall_tone && (
                    <span
                      className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        background: "color-mix(in srgb, var(--color-text) 4%, transparent)",
                        border: "1px solid color-mix(in srgb, var(--color-text) 6%, transparent)",
                        color: "var(--color-text-silver)",
                      }}
                    >
                      <ToneIndicator tone={conversation.overall_tone as Tone} size="sm" showLabel={false} />
                      {conversation.overall_tone}
                    </span>
                  )}
                </div>
              </motion.div>

              {/* ============================================ */}
              {/*  BLOCK 1 — Overview                          */}
              {/* ============================================ */}
              <motion.div
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.15 }}
                className="relative overflow-hidden rounded-2xl p-5 sm:p-6 mb-4"
                style={{
                  background:
                    "linear-gradient(135deg, color-mix(in srgb, var(--color-text) 4%, transparent) 0%, color-mix(in srgb, var(--color-text) 1%, transparent) 100%)",
                  border: "1px solid color-mix(in srgb, var(--color-text) 6%, transparent)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                }}
              >
                <span
                  aria-hidden
                  className="absolute -top-12 -right-12 w-44 h-44 rounded-full pointer-events-none"
                  style={{
                    background: score
                      ? `radial-gradient(circle, rgba(${getScoreRgba(score.overall)}, 0.20), transparent 70%)`
                      : "radial-gradient(circle, color-mix(in srgb, var(--color-text) 10%, transparent), transparent 70%)",
                    filter: "blur(28px)",
                    opacity: 0.6,
                  }}
                />

                <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
                  {/* Score ring */}
                  {score && (
                    <div className="shrink-0">
                      <ScoreRing value={score.overall} reduce={reduce} />
                    </div>
                  )}

                  {/* Score bars */}
                  {score && (
                    <div className="flex-1 min-w-0 w-full grid gap-3 self-center">
                      <ScoreBar label={t("report.engagement")} value={score.engagement} delay={0.0} reduce={reduce} />
                      <ScoreBar label={t("report.toneScore")} value={score.tone} delay={0.05} reduce={reduce} />
                      <ScoreBar label={t("report.fluidity")} value={score.fluidity} delay={0.1} reduce={reduce} />
                      <ScoreBar label={t("report.interest")} value={score.interest} delay={0.15} reduce={reduce} />
                    </div>
                  )}
                </div>

                {/* Tone distribution ribbon */}
                {segments.length > 0 && (
                  <div className="relative mt-6 pt-5" style={{ borderTop: "1px solid color-mix(in srgb, var(--color-text) 5%, transparent)" }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="text-[10px] uppercase tracking-[0.22em] font-semibold"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        Tone distribution
                      </span>
                      <span
                        aria-hidden
                        className="flex-1 h-px"
                        style={{
                          background: "linear-gradient(90deg, color-mix(in srgb, var(--color-text) 6%, transparent), transparent 80%)",
                        }}
                      />
                    </div>
                    <div
                      className="relative rounded-full overflow-hidden flex"
                      style={{ height: 6, background: "color-mix(in srgb, var(--color-text) 4%, transparent)" }}
                    >
                      {Object.entries(toneCount).map(([tone, count]) => {
                        const c =
                          tone === "positive"
                            ? "var(--color-positive)"
                            : tone === "negative"
                              ? "var(--color-negative)"
                              : "#fb923c";
                        const rgba =
                          tone === "positive"
                            ? "52, 211, 153"
                            : tone === "negative"
                              ? "239, 68, 68"
                              : "251, 146, 60";
                        return (
                          <motion.span
                            key={tone}
                            initial={reduce ? { width: `${(count / total) * 100}%` } : { width: 0 }}
                            animate={{ width: `${(count / total) * 100}%` }}
                            transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.6 }}
                            style={{
                              backgroundColor: c,
                              boxShadow: `0 0 12px rgba(${rgba}, 0.45)`,
                              display: "block",
                              height: "100%",
                            }}
                          />
                        );
                      })}
                    </div>
                    <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3">
                      {Object.entries(toneCount).map(([tone, count]) => {
                        const c =
                          tone === "positive"
                            ? "var(--color-positive)"
                            : tone === "negative"
                              ? "var(--color-negative)"
                              : "#fb923c";
                        return (
                          <div key={tone} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c }} />
                            <span
                              className="text-[10px] uppercase tracking-[0.14em]"
                              style={{ color: "var(--color-text-muted)" }}
                            >
                              {toneLabel(tone)}
                            </span>
                            <span className="text-[10px] tabular-nums" style={{ color: "var(--color-text)" }}>
                              {Math.round((count / total) * 100)}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* ============================================ */}
              {/*  BLOCK 2 — Analysis                          */}
              {/* ============================================ */}
              {hasAnalysis && (
                <motion.div
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.25 }}
                  className="relative overflow-hidden rounded-2xl p-5 sm:p-6 mb-4"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(167, 139, 250, 0.05) 0%, color-mix(in srgb, var(--color-text) 1%, transparent) 100%)",
                    border: "1px solid rgba(167, 139, 250, 0.14)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                  }}
                >
                  <span
                    aria-hidden
                    className="absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none"
                    style={{
                      background: "radial-gradient(circle, rgba(167, 139, 250, 0.22), transparent 70%)",
                      filter: "blur(28px)",
                      opacity: 0.55,
                    }}
                  />

                  <div className="relative">
                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className="inline-flex w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: "var(--shimmer-accent-1)" }}
                      />
                      <span
                        className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {t("report.analysis")}
                      </span>
                    </div>

                    {diagnosis && (
                      <p
                        className="text-sm m-0 leading-relaxed mb-5"
                        style={{ color: "var(--color-text)" }}
                      >
                        {diagnosis}
                        {translating && (
                          <span className="text-xs ml-2" style={{ color: "var(--color-text-muted)" }}>
                            …
                          </span>
                        )}
                      </p>
                    )}

                    {insights.length > 0 && (
                      <div className="mb-5">
                        <span
                          className="text-[10px] uppercase tracking-[0.22em] font-semibold block mb-3"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          {t("report.keyTakeaways")}
                        </span>
                        <div className="grid gap-3">
                          {insights.map((insight, i) => (
                            <motion.div
                              key={i}
                              initial={reduce ? { opacity: 0 } : { opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.3 + i * 0.06 }}
                              className="flex items-start gap-4"
                            >
                              <span
                                className="text-2xl font-extralight tabular-nums shrink-0 leading-none -mt-0.5"
                                style={{
                                  background: "linear-gradient(180deg, var(--shimmer-accent-1) 0%, rgba(167, 139, 250, 0.5) 100%)",
                                  WebkitBackgroundClip: "text",
                                  WebkitTextFillColor: "transparent",
                                  backgroundClip: "text",
                                  letterSpacing: "-0.03em",
                                }}
                              >
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <p
                                className="text-sm leading-relaxed m-0"
                                style={{ color: "var(--color-text-silver)" }}
                              >
                                {insight}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendation callout */}
                    {summary && (
                      <div
                        className="relative overflow-hidden rounded-2xl p-4 mt-1"
                        style={{
                          background: "linear-gradient(135deg, rgba(52, 211, 153, 0.08) 0%, color-mix(in srgb, var(--color-text) 1%, transparent) 100%)",
                          border: "1px solid rgba(52, 211, 153, 0.22)",
                        }}
                      >
                        <span
                          aria-hidden
                          className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none"
                          style={{
                            background: "radial-gradient(circle, rgba(52, 211, 153, 0.25), transparent 70%)",
                            filter: "blur(24px)",
                            opacity: 0.5,
                          }}
                        />
                        <div className="relative flex items-start gap-3">
                          <span
                            className="inline-flex items-center justify-center w-7 h-7 rounded-full shrink-0"
                            style={{
                              background: "rgba(52, 211, 153, 0.15)",
                              border: "1px solid rgba(52, 211, 153, 0.3)",
                            }}
                          >
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="var(--color-positive)"
                              strokeWidth="2"
                            >
                              <path d="M12 2L2 7l10 5 10-5-10-5z" />
                              <path d="M2 17l10 5 10-5" />
                              <path d="M2 12l10 5 10-5" />
                            </svg>
                          </span>
                          <p
                            className="text-sm m-0 leading-relaxed"
                            style={{ color: "var(--color-text)" }}
                          >
                            {summary}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ============================================ */}
              {/*  BLOCK 3 — Strengths / Improvements          */}
              {/* ============================================ */}
              {hasActions && (
                <div className="mb-4">
                  {(strengths.length > 0 || improvements.length > 0) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      {strengths.length > 0 && (
                        <motion.div
                          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.3 }}
                          className="relative overflow-hidden rounded-2xl p-5"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(52, 211, 153, 0.06) 0%, color-mix(in srgb, var(--color-text) 1%, transparent) 100%)",
                            border: "1px solid rgba(52, 211, 153, 0.18)",
                            backdropFilter: "blur(20px)",
                            WebkitBackdropFilter: "blur(20px)",
                          }}
                        >
                          <span
                            aria-hidden
                            className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none"
                            style={{
                              background: "radial-gradient(circle, rgba(52, 211, 153, 0.22), transparent 70%)",
                              filter: "blur(24px)",
                              opacity: 0.55,
                            }}
                          />
                          <div className="relative">
                            <div className="flex items-center gap-2 mb-4">
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--color-positive)" }} />
                              <span
                                className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                                style={{ color: "var(--color-positive)" }}
                              >
                                {t("report.strengths")}
                              </span>
                            </div>
                            <div className="space-y-3">
                              {strengths.map((s, i) => (
                                <div key={i} className="flex items-start gap-2.5">
                                  <span
                                    className="inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 mt-0.5"
                                    style={{
                                      background: "rgba(52, 211, 153, 0.12)",
                                      border: "1px solid rgba(52, 211, 153, 0.25)",
                                    }}
                                  >
                                    <svg
                                      width="10"
                                      height="10"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="var(--color-positive)"
                                      strokeWidth="2.5"
                                    >
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                  </span>
                                  <p className="text-sm m-0 leading-relaxed" style={{ color: "var(--color-text)" }}>
                                    {s}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                      {improvements.length > 0 && (
                        <motion.div
                          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.35 }}
                          className="relative overflow-hidden rounded-2xl p-5"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(251, 146, 60, 0.06) 0%, color-mix(in srgb, var(--color-text) 1%, transparent) 100%)",
                            border: "1px solid rgba(251, 146, 60, 0.20)",
                            backdropFilter: "blur(20px)",
                            WebkitBackdropFilter: "blur(20px)",
                          }}
                        >
                          <span
                            aria-hidden
                            className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none"
                            style={{
                              background: "radial-gradient(circle, rgba(251, 146, 60, 0.22), transparent 70%)",
                              filter: "blur(24px)",
                              opacity: 0.55,
                            }}
                          />
                          <div className="relative">
                            <div className="flex items-center gap-2 mb-4">
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#fb923c" }} />
                              <span
                                className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                                style={{ color: "#fb923c" }}
                              >
                                {t("report.toImprove")}
                              </span>
                            </div>
                            <div className="space-y-3">
                              {improvements.map((imp, i) => (
                                <div key={i} className="flex items-start gap-2.5">
                                  <span
                                    className="inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 mt-0.5"
                                    style={{
                                      background: "rgba(251, 146, 60, 0.12)",
                                      border: "1px solid rgba(251, 146, 60, 0.28)",
                                    }}
                                  >
                                    <svg
                                      width="10"
                                      height="10"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="#fb923c"
                                      strokeWidth="2"
                                    >
                                      <path d="M12 20h9" />
                                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                    </svg>
                                  </span>
                                  <p className="text-sm m-0 leading-relaxed" style={{ color: "var(--color-text)" }}>
                                    {imp}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {followUp.length > 0 && (
                    <motion.div
                      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.4 }}
                      className="relative overflow-hidden rounded-2xl p-5"
                      style={{
                        background:
                          "linear-gradient(135deg, color-mix(in srgb, var(--color-text) 4%, transparent) 0%, color-mix(in srgb, var(--color-text) 1%, transparent) 100%)",
                        border: "1px solid color-mix(in srgb, var(--color-text) 6%, transparent)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                      }}
                    >
                      <span
                        aria-hidden
                        className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none"
                        style={{
                          background: "radial-gradient(circle, color-mix(in srgb, var(--color-text) 14%, transparent), transparent 70%)",
                          filter: "blur(24px)",
                          opacity: 0.4,
                        }}
                      />
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-4">
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: "color-mix(in srgb, var(--color-text) 85%, transparent)" }}
                          />
                          <span
                            className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                            style={{ color: "var(--color-text-muted)" }}
                          >
                            {t("report.nextSteps")}
                          </span>
                        </div>
                        <div className="space-y-3">
                          {followUp.map((action, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <span
                                className="inline-flex items-center justify-center w-5 h-5 rounded-md shrink-0 mt-0.5 text-[10px] tabular-nums"
                                style={{
                                  background: "color-mix(in srgb, var(--color-text) 5%, transparent)",
                                  border: "1px solid color-mix(in srgb, var(--color-text) 8%, transparent)",
                                  color: "var(--color-text-muted)",
                                }}
                              >
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <p
                                className="text-sm m-0 leading-relaxed"
                                style={{ color: "var(--color-text)" }}
                              >
                                {action}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* ============================================ */}
              {/*  BLOCK 4 — Transcript (collapsible)          */}
              {/* ============================================ */}
              <button
                onClick={() => setTranscriptOpen(!transcriptOpen)}
                className="w-full text-left flex items-center justify-between cursor-pointer rounded-2xl px-5 py-4 mb-1"
                style={{
                  background: transcriptOpen ? "color-mix(in srgb, var(--color-text) 4%, transparent)" : "color-mix(in srgb, var(--color-text) 2%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--color-text) 6%, transparent)",
                  color: "var(--color-text)",
                  transition: "background 0.2s ease",
                }}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {t("report.fullTranscript")}
                  </span>
                  <span
                    className="text-[10px] tabular-nums px-2 py-0.5 rounded-full"
                    style={{
                      background: "color-mix(in srgb, var(--color-text) 4%, transparent)",
                      border: "1px solid color-mix(in srgb, var(--color-text) 6%, transparent)",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    {segments.length}
                  </span>
                </span>
                <motion.svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  animate={{ rotate: transcriptOpen ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  style={{ color: "var(--color-text-muted)" }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </motion.svg>
              </button>

              {transcriptOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.32, ease: EASE_OUT }}
                  style={{ overflow: "hidden" }}
                  className="rounded-2xl mb-5"
                >
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: "color-mix(in srgb, var(--color-text) 2%, transparent)",
                      border: "1px solid color-mix(in srgb, var(--color-text) 5%, transparent)",
                    }}
                  >
                    {segments.length === 0 ? (
                      <div className="p-8 text-center">
                        <p className="text-sm m-0" style={{ color: "var(--color-text-muted)" }}>
                          {t("report.noTranscript")}
                        </p>
                      </div>
                    ) : (
                      <div>
                        {segments.map((seg, idx) => (
                          <div
                            key={seg.id}
                            className="p-4 flex items-start gap-3"
                            style={{
                              borderTop:
                                idx === 0 ? "none" : "1px solid color-mix(in srgb, var(--color-text) 4%, transparent)",
                            }}
                          >
                            <ToneIndicator tone={seg.tone} size="sm" showLabel={false} />
                            <div className="flex-1 min-w-0">
                              <p
                                className="text-sm m-0 leading-relaxed"
                                style={{ color: "var(--color-text)" }}
                              >
                                {seg.transcript}
                              </p>
                              <span
                                className="text-[10px] mt-1 block tabular-nums"
                                style={{ color: "var(--color-text-muted)" }}
                              >
                                {new Date(seg.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}

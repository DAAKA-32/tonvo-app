"use client";

import { Suspense, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import AppShell from "@/components/AppShell";
import PlanUpgradeModal from "@/components/PlanUpgradeModal";
import CountUp from "@/components/motion/CountUp";
import type { Conversation } from "@/types/database";

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING_HOVER = { type: "spring" as const, stiffness: 320, damping: 26 };

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
    positive: Math.round((toneCounts.positive / total) * 100),
    neutral: Math.round(((toneCounts.neutral + toneCounts.hesitant) / total) * 100),
    negative: Math.round((toneCounts.negative / total) * 100),
  };
}

function useGreeting() {
  const { t } = useTranslation();
  const h = new Date().getHours();
  if (h < 12) return t("dashboard.greetingMorning");
  if (h < 18) return t("dashboard.greetingAfternoon");
  return t("dashboard.greetingEvening");
}

/* Vibrant semantic palette — green / orange / red with peps. */
const TONE_PALETTE = {
  positive: {
    color: "#34d399",
    soft: "rgba(110, 231, 183, 0.85)",
    rgba: "52, 211, 153",
    glow: "rgba(52, 211, 153, 0.55)",
  },
  neutral: {
    color: "#fb923c",
    soft: "rgba(253, 186, 116, 0.9)",
    rgba: "251, 146, 60",
    glow: "rgba(251, 146, 60, 0.55)",
  },
  negative: {
    color: "#ef4444",
    soft: "rgba(248, 113, 113, 0.9)",
    rgba: "239, 68, 68",
    glow: "rgba(239, 68, 68, 0.55)",
  },
} as const;

/* ----------------------------------------------------------------- */
/*  Tone donut — animated radial sentiment viz                        */
/* ----------------------------------------------------------------- */
function ToneWheel({
  pct,
  dominant,
  loading,
  empty,
  t,
  reduce,
}: {
  pct: { positive: number; neutral: number; negative: number };
  dominant: string;
  loading: boolean;
  empty: boolean;
  t: (k: string) => string;
  reduce: boolean | null;
}) {
  const size = 220;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const positiveLen = (pct.positive / 100) * circumference;
  const neutralLen = (pct.neutral / 100) * circumference;
  const negativeLen = (pct.negative / 100) * circumference;
  const positiveOffset = 0;
  const neutralOffset = positiveLen;
  const negativeOffset = positiveLen + neutralLen;

  const dominantPct = pct[dominant as keyof typeof pct] ?? 0;
  const dominantTone = TONE_PALETTE[dominant as keyof typeof TONE_PALETTE] ?? TONE_PALETTE.neutral;

  return (
    <div className="flex flex-col items-center sm:items-start gap-6 sm:gap-7">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: "rotate(-90deg)", overflow: "visible" }}
        >
          <defs>
            <filter id="tone-glow" x="-50%" y="-50%" width="200%" height="200%">
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
            stroke="rgba(255, 255, 255, 0.04)"
            strokeWidth={stroke}
          />
          {!empty && !loading && (
            <>
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={TONE_PALETTE.positive.color}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDashoffset={-positiveOffset}
                initial={reduce ? undefined : { strokeDasharray: `0 ${circumference}` }}
                animate={{ strokeDasharray: `${Math.max(0, positiveLen - 4)} ${circumference}` }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}
                style={{ filter: "url(#tone-glow)" }}
              />
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={TONE_PALETTE.neutral.color}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDashoffset={-neutralOffset}
                initial={reduce ? undefined : { strokeDasharray: `0 ${circumference}` }}
                animate={{ strokeDasharray: `${Math.max(0, neutralLen - 4)} ${circumference}` }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.5 }}
                style={{ filter: "url(#tone-glow)" }}
              />
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={TONE_PALETTE.negative.color}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDashoffset={-negativeOffset}
                initial={reduce ? undefined : { strokeDasharray: `0 ${circumference}` }}
                animate={{ strokeDasharray: `${Math.max(0, negativeLen - 4)} ${circumference}` }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.7 }}
                style={{ filter: "url(#tone-glow)" }}
              />
            </>
          )}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {loading ? (
            <span className="text-2xl font-extralight" style={{ color: "var(--color-text-muted)" }}>—</span>
          ) : empty ? (
            <>
              <span className="text-[10px] uppercase tracking-[0.22em]" style={{ color: "var(--color-text-muted)" }}>
                {t("common.na")}
              </span>
              <span className="text-[10px] mt-1.5" style={{ color: "var(--color-text-muted)", opacity: 0.6 }}>
                {t("dashboard.noData")}
              </span>
            </>
          ) : (
            <>
              <motion.span
                className="text-5xl font-extralight tabular-nums leading-none"
                animate={reduce ? undefined : { opacity: [0.92, 1, 0.92], scale: [1, 1.02, 1] }}
                transition={
                  reduce
                    ? undefined
                    : { duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 1.4 }
                }
                style={{
                  color: dominantTone.color,
                  letterSpacing: "-0.04em",
                  textShadow: `0 0 24px ${dominantTone.glow}, 0 0 4px ${dominantTone.glow}`,
                }}
              >
                {dominantPct}%
              </motion.span>
              <span
                className="text-[10px] uppercase tracking-[0.22em] mt-2"
                style={{ color: dominantTone.soft }}
              >
                {t(`common.${dominant}`)}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-1 gap-3 sm:gap-2.5 w-full">
        {[
          { label: t("common.positive"), pct: pct.positive, color: TONE_PALETTE.positive.color },
          { label: t("common.neutral"), pct: pct.neutral, color: TONE_PALETTE.neutral.color },
          { label: t("common.negative"), pct: pct.negative, color: TONE_PALETTE.negative.color },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--color-text-muted)" }}>
              {item.label}
            </span>
            <span className="text-xs ml-auto tabular-nums" style={{ color: "var(--color-text)" }}>
              {loading ? "—" : `${item.pct}%`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- */
/*  Vital — KPI tile, all B&W with subtle white halo + shimmer on hover */
/* ----------------------------------------------------------------- */
interface VitalProps {
  label: string;
  value?: number;
  suffix?: string;
  display?: string;
  loading: boolean;
  reduce: boolean | null;
  icon: React.ReactNode;
  /** Subtle accent: light tint on bg/border/halo/icon. */
  accentRgba: string;
  accentColor: string;
  /** Optional tone — colors the VALUE text (used for Dominant Tone tile only). */
  tone?: "positive" | "negative" | null;
  shimmer?: boolean;
}

function Vital({
  label,
  value,
  suffix,
  display,
  loading,
  reduce,
  icon,
  accentRgba,
  accentColor,
  tone,
  shimmer,
}: VitalProps) {
  const tonePalette = tone ? TONE_PALETTE[tone] : null;

  return (
    <motion.div
      variants={{
        hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
        show: reduce ? { opacity: 1 } : { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
      }}
      whileHover={reduce ? undefined : { y: -4 }}
      transition={SPRING_HOVER}
      className="group relative p-4 sm:p-5 rounded-2xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, rgba(${accentRgba}, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)`,
        border: `1px solid rgba(${accentRgba}, 0.12)`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* corner accent halo — soft tint, intensifies on hover */}
      <span
        aria-hidden
        className="absolute -top-12 -right-12 w-36 h-36 rounded-full opacity-40 group-hover:opacity-90 transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle, rgba(${accentRgba}, 0.28), transparent 70%)`,
          filter: "blur(28px)",
        }}
      />
      {/* hover shimmer sweep */}
      <span
        aria-hidden
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
        style={{
          background:
            "linear-gradient(115deg, transparent 30%, rgba(255, 255, 255, 0.05) 50%, transparent 70%)",
          mixBlendMode: "screen",
        }}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--color-text-muted)" }}
          >
            {label}
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke={accentColor}
            strokeWidth="1.5"
            style={{ opacity: 0.7 }}
          >
            {icon}
          </svg>
        </div>
        <motion.p
          className="m-0 tabular-nums leading-none capitalize"
          animate={
            shimmer && !reduce && !loading
              ? { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }
              : undefined
          }
          transition={
            shimmer && !reduce && !loading
              ? { duration: 9, repeat: Infinity, ease: "easeInOut" }
              : undefined
          }
          style={{
            fontSize: display ? "clamp(26px, 3.2vw, 36px)" : "clamp(34px, 4.5vw, 52px)",
            fontWeight: 200,
            letterSpacing: "-0.04em",
            backgroundImage: tonePalette
              ? `linear-gradient(180deg, ${tonePalette.color} 0%, ${tonePalette.soft} 100%)`
              : "linear-gradient(115deg, #fafafa 0%, #fafafa 30%, #d4d4d8 50%, #fafafa 70%, #fafafa 100%)",
            backgroundSize: tonePalette ? undefined : "200% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {loading ? "—" : display ? display : <CountUp value={value!} suffix={suffix} duration={1.4} />}
        </motion.p>
      </div>
    </motion.div>
  );
}

/* ----------------------------------------------------------------- */
/*  Section label — eyebrow + horizontal rule                         */
/* ----------------------------------------------------------------- */
function SectionLabel({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5 sm:mb-6">
      <span className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--color-text-muted)" }}>
        {children}
      </span>
      <span aria-hidden className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(255, 255, 255, 0.08), transparent 80%)" }} />
      {action}
    </div>
  );
}

/* ----------------------------------------------------------------- */
/*  Broadcast button — Go Live CTA with continuous concentric rings   */
/* ----------------------------------------------------------------- */
function BroadcastButton({
  href,
  title,
  subtitle,
  reduce,
}: {
  href: string;
  title: string;
  subtitle: string;
  reduce: boolean | null;
}) {
  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -3 }}
      transition={SPRING_HOVER}
      className="w-full sm:w-auto"
    >
      <Link
        href={href}
        className="no-underline group relative flex items-center gap-4 sm:gap-5 px-5 py-4 sm:pl-6 sm:pr-8 sm:py-5 rounded-[28px] overflow-hidden w-full"
        style={{
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.02) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow:
            "0 30px 70px -25px rgba(255, 255, 255, 0.10), 0 0 0 1px rgba(255, 255, 255, 0.02), inset 0 1px 0 rgba(255, 255, 255, 0.10)",
          color: "var(--color-text)",
          minWidth: 280,
          minHeight: 76,
        }}
      >
        {/* shimmer sweep — diagonal light passes left → right */}
        <motion.span
          aria-hidden
          className="absolute top-0 bottom-0 pointer-events-none"
          animate={reduce ? undefined : { x: ["-120%", "220%"] }}
          transition={
            reduce
              ? undefined
              : { duration: 4.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.6 }
          }
          style={{
            width: "60%",
            background:
              "linear-gradient(105deg, transparent 30%, rgba(255, 255, 255, 0.10) 50%, transparent 70%)",
            mixBlendMode: "screen",
          }}
        />

        {/* broadcast indicator — concentric expanding rings */}
        <span className="relative shrink-0 inline-flex items-center justify-center" style={{ width: 56, height: 56 }}>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              aria-hidden
              className="absolute rounded-full"
              style={{
                width: 56,
                height: 56,
                border: "1px solid rgba(255, 255, 255, 0.45)",
              }}
              animate={
                reduce
                  ? undefined
                  : { scale: [0.35, 1.15], opacity: [0.55, 0] }
              }
              transition={
                reduce
                  ? undefined
                  : { duration: 2.6, repeat: Infinity, ease: "easeOut", delay: i * 0.85 }
              }
            />
          ))}
          {/* core glow */}
          <span
            aria-hidden
            className="absolute rounded-full"
            style={{
              width: 28,
              height: 28,
              background:
                "radial-gradient(circle, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.08) 60%, transparent 100%)",
              filter: "blur(2px)",
            }}
          />
          {/* core dot */}
          <span
            aria-hidden
            className="relative rounded-full"
            style={{
              width: 12,
              height: 12,
              background: "linear-gradient(180deg, #fafafa 0%, #d4d4d8 100%)",
              boxShadow:
                "0 0 14px rgba(255, 255, 255, 0.6), inset 0 -1px 2px rgba(0, 0, 0, 0.2)",
            }}
          />
        </span>

        {/* label */}
        <span className="relative flex flex-col items-start gap-1 min-w-0 flex-1">
          <span
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em]"
            style={{ color: "var(--color-text-muted)" }}
          >
            <span
              className="relative inline-flex w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "#86efac" }}
            >
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  backgroundColor: "#86efac",
                  opacity: 0.5,
                  animation: "pulseRing 1.8s ease-in-out infinite",
                }}
              />
            </span>
            Live
          </span>
          <span
            className="text-base sm:text-lg font-medium leading-tight"
            style={{
              backgroundImage:
                "linear-gradient(115deg, #fafafa 0%, #d4d4d8 50%, #fafafa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </span>
          <span className="text-[11px] truncate" style={{ color: "var(--color-text-muted)" }}>
            {subtitle}
          </span>
        </span>

        {/* arrow */}
        <span
          aria-hidden
          className="ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 shrink-0"
          style={{ color: "var(--color-text)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </span>
      </Link>
    </motion.div>
  );
}

/* ----------------------------------------------------------------- */
/*  Ghost CTA — secondary action                                      */
/* ----------------------------------------------------------------- */
function GhostButton({
  href,
  title,
  subtitle,
  icon,
  reduce,
}: {
  href: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  reduce: boolean | null;
}) {
  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -3 }}
      transition={SPRING_HOVER}
      className="w-full sm:w-auto"
    >
      <Link
        href={href}
        className="no-underline group relative flex items-center gap-3 sm:gap-4 px-5 py-4 rounded-[28px] overflow-hidden w-full"
        style={{
          background: "rgba(255, 255, 255, 0.015)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          color: "var(--color-text)",
          minHeight: 76,
        }}
      >
        <span
          className="relative flex items-center justify-center w-11 h-11 rounded-2xl shrink-0"
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.04)",
            color: "var(--color-text-silver)",
          }}
        >
          {icon}
        </span>
        <span className="relative flex flex-col items-start gap-0.5 min-w-0 flex-1">
          <span className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
            {title}
          </span>
          <span className="text-[11px] truncate" style={{ color: "var(--color-text-muted)" }}>
            {subtitle}
          </span>
        </span>
        <span
          aria-hidden
          className="ml-auto opacity-30 group-hover:opacity-80 group-hover:translate-x-1 transition-all duration-300 shrink-0"
          style={{ color: "var(--color-text-muted)" }}
        >
          →
        </span>
      </Link>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const reduce = useReducedMotion();
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
      try {
        const [recentResult, countResult] = await Promise.all([
          supabase.from("conversations").select("*").eq("user_id", user!.uid).order("created_at", { ascending: false }).limit(5),
          supabase.from("conversations").select("*", { count: "exact", head: true }).eq("user_id", user!.uid),
        ]);

        const convos = recentResult.data;
        if (convos) setConversations(convos);

        const convoIds = (convos || []).map((c) => c.id);
        const segments = convoIds.length > 0
          ? (await supabase.from("analysis_segments").select("tone, confidence").in("conversation_id", convoIds)).data
          : null;

        const toneCounts = { positive: 0, neutral: 0, negative: 0, hesitant: 0 };
        let confidenceSum = 0;
        if (segments) {
          for (const seg of segments) {
            if (seg.tone in toneCounts) toneCounts[seg.tone as keyof typeof toneCounts]++;
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
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      } finally {
        setLoadingData(false);
      }
    }

    fetchData();
  }, [user]);

  const sentimentPct = useMemo(() => computeSentimentPercents(stats.toneCounts), [stats.toneCounts]);
  const dominantTone = useMemo(
    () => (sentimentPct.positive >= sentimentPct.negative ? "positive" : "negative"),
    [sentimentPct],
  );
  const greeting = useGreeting();
  const firstName = user?.displayName?.split(" ")[0] || "there";
  const empty = stats.totalSegments === 0;

  return (
    <AppShell>
      <Suspense>
        <PlanUpgradeModal />
      </Suspense>

      <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto", paddingBottom: 120 }}>
        {/* AMBIENT — single subtle white orb drifting */}
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            top: -140,
            right: -120,
            width: 560,
            height: 560,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255, 255, 255, 0.06), transparent 65%)",
            filter: "blur(70px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
          animate={reduce ? undefined : { x: [-20, 20, -20], y: [-15, 15, -15], scale: [1, 1.06, 1] }}
          transition={reduce ? undefined : { duration: 24, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            top: 420,
            left: -100,
            width: 380,
            height: 380,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255, 255, 255, 0.04), transparent 65%)",
            filter: "blur(70px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
          animate={reduce ? undefined : { x: [-25, 25, -25], y: [-30, 30, -30] }}
          transition={reduce ? undefined : { duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* ── HERO ────────────────────────────────────────────── */}
        <section style={{ position: "relative", zIndex: 1, paddingTop: 4, paddingBottom: 28 }}>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex items-center gap-2.5 mb-5"
          >
            <span className="relative inline-flex w-1.5 h-1.5">
              <span
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.7)", opacity: 0.4, animation: "pulseRing 2.4s ease-in-out infinite" }}
              />
              <span className="relative w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "rgba(255, 255, 255, 0.85)" }} />
            </span>
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: "var(--color-text-muted)" }}
            >
              {t("dashboard.subtitle")}
            </span>
          </motion.div>

          <h1
            style={{
              fontSize: "clamp(32px, 5.4vw, 60px)",
              fontWeight: 200,
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
              margin: 0,
              color: "var(--color-text)",
            }}
          >
            <motion.span
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
              style={{ display: "inline" }}
            >
              {greeting},{" "}
            </motion.span>
            <motion.span
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
              animate={
                reduce
                  ? { opacity: 1 }
                  : {
                      opacity: 1,
                      y: 0,
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }
              }
              transition={
                reduce
                  ? { duration: 0.85, ease: EASE, delay: 0.25 }
                  : {
                      opacity: { duration: 0.85, ease: EASE, delay: 0.25 },
                      y: { duration: 0.85, ease: EASE, delay: 0.25 },
                      backgroundPosition: { duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 },
                    }
              }
              style={{
                display: "inline-block",
                backgroundImage:
                  "linear-gradient(115deg, #fafafa 0%, #fafafa 28%, #c4b5fd 45%, #f0abfc 55%, #fafafa 72%, #fafafa 100%)",
                backgroundSize: "240% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {firstName}.
            </motion.span>
          </h1>

          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.45 }}
            className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 mt-6 sm:mt-7"
          >
            <BroadcastButton
              href="/session"
              title={t("dashboard.startSession")}
              subtitle={t("dashboard.startSessionDesc")}
              reduce={reduce}
            />
            <GhostButton
              href="/analyze-text"
              title={t("dashboard.analyzeText")}
              subtitle={t("dashboard.analyzeTextDesc")}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              }
              reduce={reduce}
            />
          </motion.div>
        </section>

        {/* ── VITALS ──────────────────────────────────────────── */}
        <section style={{ position: "relative", zIndex: 1, marginBottom: 56 }}>
          <SectionLabel>{t("dashboard.overview", "Vitals")}</SectionLabel>

          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: reduce ? {} : { staggerChildren: 0.08, delayChildren: 0.55 } },
            }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
          >
            <Vital
              label={t("dashboard.sessions")}
              value={stats.totalSessions}
              loading={loadingData}
              reduce={reduce}
              shimmer
              accentRgba="52, 211, 153"
              accentColor="#34d399"
              icon={
                <>
                  <rect x="3" y="3" width="7" height="7" rx="1.2" />
                  <rect x="14" y="3" width="7" height="7" rx="1.2" />
                  <rect x="3" y="14" width="7" height="7" rx="1.2" />
                  <rect x="14" y="14" width="7" height="7" rx="1.2" />
                </>
              }
            />
            <Vital
              label={t("dashboard.segments")}
              value={stats.totalSegments}
              loading={loadingData}
              reduce={reduce}
              shimmer
              accentRgba="251, 191, 36"
              accentColor="#fbbf24"
              icon={<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />}
            />
            <Vital
              label={t("dashboard.avgConfidence")}
              value={stats.avgConfidence}
              suffix="%"
              loading={loadingData}
              reduce={reduce}
              shimmer
              accentRgba="96, 165, 250"
              accentColor="#60a5fa"
              icon={
                <>
                  <path d="M12 2L4 7v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V7l-8-5z" />
                </>
              }
            />
            <Vital
              label={t("dashboard.dominantTone")}
              display={
                loadingData
                  ? "—"
                  : empty
                    ? t("common.na")
                    : t(`common.${dominantTone}`)
              }
              loading={loadingData}
              reduce={reduce}
              tone={empty ? null : (dominantTone as "positive" | "negative")}
              accentRgba={
                empty
                  ? "113, 113, 122"
                  : dominantTone === "positive"
                    ? "52, 211, 153"
                    : "239, 68, 68"
              }
              accentColor={
                empty
                  ? "#a1a1aa"
                  : dominantTone === "positive"
                    ? "#34d399"
                    : "#ef4444"
              }
              icon={
                <>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" x2="9.01" y1="9" y2="9" />
                  <line x1="15" x2="15.01" y1="9" y2="9" />
                </>
              }
            />
          </motion.div>
        </section>

        {/* ── TONE WHEEL + RECENT STREAM ──────────────────────── */}
        <div
          className="grid lg:grid-cols-[300px_1fr] gap-10 lg:gap-14 mb-14 relative"
          style={{ zIndex: 1 }}
        >
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <SectionLabel>{t("dashboard.sentimentOverview")}</SectionLabel>
            <ToneWheel
              pct={sentimentPct}
              dominant={dominantTone}
              loading={loadingData}
              empty={empty}
              t={t}
              reduce={reduce}
            />
          </motion.div>

          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <SectionLabel
              action={
                <Link
                  href="/history"
                  className="text-[11px] no-underline shrink-0 group flex items-center gap-1.5"
                  style={{ color: "var(--color-text-silver)" }}
                >
                  {t("common.viewAll")}
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              }
            >
              {t("dashboard.recentSessions")}
            </SectionLabel>

            {loadingData ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 rounded-2xl shimmer" style={{ backgroundColor: "rgba(255, 255, 255, 0.02)" }} />
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-sm m-0 mb-1" style={{ color: "var(--color-text)" }}>
                  {t("dashboard.noSessions")}
                </p>
                <p className="text-xs m-0 mb-4" style={{ color: "var(--color-text-muted)" }}>
                  {t("dashboard.noSessionsDesc")}
                </p>
                <Link href="/session" className="text-xs no-underline" style={{ color: "var(--color-text-silver)" }}>
                  {t("dashboard.startSessionBtn")} →
                </Link>
              </div>
            ) : (
              <ul className="m-0 p-0 space-y-2" style={{ listStyle: "none" }}>
                {conversations.map((conv, idx) => {
                  const tonePalette = conv.overall_tone && conv.overall_tone in TONE_PALETTE
                    ? TONE_PALETTE[conv.overall_tone as keyof typeof TONE_PALETTE]
                    : conv.overall_tone === "hesitant"
                      ? TONE_PALETTE.neutral
                      : null;
                  const railColor = tonePalette?.color ?? "rgba(255, 255, 255, 0.15)";
                  const railRgba = tonePalette?.rgba ?? "255, 255, 255";
                  const created = new Date(conv.created_at);
                  return (
                    <motion.li
                      key={conv.id}
                      initial={reduce ? { opacity: 0 } : { opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, ease: EASE, delay: 0.45 + idx * 0.06 }}
                      whileHover={reduce ? undefined : { x: 4 }}
                    >
                      <Link
                        href={`/summary/${conv.id}`}
                        className="no-underline flex items-stretch gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl group relative overflow-hidden"
                        style={{
                          background: "rgba(255, 255, 255, 0.02)",
                          border: "1px solid rgba(255, 255, 255, 0.04)",
                          transition: "background 0.3s ease, border-color 0.3s ease",
                        }}
                      >
                        {/* tone-color rail (subtle) */}
                        <span
                          aria-hidden
                          className="shrink-0 self-stretch w-[3px] rounded-full"
                          style={{
                            background: `linear-gradient(180deg, ${railColor}, rgba(${railRgba}, 0.4))`,
                            boxShadow: `0 0 14px rgba(${railRgba}, 0.3)`,
                          }}
                        />
                        <div
                          className="flex flex-col items-end justify-center shrink-0"
                          style={{ minWidth: 52 }}
                        >
                          <span className="text-xs tabular-nums font-medium" style={{ color: "var(--color-text)" }}>
                            {created.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          <span className="text-[10px] tabular-nums" style={{ color: "var(--color-text-muted)" }}>
                            {created.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
                          <p className="text-sm m-0 truncate font-medium" style={{ color: "var(--color-text)" }}>
                            {conv.title}
                          </p>
                          {conv.overall_tone && tonePalette && (
                            <span
                              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em]"
                              style={{ color: tonePalette.soft }}
                            >
                              <span
                                className="w-1 h-1 rounded-full"
                                style={{ backgroundColor: tonePalette.color }}
                              />
                              {conv.overall_tone}
                            </span>
                          )}
                        </div>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="shrink-0 self-center opacity-30 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            )}
          </motion.div>
        </div>

        {/* ── INSIGHTS ────────────────────────────────────────── */}
        {conversations.length > 0 && conversations[0].insights && (
          <motion.section
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative"
            style={{ zIndex: 1 }}
          >
            <SectionLabel>{t("dashboard.latestInsights")}</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {conversations[0].insights.slice(0, 4).map((insight, i) => (
                <motion.div
                  key={i}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
                  whileHover={reduce ? undefined : { y: -2 }}
                  className="group flex items-start gap-4 p-5 rounded-2xl relative overflow-hidden"
                  style={{
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(255, 255, 255, 0.04)",
                  }}
                >
                  <span
                    aria-hidden
                    className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                    style={{
                      background: "radial-gradient(circle, rgba(255, 255, 255, 0.12), transparent 70%)",
                      filter: "blur(24px)",
                    }}
                  />
                  <span
                    className="text-3xl font-extralight tabular-nums shrink-0 leading-none -mt-1 relative"
                    style={{
                      backgroundImage: "linear-gradient(180deg, #fafafa 0%, #71717a 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm leading-relaxed m-0 relative" style={{ color: "var(--color-text-silver)" }}>
                    {insight}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* ── MOBILE FLOATING DOCK ────────────────────────────── */}
      <div
        className="lg:hidden fixed left-3 right-3 z-30 pointer-events-none"
        style={{ bottom: "max(12px, env(safe-area-inset-bottom))" }}
      >
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.9 }}
          className="flex items-center gap-2 p-2 rounded-full pointer-events-auto"
          style={{
            background: "rgba(15, 15, 18, 0.92)",
            backdropFilter: "blur(24px) saturate(160%)",
            WebkitBackdropFilter: "blur(24px) saturate(160%)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            boxShadow: "0 30px 70px -25px rgba(0, 0, 0, 0.7)",
          }}
        >
          <Link
            href="/session"
            className="flex-1 no-underline flex items-center justify-center gap-2.5 px-4 py-3 rounded-full text-sm font-semibold relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #fafafa, #d4d4d8)",
              color: "#0a0a0a",
              boxShadow: "0 8px 24px -10px rgba(255, 255, 255, 0.4)",
            }}
          >
            <span className="relative inline-flex w-1.5 h-1.5">
              <span
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: "#0a0a0a", opacity: 0.4, animation: "pulseRing 2s ease-in-out infinite" }}
              />
              <span className="relative w-1.5 h-1.5 rounded-full bg-black" />
            </span>
            {t("dashboard.startSession")}
          </Link>
          <Link
            href="/analyze-text"
            className="no-underline flex items-center justify-center w-12 h-12 rounded-full shrink-0"
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              color: "var(--color-text-silver)",
            }}
            aria-label={t("dashboard.analyzeText")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </Link>
          <Link
            href="/history"
            className="no-underline flex items-center justify-center w-12 h-12 rounded-full shrink-0"
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              color: "var(--color-text-silver)",
            }}
            aria-label={t("dashboard.recentSessions")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </AppShell>
  );
}

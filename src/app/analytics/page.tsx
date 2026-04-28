"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth-context";
import { authFetch } from "@/lib/api-client";
import AppShell from "@/components/AppShell";
import UpgradePrompt from "@/components/UpgradePrompt";
import CountUp from "@/components/motion/CountUp";
import { usePlan } from "@/hooks/usePlan";

const SPRING_PILL = { type: "spring" as const, stiffness: 380, damping: 32, mass: 0.8 };
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

interface ProgressionPoint {
  date: string;
  overall: number;
  engagement: number;
  tone: number;
  fluidity: number;
  interest: number;
  social: number;
  overallTone: string | null;
}

interface AnalyticsData {
  totalSessions: number;
  progression: ProgressionPoint[];
  averages: { overall: number; engagement: number; tone: number; fluidity: number; interest: number; social: number };
  toneDistribution: Record<string, number>;
  toneBreakdown: Record<string, number>;
  streaks: { current: number; best: number };
  recentTrend: "improving" | "declining" | "stable";
  weeklyActivity: { week: string; count: number; avgScore: number }[];
}

type MetricKey = "overall" | "engagement" | "tone" | "fluidity" | "interest" | "social";

function getScoreColor(score: number) {
  if (score >= 70) return "#34d399";
  if (score >= 40) return "#fb923c";
  return "#ef4444";
}

function getScoreRgba(score: number) {
  if (score >= 70) return "52, 211, 153";
  if (score >= 40) return "251, 146, 60";
  return "239, 68, 68";
}

const TREND_CONFIG = {
  improving: { key: "improving", color: "#34d399", rgba: "52, 211, 153", arrow: "↑" },
  declining: { key: "declining", color: "#ef4444", rgba: "239, 68, 68", arrow: "↓" },
  stable: { key: "stable", color: "#fb923c", rgba: "251, 146, 60", arrow: "→" },
};

const CLASSIFICATION_COLORS: Record<string, string> = {
  very_positive: "#34d399",
  positive: "#34d399",
  neutral: "#fb923c",
  awkward: "#fb923c",
  negative: "#ef4444",
};

const CLASSIFICATION_RGBA: Record<string, string> = {
  very_positive: "52, 211, 153",
  positive: "52, 211, 153",
  neutral: "251, 146, 60",
  awkward: "251, 146, 60",
  negative: "239, 68, 68",
};

/* ----------------------------------------------------------------- */
/*  Animated line chart — stroke draws on entry                      */
/* ----------------------------------------------------------------- */
function MiniLineChart({
  data,
  metricKey,
  width = 320,
  height = 120,
  reduce,
}: {
  data: ProgressionPoint[];
  metricKey: MetricKey;
  width?: number;
  height?: number;
  reduce: boolean;
}) {
  if (data.length < 2) return null;

  const values = data.map((d) => d[metricKey]);
  const max = Math.max(...values, 100);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const padding = 4;
  const chartW = width - padding * 2;
  const chartH = height - padding * 2;

  const points = values.map((v, i) => {
    const x = padding + (i / (values.length - 1)) * chartW;
    const y = padding + chartH - ((v - min) / range) * chartH;
    return `${x},${y}`;
  });

  const lastVal = values[values.length - 1];
  const color = getScoreColor(lastVal);

  const areaPoints = [
    `${padding},${padding + chartH}`,
    ...points,
    `${padding + chartW},${padding + chartH}`,
  ].join(" ");

  const lastParts = points[points.length - 1].split(",");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`grad-${metricKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <filter id={`line-glow-${metricKey}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <motion.polygon
        points={areaPoints}
        fill={`url(#grad-${metricKey})`}
        initial={reduce ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6, ease: EASE_OUT }}
      />
      <motion.polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: EASE_OUT }}
        style={{ filter: `url(#line-glow-${metricKey})` }}
      />
      <motion.circle
        cx={lastParts[0]}
        cy={lastParts[1]}
        r="4"
        fill={color}
        initial={reduce ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.1, ease: EASE_OUT }}
        style={{ filter: `url(#line-glow-${metricKey})` }}
      />
    </svg>
  );
}

/* ----------------------------------------------------------------- */
/*  Animated bar chart — bars scale-y from 0                         */
/* ----------------------------------------------------------------- */
function BarChart({
  data,
  width = 320,
  height = 100,
  reduce,
}: {
  data: { label: string; value: number; color: string }[];
  width?: number;
  height?: number;
  reduce: boolean;
}) {
  if (data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.value), 1);
  const barWidth = Math.min(32, (width - 16) / data.length - 4);

  return (
    <div>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
        <defs>
          <filter id="bar-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {data.map((d, i) => {
          const barH = (d.value / max) * (height - 24);
          const x = 8 + i * (barWidth + 4);
          const y = height - 20 - barH;
          const baseY = height - 20;
          return (
            <g key={i}>
              <motion.rect
                x={x}
                width={barWidth}
                rx="4"
                fill={d.color}
                opacity="0.9"
                initial={reduce ? { y, height: barH } : { y: baseY, height: 0 }}
                animate={{ y, height: barH }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.06,
                  ease: EASE_OUT,
                }}
                style={{ filter: barH > 4 ? "url(#bar-glow)" : undefined }}
              />
              <text
                x={x + barWidth / 2}
                y={height - 6}
                textAnchor="middle"
                fill="rgba(255, 255, 255, 0.4)"
                fontSize="9"
                fontWeight="500"
                style={{ letterSpacing: "0.06em", textTransform: "uppercase" }}
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ----------------------------------------------------------------- */
/*  Score bar — width animates 0 → value                              */
/* ----------------------------------------------------------------- */
function ScoreBar({
  label,
  value,
  color,
  index = 0,
  reduce,
}: {
  label: string;
  value: number;
  color: string;
  index?: number;
  reduce: boolean;
}) {
  const rgba = getScoreRgba(value);
  return (
    <div className="flex items-center gap-3">
      <span
        className="text-[10px] uppercase tracking-[0.16em] shrink-0 truncate"
        style={{ color: "var(--color-text-muted)", width: 96 }}
      >
        {label}
      </span>
      <div
        className="flex-1 relative rounded-full overflow-hidden"
        style={{ height: 4, background: "rgba(255, 255, 255, 0.04)" }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}, rgba(${rgba}, 0.7))`,
            boxShadow: `0 0 12px rgba(${rgba}, 0.45)`,
          }}
          initial={reduce ? { width: `${value}%` } : { width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, delay: 0.1 + index * 0.06, ease: EASE_OUT }}
        />
      </div>
      <span
        className="text-xs font-medium tabular-nums shrink-0 text-right"
        style={{ color, width: 28 }}
      >
        <CountUp value={value} duration={1.1} />
      </span>
    </div>
  );
}

const METRIC_KEYS: MetricKey[] = ["overall", "engagement", "tone", "fluidity", "interest", "social"];

/* ----------------------------------------------------------------- */
/*  Vital — KPI tile with subtle accent halo                          */
/* ----------------------------------------------------------------- */
function VitalCard({
  label,
  hint,
  hintColor,
  rgba,
  haloOpacity,
  reduce,
  children,
}: {
  label: string;
  hint?: string;
  hintColor?: string;
  rgba: string;
  haloOpacity: number;
  reduce: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      variants={{
        hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
        show: reduce ? { opacity: 1 } : { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
      }}
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className="group relative p-4 sm:p-5 rounded-2xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, rgba(${rgba}, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)`,
        border: `1px solid rgba(${rgba}, ${rgba === "255, 255, 255" ? 0.06 : 0.14})`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <span
        aria-hidden
        className="absolute -top-12 -right-12 w-36 h-36 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle, rgba(${rgba}, ${haloOpacity}), transparent 70%)`,
          filter: "blur(28px)",
        }}
      />
      <div className="relative">
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.18em] block mb-3"
          style={{ color: "var(--color-text-muted)" }}
        >
          {label}
        </span>
        {children}
        {hint && (
          <span
            className="text-[10px] mt-1.5 block"
            style={{ color: hintColor ?? "var(--color-text-muted)" }}
          >
            {hint}
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ----------------------------------------------------------------- */
/*  Glass panel with halo                                              */
/* ----------------------------------------------------------------- */
function GlassPanel({
  children,
  rgba = "255, 255, 255",
  haloOpacity = 0.14,
  delay = 0,
  reduce,
  className = "",
}: {
  children: React.ReactNode;
  rgba?: string;
  haloOpacity?: number;
  delay?: number;
  reduce: boolean;
  className?: string;
}) {
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE_OUT, delay }}
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        background: `linear-gradient(135deg, rgba(${rgba}, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)`,
        border: `1px solid rgba(${rgba}, ${rgba === "255, 255, 255" ? 0.06 : 0.14})`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <span
        aria-hidden
        className="absolute -top-14 -right-14 w-44 h-44 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(${rgba}, ${haloOpacity}), transparent 70%)`,
          filter: "blur(28px)",
          opacity: 0.55,
        }}
      />
      <div className="relative p-5 sm:p-6">{children}</div>
    </motion.div>
  );
}

function PanelLabel({ children, color = "var(--color-text-muted)", dotColor }: { children: React.ReactNode; color?: string; dotColor?: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      {dotColor && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dotColor }} />}
      <span className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color }}>
        {children}
      </span>
    </div>
  );
}

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { can, loading: planLoading } = usePlan();
  const reduce = useReducedMotion();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("overall");

  const hasAccess = !planLoading && can("analyticsPage");

  useEffect(() => {
    if (!user || planLoading || !can("analyticsPage")) return;

    authFetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.uid }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d && !d.error && typeof d.totalSessions === "number") {
          setData(d);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, planLoading, can]);

  if (planLoading) {
    return (
      <AppShell>
        <div style={{ maxWidth: 1100 }}>
          <div className="mb-8">
            <div className="h-7 w-32 rounded-lg shimmer mb-2" style={{ backgroundColor: "var(--color-surface-2)" }} />
            <div className="h-4 w-64 rounded-lg shimmer" style={{ backgroundColor: "var(--color-surface-2)" }} />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl shimmer" style={{ backgroundColor: "var(--color-surface-2)" }} />
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  if (!hasAccess) {
    return (
      <AppShell>
        <div style={{ maxWidth: 600, paddingTop: 40 }}>
          <UpgradePrompt feature="Analytics Dashboard" plan="Pro" />
        </div>
      </AppShell>
    );
  }

  const trend = data?.recentTrend ? TREND_CONFIG[data.recentTrend] : null;
  const progression = data?.progression || [];
  const lastSession = progression.length > 0 ? progression[progression.length - 1] : null;
  const averages = data?.averages || { overall: 0, engagement: 0, tone: 0, fluidity: 0, interest: 0, social: 0 };
  const delta = lastSession ? lastSession.overall - averages.overall : 0;

  const avgRgba = data ? getScoreRgba(averages.overall) : "255, 255, 255";

  return (
    <AppShell>
      <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto", paddingBottom: 80 }}>
        {/* Ambient orb */}
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            top: -130,
            right: -120,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              data && data.totalSessions > 0
                ? `radial-gradient(circle, rgba(${avgRgba}, 0.10), transparent 65%)`
                : "radial-gradient(circle, rgba(255, 255, 255, 0.05), transparent 65%)",
            filter: "blur(70px)",
            pointerEvents: "none",
            zIndex: 0,
            transition: "background 0.7s ease",
          }}
          animate={reduce ? undefined : { x: [-15, 15, -15], y: [-12, 12, -12] }}
          transition={reduce ? undefined : { duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* ========== HERO ========== */}
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            className="mb-8"
          >
            <div className="flex items-center gap-2.5 mb-4">
              <span className="relative inline-flex w-1.5 h-1.5">
                <span
                  className="absolute inset-0 rounded-full"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.85)",
                    opacity: 0.5,
                    animation: "pulseRing 2.4s ease-in-out infinite",
                  }}
                />
                <span
                  className="relative w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                />
              </span>
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: "var(--color-text-muted)" }}
              >
                {t("analytics.subtitle")}
              </span>
            </div>

            <motion.h1
              className="m-0"
              animate={reduce ? undefined : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={
                reduce
                  ? undefined
                  : { duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }
              }
              style={{
                fontSize: "clamp(36px, 5.4vw, 60px)",
                fontWeight: 200,
                letterSpacing: "-0.035em",
                lineHeight: 1.05,
                background:
                  "linear-gradient(115deg, #fafafa 0%, #fafafa 30%, #d4d4d8 50%, #fafafa 70%, #fafafa 100%)",
                backgroundSize: "240% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t("analytics.title")}
            </motion.h1>
          </motion.div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 rounded-2xl shimmer"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.02)" }}
                />
              ))}
            </div>
          ) : !data || data.totalSessions === 0 ? (
            <motion.div
              className="relative overflow-hidden rounded-2xl py-12 px-8 text-center"
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              style={{
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <span
                aria-hidden
                className="absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(255, 255, 255, 0.10), transparent 70%)",
                  filter: "blur(28px)",
                  opacity: 0.4,
                }}
              />
              <div className="relative">
                <div
                  className="inline-flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-2xl"
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--color-text-muted)" }}>
                    <path d="M3 3v18h18" />
                    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                  </svg>
                </div>
                <p className="text-sm font-medium m-0 mb-1" style={{ color: "var(--color-text)" }}>{t("analytics.noData")}</p>
                <p className="text-xs m-0" style={{ color: "var(--color-text-muted)" }}>
                  {t("analytics.noDataDesc")}
                </p>
              </div>
            </motion.div>
          ) : (
            <>
              {/* ========== TOP KPI ROW — Vital style ========== */}
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-5"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: {
                    transition: reduce ? {} : { staggerChildren: 0.07, delayChildren: 0.1 },
                  },
                }}
              >
                {/* Total Sessions */}
                <VitalCard
                  reduce={!!reduce}
                  rgba="255, 255, 255"
                  haloOpacity={0.16}
                  label={t("analytics.totalSessions")}
                >
                  <motion.span
                    className="m-0 tabular-nums leading-none"
                    animate={reduce ? undefined : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                    transition={reduce ? undefined : { duration: 9, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      fontSize: "clamp(34px, 4.5vw, 52px)",
                      fontWeight: 200,
                      letterSpacing: "-0.04em",
                      background:
                        "linear-gradient(115deg, #fafafa 0%, #fafafa 30%, #d4d4d8 50%, #fafafa 70%, #fafafa 100%)",
                      backgroundSize: "200% 100%",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    <CountUp value={data.totalSessions} duration={1.4} />
                  </motion.span>
                </VitalCard>

                {/* Avg Score */}
                <VitalCard
                  reduce={!!reduce}
                  rgba={getScoreRgba(averages.overall)}
                  haloOpacity={0.28}
                  label={t("analytics.avgScore")}
                  hint={t("analytics.outOf100")}
                >
                  <span
                    className="m-0 tabular-nums leading-none"
                    style={{
                      fontSize: "clamp(34px, 4.5vw, 52px)",
                      fontWeight: 200,
                      letterSpacing: "-0.04em",
                      color: getScoreColor(averages.overall),
                      textShadow: `0 0 20px rgba(${getScoreRgba(averages.overall)}, 0.35)`,
                    }}
                  >
                    <CountUp value={averages.overall} duration={1.4} />
                  </span>
                </VitalCard>

                {/* Trend */}
                <VitalCard
                  reduce={!!reduce}
                  rgba={trend?.rgba ?? "255, 255, 255"}
                  haloOpacity={0.24}
                  label={t("analytics.trend")}
                  hint={delta !== 0 ? `${delta > 0 ? "+" : ""}${delta} ${t("analytics.vsAvg")}` : undefined}
                  hintColor={delta > 0 ? "#34d399" : delta < 0 ? "#ef4444" : undefined}
                >
                  {trend && (
                    <div className="flex items-baseline gap-2">
                      <motion.span
                        style={{
                          color: trend.color,
                          fontSize: "clamp(28px, 3.6vw, 40px)",
                          fontWeight: 300,
                          lineHeight: 1,
                          letterSpacing: "-0.04em",
                          textShadow: `0 0 18px rgba(${trend.rgba}, 0.4)`,
                        }}
                        animate={
                          reduce
                            ? undefined
                            : trend.key === "improving"
                              ? { y: [0, -3, 0] }
                              : trend.key === "declining"
                                ? { y: [0, 3, 0] }
                                : undefined
                        }
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                      >
                        {trend.arrow}
                      </motion.span>
                      <span
                        className="text-sm font-medium capitalize"
                        style={{ color: trend.color }}
                      >
                        {t(`analytics.${trend.key}`)}
                      </span>
                    </div>
                  )}
                </VitalCard>

                {/* Best Streak */}
                <VitalCard
                  reduce={!!reduce}
                  rgba="167, 139, 250"
                  haloOpacity={0.22}
                  label={t("analytics.bestStreak")}
                  hint={t("analytics.streakThreshold")}
                >
                  <span
                    className="m-0 tabular-nums leading-none"
                    style={{
                      fontSize: "clamp(34px, 4.5vw, 52px)",
                      fontWeight: 200,
                      letterSpacing: "-0.04em",
                      color: "#c4b5fd",
                      textShadow: "0 0 20px rgba(167, 139, 250, 0.35)",
                    }}
                  >
                    <CountUp value={data.streaks?.best ?? 0} duration={1.4} />
                  </span>
                </VitalCard>
              </motion.div>

            {/* ========== Progression Chart ========== */}
            <GlassPanel reduce={!!reduce} delay={0.35} className="mb-5">
              <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <PanelLabel dotColor="rgba(255, 255, 255, 0.7)">
                  {t("analytics.scoreProgression")}
                </PanelLabel>
                <div
                  className="relative inline-flex items-center p-1 rounded-full overflow-x-auto"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    scrollbarWidth: "none",
                  }}
                >
                  {METRIC_KEYS.map((m) => {
                    const active = selectedMetric === m;
                    return (
                      <button
                        key={m}
                        onClick={() => setSelectedMetric(m)}
                        className="relative text-[11px] font-medium px-3 py-1 rounded-full cursor-pointer whitespace-nowrap"
                        style={{
                          background: "transparent",
                          color: active ? "var(--color-text)" : "var(--color-text-muted)",
                          transition: "color 0.2s ease",
                          zIndex: 1,
                        }}
                      >
                        {active && !reduce && (
                          <motion.span
                            aria-hidden
                            layoutId="analytics-metric-pill"
                            className="absolute inset-0 rounded-full"
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(255, 255, 255, 0.10), rgba(255, 255, 255, 0.04))",
                              border: "1px solid rgba(255, 255, 255, 0.14)",
                              boxShadow: "0 6px 20px -8px rgba(0, 0, 0, 0.5)",
                              zIndex: -1,
                            }}
                            transition={SPRING_PILL}
                          />
                        )}
                        <span className="relative">{t(`analytics.${m}`)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {(data.progression || []).length >= 2 ? (
                <motion.div
                  key={selectedMetric}
                  className="flex justify-center"
                  initial={reduce ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <MiniLineChart
                    data={(data.progression || [])}
                    metricKey={selectedMetric}
                    width={typeof window !== "undefined" ? Math.min(800, window.innerWidth - 100) : 800}
                    height={180}
                    reduce={!!reduce}
                  />
                </motion.div>
              ) : (
                <p className="text-[11px] uppercase tracking-[0.18em] text-center py-8" style={{ color: "var(--color-text-muted)" }}>
                  {t("analytics.minSessions")}
                </p>
              )}

              {(data.progression || []).length >= 2 && (
                <div className="flex justify-between mt-3 px-1">
                  <span className="text-[10px] uppercase tracking-[0.16em] tabular-nums" style={{ color: "var(--color-text-muted)" }}>
                    {new Date((data.progression || [])[0].date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.16em] tabular-nums" style={{ color: "var(--color-text-muted)" }}>
                    {new Date((data.progression || [])[(data.progression || []).length - 1].date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                </div>
              )}
            </GlassPanel>

            {/* ========== Averages + Tone Distribution ========== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <GlassPanel reduce={!!reduce} delay={0.5}>
                <PanelLabel dotColor="rgba(255, 255, 255, 0.7)">{t("analytics.averagePerformance")}</PanelLabel>
                <div className="space-y-3">
                  {METRIC_KEYS.map((m, i) => (
                    <ScoreBar
                      key={m}
                      label={t(`analytics.${m}`)}
                      value={averages[m]}
                      color={getScoreColor(averages[m])}
                      index={i}
                      reduce={!!reduce}
                    />
                  ))}
                </div>
              </GlassPanel>

              <GlassPanel reduce={!!reduce} delay={0.55}>
                <PanelLabel dotColor="rgba(255, 255, 255, 0.7)">{t("analytics.toneDistribution")}</PanelLabel>
                {(() => {
                  const total = Object.values((data.toneDistribution || {})).reduce((a, b) => a + b, 0) || 1;
                  const tones = [
                    { key: "positive", label: t("analytics.positive"), color: "#34d399", rgba: "52, 211, 153" },
                    { key: "neutral", label: t("analytics.neutral"), color: "#fb923c", rgba: "251, 146, 60" },
                    { key: "negative", label: t("analytics.negative"), color: "#ef4444", rgba: "239, 68, 68" },
                    { key: "hesitant", label: t("analytics.hesitant"), color: "#fb923c", rgba: "251, 146, 60" },
                  ];
                  return (
                    <div className="space-y-4">
                      <div
                        className="relative rounded-full overflow-hidden flex"
                        style={{ height: 8, background: "rgba(255, 255, 255, 0.04)" }}
                      >
                        {tones.map((tone, i) => {
                          const pct = (((data.toneDistribution || {})[tone.key] || 0) / total) * 100;
                          return (
                            <motion.span
                              key={tone.key}
                              style={{
                                backgroundColor: tone.color,
                                boxShadow: `0 0 12px rgba(${tone.rgba}, 0.45)`,
                                display: "block",
                                height: "100%",
                              }}
                              initial={reduce ? { width: `${pct}%` } : { width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.8, delay: 0.7 + i * 0.08, ease: EASE_OUT }}
                            />
                          );
                        })}
                      </div>
                      <div className="space-y-2.5">
                        {tones.map((tone, i) => {
                          const count = (data.toneDistribution || {})[tone.key] || 0;
                          const pct = Math.round((count / total) * 100);
                          return (
                            <motion.div
                              key={tone.key}
                              className="flex items-center justify-between"
                              initial={reduce ? { opacity: 0 } : { opacity: 0, x: -6 }}
                              animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: 0.85 + i * 0.05, ease: EASE_OUT }}
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ backgroundColor: tone.color }}
                                />
                                <span
                                  className="text-[10px] uppercase tracking-[0.16em]"
                                  style={{ color: "var(--color-text-muted)" }}
                                >
                                  {tone.label}
                                </span>
                              </div>
                              <span className="text-xs font-medium tabular-nums" style={{ color: tone.color }}>
                                <CountUp value={count} duration={1} />{" "}
                                <span style={{ opacity: 0.55, fontWeight: 400 }}>({pct}%)</span>
                              </span>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </GlassPanel>
            </div>

            {/* ========== Weekly Activity + Tone Breakdown ========== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <GlassPanel reduce={!!reduce} delay={0.65}>
                <PanelLabel dotColor="rgba(255, 255, 255, 0.7)">{t("analytics.weeklyActivity")}</PanelLabel>
                <BarChart
                  data={(data.weeklyActivity || []).map((w) => ({
                    label: w.week.split(" ")[1] || w.week,
                    value: w.count,
                    color:
                      w.avgScore >= 70
                        ? "#34d399"
                        : w.avgScore >= 40
                          ? "#fb923c"
                          : w.count > 0
                            ? "#ef4444"
                            : "rgba(255, 255, 255, 0.1)",
                  }))}
                  width={340}
                  height={110}
                  reduce={!!reduce}
                />
                <div className="flex justify-between mt-3">
                  <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: "var(--color-text-muted)" }}>
                    {t("analytics.weeksAgo")}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: "var(--color-text-muted)" }}>
                    {t("analytics.thisWeek")}
                  </span>
                </div>
              </GlassPanel>

              <GlassPanel reduce={!!reduce} delay={0.7}>
                <PanelLabel dotColor="rgba(255, 255, 255, 0.7)">{t("analytics.toneBreakdown")}</PanelLabel>
                <div className="space-y-3">
                  {Object.entries((data.toneBreakdown || {}))
                    .sort(([, a], [, b]) => b - a)
                    .map(([key, count], i) => {
                      const pct = Math.round((count / data.totalSessions) * 100);
                      const color = CLASSIFICATION_COLORS[key] || "var(--color-text-muted)";
                      const rgba = CLASSIFICATION_RGBA[key] || "255, 255, 255";
                      const label = key.replace("_", " ");
                      return (
                        <div key={key} className="flex items-center gap-3">
                          <span
                            className="text-[10px] uppercase tracking-[0.16em] capitalize shrink-0"
                            style={{ color: "var(--color-text-muted)", width: 100 }}
                          >
                            {label}
                          </span>
                          <div
                            className="flex-1 relative rounded-full overflow-hidden"
                            style={{ height: 4, background: "rgba(255, 255, 255, 0.04)" }}
                          >
                            <motion.div
                              className="absolute inset-y-0 left-0 rounded-full"
                              style={{
                                background: `linear-gradient(90deg, ${color}, rgba(${rgba}, 0.7))`,
                                boxShadow: `0 0 12px rgba(${rgba}, 0.45)`,
                              }}
                              initial={reduce ? { width: `${pct}%` } : { width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.9, delay: 0.85 + i * 0.06, ease: EASE_OUT }}
                            />
                          </div>
                          <span
                            className="text-xs font-medium tabular-nums shrink-0 text-right"
                            style={{ color, width: 60 }}
                          >
                            <CountUp value={count} duration={1} />{" "}
                            <span style={{ opacity: 0.55, fontWeight: 400 }}>({pct}%)</span>
                          </span>
                        </div>
                      );
                    })}
                </div>
              </GlassPanel>
            </div>

            {/* ========== Session-by-session breakdown ========== */}
            {(data.progression || []).length > 0 && (
              <motion.div
                className="relative overflow-hidden rounded-2xl"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.8, ease: EASE_OUT }}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                }}
              >
                <span
                  aria-hidden
                  className="absolute -top-14 -right-14 w-44 h-44 rounded-full pointer-events-none"
                  style={{
                    background: "radial-gradient(circle, rgba(255, 255, 255, 0.10), transparent 70%)",
                    filter: "blur(28px)",
                    opacity: 0.4,
                  }}
                />
                <div
                  className="relative px-5 sm:px-6 py-4"
                  style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}
                >
                  <PanelLabel dotColor="rgba(255, 255, 255, 0.7)">
                    {t("analytics.sessionHistory")}
                  </PanelLabel>
                </div>
                <div className="relative overflow-x-auto" style={{ scrollbarWidth: "thin" }}>
                  <table
                    className="w-full"
                    style={{ borderCollapse: "separate", borderSpacing: 0, minWidth: 640 }}
                  >
                    <thead>
                      <tr>
                        {[
                          t("analytics.date"),
                          t("analytics.overall"),
                          t("analytics.engagement"),
                          t("analytics.tone"),
                          t("analytics.social"),
                          t("analytics.verdict"),
                        ].map((h, i) => (
                          <th
                            key={i}
                            className="text-[10px] uppercase tracking-[0.18em] font-semibold text-left px-4 py-3"
                            style={{
                              color: "var(--color-text-muted)",
                              borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
                              background: "rgba(255, 255, 255, 0.015)",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <motion.tbody
                      initial="hidden"
                      animate="show"
                      variants={{
                        hidden: {},
                        show: {
                          transition: reduce ? {} : { staggerChildren: 0.04, delayChildren: 0.9 },
                        },
                      }}
                    >
                      {[...(data.progression || [])].reverse().slice(0, 20).map((p, i) => {
                        const color = getScoreColor(p.overall);
                        const classLabel = p.overallTone?.replace("_", " ") || "—";
                        const classColor = CLASSIFICATION_COLORS[p.overallTone || ""] || "var(--color-text-muted)";
                        const classRgba = CLASSIFICATION_RGBA[p.overallTone || ""] || "255, 255, 255";
                        return (
                          <motion.tr
                            key={i}
                            variants={{
                              hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 5 },
                              show: reduce
                                ? { opacity: 1 }
                                : { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_OUT } },
                            }}
                            className="group"
                            style={{ transition: "background 0.2s ease" }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                          >
                            <td className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.03)" }}>
                              <span className="text-xs tabular-nums" style={{ color: "var(--color-text-silver)" }}>
                                {new Date(p.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                              </span>
                            </td>
                            <td className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.03)" }}>
                              <span
                                className="text-sm font-medium tabular-nums"
                                style={{
                                  color,
                                  textShadow: `0 0 12px rgba(${getScoreRgba(p.overall)}, 0.35)`,
                                }}
                              >
                                {p.overall}
                              </span>
                            </td>
                            <td className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.03)" }}>
                              <span className="text-xs tabular-nums" style={{ color: getScoreColor(p.engagement) }}>{p.engagement}</span>
                            </td>
                            <td className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.03)" }}>
                              <span className="text-xs tabular-nums" style={{ color: getScoreColor(p.tone) }}>{p.tone}</span>
                            </td>
                            <td className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.03)" }}>
                              <span className="text-xs tabular-nums" style={{ color: getScoreColor(p.social) }}>{p.social}</span>
                            </td>
                            <td className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.03)" }}>
                              <span
                                className="text-[10px] uppercase tracking-[0.16em] capitalize font-semibold px-2.5 py-1 rounded-full"
                                style={{
                                  background: `rgba(${classRgba}, 0.10)`,
                                  border: `1px solid rgba(${classRgba}, 0.24)`,
                                  color: classColor,
                                }}
                              >
                                {classLabel}
                              </span>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </motion.tbody>
                  </table>
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

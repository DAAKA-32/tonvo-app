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
  if (score >= 70) return "var(--color-positive)";
  if (score >= 40) return "var(--color-neutral)";
  return "var(--color-negative)";
}

const TREND_CONFIG = {
  improving: { key: "improving", color: "var(--color-positive)", arrow: "↑" },
  declining: { key: "declining", color: "var(--color-negative)", arrow: "↓" },
  stable: { key: "stable", color: "var(--color-neutral)", arrow: "→" },
};

const CLASSIFICATION_COLORS: Record<string, string> = {
  very_positive: "#34d399",
  positive: "#6ee7b7",
  neutral: "#fbbf24",
  awkward: "#fb923c",
  negative: "#f87171",
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
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={`grad-${metricKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
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
      />
      <motion.circle
        cx={lastParts[0]}
        cy={lastParts[1]}
        r="3"
        fill={color}
        initial={reduce ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.1, ease: EASE_OUT }}
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
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
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
                rx="3"
                fill={d.color}
                opacity="0.8"
                initial={reduce ? { y, height: barH } : { y: baseY, height: 0 }}
                animate={{ y, height: barH }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.06,
                  ease: EASE_OUT,
                }}
              />
              <text
                x={x + barWidth / 2}
                y={height - 6}
                textAnchor="middle"
                fill="var(--color-text-muted)"
                fontSize="9"
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
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs w-24 shrink-0" style={{ color: "var(--color-text-muted)" }}>{label}</span>
      <div className="score-bar-track flex-1">
        <motion.div
          className="score-bar-fill"
          style={{ backgroundColor: color }}
          initial={reduce ? { width: `${value}%` } : { width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, delay: 0.1 + index * 0.06, ease: EASE_OUT }}
        />
      </div>
      <span className="text-xs font-bold w-8 text-right tabular-nums" style={{ color }}>
        <CountUp value={value} duration={1.1} />
      </span>
    </div>
  );
}

const METRIC_KEYS: MetricKey[] = ["overall", "engagement", "tone", "fluidity", "interest", "social"];

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

  return (
    <AppShell>
      <div style={{ maxWidth: 1100 }}>
        <motion.div
          className="mb-8"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE_OUT }}
        >
          <h1 className="section-heading text-glow mb-1">{t("analytics.title")}</h1>
          <p className="body-muted text-sm m-0">
            {t("analytics.subtitle")}
          </p>
        </motion.div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl shimmer" style={{ backgroundColor: "var(--color-surface-2)" }} />
            ))}
          </div>
        ) : !data || data.totalSessions === 0 ? (
          <motion.div
            className="glass-card p-12 text-center"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
          >
            <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--color-surface-2)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "var(--color-text-muted)" }}>
                <path d="M3 3v18h18" />
                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
              </svg>
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>{t("analytics.noData")}</p>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              {t("analytics.noDataDesc")}
            </p>
          </motion.div>
        ) : (
          <>
            {/* Top KPI row — stagger + count-up */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: reduce ? {} : { staggerChildren: 0.07, delayChildren: 0.05 },
                },
              }}
            >
              <motion.div
                className="kpi-card flex flex-col items-center text-center"
                variants={{
                  hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 12 },
                  show: reduce ? { opacity: 1 } : { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
                }}
              >
                <span className="text-xs mb-2" style={{ color: "var(--color-text-muted)" }}>{t("analytics.totalSessions")}</span>
                <span className="text-3xl font-bold tabular-nums" style={{ color: "var(--color-text)" }}>
                  <CountUp value={data.totalSessions} duration={1.4} />
                </span>
              </motion.div>

              <motion.div
                className="kpi-card flex flex-col items-center text-center"
                variants={{
                  hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 12 },
                  show: reduce ? { opacity: 1 } : { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
                }}
              >
                <span className="text-xs mb-2" style={{ color: "var(--color-text-muted)" }}>{t("analytics.avgScore")}</span>
                <span className="text-3xl font-bold tabular-nums" style={{ color: getScoreColor(averages.overall) }}>
                  <CountUp value={averages.overall} duration={1.4} />
                </span>
                <span className="text-[10px] mt-1" style={{ color: "var(--color-text-muted)" }}>{t("analytics.outOf100")}</span>
              </motion.div>

              <motion.div
                className="kpi-card flex flex-col items-center text-center"
                variants={{
                  hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 12 },
                  show: reduce ? { opacity: 1 } : { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
                }}
              >
                <span className="text-xs mb-2" style={{ color: "var(--color-text-muted)" }}>{t("analytics.trend")}</span>
                {trend && (
                  <div className="flex items-center gap-1.5">
                    <motion.span
                      className="text-lg font-bold"
                      style={{ color: trend.color }}
                      animate={
                        reduce
                          ? undefined
                          : trend.key === "improving"
                            ? { y: [0, -2, 0] }
                            : trend.key === "declining"
                              ? { y: [0, 2, 0] }
                              : undefined
                      }
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    >
                      {trend.arrow}
                    </motion.span>
                    <span className="text-sm font-semibold" style={{ color: trend.color }}>{t(`analytics.${trend.key}`)}</span>
                  </div>
                )}
                {delta !== 0 && (
                  <span className="text-[10px] mt-1 tabular-nums" style={{ color: delta > 0 ? "var(--color-positive)" : "var(--color-negative)" }}>
                    {delta > 0 ? "+" : ""}{delta} {t("analytics.vsAvg")}
                  </span>
                )}
              </motion.div>

              <motion.div
                className="kpi-card flex flex-col items-center text-center"
                variants={{
                  hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 12 },
                  show: reduce ? { opacity: 1 } : { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
                }}
              >
                <span className="text-xs mb-2" style={{ color: "var(--color-text-muted)" }}>{t("analytics.bestStreak")}</span>
                <span className="text-3xl font-bold tabular-nums" style={{ color: "var(--color-accent-light)" }}>
                  <CountUp value={data.streaks?.best ?? 0} duration={1.4} />
                </span>
                <span className="text-[10px] mt-1" style={{ color: "var(--color-text-muted)" }}>
                  {t("analytics.streakThreshold")}
                </span>
              </motion.div>
            </motion.div>

            {/* Progression Chart */}
            <motion.div
              className="glass-card p-6 mb-6"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.35, ease: EASE_OUT }}
            >
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-accent-light)" }}>
                  {t("analytics.scoreProgression")}
                </span>
                <div className="flex gap-1 relative">
                  {METRIC_KEYS.map((m) => {
                    const active = selectedMetric === m;
                    return (
                      <button
                        key={m}
                        onClick={() => setSelectedMetric(m)}
                        className="relative text-[10px] px-2 py-1 rounded-md border-none cursor-pointer"
                        style={{
                          background: "transparent",
                          color: active ? "var(--color-text)" : "var(--color-text-muted)",
                          transition: "color 0.2s ease",
                        }}
                      >
                        {active && !reduce && (
                          <motion.span
                            aria-hidden
                            layoutId="analytics-metric-pill"
                            className="absolute inset-0 rounded-md"
                            style={{ background: "var(--color-surface-3)", zIndex: 0 }}
                            transition={SPRING_PILL}
                          />
                        )}
                        <span style={{ position: "relative", zIndex: 1 }}>
                          {t(`analytics.${m}`)}
                        </span>
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
                    width={typeof window !== "undefined" ? Math.min(700, window.innerWidth - 80) : 700}
                    height={160}
                    reduce={!!reduce}
                  />
                </motion.div>
              ) : (
                <p className="text-xs text-center py-6" style={{ color: "var(--color-text-muted)" }}>
                  {t("analytics.minSessions")}
                </p>
              )}

              {(data.progression || []).length >= 2 && (
                <div className="flex justify-between mt-2 px-1">
                  <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                    {new Date((data.progression || [])[0].date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                  <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                    {new Date((data.progression || [])[(data.progression || []).length - 1].date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Averages + Tone Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <motion.div
                className="glass-card p-6"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.5, ease: EASE_OUT }}
              >
                <span className="text-xs font-medium uppercase tracking-wider block mb-4" style={{ color: "var(--color-accent-light)" }}>
                  {t("analytics.averagePerformance")}
                </span>
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
              </motion.div>

              <motion.div
                className="glass-card p-6"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.55, ease: EASE_OUT }}
              >
                <span className="text-xs font-medium uppercase tracking-wider block mb-4" style={{ color: "var(--color-accent-light)" }}>
                  {t("analytics.toneDistribution")}
                </span>
                {(() => {
                  const total = Object.values((data.toneDistribution || {})).reduce((a, b) => a + b, 0) || 1;
                  const tones = [
                    { key: "positive", label: t("analytics.positive"), color: "var(--color-positive)" },
                    { key: "neutral", label: t("analytics.neutral"), color: "var(--color-neutral)" },
                    { key: "negative", label: t("analytics.negative"), color: "var(--color-negative)" },
                    { key: "hesitant", label: t("analytics.hesitant"), color: "var(--color-neutral)" },
                  ];
                  return (
                    <div className="space-y-4">
                      <div className="sentiment-bar" style={{ height: 10 }}>
                        {tones.map((tone, i) => {
                          const pct = (((data.toneDistribution || {})[tone.key] || 0) / total) * 100;
                          return (
                            <motion.div
                              key={tone.key}
                              style={{ backgroundColor: tone.color, originX: 0 }}
                              initial={reduce ? { width: `${pct}%` } : { width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.8, delay: 0.7 + i * 0.08, ease: EASE_OUT }}
                            />
                          );
                        })}
                      </div>
                      <div className="space-y-2">
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
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tone.color }} />
                                <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{tone.label}</span>
                              </div>
                              <span className="text-xs font-medium tabular-nums" style={{ color: "var(--color-text)" }}>
                                <CountUp value={count} duration={1} /> ({pct}%)
                              </span>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            </div>

            {/* Weekly Activity + Tone Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <motion.div
                className="glass-card p-6"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.65, ease: EASE_OUT }}
              >
                <span className="text-xs font-medium uppercase tracking-wider block mb-4" style={{ color: "var(--color-accent-light)" }}>
                  {t("analytics.weeklyActivity")}
                </span>
                <BarChart
                  data={(data.weeklyActivity || []).map((w) => ({
                    label: w.week.split(" ")[1] || w.week,
                    value: w.count,
                    color: w.avgScore >= 70 ? "var(--color-positive)" : w.avgScore >= 40 ? "var(--color-neutral)" : w.count > 0 ? "var(--color-negative)" : "rgba(200,200,216,0.1)",
                  }))}
                  width={320}
                  height={100}
                  reduce={!!reduce}
                />
                <div className="flex justify-between mt-2">
                  <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>{t("analytics.weeksAgo")}</span>
                  <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>{t("analytics.thisWeek")}</span>
                </div>
              </motion.div>

              <motion.div
                className="glass-card p-6"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.7, ease: EASE_OUT }}
              >
                <span className="text-xs font-medium uppercase tracking-wider block mb-4" style={{ color: "var(--color-accent-light)" }}>
                  {t("analytics.toneBreakdown")}
                </span>
                <div className="space-y-3">
                  {Object.entries((data.toneBreakdown || {}))
                    .sort(([, a], [, b]) => b - a)
                    .map(([key, count], i) => {
                      const pct = Math.round((count / data.totalSessions) * 100);
                      const color = CLASSIFICATION_COLORS[key] || "var(--color-text-muted)";
                      const label = key.replace("_", " ");
                      return (
                        <div key={key} className="flex items-center gap-3">
                          <span className="text-xs w-24 shrink-0 capitalize" style={{ color: "var(--color-text-muted)" }}>{label}</span>
                          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-surface-2)" }}>
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: color }}
                              initial={reduce ? { width: `${pct}%` } : { width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.9, delay: 0.85 + i * 0.06, ease: EASE_OUT }}
                            />
                          </div>
                          <span className="text-xs font-medium w-12 text-right tabular-nums" style={{ color }}>
                            <CountUp value={count} duration={1} /> ({pct}%)
                          </span>
                        </div>
                      );
                    })}
                </div>
              </motion.div>
            </div>

            {/* Session-by-session breakdown */}
            {(data.progression || []).length > 0 && (
              <motion.div
                className="glass-card-static overflow-hidden"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.8, ease: EASE_OUT }}
              >
                <div className="p-4 border-b" style={{ borderColor: "rgba(39,39,42,0.5)" }}>
                  <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-accent-light)" }}>
                    {t("analytics.sessionHistory")}
                  </span>
                </div>
                <div className="table-scroll">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>{t("analytics.date")}</th>
                        <th>{t("analytics.overall")}</th>
                        <th>{t("analytics.engagement")}</th>
                        <th>{t("analytics.tone")}</th>
                        <th>{t("analytics.social")}</th>
                        <th>{t("analytics.verdict")}</th>
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
                        const classLabel = p.overallTone?.replace("_", " ") || "--";
                        const classColor = CLASSIFICATION_COLORS[p.overallTone || ""] || "var(--color-text-muted)";
                        return (
                          <motion.tr
                            key={i}
                            variants={{
                              hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 5 },
                              show: reduce
                                ? { opacity: 1 }
                                : { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_OUT } },
                            }}
                          >
                            <td>
                              <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                                {new Date(p.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                              </span>
                            </td>
                            <td><span className="text-xs font-bold tabular-nums" style={{ color }}>{p.overall}</span></td>
                            <td><span className="text-xs tabular-nums" style={{ color: getScoreColor(p.engagement) }}>{p.engagement}</span></td>
                            <td><span className="text-xs tabular-nums" style={{ color: getScoreColor(p.tone) }}>{p.tone}</span></td>
                            <td><span className="text-xs tabular-nums" style={{ color: getScoreColor(p.social) }}>{p.social}</span></td>
                            <td>
                              <span className="text-xs capitalize font-medium px-2 py-0.5 rounded-md"
                                style={{ backgroundColor: classColor + "18", color: classColor }}>
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
    </AppShell>
  );
}

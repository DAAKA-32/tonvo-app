"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import AppShell from "@/components/AppShell";
import UpgradePrompt from "@/components/UpgradePrompt";
import { usePlan } from "@/hooks/usePlan";

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
  improving: { label: "Improving", color: "var(--color-positive)", arrow: "^" },
  declining: { label: "Declining", color: "var(--color-negative)", arrow: "v" },
  stable: { label: "Stable", color: "var(--color-neutral)", arrow: "-" },
};

const CLASSIFICATION_COLORS: Record<string, string> = {
  very_positive: "#34d399",
  positive: "#6ee7b7",
  neutral: "#fbbf24",
  awkward: "#fb923c",
  negative: "#f87171",
};

function MiniLineChart({
  data,
  metricKey,
  width = 320,
  height = 120,
}: {
  data: ProgressionPoint[];
  metricKey: MetricKey;
  width?: number;
  height?: number;
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

  // Gradient area
  const areaPoints = [
    `${padding},${padding + chartH}`,
    ...points,
    `${padding + chartW},${padding + chartH}`,
  ].join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={`grad-${metricKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#grad-${metricKey})`} />
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Last point dot */}
      {(() => {
        const lastParts = points[points.length - 1].split(",");
        return (
          <circle
            cx={lastParts[0]}
            cy={lastParts[1]}
            r="3"
            fill={color}
          />
        );
      })()}
    </svg>
  );
}

function BarChart({
  data,
  width = 320,
  height = 100,
}: {
  data: { label: string; value: number; color: string }[];
  width?: number;
  height?: number;
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
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                rx="3"
                fill={d.color}
                opacity="0.8"
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

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs w-24 shrink-0" style={{ color: "var(--color-text-muted)" }}>{label}</span>
      <div className="score-bar-track flex-1">
        <div className="score-bar-fill" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-bold w-8 text-right" style={{ color }}>{value}</span>
    </div>
  );
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const { can, loading: planLoading } = usePlan();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("overall");

  const hasAccess = planLoading || can("analyticsPage");

  useEffect(() => {
    if (!user || !hasAccess) return;

    fetch("/api/analytics", {
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
  }, [user, hasAccess]);

  // Gate: analytics is Pro+ only
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

  // Compute deltas (last session vs average)
  const progression = data?.progression || [];
  const lastSession = progression.length > 0 ? progression[progression.length - 1] : null;
  const delta = lastSession && data?.averages
    ? lastSession.overall - (data.averages || { overall: 0, engagement: 0, tone: 0, fluidity: 0, interest: 0, social: 0 }).overall
    : 0;

  return (
    <AppShell>
      <div style={{ maxWidth: 1100 }}>
        <div className="mb-8">
          <h1 className="section-heading text-glow mb-1">Analytics</h1>
          <p className="body-muted text-sm m-0">
            Track your conversation performance over time.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl shimmer" style={{ backgroundColor: "var(--color-surface-2)" }} />
            ))}
          </div>
        ) : !data || data.totalSessions === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(200, 200, 216, 0.06)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "var(--color-text-muted)" }}>
                <path d="M3 3v18h18" />
                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
              </svg>
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>No analytics yet</p>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              Complete at least one session to see your performance trends.
            </p>
          </div>
        ) : (
          <>
            {/* Top KPI row */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {/* Total Sessions */}
              <div className="kpi-card flex flex-col items-center text-center">
                <span className="text-xs mb-2" style={{ color: "var(--color-text-muted)" }}>Total Sessions</span>
                <span className="text-3xl font-bold" style={{ color: "var(--color-text)" }}>{data.totalSessions}</span>
              </div>

              {/* Average Score */}
              <div className="kpi-card flex flex-col items-center text-center">
                <span className="text-xs mb-2" style={{ color: "var(--color-text-muted)" }}>Avg Score</span>
                <span className="text-3xl font-bold" style={{ color: getScoreColor((data.averages || { overall: 0, engagement: 0, tone: 0, fluidity: 0, interest: 0, social: 0 }).overall) }}>
                  {(data.averages || { overall: 0, engagement: 0, tone: 0, fluidity: 0, interest: 0, social: 0 }).overall}
                </span>
                <span className="text-[10px] mt-1" style={{ color: "var(--color-text-muted)" }}>/100</span>
              </div>

              {/* Trend */}
              <div className="kpi-card flex flex-col items-center text-center">
                <span className="text-xs mb-2" style={{ color: "var(--color-text-muted)" }}>Trend</span>
                {trend && (
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-bold" style={{ color: trend.color }}>{trend.arrow}</span>
                    <span className="text-sm font-semibold" style={{ color: trend.color }}>{trend.label}</span>
                  </div>
                )}
                {delta !== 0 && (
                  <span className="text-[10px] mt-1" style={{ color: delta > 0 ? "var(--color-positive)" : "var(--color-negative)" }}>
                    {delta > 0 ? "+" : ""}{delta} vs avg
                  </span>
                )}
              </div>

              {/* Streak */}
              <div className="kpi-card flex flex-col items-center text-center">
                <span className="text-xs mb-2" style={{ color: "var(--color-text-muted)" }}>Best Streak</span>
                <span className="text-3xl font-bold" style={{ color: "var(--color-accent-light)" }}>
                  {data.streaks?.best ?? 0}
                </span>
                <span className="text-[10px] mt-1" style={{ color: "var(--color-text-muted)" }}>
                  sessions {">"}= 60
                </span>
              </div>
            </div>

            {/* Progression Chart */}
            <div className="glass-card p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-accent-light)" }}>
                  Score Progression
                </span>
                <div className="flex gap-1">
                  {(["overall", "engagement", "tone", "fluidity", "interest", "social"] as MetricKey[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setSelectedMetric(m)}
                      className="text-[10px] px-2 py-1 rounded-md border-none cursor-pointer capitalize"
                      style={{
                        backgroundColor: selectedMetric === m ? "rgba(200, 200, 216, 0.12)" : "transparent",
                        color: selectedMetric === m ? "var(--color-text)" : "var(--color-text-muted)",
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {(data.progression || []).length >= 2 ? (
                <div className="flex justify-center">
                  <MiniLineChart
                    data={(data.progression || [])}
                    metricKey={selectedMetric}
                    width={typeof window !== "undefined" ? Math.min(700, window.innerWidth - 80) : 700}
                    height={160}
                  />
                </div>
              ) : (
                <p className="text-xs text-center py-6" style={{ color: "var(--color-text-muted)" }}>
                  Need at least 2 sessions to show progression.
                </p>
              )}

              {/* Session labels under chart */}
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
            </div>

            {/* Grid: Averages + Distributions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Average Performance */}
              <div className="glass-card p-6">
                <span className="text-xs font-medium uppercase tracking-wider block mb-4" style={{ color: "var(--color-accent-light)" }}>
                  Average Performance
                </span>
                <div className="space-y-3">
                  <ScoreBar label="Overall" value={(data.averages || { overall: 0, engagement: 0, tone: 0, fluidity: 0, interest: 0, social: 0 }).overall} color={getScoreColor((data.averages || { overall: 0, engagement: 0, tone: 0, fluidity: 0, interest: 0, social: 0 }).overall)} />
                  <ScoreBar label="Engagement" value={(data.averages || { overall: 0, engagement: 0, tone: 0, fluidity: 0, interest: 0, social: 0 }).engagement} color={getScoreColor((data.averages || { overall: 0, engagement: 0, tone: 0, fluidity: 0, interest: 0, social: 0 }).engagement)} />
                  <ScoreBar label="Tone" value={(data.averages || { overall: 0, engagement: 0, tone: 0, fluidity: 0, interest: 0, social: 0 }).tone} color={getScoreColor((data.averages || { overall: 0, engagement: 0, tone: 0, fluidity: 0, interest: 0, social: 0 }).tone)} />
                  <ScoreBar label="Fluidity" value={(data.averages || { overall: 0, engagement: 0, tone: 0, fluidity: 0, interest: 0, social: 0 }).fluidity} color={getScoreColor((data.averages || { overall: 0, engagement: 0, tone: 0, fluidity: 0, interest: 0, social: 0 }).fluidity)} />
                  <ScoreBar label="Interest" value={(data.averages || { overall: 0, engagement: 0, tone: 0, fluidity: 0, interest: 0, social: 0 }).interest} color={getScoreColor((data.averages || { overall: 0, engagement: 0, tone: 0, fluidity: 0, interest: 0, social: 0 }).interest)} />
                  <ScoreBar label="Social" value={(data.averages || { overall: 0, engagement: 0, tone: 0, fluidity: 0, interest: 0, social: 0 }).social} color={getScoreColor((data.averages || { overall: 0, engagement: 0, tone: 0, fluidity: 0, interest: 0, social: 0 }).social)} />
                </div>
              </div>

              {/* Tone Distribution */}
              <div className="glass-card p-6">
                <span className="text-xs font-medium uppercase tracking-wider block mb-4" style={{ color: "var(--color-accent-light)" }}>
                  Tone Distribution
                </span>
                {(() => {
                  const total = Object.values((data.toneDistribution || {})).reduce((a, b) => a + b, 0) || 1;
                  const tones = [
                    { key: "positive", label: "Positive", color: "var(--color-positive)" },
                    { key: "neutral", label: "Neutral", color: "var(--color-neutral)" },
                    { key: "negative", label: "Negative", color: "var(--color-negative)" },
                    { key: "hesitant", label: "Hesitant", color: "var(--color-neutral)" },
                  ];
                  return (
                    <div className="space-y-4">
                      {/* Bar */}
                      <div className="sentiment-bar" style={{ height: 10 }}>
                        {tones.map((t) => (
                          <div
                            key={t.key}
                            style={{
                              width: `${(((data.toneDistribution || {})[t.key] || 0) / total) * 100}%`,
                              backgroundColor: t.color,
                            }}
                          />
                        ))}
                      </div>
                      {/* Labels */}
                      <div className="space-y-2">
                        {tones.map((t) => {
                          const count = (data.toneDistribution || {})[t.key] || 0;
                          const pct = Math.round((count / total) * 100);
                          return (
                            <div key={t.key} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                                <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{t.label}</span>
                              </div>
                              <span className="text-xs font-medium" style={{ color: "var(--color-text)" }}>
                                {count} ({pct}%)
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Weekly Activity + Classification */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Weekly Activity */}
              <div className="glass-card p-6">
                <span className="text-xs font-medium uppercase tracking-wider block mb-4" style={{ color: "var(--color-accent-light)" }}>
                  Weekly Activity
                </span>
                <BarChart
                  data={(data.weeklyActivity || []).map((w) => ({
                    label: w.week.split(" ")[1] || w.week,
                    value: w.count,
                    color: w.avgScore >= 70 ? "var(--color-positive)" : w.avgScore >= 40 ? "var(--color-neutral)" : w.count > 0 ? "var(--color-negative)" : "rgba(200,200,216,0.1)",
                  }))}
                  width={320}
                  height={100}
                />
                <div className="flex justify-between mt-2">
                  <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>8 weeks ago</span>
                  <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>This week</span>
                </div>
              </div>

              {/* Tone Breakdown */}
              <div className="glass-card p-6">
                <span className="text-xs font-medium uppercase tracking-wider block mb-4" style={{ color: "var(--color-accent-light)" }}>
                  Tone Breakdown
                </span>
                <div className="space-y-3">
                  {Object.entries((data.toneBreakdown || {}))
                    .sort(([, a], [, b]) => b - a)
                    .map(([key, count]) => {
                      const pct = Math.round((count / data.totalSessions) * 100);
                      const color = CLASSIFICATION_COLORS[key] || "var(--color-text-muted)";
                      const label = key.replace("_", " ");
                      return (
                        <div key={key} className="flex items-center gap-3">
                          <span className="text-xs w-24 shrink-0 capitalize" style={{ color: "var(--color-text-muted)" }}>{label}</span>
                          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(200,200,216,0.06)" }}>
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                          </div>
                          <span className="text-xs font-medium w-12 text-right" style={{ color }}>{count} ({pct}%)</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Session-by-session breakdown table */}
            {(data.progression || []).length > 0 && (
              <div className="glass-card-static overflow-hidden">
                <div className="p-4 border-b" style={{ borderColor: "rgba(39,39,42,0.5)" }}>
                  <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-accent-light)" }}>
                    Session History
                  </span>
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Overall</th>
                      <th>Engagement</th>
                      <th>Tone</th>
                      <th>Social</th>
                      <th>Verdict</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...(data.progression || [])].reverse().slice(0, 20).map((p, i) => {
                      const color = getScoreColor(p.overall);
                      const classLabel = p.overallTone?.replace("_", " ") || "--";
                      const classColor = CLASSIFICATION_COLORS[p.overallTone || ""] || "var(--color-text-muted)";
                      return (
                        <tr key={i}>
                          <td>
                            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                              {new Date(p.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                          </td>
                          <td><span className="text-xs font-bold" style={{ color }}>{p.overall}</span></td>
                          <td><span className="text-xs" style={{ color: getScoreColor(p.engagement) }}>{p.engagement}</span></td>
                          <td><span className="text-xs" style={{ color: getScoreColor(p.tone) }}>{p.tone}</span></td>
                          <td><span className="text-xs" style={{ color: getScoreColor(p.social) }}>{p.social}</span></td>
                          <td>
                            <span className="text-xs capitalize font-medium px-2 py-0.5 rounded-md"
                              style={{ backgroundColor: classColor + "18", color: classColor }}>
                              {classLabel}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}

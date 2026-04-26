"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import AppShell from "@/components/AppShell";
import CountUp from "@/components/motion/CountUp";
import { usePlan } from "@/hooks/usePlan";
import type { Conversation } from "@/types/database";

const SPRING_PILL = { type: "spring" as const, stiffness: 380, damping: 32, mass: 0.8 };
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

type DateRange = "all" | "today" | "week" | "month";
type ToneFilter = "all" | "positive" | "neutral" | "negative";

/* ----------------------------------------------------------------- */
/*  Helpers                                                          */
/* ----------------------------------------------------------------- */
function formatDuration(startStr: string, endStr: string | null): string {
  if (!endStr) return "--";
  const diff = Math.floor((new Date(endStr).getTime() - new Date(startStr).getTime()) / 1000);
  if (diff < 0) return "--";
  const m = Math.floor(diff / 60);
  const s = diff % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function dayLabel(date: Date, today: Date, t: (k: string) => string): string {
  if (isSameDay(date, today)) return t("history.today");
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (isSameDay(date, yesterday)) return t("history.yesterday");
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: today.getFullYear() === date.getFullYear() ? undefined : "numeric",
  });
}

function groupByDay(items: Conversation[]): { dayKey: string; date: Date; items: Conversation[] }[] {
  const groups = new Map<string, { date: Date; items: Conversation[] }>();
  for (const item of items) {
    const date = new Date(item.created_at);
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const existing = groups.get(key);
    if (existing) {
      existing.items.push(item);
    } else {
      groups.set(key, { date, items: [item] });
    }
  }
  return Array.from(groups.entries()).map(([dayKey, g]) => ({ dayKey, ...g }));
}

const TONE_COLORS: Record<string, { dot: string; bg: string; label: string }> = {
  positive: { dot: "var(--color-positive)", bg: "rgba(52, 211, 153, 0.1)", label: "Positive" },
  neutral: { dot: "var(--color-neutral)", bg: "rgba(251, 191, 36, 0.1)", label: "Neutral" },
  negative: { dot: "var(--color-negative)", bg: "rgba(248, 113, 113, 0.1)", label: "Negative" },
  hesitant: { dot: "var(--color-neutral)", bg: "rgba(251, 191, 36, 0.1)", label: "Hesitant" },
};

/* ----------------------------------------------------------------- */
/*  Filter chip — magnetic pill via shared layoutId                  */
/* ----------------------------------------------------------------- */
interface ChipProps {
  active: boolean;
  onClick: () => void;
  layoutId: string;
  reduce: boolean;
  children: React.ReactNode;
}

function FilterChip({ active, onClick, layoutId, reduce, children }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={`filter-chip ${active ? "active" : ""}`}
      style={{ position: "relative" }}
    >
      {active && !reduce && (
        <motion.span
          aria-hidden
          layoutId={layoutId}
          className="absolute inset-0 rounded-md"
          style={{
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            zIndex: 0,
          }}
          transition={SPRING_PILL}
        />
      )}
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </button>
  );
}

/* ----------------------------------------------------------------- */
/*  Event card — collapsed by default, expands to show summary       */
/* ----------------------------------------------------------------- */
interface EventCardProps {
  conv: Conversation;
  expanded: boolean;
  onToggle: () => void;
  reduce: boolean;
}

function EventCard({ conv, expanded, onToggle, reduce }: EventCardProps) {
  const start = new Date(conv.created_at);
  const duration = formatDuration(conv.created_at, conv.ended_at);
  const toneInfo = conv.overall_tone ? TONE_COLORS[conv.overall_tone] : null;
  const score = conv.score?.overall;

  return (
    <motion.div
      className="history-event"
      whileHover={reduce ? undefined : { x: 2 }}
      transition={{ type: "spring", stiffness: 400, damping: 32 }}
    >
      {/* Timeline dot + connector are CSS-driven via .history-event::before */}
      <button
        onClick={onToggle}
        className="history-event__head"
        aria-expanded={expanded}
      >
        <span className="history-event__time">{formatTime(start)}</span>

        <span className="history-event__title">
          {conv.title}
        </span>

        {toneInfo && (
          <span
            className="history-event__tone"
            style={{ backgroundColor: toneInfo.bg, color: toneInfo.dot }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: toneInfo.dot }} />
            {toneInfo.label}
          </span>
        )}

        {typeof score === "number" && (
          <span className="history-event__score tabular-nums">
            <CountUp value={score} duration={1} />
          </span>
        )}

        <span className="history-event__duration tabular-nums">{duration}</span>

        <motion.svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="history-event__chevron"
          animate={{ rotate: expanded ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          aria-hidden
        >
          <polyline points="9 18 15 12 9 6" />
        </motion.svg>
      </button>

      {/* Expandable summary panel */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="content"
            className="history-event__body"
            initial={reduce ? { opacity: 0, height: 0 } : { opacity: 0, height: 0 }}
            animate={
              reduce
                ? { opacity: 1, height: "auto" }
                : { opacity: 1, height: "auto" }
            }
            exit={
              reduce
                ? { opacity: 0, height: 0 }
                : { opacity: 0, height: 0 }
            }
            transition={{ duration: 0.32, ease: EASE_OUT }}
            style={{ overflow: "hidden" }}
          >
            <div className="history-event__body-inner">
              {conv.summary ? (
                <p className="history-event__summary">{conv.summary}</p>
              ) : (
                <p className="history-event__summary-empty">No summary yet.</p>
              )}
              <Link
                href={`/summary/${conv.id}`}
                className="history-event__open"
              >
                Open full session
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ----------------------------------------------------------------- */
/*  Page                                                             */
/* ----------------------------------------------------------------- */
export default function HistoryPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { features } = usePlan();
  const reduce = useReducedMotion();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [tone, setTone] = useState<ToneFilter>("all");
  const [range, setRange] = useState<DateRange>("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;

    async function fetchHistory() {
      let query = supabase
        .from("conversations")
        .select("*")
        .eq("user_id", user!.uid)
        .order("created_at", { ascending: false });

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
  }, [user, features.historyRetentionDays]);

  const filtered = useMemo(() => {
    const now = new Date();
    const cutoffMap: Record<DateRange, number | null> = {
      all: null,
      today: 0,
      week: 7,
      month: 30,
    };
    const cutoffDays = cutoffMap[range];
    let cutoff: Date | null = null;
    if (cutoffDays !== null) {
      cutoff = new Date(now);
      if (cutoffDays === 0) {
        cutoff.setHours(0, 0, 0, 0);
      } else {
        cutoff.setDate(cutoff.getDate() - cutoffDays);
      }
    }

    const q = search.trim().toLowerCase();

    return conversations.filter((c) => {
      if (tone !== "all" && c.overall_tone !== tone) return false;
      if (cutoff && new Date(c.created_at) < cutoff) return false;
      if (q) {
        const inTitle = c.title?.toLowerCase().includes(q);
        const inSummary = c.summary?.toLowerCase().includes(q);
        if (!inTitle && !inSummary) return false;
      }
      return true;
    });
  }, [conversations, tone, range, search]);

  const groupedDays = useMemo(() => groupByDay(filtered), [filtered]);

  const today = useMemo(() => new Date(), []);

  const toneCounts = useMemo(
    () =>
      conversations.reduce(
        (acc, c) => {
          const tt = c.overall_tone as string;
          if (tt && tt in acc) acc[tt as keyof typeof acc]++;
          return acc;
        },
        { positive: 0, neutral: 0, negative: 0, hesitant: 0 }
      ),
    [conversations]
  );

  function toggleExpanded(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <AppShell>
      <div className="history-page" style={{ maxWidth: 1000 }}>
        {/* Header */}
        <motion.div
          className="mb-6"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE_OUT }}
        >
          <h1 className="section-heading text-glow mb-1">{t("history.title")}</h1>
          <p className="body-muted text-sm m-0">
            <CountUp value={filtered.length} duration={0.9} />{" · "}
            {t("history.sessionCount", { count: filtered.length }).replace(/^\d+\s*/, "")}
          </p>
        </motion.div>

        {/* Search + filters */}
        <motion.div
          className="history-controls mb-6"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05, ease: EASE_OUT }}
        >
          {/* Search bar */}
          <div className="history-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("history.searchPlaceholder")}
              aria-label="Search history"
            />
          </div>

          {/* Date range */}
          <div className="filter-bar history-filter-bar">
            {([
              { key: "all", label: t("common.all") },
              { key: "today", label: t("history.today") },
              { key: "week", label: t("history.thisWeek") },
              { key: "month", label: t("history.thisMonth") },
            ] as { key: DateRange; label: string }[]).map((chip) => (
              <FilterChip
                key={chip.key}
                active={range === chip.key}
                onClick={() => setRange(chip.key)}
                layoutId="history-range-pill"
                reduce={!!reduce}
              >
                {chip.label}
              </FilterChip>
            ))}
          </div>

          {/* Tone filter */}
          <div className="filter-bar history-filter-bar">
            {([
              { key: "all", label: t("common.all"), count: conversations.length },
              { key: "positive", label: t("common.positive"), count: toneCounts.positive },
              { key: "neutral", label: t("common.neutral"), count: toneCounts.neutral },
              { key: "negative", label: t("common.negative"), count: toneCounts.negative },
            ] as { key: ToneFilter; label: string; count: number }[]).map((chip) => (
              <FilterChip
                key={chip.key}
                active={tone === chip.key}
                onClick={() => setTone(chip.key)}
                layoutId="history-tone-pill"
                reduce={!!reduce}
              >
                {chip.label}
                <span style={{ opacity: 0.4, marginLeft: 6 }}>{chip.count}</span>
              </FilterChip>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <AnimatePresence mode="wait" initial={false}>
          {loadingData ? (
            <motion.div
              key="loading"
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-14 rounded-lg shimmer"
                  style={{ backgroundColor: "var(--color-surface-2)" }}
                />
              ))}
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div
              key={`empty-${tone}-${range}-${search}`}
              className="empty-state glass-card-static"
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
            >
              <div className="empty-state-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--color-text-muted)" }}>
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M12 7v5l4 2" />
                </svg>
              </div>
              <p className="text-sm font-medium m-0 mb-1" style={{ color: "var(--color-text)" }}>
                {conversations.length === 0
                  ? t("history.noSessions")
                  : t("history.noFilterResults", { filter: tone })}
              </p>
              <p className="text-xs m-0" style={{ color: "var(--color-text-muted)" }}>
                {conversations.length === 0
                  ? t("history.noSessionsDesc")
                  : t("history.noFilterResultsDesc")}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={`timeline-${tone}-${range}`}
              className="history-timeline"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: reduce ? {} : { staggerChildren: 0.04, delayChildren: 0.05 },
                },
              }}
            >
              {groupedDays.map((group) => (
                <motion.section
                  key={group.dayKey}
                  className="history-day"
                  variants={{
                    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 8 },
                    show: reduce
                      ? { opacity: 1 }
                      : { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
                  }}
                >
                  <div className="history-day__header">
                    <span className="history-day__label">
                      {dayLabel(group.date, today, t)}
                    </span>
                    <span className="history-day__count">
                      {group.items.length}
                    </span>
                    <span className="history-day__rule" aria-hidden />
                  </div>

                  <motion.div
                    className="history-day__events"
                    initial="hidden"
                    animate="show"
                    variants={{
                      hidden: {},
                      show: {
                        transition: reduce ? {} : { staggerChildren: 0.035 },
                      },
                    }}
                  >
                    {group.items.map((conv) => (
                      <motion.div
                        key={conv.id}
                        variants={{
                          hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 6 },
                          show: reduce
                            ? { opacity: 1 }
                            : { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
                        }}
                      >
                        <EventCard
                          conv={conv}
                          expanded={expanded.has(conv.id)}
                          onToggle={() => toggleExpanded(conv.id)}
                          reduce={!!reduce}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.section>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}

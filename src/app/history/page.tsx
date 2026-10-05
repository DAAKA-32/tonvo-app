"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth-context";
import { listConversations } from "@/lib/conversations-client";
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

const TONE_COLORS: Record<string, { dot: string; bg: string; label: string; rgba: string }> = {
  positive: { dot: "var(--color-positive)", bg: "rgba(52, 211, 153, 0.10)", label: "Positive", rgba: "52, 211, 153" },
  neutral: { dot: "var(--color-neutral)", bg: "rgba(251, 191, 36, 0.10)", label: "Neutral", rgba: "251, 191, 36" },
  negative: { dot: "var(--color-negative)", bg: "rgba(251, 113, 133, 0.10)", label: "Negative", rgba: "251, 113, 133" },
  hesitant: { dot: "var(--color-neutral)", bg: "rgba(251, 191, 36, 0.10)", label: "Hesitant", rgba: "251, 191, 36" },
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
      className="relative text-[11px] font-medium px-3.5 py-1.5 rounded-full cursor-pointer whitespace-nowrap"
      style={{
        color: active ? "var(--color-text)" : "var(--color-text-muted)",
        transition: "color 0.2s ease",
        zIndex: 1,
      }}
    >
      {active && !reduce && (
        <motion.span
          aria-hidden
          layoutId={layoutId}
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--color-text) 10%, transparent), color-mix(in srgb, var(--color-text) 4%, transparent))",
            border: "1px solid color-mix(in srgb, var(--color-text) 14%, transparent)",
            boxShadow: "0 6px 20px -8px rgba(0, 0, 0, 0.5)",
            zIndex: -1,
          }}
          transition={SPRING_PILL}
        />
      )}
      {active && reduce && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--color-text) 10%, transparent), color-mix(in srgb, var(--color-text) 4%, transparent))",
            border: "1px solid color-mix(in srgb, var(--color-text) 14%, transparent)",
            zIndex: -1,
          }}
        />
      )}
      <span className="relative">{children}</span>
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
  const railColor = toneInfo?.dot ?? "color-mix(in srgb, var(--color-text) 15%, transparent)";
  const railEnd = toneInfo ? `rgba(${toneInfo.rgba}, 0.4)` : "transparent";
  const scoreColor =
    typeof score === "number"
      ? score >= 70
        ? "var(--color-positive)"
        : score >= 40
          ? "#fb923c"
          : "var(--color-negative)"
      : "var(--color-text-muted)";

  return (
    <motion.div
      whileHover={reduce ? undefined : { x: 4 }}
      transition={{ type: "spring", stiffness: 400, damping: 32 }}
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: "color-mix(in srgb, var(--color-text) 2%, transparent)",
        border: "1px solid color-mix(in srgb, var(--color-text) 4%, transparent)",
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}
    >
      <button
        onClick={onToggle}
        aria-expanded={expanded}
        className="group flex items-stretch gap-3 sm:gap-4 p-3 sm:p-4 w-full cursor-pointer text-left"
        style={{ background: "transparent", border: "none", color: "inherit" }}
      >
        {/* tone-color rail */}
        <span
          aria-hidden
          className="shrink-0 self-stretch w-[3px] rounded-full"
          style={{
            background: `linear-gradient(180deg, ${railColor}, ${railEnd})`,
            boxShadow: toneInfo ? `0 0 14px rgba(${toneInfo.rgba}, 0.35)` : "none",
          }}
        />

        {/* time */}
        <div className="flex flex-col items-end justify-center shrink-0" style={{ minWidth: 56 }}>
          <span className="text-[13px] tabular-nums font-medium" style={{ color: "var(--color-text)" }}>
            {formatTime(start)}
          </span>
          <span className="text-[10px] tabular-nums" style={{ color: "var(--color-text-muted)" }}>
            {duration}
          </span>
        </div>

        {/* title + tone chip */}
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
          <p className="text-sm m-0 truncate font-medium" style={{ color: "var(--color-text)" }}>
            {conv.title}
          </p>
          {toneInfo && (
            <span
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] self-start"
              style={{ color: toneInfo.dot }}
            >
              <span className="w-1 h-1 rounded-full" style={{ backgroundColor: toneInfo.dot }} />
              {toneInfo.label}
            </span>
          )}
        </div>

        {/* score */}
        {typeof score === "number" && (
          <span
            className="shrink-0 self-center text-2xl font-extralight tabular-nums leading-none"
            style={{
              color: scoreColor,
              letterSpacing: "-0.03em",
              textShadow:
                score >= 70
                  ? "0 0 18px rgba(52, 211, 153, 0.35)"
                  : score >= 40
                    ? "0 0 18px rgba(251, 146, 60, 0.30)"
                    : "0 0 18px rgba(239, 68, 68, 0.30)",
            }}
          >
            <CountUp value={score} duration={1} />
          </span>
        )}

        {/* chevron */}
        <motion.span
          aria-hidden
          className="shrink-0 self-center inline-flex items-center justify-center w-7 h-7 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"
          style={{
            background: "color-mix(in srgb, var(--color-text) 4%, transparent)",
            border: "1px solid color-mix(in srgb, var(--color-text) 6%, transparent)",
            color: "var(--color-text-muted)",
          }}
          animate={{ rotate: expanded ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </motion.span>
      </button>

      {/* Expandable body */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.32, ease: EASE_OUT }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="px-4 pb-4 pl-[44px] sm:pl-[80px] pt-1 flex flex-col gap-3"
              style={{ borderTop: "1px solid color-mix(in srgb, var(--color-text) 4%, transparent)", marginTop: 4 }}
            >
              {conv.summary ? (
                <p
                  className="text-sm leading-relaxed m-0"
                  style={{ color: "var(--color-text-silver)" }}
                >
                  {conv.summary}
                </p>
              ) : (
                <p
                  className="text-xs italic m-0"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  No summary yet.
                </p>
              )}
              <Link
                href={`/summary/${conv.id}`}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold no-underline self-start px-3 py-1.5 rounded-full"
                style={{
                  background: "color-mix(in srgb, var(--color-text) 6%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--color-text) 10%, transparent)",
                  color: "var(--color-text)",
                  transition: "all 0.2s ease",
                }}
              >
                Open full session
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
      // Plan retention is applied server-side.
      try {
        const { conversations: data } = await listConversations<Conversation>();
        setConversations(data);
      } catch (err) {
        console.error("History fetch failed:", err);
      } finally {
        setLoadingData(false);
      }
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
      <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", paddingBottom: 80 }}>
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
            background: "radial-gradient(circle, color-mix(in srgb, var(--color-text) 5%, transparent), transparent 65%)",
            filter: "blur(70px)",
            pointerEvents: "none",
            zIndex: 0,
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
                    backgroundColor: "color-mix(in srgb, var(--color-text) 85%, transparent)",
                    opacity: 0.5,
                    animation: "pulseRing 2.4s ease-in-out infinite",
                  }}
                />
                <span className="relative w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "color-mix(in srgb, var(--color-text) 90%, transparent)" }} />
              </span>
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: "var(--color-text-muted)" }}
              >
                Your archive · <CountUp value={filtered.length} duration={0.9} />{" "}
                {t("history.sessionCount", { count: filtered.length }).replace(/^\d+\s*/, "")}
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
                  "linear-gradient(115deg, var(--color-text) 0%, var(--color-text) 30%, var(--color-text-silver) 50%, var(--color-text) 70%, var(--color-text) 100%)",
                backgroundSize: "240% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t("history.title")}
            </motion.h1>
            <p className="text-sm mt-2 m-0" style={{ color: "var(--color-text-muted)", maxWidth: 480 }}>
              Toutes tes sessions, classées par jour. Clique pour déplier le résumé.
            </p>
          </motion.div>

          {/* ========== SEARCH ========== */}
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.1 }}
            className="relative mb-4"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--color-text-muted)", opacity: 0.7 }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("history.searchPlaceholder")}
              aria-label="Search history"
              className="w-full text-sm rounded-full"
              style={{
                paddingLeft: 40,
                paddingRight: search ? 40 : 16,
                height: 44,
                background: "color-mix(in srgb, var(--color-text) 2.5%, transparent)",
                border: "1px solid color-mix(in srgb, var(--color-text) 6%, transparent)",
                color: "var(--color-text)",
                outline: "none",
                transition: "border-color 0.2s ease, background 0.2s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "color-mix(in srgb, var(--color-text) 18%, transparent)";
                e.currentTarget.style.background = "color-mix(in srgb, var(--color-text) 4%, transparent)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "color-mix(in srgb, var(--color-text) 6%, transparent)";
                e.currentTarget.style.background = "color-mix(in srgb, var(--color-text) 2.5%, transparent)";
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-6 h-6 rounded-full cursor-pointer"
                style={{
                  background: "color-mix(in srgb, var(--color-text) 6%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--color-text) 8%, transparent)",
                  color: "var(--color-text-muted)",
                }}
                aria-label="Clear search"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </motion.div>

          {/* ========== FILTERS ========== */}
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.15 }}
            className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8"
          >
            {/* Period segmented */}
            <div
              className="relative inline-flex items-center p-1 rounded-full overflow-x-auto"
              style={{
                background: "color-mix(in srgb, var(--color-text) 2.5%, transparent)",
                border: "1px solid color-mix(in srgb, var(--color-text) 6%, transparent)",
                scrollbarWidth: "none",
              }}
            >
              <span
                className="text-[9px] uppercase tracking-[0.22em] font-semibold pl-3 pr-2 hidden sm:inline"
                style={{ color: "var(--color-text-muted)" }}
              >
                Période
              </span>
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

            {/* Tone segmented */}
            <div
              className="relative inline-flex items-center p-1 rounded-full overflow-x-auto"
              style={{
                background: "color-mix(in srgb, var(--color-text) 2.5%, transparent)",
                border: "1px solid color-mix(in srgb, var(--color-text) 6%, transparent)",
                scrollbarWidth: "none",
              }}
            >
              <span
                className="text-[9px] uppercase tracking-[0.22em] font-semibold pl-3 pr-2 hidden sm:inline"
                style={{ color: "var(--color-text-muted)" }}
              >
                Ton
              </span>
              {([
                { key: "all", label: t("common.all"), count: conversations.length, color: null },
                { key: "positive", label: t("common.positive"), count: toneCounts.positive, color: "var(--color-positive)" },
                { key: "neutral", label: t("common.neutral"), count: toneCounts.neutral, color: "var(--color-neutral)" },
                { key: "negative", label: t("common.negative"), count: toneCounts.negative, color: "var(--color-negative)" },
              ] as { key: ToneFilter; label: string; count: number; color: string | null }[]).map((chip) => (
                <FilterChip
                  key={chip.key}
                  active={tone === chip.key}
                  onClick={() => setTone(chip.key)}
                  layoutId="history-tone-pill"
                  reduce={!!reduce}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {chip.color && (
                      <span
                        className="w-1 h-1 rounded-full"
                        style={{ backgroundColor: chip.color }}
                      />
                    )}
                    {chip.label}
                    <span style={{ opacity: 0.45, fontWeight: 500 }}>{chip.count}</span>
                  </span>
                </FilterChip>
              ))}
            </div>
          </motion.div>

          {/* ========== TIMELINE ========== */}
          <AnimatePresence mode="wait" initial={false}>
            {loadingData ? (
              <motion.div
                key="loading"
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-16 rounded-2xl shimmer"
                    style={{ backgroundColor: "color-mix(in srgb, var(--color-text) 2%, transparent)" }}
                  />
                ))}
              </motion.div>
            ) : filtered.length === 0 ? (
              <motion.div
                key={`empty-${tone}-${range}-${search}`}
                className="relative overflow-hidden rounded-2xl py-12 px-8 text-center"
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
                style={{
                  background: "linear-gradient(135deg, color-mix(in srgb, var(--color-text) 3%, transparent) 0%, color-mix(in srgb, var(--color-text) 1%, transparent) 100%)",
                  border: "1px solid color-mix(in srgb, var(--color-text) 5%, transparent)",
                }}
              >
                <span
                  aria-hidden
                  className="absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none"
                  style={{
                    background: "radial-gradient(circle, color-mix(in srgb, var(--color-text) 10%, transparent), transparent 70%)",
                    filter: "blur(28px)",
                    opacity: 0.4,
                  }}
                />
                <div className="relative">
                  <div
                    className="inline-flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-2xl"
                    style={{
                      background: "color-mix(in srgb, var(--color-text) 4%, transparent)",
                      border: "1px solid color-mix(in srgb, var(--color-text) 6%, transparent)",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--color-text-muted)" }}>
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
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`timeline-${tone}-${range}`}
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: {
                    transition: reduce ? {} : { staggerChildren: 0.04, delayChildren: 0.05 },
                  },
                }}
                className="flex flex-col gap-8"
              >
                {groupedDays.map((group) => (
                  <motion.section
                    key={group.dayKey}
                    variants={{
                      hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 8 },
                      show: reduce
                        ? { opacity: 1 }
                        : { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
                    }}
                  >
                    {/* Day header */}
                    <div className="flex items-baseline gap-3 mb-3">
                      <h2
                        className="m-0 capitalize"
                        style={{
                          fontSize: "clamp(20px, 2.4vw, 28px)",
                          fontWeight: 200,
                          letterSpacing: "-0.02em",
                          lineHeight: 1,
                          color: "var(--color-text)",
                        }}
                      >
                        {dayLabel(group.date, today, t)}
                      </h2>
                      <span
                        className="text-[10px] tabular-nums font-semibold uppercase tracking-[0.18em] px-2 py-0.5 rounded-full"
                        style={{
                          color: "var(--color-text-muted)",
                          background: "color-mix(in srgb, var(--color-text) 4%, transparent)",
                          border: "1px solid color-mix(in srgb, var(--color-text) 6%, transparent)",
                        }}
                      >
                        {group.items.length}
                      </span>
                      <span
                        aria-hidden
                        className="flex-1 h-px"
                        style={{
                          background: "linear-gradient(90deg, color-mix(in srgb, var(--color-text) 8%, transparent), transparent 80%)",
                        }}
                      />
                    </div>

                    {/* Events */}
                    <motion.div
                      className="flex flex-col gap-2"
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
      </div>
    </AppShell>
  );
}

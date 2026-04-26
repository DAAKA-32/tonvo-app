"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import AnimatedTitle from "@/components/AnimatedTitle";
import CountUp from "@/components/motion/CountUp";
import SpotlightCard from "@/components/motion/SpotlightCard";
import {
  easeOutExpo,
  VIEWPORT,
} from "@/components/motion/transitions";

interface ResultCard {
  metric: {
    value: number;
    prefix?: string;
    suffix: string;
    decimals?: number;
    label: string;
  };
  beforeAfter?: { before: string; after: string };
  outcome: string;
  name: string;
  role: string;
  company?: string;
  avatar: string;
  accent: "green" | "violet" | "silver" | "amber";
  featured?: boolean;
}

const ACCENT_MAP = {
  green: { color: "#34d399", spot: "rgba(52, 211, 153, 0.10)", border: "rgba(52, 211, 153, 0.28)" },
  violet: { color: "#818cf8", spot: "rgba(129, 140, 248, 0.10)", border: "rgba(129, 140, 248, 0.28)" },
  silver: { color: "#c8c8d8", spot: "rgba(200, 200, 216, 0.10)", border: "rgba(200, 200, 216, 0.30)" },
  amber: { color: "#fbbf24", spot: "rgba(251, 191, 36, 0.10)", border: "rgba(251, 191, 36, 0.26)" },
} as const;

const RESULTS: ResultCard[] = [
  {
    metric: { value: 27, prefix: "+", suffix: "%", label: "close rate lift" },
    beforeAfter: { before: "24%", after: "31%" },
    outcome: "I actually listen instead of scrambling to take notes.",
    name: "Sarah Mitchell",
    role: "Account Executive",
    company: "Salesforce",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    accent: "green",
    featured: true,
  },
  {
    metric: { value: 3, suffix: "h", label: "saved per week" },
    outcome: "I'm more present during calls. The team noticed.",
    name: "David Chen",
    role: "Engineering Manager",
    company: "Datadog",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    accent: "silver",
  },
  {
    metric: { value: 40, prefix: "−", suffix: "%", label: "onboarding ramp" },
    beforeAfter: { before: "8 weeks", after: "5 weeks" },
    outcome: "New SDRs review real call summaries — not shadow for weeks.",
    name: "Priya Sharma",
    role: "Head of Sales",
    company: "Notion",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
    accent: "violet",
  },
  {
    metric: { value: 20, suffix: "min", label: "saved per call" },
    outcome: "Notes just get written. I show up, they're done.",
    name: "Jessica Adams",
    role: "Customer Success Lead",
    company: "HubSpot",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    accent: "silver",
  },
  {
    metric: { value: 5, suffix: "×", label: "more follow-ups" },
    outcome: "I prep less, listen more. Clients can tell.",
    name: "Marcus Johnson",
    role: "Freelance Consultant",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    accent: "amber",
  },
  {
    metric: { value: 6, suffix: "+", label: "interviews / week" },
    outcome: "Every insight captured. Coaching tips are spot-on.",
    name: "Elena Rossi",
    role: "Product Manager",
    company: "Figma",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face",
    accent: "green",
  },
];

interface ScoreboardKPI {
  prefix?: string;
  value: number;
  suffix: string;
  decimals?: number;
  label: string;
  beforeAfter?: { before: string; after: string };
  accent: keyof typeof ACCENT_MAP;
}

const SCOREBOARD: ScoreboardKPI[] = [
  {
    value: 31,
    suffix: "%",
    label: "Average close rate, month one",
    beforeAfter: { before: "24%", after: "31%" },
    accent: "green",
  },
  {
    prefix: "+",
    value: 29,
    suffix: "%",
    label: "Average revenue lift per closer",
    accent: "violet",
  },
  {
    value: 14,
    suffix: " days",
    label: "Time to measurable lift",
    accent: "silver",
  },
];

export default function TestimonialsSection() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();

  return (
    <section className="relative px-4 sm:px-6 py-16 sm:py-24 md:py-32 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            className="section-label inline-block"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
            whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.55, ease: easeOutExpo }}
          >
            {t("landing.testimonials.label")}
          </motion.span>
          <AnimatedTitle variant="right" className="section-heading">
            {t("landing.testimonials.heading")}
          </AnimatedTitle>
          <motion.p
            className="body-muted max-w-lg mx-auto mt-4"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
            whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, delay: 0.1, ease: easeOutExpo }}
          >
            {t("landing.testimonials.desc")}
          </motion.p>
        </div>

        {/* Scoreboard — 3 aggregate KPIs */}
        <Scoreboard reduce={!!reduce} />

        {/* Result cards grid */}
        <div className="testimonials-grid mt-14">
          {RESULTS.map((r, i) => (
            <ResultCardView key={r.name} card={r} index={i} hideOnMobile={i >= 3} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- */
/*  Scoreboard — aggregate KPIs at the top of the section            */
/* ----------------------------------------------------------------- */
function Scoreboard({ reduce }: { reduce: boolean }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto">
      {SCOREBOARD.map((kpi, i) => {
        const a = ACCENT_MAP[kpi.accent];
        return (
          <SpotlightCard
            key={kpi.label}
            index={i}
            delay={0.15}
            spotlightColor={a.spot}
            borderGlow={a.border}
            className="p-5 sm:p-6 text-center"
          >
            <div
              className="text-3xl sm:text-4xl font-bold tabular-nums tracking-tight"
              style={{ color: a.color }}
            >
              <CountUp
                value={kpi.value}
                prefix={kpi.prefix}
                suffix={kpi.suffix}
                decimals={kpi.decimals ?? 0}
                duration={1.7}
              />
            </div>
            {kpi.beforeAfter && !reduce && (
              <BeforeAfter
                before={kpi.beforeAfter.before}
                after={kpi.beforeAfter.after}
                accent={a.color}
                delay={0.6}
              />
            )}
            <p
              className="text-xs uppercase tracking-wider mt-3 m-0"
              style={{ color: "var(--color-text-muted)", letterSpacing: "0.1em" }}
            >
              {kpi.label}
            </p>
          </SpotlightCard>
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------------- */
/*  ResultCardView — one outcome card                                */
/* ----------------------------------------------------------------- */
function ResultCardView({
  card,
  index,
  hideOnMobile,
}: {
  card: ResultCard;
  index: number;
  hideOnMobile?: boolean;
}) {
  const a = ACCENT_MAP[card.accent];
  return (
    <SpotlightCard
      index={index}
      delay={0.2}
      spotlightColor={a.spot}
      borderGlow={a.border}
      className={`p-6 flex flex-col${hideOnMobile ? " testimonial-desktop-only" : ""}${card.featured ? " testimonial-featured" : ""}`}
    >
      {/* Metric badge */}
      <div className="flex items-baseline gap-2">
        <div
          className="text-2xl sm:text-3xl font-bold tabular-nums"
          style={{ color: a.color }}
        >
          <CountUp
            value={card.metric.value}
            prefix={card.metric.prefix}
            suffix={card.metric.suffix}
            decimals={card.metric.decimals ?? 0}
            duration={1.4}
          />
        </div>
        <span
          className="text-[11px] uppercase font-semibold"
          style={{
            color: "var(--color-text-muted)",
            letterSpacing: "0.08em",
          }}
        >
          {card.metric.label}
        </span>
      </div>

      {/* Before / After */}
      {card.beforeAfter && (
        <BeforeAfter
          before={card.beforeAfter.before}
          after={card.beforeAfter.after}
          accent={a.color}
          delay={0.5}
        />
      )}

      {/* Verified outcome pill */}
      <div className="flex items-center gap-1.5 mt-4">
        <span
          className="w-1.5 h-1.5 rounded-full pulse-positive"
          style={{ backgroundColor: a.color }}
        />
        <span
          className="text-[10px] font-semibold uppercase"
          style={{ color: a.color, letterSpacing: "0.14em" }}
        >
          verified outcome
        </span>
      </div>

      {/* Outcome quote */}
      <p
        className="text-[15px] leading-relaxed mt-3 mb-0"
        style={{ color: "var(--color-text)" }}
      >
        &ldquo;{card.outcome}&rdquo;
      </p>

      {/* Attribution */}
      <div
        className="flex items-center gap-3 mt-auto pt-4"
        style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)", marginTop: 16 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.avatar}
          alt={card.name}
          className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-white/5"
        />
        <div className="min-w-0">
          <div className="text-sm font-semibold leading-tight">{card.name}</div>
          <div
            className="text-xs leading-tight mt-0.5"
            style={{ color: "var(--color-text-muted)" }}
          >
            {card.role}
            {card.company ? ` · ${card.company}` : ""}
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}

/* ----------------------------------------------------------------- */
/*  BeforeAfter — small badge "before → after" with arrow reveal     */
/* ----------------------------------------------------------------- */
function BeforeAfter({
  before,
  after,
  accent,
  delay = 0,
}: {
  before: string;
  after: string;
  accent: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <div
      ref={ref}
      className="inline-flex items-center gap-2 mt-3 px-2.5 py-1 rounded-md"
      style={{
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      <motion.span
        className="text-[11px] tabular-nums font-medium"
        style={{ color: "var(--color-text-muted)" }}
        initial={reduce ? { opacity: 0 } : { opacity: 0, x: -6 }}
        animate={inView ? { opacity: 1, x: 0 } : undefined}
        transition={{ duration: 0.45, delay, ease: easeOutExpo }}
      >
        {before}
      </motion.span>
      <motion.svg
        width="12"
        height="10"
        viewBox="0 0 14 10"
        fill="none"
        aria-hidden
        initial={reduce ? { opacity: 0 } : { opacity: 0, scaleX: 0 }}
        animate={inView ? { opacity: 1, scaleX: 1 } : undefined}
        transition={{ duration: 0.55, delay: delay + 0.1, ease: easeOutExpo }}
        style={{ transformOrigin: "left" }}
      >
        <path
          d="M1 5h11m0 0L8.5 1.5M12 5L8.5 8.5"
          stroke={accent}
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
      <motion.span
        className="text-[11px] tabular-nums font-bold"
        style={{ color: accent }}
        initial={reduce ? { opacity: 0 } : { opacity: 0, x: 6 }}
        animate={inView ? { opacity: 1, x: 0 } : undefined}
        transition={{ duration: 0.45, delay: delay + 0.2, ease: easeOutExpo }}
      >
        {after}
      </motion.span>
    </div>
  );
}

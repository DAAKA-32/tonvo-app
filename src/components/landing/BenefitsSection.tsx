"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import AnimatedTitle from "@/components/AnimatedTitle";
import CountUp from "@/components/motion/CountUp";
import SpotlightCard from "@/components/motion/SpotlightCard";
import { easeOutExpo, VIEWPORT } from "@/components/motion/transitions";

interface Metric {
  raw: string;
  label: string;
  value?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  spotlight: string;
  border: string;
  accent: string;
}

export default function BenefitsSection() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();

  // Numbers parsed from i18n strings so count-up can drive the digits
  // while preserving original symbols (+, %, x, sec) and i18n control.
  const metrics: Metric[] = [
    {
      raw: t("landing.benefits.realtime"),
      label: t("landing.benefits.realtimeDesc"),
      value: 27,
      prefix: "+",
      suffix: "%",
      spotlight: "rgba(52, 211, 153, 0.10)",
      border: "rgba(52, 211, 153, 0.28)",
      accent: "#34d399",
    },
    {
      raw: t("landing.benefits.threeClicks"),
      label: t("landing.benefits.threeClicksDesc"),
      value: 0,
      suffix: " sec",
      spotlight: "rgba(200, 200, 216, 0.10)",
      border: "rgba(200, 200, 216, 0.30)",
      accent: "#c8c8d8",
    },
    {
      raw: t("landing.benefits.actionable"),
      label: t("landing.benefits.actionableDesc"),
      value: 3.4,
      decimals: 1,
      suffix: "x",
      spotlight: "rgba(129, 140, 248, 0.12)",
      border: "rgba(129, 140, 248, 0.30)",
      accent: "#818cf8",
    },
    {
      raw: t("landing.benefits.private"),
      label: t("landing.benefits.privateDesc"),
      // No numeric value — uses raw string with shimmer reveal
      spotlight: "rgba(200, 200, 216, 0.08)",
      border: "rgba(200, 200, 216, 0.22)",
      accent: "#c8c8d8",
    },
  ];

  return (
    <section
      className="relative px-4 sm:px-6 py-16 sm:py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      {/* Ambient drifting backdrop — sits behind content, extremely subtle */}
      <div className="section-ambient" aria-hidden />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <motion.span
            className="section-label inline-block"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
            whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.55, ease: easeOutExpo }}
          >
            {t("landing.benefits.label")}
          </motion.span>

          {/* Drawing rule above the title — silver line tracing in */}
          <motion.div
            aria-hidden
            className="mx-auto mt-6 mb-2"
            style={{
              width: 80,
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(200,200,216,0.5), transparent)",
              transformOrigin: "center",
            }}
            initial={reduce ? { opacity: 0 } : { scaleX: 0, opacity: 0 }}
            whileInView={reduce ? { opacity: 1 } : { scaleX: 1, opacity: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.85, ease: easeOutExpo, delay: 0.15 }}
          />

          <AnimatedTitle variant="soft" className="section-heading">
            {t("landing.benefits.heading")}
          </AnimatedTitle>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {metrics.map((m, i) => (
            <SpotlightCard
              key={m.label}
              index={i}
              delay={0.25}
              spotlightColor={m.spotlight}
              borderGlow={m.border}
              className="benefit-card p-4 sm:p-6 text-center"
            >
              <div
                className="text-xl sm:text-2xl md:text-3xl mb-2 metric-text tabular-nums"
                style={{ color: m.accent }}
              >
                {typeof m.value === "number" ? (
                  <CountUp
                    value={m.value}
                    decimals={m.decimals ?? 0}
                    prefix={m.prefix}
                    suffix={m.suffix}
                    duration={1.6}
                  />
                ) : (
                  <ShimmerText>{m.raw}</ShimmerText>
                )}
              </div>
              <p
                className="text-sm m-0"
                style={{ color: "var(--color-text-muted)" }}
              >
                {m.label}
              </p>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Per-letter reveal for non-numeric metrics ("Silent" / "Silencieux").
 * Replaces a count-up where it doesn't make semantic sense.
 */
function ShimmerText({ children }: { children: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <span>{children}</span>;

  const letters = Array.from(children);
  return (
    <span aria-label={children} className="inline-flex">
      {letters.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          aria-hidden
          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={VIEWPORT}
          transition={{
            duration: 0.45,
            delay: 0.6 + i * 0.04,
            ease: easeOutExpo,
          }}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

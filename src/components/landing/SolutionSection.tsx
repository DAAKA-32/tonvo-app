"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useTranslation } from "react-i18next";
import AnimatedTitle from "@/components/AnimatedTitle";
import { FadeIn } from "@/components/motion";
import { easeOutExpo, VIEWPORT } from "@/components/motion/transitions";

interface Step {
  num: string;
  title: string;
  desc: string;
  color: string;
}

export default function SolutionSection() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-driven energy line: starts drawing as section enters viewport,
  // completes when the step row is centered. Feels like the engine spinning up.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 75%", "end 60%"],
  });
  const lineScale = useTransform(scrollYProgress, [0.2, 0.85], [0, 1]);
  const pulsePos = useTransform(scrollYProgress, [0.2, 0.85], ["0%", "100%"]);

  const steps: Step[] = [
    {
      num: "01",
      title: t("landing.solution.step1Title"),
      desc: t("landing.solution.step1Desc"),
      color: "#818cf8",
    },
    {
      num: "02",
      title: t("landing.solution.step2Title"),
      desc: t("landing.solution.step2Desc"),
      color: "#c8c8d8",
    },
    {
      num: "03",
      title: t("landing.solution.step3Title"),
      desc: t("landing.solution.step3Desc"),
      color: "#34d399",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="solution"
      className="relative px-4 sm:px-6 py-16 sm:py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      {/* Ambient drifting backdrop */}
      <div className="section-ambient" aria-hidden />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.span
          className="section-label inline-block"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.55, ease: easeOutExpo }}
        >
          {t("landing.solution.label")}
        </motion.span>

        <AnimatedTitle variant="left" className="section-heading text-glow mb-6">
          {t("landing.solution.heading1")}
          <br />
          <span className="text-silver-gradient">{t("landing.solution.heading2")}</span>
        </AnimatedTitle>

        <FadeIn as="p" className="body-muted max-w-2xl mx-auto" delay={0.15}>
          {t("landing.solution.desc")}
        </FadeIn>

        {/* The engine — 3 stages connected by an energy line */}
        <div className="relative mt-16">
          {/* Horizontal connector — desktop (lg+) only, sits behind the badges.
             With text-center cards, each badge sits at its column center.
             For grid-cols-3 + gap-6 (24px): col 1 center = col 3 center mirror,
             both at calc((100% - 48px) / 6) = calc(16.667% - 8px) from the edge. */}
          {!reduce && (
            <div
              className="hidden lg:block absolute pointer-events-none"
              aria-hidden
              style={{
                left: "calc(16.667% - 8px)",
                right: "calc(16.667% - 8px)",
                top: 27,
                height: 2,
              }}
            >
              {/* Inert track */}
              <div
                className="absolute inset-0"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: 2,
                }}
              />
              {/* Active filled gradient — scaleX driven by scroll progress */}
              <motion.div
                className="absolute inset-0 origin-left"
                style={{
                  scaleX: lineScale,
                  background:
                    "linear-gradient(90deg, #818cf8 0%, #c8c8d8 50%, #34d399 100%)",
                  borderRadius: 2,
                  boxShadow: "0 0 14px rgba(200, 200, 216, 0.35)",
                }}
              />
              {/* Energy particle traveling along the line */}
              <motion.div
                className="absolute"
                style={{
                  left: pulsePos,
                  top: -3,
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background:
                    "radial-gradient(circle, #fff, rgba(200,200,216,0.6) 60%, transparent 80%)",
                  boxShadow:
                    "0 0 12px rgba(200, 200, 216, 0.7), 0 0 24px rgba(129, 140, 248, 0.4)",
                  marginLeft: -4,
                }}
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            {steps.map((step, i) => (
              <StepCard key={step.num} step={step} index={i} reduce={!!reduce} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface StepCardProps {
  step: Step;
  index: number;
  reduce: boolean;
}

function StepCard({ step, index, reduce }: StepCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const delay = index * 0.18;

  return (
    <motion.div
      ref={ref}
      className="relative text-center flex flex-col items-center"
      initial={
        reduce
          ? { opacity: 0 }
          : { opacity: 0, y: 32, filter: "blur(6px)" }
      }
      animate={
        inView
          ? reduce
            ? { opacity: 1 }
            : { opacity: 1, y: 0, filter: "blur(0px)" }
          : undefined
      }
      transition={{ duration: 0.7, delay, ease: easeOutExpo }}
    >
      <StepBadge step={step} active={inView} delay={delay} reduce={reduce} />

      <motion.h3
        className="card-title text-lg mb-2 mt-5"
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.55, delay: delay + 0.25, ease: easeOutExpo }}
      >
        {step.title}
      </motion.h3>

      <motion.p
        className="text-sm leading-relaxed m-0"
        style={{ color: "var(--color-text-muted)" }}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.55, delay: delay + 0.32, ease: easeOutExpo }}
      >
        {step.desc}
      </motion.p>
    </motion.div>
  );
}

interface StepBadgeProps {
  step: Step;
  active: boolean;
  delay: number;
  reduce: boolean;
}

function StepBadge({ step, active, delay, reduce }: StepBadgeProps) {
  const size = 56;
  const r = 26;
  const circumference = 2 * Math.PI * r;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Soft radial glow behind the badge */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${step.color}26, transparent 65%)`,
          filter: "blur(10px)",
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={active ? { opacity: 1, scale: 1.2 } : undefined}
        transition={{ duration: 0.9, delay, ease: easeOutExpo }}
      />

      {/* Inner disc */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "linear-gradient(160deg, rgba(28,28,36,0.95), rgba(18,18,24,1))",
          border: `1px solid ${step.color}33`,
        }}
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.65 }}
        animate={active ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 0.6, delay, ease: easeOutExpo }}
      />

      {/* Tracing arc — draws around the badge as the step enters */}
      {!reduce && (
        <svg
          className="absolute inset-0"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: "rotate(-90deg)" }}
          aria-hidden
        >
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={step.color}
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference, opacity: 0 }}
            animate={
              active
                ? { strokeDashoffset: 0, opacity: 0.85 }
                : undefined
            }
            transition={{
              duration: 1.4,
              delay: delay + 0.15,
              ease: easeOutExpo,
            }}
            style={{ filter: `drop-shadow(0 0 6px ${step.color}88)` }}
          />
        </svg>
      )}

      {/* Step number */}
      <motion.span
        className="text-xs font-bold tabular-nums relative z-10"
        style={{ color: step.color, letterSpacing: "0.04em" }}
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
        animate={active ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 0.5, delay: delay + 0.4, ease: easeOutExpo }}
      >
        {step.num}
      </motion.span>

      {/* Live indicator dot — pulses while step is in view */}
      {!reduce && active && (
        <motion.div
          className="absolute"
          style={{
            top: 4,
            right: 4,
            width: 6,
            height: 6,
            borderRadius: 999,
            background: step.color,
            boxShadow: `0 0 6px ${step.color}, 0 0 12px ${step.color}66`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0.55, 1, 0.55],
            scale: [0, 1.2, 1, 1.2, 1],
          }}
          transition={{
            opacity: { duration: 2.4, delay: delay + 0.6, repeat: Infinity, repeatType: "loop", ease: "easeInOut" },
            scale: { duration: 2.4, delay: delay + 0.6, repeat: Infinity, repeatType: "loop", ease: "easeInOut" },
          }}
        />
      )}
    </div>
  );
}

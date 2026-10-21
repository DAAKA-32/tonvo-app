"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import AnimatedTitle from "@/components/AnimatedTitle";
import SpotlightCard from "@/components/motion/SpotlightCard";
import { easeOutExpo, easeOutSoft, VIEWPORT } from "@/components/motion/transitions";

function IconUsers({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconMessageCircle({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}

function IconShield({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconGlobe({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

interface UseCase {
  icon: ReactNode;
  title: string;
  desc: string;
  spotlight: string;
  border: string;
  accent: string;
}

export default function UseCasesSection() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();

  const useCases: UseCase[] = [
    {
      icon: <IconUsers className="w-6 h-6" />,
      title: t("landing.useCases.salesTitle"),
      desc: t("landing.useCases.salesDesc"),
      spotlight: "rgba(129, 140, 248, 0.10)",
      border: "rgba(129, 140, 248, 0.28)",
      accent: "#818cf8",
    },
    {
      icon: <IconShield className="w-6 h-6" />,
      title: t("landing.useCases.supportTitle"),
      desc: t("landing.useCases.supportDesc"),
      spotlight: "rgba(52, 211, 153, 0.10)",
      border: "rgba(52, 211, 153, 0.26)",
      accent: "#34d399",
    },
    {
      icon: <IconGlobe className="w-6 h-6" />,
      title: t("landing.useCases.interviewsTitle"),
      desc: t("landing.useCases.interviewsDesc"),
      spotlight: "rgba(200, 200, 216, 0.10)",
      border: "rgba(200, 200, 216, 0.30)",
      accent: "#c8c8d8",
    },
    {
      icon: <IconMessageCircle className="w-6 h-6" />,
      title: t("landing.useCases.meetingsTitle"),
      desc: t("landing.useCases.meetingsDesc"),
      spotlight: "rgba(251, 191, 36, 0.10)",
      border: "rgba(251, 191, 36, 0.26)",
      accent: "#fbbf24",
    },
  ];

  // Diagonal stagger: row 0 leads, row 1 follows; small horizontal offset within each row
  const diagonalDelay = (i: number) => (i % 2) * 0.06 + Math.floor(i / 2) * 0.14;

  return (
    <section id="use-cases" className="relative px-4 sm:px-6 py-16 sm:py-24 md:py-32 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <motion.span
            className="section-label inline-block"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
            whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.55, ease: easeOutExpo }}
          >
            {t("landing.useCases.label")}
          </motion.span>
          <AnimatedTitle variant="left" className="section-heading">
            {t("landing.useCases.heading")}
          </AnimatedTitle>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {useCases.map((uc, i) => (
            <SpotlightCard
              key={uc.title}
              index={0}
              delay={diagonalDelay(i)}
              spotlightColor={uc.spotlight}
              borderGlow={uc.border}
              className="usecase-card group p-6"
            >
              {/* Icon container with rotating gradient field — pulses on hover */}
              <motion.div
                className="icon-field w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{
                  backgroundColor: "var(--color-surface-2)",
                  color: uc.accent,
                  border: `1px solid ${uc.border}`,
                }}
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, rotate: -8 }}
                whileInView={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, rotate: 0 }}
                viewport={VIEWPORT}
                transition={{
                  duration: 0.6,
                  delay: 0.35 + diagonalDelay(i),
                  ease: easeOutExpo,
                }}
                whileHover={reduce ? undefined : { scale: 1.08, rotate: 3 }}
              >
                <motion.div
                  whileHover={
                    reduce
                      ? undefined
                      : { scale: [1, 1.1, 1], transition: { duration: 0.4 } }
                  }
                  style={{ display: "flex" }}
                >
                  {uc.icon}
                </motion.div>
              </motion.div>

              {/* Title with hover underline reveal — driven by parent .group hover via CSS */}
              <h3 className="card-title mb-2 flex flex-col items-start">
                <span>{uc.title}</span>
                <span
                  aria-hidden
                  className="usecase-underline"
                  style={{
                    background: `linear-gradient(90deg, ${uc.accent}, transparent)`,
                  }}
                />
              </h3>

              <motion.p
                className="text-sm leading-relaxed m-0"
                style={{ color: "var(--color-text-muted)" }}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{
                  duration: 0.55,
                  delay: 0.45 + diagonalDelay(i),
                  ease: easeOutSoft,
                }}
              >
                {uc.desc}
              </motion.p>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}

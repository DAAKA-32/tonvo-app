"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  easeOutExpo,
  easeOutSoft,
  VIEWPORT,
} from "@/components/motion/transitions";
import WordsReveal from "@/components/motion/WordsReveal";

export default function ProblemSection() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();

  return (
    <section
      className="relative px-4 sm:px-6 py-16 sm:py-24 md:py-32 overflow-hidden"
    >
      <ProblemAmbient />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.span
          className="section-label inline-block"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.55, ease: easeOutExpo }}
        >
          {t("landing.problem.label")}
        </motion.span>

        <h2 className="section-heading text-glow mb-6">
          <WordsReveal text={t("landing.problem.heading1")} />
          <br />
          <WordsReveal
            text={t("landing.problem.heading2")}
            baseDelay={0.22}
            accentLastWord
            wordClassName="text-silver-gradient"
          />
        </h2>

        <ParagraphReveal text={t("landing.problem.p1")} delay={0.45} />
      </div>
    </section>
  );
}

function ProblemAmbient() {
  return (
    <div
      className="absolute pointer-events-none"
      aria-hidden
      style={{
        inset: "-10%",
        background: `
          radial-gradient(55% 45% at 28% 32%, rgba(248, 113, 113, 0.055), transparent 65%),
          radial-gradient(45% 35% at 72% 60%, rgba(251, 191, 36, 0.04), transparent 65%),
          radial-gradient(40% 30% at 50% 50%, rgba(200, 200, 216, 0.03), transparent 60%)
        `,
        animation: "sectionDrift 42s ease-in-out infinite",
        filter: "blur(70px)",
        opacity: 0.9,
        zIndex: 0,
      }}
    />
  );
}

interface ParagraphRevealProps {
  text: string;
  delay?: number;
  className?: string;
}

function ParagraphReveal({
  text,
  delay = 0,
  className = "",
}: ParagraphRevealProps) {
  const reduce = useReducedMotion();
  const sentences = splitSentences(text);

  if (reduce) {
    return (
      <p className={`body-muted max-w-2xl mx-auto ${className}`}>{text}</p>
    );
  }

  return (
    <p className={`body-muted max-w-2xl mx-auto ${className}`}>
      {sentences.map((sentence, i) => (
        <Fragment key={i}>
          <motion.span
            className="inline"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{
              duration: 0.55,
              delay: delay + i * 0.13,
              ease: easeOutSoft,
            }}
            style={{ display: "inline-block", whiteSpace: "normal" }}
          >
            {sentence}
          </motion.span>
          {/* The space sits outside the inline-block: inside it, it collapses and sentences touch. */}
          {i < sentences.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </p>
  );
}

function splitSentences(text: string): string[] {
  const matches = text.match(/[^.!?…]+[.!?…]+["')\]]?\s*|\S+\s*$/g);
  if (!matches || matches.length === 0) return [text];
  return matches.map((s) => s.trim()).filter(Boolean);
}

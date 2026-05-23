"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import AnimatedTitle from "@/components/AnimatedTitle";
import { easeOutExpo, easeOutSoft, VIEWPORT } from "@/components/motion/transitions";

interface Story {
  quoteKey: string;
  nameKey: string;
  roleKey: string;
  avatar: string;
}

const STORIES: Story[] = [
  {
    quoteKey: "landing.testimonials.q1",
    nameKey: "landing.testimonials.n1",
    roleKey: "landing.testimonials.r1",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
  },
  {
    quoteKey: "landing.testimonials.q2",
    nameKey: "landing.testimonials.n2",
    roleKey: "landing.testimonials.r2",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
  },
  {
    quoteKey: "landing.testimonials.q3",
    nameKey: "landing.testimonials.n3",
    roleKey: "landing.testimonials.r3",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=face",
  },
];

export default function TestimonialsSection() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();

  return (
    <section className="relative px-4 sm:px-6 py-20 sm:py-28 md:py-32 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="text-center mb-14 sm:mb-20">
          {/* 5-star pill */}
          <motion.div
            className="inline-flex items-center gap-2.5"
            style={{
              padding: "7px 14px",
              borderRadius: 999,
              background: "rgba(251, 191, 36, 0.05)",
              border: "1px solid rgba(251, 191, 36, 0.18)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: easeOutExpo }}
            aria-label="Rated 5 out of 5 stars"
          >
            <span className="inline-flex items-center" style={{ gap: 3 }} aria-hidden>
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.svg
                  key={i}
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="#fbbf24"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.4 }}
                  whileInView={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.5, delay: 0.12 + i * 0.07, ease: easeOutExpo }}
                  style={{ filter: "drop-shadow(0 0 5px rgba(251, 191, 36, 0.45))" }}
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </motion.svg>
              ))}
            </span>
            <motion.span
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(251, 191, 36, 0.92)",
              }}
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: -6 }}
              whileInView={reduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.5, delay: 0.5, ease: easeOutExpo }}
            >
              {t("landing.testimonials.starsLine")}
            </motion.span>
          </motion.div>

          <motion.span
            className="section-label inline-block mt-6"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
            whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.55, ease: easeOutExpo }}
          >
            {t("landing.testimonials.label")}
          </motion.span>
          <AnimatedTitle
            variant="right"
            className="section-heading"
            style={{
              fontSize: "clamp(1.875rem, 4vw, 2.75rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              marginTop: 14,
            }}
          >
            {t("landing.testimonials.heading")}
          </AnimatedTitle>
          <motion.p
            style={{
              color: "var(--color-text-muted)",
              fontSize: 16,
              lineHeight: 1.6,
              maxWidth: 560,
              margin: "18px auto 0",
            }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
            whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, delay: 0.1, ease: easeOutExpo }}
          >
            {t("landing.testimonials.desc")}
          </motion.p>
        </div>

        {/* ── Stories grid ───────────────────────────────────── */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: 20, maxWidth: 1120, margin: "0 auto" }}
        >
          {STORIES.map((s, i) => (
            <StoryCard
              key={s.nameKey}
              quote={t(s.quoteKey)}
              name={t(s.nameKey)}
              role={t(s.roleKey)}
              avatar={s.avatar}
              index={i}
            />
          ))}
        </div>

        {/* ── Footer trust line ──────────────────────────────── */}
        <motion.p
          className="text-center"
          style={{
            marginTop: 56,
            fontSize: 13,
            color: "var(--color-text-muted)",
            letterSpacing: "0.01em",
            maxWidth: 520,
            marginLeft: "auto",
            marginRight: "auto",
          }}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, delay: 0.3, ease: easeOutExpo }}
        >
          {t("landing.testimonials.footer")}
        </motion.p>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- */
/*  StoryCard — bulletproof inline styles, no class-resolution risk  */
/* ----------------------------------------------------------------- */
function StoryCard({
  quote,
  name,
  role,
  avatar,
  index,
}: {
  quote: string;
  name: string;
  role: string;
  avatar: string;
  index: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.figure
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        padding: "32px 28px 26px",
        background: "rgba(255, 255, 255, 0.018)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        borderRadius: 20,
        margin: 0,
        minHeight: 320,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{
        duration: 0.7,
        delay: 0.2 + index * 0.1,
        ease: easeOutSoft,
      }}
    >
      {/* Open quote glyph */}
      <svg
        width="26"
        height="20"
        viewBox="0 0 28 22"
        fill="none"
        aria-hidden
        style={{
          color: "rgba(200, 200, 216, 0.16)",
          marginBottom: 16,
          flexShrink: 0,
        }}
      >
        <path
          d="M0 22V13.2C0 9.2 0.733333 5.93333 2.2 3.4C3.66667 0.866667 6 -0.4 9.2 -0.4L9.6 2.6C7.46667 2.86667 6 3.86667 5.2 5.6C4.4 7.33333 4 9.66667 4 12.6H9.4V22H0ZM18 22V13.2C18 9.2 18.7333 5.93333 20.2 3.4C21.6667 0.866667 24 -0.4 27.2 -0.4L27.6 2.6C25.4667 2.86667 24 3.86667 23.2 5.6C22.4 7.33333 22 9.66667 22 12.6H27.4V22H18Z"
          fill="currentColor"
        />
      </svg>

      {/* The quote — visual hero of the card */}
      <blockquote
        style={{
          flex: 1,
          margin: 0,
          fontSize: 15.5,
          lineHeight: 1.62,
          letterSpacing: "-0.003em",
          color: "rgba(255, 255, 255, 0.9)",
          fontWeight: 400,
        }}
      >
        {quote}
      </blockquote>

      {/* Attribution row — inline flex, no CSS dependency */}
      <figcaption
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginTop: 24,
          paddingTop: 18,
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatar}
          alt={name}
          width={40}
          height={40}
          loading="lazy"
          style={{
            width: 40,
            height: 40,
            minWidth: 40,
            borderRadius: 999,
            objectFit: "cover",
            flexShrink: 0,
            background: "rgba(255, 255, 255, 0.04)",
            display: "block",
          }}
        />
        <div style={{ minWidth: 0, lineHeight: 1.3 }}>
          <div
            style={{
              fontSize: 13.5,
              fontWeight: 600,
              color: "var(--color-text)",
              letterSpacing: "-0.005em",
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--color-text-muted)",
              marginTop: 2,
            }}
          >
            {role}
          </div>
        </div>
      </figcaption>
    </motion.figure>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth-context";
import TonvoLogo from "@/components/Logo";

function IconArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero app preview — realistic full dashboard mockup                */
/* ------------------------------------------------------------------ */
function HeroAppPreview() {
  const { t } = useTranslation();
  return (
    <div className="hero-mockup-wrapper">
      <div
        className="hero-mockup-frame rounded-2xl overflow-hidden"
        style={{
          background: "rgba(17, 17, 20, 0.85)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 40px 80px rgba(0, 0, 0, 0.5), 0 0 120px rgba(200, 200, 216, 0.04)",
        }}
      >
        {/* Browser chrome */}
        <div
          className="flex items-center gap-2 px-4 py-2.5 border-b"
          style={{ borderColor: "var(--color-border)", backgroundColor: "rgba(26, 26, 30, 0.9)" }}
        >
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#f87171" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#fbbf24" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#34d399" }} />
          </div>
          <div
            className="flex-1 mx-3 py-1 px-3 rounded-md text-[10px] text-center flex items-center justify-center gap-1.5"
            style={{ background: "rgba(255, 255, 255, 0.04)", color: "var(--color-text-muted)" }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.5 }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            tonvo.co/session
          </div>
        </div>

        {/* App layout: sidebar + main */}
        <div className="flex" style={{ minHeight: 340 }}>
          {/* Sidebar — matches real app sidebar with logo, icons, user profile */}
          <div
            className="hidden sm:flex flex-col w-52 shrink-0 border-r py-3 px-3"
            style={{ borderColor: "var(--color-border)", backgroundColor: "rgba(14, 14, 17, 0.7)" }}
          >
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-2 py-2 mb-4">
              <TonvoLogo size="xs" showText={true} />
            </div>

            <div className="text-[9px] font-semibold uppercase tracking-wider px-2.5 mb-2" style={{ color: "var(--color-text-muted)", letterSpacing: "0.08em" }}>{t("mockup.menu")}</div>

            {[
              { label: t("mockup.sidebar.dashboard"), active: false, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg> },
              { label: t("mockup.sidebar.liveSession"), active: true, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg> },
              { label: t("mockup.sidebar.history"), active: false, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" /></svg> },
              { label: t("mockup.sidebar.textAnalysis"), active: false, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /></svg> },
              { label: t("mockup.sidebar.analytics"), active: false, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" /></svg> },
              { label: t("mockup.sidebar.pricing"), active: false, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg> },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[11px] mb-0.5"
                style={{
                  background: item.active ? "rgba(255, 255, 255, 0.06)" : "transparent",
                  color: item.active ? "var(--color-text)" : "var(--color-text-muted)",
                  fontWeight: item.active ? 600 : 400,
                }}
              >
                <span style={{ opacity: item.active ? 1 : 0.5 }}>{item.icon}</span>
                {item.label}
              </div>
            ))}

            {/* User profile at bottom */}
            <div className="mt-auto pt-3 border-t" style={{ borderColor: "var(--color-border)" }}>
              <div className="flex items-center gap-2 px-2 py-1.5">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-semibold" style={{ background: "linear-gradient(135deg, rgba(200,200,216,0.12) 0%, rgba(200,200,216,0.04) 100%)", color: "var(--color-accent-light)", border: "1px solid rgba(255,255,255,0.06)" }}>E</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-medium m-0 truncate" style={{ color: "var(--color-text)" }}>Emilien</p>
                </div>
                <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(52, 211, 153, 0.12)", color: "var(--color-positive)", border: "1px solid rgba(52, 211, 153, 0.2)" }}>Pro</span>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Top bar with live status */}
            <div
              className="flex items-center justify-between px-4 py-2.5 border-b"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full pulse-positive" style={{ backgroundColor: "var(--color-positive)" }} />
                <span className="text-xs font-medium" style={{ color: "var(--color-positive)" }}>{t("mockup.live")}</span>
                <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>02:34</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-end gap-0.5" style={{ height: 16 }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="audio-wave-bar" style={{ animationDelay: `${i * 0.15}s`, height: 12 }} />
                  ))}
                </div>
                <div className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(52, 211, 153, 0.1)", color: "var(--color-positive)", border: "1px solid rgba(52, 211, 153, 0.2)" }}>
                  {t("mockup.positive")}
                </div>
              </div>
            </div>

            {/* Content area: transcript + sidebar panel */}
            <div className="flex flex-1">
              {/* Transcript */}
              <div className="flex-1 px-4 py-3 space-y-2.5 overflow-hidden">
                {[
                  { text: t("mockup.transcript1"), tone: "positive", speaker: t("mockup.you"), time: "00:32" },
                  { text: t("mockup.transcript2"), tone: "hesitant", speaker: t("mockup.speaker2"), time: "01:15" },
                  { text: t("mockup.transcript3"), tone: "positive", speaker: t("mockup.you"), time: "01:48" },
                  { text: t("mockup.transcript4"), tone: "neutral", speaker: t("mockup.speaker2"), time: "02:12" },
                ].map((seg, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: seg.tone === "positive" ? "var(--color-positive)" : seg.tone === "hesitant" ? "var(--color-neutral)" : "var(--color-text-muted)" }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[10px] font-semibold" style={{ color: seg.speaker === "You" ? "var(--color-accent-light)" : "var(--color-text-muted)" }}>{seg.speaker}</span>
                        <span className="text-[9px]" style={{ color: "rgba(139, 139, 150, 0.6)" }}>{seg.time}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed m-0" style={{ color: "var(--color-text-silver)" }}>{seg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right panel: AI Copilot with smart responses */}
              <div
                className="hidden md:flex flex-col w-48 shrink-0 border-l px-3 py-3 gap-2.5"
                style={{ borderColor: "var(--color-border)" }}
              >
                {/* Copilot header */}
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="w-1.5 h-1.5 rounded-full pulse-positive" style={{ backgroundColor: "var(--color-positive)" }} />
                  <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--color-text)" }}>{t("mockup.aiCopilot")}</span>
                </div>

                {/* Say This — smart response cards */}
                <div className="rounded-lg p-2.5" style={{ background: "rgba(52, 211, 153, 0.04)", border: "1px solid rgba(52, 211, 153, 0.12)" }}>
                  <div className="flex items-center gap-1 mb-2">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: "var(--color-positive)" }}>{t("mockup.sayThis")}</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="rounded-md p-1.5" style={{ background: "rgba(52, 211, 153, 0.06)", border: "1px solid rgba(52, 211, 153, 0.1)" }}>
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="text-[8px]">🎯</span>
                        <span className="text-[7px] font-bold uppercase" style={{ color: "var(--color-text-muted)" }}>{t("mockup.closeDeal")}</span>
                      </div>
                      <p className="text-[9px] leading-snug m-0" style={{ color: "var(--color-text)" }}>{t("mockup.closeDealText")}</p>
                    </div>
                    <div className="rounded-md p-1.5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="text-[8px]">🔍</span>
                        <span className="text-[7px] font-bold uppercase" style={{ color: "var(--color-text-muted)" }}>{t("mockup.askDeeper")}</span>
                      </div>
                      <p className="text-[9px] leading-snug m-0" style={{ color: "var(--color-text-silver)" }}>{t("mockup.askDeeperText")}</p>
                    </div>
                  </div>
                </div>

                {/* Tone chart */}
                <div className="rounded-lg p-2.5" style={{ background: "rgba(200, 200, 216, 0.04)", border: "1px solid rgba(200, 200, 216, 0.08)" }}>
                  <div className="text-[9px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-accent-light)" }}>
                    {t("mockup.toneFlow")}
                  </div>
                  <div className="flex items-end gap-0.5" style={{ height: 28 }}>
                    {[65, 72, 58, 80, 75, 85, 70, 90, 82, 88].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm"
                        style={{
                          height: `${h}%`,
                          background: h > 75 ? "var(--color-positive)" : h > 60 ? "var(--color-neutral)" : "var(--color-negative)",
                          opacity: 0.6 + (i * 0.04),
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Score */}
                <div className="rounded-lg p-2 text-center" style={{ background: "rgba(52, 211, 153, 0.04)", border: "1px solid rgba(52, 211, 153, 0.1)" }}>
                  <div className="text-[8px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: "var(--color-text-muted)" }}>
                    {t("mockup.quality")}
                  </div>
                  <div className="text-lg font-bold" style={{ color: "var(--color-positive)" }}>87</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingHero() {
  const { user, loading } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  /* While checking auth, show nothing briefly; once confirmed no user, render hero */
  if (loading || user) return null;

  const ctaHref = "/login";

  /* Highlight the leading metric (e.g. "27%" in "Close 27% more deals.") with
     a gradient + scintillation. Falls back to plain text for locales without
     a percent in the headline. */
  const headline1 = t("landing.hero.headline1");
  const percentMatch = headline1.match(/^(.*?)(\d+%)(.*)$/);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-[85vh] sm:min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-28 sm:pt-32 pb-8 overflow-hidden grid-bg">
        {/* Static ambient glows (CSS) */}
        <div className="hero-glow" style={{ top: "-10%", left: "50%", transform: "translateX(-50%)" }} />
        <div className="hero-glow" style={{ bottom: "-20%", left: "-10%", width: 400, height: 400, background: "radial-gradient(circle, rgba(52, 211, 153, 0.04) 0%, transparent 70%)" }} />
        <div className="hero-glow" style={{ top: "30%", right: "-10%", width: 350, height: 350, background: "radial-gradient(circle, rgba(200, 200, 216, 0.04) 0%, transparent 70%)" }} />

        <div className="relative z-10 max-w-3xl text-center">
          {/* ── HEADLINE ── */}
          <h1 className="hero-heading text-glow mb-6" style={{ fontWeight: 700 }}>
            <motion.span
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              style={{ display: "block" }}
            >
              {percentMatch ? (
                <>
                  {percentMatch[1]}
                  <motion.span
                    className="inline-block tabular-nums"
                    animate={
                      reduce
                        ? undefined
                        : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }
                    }
                    transition={
                      reduce
                        ? undefined
                        : { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }
                    }
                    style={{
                      background:
                        "linear-gradient(115deg, #fafafa 0%, #34d399 30%, #6ee7b7 50%, #34d399 70%, #fafafa 100%)",
                      backgroundSize: "240% 100%",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 0 18px rgba(52, 211, 153, 0.35))",
                    }}
                  >
                    {percentMatch[2]}
                  </motion.span>
                  {percentMatch[3]}
                </>
              ) : (
                headline1
              )}
            </motion.span>
            <motion.span
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
              animate={
                reduce
                  ? { opacity: 1 }
                  : { opacity: 1, y: 0, backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }
              }
              transition={
                reduce
                  ? { duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.25 }
                  : {
                      opacity: { duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.25 },
                      y: { duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.25 },
                      backgroundPosition: { duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.4 },
                    }
              }
              className="block mt-1"
              style={{
                fontWeight: 200,
                letterSpacing: "-0.025em",
                background:
                  "linear-gradient(115deg, rgba(255, 255, 255, 0.55) 0%, #fafafa 30%, rgba(200, 200, 216, 0.95) 50%, #fafafa 70%, rgba(255, 255, 255, 0.55) 100%)",
                backgroundSize: "240% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t("landing.hero.headline2")}
            </motion.span>
          </h1>

          <motion.p
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="body-muted text-lg md:text-xl mb-10 max-w-xl mx-auto"
          >
            {t("landing.hero.subtitle")}
          </motion.p>

          {/* ── PREMIUM CTAs ── */}
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center"
          >
            {/* Primary — broadcast button */}
            <motion.div
              whileHover={reduce ? undefined : { y: -3 }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
            >
              <Link
                href={ctaHref}
                className="relative inline-flex items-center gap-3 px-5 sm:px-6 py-3.5 rounded-full no-underline overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(52, 211, 153, 0.22) 0%, rgba(52, 211, 153, 0.06) 100%)",
                  border: "1px solid rgba(52, 211, 153, 0.4)",
                  boxShadow:
                    "0 24px 60px -22px rgba(52, 211, 153, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
                  color: "var(--color-text)",
                  minHeight: 52,
                }}
              >
                <motion.span
                  aria-hidden
                  className="absolute top-0 bottom-0 pointer-events-none"
                  animate={reduce ? undefined : { x: ["-130%", "230%"] }}
                  transition={
                    reduce
                      ? undefined
                      : { duration: 4.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.6 }
                  }
                  style={{
                    width: "60%",
                    background:
                      "linear-gradient(105deg, transparent 30%, rgba(255, 255, 255, 0.18) 50%, transparent 70%)",
                    mixBlendMode: "screen",
                  }}
                />
                <span
                  className="relative shrink-0 inline-flex items-center justify-center"
                  style={{ width: 28, height: 28 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      aria-hidden
                      className="absolute rounded-full"
                      style={{
                        width: 28,
                        height: 28,
                        border: "1px solid rgba(52, 211, 153, 0.6)",
                      }}
                      animate={reduce ? undefined : { scale: [0.4, 1.2], opacity: [0.55, 0] }}
                      transition={
                        reduce
                          ? undefined
                          : { duration: 2.2, repeat: Infinity, ease: "easeOut", delay: i * 0.7 }
                      }
                    />
                  ))}
                  <span
                    aria-hidden
                    className="relative rounded-full"
                    style={{
                      width: 8,
                      height: 8,
                      background: "linear-gradient(180deg, #34d399 0%, #059669 100%)",
                      boxShadow: "0 0 12px rgba(52, 211, 153, 0.8)",
                    }}
                  />
                </span>
                <span className="relative text-sm sm:text-base font-semibold">
                  {t("landing.hero.cta")}
                </span>
                <IconArrowRight className="relative" />
              </Link>
            </motion.div>

            {/* Secondary — ghost glass */}
            <motion.div
              whileHover={reduce ? undefined : { y: -3 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
            >
              <a
                href="#demo"
                className="relative inline-flex items-center gap-2 px-5 sm:px-6 py-3.5 rounded-full no-underline group w-full sm:w-auto justify-center"
                style={{
                  background: "rgba(255, 255, 255, 0.025)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "var(--color-text-silver)",
                  minHeight: 52,
                  transition: "background 0.3s ease, border-color 0.3s ease, color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.18)";
                  e.currentTarget.style.color = "var(--color-text)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.025)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.color = "var(--color-text-silver)";
                }}
              >
                <span className="text-sm sm:text-base font-medium">
                  {t("landing.hero.ctaSecondary")}
                </span>
                <span
                  aria-hidden
                  className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                >
                  →
                </span>
              </a>
            </motion.div>
          </motion.div>

          {/* ── 5-STAR ORNAMENT ── */}
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
            className="mt-8 sm:mt-10 flex justify-center"
            aria-hidden
          >
            <span className="inline-flex items-center gap-1.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <svg
                  key={i}
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="#fbbf24"
                  style={{ filter: "drop-shadow(0 0 4px rgba(251, 191, 36, 0.5))" }}
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </span>
          </motion.div>

        </div>

        {/* Hero app preview — the product mockup that sells */}
        <div className="relative z-10 w-full max-w-5xl mx-auto mt-16 sm:mt-20 animate-fade-up animate-delay-500 px-2 sm:px-4">
          <HeroAppPreview />
        </div>
      </section>
    </>
  );
}

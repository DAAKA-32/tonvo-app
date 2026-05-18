"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
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

/* ============================================================== */
/*  HeroDemoStage                                                  */
/*  — partial-peek video stage with 3D cursor tilt,                */
/*    light-scan beam, reflective floor, breathing halo.           */
/* ============================================================== */
// Set to "/demo.mp4" (or any URL) once you drop a real video into /public.
// While null, we render the rich app mockup directly without hitting the network.
const DEMO_VIDEO_SRC: string | null = null;

function HeroDemoStage() {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  // Scroll-driven yaw + roll: default tilt right, flips through 0 to opposite as page scrolls
  const { scrollY } = useScroll();
  const flip = useTransform(scrollY, [0, 800], [1, -1], { clamp: true });
  const baseRotYRaw = useTransform(flip, (v) => v * 14);
  const baseRotZRaw = useTransform(flip, (v) => v * -3);
  const rotateY = useSpring(baseRotYRaw, { stiffness: 80, damping: 22, mass: 0.6 });
  const rotateZ = useSpring(baseRotZRaw, { stiffness: 80, damping: 22, mass: 0.6 });

  return (
    <div
      ref={stageRef}
      className="hero-stage relative w-full"
      style={{ perspective: 1600 }}
    >
      {/* Tilted frame — the partially visible "peek" demo */}
      <motion.div
        className="hero-stage-frame"
        style={{
          rotateY,
          rotateZ,
          transformStyle: "preserve-3d",
          transformPerspective: 1600,
        }}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 70, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1], delay: 0.65 }}
      >
        {/* LIVE chip — sits over the top edge */}
        <div className="hero-stage-live">
          <span className="hero-stage-live-dot" />
          <span className="hero-stage-live-text">LIVE • REAL-TIME COPILOT</span>
        </div>

        {/* The actual demo (video if available, otherwise rich app mockup) */}
        <div className="hero-stage-screen">
          {DEMO_VIDEO_SRC && !videoFailed ? (
            <>
              <video
                className="hero-stage-video"
                src={DEMO_VIDEO_SRC}
                poster="/og-image.png"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                onCanPlay={() => setVideoReady(true)}
                onError={() => setVideoFailed(true)}
              />
              {!videoReady && (
                <div className="hero-stage-fallback">
                  <HeroAppPreview />
                </div>
              )}
            </>
          ) : (
            <div className="hero-stage-fallback">
              <HeroAppPreview />
            </div>
          )}

          {/* Vignette + bottom fade — implies "more below the fold" */}
          <div aria-hidden className="hero-stage-vignette" />
          <div aria-hidden className="hero-stage-bottomfade" />
        </div>

      </motion.div>

      {/* "More below" hint */}
      <motion.div
        aria-hidden
        className="hero-stage-morebelow"
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
        animate={reduce ? { opacity: 1 } : { opacity: [0, 1, 1, 0.6, 1], y: [0, 6, 0, 6, 0] }}
        transition={reduce ? { duration: 0.6, delay: 1.4 } : { duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 1.6 }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14" />
          <path d="m5 12 7 7 7-7" />
        </svg>
      </motion.div>
    </div>
  );
}

/* ============================================================== */
/*  Hero app preview — realistic full dashboard mockup (fallback)  */
/* ============================================================== */
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
          {/* Sidebar */}
          <div
            className="hidden sm:flex flex-col w-52 shrink-0 border-r py-3 px-3"
            style={{ borderColor: "var(--color-border)", backgroundColor: "rgba(14, 14, 17, 0.7)" }}
          >
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

            <div className="flex flex-1">
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

              <div
                className="hidden md:flex flex-col w-48 shrink-0 border-l px-3 py-3 gap-2.5"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="w-1.5 h-1.5 rounded-full pulse-positive" style={{ backgroundColor: "var(--color-positive)" }} />
                  <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--color-text)" }}>{t("mockup.aiCopilot")}</span>
                </div>

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

/* ============================================================== */
/*  WordsReveal — clip-path word-by-word reveal for the headline   */
/* ============================================================== */
function WordsReveal({
  text,
  delay = 0,
  className,
  style,
  gradient,
}: {
  text: string;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  gradient?: boolean;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <span className={className} style={{ display: "inline-block", ...style }}>
      {words.map((w, i) => (
        <span key={i} className="hero-word-mask">
          <motion.span
            className="hero-word-inner"
            initial={reduce ? { opacity: 0 } : { y: "115%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              duration: 0.85,
              ease: [0.22, 1, 0.36, 1],
              delay: delay + i * 0.08,
            }}
            style={
              gradient
                ? {
                    background:
                      "linear-gradient(115deg, rgba(255,255,255,0.55) 0%, #fafafa 28%, rgba(200,200,216,0.95) 50%, #fafafa 72%, rgba(255,255,255,0.55) 100%)",
                    backgroundSize: "240% 100%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }
                : undefined
            }
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

/* ============================================================== */
/*  FadeRotation — cycles through phrases with a smooth fade.      */
/*  Replaces the older typewriter pattern: full phrase appears,    */
/*  holds, fades out + up, next fades in + down. No layout shift   */
/*  thanks to a hidden ghost sized to the longest phrase.          */
/* ============================================================== */
function FadeRotation({
  phrases,
  initialDelayMs = 0,
  holdMs = 1500,
  fadeMs = 280,
  className,
  gradient,
}: {
  phrases: string[];
  initialDelayMs?: number;
  holdMs?: number;
  fadeMs?: number;
  className?: string;
  gradient?: boolean;
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce || phrases.length <= 1) return;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    const startId = setTimeout(() => {
      intervalId = setInterval(() => {
        setIndex((i) => (i + 1) % phrases.length);
      }, holdMs + fadeMs);
    }, initialDelayMs);
    return () => {
      clearTimeout(startId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [phrases.length, holdMs, fadeMs, initialDelayMs, reduce]);

  const longest = phrases.reduce(
    (a, b) => (a.length >= b.length ? a : b),
    "",
  );

  const gradientStyle: React.CSSProperties | undefined = gradient
    ? {
        background:
          "linear-gradient(115deg, rgba(255,255,255,0.55) 0%, #fafafa 28%, rgba(200,200,216,0.95) 50%, #fafafa 72%, rgba(255,255,255,0.55) 100%)",
        backgroundSize: "240% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }
    : undefined;

  if (reduce) {
    return (
      <span className={className} style={gradientStyle}>
        {phrases[0]}
      </span>
    );
  }

  return (
    <span className={`fade-rotation ${className ?? ""}`} aria-live="polite">
      <span className="fade-rotation-ghost" aria-hidden style={gradientStyle}>
        {longest}
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          className="fade-rotation-current"
          style={gradientStyle}
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
          transition={{
            duration: fadeMs / 1000,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {phrases[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ============================================================== */
/*  commonPrefix — finds the shared leading word(s) across phrases */
/*  (kept for back-compat — no longer used by the hero headline)   */
/* ============================================================== */
function commonPrefix(strs: string[]): string {
  if (!strs.length) return "";
  const first = strs[0];
  let i = 0;
  while (i < first.length && strs.every((s) => s[i] === first[i])) i += 1;
  // Snap to a word boundary — never cut mid-word
  const lastSpace = first.lastIndexOf(" ", i);
  return lastSpace > 0 ? first.slice(0, lastSpace) : "";
}

/* ============================================================== */
/*  TypewriterReveal — looping typewriter that cycles through      */
/*  multiple phrases (type → hold → backspace → next).             */
/* ============================================================== */
function TypewriterReveal({
  phrases,
  prefix = "",
  delay = 0,
  typeSpeed = 42,
  deleteSpeed = 24,
  holdAfterType = 1800,
  holdAfterDelete = 350,
  gradient,
  className,
}: {
  phrases: string[];
  prefix?: string;
  delay?: number;
  typeSpeed?: number;
  deleteSpeed?: number;
  holdAfterType?: number;
  holdAfterDelete?: number;
  gradient?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [shown, setShown] = useState(0);
  const [phase, setPhase] = useState<"start" | "typing" | "holdAfter" | "deleting" | "holdBefore">("start");

  // Reserve space using the longest phrase so layout never shifts
  const ghost = phrases.reduce((a, b) => (a.length >= b.length ? a : b), "");
  const current = phrases[phraseIdx] ?? "";

  useEffect(() => {
    // Static render under prefers-reduced-motion: just show phrase 1
    if (reduce) {
      setShown(phrases[0]?.length ?? 0);
      setPhase("holdAfter");
      return;
    }

    let id: ReturnType<typeof setTimeout> | undefined;

    if (phase === "start") {
      id = setTimeout(() => setPhase("typing"), delay * 1000);
    } else if (phase === "typing") {
      if (shown < current.length) {
        id = setTimeout(() => setShown(shown + 1), typeSpeed);
      } else {
        id = setTimeout(() => setPhase("holdAfter"), 0);
      }
    } else if (phase === "holdAfter") {
      id = setTimeout(() => setPhase("deleting"), holdAfterType);
    } else if (phase === "deleting") {
      if (shown > 0) {
        id = setTimeout(() => setShown(shown - 1), deleteSpeed);
      } else {
        id = setTimeout(() => setPhase("holdBefore"), 0);
      }
    } else if (phase === "holdBefore") {
      id = setTimeout(() => {
        setPhraseIdx((phraseIdx + 1) % phrases.length);
        setPhase("typing");
      }, holdAfterDelete);
    }

    return () => {
      if (id) clearTimeout(id);
    };
  }, [phase, shown, phraseIdx, current.length, delay, typeSpeed, deleteSpeed, holdAfterType, holdAfterDelete, phrases, reduce]);

  const gradientStyle: React.CSSProperties | undefined = gradient
    ? {
        background:
          "linear-gradient(115deg, rgba(255,255,255,0.55) 0%, #fafafa 28%, rgba(200,200,216,0.95) 50%, #fafafa 72%, rgba(255,255,255,0.55) 100%)",
        backgroundSize: "240% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }
    : undefined;

  const showCaret = !reduce;
  // Progress as percentage of current phrase width (0–100)
  const progressPct = current.length > 0 ? (shown / current.length) * 100 : 0;
  const clipInsetRight = 100 - progressPct;

  return (
    <span
      className={className}
      style={{ display: "inline-block", whiteSpace: "nowrap", verticalAlign: "top" }}
    >
      {prefix ? (
        <span style={{ whiteSpace: "nowrap", ...gradientStyle }}>{prefix} </span>
      ) : null}
      <span style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap" }}>
        {/* Invisible ghost of longest phrase → reserves layout, locks line height */}
        <span
          aria-hidden
          style={{ visibility: "hidden", whiteSpace: "nowrap", ...gradientStyle }}
        >
          {ghost}
        </span>

        {/* Inner wrapper sized to current phrase intrinsic width — caret rides here */}
        <span
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            display: "inline-block",
            whiteSpace: "nowrap",
          }}
        >
          {/* Full current text, progressively revealed via clip-path */}
          <span
            aria-hidden
            style={{
              ...gradientStyle,
              display: "inline-block",
              whiteSpace: "nowrap",
              clipPath: `inset(0 ${clipInsetRight}% 0 0)`,
              WebkitClipPath: `inset(0 ${clipInsetRight}% 0 0)`,
              transition: "clip-path 60ms linear, -webkit-clip-path 60ms linear",
            }}
          >
            {current}
          </span>
          {/* Caret riding the clip boundary */}
          {showCaret && (
            <span
              aria-hidden
              className="typewriter-caret"
              style={{
                position: "absolute",
                top: "10%",
                left: `${progressPct}%`,
                height: "82%",
                width: "0.06em",
                background: "rgba(200, 200, 216, 0.92)",
                borderRadius: "1px",
                transform: "translateX(-50%)",
                animation: "typewriterBlink 0.9s steps(1) infinite",
                transition: "left 60ms linear",
                pointerEvents: "none",
              }}
            />
          )}
        </span>
      </span>
      {/* SR-only full text for accessibility */}
      <span
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
        }}
      >
        {prefix ? prefix + " " : ""}
        {phrases.join(". ")}
      </span>
    </span>
  );
}

/* ============================================================== */
/*  MagneticButton — subtle cursor attraction on hover             */
/* ============================================================== */
function MagneticButton({
  children,
  className,
  style,
  href,
  external,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  href: string;
  external?: boolean;
}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18 });
  const sy = useSpring(y, { stiffness: 220, damping: 18 });

  function move(e: React.MouseEvent<HTMLElement>) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width - 0.5) * 14);
    y.set(((e.clientY - r.top) / r.height - 0.5) * 10);
  }
  function leave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div style={{ x: sx, y: sy, display: "inline-block" }}>
      {external ? (
        <a href={href} onMouseMove={move} onMouseLeave={leave} className={className} style={style}>
          {children}
        </a>
      ) : (
        <Link href={href} onMouseMove={move} onMouseLeave={leave} className={className} style={style}>
          {children}
        </Link>
      )}
    </motion.div>
  );
}

/* ============================================================== */
/*  LandingHero — exceptional opening                              */
/* ============================================================== */
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

  if (loading || user) return null;

  const ctaHref = "/login";
  const headline1 = t("landing.hero.headline1");
  const percentMatch = headline1.match(/^(.*?)(\d+%)(.*)$/);

  return (
    <section className="hero-section relative px-4 sm:px-6 pt-32 sm:pt-36 pb-0 overflow-hidden grid-bg">
      {/* ── HEADLINE BLOCK ── */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Headline */}
        <h1 className="hero-heading text-glow mb-6 sm:mb-8" style={{ fontWeight: 700 }}>
          <span style={{ display: "block" }}>
            {percentMatch ? (
              <>
                <WordsReveal text={percentMatch[1].trim()} delay={0.15} />
                {percentMatch[1].endsWith(" ") ? " " : ""}
                <motion.span
                  className="inline-block tabular-nums hero-percent"
                  animate={reduce ? undefined : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={reduce ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  {percentMatch[2]}
                </motion.span>
                {percentMatch[3] ? <>{" "}<WordsReveal text={percentMatch[3].trim()} delay={0.35} /></> : null}
              </>
            ) : (
              <WordsReveal text={headline1} delay={0.15} />
            )}
          </span>
          <span className="hero-headline2 block mt-3" style={{ fontWeight: 200, letterSpacing: "-0.025em" }}>
            {(() => {
              const raw = t("landing.hero.headline2Phrases", {
                returnObjects: true,
              });
              const phrases =
                Array.isArray(raw) && raw.length > 0
                  ? (raw as string[])
                  : [t("landing.hero.headline2") as string];
              return (
                <FadeRotation
                  phrases={phrases}
                  initialDelayMs={1100}
                  holdMs={1500}
                  fadeMs={320}
                  gradient
                />
              );
            })()}
          </span>
        </h1>

        <motion.p
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.9 }}
          className="body-muted text-base md:text-lg mb-8 sm:mb-10 max-w-xl mx-auto"
        >
          {t("landing.hero.subtitle")}
        </motion.p>

        {/* ── CTAs ── */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 1.05 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center"
        >
          <MagneticButton
            href={ctaHref}
            className="hero-cta-primary"
            style={{
              background: "linear-gradient(135deg, rgba(52, 211, 153, 0.22) 0%, rgba(52, 211, 153, 0.06) 100%)",
              border: "1px solid rgba(52, 211, 153, 0.4)",
              boxShadow: "0 24px 60px -22px rgba(52, 211, 153, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
              color: "var(--color-text)",
            }}
          >
            <motion.span
              aria-hidden
              className="absolute top-0 bottom-0 pointer-events-none"
              animate={reduce ? undefined : { x: ["-130%", "230%"] }}
              transition={reduce ? undefined : { duration: 6.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 4.5 }}
              style={{
                width: "70%",
                background: "linear-gradient(105deg, transparent 35%, rgba(255, 255, 255, 0.08) 50%, transparent 65%)",
                mixBlendMode: "screen",
                filter: "blur(2px)",
              }}
            />
            <span className="relative shrink-0 inline-flex items-center justify-center" style={{ width: 28, height: 28 }}>
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  aria-hidden
                  className="absolute rounded-full"
                  style={{ width: 28, height: 28, border: "1px solid rgba(52, 211, 153, 0.6)" }}
                  animate={reduce ? undefined : { scale: [0.4, 1.2], opacity: [0.55, 0] }}
                  transition={reduce ? undefined : { duration: 2.2, repeat: Infinity, ease: "easeOut", delay: i * 0.7 }}
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
            <span className="relative text-sm sm:text-base font-semibold">{t("landing.hero.cta")}</span>
            <IconArrowRight className="relative" />
          </MagneticButton>

          <MagneticButton
            href="#demo"
            external
            className="hero-cta-ghost"
            style={{
              background: "rgba(255, 255, 255, 0.025)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              color: "var(--color-text-silver)",
            }}
          >
            <span className="hero-cta-ghost-play" aria-hidden>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            </span>
            <span className="text-sm sm:text-base font-medium">{t("landing.hero.ctaSecondary")}</span>
          </MagneticButton>
        </motion.div>
      </div>

      {/* ── PARTIAL VIDEO DEMO STAGE ── */}
      <div className="hero-stage-outer relative z-10 w-full max-w-5xl mx-auto mt-10 sm:mt-12 px-2 sm:px-4">
        <HeroDemoStage />
      </div>

      <style jsx>{`
        .hero-section {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* ── Fade rotation (replaces old typewriter) ── */
        :global(.fade-rotation) {
          position: relative;
          display: inline-block;
          vertical-align: bottom;
        }
        :global(.fade-rotation-ghost) {
          visibility: hidden;
          display: inline-block;
          white-space: nowrap;
          pointer-events: none;
        }
        :global(.fade-rotation-current) {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          display: inline-block;
          white-space: nowrap;
          will-change: opacity, transform, filter;
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px 6px 10px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--color-text-silver);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .hero-eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: var(--color-positive);
          box-shadow: 0 0 10px rgba(52, 211, 153, 0.8);
          animation: heroDotPulse 1.6s ease-in-out infinite;
        }
        @keyframes heroDotPulse {
          0%, 100% { opacity: 0.55; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        .hero-percent {
          background: linear-gradient(115deg, #fafafa 0%, #34d399 30%, #6ee7b7 50%, #34d399 70%, #fafafa 100%);
          background-size: 240% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 18px rgba(52, 211, 153, 0.35));
        }

        :global(.hero-word-mask) {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
          line-height: 1.15;
          padding-bottom: 0.22em;
        }
        :global(.hero-headline2) {
          line-height: 1.18;
          padding-bottom: 0.18em;
        }
        @keyframes typewriterBlink {
          0%, 50% { opacity: 0.8; }
          50.01%, 100% { opacity: 0; }
        }
        :global(.typewriter-caret) {
          border-radius: 1px;
        }
        :global(.hero-word-inner) {
          display: inline-block;
          will-change: transform;
        }

        :global(.hero-cta-primary) {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 14px 22px;
          border-radius: 999px;
          text-decoration: none;
          overflow: hidden;
          min-height: 52px;
          white-space: nowrap;
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        :global(.hero-cta-primary:hover) {
          box-shadow: 0 32px 70px -22px rgba(52, 211, 153, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.12);
        }
        :global(.hero-cta-ghost) {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 22px;
          border-radius: 999px;
          text-decoration: none;
          min-height: 52px;
          white-space: nowrap;
          transition: background 0.3s ease, border-color 0.3s ease, color 0.3s ease;
        }
        :global(.hero-cta-ghost:hover) {
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.18) !important;
          color: var(--color-text) !important;
        }
        :global(.hero-cta-ghost-play) {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          color: var(--color-text);
          padding-left: 1px;
        }

        /* ── Stage ── */
        :global(.hero-stage) {
          position: relative;
          transform-style: preserve-3d;
        }
        /* ── Smart aurora background ── */
        :global(.hero-stage-aurora) {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 130%;
          height: 130%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 0;
          will-change: transform, opacity;
        }
        :global(.hero-stage-conic) {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 95%;
          height: 95%;
          transform: translate(-50%, -50%);
          background: conic-gradient(
            from 0deg,
            transparent 0%,
            rgba(200, 200, 216, 0.16) 14%,
            transparent 32%,
            rgba(200, 200, 216, 0.10) 50%,
            transparent 68%,
            rgba(129, 140, 248, 0.12) 84%,
            transparent 100%
          );
          filter: blur(50px);
          opacity: 0.55;
          mix-blend-mode: screen;
        }
        :global(.hero-stage-blob) {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          mix-blend-mode: screen;
          will-change: transform;
        }
        :global(.hero-stage-blob--green) {
          left: 8%;
          top: 18%;
          width: 42%;
          height: 60%;
          background: radial-gradient(circle, rgba(200, 200, 216, 0.20) 0%, rgba(200, 200, 216, 0) 70%);
        }
        :global(.hero-stage-blob--silver) {
          right: 6%;
          top: 12%;
          width: 38%;
          height: 55%;
          background: radial-gradient(circle, rgba(200, 200, 216, 0.10) 0%, rgba(200, 200, 216, 0) 70%);
        }
        :global(.hero-stage-blob--violet) {
          left: 40%;
          top: 50%;
          width: 36%;
          height: 50%;
          background: radial-gradient(circle, rgba(129, 140, 248, 0.32) 0%, rgba(129, 140, 248, 0) 70%);
        }
        :global(.hero-stage-core) {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 70%;
          height: 65%;
          transform: translate(-50%, -50%);
          background: radial-gradient(60% 50% at 50% 50%, rgba(200, 200, 216, 0.04) 0%, transparent 70%);
          filter: blur(30px);
        }
        :global(.hero-stage-frame) {
          position: relative;
          z-index: 2;
          margin: 0 auto;
          width: 100%;
          max-width: 880px;
          /* PEEK: clip the bottom so only top portion is visible.
             Fixed height across devices — the mockup is the same size
             on a 13" laptop and a 27" monitor. Whatever doesn't fit
             above the fold is the user's view to scroll, but the visual
             never shrinks. */
          max-height: 460px;
          aspect-ratio: 16 / 10;
          border-radius: 22px;
          overflow: hidden;
          background: linear-gradient(180deg, rgba(28, 28, 34, 0.92), rgba(14, 14, 18, 0.96));
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow:
            0 60px 120px -30px rgba(0, 0, 0, 0.85),
            0 30px 60px -20px rgba(0, 0, 0, 0.45),
            0 0 0 1px rgba(255, 255, 255, 0.025) inset,
            0 1px 0 rgba(255, 255, 255, 0.08) inset;
        }
        :global(.hero-stage-screen) {
          position: relative;
          width: 100%;
          height: 100%;
        }
        :global(.hero-stage-video) {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          z-index: 1;
        }
        :global(.hero-stage-fallback) {
          position: absolute;
          inset: 0;
          z-index: 1;
          padding: 12px;
        }
        :global(.hero-stage-fallback .hero-mockup-frame) {
          height: 100%;
        }
        :global(.hero-stage-vignette) {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          background:
            radial-gradient(ellipse at center, transparent 55%, rgba(0, 0, 0, 0.35) 100%);
        }
        :global(.hero-stage-bottomfade) {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 18%;
          z-index: 4;
          pointer-events: none;
          background: linear-gradient(to top, var(--color-bg) 0%, rgba(10, 10, 14, 0.55) 60%, transparent 100%);
        }
        :global(.hero-stage-spotlight) {
          position: absolute;
          inset: 0;
          z-index: 5;
          pointer-events: none;
          mix-blend-mode: screen;
        }
        :global(.hero-stage-scan) {
          position: absolute;
          top: -20%;
          bottom: -20%;
          width: 38%;
          z-index: 6;
          pointer-events: none;
          background: linear-gradient(110deg, transparent 0%, rgba(255, 255, 255, 0.015) 40%, rgba(255, 255, 255, 0.06) 50%, rgba(255, 255, 255, 0.015) 60%, transparent 100%);
          mix-blend-mode: screen;
          filter: blur(8px);
          opacity: 0.7;
          transform: skewX(-12deg);
        }
        :global(.hero-stage-edge-top) {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 1px;
          z-index: 7;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.10) 50%, transparent 100%);
          pointer-events: none;
        }
        :global(.hero-stage-edge-left) {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 1px;
          z-index: 7;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, transparent 60%);
          pointer-events: none;
        }
        :global(.hero-stage-live) {
          position: absolute;
          top: 14px;
          left: 50%;
          transform: translateX(-50%);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 11px;
          border-radius: 999px;
          background: rgba(10, 10, 14, 0.75);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(52, 211, 153, 0.35);
          z-index: 8;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45), 0 0 24px rgba(52, 211, 153, 0.18);
        }
        :global(.hero-stage-live-dot) {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: #34d399;
          box-shadow: 0 0 8px rgba(52, 211, 153, 0.9);
          animation: heroDotPulse 1.4s ease-in-out infinite;
        }
        :global(.hero-stage-live-text) {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.16em;
          color: #d6f6e6;
        }
        :global(.hero-stage-reflection) {
          position: relative;
          margin: -2vh auto 0;
          width: 100%;
          max-width: 1100px;
          height: 16vh;
          max-height: 140px;
          background:
            radial-gradient(60% 100% at 50% 0%, rgba(0, 0, 0, 0.55) 0%, transparent 70%);
          filter: blur(12px);
          opacity: 0.5;
          transform-origin: top center;
          mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, transparent 100%);
          -webkit-mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, transparent 100%);
          pointer-events: none;
        }
        :global(.hero-stage-morebelow) {
          position: absolute;
          left: 50%;
          bottom: 18px;
          transform: translateX(-50%);
          color: rgba(255, 255, 255, 0.7);
          z-index: 9;
          pointer-events: none;
          filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.4));
        }

        @media (max-width: 640px) {
          :global(.hero-stage-frame) {
            max-height: 62vh;
            border-radius: 16px;
            aspect-ratio: 16 / 12;
          }
          :global(.hero-stage-bottomfade) {
            height: 22%;
          }
        }

      `}</style>
    </section>
  );
}

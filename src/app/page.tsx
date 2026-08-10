"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth-context";
import AnimatedTitle from "@/components/AnimatedTitle";
import TonvoLogo from "@/components/Logo";
import LandingNavbar from "@/components/landing/LandingNavbar";
import ScrollProgressBar from "@/components/landing/ScrollProgressBar";
import LandingHero from "@/components/landing/LandingHero";
import PricingSection from "@/components/landing/PricingSection";
import UseCasesSection from "@/components/landing/UseCasesSection";
import SolutionSection from "@/components/landing/SolutionSection";
import ProblemSection from "@/components/landing/ProblemSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import { FadeIn, Stagger, StaggerItem, MotionLink, RevealLine } from "@/components/motion";

/* ------------------------------------------------------------------ */
/*  Inline SVG icons (no external dependency)                         */
/* ------------------------------------------------------------------ */
function IconMic({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

function IconBrain({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
      <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
      <path d="M6 18a4 4 0 0 1-1.967-.516" />
      <path d="M19.967 17.484A4 4 0 0 1 18 18" />
    </svg>
  );
}

function IconChart({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
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

function IconArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Product demo video — the REAL /session page running the scripted   */
/*  demo (?demo=1), captured to /demo.mp4. Falls back to the static     */
/*  CopilotMockup if the video can't load.                             */
/* ------------------------------------------------------------------ */
function DemoVideo() {
  const [failed, setFailed] = useState(false);
  if (failed) return <CopilotMockup />;
  return (
    <div
      className="rounded-2xl overflow-hidden relative"
      style={{
        background: "rgba(10, 10, 14, 1)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        boxShadow: "0 40px 90px -30px rgba(0, 0, 0, 0.7)",
      }}
    >
      {/* Browser title bar — matches the app's real chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b" style={{ borderColor: "var(--color-border)", backgroundColor: "rgba(20,20,24,0.95)" }}>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#f87171" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#fbbf24" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#34d399" }} />
        </div>
        <div className="flex-1 mx-2 py-1 px-3 rounded-md text-[10px] text-center flex items-center justify-center gap-1.5" style={{ background: "rgba(255,255,255,0.04)", color: "var(--color-text-muted)" }}>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.4 }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          tonvo.co/session
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md shrink-0" style={{ background: "rgba(239,68,68,0.10)" }}>
          <div className="w-1.5 h-1.5 rounded-full pulse-positive" style={{ background: "#ef4444" }} />
          <span className="text-[8px] font-medium" style={{ color: "#ef4444" }}>LIVE</span>
        </div>
      </div>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        src="/demo.mp4"
        poster="/demo-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onError={() => setFailed(true)}
        style={{ display: "block", width: "100%", height: "auto" }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Copilot Overlay Mockup — meeting blurred in background,           */
/*  copilot panel front-and-center with premium glow                  */
/* ------------------------------------------------------------------ */
function CopilotMockup() {
  const { t } = useTranslation();
  return (
    <div
      className="rounded-2xl overflow-hidden relative"
      style={{
        background: "rgba(10, 10, 14, 1)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
      }}
    >
      {/* Browser title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b" style={{ borderColor: "var(--color-border)", backgroundColor: "rgba(20,20,24,0.95)" }}>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#f87171" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#fbbf24" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#34d399" }} />
        </div>
        <div className="flex-1 mx-2 py-1 px-3 rounded-md text-[10px] text-center flex items-center justify-center gap-1.5" style={{ background: "rgba(255,255,255,0.04)", color: "var(--color-text-muted)" }}>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.4 }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          meet.google.com/abc-defg-hij
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md shrink-0" style={{ background: "rgba(52,211,153,0.08)" }}>
          <div className="w-1.5 h-1.5 rounded-full pulse-positive" style={{ background: "#34d399" }} />
          <span className="text-[8px] font-medium" style={{ color: "#34d399" }}>Tonvo</span>
        </div>
      </div>

      {/* Meeting area with floating copilot */}
      <div className="relative" style={{ minHeight: 440 }}>
        {/* Meeting content — very light blur to push focus onto the copilot */}
        <div style={{ filter: "blur(1.5px) brightness(0.88)", WebkitFilter: "blur(1.5px) brightness(0.88)" }}>
        {/* 2x2 participant grid */}
        <div className="grid grid-cols-2 gap-2 p-2.5" style={{ minHeight: 370 }}>
          {[
            { name: t("mockup.you"), initial: "E", color: "#818cf8", status: t("mockup.speaking").toLowerCase(), wave: true },
            { name: "Sarah M.", initial: "S", color: "#34d399", status: t("mockup.listening"), wave: false },
            { name: "Marc D.", initial: "M", color: "#fbbf24", status: t("mockup.muted"), wave: false },
            { name: "Lisa K.", initial: "L", color: "#f87171", status: t("mockup.muted"), wave: false },
          ].map((p) => (
            <div key={p.name} className="rounded-xl flex flex-col items-center justify-center relative" style={{ background: "linear-gradient(160deg, rgba(28,28,36,0.95), rgba(18,18,24,1))", border: "1px solid rgba(255,255,255,0.04)" }}>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-lg font-bold mb-2" style={{ background: `linear-gradient(135deg, ${p.color}24, ${p.color}08)`, color: p.color, border: `1px solid ${p.color}1a` }}>{p.initial}</div>
              <span className="text-[11px] font-medium" style={{ color: "var(--color-text)" }}>{p.name}</span>
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-md" style={{ background: "rgba(0,0,0,0.6)" }}>
                {p.wave && <div className="flex items-end gap-0.5" style={{ height: 10 }}>{[1,2,3].map(i => <div key={i} className="audio-wave-bar" style={{ animationDelay: `${i*0.12}s`, height: 8, width: 2 }} />)}</div>}
                <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.4)" }}>{p.wave ? t("mockup.speaking") : p.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Meeting bottom controls */}
        <div className="flex items-center justify-center gap-3 py-2.5 border-t" style={{ borderColor: "rgba(255,255,255,0.04)", background: "rgba(14,14,18,0.9)" }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text)" strokeWidth="1.8"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /></svg>
          </div>
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text)" strokeWidth="1.8"><path d="m22 8-6 4 6 4V8Z" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>
          </div>
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(52,211,153,0.12)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.8"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg>
          </div>
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(248,113,113,0.15)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.09 5.11 2 2 0 0 1 5.11 3h3a2 2 0 0 1 2 1.72c.13.81.36 1.61.68 2.37a2 2 0 0 1-.45 2.11L8.09 11.45a16 16 0 0 0 6.46 6.46l2.25-2.25a2 2 0 0 1 2.11-.45c.76.32 1.56.55 2.37.68A2 2 0 0 1 22 16.92z" /></svg>
          </div>
          <span className="text-[10px] ml-2 tabular-nums" style={{ color: "var(--color-text-muted)" }}>14:23</span>
        </div>

        </div>{/* end blur wrapper */}

        {/* Floating Copilot — bottom-right, exactly like real usage */}
        {/* Subtle glow behind */}
        <div className="absolute hidden sm:block pointer-events-none" style={{ bottom: 50, right: 4, width: 280, height: 350, background: "radial-gradient(ellipse at center, rgba(52,211,153,0.05) 0%, rgba(129,140,248,0.03) 40%, transparent 75%)", filter: "blur(40px)", WebkitFilter: "blur(40px)" }} />

        <div
          className="absolute bottom-12 right-2.5 sm:right-3 flex flex-col gap-2"
          style={{
            width: "min(280px, 50%)",
            background: "rgba(10, 10, 14, 0.95)",
            backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 18,
            boxShadow: "0 24px 64px rgba(0,0,0,0.55), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
            padding: "10px 12px",
            animation: "copilotSlideIn 0.35s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full pulse-positive" style={{ backgroundColor: "#34d399" }} />
              <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--color-text)" }}>{t("mockup.aiCopilot")}</span>
              <span className="text-[9px] tabular-nums" style={{ color: "var(--color-text-muted)" }}>14:23</span>
            </div>
            <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded-md" style={{ background: "rgba(52,211,153,0.12)", color: "#34d399" }}>{t("mockup.positive").toLowerCase()}</span>
          </div>

          {/* Compact scores */}
          <div className="flex items-center justify-center gap-4 py-1.5 border-t border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <div className="text-center">
              <div className="text-[7px] uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>{t("mockup.quality")}</div>
              <div className="text-sm font-bold" style={{ color: "#34d399" }}>84</div>
            </div>
            <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.06)" }} />
            <div className="text-center">
              <div className="text-[7px] uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>{t("mockup.engage")}</div>
              <div className="text-sm font-bold" style={{ color: "#34d399" }}>91</div>
            </div>
            <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.06)" }} />
            <div className="text-center">
              <div className="text-[7px] uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>{t("mockup.balance")}</div>
              <div className="flex gap-px mt-0.5" style={{ height: 3, width: 32 }}>
                <div style={{ width: "55%", background: "#818cf8", borderRadius: 2 }} />
                <div style={{ width: "45%", background: "#c8c8d8", borderRadius: 2 }} />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            <div className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-[9px] font-semibold" style={{ background: "rgba(255,255,255,0.07)", color: "var(--color-text)" }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              {t("mockup.sayThis")}
              <span className="text-[7px] font-bold px-1 rounded-full" style={{ background: "rgba(52,211,153,0.2)", color: "#34d399" }}>3</span>
            </div>
            <div className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-[9px]" style={{ color: "var(--color-text-muted)" }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
              {t("mockup.coaching")}
            </div>
          </div>

          {/* Response cards */}
          <div className="flex flex-col gap-1.5">
            <div className="rounded-xl p-2" style={{ background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.15)" }}>
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-[8px]">💬</span>
                <span className="text-[7px] font-bold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>{t("mockup.showEmpathy")}</span>
              </div>
              <p className="text-[10px] leading-snug m-0" style={{ color: "var(--color-text)" }}>{t("mockup.showEmpathyText")}</p>
            </div>
            <div className="rounded-xl p-2" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-[8px]">🎯</span>
                <span className="text-[7px] font-bold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>{t("mockup.proposeAction")}</span>
              </div>
              <p className="text-[10px] leading-snug m-0" style={{ color: "var(--color-text-silver)" }}>{t("mockup.proposeActionText")}</p>
            </div>
            <div className="rounded-xl p-2" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-[8px]">🔍</span>
                <span className="text-[7px] font-bold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>{t("mockup.probeDeeper")}</span>
              </div>
              <p className="text-[10px] leading-snug m-0" style={{ color: "var(--color-text-silver)" }}>{t("mockup.probeDeeperText")}</p>
            </div>
          </div>

          {/* Signals */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[7px] font-medium" style={{ background: "rgba(251,191,36,0.1)", color: "#fbbf24" }}>
              <span className="w-1 h-1 rounded-full" style={{ background: "#fbbf24" }} />
              {t("mockup.hesitation")}
            </div>
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[7px] font-medium" style={{ background: "rgba(52,211,153,0.1)", color: "#34d399" }}>
              <span className="w-1 h-1 rounded-full" style={{ background: "#34d399" }} />
              {t("mockup.opportunity")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Landing page                                                      */
/* ------------------------------------------------------------------ */
export default function HomePage() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const router = useRouter();
  const ctaHref = "/login";

  /* Authenticated user → skip landing, go straight to dashboard */
  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  /* Disable browser scroll restoration and force scroll to top */
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  /* Don't render landing content while auth is resolving or user is logged in */
  if (loading || user) return null;

  const features = [
    {
      icon: <IconMic className="w-5 h-5" />,
      title: t("landing.features.liveTone"),
      desc: t("landing.features.liveToneDesc"),
      color: "var(--color-positive)",
    },
    {
      icon: <IconBrain className="w-5 h-5" />,
      title: t("landing.features.smartSuggestions"),
      desc: t("landing.features.smartSuggestionsDesc"),
      color: "var(--color-accent-light)",
    },
    {
      icon: <IconChart className="w-5 h-5" />,
      title: t("landing.features.conversationInsights"),
      desc: t("landing.features.conversationInsightsDesc"),
      color: "var(--color-neutral)",
    },
    {
      icon: <IconMessageCircle className="w-5 h-5" />,
      title: t("landing.features.textAnalysis"),
      desc: t("landing.features.textAnalysisDesc"),
      color: "var(--color-text-silver)",
    },
  ];

  return (
    <>
      {/* ── Scroll progress (GPU scaleX, sits above the navbar) ── */}
      <ScrollProgressBar />

      {/* ── Navbar (client component: scroll behavior + auth) ── */}
      <LandingNavbar />

      <main>
        {/* Hero + Now-in-desktop share a single continuous grid backdrop —
            wrapped together so lines stay aligned across the section boundary,
            and the grid ends exactly where this group ends (no bleed into the
            sections below). */}
        <div className="relative">
          {/* Horizon backdrop — sits under the grid, fades back to --color-bg
              at the section boundary. See .hero-bg in globals.css. */}
          <div aria-hidden className="hero-bg" />
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none grid-bg"
          />
          {/* ── Hero (client component: auth redirect + CurtainIntro) ── */}
          <LandingHero />

          {/* ── Desktop download CTA removed from the landing for now (Microsoft
                 verification pending). To bring it back, re-import DesktopDownloadHero
                 from "@/components/landing/DesktopDownloadHero" and render it here. ── */}
        </div>

        {/* ── Divider ── */}
        <RevealLine className="glow-line max-w-2xl mx-auto" />

        {/* ── Problem / The Cost of Not Winning (client component: scan + word reveal) ── */}
        <ProblemSection />

        {/* ── Solution / The Growth Engine (client component: scroll-driven motion) ── */}
        <SolutionSection />

        {/* ── Features ── */}
        <section id="features" className="py-16 sm:py-24 md:py-32 overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <span className="section-label">{t("landing.features.label")}</span>
              <AnimatedTitle variant="right" className="section-heading">
                {t("landing.features.heading1")}
                <br />
                <span className="text-silver-sweep">{t("landing.features.heading2")}</span>
              </AnimatedTitle>
            </div>
          </div>

          {/* Horizontal scroll: marquee on desktop, swipe on mobile */}
          <div className="features-scroll-wrapper">
            <div className="features-scroll-fade features-scroll-fade--left" />
            <div className="features-scroll-fade features-scroll-fade--right" />
            <div className="features-scroll">
              {/* Render cards twice for seamless marquee loop on desktop */}
              {[...features, ...features].map((f, i) => (
                <div key={`${f.title}-${i}`} className="glass-card p-6 features-scroll-card" aria-hidden={i >= features.length ? true : undefined}>
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: "var(--color-surface-2)", color: f.color }}
                  >
                    {f.icon}
                  </div>
                  <h3 className="card-title mb-2">{f.title}</h3>
                  <p className="text-sm leading-relaxed m-0" style={{ color: "var(--color-text-muted)" }}>
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Divider ── */}
        <RevealLine className="glow-line max-w-2xl mx-auto" />

        {/* ── Product Demo ── */}
        <section id="demo" className="px-4 sm:px-6 py-16 sm:py-24 md:py-32">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <FadeIn as="span" className="section-label" y={12} duration={0.5}>
                {t("landing.demo.label")}
              </FadeIn>
              <AnimatedTitle variant="soft" className="section-heading text-glow mb-4">
                {t("landing.demo.heading")}
              </AnimatedTitle>
              <FadeIn as="p" className="body-muted max-w-lg mx-auto" delay={0.12}>
                {t("landing.demo.desc")}
              </FadeIn>
            </div>

            <FadeIn className="mockup-container mockup-enter" y={32} duration={0.85} delay={0.05}>
              <div className="mockup-lift">
                <DemoVideo />
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── Use Cases (client component: framer-motion) ── */}
        <UseCasesSection />

        {/* ── Divider ── */}
        <RevealLine className="glow-line max-w-2xl mx-auto" />

        {/* ── Testimonials / Results-driven proof (client component: KPI counters + spotlight) ── */}
        <TestimonialsSection />

        {/* ── Pricing (client component: billing toggle + auth) ── */}
        <PricingSection />

        {/* ── Divider ── */}
        <RevealLine className="glow-line max-w-2xl mx-auto" />

        {/* ── Final CTA ── */}
        <section className="px-4 sm:px-6 py-16 sm:py-24 md:py-32 relative overflow-hidden">
          <div className="hero-glow" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 700, height: 700 }} />

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <div className="flex justify-center gap-3 mb-8">
              <div className="w-3 h-3 rounded-full pulse-positive" style={{ backgroundColor: "var(--color-positive)" }} />
              <div className="w-3 h-3 rounded-full pulse-neutral" style={{ backgroundColor: "var(--color-neutral)" }} />
              <div className="w-3 h-3 rounded-full pulse-negative" style={{ backgroundColor: "var(--color-negative)" }} />
            </div>

            <AnimatedTitle variant="lift" className="hero-heading text-glow mb-6" style={{ fontSize: "clamp(1.875rem, 5vw, 3rem)" }}>
              {t("landing.cta.heading1")}
              <br />
              <span className="text-shimmer">{t("landing.cta.heading2")}</span>
            </AnimatedTitle>

            <p className="body-muted text-lg mb-10 max-w-lg mx-auto">
              {t("landing.cta.desc")}
            </p>

            <MotionLink
              href={ctaHref}
              className="relative overflow-hidden inline-flex items-center gap-3 px-7 sm:px-9 py-4 text-base no-underline rounded-full font-semibold"
              style={{
                background:
                  "linear-gradient(135deg, rgba(52, 211, 153, 0.22) 0%, rgba(52, 211, 153, 0.06) 100%)",
                border: "1px solid rgba(52, 211, 153, 0.4)",
                boxShadow:
                  "0 28px 70px -22px rgba(52, 211, 153, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
                color: "var(--color-text)",
                minHeight: 56,
              }}
            >
              <span className="relative z-10 inline-flex items-center gap-2">
                {t("landing.cta.button")}
                <IconArrowRight />
              </span>
            </MotionLink>

            <FadeIn as="p" className="text-xs mt-6" style={{ color: "var(--color-text-muted)" }} delay={0.18} y={8}>
              {t("landing.cta.note")}
            </FadeIn>
          </div>
        </section>

        {/* ── SEO: FAQ Section (for Google Featured Snippets) ── */}
        <section id="faq" className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <FadeIn as="h2" className="text-2xl sm:text-3xl font-bold text-center mb-3" style={{ color: "var(--color-text)" }}>
              {t("landing.faq.title")}
            </FadeIn>
            <FadeIn as="p" className="text-sm text-center mb-12" style={{ color: "var(--color-text-muted)" }} delay={0.1}>
              {t("landing.faq.subtitle")}
            </FadeIn>

            <Stagger className="space-y-4" stagger={0.06} amount={0.1}>
              {[
                { q: t("landing.faq.q1"), a: t("landing.faq.a1") },
                { q: t("landing.faq.q2"), a: t("landing.faq.a2") },
                { q: t("landing.faq.q3"), a: t("landing.faq.a3") },
                { q: t("landing.faq.q4"), a: t("landing.faq.a4") },
                { q: t("landing.faq.q5"), a: t("landing.faq.a5") },
                { q: t("landing.faq.q6"), a: t("landing.faq.a6") },
              ].map((item, i) => (
                <StaggerItem key={i}>
                  <details
                    className="rounded-xl border group"
                    style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
                  >
                    <summary
                      className="flex items-center justify-between cursor-pointer px-6 py-4 text-sm font-semibold list-none"
                      style={{ color: "var(--color-text)" }}
                    >
                      {item.q}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 ml-4 transition-transform group-open:rotate-180" style={{ color: "var(--color-text-muted)" }}><path d="m6 9 6 6 6-6" /></svg>
                    </summary>
                    <p className="px-6 pb-4 pt-0 m-0 text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                      {item.a}
                    </p>
                  </details>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer
          className="border-t px-6 py-12"
          style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {/* Brand */}
              <div className="col-span-2 md:col-span-1">
                <div className="mb-4">
                  <TonvoLogo size="sm" />
                </div>
                <p className="text-xs leading-relaxed m-0" style={{ color: "var(--color-text-muted)" }}>
                  {t("footer.tagline1")}
                  <br />
                  {t("footer.tagline2")}
                </p>
              </div>

              {/* Product */}
              <div>
                <h4 className="footer-heading">
                  {t("footer.product")}
                </h4>
                <ul className="list-none p-0 m-0 space-y-2.5">
                  <li><a href="#features" className="footer-link">{t("footer.features")}</a></li>
                  <li><a href="#demo" className="footer-link">{t("footer.demo")}</a></li>
                  <li><a href="#use-cases" className="footer-link">{t("footer.useCases")}</a></li>
                  <li><a href="#faq" className="footer-link">{t("footer.faq")}</a></li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="footer-heading">
                  {t("footer.company")}
                </h4>
                <ul className="list-none p-0 m-0 space-y-2.5">
                  <li><Link href="/about" className="footer-link">{t("footer.about")}</Link></li>
                  <li><Link href="/blog" className="footer-link">{t("footer.blog")}</Link></li>
                  <li><a href="mailto:tonvo.sales@gmail.com" className="footer-link">{t("footer.contact")}</a></li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="footer-heading">
                  {t("footer.resources")}
                </h4>
                <ul className="list-none p-0 m-0 space-y-2.5">
                  <li><Link href="/use-cases" className="footer-link">{t("footer.useCases")}</Link></li>
                  <li><Link href="/features" className="footer-link">{t("footer.features")}</Link></li>
                  <li><Link href="/industries" className="footer-link">{t("footer.industries")}</Link></li>
                  <li><Link href="/compare" className="footer-link">{t("footer.comparisons")}</Link></li>
                  <li><Link href="/guides" className="footer-link">{t("footer.guides")}</Link></li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="footer-heading">
                  {t("footer.legal")}
                </h4>
                <ul className="list-none p-0 m-0 space-y-2.5">
                  <li><Link href="/privacy" className="footer-link">{t("footer.privacyPolicy")}</Link></li>
                  <li><Link href="/terms" className="footer-link">{t("footer.termsOfService")}</Link></li>
                  <li><Link href="/cookies" className="footer-link">{t("footer.cookiePolicy")}</Link></li>
                  <li><Link href="/legal" className="footer-link">{t("footer.legalNotice")}</Link></li>
                </ul>
              </div>
            </div>

            <div className="glow-line mb-8" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs m-0" style={{ color: "var(--color-text-muted)" }}>
                {t("footer.copyright")}
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import CurtainIntro from "@/components/CurtainIntro";
import AnimatedTitle from "@/components/AnimatedTitle";
import TonvoLogo from "@/components/Logo";
import { PRICING_PLANS, ANNUAL_DISCOUNT_PERCENT } from "@/lib/pricing-config";

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

function IconShield({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconZap({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  );
}

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

function IconArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Mock UI component for the product demo section                    */
/* ------------------------------------------------------------------ */
function ProductMockup() {
  const segments = [
    { text: "I think the quarterly results look promising, we should discuss the next steps.", tone: "positive" as const, time: "00:32" },
    { text: "I'm not sure about the timeline though, it feels a bit aggressive.", tone: "hesitant" as const, time: "01:15" },
    { text: "That's a fair point. Let me adjust the roadmap and share an update.", tone: "positive" as const, time: "01:48" },
  ];

  const toneColors = {
    positive: "var(--color-positive)",
    neutral: "var(--color-neutral)",
    negative: "var(--color-negative)",
    hesitant: "var(--color-neutral)",
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "rgba(17, 17, 20, 0.7)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(255, 255, 255, 0.06)" }}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-5 py-3 border-b"
        style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface-2)" }}
      >
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--color-negative)" }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--color-neutral)" }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--color-positive)" }} />
        </div>
        <span className="text-xs ml-2" style={{ color: "var(--color-text-muted)" }}>Tonvo - Live Session</span>
      </div>

      {/* Status bar */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-2.5 h-2.5 rounded-full pulse-positive" style={{ backgroundColor: "var(--color-positive)" }} />
          <span className="text-sm font-medium shrink-0" style={{ color: "var(--color-positive)" }}>Positive</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>02:34</span>
          <div className="flex items-end gap-1" style={{ height: 24 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="audio-wave-bar"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Suggestion */}
      <div className="px-5 py-3 border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: "var(--color-accent-light)" }}>
          Suggestion
        </div>
        <p className="text-sm m-0" style={{ color: "var(--color-text-silver)" }}>
          Good momentum. Build on their openness by proposing a concrete next step.
        </p>
      </div>

      {/* Transcript */}
      <div>
        {segments.map((seg, i) => (
          <div
            key={i}
            className="flex items-start gap-3 px-5 py-3 border-b last:border-b-0"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div
              className="w-2 h-2 rounded-full mt-1.5 shrink-0"
              style={{ backgroundColor: toneColors[seg.tone] }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm m-0 leading-relaxed" style={{ color: "var(--color-text)" }}>{seg.text}</p>
              <span className="text-xs mt-1 block" style={{ color: "var(--color-text-muted)" }}>{seg.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Landing page                                                      */
/* ------------------------------------------------------------------ */
export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [annual, setAnnual] = useState(false);

  // --- Smart navbar scroll behavior ---
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const handleScroll = useCallback(() => {
    if (ticking.current) return;
    ticking.current = true;

    requestAnimationFrame(() => {
      const currentY = window.scrollY;
      const heroThreshold = window.innerHeight * 0.4;

      if (currentY <= heroThreshold) {
        // Always show in hero section
        setNavVisible(true);
      } else if (currentY < lastScrollY.current) {
        // Scrolling up -> show
        setNavVisible(true);
      } else if (currentY > lastScrollY.current + 5) {
        // Scrolling down (with 5px dead zone to prevent flicker) -> hide
        setNavVisible(false);
      }

      lastScrollY.current = currentY;
      ticking.current = false;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);
  // --- End smart navbar ---

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  // While checking auth or redirecting, show nothing
  if (loading || user) return null;

  const ctaHref = "/login";
  const ctaLabel = "Get Started";

  const features = [
    {
      icon: <IconMic className="w-5 h-5" />,
      title: "Live Tone Detection",
      desc: "Captures audio from your calls or mic and detects whether the conversation is trending positive, neutral, or tense -- in real time.",
      color: "var(--color-positive)",
    },
    {
      icon: <IconBrain className="w-5 h-5" />,
      title: "Smart Suggestions",
      desc: "Based on what's being said and how it's being said, Tonvo suggests what to say next to keep the conversation on track.",
      color: "var(--color-accent-light)",
    },
    {
      icon: <IconChart className="w-5 h-5" />,
      title: "Conversation Insights",
      desc: "After every session, get a breakdown of tone shifts, key moments, and a summary with actionable takeaways.",
      color: "var(--color-neutral)",
    },
    {
      icon: <IconMessageCircle className="w-5 h-5" />,
      title: "Text Analysis",
      desc: "Paste any message or conversation snippet to instantly understand the underlying tone and get improvement suggestions.",
      color: "var(--color-text-silver)",
    },
  ];

  const benefits = [
    { value: "Real-time", label: "Feedback during live conversations" },
    { value: "3 clicks", label: "To start analyzing any conversation" },
    { value: "Actionable", label: "Suggestions you can use immediately" },
    { value: "Private", label: "Audio processed locally, never stored" },
  ];

  const useCases = [
    {
      icon: <IconUsers className="w-6 h-6" />,
      title: "Sales Calls",
      desc: "Know when a prospect is engaged, hesitant, or losing interest. Adjust your pitch in the moment, not after the deal is lost.",
    },
    {
      icon: <IconMessageCircle className="w-6 h-6" />,
      title: "Customer Support",
      desc: "Detect frustration early and get suggestions to de-escalate. Turn difficult interactions into positive experiences.",
    },
    {
      icon: <IconShield className="w-6 h-6" />,
      title: "Job Interviews",
      desc: "Whether you're the interviewer or the candidate, understand the emotional dynamics and communicate more effectively.",
    },
    {
      icon: <IconZap className="w-6 h-6" />,
      title: "Team Meetings",
      desc: "Track engagement across long meetings. Identify when energy drops and get cues to re-engage your audience.",
    },
  ];

  const testimonials = [
    {
      name: "Claire Dupont",
      role: "Senior Account Executive",
      company: "Salesforce",
      text: "I noticed I was talking over prospects without realizing it. Tonvo showed me exactly when I was losing them — my close rate went up 15% in two months just by listening more.",
      initials: "CD",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      name: "Marc Lefèvre",
      role: "Engineering Manager",
      company: "Datadog",
      text: "We use it for 1-on-1s. It's subtle — you don't notice it during the call, but the post-meeting summary catches things I would have missed. Saved me from two difficult situations already.",
      initials: "ML",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      name: "Nina Rossi",
      role: "Customer Success Lead",
      company: "HubSpot",
      text: "The real-time suggestions actually make sense. It's not generic tips — it picks up on the specific conversation and gives you something you can use right then.",
      initials: "NR",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      name: "James Okafor",
      role: "Freelance Consultant",
      text: "I was skeptical, honestly. But after a week I realized I was preparing less for calls and getting better outcomes. It just helps you stay present.",
      initials: "JO",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
  ];

  return (
    <>
      <CurtainIntro />
      {/* ── Navbar ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{
          backgroundColor: "rgba(9, 9, 11, 0.85)",
          backdropFilter: "blur(12px)",
          borderColor: "var(--color-border)",
          transform: navVisible ? "translateY(0)" : "translateY(-100%)",
          opacity: navVisible ? 1 : 0,
          transition: "transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.25s ease",
          willChange: "transform, opacity",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center no-underline">
            <TonvoLogo size="md" />
          </Link>

          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <a href="#features" className="text-sm no-underline transition-colors hover:opacity-80" style={{ color: "var(--color-text-muted)" }}>Features</a>
            <a href="#demo" className="text-sm no-underline transition-colors hover:opacity-80" style={{ color: "var(--color-text-muted)" }}>Product</a>
            <a href="#use-cases" className="text-sm no-underline transition-colors hover:opacity-80" style={{ color: "var(--color-text-muted)" }}>Use Cases</a>
            <a href="#pricing" className="text-sm no-underline transition-colors hover:opacity-80" style={{ color: "var(--color-text-muted)" }}>Pricing</a>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="text-sm no-underline px-5 py-2 rounded-lg font-medium text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: "var(--color-accent)" }}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm no-underline px-4 py-2 rounded-lg transition-colors hover:opacity-80"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Sign In
                </Link>
                <Link
                  href="/login"
                  className="text-sm no-underline px-5 py-2 rounded-lg font-medium text-white transition-colors hover:opacity-90"
                  style={{ backgroundColor: "var(--color-accent)" }}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main>
        {/* ── Hero ── */}
        <section className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center px-4 sm:px-6 pt-16 overflow-hidden grid-bg">
          {/* Ambient glows */}
          <div className="hero-glow" style={{ top: "-10%", left: "50%", transform: "translateX(-50%)" }} />
          <div className="hero-glow" style={{ bottom: "-20%", left: "-10%", width: 400, height: 400, background: "radial-gradient(circle, rgba(52, 211, 153, 0.04) 0%, transparent 70%)" }} />
          <div className="hero-glow" style={{ top: "30%", right: "-10%", width: 350, height: 350, background: "radial-gradient(circle, rgba(200, 200, 216, 0.04) 0%, transparent 70%)" }} />

          <div className="relative z-10 max-w-3xl text-center">
            {/* Status badge */}
            <div className="animate-fade-up flex justify-center mb-8">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium"
                style={{ background: "rgba(200, 200, 216, 0.06)", border: "1px solid rgba(200, 200, 216, 0.12)", color: "var(--color-accent-light)" }}
              >
                <div className="w-2 h-2 rounded-full pulse-positive" style={{ backgroundColor: "var(--color-positive)" }} />
                Conversation Intelligence, Reimagined
              </div>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-up animate-delay-100 hero-heading text-glow mb-6">
              Read the room.
              <br />
              <span className="text-shimmer">Before it reads you.</span>
            </h1>

            {/* Subtitle */}
            <p className="animate-fade-up animate-delay-200 body-muted text-lg md:text-xl mb-10 max-w-xl mx-auto">
              Tonvo analyzes your conversations in real time -- detecting sentiment,
              surfacing smart suggestions, and helping you navigate every interaction with confidence.
            </p>

            {/* CTA */}
            <div className="animate-fade-up animate-delay-300 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href={ctaHref}
                className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-base no-underline"
              >
                {ctaLabel}
                <IconArrowRight />
              </Link>
              <a
                href="#demo"
                className="btn-secondary inline-flex items-center gap-2 px-8 py-3.5 text-base no-underline"
              >
                See How It Works
              </a>
            </div>

            {/* Social proof */}
            <div className="animate-fade-up animate-delay-500 flex items-center justify-center gap-4 mt-16 px-5 py-3 rounded-full" style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
              <div className="flex -space-x-2">
                {[
                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                ].map((bg, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-semibold text-white"
                    style={{ background: bg, border: "2px solid var(--color-bg)", boxShadow: "0 0 0 1px rgba(255,255,255,0.08)" }}
                  >
                    {["C", "M", "N", "J"][i]}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <p className="text-[13px] m-0 font-medium" style={{ color: "var(--color-text-silver)" }}>
                  Trusted by 2,400+ professionals
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="glow-line max-w-2xl mx-auto" />

        {/* ── Problem ── */}
        <section className="px-4 sm:px-6 py-16 sm:py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <span className="section-label">The problem</span>
            <AnimatedTitle variant="up" className="section-heading text-glow mb-6">
              Conversations are hard.
              <br />
              <span className="text-silver-gradient">Misreading them is easy.</span>
            </AnimatedTitle>
            <p className="body-muted max-w-2xl mx-auto">
              You've been on that call where everything seemed fine -- until it wasn't.
              A prospect went cold. A colleague got frustrated. A candidate shut down.
              By the time you noticed, it was already too late to fix it.
            </p>
            <p className="body-muted max-w-2xl mx-auto mt-4">
              Most people miss the subtle shifts in tone and emotion that make or break conversations.
              Not because they don't care, but because they're focused on what to say next.
            </p>
          </div>
        </section>

        {/* ── Solution ── */}
        <section className="px-4 sm:px-6 py-16 sm:py-24 md:py-32" style={{ backgroundColor: "var(--color-surface)" }}>
          <div className="max-w-3xl mx-auto text-center">
            <span className="section-label">The solution</span>
            <AnimatedTitle variant="left" className="section-heading text-glow mb-6">
              A second pair of eyes.
              <br />
              <span className="text-silver-gradient">For every conversation.</span>
            </AnimatedTitle>
            <p className="body-muted max-w-2xl mx-auto">
              Tonvo runs alongside your calls and meetings. It captures the audio, analyzes the emotional dynamics in real time,
              and gives you quiet, contextual suggestions -- so you always know where the conversation stands
              and what to do next.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
              {[
                { step: "01", title: "Start a session", desc: "One click. Tonvo captures audio from your screen or microphone." },
                { step: "02", title: "Get live feedback", desc: "Tone indicators and suggestions update as the conversation flows." },
                { step: "03", title: "Review insights", desc: "After the call, get a full breakdown with key moments and takeaways." },
              ].map((item) => (
                <div key={item.step} className="text-left">
                  <div className="text-xs font-bold mb-3 text-silver-sweep" style={{ display: "inline-block" }}>
                    {item.step}
                  </div>
                  <h3 className="card-title text-lg mb-2">{item.title}</h3>
                  <p className="text-sm leading-relaxed m-0" style={{ color: "var(--color-text-muted)" }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="px-4 sm:px-6 py-16 sm:py-24 md:py-32">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="section-label">Features</span>
              <AnimatedTitle variant="right" className="section-heading">
                Everything you need to
                <br />
                <span className="text-silver-sweep">understand conversations.</span>
              </AnimatedTitle>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="glass-card p-6"
                >
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
        <div className="glow-line max-w-2xl mx-auto" />

        {/* ── Product Demo ── */}
        <section id="demo" className="px-4 sm:px-6 py-16 sm:py-24 md:py-32">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="section-label">Product</span>
              <AnimatedTitle variant="soft" className="section-heading text-glow mb-4">
                See Tonvo in action
              </AnimatedTitle>
              <p className="body-muted max-w-lg mx-auto">
                This is what a live session looks like. Tone detection, smart suggestions, and a running transcript -- all updating in real time.
              </p>
            </div>

            <div className="mockup-container mockup-enter">
              <div className="mockup-lift">
                <ProductMockup />
              </div>
            </div>
          </div>
        </section>

        {/* ── Benefits ── */}
        <section className="px-4 sm:px-6 py-16 sm:py-24 md:py-32" style={{ backgroundColor: "var(--color-surface)" }}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="section-label">Benefits</span>
              <AnimatedTitle variant="soft" className="section-heading">
                Built for people who talk to people.
              </AnimatedTitle>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              {benefits.map((b) => (
                <div key={b.value} className="glass-card p-4 sm:p-6 text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl mb-2 metric-text">{b.value}</div>
                  <p className="text-sm m-0" style={{ color: "var(--color-text-muted)" }}>{b.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Use Cases ── */}
        <section id="use-cases" className="px-4 sm:px-6 py-16 sm:py-24 md:py-32">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="section-label">Use Cases</span>
              <AnimatedTitle variant="left" className="section-heading">
                Works wherever conversations matter.
              </AnimatedTitle>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {useCases.map((uc) => (
                <div
                  key={uc.title}
                  className="glass-card p-6"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: "var(--color-surface-2)", color: "var(--color-accent-light)" }}
                  >
                    {uc.icon}
                  </div>
                  <h3 className="card-title mb-2">{uc.title}</h3>
                  <p className="text-sm leading-relaxed m-0" style={{ color: "var(--color-text-muted)" }}>
                    {uc.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="glow-line max-w-2xl mx-auto" />

        {/* ── Testimonials ── */}
        <section className="px-4 sm:px-6 py-16 sm:py-24 md:py-32">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="section-label">What people say</span>
              <AnimatedTitle variant="right" className="section-heading">
                Real feedback from real users.
              </AnimatedTitle>
              <p className="body-muted max-w-md mx-auto mt-4">
                Professionals across sales, management, and consulting use Tonvo to improve the way they communicate.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="glass-card p-7 flex flex-col justify-between"
                >
                  {/* Quote icon */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mb-4 opacity-20">
                    <path d="M10 11H6C6 7.686 8.686 5 12 5v2c-2.206 0-4 1.794-4 4h2a2 2 0 012 2v2a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm10 0h-4c0-3.314 2.686-6 6-6v2c-2.206 0-4 1.794-4 4h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" fill="var(--color-accent-light)" />
                  </svg>
                  <p className="text-[15px] leading-relaxed mb-6" style={{ color: "var(--color-text-silver)" }}>
                    {t.text}
                  </p>
                  <div className="flex items-center gap-3 mt-auto pt-4" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
                      style={{ background: t.gradient }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{t.name}</div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                        {t.role}{t.company ? ` · ${t.company}` : ""}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="px-4 sm:px-6 py-16 sm:py-24 md:py-32" style={{ backgroundColor: "var(--color-surface)" }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="section-label">Pricing</span>
              <AnimatedTitle variant="left" className="section-heading text-glow mb-4">
                Simple, transparent pricing.
              </AnimatedTitle>
              <p className="body-muted max-w-lg mx-auto mb-8">
                Start free. Upgrade when you need more power.
              </p>

              {/* Billing toggle */}
              <div className="inline-flex items-center gap-3 px-1.5 py-1.5 rounded-full" style={{ background: "rgba(255, 255, 255, 0.04)", border: "1px solid var(--color-border)" }}>
                <button
                  onClick={() => setAnnual(false)}
                  className="px-5 py-2 rounded-full text-sm font-medium border-none cursor-pointer transition-all"
                  style={{
                    background: !annual ? "rgba(200, 200, 216, 0.12)" : "transparent",
                    color: !annual ? "var(--color-text)" : "var(--color-text-muted)",
                  }}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setAnnual(true)}
                  className="px-5 py-2 rounded-full text-sm font-medium border-none cursor-pointer transition-all flex items-center gap-2"
                  style={{
                    background: annual ? "rgba(200, 200, 216, 0.12)" : "transparent",
                    color: annual ? "var(--color-text)" : "var(--color-text-muted)",
                  }}
                >
                  Annual
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(52, 211, 153, 0.12)",
                      color: "var(--color-positive)",
                      border: "1px solid rgba(52, 211, 153, 0.2)",
                    }}
                  >
                    -{ANNUAL_DISCOUNT_PERCENT}%
                  </span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {PRICING_PLANS.map((plan) => {
                const isFree = plan.monthlyPrice === 0;
                const isTeam = plan.id === "team";
                const displayPrice = isFree
                  ? "$0"
                  : annual
                    ? `$${plan.monthlyEquivalent}`
                    : `$${plan.monthlyPrice}`;

                return (
                  <div
                    key={plan.id}
                    className="glass-card p-7 flex flex-col relative"
                    style={{
                      minHeight: 420,
                      ...(plan.popular
                        ? {
                            borderColor: "rgba(200, 200, 216, 0.25)",
                            boxShadow: "0 0 60px rgba(200, 200, 216, 0.05), 0 8px 32px rgba(0, 0, 0, 0.3)",
                          }
                        : {}),
                    }}
                  >
                    {plan.popular && (
                      <div
                        className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-3.5 py-1 rounded-full"
                        style={{ background: "linear-gradient(135deg, #5c5c6e, #6e6e82)", color: "white" }}
                      >
                        Most Popular
                      </div>
                    )}
                    <div className="mb-6">
                      <h3 className="text-lg font-bold mb-1" style={{ color: "var(--color-text)" }}>{plan.name}</h3>
                      <p className="text-xs mb-5" style={{ color: "var(--color-text-muted)" }}>{plan.description}</p>
                      <div className="flex items-baseline gap-1" style={{ minHeight: 48 }}>
                        {annual && !isFree && (
                          <span
                            className="text-lg line-through mr-1 transition-opacity duration-200"
                            style={{ color: "var(--color-text-muted)" }}
                          >
                            ${plan.monthlyPrice}
                          </span>
                        )}
                        <span className="text-4xl font-bold" style={{ color: "var(--color-text)", minWidth: 56, display: "inline-block" }}>
                          {displayPrice}
                        </span>
                        {plan.period && (
                          <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>{plan.period}</span>
                        )}
                      </div>
                    </div>
                    <ul className="flex-1 space-y-3 mb-8" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--color-text-silver)" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={plan.popular ? "var(--color-positive)" : "var(--color-accent-light)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                    {isFree ? (
                      user ? (
                        <div
                          className="w-full py-3 rounded-xl font-semibold text-sm text-center"
                          style={{ background: "rgba(52, 211, 153, 0.08)", color: "var(--color-positive)", border: "1px solid rgba(52, 211, 153, 0.2)" }}
                        >
                          Current Plan
                        </div>
                      ) : (
                        <Link
                          href="/login"
                          className="btn-secondary w-full py-3 rounded-xl font-semibold text-sm text-center no-underline block"
                        >
                          {plan.cta}
                        </Link>
                      )
                    ) : (
                      <Link
                        href={user ? "/pricing" : "/login"}
                        className={`${plan.popular ? "btn-primary" : "btn-secondary"} w-full py-3 rounded-xl font-semibold text-sm text-center no-underline block`}
                      >
                        {user ? plan.cta : "Get Started"}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="text-center text-xs mt-8" style={{ color: "var(--color-text-muted)" }}>
              All plans include a 7-day money-back guarantee. Cancel anytime.
            </p>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="glow-line max-w-2xl mx-auto" />

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
              Stop guessing.
              <br />
              <span className="text-shimmer">Start understanding.</span>
            </AnimatedTitle>

            <p className="body-muted text-lg mb-10 max-w-lg mx-auto">
              Your next important conversation is coming.
              Make sure you don't miss what matters. Free to start, no credit card required.
            </p>

            <Link
              href={ctaHref}
              className="btn-primary inline-flex items-center gap-2 px-10 py-4 text-base no-underline"
            >
              {ctaLabel}
              <IconArrowRight />
            </Link>

            <p className="text-xs mt-6" style={{ color: "var(--color-text-muted)" }}>
              Free plan available. Upgrade anytime.
            </p>
          </div>
        </section>

        {/* ── SEO: FAQ Section (for Google Featured Snippets) ── */}
        <section id="faq" className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3" style={{ color: "var(--color-text)" }}>
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-center mb-12" style={{ color: "var(--color-text-muted)" }}>
              Everything you need to know about Tonvo, the AI conversation copilot.
            </p>

            <div className="space-y-4">
              {[
                {
                  q: "What is an AI conversation copilot?",
                  a: "An AI conversation copilot is a tool that analyzes your conversations in real time and provides live coaching tips, tone detection, smart suggestions, and actionable insights. Tonvo works during calls on Discord, Zoom, Google Meet, and other platforms to help you communicate more effectively.",
                },
                {
                  q: "Does Tonvo work during live calls?",
                  a: "Yes, Tonvo works in real time during live calls. It captures audio from your microphone and system audio (Discord, Zoom, Meet), transcribes the conversation, and provides instant coaching tips, tone analysis, and smart suggestions while you speak.",
                },
                {
                  q: "How does the real-time analysis work?",
                  a: "Tonvo uses a multi-step AI pipeline: real-time audio transcription with speaker separation, tone and emotion detection, conversation signal detection (objections, opportunities, hesitation), live coaching suggestions, and quality scoring. It also analyzes screen content for additional context.",
                },
                {
                  q: "Is Tonvo free to use?",
                  a: "Yes, Tonvo offers a free plan with 3 sessions per month including real-time tone analysis and basic suggestions. The Pro plan at $19/month (or $156/year, saving 30%) unlocks unlimited sessions, advanced AI coaching, screen analysis, and full session history.",
                },
                {
                  q: "Can other people see the copilot during screen sharing?",
                  a: "Tonvo opens the copilot in a separate browser window. When you share a specific application window (like Discord or Zoom) instead of your entire screen, the copilot window remains invisible to other participants. Perfect for sales calls and interviews.",
                },
                {
                  q: "What languages does Tonvo support?",
                  a: "Tonvo supports 10 languages: English, French, Spanish, German, Portuguese, Italian, Dutch, Chinese, Japanese, and Korean. The interface and conversation analysis work across all supported languages with automatic detection.",
                },
              ].map((item, i) => (
                <details
                  key={i}
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
              ))}
            </div>
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
                  Real-time conversation intelligence.
                  <br />
                  Understand tone, emotions, and intent.
                </p>
              </div>

              {/* Product */}
              <div>
                <h4 className="footer-heading">
                  Product
                </h4>
                <ul className="list-none p-0 m-0 space-y-2.5">
                  <li><a href="#features" className="text-sm no-underline hover:opacity-80 transition-colors" style={{ color: "var(--color-text-muted)" }}>Features</a></li>
                  <li><a href="#demo" className="text-sm no-underline hover:opacity-80 transition-colors" style={{ color: "var(--color-text-muted)" }}>Demo</a></li>
                  <li><a href="#use-cases" className="text-sm no-underline hover:opacity-80 transition-colors" style={{ color: "var(--color-text-muted)" }}>Use Cases</a></li>
                  <li><a href="#faq" className="text-sm no-underline hover:opacity-80 transition-colors" style={{ color: "var(--color-text-muted)" }}>FAQ</a></li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="footer-heading">
                  Company
                </h4>
                <ul className="list-none p-0 m-0 space-y-2.5">
                  <li><Link href="/about" className="text-sm no-underline hover:opacity-80 transition-colors" style={{ color: "var(--color-text-muted)" }}>About</Link></li>
                  <li><Link href="/blog" className="text-sm no-underline hover:opacity-80 transition-colors" style={{ color: "var(--color-text-muted)" }}>Blog</Link></li>

                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="footer-heading">
                  Legal
                </h4>
                <ul className="list-none p-0 m-0 space-y-2.5">
                  <li><Link href="/privacy" className="text-sm no-underline hover:opacity-80 transition-colors" style={{ color: "var(--color-text-muted)" }}>Privacy Policy</Link></li>
                  <li><Link href="/terms" className="text-sm no-underline hover:opacity-80 transition-colors" style={{ color: "var(--color-text-muted)" }}>Terms of Service</Link></li>
                  <li><Link href="/cookies" className="text-sm no-underline hover:opacity-80 transition-colors" style={{ color: "var(--color-text-muted)" }}>Cookie Policy</Link></li>
                  <li><Link href="/legal" className="text-sm no-underline hover:opacity-80 transition-colors" style={{ color: "var(--color-text-muted)" }}>Legal Notice</Link></li>
                </ul>
              </div>
            </div>

            <div className="glow-line mb-8" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs m-0" style={{ color: "var(--color-text-muted)" }}>
                2026 Tonvo. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

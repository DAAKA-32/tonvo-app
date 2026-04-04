import Link from "next/link";
import AnimatedTitle from "@/components/AnimatedTitle";
import TonvoLogo from "@/components/Logo";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingHero from "@/components/landing/LandingHero";
import PricingSection from "@/components/landing/PricingSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import UseCasesSection from "@/components/landing/UseCasesSection";

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
/*  Copilot Overlay Mockup — meeting blurred in background,           */
/*  copilot panel front-and-center with premium glow                  */
/* ------------------------------------------------------------------ */
function CopilotMockup() {
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
            { name: "You", initial: "E", color: "#818cf8", status: "speaking", wave: true },
            { name: "Sarah M.", initial: "S", color: "#34d399", status: "Listening", wave: false },
            { name: "Marc D.", initial: "M", color: "#fbbf24", status: "Muted", wave: false },
            { name: "Lisa K.", initial: "L", color: "#f87171", status: "Muted", wave: false },
          ].map((p) => (
            <div key={p.name} className="rounded-xl flex flex-col items-center justify-center relative" style={{ background: "linear-gradient(160deg, rgba(28,28,36,0.95), rgba(18,18,24,1))", border: "1px solid rgba(255,255,255,0.04)" }}>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-lg font-bold mb-2" style={{ background: `linear-gradient(135deg, ${p.color}24, ${p.color}08)`, color: p.color, border: `1px solid ${p.color}1a` }}>{p.initial}</div>
              <span className="text-[11px] font-medium" style={{ color: "var(--color-text)" }}>{p.name}</span>
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-md" style={{ background: "rgba(0,0,0,0.6)" }}>
                {p.wave && <div className="flex items-end gap-0.5" style={{ height: 10 }}>{[1,2,3].map(i => <div key={i} className="audio-wave-bar" style={{ animationDelay: `${i*0.12}s`, height: 8, width: 2 }} />)}</div>}
                <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.4)" }}>{p.wave ? "Speaking" : p.status}</span>
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
              <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--color-text)" }}>AI Copilot</span>
              <span className="text-[9px] tabular-nums" style={{ color: "var(--color-text-muted)" }}>14:23</span>
            </div>
            <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded-md" style={{ background: "rgba(52,211,153,0.12)", color: "#34d399" }}>positive</span>
          </div>

          {/* Compact scores */}
          <div className="flex items-center justify-center gap-4 py-1.5 border-t border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <div className="text-center">
              <div className="text-[7px] uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Quality</div>
              <div className="text-sm font-bold" style={{ color: "#34d399" }}>84</div>
            </div>
            <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.06)" }} />
            <div className="text-center">
              <div className="text-[7px] uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Engage</div>
              <div className="text-sm font-bold" style={{ color: "#34d399" }}>91</div>
            </div>
            <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.06)" }} />
            <div className="text-center">
              <div className="text-[7px] uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Balance</div>
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
              Say This
              <span className="text-[7px] font-bold px-1 rounded-full" style={{ background: "rgba(52,211,153,0.2)", color: "#34d399" }}>3</span>
            </div>
            <div className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-[9px]" style={{ color: "var(--color-text-muted)" }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
              Coaching
            </div>
          </div>

          {/* Response cards */}
          <div className="flex flex-col gap-1.5">
            <div className="rounded-xl p-2" style={{ background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.15)" }}>
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-[8px]">💬</span>
                <span className="text-[7px] font-bold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Show empathy</span>
              </div>
              <p className="text-[10px] leading-snug m-0" style={{ color: "var(--color-text)" }}>&quot;I completely understand the concern — let&apos;s find a pace that works for everyone.&quot;</p>
            </div>
            <div className="rounded-xl p-2" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-[8px]">🎯</span>
                <span className="text-[7px] font-bold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Propose action</span>
              </div>
              <p className="text-[10px] leading-snug m-0" style={{ color: "var(--color-text-silver)" }}>&quot;How about two phases? Ship MVP by March, iterate after.&quot;</p>
            </div>
            <div className="rounded-xl p-2" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-[8px]">🔍</span>
                <span className="text-[7px] font-bold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Probe deeper</span>
              </div>
              <p className="text-[10px] leading-snug m-0" style={{ color: "var(--color-text-silver)" }}>&quot;Which milestones feel most at risk?&quot;</p>
            </div>
          </div>

          {/* Signals */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[7px] font-medium" style={{ background: "rgba(251,191,36,0.1)", color: "#fbbf24" }}>
              <span className="w-1 h-1 rounded-full" style={{ background: "#fbbf24" }} />
              Hesitation
            </div>
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[7px] font-medium" style={{ background: "rgba(52,211,153,0.1)", color: "#34d399" }}>
              <span className="w-1 h-1 rounded-full" style={{ background: "#34d399" }} />
              Opportunity
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

  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Account Executive",
      company: "Salesforce",
      text: "Honestly, I didn't think I needed this. But after my first week I realized how much I was missing in calls.",
      highlight: "Now I actually listen instead of scrambling to take notes.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
      metric: { value: "3h", label: "saved per week" },
      featured: true,
    },
    {
      name: "David Chen",
      role: "Engineering Manager",
      company: "Datadog",
      text: "The summary after each 1-on-1 is a game changer. I caught things I would've completely forgotten.",
      highlight: "My team even noticed I'm more present during our calls now.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    },
    {
      name: "Priya Sharma",
      role: "Head of Sales",
      company: "Notion",
      text: "We rolled Tonvo out to our entire SDR team. Ramp time for new hires dropped significantly because they can review real call summaries instead of shadowing for weeks.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
      metric: { value: "40%", label: "faster onboarding" },
    },
    {
      name: "Jessica Adams",
      role: "Customer Success Lead",
      company: "HubSpot",
      text: "I used to spend 20 minutes after every call writing up notes.",
      highlight: "Now it's just... done. And the transcription is surprisingly accurate, even with accents.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    },
    {
      name: "Marcus Johnson",
      role: "Freelance Consultant",
      text: "I was skeptical at first — another AI tool, right? But this one actually delivers. I prep less, listen more, and my clients can tell the difference.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
      metric: { value: "5x", label: "more client follow-ups" },
    },
    {
      name: "Elena Rossi",
      role: "Product Manager",
      company: "Figma",
      text: "I run 6+ user interviews a week. Tonvo captures every insight so I can stay focused on the conversation. The coaching tips during calls are surprisingly spot-on.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face",
    },
  ];

  return (
    <>
      {/* ── Navbar (client component: scroll behavior + auth) ── */}
      <LandingNavbar />

      <main>
        {/* ── Hero (client component: auth redirect + CurtainIntro) ── */}
        <LandingHero />

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
        <section id="features" className="py-16 sm:py-24 md:py-32 overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <span className="section-label">Features</span>
              <AnimatedTitle variant="right" className="section-heading">
                Everything you need to
                <br />
                <span className="text-silver-sweep">understand conversations.</span>
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
        <div className="glow-line max-w-2xl mx-auto" />

        {/* ── Product Demo ── */}
        <section id="demo" className="px-4 sm:px-6 py-16 sm:py-24 md:py-32">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="section-label">AI Copilot</span>
              <AnimatedTitle variant="soft" className="section-heading text-glow mb-4">
                Your invisible meeting coach
              </AnimatedTitle>
              <p className="body-muted max-w-lg mx-auto">
                While you focus on the conversation, the AI Copilot floats beside your meeting window — suggesting exactly what to say next, in real time.
              </p>
            </div>

            <div className="mockup-container mockup-enter">
              <div className="mockup-lift">
                <CopilotMockup />
              </div>
            </div>
          </div>
        </section>

        {/* ── Benefits (client component: framer-motion) ── */}
        <BenefitsSection />

        {/* ── Use Cases (client component: framer-motion) ── */}
        <UseCasesSection />

        {/* ── Divider ── */}
        <div className="glow-line max-w-2xl mx-auto" />

        {/* ── Testimonials ── */}
        <section className="px-4 sm:px-6 py-16 sm:py-24 md:py-32">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="section-label">Trusted by professionals</span>
              <AnimatedTitle variant="right" className="section-heading">
                Loved by teams who actually talk to people.
              </AnimatedTitle>
              <p className="body-muted max-w-lg mx-auto mt-4">
                From sales calls to 1-on-1s, thousands of professionals rely on Tonvo to capture what matters and communicate better.
              </p>

              {/* Social proof bar */}
              <div className="flex items-center justify-center gap-6 mt-8 flex-wrap">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#fbbf24" stroke="none">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                  <span className="text-sm font-semibold ml-1.5" style={{ color: "var(--color-text)" }}>4.9</span>
                  <span className="text-xs ml-0.5" style={{ color: "var(--color-text-muted)" }}>from 200+ users</span>
                </div>
              </div>
            </div>

            <div className="testimonials-grid">
              {testimonials.map((t, idx) => (
                <div
                  key={t.name}
                  className={`glass-card p-7 flex flex-col justify-between relative overflow-hidden${t.featured ? " testimonial-featured" : ""}${idx >= 3 ? " testimonial-desktop-only" : ""}`}
                >
                  {t.featured && <div className="testimonial-featured-glow" />}
                  <div>
                    <div className="flex items-center gap-0.5 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" stroke="none">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-[15px] leading-relaxed mb-0" style={{ color: "var(--color-text-silver)" }}>
                      {t.text}
                      {t.highlight && (
                        <span className="testimonial-highlight"> {t.highlight}</span>
                      )}
                    </p>
                    {t.metric && (
                      <div className="testimonial-metric">
                        <span className="testimonial-metric__value">{t.metric.value}</span>
                        <span className="testimonial-metric__label">{t.metric.label}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-6 pt-4" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-white/5" />
                    <div>
                      <div className="text-sm font-semibold">{t.name}</div>
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

        {/* ── Pricing (client component: billing toggle + auth) ── */}
        <PricingSection />

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
                  <li><a href="mailto:tonvoco.pro@gmail.com" className="text-sm no-underline hover:opacity-80 transition-colors" style={{ color: "var(--color-text-muted)" }}>Contact</a></li>
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

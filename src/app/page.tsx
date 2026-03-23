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
/*  Hero app preview — realistic full dashboard mockup                */
/* ------------------------------------------------------------------ */
function HeroAppPreview() {
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

            <div className="text-[9px] font-semibold uppercase tracking-wider px-2.5 mb-2" style={{ color: "var(--color-text-muted)", letterSpacing: "0.08em" }}>Menu</div>

            {[
              { label: "Dashboard", active: false, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg> },
              { label: "Live Session", active: true, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg> },
              { label: "History", active: false, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" /></svg> },
              { label: "Text Analysis", active: false, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /></svg> },
              { label: "Analytics", active: false, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" /></svg> },
              { label: "Pricing", active: false, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg> },
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
                <span className="text-xs font-medium" style={{ color: "var(--color-positive)" }}>Live</span>
                <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>02:34</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-end gap-0.5" style={{ height: 16 }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="audio-wave-bar" style={{ animationDelay: `${i * 0.15}s`, height: 12 }} />
                  ))}
                </div>
                <div className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(52, 211, 153, 0.1)", color: "var(--color-positive)", border: "1px solid rgba(52, 211, 153, 0.2)" }}>
                  Positive
                </div>
              </div>
            </div>

            {/* Content area: transcript + sidebar panel */}
            <div className="flex flex-1">
              {/* Transcript */}
              <div className="flex-1 px-4 py-3 space-y-2.5 overflow-hidden">
                {[
                  { text: "I think the quarterly results look promising, let's discuss next steps.", tone: "positive", speaker: "You", time: "00:32" },
                  { text: "I'm not sure about the timeline though, it feels aggressive.", tone: "hesitant", speaker: "Alex", time: "01:15" },
                  { text: "That's fair. Let me adjust the roadmap and share an update by Friday.", tone: "positive", speaker: "You", time: "01:48" },
                  { text: "That works. Can we also revisit the budget allocation?", tone: "neutral", speaker: "Alex", time: "02:12" },
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
                  <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--color-text)" }}>AI Copilot</span>
                </div>

                {/* Say This — smart response cards */}
                <div className="rounded-lg p-2.5" style={{ background: "rgba(52, 211, 153, 0.04)", border: "1px solid rgba(52, 211, 153, 0.12)" }}>
                  <div className="flex items-center gap-1 mb-2">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: "var(--color-positive)" }}>Say This</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="rounded-md p-1.5" style={{ background: "rgba(52, 211, 153, 0.06)", border: "1px solid rgba(52, 211, 153, 0.1)" }}>
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="text-[8px]">🎯</span>
                        <span className="text-[7px] font-bold uppercase" style={{ color: "var(--color-text-muted)" }}>Close the deal</span>
                      </div>
                      <p className="text-[9px] leading-snug m-0" style={{ color: "var(--color-text)" }}>&quot;Let&apos;s lock the budget review for Monday — I&apos;ll bring updated numbers.&quot;</p>
                    </div>
                    <div className="rounded-md p-1.5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="text-[8px]">🔍</span>
                        <span className="text-[7px] font-bold uppercase" style={{ color: "var(--color-text-muted)" }}>Ask deeper</span>
                      </div>
                      <p className="text-[9px] leading-snug m-0" style={{ color: "var(--color-text-silver)" }}>&quot;What areas of the budget feel most constrained right now?&quot;</p>
                    </div>
                  </div>
                </div>

                {/* Tone chart */}
                <div className="rounded-lg p-2.5" style={{ background: "rgba(200, 200, 216, 0.04)", border: "1px solid rgba(200, 200, 216, 0.08)" }}>
                  <div className="text-[9px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-accent-light)" }}>
                    Tone Flow
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
                    Quality
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

        {/* ═══ Floating Copilot — bottom-right, exactly like real usage ═══ */}
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
      name: "Sarah Mitchell",
      role: "Account Executive",
      company: "Salesforce",
      text: "Honestly, I didn't think I needed this. But after my first week I realized how much I was missing in calls. Now I actually listen instead of scrambling to take notes.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    },
    {
      name: "David Chen",
      role: "Engineering Manager",
      company: "Datadog",
      text: "The summary after each 1-on-1 is a game changer. I caught things I would've completely forgotten. My team even noticed I'm more present during our calls now.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    },
    {
      name: "Jessica Adams",
      role: "Customer Success Lead",
      company: "HubSpot",
      text: "I used to spend 20 minutes after every call writing up notes. Now it's just… done. And the transcription is surprisingly accurate, even with accents.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    },
    {
      name: "Marcus Johnson",
      role: "Freelance Consultant",
      text: "I was skeptical at first — another AI tool, right? But this one actually delivers. I prep less, listen more, and my clients can tell the difference.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
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
        <section className="relative min-h-[85vh] sm:min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-28 sm:pt-32 pb-8 overflow-hidden grid-bg">
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

          </div>

          {/* Hero app preview — the product mockup that sells */}
          <div className="relative z-10 w-full max-w-5xl mx-auto mt-16 sm:mt-20 animate-fade-up animate-delay-500 px-2 sm:px-4">
            <HeroAppPreview />
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

          {/* Mobile/tablet: normal grid */}
          <div className="features-grid-fallback px-4 sm:px-6">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
              {features.map((f) => (
                <div key={f.title} className="glass-card p-6">
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

          {/* Desktop ≥1084px: infinite horizontal scroll */}
          <div className="features-marquee">
            <div className="features-marquee-track">
              {/* Duplicate the set twice for seamless loop */}
              {[0, 1].map((setIndex) => (
                <div key={setIndex} className="features-marquee-set" aria-hidden={setIndex === 1}>
                  {features.map((f) => (
                    <div key={`${setIndex}-${f.title}`} className="glass-card p-6 features-marquee-card">
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
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
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

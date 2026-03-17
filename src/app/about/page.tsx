"use client";

import Link from "next/link";
import { TonvoLogoMark } from "@/components/Logo";

const TIMELINE = [
  { date: "February 2026", title: "Company founded", desc: "Emilien Nepveu registers Tonvo as an individual entrepreneur in Chambles, France." },
  { date: "February 2026", title: "First prototype", desc: "Real-time tone analysis and AI coaching built on Next.js, Claude AI, and Whisper." },
  { date: "March 2026", title: "Public launch", desc: "Tonvo goes live with Free, Pro, and Team plans. Screen analysis and copilot overlay shipped." },
];

const VALUES = [
  { icon: "brain", title: "AI that helps, not replaces", desc: "Tonvo augments your natural communication skills with real-time intelligence. You stay in control." },
  { icon: "shield", title: "Privacy first", desc: "Audio is transcribed in real-time and never stored. Screen frames are analyzed then discarded. Your data stays yours." },
  { icon: "zap", title: "Instant feedback", desc: "Sub-second analysis. Coaching tips, tone detection, and signals appear as you speak, not after the call." },
  { icon: "globe", title: "Built for everyone", desc: "10 languages supported. Works with Discord, Zoom, Meet, and any voice/video platform." },
];

function IconFor({ name }: { name: string }) {
  const props = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (name === "brain") return <svg {...props}><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" /><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" /></svg>;
  if (name === "shield") return <svg {...props}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></svg>;
  if (name === "zap") return <svg {...props}><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" /></svg>;
  return <svg {...props}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>;
}

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: "var(--color-bg)", minHeight: "100vh" }}>
      <header className="border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <TonvoLogoMark size="sm" />
            <span className="text-lg font-bold" style={{ color: "var(--color-text)" }}>Tonvo</span>
          </Link>
          <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>/</span>
          <span className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>About</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "var(--color-text)" }}>
            Better conversations, powered by AI
          </h1>
          <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: "var(--color-text-muted)" }}>
            Tonvo is an AI conversation copilot that helps professionals communicate more effectively
            during calls, meetings, and chats. Real-time insights, coaching tips, and tone detection
            — all while you speak.
          </p>
        </div>

        {/* Founder */}
        <section className="mb-16">
          <div className="rounded-2xl border p-8 flex flex-col sm:flex-row items-center gap-8" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}>
            <div className="w-24 h-24 rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #5c5c6e 0%, #6e6e82 100%)" }}>
              <span className="text-3xl font-bold text-white">EN</span>
            </div>
            <div>
              <h2 className="text-lg font-bold mb-1" style={{ color: "var(--color-text)" }}>Emilien Nepveu</h2>
              <p className="text-sm font-medium mb-3" style={{ color: "var(--color-accent-light)" }}>Founder & Developer</p>
              <p className="text-sm leading-relaxed m-0" style={{ color: "var(--color-text-muted)" }}>
                Software engineer based in France, passionate about AI and human communication.
                Built Tonvo to solve a problem he experienced firsthand: understanding conversation dynamics
                in real time, whether in sales calls, job interviews, or everyday conversations.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-xl font-bold text-center mb-8" style={{ color: "var(--color-text)" }}>Our values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-xl border p-6" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}>
                <div className="mb-3" style={{ color: "var(--color-accent-light)" }}>
                  <IconFor name={v.icon} />
                </div>
                <h3 className="text-sm font-bold mb-2" style={{ color: "var(--color-text)" }}>{v.title}</h3>
                <p className="text-xs leading-relaxed m-0" style={{ color: "var(--color-text-muted)" }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-16">
          <h2 className="text-xl font-bold text-center mb-8" style={{ color: "var(--color-text)" }}>Our journey</h2>
          <div className="space-y-0 relative pl-6" style={{ borderLeft: "2px solid var(--color-border)" }}>
            {TIMELINE.map((e, i) => (
              <div key={i} className="pb-8 relative">
                <div className="absolute -left-[29px] w-3 h-3 rounded-full" style={{ backgroundColor: "var(--color-accent-light)", border: "2px solid var(--color-bg)" }} />
                <p className="text-xs font-semibold mb-1" style={{ color: "var(--color-accent-light)" }}>{e.date}</p>
                <p className="text-sm font-bold m-0 mb-1" style={{ color: "var(--color-text)" }}>{e.title}</p>
                <p className="text-xs leading-relaxed m-0" style={{ color: "var(--color-text-muted)" }}>{e.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center rounded-2xl border p-10" style={{ backgroundColor: "rgba(200, 200, 216, 0.04)", borderColor: "var(--color-border)" }}>
          <h2 className="text-xl font-bold mb-3" style={{ color: "var(--color-text)" }}>Ready to communicate better?</h2>
          <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>Join thousands of professionals using Tonvo to improve their conversations.</p>
          <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold no-underline transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg, #5c5c6e, #6e6e82)", color: "white", boxShadow: "0 4px 14px rgba(92,92,110,0.35)" }}>
            Get started for free
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t" style={{ borderColor: "var(--color-border)" }}>
          <Link href="/" className="text-sm no-underline font-medium" style={{ color: "var(--color-accent-light)" }}>&larr; Back to home</Link>
        </div>
      </main>
    </div>
  );
}

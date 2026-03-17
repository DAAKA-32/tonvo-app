"use client";

import { useState } from "react";
import Link from "next/link";
import { TonvoLogoMark } from "@/components/Logo";

const TOPICS = [
  { value: "general", label: "General question" },
  { value: "support", label: "Technical support" },
  { value: "billing", label: "Billing & subscription" },
  { value: "partnership", label: "Partnership" },
  { value: "feedback", label: "Feedback" },
  { value: "other", label: "Other" },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("general");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`[Tonvo ${topic}] from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`);
    window.location.href = `mailto:contact@tonvo.co?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <div style={{ backgroundColor: "var(--color-bg)", minHeight: "100vh" }}>
      <header className="border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <TonvoLogoMark size="sm" />
            <span className="text-lg font-bold" style={{ color: "var(--color-text)" }}>Tonvo</span>
          </Link>
          <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>/</span>
          <span className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>Contact</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Left: info */}
          <div className="md:col-span-2">
            <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: "var(--color-text)" }}>Get in touch</h1>
            <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--color-text-muted)" }}>
              Have a question, feedback, or partnership idea? We&apos;d love to hear from you.
            </p>

            <div className="space-y-5">
              <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-accent-light)" }}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                  <span className="text-xs font-semibold" style={{ color: "var(--color-text)" }}>Email</span>
                </div>
                <a href="mailto:contact@tonvo.co" className="text-sm no-underline" style={{ color: "var(--color-accent-light)" }}>contact@tonvo.co</a>
              </div>

              <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-accent-light)" }}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                  <span className="text-xs font-semibold" style={{ color: "var(--color-text)" }}>Location</span>
                </div>
                <p className="text-sm m-0" style={{ color: "var(--color-text-muted)" }}>42170 Chambles, France</p>
              </div>

              <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-accent-light)" }}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  <span className="text-xs font-semibold" style={{ color: "var(--color-text)" }}>Response time</span>
                </div>
                <p className="text-sm m-0" style={{ color: "var(--color-text-muted)" }}>Usually within 24 hours</p>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="md:col-span-3">
            {sent ? (
              <div className="rounded-2xl border p-10 text-center" style={{ backgroundColor: "var(--color-surface)", borderColor: "rgba(52, 211, 153, 0.2)" }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(52, 211, 153, 0.1)" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-positive)" }}><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <h2 className="text-lg font-bold mb-2" style={{ color: "var(--color-text)" }}>Message ready to send!</h2>
                <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>Your email app should have opened with your message. If not, email us directly at contact@tonvo.co.</p>
                <button onClick={() => setSent(false)} className="text-sm font-medium border-none bg-transparent cursor-pointer" style={{ color: "var(--color-accent-light)" }}>Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-2xl border p-6 sm:p-8 space-y-5" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Name</label>
                    <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name"
                      className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all"
                      style={{ backgroundColor: "rgba(26,26,30,0.6)", borderColor: "rgba(255,255,255,0.06)", color: "var(--color-text)" }} />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Email</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com"
                      className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all"
                      style={{ backgroundColor: "rgba(26,26,30,0.6)", borderColor: "rgba(255,255,255,0.06)", color: "var(--color-text)" }} />
                  </div>
                </div>

                <div>
                  <label htmlFor="topic" className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Topic</label>
                  <select id="topic" value={topic} onChange={(e) => setTopic(e.target.value)}
                    className="w-full rounded-lg border px-4 py-3 text-sm outline-none cursor-pointer"
                    style={{ backgroundColor: "rgba(26,26,30,0.6)", borderColor: "rgba(255,255,255,0.06)", color: "var(--color-text)" }}>
                    {TOPICS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Message</label>
                  <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} required rows={5} placeholder="How can we help?"
                    className="w-full rounded-lg border px-4 py-3 text-sm outline-none resize-y transition-all"
                    style={{ backgroundColor: "rgba(26,26,30,0.6)", borderColor: "rgba(255,255,255,0.06)", color: "var(--color-text)" }} />
                </div>

                <button type="submit"
                  className="w-full py-3 rounded-xl font-semibold text-sm cursor-pointer border-none transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #5c5c6e, #6e6e82)", color: "white", boxShadow: "0 4px 14px rgba(92,92,110,0.35)" }}>
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t" style={{ borderColor: "var(--color-border)" }}>
          <Link href="/" className="text-sm no-underline font-medium" style={{ color: "var(--color-accent-light)" }}>&larr; Back to home</Link>
        </div>
      </main>
    </div>
  );
}

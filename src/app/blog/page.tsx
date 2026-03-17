"use client";

import Link from "next/link";
import { TonvoLogoMark } from "@/components/Logo";

const ARTICLES = [
  {
    slug: "what-is-conversation-intelligence",
    title: "What is Conversation Intelligence? A Complete Guide",
    excerpt: "Learn how AI-powered conversation intelligence works, why it matters for sales and support teams, and how real-time analysis can transform your communication.",
    date: "March 15, 2026",
    tag: "Guide",
    tagColor: "#818cf8",
  },
  {
    slug: "5-ways-ai-coaching-improves-sales",
    title: "5 Ways AI Coaching Improves Your Sales Calls",
    excerpt: "Discover how real-time AI suggestions, objection detection, and tone analysis help sales professionals close more deals and build stronger relationships.",
    date: "March 12, 2026",
    tag: "Sales",
    tagColor: "#34d399",
  },
  {
    slug: "tone-detection-during-calls",
    title: "Why Tone Detection Matters More Than Words",
    excerpt: "Research shows that tone conveys more meaning than words alone. Here's how AI tone detection gives you an edge in every conversation.",
    date: "March 10, 2026",
    tag: "Research",
    tagColor: "#38bdf8",
  },
  {
    slug: "invisible-copilot-screen-sharing",
    title: "How to Use an AI Copilot Without Others Seeing It",
    excerpt: "A practical guide to using Tonvo's copilot during screen sharing calls. Learn the window-sharing technique that keeps your AI assistant invisible.",
    date: "March 8, 2026",
    tag: "Tips",
    tagColor: "#fbbf24",
  },
];

export default function BlogPage() {
  return (
    <div style={{ backgroundColor: "var(--color-bg)", minHeight: "100vh" }}>
      <header className="border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <TonvoLogoMark size="sm" />
            <span className="text-lg font-bold" style={{ color: "var(--color-text)" }}>Tonvo</span>
          </Link>
          <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>/</span>
          <span className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>Blog</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: "var(--color-text)" }}>Blog</h1>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Insights on conversation intelligence, AI coaching, and better communication.
          </p>
        </div>

        <div className="space-y-5">
          {ARTICLES.map((article) => (
            <article
              key={article.slug}
              className="rounded-xl border p-6 transition-all cursor-default"
              style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${article.tagColor}15`, color: article.tagColor }}>
                  {article.tag}
                </span>
                <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{article.date}</span>
              </div>
              <h2 className="text-base font-bold mb-2" style={{ color: "var(--color-text)" }}>
                {article.title}
              </h2>
              <p className="text-sm leading-relaxed m-0 mb-3" style={{ color: "var(--color-text-muted)" }}>
                {article.excerpt}
              </p>
              <span className="text-xs font-medium" style={{ color: "var(--color-accent-light)" }}>
                Coming soon
              </span>
            </article>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 rounded-2xl border p-8 text-center" style={{ backgroundColor: "rgba(200,200,216,0.04)", borderColor: "var(--color-border)" }}>
          <h2 className="text-lg font-bold mb-2" style={{ color: "var(--color-text)" }}>Stay in the loop</h2>
          <p className="text-sm mb-5" style={{ color: "var(--color-text-muted)" }}>Get notified when new articles are published. No spam, ever.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="you@example.com"
              className="flex-1 rounded-lg border px-4 py-3 text-sm outline-none"
              style={{ backgroundColor: "rgba(26,26,30,0.6)", borderColor: "rgba(255,255,255,0.06)", color: "var(--color-text)" }} />
            <button className="px-5 py-3 rounded-lg text-sm font-semibold border-none cursor-pointer transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #5c5c6e, #6e6e82)", color: "white" }}>
              Subscribe
            </button>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t" style={{ borderColor: "var(--color-border)" }}>
          <Link href="/" className="text-sm no-underline font-medium" style={{ color: "var(--color-accent-light)" }}>&larr; Back to home</Link>
        </div>
      </main>
    </div>
  );
}

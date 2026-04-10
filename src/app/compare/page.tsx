import type { Metadata } from "next";
import Link from "next/link";
import SEOPageShell from "@/components/seo/SEOPageShell";
import { comparisons } from "@/data/seo/comparisons";

export const metadata: Metadata = {
  title: "Compare Tonvo — AI Conversation Copilot Alternatives",
  description: "See how Tonvo compares to Gong, Fireflies, Otter.ai, Chorus, and other conversation intelligence tools. Feature-by-feature comparison.",
  alternates: { canonical: "https://tonvo.co/compare" },
};

export default function CompareIndex() {
  return (
    <SEOPageShell breadcrumbs={[{ label: "Comparisons" }]}>
      <div className="text-center mb-16">
        <p className="section-label mb-4" style={{ color: "var(--color-accent-light)" }}>
          Comparisons
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-5" style={{ color: "var(--color-text)", letterSpacing: "-0.02em" }}>
          How Tonvo Compares
        </h1>
        <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: "var(--color-text-muted)" }}>
          Choosing the right conversation intelligence tool matters. See how Tonvo stacks up against popular alternatives.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
        {comparisons.map((c) => (
          <Link
            key={c.slug}
            href={`/compare/${c.slug}`}
            className="rounded-xl border p-6 no-underline transition-all hover:border-opacity-60 group"
            style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", display: "block" }}
          >
            <h2 className="text-sm font-bold mb-2 group-hover:text-(--color-text-silver) transition-colors" style={{ color: "var(--color-text)" }}>
              Tonvo vs {c.competitorName}
            </h2>
            <p className="text-xs leading-relaxed m-0" style={{ color: "var(--color-text-muted)" }}>
              {c.subtitle.slice(0, 140)}...
            </p>
          </Link>
        ))}
      </div>
    </SEOPageShell>
  );
}

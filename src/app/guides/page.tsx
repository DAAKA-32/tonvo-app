import type { Metadata } from "next";
import Link from "next/link";
import SEOPageShell from "@/components/seo/SEOPageShell";
import { guides } from "@/data/seo/guides";

export const metadata: Metadata = {
  title: "Guides — Conversation Intelligence Resources",
  description: "Learn about conversation intelligence, tone detection, and communication best practices with Tonvo's expert guides and resources.",
  alternates: { canonical: "https://tonvo.co/guides" },
};

export default function GuidesIndex() {
  return (
    <SEOPageShell breadcrumbs={[{ label: "Guides" }]}>
      <div className="text-center mb-16">
        <p className="section-label mb-4" style={{ color: "var(--color-accent-light)" }}>
          Guides & Resources
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-5" style={{ color: "var(--color-text)", letterSpacing: "-0.02em" }}>
          Master the Art of Conversation
        </h1>
        <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: "var(--color-text-muted)" }}>
          Expert guides on conversation intelligence, communication skills, and leveraging AI to improve every interaction.
        </p>
      </div>

      <div className="space-y-4 mb-16">
        {guides.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="rounded-xl border p-6 no-underline transition-all hover:border-opacity-60 group flex flex-col sm:flex-row sm:items-center gap-4"
            style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", display: "flex" }}
          >
            <div className="flex items-center gap-3 shrink-0">
              <span
                className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md"
                style={{ backgroundColor: `${g.tagColor}20`, color: g.tagColor }}
              >
                {g.tag}
              </span>
              <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                {g.readingTime}
              </span>
            </div>
            <div>
              <h2 className="text-sm font-bold mb-1 group-hover:text-(--color-text-silver) transition-colors" style={{ color: "var(--color-text)" }}>
                {g.h1}
              </h2>
              <p className="text-xs leading-relaxed m-0" style={{ color: "var(--color-text-muted)" }}>
                {g.subtitle.slice(0, 160)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </SEOPageShell>
  );
}

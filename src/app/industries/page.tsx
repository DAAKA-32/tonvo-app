import type { Metadata } from "next";
import Link from "next/link";
import SEOPageShell from "@/components/seo/SEOPageShell";
import { industries } from "@/data/seo/industries";

export const metadata: Metadata = {
  title: "Industries — AI Conversation Intelligence by Sector",
  description: "See how Tonvo helps teams across SaaS, recruiting, consulting, healthcare, financial services, and more communicate better.",
  alternates: { canonical: "https://tonvo.co/industries" },
};

export default function IndustriesIndex() {
  return (
    <SEOPageShell breadcrumbs={[{ label: "Industries" }]}>
      <div className="text-center mb-16">
        <p className="section-label mb-4" style={{ color: "var(--color-accent-light)" }}>
          Industries
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-5" style={{ color: "var(--color-text)", letterSpacing: "-0.02em" }}>
          Conversation Intelligence for Every Industry
        </h1>
        <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: "var(--color-text-muted)" }}>
          Every industry has critical conversations. Tonvo helps teams across sectors communicate with confidence and clarity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
        {industries.map((ind) => (
          <Link
            key={ind.slug}
            href={`/industries/${ind.slug}`}
            className="rounded-xl border p-6 no-underline transition-all hover:border-opacity-60 group"
            style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", display: "block" }}
          >
            <h2 className="text-sm font-bold mb-2 group-hover:opacity-80 transition-opacity" style={{ color: "var(--color-text)" }}>
              {ind.industryName}
            </h2>
            <p className="text-xs leading-relaxed m-0" style={{ color: "var(--color-text-muted)" }}>
              {ind.subtitle.slice(0, 140)}...
            </p>
          </Link>
        ))}
      </div>
    </SEOPageShell>
  );
}

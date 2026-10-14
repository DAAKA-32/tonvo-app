import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import SEOPageShell from "@/components/seo/SEOPageShell";
import { features } from "@/data/seo/features";

export const metadata: Metadata = pageMetadata({
  title: "Tonvo features",
  description:
    "Explore Tonvo's features: real-time tone detection, AI coaching suggestions, conversation signals, post-session analysis, and more.",
  path: "/features",
});

export default function FeaturesIndex() {
  return (
    <SEOPageShell breadcrumbs={[{ label: "Features" }]}>
      <div className="text-center mb-16">
        <p className="section-label mb-4" style={{ color: "var(--color-accent-light)" }}>
          Features
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-5" style={{ color: "var(--color-text)", letterSpacing: "-0.02em" }}>
          Everything You Need for Better Conversations
        </h1>
        <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: "var(--color-text-muted)" }}>
          Tonvo combines real-time tone detection, AI coaching, and conversation intelligence into one seamless experience.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
        {features.map((f) => (
          <Link
            key={f.slug}
            href={`/features/${f.slug}`}
            className="rounded-xl border p-6 no-underline transition-all hover:border-opacity-60 group"
            style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", display: "block" }}
          >
            <h2 className="text-sm font-bold mb-2 group-hover:text-(--color-text-silver) transition-colors" style={{ color: "var(--color-text)" }}>
              {f.featureName}
            </h2>
            <p className="text-xs leading-relaxed m-0" style={{ color: "var(--color-text-muted)" }}>
              {f.subtitle.slice(0, 140)}...
            </p>
          </Link>
        ))}
      </div>
    </SEOPageShell>
  );
}

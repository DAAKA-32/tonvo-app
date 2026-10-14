import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import SEOPageShell from "@/components/seo/SEOPageShell";
import { useCases } from "@/data/seo/use-cases";

export const metadata: Metadata = pageMetadata({
  title: "Tonvo use cases",
  description:
    "Discover how professionals use Tonvo's AI conversation copilot for sales calls, customer support, interviews, meetings, and more.",
  path: "/use-cases",
});

export default function UseCasesIndex() {
  return (
    <SEOPageShell breadcrumbs={[{ label: "Use Cases" }]}>
      <div className="text-center mb-16">
        <p className="section-label mb-4" style={{ color: "var(--color-accent-light)" }}>
          Use Cases
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-5" style={{ color: "var(--color-text)", letterSpacing: "-0.02em" }}>
          How Professionals Use Tonvo
        </h1>
        <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: "var(--color-text-muted)" }}>
          From sales calls to customer support, discover how teams use real-time conversation intelligence to communicate better and close more deals.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
        {useCases.map((uc) => (
          <Link
            key={uc.slug}
            href={`/use-cases/${uc.slug}`}
            className="rounded-xl border p-6 no-underline transition-all hover:border-opacity-60 group"
            style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", display: "block" }}
          >
            <h2 className="text-sm font-bold mb-2 group-hover:text-(--color-text-silver) transition-colors" style={{ color: "var(--color-text)" }}>
              {uc.h1}
            </h2>
            <p className="text-xs leading-relaxed m-0" style={{ color: "var(--color-text-muted)" }}>
              {uc.subtitle.slice(0, 140)}...
            </p>
          </Link>
        ))}
      </div>
    </SEOPageShell>
  );
}

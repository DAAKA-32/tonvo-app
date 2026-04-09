import Link from "next/link";
import type { RelatedSlug } from "@/data/seo/types";

const TYPE_LABELS: Record<string, string> = {
  "use-cases": "Use Case",
  features: "Feature",
  industries: "Industry",
  compare: "Comparison",
  guides: "Guide",
};

export default function RelatedPages({ pages }: { pages: RelatedSlug[] }) {
  if (pages.length === 0) return null;

  return (
    <section className="mb-16">
      <h2
        className="text-xl font-bold text-center mb-8"
        style={{ color: "var(--color-text)" }}
      >
        Related Resources
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {pages.map((page, i) => (
          <Link
            key={i}
            href={`/${page.type}/${page.slug}`}
            className="rounded-xl border p-5 no-underline transition-all hover:border-opacity-60"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
              display: "block",
            }}
          >
            <span
              className="text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--color-accent-light)" }}
            >
              {TYPE_LABELS[page.type] || page.type}
            </span>
            <p
              className="text-sm font-semibold m-0 mt-2"
              style={{ color: "var(--color-text)" }}
            >
              {page.label}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

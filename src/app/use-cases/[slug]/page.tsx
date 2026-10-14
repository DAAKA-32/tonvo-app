import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import SEOPageShell from "@/components/seo/SEOPageShell";
import SEOHeroSection from "@/components/seo/SEOHeroSection";
import FeatureGrid from "@/components/seo/FeatureGrid";
import FAQAccordion from "@/components/seo/FAQAccordion";
import { useCases } from "@/data/seo/use-cases";
import { buildWebPageJsonLd } from "@/data/seo/json-ld";

const SITE_URL = "https://tonvo.co";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return useCases.map((uc) => ({ slug: uc.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = useCases.find((uc) => uc.slug === slug);
  if (!entry) return {};

  return pageMetadata({
    title: entry.title,
    description: entry.metaDescription,
    path: `/use-cases/${entry.slug}`,
    keywords: entry.targetKeywords,
  });
}

export default async function UseCasePage({ params }: Props) {
  const { slug } = await params;
  const entry = useCases.find((uc) => uc.slug === slug);
  if (!entry) notFound();

  const pageUrl = `${SITE_URL}/use-cases/${entry.slug}`;
  const webPageJsonLd = buildWebPageJsonLd(entry, pageUrl);

  return (
    <SEOPageShell
      breadcrumbs={[
        { label: "Use Cases", href: "/use-cases" },
        { label: entry.h1 },
      ]}
      relatedPages={entry.relatedSlugs}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />

      <SEOHeroSection
        label="Use Case"
        h1={entry.h1}
        subtitle={entry.subtitle}
        stats={entry.stats}
      />

      {/* Problem */}
      <section className="mb-16">
        {entry.problem.label && (
          <p className="section-label mb-3" style={{ color: "var(--color-accent-light)" }}>{entry.problem.label}</p>
        )}
        <h2 className="text-xl font-bold mb-4" style={{ color: "var(--color-text)" }}>
          {entry.problem.heading}
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
          {entry.problem.body}
        </p>
      </section>

      <div className="glow-line max-w-2xl mx-auto mb-16" />

      {/* Solution */}
      <section className="mb-16">
        {entry.solution.label && (
          <p className="section-label mb-3" style={{ color: "var(--color-accent-light)" }}>{entry.solution.label}</p>
        )}
        <h2 className="text-xl font-bold mb-4" style={{ color: "var(--color-text)" }}>
          {entry.solution.heading}
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
          {entry.solution.body}
        </p>
      </section>

      {/* Features */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-center mb-8" style={{ color: "var(--color-text)" }}>
          Key Features for This Use Case
        </h2>
        <FeatureGrid features={entry.features} />
      </section>

      {/* Testimonial */}
      {entry.testimonial && (
        <section className="mb-16">
          <div
            className="rounded-xl border p-8 text-center"
            style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
          >
            <blockquote className="text-sm leading-relaxed italic m-0 mb-4" style={{ color: "var(--color-text)" }}>
              &ldquo;{entry.testimonial.quote}&rdquo;
            </blockquote>
            <p className="text-xs font-semibold m-0" style={{ color: "var(--color-accent-light)" }}>
              {entry.testimonial.name}, {entry.testimonial.role}
              {entry.testimonial.company && ` at ${entry.testimonial.company}`}
            </p>
          </div>
        </section>
      )}

      <FAQAccordion items={entry.faq} />
    </SEOPageShell>
  );
}

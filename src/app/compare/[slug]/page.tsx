import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SEOPageShell from "@/components/seo/SEOPageShell";
import SEOHeroSection from "@/components/seo/SEOHeroSection";
import ComparisonTable from "@/components/seo/ComparisonTable";
import FeatureGrid from "@/components/seo/FeatureGrid";
import FAQAccordion from "@/components/seo/FAQAccordion";
import { comparisons } from "@/data/seo/comparisons";
import { buildWebPageJsonLd, buildProductJsonLd } from "@/data/seo/json-ld";

const SITE_URL = "https://tonvo.co";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return comparisons.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = comparisons.find((c) => c.slug === slug);
  if (!entry) return {};

  return {
    title: entry.title,
    description: entry.metaDescription,
    keywords: entry.targetKeywords,
    openGraph: {
      title: entry.title,
      description: entry.metaDescription,
      url: `${SITE_URL}/compare/${entry.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title,
      description: entry.metaDescription,
    },
    alternates: { canonical: `${SITE_URL}/compare/${entry.slug}` },
  };
}

export default async function ComparisonPage({ params }: Props) {
  const { slug } = await params;
  const entry = comparisons.find((c) => c.slug === slug);
  if (!entry) notFound();

  const pageUrl = `${SITE_URL}/compare/${entry.slug}`;
  const webPageJsonLd = buildWebPageJsonLd(entry, pageUrl);
  const tonvoJsonLd = buildProductJsonLd(
    "Tonvo",
    "AI conversation copilot with real-time tone detection and coaching.",
    SITE_URL
  );
  const competitorJsonLd = buildProductJsonLd(
    entry.competitorName,
    entry.competitorDescription,
    pageUrl
  );

  return (
    <SEOPageShell
      breadcrumbs={[
        { label: "Comparisons", href: "/compare" },
        { label: `Tonvo vs ${entry.competitorName}` },
      ]}
      relatedPages={entry.relatedSlugs}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tonvoJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(competitorJsonLd) }}
      />

      <SEOHeroSection
        label="Comparison"
        h1={entry.h1}
        subtitle={entry.subtitle}
      />

      {/* Comparison Table */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-center mb-8" style={{ color: "var(--color-text)" }}>
          Feature-by-Feature Comparison
        </h2>
        <ComparisonTable
          competitorName={entry.competitorName}
          rows={entry.comparisonRows}
        />
      </section>

      <div className="glow-line max-w-2xl mx-auto mb-16" />

      {/* Why Tonvo */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-center mb-8" style={{ color: "var(--color-text)" }}>
          Why Choose Tonvo
        </h2>
        <FeatureGrid features={entry.tonvoAdvantages} />
      </section>

      {/* Summary */}
      <section className="mb-16">
        {entry.summary.label && (
          <p className="section-label mb-3" style={{ color: "var(--color-accent-light)" }}>{entry.summary.label}</p>
        )}
        <h2 className="text-xl font-bold mb-4" style={{ color: "var(--color-text)" }}>
          {entry.summary.heading}
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
          {entry.summary.body}
        </p>
      </section>

      <FAQAccordion items={entry.faq} />
    </SEOPageShell>
  );
}

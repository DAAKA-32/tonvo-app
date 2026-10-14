import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import SEOPageShell from "@/components/seo/SEOPageShell";
import SEOHeroSection from "@/components/seo/SEOHeroSection";
import FeatureGrid from "@/components/seo/FeatureGrid";
import FAQAccordion from "@/components/seo/FAQAccordion";
import { features } from "@/data/seo/features";
import { buildWebPageJsonLd } from "@/data/seo/json-ld";

const SITE_URL = "https://tonvo.co";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return features.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = features.find((f) => f.slug === slug);
  if (!entry) return {};

  return pageMetadata({
    title: entry.title,
    description: entry.metaDescription,
    path: `/features/${entry.slug}`,
    keywords: entry.targetKeywords,
  });
}

export default async function FeaturePage({ params }: Props) {
  const { slug } = await params;
  const entry = features.find((f) => f.slug === slug);
  if (!entry) notFound();

  const pageUrl = `${SITE_URL}/features/${entry.slug}`;
  const webPageJsonLd = buildWebPageJsonLd(entry, pageUrl);

  return (
    <SEOPageShell
      breadcrumbs={[
        { label: "Features", href: "/features" },
        { label: entry.featureName },
      ]}
      relatedPages={entry.relatedSlugs}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />

      <SEOHeroSection
        label="Feature"
        h1={entry.h1}
        subtitle={entry.subtitle}
      />

      {/* How It Works */}
      <section className="mb-16">
        {entry.howItWorks.label && (
          <p className="section-label mb-3" style={{ color: "var(--color-accent-light)" }}>{entry.howItWorks.label}</p>
        )}
        <h2 className="text-xl font-bold mb-4" style={{ color: "var(--color-text)" }}>
          {entry.howItWorks.heading}
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
          {entry.howItWorks.body}
        </p>
      </section>

      <div className="glow-line max-w-2xl mx-auto mb-16" />

      {/* Benefits */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-center mb-8" style={{ color: "var(--color-text)" }}>
          Key Benefits
        </h2>
        <FeatureGrid features={entry.benefits} />
      </section>

      {/* Use Cases */}
      <section className="mb-16">
        <h2 className="text-xl font-bold mb-6" style={{ color: "var(--color-text)" }}>
          Who Uses This Feature
        </h2>
        <ul className="space-y-3 list-none p-0 m-0">
          {entry.useCasesForFeature.map((uc, i) => (
            <li key={i} className="flex items-start gap-3">
              <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>{uc}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Technical Detail */}
      {entry.technicalDetail && (
        <section className="mb-16">
          {entry.technicalDetail.label && (
            <p className="section-label mb-3" style={{ color: "var(--color-accent-light)" }}>{entry.technicalDetail.label}</p>
          )}
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--color-text)" }}>
            {entry.technicalDetail.heading}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            {entry.technicalDetail.body}
          </p>
        </section>
      )}

      <FAQAccordion items={entry.faq} />
    </SEOPageShell>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import SEOPageShell from "@/components/seo/SEOPageShell";
import SEOHeroSection from "@/components/seo/SEOHeroSection";
import FeatureGrid from "@/components/seo/FeatureGrid";
import FAQAccordion from "@/components/seo/FAQAccordion";
import { industries } from "@/data/seo/industries";
import { buildWebPageJsonLd } from "@/data/seo/json-ld";

const SITE_URL = "https://tonvo.co";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return industries.map((ind) => ({ slug: ind.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = industries.find((ind) => ind.slug === slug);
  if (!entry) return {};

  return {
    title: entry.title,
    description: entry.metaDescription,
    keywords: entry.targetKeywords,
    openGraph: {
      title: entry.title,
      description: entry.metaDescription,
      url: `${SITE_URL}/industries/${entry.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title,
      description: entry.metaDescription,
    },
    alternates: { canonical: `${SITE_URL}/industries/${entry.slug}` },
  };
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const entry = industries.find((ind) => ind.slug === slug);
  if (!entry) notFound();

  const pageUrl = `${SITE_URL}/industries/${entry.slug}`;
  const webPageJsonLd = buildWebPageJsonLd(entry, pageUrl);

  return (
    <SEOPageShell
      breadcrumbs={[
        { label: "Industries", href: "/industries" },
        { label: entry.industryName },
      ]}
      relatedPages={entry.relatedSlugs}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />

      <SEOHeroSection
        label={entry.industryName}
        h1={entry.h1}
        subtitle={entry.subtitle}
        stats={entry.stats}
      />

      {/* Pain Points */}
      <section className="mb-16">
        <h2 className="text-xl font-bold mb-6" style={{ color: "var(--color-text)" }}>
          Challenges You Face
        </h2>
        <ul className="space-y-3 list-none p-0 m-0">
          {entry.painPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-3">
              <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>{point}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="glow-line max-w-2xl mx-auto mb-16" />

      {/* How Tonvo Helps */}
      <section className="mb-16">
        {entry.howTonvoHelps.label && (
          <p className="section-label mb-3" style={{ color: "var(--color-accent-light)" }}>{entry.howTonvoHelps.label}</p>
        )}
        <h2 className="text-xl font-bold mb-4" style={{ color: "var(--color-text)" }}>
          {entry.howTonvoHelps.heading}
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
          {entry.howTonvoHelps.body}
        </p>
      </section>

      {/* Features */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-center mb-8" style={{ color: "var(--color-text)" }}>
          Features That Matter for {entry.industryName}
        </h2>
        <FeatureGrid features={entry.features} />
      </section>

      {/* Related Use Cases */}
      {entry.useCaseLinks.length > 0 && (
        <section className="mb-16">
          <h2 className="text-xl font-bold mb-6" style={{ color: "var(--color-text)" }}>
            Related Use Cases
          </h2>
          <div className="flex flex-wrap gap-3">
            {entry.useCaseLinks.map((ucSlug) => (
              <Link
                key={ucSlug}
                href={`/use-cases/${ucSlug}`}
                className="text-xs font-medium no-underline px-4 py-2 rounded-lg border hover:opacity-80 transition-opacity"
                style={{ borderColor: "var(--color-border)", color: "var(--color-accent-light)" }}
              >
                {ucSlug.replace(/-/g, " ")}
              </Link>
            ))}
          </div>
        </section>
      )}

      <FAQAccordion items={entry.faq} />
    </SEOPageShell>
  );
}

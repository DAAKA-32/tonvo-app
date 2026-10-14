import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import SEOPageShell from "@/components/seo/SEOPageShell";
import TableOfContents from "@/components/seo/TableOfContents";
import FAQAccordion from "@/components/seo/FAQAccordion";
import { guides } from "@/data/seo/guides";
import { buildArticleJsonLd, buildWebPageJsonLd } from "@/data/seo/json-ld";

const SITE_URL = "https://tonvo.co";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = guides.find((g) => g.slug === slug);
  if (!entry) return {};

  return pageMetadata({
    title: entry.title,
    description: entry.metaDescription,
    path: `/guides/${entry.slug}`,
    keywords: entry.targetKeywords,
  });
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const entry = guides.find((g) => g.slug === slug);
  if (!entry) notFound();

  const pageUrl = `${SITE_URL}/guides/${entry.slug}`;
  const articleJsonLd = buildArticleJsonLd(entry, pageUrl);
  const webPageJsonLd = buildWebPageJsonLd(entry, pageUrl);

  return (
    <SEOPageShell
      breadcrumbs={[
        { label: "Guides", href: "/guides" },
        { label: entry.h1 },
      ]}
      relatedPages={entry.relatedSlugs}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />

      {/* Guide Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-5">
          <span
            className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md"
            style={{ backgroundColor: `${entry.tagColor}20`, color: entry.tagColor }}
          >
            {entry.tag}
          </span>
          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            {entry.readingTime}
          </span>
        </div>
        <h1
          className="text-3xl sm:text-4xl font-extrabold mb-5 leading-tight"
          style={{ color: "var(--color-text)", letterSpacing: "-0.02em" }}
        >
          {entry.h1}
        </h1>
        <p
          className="text-base leading-relaxed max-w-2xl"
          style={{ color: "var(--color-text-muted)" }}
        >
          {entry.subtitle}
        </p>
      </div>

      <TableOfContents sections={entry.sections} />

      {/* Article Sections */}
      {entry.sections.map((section) => (
        <section key={section.id} id={section.id} className="mb-12">
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--color-text)" }}>
            {section.heading}
          </h2>
          {section.body.split("\n\n").map((paragraph, i) => (
            <p
              key={i}
              className="text-sm leading-relaxed mb-4"
              style={{ color: "var(--color-text-muted)" }}
            >
              {paragraph}
            </p>
          ))}
        </section>
      ))}

      <div className="glow-line max-w-2xl mx-auto mb-12" />

      {/* Key Takeaways */}
      <section className="mb-16">
        <h2 className="text-xl font-bold mb-6" style={{ color: "var(--color-text)" }}>
          Key Takeaways
        </h2>
        <ul className="space-y-3 list-none p-0 m-0">
          {entry.keyTakeaways.map((takeaway, i) => (
            <li key={i} className="flex items-start gap-3">
              <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>{takeaway}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Tonvo CTA Section */}
      <section className="mb-16">
        <div
          className="rounded-xl border p-8"
          style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          {entry.tonvoCTA.label && (
            <p className="section-label mb-3" style={{ color: "var(--color-accent-light)" }}>{entry.tonvoCTA.label}</p>
          )}
          <h3 className="text-lg font-bold mb-3" style={{ color: "var(--color-text)" }}>
            {entry.tonvoCTA.heading}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            {entry.tonvoCTA.body}
          </p>
        </div>
      </section>

      <FAQAccordion items={entry.faq} />
    </SEOPageShell>
  );
}

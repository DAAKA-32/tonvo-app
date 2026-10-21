import Link from "next/link";
import type { RelatedSlug } from "@/data/seo/types";
import { getPageByTypeAndSlug } from "@/data/seo/registry";
import { getServerT } from "@/i18n/messages";
import { localePath, type Locale } from "@/i18n/locales-config";

const TYPE_KEYS: Record<string, string> = {
  "use-cases": "seoUi.typeUseCase",
  features: "seoUi.typeFeature",
  industries: "seoUi.typeIndustry",
  compare: "seoUi.typeComparison",
  guides: "seoUi.typeGuide",
};

export default async function RelatedPages({ pages, locale }: { pages: RelatedSlug[]; locale: Locale }) {
  // Only link to pages that exist in this language.
  const links = pages.filter((p) => getPageByTypeAndSlug(p.type, p.slug, locale));
  if (links.length === 0) return null;
  const t = await getServerT(locale);

  return (
    <section className="mb-16">
      <h2 className="text-xl font-bold text-center mb-8" style={{ color: "var(--color-text)" }}>
        {t("seoUi.relatedResources")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {links.map((page) => (
          <Link
            key={`${page.type}/${page.slug}`}
            href={localePath(`/${page.type}/${page.slug}`, locale)}
            className="rounded-xl border p-5 no-underline transition-all hover:border-opacity-60"
            style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", display: "block" }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-accent-light)" }}>
              {TYPE_KEYS[page.type] ? t(TYPE_KEYS[page.type]) : page.type}
            </span>
            <p className="text-sm font-semibold m-0 mt-2" style={{ color: "var(--color-text)" }}>
              {page.label}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

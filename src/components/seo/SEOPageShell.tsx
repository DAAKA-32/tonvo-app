import Link from "next/link";
import Breadcrumbs from "./Breadcrumbs";
import RelatedPages from "./RelatedPages";
import CTABanner from "./CTABanner";
import type { RelatedSlug } from "@/data/seo/types";
import { SEO_SECTIONS, seoHubLocales } from "@/data/seo/registry";
import { getServerT } from "@/i18n/messages";
import { DEFAULT_LOCALE, localePath, type Locale } from "@/i18n/locales-config";

interface BreadcrumbItem {
  label: string;
  /** Locale-prefixed path. */
  href?: string;
}

interface SEOPageShellProps {
  locale: Locale;
  breadcrumbs: BreadcrumbItem[];
  children: React.ReactNode;
  relatedPages?: RelatedSlug[];
}

export default async function SEOPageShell({ locale, breadcrumbs, children, relatedPages }: SEOPageShellProps) {
  const t = await getServerT(locale);

  return (
    <div style={{ backgroundColor: "var(--color-bg)", minHeight: "100vh" }}>
      <Breadcrumbs items={breadcrumbs} locale={locale} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {children}

        {relatedPages && relatedPages.length > 0 && <RelatedPages pages={relatedPages} locale={locale} />}

        <CTABanner locale={locale} />

        {/* Footer navigation: links to a hub in this language when it exists, to the English hub otherwise */}
        <div
          className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ borderColor: "var(--color-border)" }}
        >
          <Link href={localePath("/", locale)} className="text-sm no-underline font-medium" style={{ color: "var(--color-accent-light)" }}>
            &larr; {t("seoUi.backHome")}
          </Link>
          <div className="flex flex-wrap gap-4">
            {SEO_SECTIONS.map((section) => (
              <Link
                key={section.type}
                href={localePath(section.href, seoHubLocales(section.type).includes(locale) ? locale : DEFAULT_LOCALE)}
                className="footer-link text-xs"
              >
                {t(section.labelKey)}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

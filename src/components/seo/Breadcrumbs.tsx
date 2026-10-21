import Link from "next/link";
import { TonvoLogoMark } from "@/components/Logo";
import LanguageSelector from "@/components/LanguageSelector";
import { buildBreadcrumbJsonLd } from "@/data/seo/json-ld";
import { SITE_URL, localePath, type Locale } from "@/i18n/locales-config";
import { getServerT } from "@/i18n/messages";

interface BreadcrumbItem {
  label: string;
  /** Locale-prefixed path (already built by the caller). */
  href?: string;
}

export default async function Breadcrumbs({ items, locale }: { items: BreadcrumbItem[]; locale: Locale }) {
  const t = await getServerT(locale);
  const jsonLd = buildBreadcrumbJsonLd(
    items.map((item) => ({
      name: item.label,
      url: item.href ? `${SITE_URL}${item.href}` : undefined,
    }))
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <nav aria-label={t("seoUi.breadcrumb")} className="flex items-center gap-3 min-w-0">
          <Link href={localePath("/", locale)} className="flex items-center gap-2.5 no-underline">
            <TonvoLogoMark size="sm" />
            <span className="text-lg font-bold" style={{ color: "var(--color-text)" }}>Tonvo</span>
          </Link>
          {items.map((item, i) => (
            <span key={i} className="flex items-center gap-3">
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>/</span>
              {item.href ? (
                <Link href={item.href} className="footer-link text-sm font-medium">
                  {item.label}
                </Link>
              ) : (
                <span className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
                  {item.label}
                </span>
              )}
            </span>
          ))}
        </nav>
        <LanguageSelector />
        </div>
      </header>
    </>
  );
}

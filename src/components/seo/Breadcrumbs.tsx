import Link from "next/link";
import { TonvoLogoMark } from "@/components/Logo";
import { buildBreadcrumbJsonLd } from "@/data/seo/json-ld";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const SITE_URL = "https://tonvo.co";

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <TonvoLogoMark size="sm" />
            <span className="text-lg font-bold" style={{ color: "var(--color-text)" }}>Tonvo</span>
          </Link>
          {items.map((item, i) => (
            <span key={i} className="flex items-center gap-3">
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>/</span>
              {item.href ? (
                <Link href={item.href} className="text-sm font-medium no-underline hover:opacity-80 transition-opacity" style={{ color: "var(--color-text-muted)" }}>
                  {item.label}
                </Link>
              ) : (
                <span className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
                  {item.label}
                </span>
              )}
            </span>
          ))}
        </div>
      </header>
    </>
  );
}

import Link from "next/link";
import Breadcrumbs from "./Breadcrumbs";
import RelatedPages from "./RelatedPages";
import CTABanner from "./CTABanner";
import type { RelatedSlug, SEOPageType } from "@/data/seo/types";
import { SEO_SECTIONS } from "@/data/seo/registry";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface SEOPageShellProps {
  breadcrumbs: BreadcrumbItem[];
  children: React.ReactNode;
  relatedPages?: RelatedSlug[];
  cta?: {
    heading?: string;
    description?: string;
    buttonText?: string;
  };
}

export default function SEOPageShell({
  breadcrumbs,
  children,
  relatedPages,
  cta,
}: SEOPageShellProps) {
  return (
    <div style={{ backgroundColor: "var(--color-bg)", minHeight: "100vh" }}>
      <Breadcrumbs items={breadcrumbs} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {children}

        {relatedPages && relatedPages.length > 0 && (
          <RelatedPages pages={relatedPages} />
        )}

        <CTABanner {...cta} />

        {/* Footer navigation */}
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ borderColor: "var(--color-border)" }}>
          <Link
            href="/"
            className="text-sm no-underline font-medium"
            style={{ color: "var(--color-accent-light)" }}
          >
            &larr; Back to home
          </Link>
          <div className="flex flex-wrap gap-4">
            {SEO_SECTIONS.map((section) => (
              <Link
                key={section.type}
                href={section.href}
                className="text-xs no-underline hover:opacity-80 transition-opacity"
                style={{ color: "var(--color-text-muted)" }}
              >
                {section.label}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

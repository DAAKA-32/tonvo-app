import type { FAQItem } from "@/data/seo/types";
import { getServerT } from "@/i18n/messages";
import type { Locale } from "@/i18n/locales-config";

// No FAQPage structured data on purpose: Google only shows FAQ rich results for a small set of
// authoritative sites, so for this site the markup would be noise. The visible questions stay.
export default async function FAQAccordion({ items, locale }: { items: FAQItem[]; locale: Locale }) {
  if (items.length === 0) return null;
  const t = await getServerT(locale);

  return (
    <section className="mb-16">
      <h2
        className="text-xl font-bold text-center mb-8"
        style={{ color: "var(--color-text)" }}
      >
        {t("seoUi.faqTitle")}
      </h2>
      <div className="max-w-2xl mx-auto space-y-3">
        {items.map((item, i) => (
          <details
            key={i}
            className="group rounded-xl border"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <summary
              className="cursor-pointer px-6 py-4 text-sm font-semibold list-none flex items-center justify-between"
              style={{ color: "var(--color-text)" }}
            >
              {item.question}
              <svg
                className="shrink-0 ml-3 transition-transform group-open:rotate-180"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </summary>
            <div
              className="px-6 pb-5 text-sm leading-relaxed"
              style={{ color: "var(--color-text-muted)" }}
            >
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

import type { FAQItem, SEOPageBase, GuideEntry } from "./types";

const SITE_URL = "https://tonvo.co";

export function buildBreadcrumbJsonLd(
  items: { name: string; url?: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}

export function buildFAQJsonLd(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildWebPageJsonLd(entry: SEOPageBase, pageUrl: string, inLanguage = "en") {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    inLanguage,
    name: entry.title,
    description: entry.metaDescription,
    url: pageUrl,
    isPartOf: {
      "@type": "WebSite",
      name: "Tonvo",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Tonvo",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo-tonvo-remove.png`,
      },
    },
  };
}

export function buildArticleJsonLd(entry: GuideEntry, pageUrl: string, inLanguage = "en") {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    inLanguage,
    headline: entry.h1,
    description: entry.metaDescription,
    url: pageUrl,
    dateModified: entry.lastModified,
    author: {
      "@type": "Organization",
      name: "Tonvo",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Tonvo",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo-tonvo-remove.png`,
      },
    },
  };
}

export function buildProductJsonLd(
  name: string,
  description: string,
  url: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url,
    brand: {
      "@type": "Organization",
      name: "Tonvo",
    },
  };
}

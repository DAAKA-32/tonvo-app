import type { SEOPageEntry, SEOPageType } from "./types";
import { useCases } from "./use-cases";
import { features } from "./features";
import { industries } from "./industries";
import { comparisons } from "./comparisons";
import { guides } from "./guides";

export function getAllSEOPages(): SEOPageEntry[] {
  return [
    ...useCases,
    ...features,
    ...industries,
    ...comparisons,
    ...guides,
  ];
}

export function getSEOPagesByType(type: SEOPageType): SEOPageEntry[] {
  return getAllSEOPages().filter((p) => p.type === type);
}

export function getPageByTypeAndSlug(
  type: SEOPageType,
  slug: string
): SEOPageEntry | undefined {
  return getAllSEOPages().find((p) => p.type === type && p.slug === slug);
}

export const SEO_SECTIONS: { type: SEOPageType; label: string; href: string }[] = [
  { type: "use-cases", label: "Use Cases", href: "/use-cases" },
  { type: "features", label: "Features", href: "/features" },
  { type: "industries", label: "Industries", href: "/industries" },
  { type: "compare", label: "Comparisons", href: "/compare" },
  { type: "guides", label: "Guides", href: "/guides" },
];

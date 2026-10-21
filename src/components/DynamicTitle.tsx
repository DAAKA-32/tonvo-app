"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

/** Map pathname prefixes to pageTitle i18n keys */
const ROUTE_TITLE_MAP: Record<string, string> = {
  "/login": "pageTitle.login",
  "/dashboard": "pageTitle.dashboard",
  "/session": "pageTitle.session",
  "/history": "pageTitle.history",
  "/analyze-text": "pageTitle.analyzeText",
  "/analytics": "pageTitle.analytics",
  "/plans": "pageTitle.pricing",
  "/settings": "pageTitle.settings",
  "/profile": "pageTitle.profile",
};

/**
 * Dynamically updates document.title and html lang attribute
 * based on the current route and selected language.
 */
export default function DynamicTitle() {
  const pathname = usePathname();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;

    // Only routes listed above get a client-side title. Every other route (home,
    // features, use-cases, industries, compare, guides) keeps the title the server
    // rendered from src/lib/seo.ts, instead of being overwritten after hydration.
    for (const [prefix, key] of Object.entries(ROUTE_TITLE_MAP)) {
      if (pathname === prefix || pathname.startsWith(prefix + "/")) {
        document.title = `${t(key)} | Tonvo`;
        return;
      }
    }
  }, [pathname, t, i18n.language]);

  return null;
}

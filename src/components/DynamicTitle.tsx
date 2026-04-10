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
  "/pricing": "pageTitle.pricing",
  "/settings": "pageTitle.settings",
  "/profile": "pageTitle.profile",
  "/about": "pageTitle.about",
  "/privacy": "pageTitle.privacy",
  "/terms": "pageTitle.terms",
  "/cookies": "pageTitle.cookies",
  "/legal": "pageTitle.legal",
  "/blog": "pageTitle.blog",
};

/**
 * Dynamically updates document.title and html lang attribute
 * based on the current route and selected language.
 */
export default function DynamicTitle() {
  const pathname = usePathname();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Find matching route (longest prefix match)
    let titleKey = "pageTitle.default";
    for (const [prefix, key] of Object.entries(ROUTE_TITLE_MAP)) {
      if (pathname === prefix || pathname.startsWith(prefix + "/")) {
        titleKey = key;
        break;
      }
    }

    const pageTitle = t(titleKey);
    const isDefault = titleKey === "pageTitle.default";

    document.title = isDefault ? pageTitle : `${pageTitle} | Tonvo`;
    document.documentElement.lang = i18n.language;
  }, [pathname, t, i18n.language]);

  return null;
}

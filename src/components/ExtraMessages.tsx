"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { Locale } from "@/i18n/locales-config";

/**
 * Adds a page's own translation namespace to the per-request i18next instance of the public layout, before
 * its children render (so the server render and hydration both have the text). English is already bundled,
 * so nothing is sent for it.
 */
export default function ExtraMessages({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Record<string, unknown>;
  children: React.ReactNode;
}) {
  const { i18n } = useTranslation();
  useMemo(() => {
    i18n.addResourceBundle(locale, "translation", messages, true, true);
  }, [i18n, locale, messages]);
  return <>{children}</>;
}

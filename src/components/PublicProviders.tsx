"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import { createInstance } from "i18next";
import { I18nextProvider } from "react-i18next";
import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "@/components/Toast";
import ConsentBanner from "@/components/ConsentBanner";
import { PerformanceProvider } from "@/lib/performance";
import en from "@/i18n/locales/en.json";
import { DEFAULT_LOCALE, localePath, type Locale } from "@/i18n/locales-config";

/**
 * Providers for the public pages ([locale] route group).
 *
 * The language comes from the URL, so each request gets its OWN i18next instance: the module-level
 * instance used by the signed-in app is shared between requests on the server and must never be switched
 * per request. English is bundled; any other language arrives as `messages` from the server layout.
 */

const LocaleContext = createContext<Locale | null>(null);

/** The page language, or null outside the public pages (the signed-in app). */
export function useOptionalLocale(): Locale | null {
  return useContext(LocaleContext);
}

export function useLocale(): Locale {
  return useContext(LocaleContext) ?? DEFAULT_LOCALE;
}

/** Prefix a public path with the current page language. */
export function useLocalePath(): (path: string) => string {
  const locale = useLocale();
  return (path: string) => localePath(path, locale);
}

export default function PublicProviders({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages?: Record<string, unknown>;
  children: React.ReactNode;
}) {
  const i18n = useMemo(() => {
    const instance = createInstance();
    void instance.init({
      lng: locale,
      fallbackLng: "en",
      resources: {
        en: { translation: en },
        ...(locale !== "en" && messages ? { [locale]: { translation: messages } } : {}),
      },
      interpolation: { escapeValue: false },
      initAsync: false,
    });
    return instance;
  }, [locale, messages]);

  // Visiting a language URL is an explicit choice: remember it for the signed-in app. The unprefixed
  // English URL is the default and never overwrites a saved preference.
  useEffect(() => {
    if (locale === "en") return;
    try {
      localStorage.setItem("tonvo-language", locale);
    } catch {
      /* storage blocked: the app falls back to English */
    }
  }, [locale]);

  return (
    <LocaleContext.Provider value={locale}>
      <PerformanceProvider>
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
            <ToastProvider>
              {children}
              <ConsentBanner />
            </ToastProvider>
          </AuthProvider>
        </I18nextProvider>
      </PerformanceProvider>
    </LocaleContext.Provider>
  );
}

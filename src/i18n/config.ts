import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", flag: "GB" },
  { code: "es", label: "Espa\u00f1ol", flag: "ES" },
  { code: "fr", label: "Fran\u00e7ais", flag: "FR" },
  { code: "de", label: "Deutsch", flag: "DE" },
  { code: "pt", label: "Portugu\u00eas", flag: "PT" },
  { code: "it", label: "Italiano", flag: "IT" },
  { code: "nl", label: "Nederlands", flag: "NL" },
  { code: "zh", label: "\u4e2d\u6587", flag: "CN" },
  { code: "ja", label: "\u65e5\u672c\u8a9e", flag: "JP" },
  { code: "ko", label: "\ud55c\uad6d\uc5b4", flag: "KR" },
] as const;

const savedLang = typeof window !== "undefined" ? localStorage.getItem("tonvo-language") : null;

/** Lazy-load a locale bundle. Only the active language is fetched. */
const localeLoaders: Record<string, () => Promise<{ default: Record<string, unknown> }>> = {
  es: () => import("./locales/es.json"),
  fr: () => import("./locales/fr.json"),
  de: () => import("./locales/de.json"),
  pt: () => import("./locales/pt.json"),
  it: () => import("./locales/it.json"),
  nl: () => import("./locales/nl.json"),
  zh: () => import("./locales/zh.json"),
  ja: () => import("./locales/ja.json"),
  ko: () => import("./locales/ko.json"),
};

/** Load a language bundle on demand and add it to i18next. */
export async function loadLanguage(lang: string): Promise<void> {
  if (lang === "en" || i18n.hasResourceBundle(lang, "translation")) return;
  const loader = localeLoaders[lang];
  if (!loader) return;
  const mod = await loader();
  i18n.addResourceBundle(lang, "translation", mod.default, true, true);
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
  },
  lng: savedLang || "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

// If saved language is not English, eagerly load it
if (savedLang && savedLang !== "en") {
  loadLanguage(savedLang).then(() => {
    i18n.changeLanguage(savedLang);
  });
}

export default i18n;

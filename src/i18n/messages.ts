import type { Locale } from "./locales-config";

/**
 * Server-side access to the translation files (the client side uses i18next, see LocaleProvider).
 * Each locale file is loaded on demand, so only the requested language is bundled per request.
 */
type Messages = Record<string, unknown>;

const loaders: Record<Locale, () => Promise<{ default: Messages }>> = {
  en: () => import("./locales/en.json"),
  fr: () => import("./locales/fr.json"),
  es: () => import("./locales/es.json"),
  de: () => import("./locales/de.json"),
  pt: () => import("./locales/pt.json"),
  it: () => import("./locales/it.json"),
  nl: () => import("./locales/nl.json"),
  zh: () => import("./locales/zh.json"),
  ja: () => import("./locales/ja.json"),
  ko: () => import("./locales/ko.json"),
};

export async function getMessages(locale: Locale): Promise<Messages> {
  return (await loaders[locale]()).default;
}

function lookup(messages: Messages, key: string): string | undefined {
  let node: unknown = messages;
  for (const part of key.split(".")) {
    if (node && typeof node === "object" && part in (node as Record<string, unknown>)) {
      node = (node as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return typeof node === "string" ? node : undefined;
}

/**
 * A `t()` for server components and metadata: the page language first, English as the fallback,
 * and {{variable}} interpolation like i18next.
 */
export async function getServerT(locale: Locale) {
  const [primary, english] = await Promise.all([getMessages(locale), getMessages("en")]);
  return (key: string, vars?: Record<string, string | number>): string => {
    const raw = lookup(primary, key) ?? lookup(english, key) ?? key;
    return vars ? raw.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => String(vars[k] ?? "")) : raw;
  };
}

/** The given top-level namespaces of a language file (what a client page actually needs). */
export function pickNamespaces(messages: Messages, namespaces: readonly string[]): Messages {
  const out: Messages = {};
  for (const ns of namespaces) if (ns in messages) out[ns] = messages[ns];
  return out;
}

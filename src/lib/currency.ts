/**
 * ========================================================
 * Currency localization — display layer only
 * ========================================================
 * Maps the user's UI language to a display currency and
 * formats amounts via Intl.NumberFormat with locale-aware
 * grouping/decimals (e.g. "19,00 €" vs "$19").
 *
 * IMPORTANT: This is display-only. Stripe checkout still
 * charges in USD. A disclaimer is shown next to non-USD
 * prices via the `pricing.billedInUsd` translation key.
 *
 * 1:1 parity is intentional (Pro 19 EUR == 19 USD) so users
 * never feel arbitrage and the marketing message stays simple.
 * To switch to true multi-currency Stripe later: add EUR
 * Price IDs to env vars and route checkout through them based
 * on `getCurrencyForLanguage()` — no UI changes needed.
 * ========================================================
 */

export type SupportedCurrency = "USD" | "EUR";

/**
 * Languages that should display prices in EUR. Everything else
 * (en, ja, ko, zh, plus any future locales) falls back to USD.
 */
const EUR_LANGUAGES: ReadonlySet<string> = new Set([
  "fr",
  "de",
  "es",
  "it",
  "nl",
  "pt",
]);

export function getCurrencyForLanguage(lang: string | undefined): SupportedCurrency {
  if (!lang) return "USD";
  // Strip region tag if any (e.g. "fr-FR" -> "fr").
  const base = lang.toLowerCase().split("-")[0];
  return EUR_LANGUAGES.has(base) ? "EUR" : "USD";
}

/**
 * BCP-47 locale used for Intl formatting. Falls back to "en-US"
 * for unknown languages so number grouping stays sane.
 */
function intlLocale(lang: string | undefined): string {
  if (!lang) return "en-US";
  const base = lang.toLowerCase().split("-")[0];
  const localeMap: Record<string, string> = {
    en: "en-US",
    fr: "fr-FR",
    de: "de-DE",
    es: "es-ES",
    it: "it-IT",
    nl: "nl-NL",
    pt: "pt-PT",
    ja: "ja-JP",
    ko: "ko-KR",
    zh: "zh-CN",
  };
  return localeMap[base] ?? "en-US";
}

/**
 * Format a whole-number price in the user's display currency.
 * No fractional digits — our plans are always whole units
 * (Pro 19, Team 49, etc.) so "19 €" / "$19" reads cleanest.
 */
export function formatPrice(amount: number, lang: string | undefined): string {
  const currency = getCurrencyForLanguage(lang);
  try {
    return new Intl.NumberFormat(intlLocale(lang), {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(amount);
  } catch {
    // Defensive fallback if Intl is unavailable for some reason.
    const symbol = currency === "EUR" ? "€" : "$";
    return currency === "EUR" ? `${amount} ${symbol}` : `${symbol}${amount}`;
  }
}

/**
 * Format a yearly savings amount (e.g. "Save €68/year") in the
 * user's display currency. Used by getSavingsLabel().
 */
export function formatSavings(amount: number, lang: string | undefined): string {
  return formatPrice(amount, lang);
}

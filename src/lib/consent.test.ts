import fs from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CONSENT_EVENT, privacySignalOn, readConsent, writeConsent } from "@/lib/consent";
import { LOCALES } from "@/i18n/locales-config";
import { formatPrice, getCurrencyForLanguage } from "@/lib/currency";
import en from "@/i18n/locales/en.json";
import fr from "@/i18n/locales/fr.json";

/** A tiny browser: window with localStorage and events, navigator with the privacy signals. */
function stubBrowser(opts: { gpc?: boolean; dnt?: string; throwOnStorage?: boolean } = {}) {
  const store = new Map<string, string>();
  const listeners: Array<() => void> = [];
  const localStorage = {
    getItem: (k: string) => {
      if (opts.throwOnStorage) throw new Error("blocked");
      return store.get(k) ?? null;
    },
    setItem: (k: string, v: string) => {
      if (opts.throwOnStorage) throw new Error("blocked");
      store.set(k, v);
    },
    removeItem: (k: string) => store.delete(k),
  };
  const win = {
    localStorage,
    addEventListener: (_: string, cb: () => void) => listeners.push(cb),
    dispatchEvent: () => {
      listeners.forEach((cb) => cb());
      return true;
    },
  };
  vi.stubGlobal("window", win);
  vi.stubGlobal("navigator", { globalPrivacyControl: opts.gpc, doNotTrack: opts.dnt });
  return { store, listeners };
}

describe("cookie consent", () => {
  beforeEach(() => vi.unstubAllGlobals());
  afterEach(() => vi.unstubAllGlobals());

  it("no answer means no: nothing is granted until the visitor accepts", () => {
    stubBrowser();
    expect(readConsent()).toBeNull();
  });

  it("stores and returns an explicit choice, and tells listeners", () => {
    const { listeners } = stubBrowser();
    const seen = vi.fn();
    listeners.push(seen);
    writeConsent("granted");
    expect(readConsent()).toBe("granted");
    writeConsent("denied");
    expect(readConsent()).toBe("denied");
    expect(seen).toHaveBeenCalledTimes(2);
    expect(CONSENT_EVENT).toBe("tonvo:consent");
  });

  it("clearing the choice makes the banner ask again", () => {
    stubBrowser();
    writeConsent("granted");
    writeConsent(null);
    expect(readConsent()).toBeNull();
  });

  it("a Global Privacy Control or Do Not Track signal is a refusal, even after an earlier accept", () => {
    const { store } = stubBrowser({ gpc: true });
    store.set("tonvo_consent_v1", "granted");
    expect(privacySignalOn()).toBe(true);
    expect(readConsent()).toBe("denied");
    stubBrowser({ dnt: "1" });
    expect(readConsent()).toBe("denied");
  });

  it("blocked storage never counts as consent", () => {
    stubBrowser({ throwOnStorage: true });
    expect(readConsent()).toBeNull();
    expect(() => writeConsent("granted")).not.toThrow();
  });

  it("does nothing on the server", () => {
    expect(readConsent()).toBeNull();
    expect(() => writeConsent("granted")).not.toThrow();
  });
});

describe("the Meta Pixel can only load after consent", () => {
  const srcDir = path.resolve(__dirname, "..");
  const read = (p: string) => fs.readFileSync(path.join(srcDir, p), "utf8");

  it("the loader checks consent, and has no unconditional noscript pixel", () => {
    const loader = read("components/MetaPixel.tsx");
    expect(loader).toMatch(/readConsent\(\)\s*===\s*"granted"/);
    expect(loader).toMatch(/if \(!pixelId \|\| !granted\) return null/);
    expect(loader).not.toMatch(/<noscript>/);
    expect(loader).not.toMatch(/facebook\.com\/tr/);
  });

  it("nothing else in the app talks to Meta", () => {
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) walk(full);
        else if (/\.(ts|tsx)$/.test(e.name) && !/\.test\./.test(e.name) && /connect\.facebook\.net|facebook\.com\/tr|fbevents/.test(fs.readFileSync(full, "utf8"))) {
          offenders.push(path.relative(srcDir, full).split(path.sep).join("/"));
        }
      }
    };
    walk(srcDir);
    // the loader itself, and the API route that mirrors events server side (reached only when fbq produced an id)
    expect(offenders.filter((f) => f !== "components/MetaPixel.tsx" && f !== "app/api/meta-capi/route.ts")).toEqual([]);
  });

  it("the server-side mirror only fires for an event the browser pixel produced", () => {
    const lib = read("lib/meta-pixel.ts");
    expect(lib).toMatch(/if \(!eventId\) return;/);
    expect(lib).toMatch(/if \(typeof window === "undefined" \|\| !window\.fbq\) return undefined;/);
  });

  it("the cookie policy no longer claims there is no third-party analytics, in any language", () => {
    for (const lang of ["en", "fr"] as const) {
      const text = JSON.stringify(lang === "en" ? en.cookiesPage : fr.cookiesPage);
      expect(text).toMatch(/Meta Pixel/);
      expect(text).not.toMatch(/We do not use third-party analytics|Aucun pour le moment|n'utilisons pas de services d'analyse tiers/i);
    }
    for (const l of LOCALES) {
      const o = JSON.parse(fs.readFileSync(path.join(srcDir, "i18n", "locales", `${l}.json`), "utf8"));
      expect(JSON.stringify(o.cookiesPage.cookie3Examples), l).toMatch(/Meta Pixel/);
      expect(JSON.stringify(o.consent), l).toMatch(/Meta/);
      expect(o.consent.accept && o.consent.decline, l).toBeTruthy();
      expect(o.consent.accept, `${l}: accept and decline must be different buttons`).not.toBe(o.consent.decline);
    }
  });
});

describe("prices are shown in the currency that is charged (USD)", () => {
  it("every language shows USD", () => {
    for (const l of LOCALES) expect(getCurrencyForLanguage(l), l).toBe("USD");
  });

  it("a French or German reader sees dollars, never euros", () => {
    for (const l of ["fr", "de", "es", "it", "nl", "pt"] as const) {
      const price = formatPrice(19, l);
      expect(price, l).toMatch(/\$|USD/);
      expect(price, l).not.toMatch(/€|EUR/);
      expect(price, l).toMatch(/19/);
    }
    expect(formatPrice(19, "en")).toBe("$19");
  });
});

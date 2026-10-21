import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import en from "@/i18n/locales/en.json";
import fr from "@/i18n/locales/fr.json";
import es from "@/i18n/locales/es.json";
import de from "@/i18n/locales/de.json";
import pt from "@/i18n/locales/pt.json";
import it_ from "@/i18n/locales/it.json";
import nl from "@/i18n/locales/nl.json";
import zh from "@/i18n/locales/zh.json";
import ja from "@/i18n/locales/ja.json";
import ko from "@/i18n/locales/ko.json";
import { PRICING_PLANS } from "@/lib/pricing-config";
import { PLAN_FEATURES } from "@/lib/plan-features";

type Json = string | string[] | { [k: string]: Json };

function flatten(node: Json, prefix = "", out: Record<string, string> = {}): Record<string, string> {
  if (typeof node === "string") {
    out[prefix] = node;
  } else if (Array.isArray(node)) {
    node.forEach((v, i) => flatten(v, `${prefix}[${i}]`, out));
  } else {
    for (const [k, v] of Object.entries(node)) flatten(v, prefix ? `${prefix}.${k}` : k, out);
  }
  return out;
}

const EN = flatten(en as Json);
const FR = flatten(fr as Json);

/**
 * Locales whose translation of the repositioning copy is still to do. For these, keys that were
 * rewritten were removed so they fall back to English (src/i18n/config.ts: fallbackLng "en"),
 * which is why only "no extra keys" is enforced for them. Remove a locale from this list, and
 * add it to STRICT_LOCALES, once it is fully translated.
 */
const PENDING_LOCALES: Record<string, Json> = { es, de, pt, it: it_, nl, zh, ja, ko } as Record<string, Json>;
const STRICT_LOCALES: Record<string, Record<string, string>> = { fr: FR };

describe("i18n key parity", () => {
  for (const [name, flat] of Object.entries(STRICT_LOCALES)) {
    it(`${name} has exactly the keys of en`, () => {
      const missing = Object.keys(EN).filter((k) => !(k in flat));
      const extra = Object.keys(flat).filter((k) => !(k in EN));
      expect({ missing, extra }).toEqual({ missing: [], extra: [] });
    });
  }

  for (const [name, json] of Object.entries(PENDING_LOCALES)) {
    it(`${name} (translation pending) has no key that en lacks`, () => {
      const flat = flatten(json);
      const extra = Object.keys(flat).filter((k) => !(k in EN));
      expect(extra).toEqual([]);
    });
  }
});

/** Marketing surfaces: the brand bible bans decorative dashes and unverifiable claims there. */
const MARKETING_NAMESPACES = ["landing", "pricing", "footer", "pageTitle", "upgrade", "mockup", "onboarding"];
const BANNED_CLAIMS = [
  /close[- ]?rate/i,
  /win[- ]?rate/i,
  /\bthousands of\b/i,
  /\b\d+(\.\d+)?x\b/i,
  /\+\d+\s?%/,
  /objection (library|win)/i,
  /\bscoreboard\b/i,
  /\bSOC ?2\b|\bHIPAA\b/i,
];

describe("marketing copy guards (en + fr)", () => {
  for (const [locale, flat] of [["en", EN], ["fr", FR]] as const) {
    const entries = Object.entries(flat).filter(([k]) => MARKETING_NAMESPACES.includes(k.split(/[.[]/)[0]));

    it(`${locale}: has marketing keys to check`, () => {
      expect(entries.length).toBeGreaterThan(100);
    });

    it(`${locale}: no em-dash, en-dash or double hyphen in marketing copy`, () => {
      const bad = entries.filter(([, v]) => /[—–]|--/.test(v)).map(([k]) => k);
      expect(bad).toEqual([]);
    });

    it(`${locale}: no gated or unverifiable claim in marketing copy`, () => {
      const bad = entries
        .filter(([, v]) => BANNED_CLAIMS.some((re) => re.test(v)))
        .map(([k, v]) => `${k}: ${v}`);
      expect(bad).toEqual([]);
    });
  }

  it("removed keys stay removed", () => {
    expect("landing.testimonials.q1" in EN).toBe(false);
    expect("landing.benefits.realtime" in EN).toBe(false);
    expect("landing.hero.badge" in EN).toBe(false);
  });
});

describe("whole-file copy guards (en + fr)", () => {
  for (const [locale, flat] of [["en", EN], ["fr", FR]] as const) {
    const all = Object.entries(flat);

    it(`${locale}: nothing is called "invisible" or "stealth" (it is hidden only in a shared tab or window)`, () => {
      const bad = all.filter(([, v]) => /\binvisible\b|\bstealth\b/i.test(v)).map(([k, v]) => `${k}: ${v}`);
      expect(bad).toEqual([]);
    });

    it(`${locale}: old plan names are gone (Pro, Closer, Starter, Sales Team)`, () => {
      const bad = all
        .filter(([, v]) => /\bPro\b|\bCloser\b|\bStarter\b|\bSales Team\b/.test(v))
        .map(([k, v]) => `${k}: ${v}`);
      expect(bad).toEqual([]);
    });
  }

  it("fr uses the same plan names as en", () => {
    for (const key of ["planFree", "planPro", "planTeam"]) {
      expect(FR[`pricing.${key}.name`]).toBe(EN[`pricing.${key}.name`]);
    }
  });
});

describe("every static translation key used in code exists in en.json", () => {
  const srcDir = path.resolve(__dirname, "..");

  function files(dir: string, out: string[] = []): string[] {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) files(full, out);
      else if (/\.(ts|tsx)$/.test(entry.name) && !/\.test\.ts$/.test(entry.name)) out.push(full);
    }
    return out;
  }

  it("has no t(\"a.b\") call pointing at a missing key", () => {
    const known = new Set(Object.keys(EN).map((k) => k.replace(/\[\d+\]/g, "")));
    const missing: string[] = [];
    let checked = 0;
    // t("a.b") or t("a.b", { ... }); calls that pass an inline default string are skipped.
    const call = /\bt\(\s*["']([A-Za-z0-9_]+(?:\.[A-Za-z0-9_]+)+)["']\s*(,\s*["'`])?/g;
    for (const file of files(srcDir)) {
      const text = fs.readFileSync(file, "utf8");
      let m: RegExpExecArray | null;
      while ((m = call.exec(text))) {
        if (m[2]) continue;
        const key = m[1];
        checked++;
        const exists = known.has(key) || [...known].some((k) => k.startsWith(key + "."));
        if (!exists) missing.push(`${path.relative(srcDir, file)}: ${key}`);
      }
    }
    expect(checked).toBeGreaterThan(200); // guards against the scan silently matching nothing
    expect(missing).toEqual([]);
  });
});

describe("pricing is one source of truth", () => {
  const I18N_KEY = { free: "planFree", pro: "planPro", team: "planTeam" } as const;
  const OVERPROMISE = /\bAPI\b|\bSSO\b|playbook|dashboard|\bPDF\b|\bCSV\b|\bCRM\b|revenue coach/i;

  for (const plan of PRICING_PLANS) {
    const key = `pricing.${I18N_KEY[plan.id]}`;

    it(`${plan.id}: pricing-config text matches en.json`, () => {
      expect(plan.name).toBe(EN[`${key}.name`]);
      expect(plan.description).toBe(EN[`${key}.description`]);
      expect(plan.cta).toBe(EN[`${key}.cta`]);
      const enFeatures = Object.keys(EN)
        .filter((k) => k.startsWith(`${key}.features[`))
        .map((k) => EN[k]);
      expect(plan.features).toEqual(enFeatures);
    });

    it(`${plan.id}: fr has the same number of feature lines as en`, () => {
      const count = (flat: Record<string, string>) =>
        Object.keys(flat).filter((k) => k.startsWith(`${key}.features[`)).length;
      expect(count(FR)).toBe(count(EN));
    });

    it(`${plan.id}: promises nothing the product does not do`, () => {
      expect(plan.features.filter((f) => OVERPROMISE.test(f))).toEqual([]);
    });
  }

  it("free plan text matches the real limits in plan-features", () => {
    expect(PLAN_FEATURES.free.sessionsPerMonth).toBe(3);
    expect(PLAN_FEATURES.free.maxSessionDurationSec).toBe(5 * 60);
    expect(PRICING_PLANS[0].features[0]).toBe("3 live sessions per month, up to 5 minutes each");
  });

  it("screen analysis is advertised on Team only, like in plan-features", () => {
    expect(PLAN_FEATURES.pro.screenAnalysis).toBe(false);
    expect(PLAN_FEATURES.team.screenAnalysis).toBe(true);
    const mentionsScreen = (id: string) =>
      PRICING_PLANS.find((p) => p.id === id)!.features.some((f) => /screen analysis/i.test(f));
    expect(mentionsScreen("pro")).toBe(false);
    expect(mentionsScreen("team")).toBe(true);
  });

  it("live translation is advertised on Plus, which has the overlay", () => {
    expect(PLAN_FEATURES.free.copilotOverlay).toBe(false);
    expect(PLAN_FEATURES.pro.copilotOverlay).toBe(true);
    expect(PRICING_PLANS[1].features).toContain("Live translation");
  });
});

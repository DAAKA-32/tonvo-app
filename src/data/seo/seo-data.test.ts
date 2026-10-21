import { describe, expect, it } from "vitest";
import { getAllSEOPages, getPageByTypeAndSlug } from "./registry";

/** Every string in an entry, with its path, so a failure names the exact field. */
function strings(node: unknown, at: string, out: Array<[string, string]> = []): Array<[string, string]> {
  if (typeof node === "string") out.push([at, node]);
  else if (Array.isArray(node)) node.forEach((v, i) => strings(v, `${at}[${i}]`, out));
  else if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) strings(v, `${at}.${k}`, out);
  }
  return out;
}

const pages = getAllSEOPages();

describe("programmatic SEO pages", () => {
  it("has pages to check", () => {
    expect(pages.length).toBeGreaterThanOrEqual(34);
  });

  it("shows no invented statistics or testimonials", () => {
    const bad = pages.filter((p) => {
      const anyP = p as unknown as { stats?: unknown[]; testimonial?: unknown };
      return (anyP.stats?.length ?? 0) > 0 || anyP.testimonial !== undefined;
    });
    expect(bad.map((p) => `${p.type}/${p.slug}`)).toEqual([]);
  });

  it("links only to pages that exist", () => {
    const dead: string[] = [];
    for (const p of pages) {
      for (const r of p.relatedSlugs) {
        if (!getPageByTypeAndSlug(r.type, r.slug)) dead.push(`${p.type}/${p.slug} -> ${r.type}/${r.slug}`);
      }
      const links = (p as unknown as { useCaseLinks?: string[] }).useCaseLinks ?? [];
      for (const slug of links) {
        if (!getPageByTypeAndSlug("use-cases", slug)) dead.push(`${p.type}/${p.slug} -> use-cases/${slug}`);
      }
    }
    expect(dead).toEqual([]);
  });

  it("describes only what the product does", () => {
    // Claims the code does not support (audio is captured from the mic or a shared tab, not by joining
    // calls; analysis runs on the transcript; Team has no dashboards). Guides are editorial advice, so
    // only the invented-research subset applies to them (see the next test).
    const PRODUCT_CLAIM =
      /joins? your|directly inside|fine-tuned|trained on|filler word|vocal pitch|pitch, pace|cadence|manager (?:dashboard|insights)|sentiment dashboard|shared (?:candidate|client) |cross-consultant|Under 2 minutes|within 60 seconds|500,000/i;
    // Old plan names, matched case-sensitively so "a sales team" in plain prose is fine.
    const OLD_PLAN_NAME = /\bPro (?:plan|subscription)\b|\$19\/mo Pro\b|to Pro\b|upgrade to Pro|\bStarter\b|\bSales Team\b/;
    // A sentence that DENIES a capability ("Tonvo does not join your call", "no manager dashboard") is honest
    // and wanted. Only affirmative sentences are checked, and comparison row labels are only dimensions.
    const NEGATION = /\b(no|not|never|without|neither|nor|cannot)\b|n't\b|\u2019t\b/i;
    const affirmative = (text: string) => text.split(/(?<=[.!?])\s+/).filter((sentence) => !NEGATION.test(sentence));
    const bad: string[] = [];
    for (const p of pages.filter((x) => x.type !== "guides")) {
      for (const [at, text] of strings(p, `${p.type}/${p.slug}`)) {
        if (/comparisonRows\[\d+\]\.feature$/.test(at)) continue;
        if (OLD_PLAN_NAME.test(text)) bad.push(`${at}: ${text.slice(0, 90)}`);
        else if (affirmative(text).some((sentence) => PRODUCT_CLAIM.test(sentence))) bad.push(`${at}: ${text.slice(0, 90)}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it("guides contain no invented research", () => {
    const bad: string[] = [];
    for (const p of pages.filter((x) => x.type === "guides")) {
      for (const [at, text] of strings(p, `${p.type}/${p.slug}`)) {
        if (/500,000|trained on|fine-tuned|may be even higher|this specific ratio/i.test(text)) bad.push(`${at}: ${text.slice(0, 90)}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it("qualifies the separate window as a paid-plan behaviour", () => {
    // Free has no Picture-in-Picture window (copilotPiP is false), so "runs in its own window" must name the plans.
    const bad: string[] = [];
    for (const p of pages) {
      for (const [at, text] of strings(p, `${p.type}/${p.slug}`)) {
        if (/(?:runs|opens) in (?:its own|a separate) window/i.test(text) && !/Plus and Team/.test(text)) {
          bad.push(`${at}: ${text.slice(0, 90)}`);
        }
      }
    }
    expect(bad).toEqual([]);
  });

  it("makes no unverifiable claim", () => {
    const CLAIM =
      /\d+(\.\d+)?\s?%|\bthousands of\b|sub-200ms|\bstealth\b|without anyone knowing|compliance-(aware|friendly)|Salesforce study|Mehrabian/i;
    const bad: string[] = [];
    for (const p of pages) {
      for (const [at, text] of strings(p, `${p.type}/${p.slug}`)) {
        if (CLAIM.test(text)) bad.push(`${at}: ${text.slice(0, 90)}`);
      }
    }
    expect(bad).toEqual([]);
  });
});

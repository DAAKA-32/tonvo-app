// Builds one review sheet per language for a native reviewer: the texts that matter most for search and
// conversion, English next to the translation, with a column to fill in.
//   node scripts/i18n/export-review.mjs        (or: npm run i18n:review)
// Output: docs/specs/translation-review/<lang>.md and an index README.md
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const LOCALES_DIR = path.join(root, "src", "i18n", "locales");
const OUT = path.join(root, "docs", "specs", "translation-review");
fs.mkdirSync(OUT, { recursive: true });

const LANGS = {
  fr: "Français", es: "Español", de: "Deutsch", pt: "Português", it: "Italiano",
  nl: "Nederlands", zh: "中文 (简体)", ja: "日本語", ko: "한국어",
};
const CJK = new Set(["zh", "ja", "ko"]);
const load = (l) => JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, `${l}.json`), "utf8"));
const en = load("en");
const get = (o, k) => k.split(".").reduce((a, p) => (a == null ? a : a[p]), o);
const esc = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ");

// Priority order: what shows in search results first, then the home page, then pricing and consent.
const SECTIONS = [
  ["A. Search results (title and description of each page)", [
    "seo.home.title", "seo.home.description", "seo.pricing.title", "seo.pricing.description",
    "seo.about.title", "seo.about.description", "seo.privacy.title", "seo.privacy.description",
    "seo.terms.title", "seo.terms.description", "seo.cookies.title", "seo.cookies.description",
    "seo.legal.title", "seo.legal.description", "seo.organization",
  ]],
  ["B. Home page", [
    "landing.hero.headline1", "landing.hero.headline2", "landing.hero.headline2Phrases", "landing.hero.subtitle",
    "landing.hero.cta", "landing.hero.ctaSecondary",
    "landing.problem.label", "landing.problem.heading1", "landing.problem.heading2", "landing.problem.p1",
    "landing.solution.label", "landing.solution.heading1", "landing.solution.heading2", "landing.solution.desc",
    "landing.solution.step1Title", "landing.solution.step1Desc", "landing.solution.step2Title", "landing.solution.step2Desc",
    "landing.solution.step3Title", "landing.solution.step3Desc",
    "landing.features.label", "landing.features.heading1", "landing.features.heading2",
    "landing.features.liveTone", "landing.features.liveToneDesc", "landing.features.smartSuggestions", "landing.features.smartSuggestionsDesc",
    "landing.features.conversationInsights", "landing.features.conversationInsightsDesc", "landing.features.textAnalysis", "landing.features.textAnalysisDesc",
    "landing.useCases.heading", "landing.useCases.salesTitle", "landing.useCases.salesDesc", "landing.useCases.supportTitle", "landing.useCases.supportDesc",
    "landing.useCases.interviewsTitle", "landing.useCases.interviewsDesc", "landing.useCases.meetingsTitle", "landing.useCases.meetingsDesc",
    "landing.cta.heading1", "landing.cta.heading2", "landing.cta.desc", "landing.cta.button", "landing.cta.note",
    "landing.faq.title", "landing.faq.q1", "landing.faq.a1", "landing.faq.q2", "landing.faq.a2", "landing.faq.q3", "landing.faq.a3",
    "landing.faq.q4", "landing.faq.a4", "landing.faq.q5", "landing.faq.a5", "landing.faq.q6", "landing.faq.a6", "landing.faq.q7", "landing.faq.a7",
  ]],
  ["C. Pricing page", [
    "pricing.title", "pricing.subtitle", "pricing.guarantee",
    "pricing.planFree.name", "pricing.planFree.description", "pricing.planFree.features", "pricing.planFree.cta",
    "pricing.planPro.name", "pricing.planPro.description", "pricing.planPro.features", "pricing.planPro.cta",
    "pricing.planTeam.name", "pricing.planTeam.description", "pricing.planTeam.features", "pricing.planTeam.cta",
    "pricingPage.faqTitle", "pricingPage.faq.q1", "pricingPage.faq.a1", "pricingPage.faq.q2", "pricingPage.faq.a2", "pricingPage.faq.q3", "pricingPage.faq.a3",
  ]],
  ["D. Cookie banner and cookie policy (legal wording: faithful, not softer, not stronger)", [
    "consent.title", "consent.body", "consent.accept", "consent.decline", "consent.policy",
    "cookiesPage.cookie3Desc", "cookiesPage.cookie3Examples", "cookiesPage.cookie4Examples", "cookiesPage.managePrefs", "privacyPage.s6Meta",
  ]],
];

const LEGAL_NS = ["privacyPage", "termsPage", "cookiesPage", "legalPage"];
const count = (o) => (o && typeof o === "object" ? Object.values(o).reduce((n, v) => n + (typeof v === "string" ? 1 : count(v)), 0) : 0);

const index = [];
for (const [lang, name] of Object.entries(LANGS)) {
  const loc = load(lang);
  const lines = [];
  lines.push(`# Translation review: ${name} (${lang})`, "");
  lines.push("Reviewer: native speaker of the language, ideally with some marketing or legal reading experience.", "");
  lines.push("How to review", "", "1. Read each row. If the translation is fine, write `OK` in the last column. If not, write the corrected text there.",
    "2. Check that it sounds natural to a native reader, uses the register of the rest of the site, and keeps the meaning of the English (no softer, no stronger, no added promise).",
    "3. Product terms stay as they are: **Tonvo**, **Free**, **Plus**, **Team**, prices in **$ / USD**.",
    `4. Search results: a title should stay within ${CJK.has(lang) ? "about 30" : "60"} characters and a description within ${CJK.has(lang) ? "about 80" : "160"} (the length is shown). They are what people see on Google before clicking.`,
    "5. Variables such as `{{plan}}` must stay unchanged.", "");
  let rows = 0;
  for (const [title, keys] of SECTIONS) {
    lines.push(`## ${title}`, "", "| Key | English | Translation | Length | Review |", "|---|---|---|---|---|");
    for (const key of keys) {
      const e = get(en, key);
      const t = get(loc, key);
      if (e === undefined) continue;
      const join = (v) => (Array.isArray(v) ? v.join(" / ") : v);
      const tv = join(t);
      lines.push(`| \`${key}\` | ${esc(join(e))} | ${esc(tv)} | ${typeof tv === "string" ? [...tv].length : ""} |  |`);
      rows++;
    }
    lines.push("");
  }
  lines.push("## E. Legal pages (read in the file, not copied here)", "",
    "These are long. Please read them in full, in this order, and note any sentence whose meaning differs from the English:", "");
  for (const ns of LEGAL_NS) lines.push(`- \`${ns}\` in \`src/i18n/locales/${lang}.json\` (${count(loc[ns])} texts), compared with \`en.json\``);
  lines.push("", "Note: the legal texts carry the date of the English version (\"Last updated: March 17, 2026\"). They are machine-translated and have **not** been reviewed by a lawyer or a native speaker.", "");
  fs.writeFileSync(path.join(OUT, `${lang}.md`), lines.join("\n"), "utf8");
  index.push({ lang, name, rows, legal: LEGAL_NS.reduce((n, ns) => n + count(loc[ns]), 0) });
}

const readme = [
  "# Translation review sheets",
  "",
  "All translations (interface, search-result texts, legal pages, the French SEO pages) were produced by AI with automated checks on variables, lengths and punctuation. **None has been reviewed by a native speaker.**",
  "",
  "Send one sheet per language to a native reviewer. Priority: A (search results) and B (home page), then C and D, then the legal pages (E).",
  "",
  "| Language | Sheet | Rows to review | Legal texts | Status |",
  "|---|---|---|---|---|",
  ...index.map((i) => `| ${i.name} | [${i.lang}.md](${i.lang}.md) | ${i.rows} | ${i.legal} | to review |`),
  "",
  "Not covered by a sheet: the 34 French SEO pages (`src/data/seo/fr/`, about 35,000 words) and the English originals. Review those with the same checklist, titles and descriptions first.",
  "",
  "After a review: apply the corrections in `src/i18n/locales/<lang>.json`, then run `npm run i18n:review` to refresh the sheets, and change the status here.",
  "",
  "Regenerate: `npm run i18n:review`.",
  "",
].join("\n");
fs.writeFileSync(path.join(OUT, "README.md"), readme, "utf8");
console.log("review sheets written:", index.map((i) => `${i.lang}(${i.rows})`).join(" "));

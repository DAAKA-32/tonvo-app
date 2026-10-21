// Renders scripts/og/og-card.html to the social preview image (1200 x 630, opaque PNG).
//   node scripts/og/render-og.mjs
// Writes public/og/tonvo-og-v2.png (referenced by src/lib/seo.ts) and refreshes the legacy public/og-image.png.
// Needs network access for the Inter web font (Google Fonts).
import { chromium } from "playwright";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..");
const out = path.join(root, "public", "og", "tonvo-og-v2.png");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(path.join(here, "og-card.html")).href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
const family = await page.evaluate(() => document.fonts.check('800 88px "Inter"'));
if (!family) throw new Error("Inter did not load: refusing to render with a fallback font");
fs.mkdirSync(path.dirname(out), { recursive: true });
await page.locator("#card").screenshot({ path: out, omitBackground: false });
await browser.close();
fs.copyFileSync(out, path.join(root, "public", "og-image.png"));
console.log("wrote", path.relative(root, out), fs.statSync(out).size, "bytes");

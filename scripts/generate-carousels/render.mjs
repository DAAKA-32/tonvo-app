import { mkdir, writeFile, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import puppeteer from "puppeteer";
import { brand, carousels } from "./data.mjs";
import { renderSlideHtml } from "./template.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..");
const OUT_DIR = join(ROOT, "images");
const VIEWPORT = { width: 1080, height: 1350, deviceScaleFactor: 2 };

async function run() {
  console.log("→ Cleaning output dir:", OUT_DIR);
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  console.log("→ Launching headless browser…");
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--font-render-hinting=none"],
  });

  const manifest = {
    generated_at: new Date().toISOString(),
    product: brand.name,
    tagline: brand.tagline,
    dimensions: { width: VIEWPORT.width, height: VIEWPORT.height, dpr: VIEWPORT.deviceScaleFactor },
    design_system: {
      palette: [brand.colors.bg, brand.colors.emerald, brand.colors.text],
      fonts: ["Inter", "JetBrains Mono"],
      mockup_style: "flat dark UI mockup",
    },
    carousels: [],
  };

  try {
    for (const carousel of carousels) {
      const dir = join(OUT_DIR, carousel.id);
      await mkdir(dir, { recursive: true });
      console.log(`\n═ ${carousel.id} — ${carousel.angle}`);

      const total = carousel.slides.length;
      const slideManifest = [];

      for (let i = 0; i < total; i++) {
        const slide = carousel.slides[i];
        const slideIndex = i + 1;
        const html = renderSlideHtml({
          brand,
          slide,
          slideIndex,
          totalSlides: total,
        });

        const page = await browser.newPage();
        await page.setViewport(VIEWPORT);
        await page.setContent(html, { waitUntil: "networkidle0" });
        // Extra wait for web fonts to paint
        await page.evaluate(() => document.fonts.ready);

        const filePath = join(dir, `slide-${String(slideIndex).padStart(2, "0")}.png`);
        await page.screenshot({
          path: filePath,
          type: "png",
          clip: { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height },
        });
        await page.close();

        console.log(`  ✓ slide-${String(slideIndex).padStart(2, "0")}.png [${slide.type}]`);
        slideManifest.push({
          index: slideIndex,
          type: slide.type,
          file: `${carousel.id}/slide-${String(slideIndex).padStart(2, "0")}.png`,
        });
      }

      manifest.carousels.push({
        id: carousel.id,
        angle: carousel.angle,
        hook: carousel.hook,
        cta: carousel.cta,
        slides: slideManifest,
      });
    }

    await writeFile(join(OUT_DIR, "_manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
    console.log("\n✓ Manifest written:", join(OUT_DIR, "_manifest.json"));
  } finally {
    await browser.close();
  }

  console.log(`\n🎨 Generated ${manifest.carousels.length} carousels, ${manifest.carousels.reduce((a, c) => a + c.slides.length, 0)} slides total.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

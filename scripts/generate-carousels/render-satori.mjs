import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { writeFile, mkdir, rm, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { brand, carousels } from "./data.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..");
const OUT_DIR = join(ROOT, "images");
const LOGO_PATH = join(ROOT, "public", "logo-tonvo.png");

const W = 1080;
const H = 1350;

const T = brand.colors;

// ── Load brand logo ──
const logoBuf = await readFile(LOGO_PATH);
const LOGO_DATA_URL = `data:image/png;base64,${logoBuf.toString("base64")}`;

// ── Fonts ──
async function loadFont(family, weight) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}&display=swap`,
    { headers: { "User-Agent": "Mozilla/5.0" } },
  ).then((r) => r.text());
  const url = css.match(/src: url\((.+?)\) format/)[1];
  return fetch(url).then((r) => r.arrayBuffer());
}

console.log("→ Loading fonts (Inter 400-800 + IBM Plex Mono 400/700)…");
const [i4, i5, i6, i7, i8, i9, m4, m7] = await Promise.all([
  loadFont("Inter", 400),
  loadFont("Inter", 500),
  loadFont("Inter", 600),
  loadFont("Inter", 700),
  loadFont("Inter", 800),
  loadFont("Inter", 900),
  loadFont("IBM Plex Mono", 400),
  loadFont("IBM Plex Mono", 700),
]);

const fonts = [
  { name: "Inter", data: i4, weight: 400, style: "normal" },
  { name: "Inter", data: i5, weight: 500, style: "normal" },
  { name: "Inter", data: i6, weight: 600, style: "normal" },
  { name: "Inter", data: i7, weight: 700, style: "normal" },
  { name: "Inter", data: i8, weight: 800, style: "normal" },
  { name: "Inter", data: i9, weight: 900, style: "normal" },
  { name: "IBM Plex Mono", data: m4, weight: 400, style: "normal" },
  { name: "IBM Plex Mono", data: m7, weight: 700, style: "normal" },
];

// ── Helpers ──
const Div = (style, children) => ({
  type: "div",
  props: { style: { display: "flex", ...style }, children },
});

const Dot = (c, s = 8) =>
  Div({ width: s, height: s, borderRadius: 999, backgroundColor: c });

const LogoIcon = (size = 46) => ({
  type: "img",
  props: {
    src: LOGO_DATA_URL,
    width: size,
    height: size,
    style: { display: "flex", width: size, height: size, borderRadius: 10 },
  },
});

const LogoRow = (s = 46, fs = 24, color = T.text) =>
  Div({ alignItems: "center", gap: 12 }, [
    LogoIcon(s),
    Div({ fontSize: fs, fontWeight: 700, color, letterSpacing: -0.4 }, "Tonvo"),
  ]);

const TopBar = (badge, badgeColor = T.muted, bg = null, border = null) =>
  Div({ alignItems: "center", justifyContent: "space-between" }, [
    LogoRow(46, 24),
    Div(
      {
        padding: "10px 18px",
        borderRadius: 999,
        backgroundColor: bg || "transparent",
        border: border || "1px solid rgba(255,255,255,0.15)",
        fontFamily: "IBM Plex Mono",
        fontSize: 15,
        fontWeight: 700,
        color: badgeColor,
        letterSpacing: 2,
        textTransform: "uppercase",
      },
      badge,
    ),
  ]);

const SwipeCTA = (current, total, ctaLabel = "Essayer gratuitement") => {
  const isLast = current >= total;
  return Div({ alignItems: "center", justifyContent: "space-between", width: "100%" }, [
    Div(
      {
        fontFamily: "IBM Plex Mono",
        fontSize: 18,
        color: T.muted,
        letterSpacing: 1.5,
        textTransform: "uppercase",
        fontWeight: 700,
      },
      `${String(current).padStart(2, "0")} / ${String(total).padStart(2, "0")}`,
    ),
    Div(
      {
        fontFamily: "IBM Plex Mono",
        fontSize: 20,
        fontWeight: 700,
        color: T.positive,
        letterSpacing: 2,
      },
      brand.url,
    ),
    isLast
      ? Div(
          {
            padding: "14px 26px",
            borderRadius: 999,
            backgroundColor: T.positive,
            fontSize: 18,
            fontWeight: 800,
            color: "#052e1b",
            letterSpacing: 0.3,
          },
          `${ctaLabel} →`,
        )
      : Div(
          {
            alignItems: "center",
            gap: 10,
            padding: "12px 22px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.18)",
            backgroundColor: "rgba(255,255,255,0.04)",
          },
          [
            Div(
              { fontSize: 17, fontWeight: 700, color: T.silver, letterSpacing: 0.3 },
              "Swipe",
            ),
            Div({ fontSize: 20, fontWeight: 700, color: T.silver }, "→"),
          ],
        ),
  ]);
};

// ══════════════════════════════════════════════════════════════
// SLIDE RENDERERS
// ══════════════════════════════════════════════════════════════

const PADDING = 72;
const SLIDE_BASE = {
  width: W,
  height: H,
  flexDirection: "column",
  fontFamily: "Inter",
  color: T.text,
  backgroundColor: T.bg,
  padding: PADDING,
  justifyContent: "space-between",
};

function slideHook({ slide, i, total, ctaLabel }) {
  return Div(
    {
      ...SLIDE_BASE,
      backgroundImage:
        "radial-gradient(ellipse at 30% 20%, rgba(52,211,153,0.12) 0%, rgba(9,9,11,0) 55%), radial-gradient(ellipse at 80% 90%, rgba(248,113,113,0.06) 0%, rgba(9,9,11,0) 50%)",
    },
    [
      TopBar("● Hook", T.positive, "rgba(52,211,153,0.1)", "1px solid rgba(52,211,153,0.3)"),
      Div({ flexDirection: "column", gap: 24 }, [
        Div(
          {
            padding: "10px 18px",
            borderRadius: 6,
            backgroundColor: "rgba(52,211,153,0.15)",
            border: "1px solid rgba(52,211,153,0.3)",
            alignSelf: "flex-start",
            fontSize: 16,
            fontWeight: 800,
            color: T.positive,
            letterSpacing: 2,
            textTransform: "uppercase",
          },
          slide.eyebrow,
        ),
        Div(
          {
            fontSize: 110,
            fontWeight: 800,
            letterSpacing: -4.5,
            color: T.text,
            lineHeight: 0.98,
          },
          slide.title,
        ),
        slide.subtitle
          ? Div(
              {
                fontSize: 34,
                fontWeight: 600,
                color: T.silver,
                lineHeight: 1.3,
                marginTop: 14,
                maxWidth: 940,
              },
              slide.subtitle,
            )
          : null,
      ].filter(Boolean)),
      SwipeCTA(i, total, ctaLabel),
    ],
  );
}

function slideProblem({ slide, i, total, ctaLabel }) {
  return Div(
    {
      ...SLIDE_BASE,
      backgroundImage:
        "radial-gradient(ellipse at 50% 40%, rgba(248,113,113,0.10) 0%, rgba(9,9,11,0) 60%)",
    },
    [
      TopBar("● Problème", T.negative, "rgba(248,113,113,0.1)", "1px solid rgba(248,113,113,0.3)"),
      Div({ flexDirection: "column", gap: 28 }, [
        Div(
          {
            fontSize: 82,
            fontWeight: 800,
            letterSpacing: -3,
            color: T.text,
            lineHeight: 1.02,
          },
          slide.title,
        ),
        Div(
          {
            fontSize: 32,
            fontWeight: 500,
            color: T.silver,
            lineHeight: 1.4,
            maxWidth: 920,
            marginTop: 6,
          },
          slide.body,
        ),
        // Stat block
        Div(
          {
            marginTop: 24,
            padding: "36px 44px",
            borderRadius: 20,
            backgroundColor: "rgba(20,20,24,0.7)",
            border: "1px solid rgba(248,113,113,0.22)",
            alignItems: "center",
            gap: 36,
          },
          [
            Div(
              {
                fontSize: 132,
                fontWeight: 900,
                color: T.negative,
                letterSpacing: -5,
                lineHeight: 0.9,
              },
              slide.stat,
            ),
            Div(
              {
                fontSize: 26,
                fontWeight: 500,
                color: T.silver,
                lineHeight: 1.4,
                flex: 1,
              },
              slide.statLabel,
            ),
          ],
        ),
      ]),
      SwipeCTA(i, total, ctaLabel),
    ],
  );
}

function slideSolution({ slide, i, total, ctaLabel }) {
  return Div(
    {
      ...SLIDE_BASE,
      backgroundImage:
        "radial-gradient(ellipse at 50% 30%, rgba(52,211,153,0.14) 0%, rgba(9,9,11,0) 60%)",
    },
    [
      TopBar("● Solution", T.positive, "rgba(52,211,153,0.1)", "1px solid rgba(52,211,153,0.3)"),
      Div({ flexDirection: "column", gap: 26 }, [
        Div(
          {
            fontSize: 82,
            fontWeight: 800,
            letterSpacing: -3,
            color: T.text,
            lineHeight: 1.02,
          },
          slide.title,
        ),
        Div(
          {
            fontSize: 30,
            fontWeight: 500,
            color: T.silver,
            lineHeight: 1.4,
            maxWidth: 920,
            marginTop: 4,
          },
          slide.body,
        ),
        Div({ flexDirection: "column", gap: 14, marginTop: 20 },
          slide.bullets.map((b) =>
            Div(
              {
                alignItems: "center",
                gap: 22,
                padding: "22px 26px",
                borderRadius: 16,
                backgroundColor: "rgba(20,20,24,0.8)",
                border: "1px solid rgba(52,211,153,0.18)",
              },
              [
                Div(
                  {
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: "rgba(52,211,153,0.15)",
                    border: "1px solid rgba(52,211,153,0.4)",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 26,
                    fontWeight: 900,
                    color: T.positive,
                  },
                  "✓",
                ),
                Div(
                  { fontSize: 28, fontWeight: 700, color: T.text, flex: 1 },
                  b.label,
                ),
                Div(
                  {
                    fontFamily: "IBM Plex Mono",
                    fontSize: 18,
                    fontWeight: 700,
                    color: T.positive,
                    padding: "6px 14px",
                    backgroundColor: "rgba(52,211,153,0.12)",
                    borderRadius: 8,
                    letterSpacing: 0.5,
                  },
                  b.value,
                ),
              ],
            ),
          ),
        ),
      ]),
      SwipeCTA(i, total, ctaLabel),
    ],
  );
}

function slideUsecase({ slide, i, total, ctaLabel }) {
  return Div(
    {
      ...SLIDE_BASE,
      backgroundImage:
        "radial-gradient(ellipse at 50% 10%, rgba(52,211,153,0.10) 0%, rgba(9,9,11,0) 55%)",
    },
    [
      TopBar("● En live", T.positive, "rgba(52,211,153,0.1)", "1px solid rgba(52,211,153,0.3)"),
      Div({ flexDirection: "column", gap: 22 }, [
        Div(
          {
            fontSize: 62,
            fontWeight: 800,
            letterSpacing: -2.2,
            color: T.text,
            lineHeight: 1.02,
            maxWidth: 880,
          },
          slide.title,
        ),
        // Live chat mockup
        Div(
          {
            flexDirection: "column",
            padding: 26,
            borderRadius: 22,
            backgroundColor: "rgba(17,17,20,0.95)",
            border: "1px solid rgba(255,255,255,0.08)",
            gap: 16,
            marginTop: 18,
          },
          [
            Div({ alignItems: "center", justifyContent: "space-between", marginBottom: 4 }, [
              Div({ gap: 8 }, [
                Div({ width: 12, height: 12, borderRadius: 6, backgroundColor: T.surface3 }),
                Div({ width: 12, height: 12, borderRadius: 6, backgroundColor: T.surface3 }),
                Div({ width: 12, height: 12, borderRadius: 6, backgroundColor: T.surface3 }),
              ]),
              Div(
                {
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 14px",
                  borderRadius: 999,
                  backgroundColor: "rgba(248,113,113,0.12)",
                  border: "1px solid rgba(248,113,113,0.35)",
                  fontFamily: "IBM Plex Mono",
                  fontSize: 14,
                  fontWeight: 700,
                  color: T.negative,
                  letterSpacing: 1,
                },
                [Dot(T.negative, 8), Div({}, "LIVE · 04:32")],
              ),
            ]),
            // Prospect bubble
            Div({ gap: 14, alignItems: "flex-start" }, [
              Div(
                {
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: T.surface3,
                  border: "1px solid " + T.border,
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 17,
                  fontWeight: 700,
                  color: T.muted,
                  flexShrink: 0,
                },
                "A",
              ),
              Div(
                {
                  flex: 1,
                  padding: "16px 22px",
                  borderRadius: 14,
                  backgroundColor: T.surface2,
                  border: "1px solid " + T.border,
                  fontSize: 22,
                  lineHeight: 1.4,
                  color: T.silver,
                  fontWeight: 500,
                },
                "« Honnêtement, c'est au-dessus de notre budget. On a eu un devis à 40 % de moins. »",
              ),
            ]),
            // User bubble (waiting)
            Div({ gap: 14, alignItems: "flex-start" }, [
              Div(
                {
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: "rgba(52,211,153,0.1)",
                  border: "1px solid rgba(52,211,153,0.35)",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 17,
                  fontWeight: 800,
                  color: T.positive,
                  flexShrink: 0,
                },
                "V",
              ),
              Div(
                {
                  padding: "16px 22px",
                  borderRadius: 14,
                  backgroundColor: T.surface2,
                  border: "1px solid " + T.border,
                  fontSize: 22,
                  color: T.muted,
                  fontWeight: 500,
                },
                "…",
              ),
            ]),
            // Copilot card
            Div(
              {
                flexDirection: "column",
                padding: 22,
                borderRadius: 16,
                backgroundColor: "rgba(52,211,153,0.08)",
                border: "1px solid rgba(52,211,153,0.4)",
                gap: 10,
                marginTop: 6,
              },
              [
                Div({ alignItems: "center", gap: 10 }, [
                  Dot(T.positive, 8),
                  Div(
                    {
                      fontFamily: "IBM Plex Mono",
                      fontSize: 14,
                      fontWeight: 800,
                      color: T.positive,
                      letterSpacing: 1.5,
                      textTransform: "uppercase",
                    },
                    "Copilote · Dites ceci",
                  ),
                ]),
                Div(
                  {
                    fontSize: 26,
                    fontWeight: 700,
                    color: T.text,
                    lineHeight: 1.35,
                  },
                  "« Leur devis inclut-il la garantie résultat ? Sur 12 mois, l'écart se rembourse en un seul deal supplémentaire. »",
                ),
              ],
            ),
          ],
        ),
      ]),
      SwipeCTA(i, total, ctaLabel),
    ],
  );
}

function slideBenefits({ slide, i, total, ctaLabel }) {
  const stats = slide.stats;
  // Split into 2x2 grid
  const rows = [stats.slice(0, 2), stats.slice(2, 4)];
  const statCell = (s) => {
    const isNumeric = /^[+\-]?[0-9]/.test(s.value);
    return Div(
      {
        flex: 1,
        flexDirection: "column",
        gap: 12,
        padding: "32px 32px",
        borderRadius: 20,
        backgroundColor: "rgba(20,20,24,0.75)",
        border: "1px solid rgba(52,211,153,0.18)",
      },
      [
        Div(
          {
            fontSize: isNumeric ? 86 : 54,
            fontWeight: 900,
            color: T.positive,
            letterSpacing: isNumeric ? -3.5 : -1.5,
            lineHeight: 1,
          },
          s.value,
        ),
        Div(
          {
            fontSize: 22,
            fontWeight: 500,
            color: T.silver,
            lineHeight: 1.35,
            marginTop: 4,
          },
          s.label,
        ),
      ],
    );
  };
  return Div(
    {
      ...SLIDE_BASE,
      backgroundImage:
        "radial-gradient(ellipse at 50% 20%, rgba(52,211,153,0.12) 0%, rgba(9,9,11,0) 55%)",
    },
    [
      TopBar("● Preuve", T.positive, "rgba(52,211,153,0.1)", "1px solid rgba(52,211,153,0.3)"),
      Div({ flexDirection: "column", gap: 24 }, [
        Div(
          {
            fontSize: 66,
            fontWeight: 800,
            letterSpacing: -2.4,
            color: T.text,
            lineHeight: 1.02,
            maxWidth: 920,
          },
          slide.title,
        ),
        Div({ flexDirection: "column", gap: 16, marginTop: 12 },
          rows.map((row) => Div({ gap: 16 }, row.map(statCell))),
        ),
      ]),
      SwipeCTA(i, total, ctaLabel),
    ],
  );
}

function slideCta({ slide, i, total, ctaLabel }) {
  return Div(
    {
      ...SLIDE_BASE,
      backgroundImage:
        "radial-gradient(ellipse at 50% 35%, rgba(52,211,153,0.22) 0%, rgba(9,9,11,0) 55%), radial-gradient(ellipse at 50% 100%, rgba(52,211,153,0.08) 0%, rgba(9,9,11,0) 60%)",
    },
    [
      TopBar(
        "● Votre move",
        T.positive,
        "rgba(52,211,153,0.1)",
        "1px solid rgba(52,211,153,0.3)",
      ),
      Div({ flexDirection: "column", alignItems: "center", gap: 28 }, [
        // Big logo
        Div({ alignItems: "center", justifyContent: "center", marginTop: 4 }, [LogoIcon(140)]),
        Div(
          {
            fontSize: 88,
            fontWeight: 800,
            letterSpacing: -3,
            color: T.text,
            lineHeight: 1,
            textAlign: "center",
            marginTop: 6,
          },
          slide.title,
        ),
        Div(
          {
            fontSize: 30,
            fontWeight: 600,
            color: T.silver,
            lineHeight: 1.35,
            maxWidth: 900,
            textAlign: "center",
          },
          slide.subtitle,
        ),
        // Big CTA
        Div({ flexDirection: "column", alignItems: "center", gap: 18, marginTop: 14 }, [
          Div(
            {
              padding: "28px 64px",
              borderRadius: 999,
              backgroundColor: T.positive,
              boxShadow: "0 20px 60px rgba(52,211,153,0.35)",
              fontSize: 38,
              fontWeight: 800,
              color: "#052e1b",
              letterSpacing: -0.3,
            },
            `${slide.button} →`,
          ),
          Div(
            {
              fontFamily: "IBM Plex Mono",
              fontSize: 26,
              fontWeight: 800,
              color: T.positive,
              letterSpacing: 2.5,
            },
            brand.url,
          ),
        ]),
      ]),
      SwipeCTA(i, total, ctaLabel),
    ],
  );
}

const renderers = {
  hook: slideHook,
  problem: slideProblem,
  solution: slideSolution,
  usecase: slideUsecase,
  benefits: slideBenefits,
  cta: slideCta,
};

// ══════════════════════════════════════════════════════════════
// RENDER LOOP
// ══════════════════════════════════════════════════════════════
async function run() {
  console.log("→ Cleaning output dir:", OUT_DIR);
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  const manifest = {
    generated_at: new Date().toISOString(),
    product: brand.name,
    url: brand.url,
    tagline: brand.tagline,
    dimensions: { width: W, height: H },
    design_system: {
      palette: [T.bg, T.positive, T.negative, T.neutral, T.text],
      fonts: ["Inter", "IBM Plex Mono"],
      logo: "public/logo-tonvo.png",
      renderer: "satori + @resvg/resvg-js",
    },
    carousels: [],
  };

  for (const carousel of carousels) {
    const dir = join(OUT_DIR, carousel.id);
    await mkdir(dir, { recursive: true });
    console.log(`\n═ ${carousel.id} — ${carousel.angle}`);
    const total = carousel.slides.length;
    const slideManifest = [];

    for (let i = 0; i < total; i++) {
      const slide = carousel.slides[i];
      const idx = i + 1;
      const renderer = renderers[slide.type];
      if (!renderer) throw new Error(`Unknown type: ${slide.type}`);

      const tree = renderer({
        slide,
        i: idx,
        total,
        ctaLabel: carousel.cta,
      });

      const svg = await satori(tree, { width: W, height: H, fonts });
      const png = new Resvg(svg, { fitTo: { mode: "width", value: W } }).render().asPng();

      const file = join(dir, `slide-${String(idx).padStart(2, "0")}.png`);
      await writeFile(file, png);
      console.log(`  ✓ slide-${String(idx).padStart(2, "0")}.png [${slide.type}]`);
      slideManifest.push({
        index: idx,
        type: slide.type,
        file: `${carousel.id}/slide-${String(idx).padStart(2, "0")}.png`,
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

  await writeFile(
    join(OUT_DIR, "_manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf8",
  );
  console.log(
    `\n🎨 ${manifest.carousels.length} carrousels, ${manifest.carousels.reduce(
      (a, c) => a + c.slides.length,
      0,
    )} slides · renderer: satori+resvg · typo: Inter + IBM Plex Mono · logo: réel`,
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

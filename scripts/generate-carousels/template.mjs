const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const baseCss = (brand) => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: 1080px; height: 1350px;
    font-family: 'Inter', system-ui, sans-serif;
    color: ${brand.colors.text};
    background: ${brand.colors.bg};
    -webkit-font-smoothing: antialiased;
    text-rendering: geometricPrecision;
  }
  .slide {
    position: relative;
    width: 1080px; height: 1350px;
    padding: 96px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background:
      radial-gradient(ellipse 900px 600px at 85% -10%, rgba(52, 211, 153, 0.09), transparent 60%),
      radial-gradient(ellipse 700px 500px at 10% 110%, rgba(52, 211, 153, 0.06), transparent 60%),
      ${brand.colors.bg};
  }
  .slide::before {
    content: '';
    position: absolute; inset: 0;
    background-image:
      linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 90px 90px;
    mask-image: radial-gradient(ellipse 900px 700px at center, rgba(0,0,0,0.8), transparent 70%);
    -webkit-mask-image: radial-gradient(ellipse 900px 700px at center, rgba(0,0,0,0.8), transparent 70%);
    pointer-events: none;
  }
  .slide > * { position: relative; z-index: 1; }

  .top-bar {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 56px;
  }
  .brand {
    display: flex; align-items: center; gap: 12px;
    font-weight: 700; font-size: 26px; letter-spacing: -0.02em;
    color: ${brand.colors.text};
  }
  .brand .mark {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, ${brand.colors.emerald}, #10b981);
    display: flex; align-items: center; justify-content: center;
    font-weight: 900; font-size: 22px; color: ${brand.colors.bg};
    box-shadow: 0 0 32px rgba(52,211,153,0.35);
  }
  .slide-num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 16px; font-weight: 500;
    color: ${brand.colors.textSubtle};
    letter-spacing: 0.1em;
  }

  .eyebrow {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 10px 18px;
    background: ${brand.colors.emeraldSoft};
    border: 1px solid ${brand.colors.emeraldLine};
    border-radius: 999px;
    font-size: 20px; font-weight: 600;
    color: ${brand.colors.emerald};
    letter-spacing: 0.04em;
    width: fit-content;
  }
  .eyebrow .dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: ${brand.colors.emerald};
    box-shadow: 0 0 12px ${brand.colors.emerald};
  }

  .title {
    font-weight: 800;
    letter-spacing: -0.035em;
    line-height: 1.02;
    color: ${brand.colors.text};
  }
  .title .accent { color: ${brand.colors.emerald}; }

  .body {
    font-size: 30px; line-height: 1.5;
    color: ${brand.colors.textMuted};
    font-weight: 400;
    max-width: 820px;
  }

  .footer-mark {
    margin-top: auto;
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 32px;
    border-top: 1px solid ${brand.colors.border};
    font-size: 20px;
    color: ${brand.colors.textSubtle};
  }
  .footer-mark .tagline { font-weight: 500; color: ${brand.colors.textMuted}; }
  .footer-mark .handle { font-family: 'JetBrains Mono', monospace; }

  /* Layout variants */
  .slide.hook { justify-content: space-between; }
  .slide.hook .hero-title { font-size: 104px; margin-top: 48px; }
  .slide.hook .hero-sub { font-size: 36px; color: ${brand.colors.textMuted}; margin-top: 40px; font-weight: 400; line-height: 1.35; max-width: 880px; }

  .slide.problem .prob-title { font-size: 80px; margin-top: 36px; }
  .slide.problem .prob-body { margin-top: 40px; }
  .slide.problem .stat-card {
    margin-top: 48px;
    padding: 40px 48px;
    background: ${brand.colors.surface};
    border: 1px solid ${brand.colors.border};
    border-radius: 24px;
    display: flex; align-items: center; gap: 40px;
    position: relative; overflow: hidden;
  }
  .slide.problem .stat-card::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(circle at 0% 50%, rgba(248, 113, 113, 0.12), transparent 60%);
    pointer-events: none;
  }
  .slide.problem .stat-value {
    font-size: 112px; font-weight: 900;
    color: ${brand.colors.coral};
    letter-spacing: -0.04em; line-height: 0.9;
    text-shadow: 0 0 48px rgba(248,113,113,0.25);
    position: relative;
  }
  .slide.problem .stat-label {
    font-size: 24px; color: ${brand.colors.textMuted};
    line-height: 1.4; font-weight: 500;
    position: relative;
  }

  .slide.solution .sol-title { font-size: 80px; margin-top: 36px; }
  .slide.solution .sol-body { margin-top: 36px; }
  .slide.solution .bullets { margin-top: 48px; display: flex; flex-direction: column; gap: 20px; }
  .slide.solution .bullet {
    display: flex; align-items: center; gap: 24px;
    padding: 28px 32px;
    background: ${brand.colors.surface};
    border: 1px solid ${brand.colors.border};
    border-radius: 20px;
  }
  .slide.solution .bullet .check {
    width: 48px; height: 48px; flex-shrink: 0;
    border-radius: 14px;
    background: ${brand.colors.emeraldSoft};
    border: 1px solid ${brand.colors.emeraldLine};
    display: flex; align-items: center; justify-content: center;
    color: ${brand.colors.emerald}; font-weight: 900; font-size: 26px;
  }
  .slide.solution .bullet .label { flex: 1; font-size: 26px; font-weight: 600; color: ${brand.colors.text}; }
  .slide.solution .bullet .value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 22px; font-weight: 500;
    color: ${brand.colors.emerald};
    padding: 6px 14px;
    background: ${brand.colors.emeraldSoft};
    border-radius: 8px;
  }

  .slide.usecase .uc-title { font-size: 64px; margin-top: 32px; max-width: 780px; }
  .slide.usecase .mockup {
    margin-top: 56px;
    background: linear-gradient(180deg, ${brand.colors.surfaceHi}, ${brand.colors.surface});
    border: 1px solid ${brand.colors.border};
    border-radius: 28px;
    padding: 32px;
    box-shadow: 0 40px 80px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.02);
    flex: 1;
    display: flex; flex-direction: column; gap: 20px;
  }
  .slide.usecase .mockup-header {
    display: flex; align-items: center; justify-content: space-between;
    padding-bottom: 20px;
    border-bottom: 1px solid ${brand.colors.border};
  }
  .slide.usecase .dots { display: flex; gap: 8px; }
  .slide.usecase .dots span {
    width: 12px; height: 12px; border-radius: 50%;
    background: ${brand.colors.border};
  }
  .slide.usecase .live-badge {
    display: flex; align-items: center; gap: 8px;
    padding: 6px 14px;
    background: rgba(248,113,113,0.12);
    border: 1px solid rgba(248,113,113,0.35);
    border-radius: 999px;
    font-size: 16px; font-weight: 600; color: ${brand.colors.coral};
    font-family: 'JetBrains Mono', monospace;
  }
  .slide.usecase .live-badge .pulse {
    width: 8px; height: 8px; border-radius: 50%;
    background: ${brand.colors.coral};
    box-shadow: 0 0 10px ${brand.colors.coral};
  }
  .slide.usecase .msg {
    display: flex; gap: 16px;
  }
  .slide.usecase .avatar {
    width: 44px; height: 44px; border-radius: 50%;
    background: ${brand.colors.surfaceHi2};
    border: 1px solid ${brand.colors.border};
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 16px; color: ${brand.colors.textMuted};
    flex-shrink: 0;
  }
  .slide.usecase .bubble {
    flex: 1;
    padding: 16px 22px;
    background: ${brand.colors.surfaceHi2};
    border: 1px solid ${brand.colors.border};
    border-radius: 16px;
    font-size: 22px; line-height: 1.4; color: ${brand.colors.text};
    font-weight: 500;
  }
  .slide.usecase .msg.prospect .bubble { background: ${brand.colors.surfaceHi}; color: ${brand.colors.textMuted}; }
  .slide.usecase .copilot-card {
    margin-top: 12px;
    padding: 24px;
    background: linear-gradient(135deg, rgba(52,211,153,0.08), rgba(52,211,153,0.02));
    border: 1px solid ${brand.colors.emeraldLine};
    border-radius: 18px;
    position: relative;
  }
  .slide.usecase .copilot-card::before {
    content: ''; position: absolute; left: -1px; top: 20px; bottom: 20px; width: 3px;
    background: ${brand.colors.emerald};
    border-radius: 3px;
    box-shadow: 0 0 16px ${brand.colors.emerald};
  }
  .slide.usecase .copilot-label {
    display: flex; align-items: center; gap: 10px;
    font-size: 15px; font-weight: 700;
    color: ${brand.colors.emerald};
    text-transform: uppercase; letter-spacing: 0.1em;
    margin-bottom: 12px;
  }
  .slide.usecase .copilot-text {
    font-size: 24px; font-weight: 600;
    color: ${brand.colors.text};
    line-height: 1.35;
  }
  .slide.usecase .copilot-hint {
    margin-top: 10px;
    font-size: 17px; color: ${brand.colors.textMuted};
    font-family: 'JetBrains Mono', monospace;
  }

  .slide.benefits .ben-title { font-size: 64px; margin-top: 32px; max-width: 780px; }
  .slide.benefits .grid {
    margin-top: 56px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    flex: 1;
  }
  .slide.benefits .stat-cell {
    padding: 40px 36px;
    background: linear-gradient(180deg, ${brand.colors.surfaceHi}, ${brand.colors.surface});
    border: 1px solid ${brand.colors.border};
    border-radius: 24px;
    display: flex; flex-direction: column; justify-content: space-between;
    position: relative; overflow: hidden;
  }
  .slide.benefits .stat-cell::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, ${brand.colors.emerald}, transparent);
    opacity: 0.6;
  }
  .slide.benefits .stat-cell .value {
    font-size: 88px; font-weight: 900;
    color: ${brand.colors.emerald};
    letter-spacing: -0.04em; line-height: 1;
    text-shadow: 0 0 40px rgba(52,211,153,0.25);
  }
  .slide.benefits .stat-cell .value.text { font-size: 56px; }
  .slide.benefits .stat-cell .label {
    margin-top: 20px;
    font-size: 22px; color: ${brand.colors.textMuted};
    line-height: 1.35; font-weight: 500;
  }

  .slide.cta { justify-content: space-between; }
  .slide.cta .cta-title { font-size: 104px; margin-top: 48px; }
  .slide.cta .cta-sub { font-size: 32px; color: ${brand.colors.textMuted}; margin-top: 36px; font-weight: 400; line-height: 1.4; max-width: 820px; }
  .slide.cta .cta-button {
    margin-top: 56px;
    display: inline-flex; align-items: center; gap: 16px;
    padding: 32px 56px;
    background: ${brand.colors.emerald};
    color: ${brand.colors.bg};
    font-weight: 800; font-size: 34px;
    letter-spacing: -0.01em;
    border-radius: 20px;
    box-shadow: 0 0 60px rgba(52,211,153,0.35), 0 20px 40px -10px rgba(52,211,153,0.35);
    width: fit-content;
  }
  .slide.cta .cta-button .arrow {
    font-size: 38px; line-height: 1;
  }
  .slide.cta .guarantee {
    margin-top: 32px;
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 20px; color: ${brand.colors.textMuted};
    font-weight: 500;
  }
  .slide.cta .guarantee .shield {
    width: 28px; height: 28px; flex-shrink: 0;
    border-radius: 8px;
    background: ${brand.colors.emeraldSoft};
    border: 1px solid ${brand.colors.emeraldLine};
    display: flex; align-items: center; justify-content: center;
    color: ${brand.colors.emerald}; font-size: 16px; font-weight: 900;
  }
`;

const topBar = (brand, slideIndex, totalSlides) => `
  <div class="top-bar">
    <div class="brand">
      <div class="mark">T</div>
      <div>${brand.name}</div>
    </div>
    <div class="slide-num">${String(slideIndex).padStart(2, "0")} / ${String(totalSlides).padStart(2, "0")}</div>
  </div>
`;

const footerMark = (brand) => `
  <div class="footer-mark">
    <div class="tagline">${esc(brand.tagline)}</div>
    <div class="handle">tonvo.app</div>
  </div>
`;

const renderHook = (brand, slide, slideIndex, totalSlides) => `
  <div class="slide hook">
    ${topBar(brand, slideIndex, totalSlides)}
    <div>
      <div class="eyebrow"><span class="dot"></span>${esc(slide.eyebrow)}</div>
      <h1 class="title hero-title">${esc(slide.title)}</h1>
      ${slide.subtitle ? `<p class="hero-sub">${esc(slide.subtitle)}</p>` : ""}
    </div>
    ${footerMark(brand)}
  </div>
`;

const renderProblem = (brand, slide, slideIndex, totalSlides) => `
  <div class="slide problem">
    ${topBar(brand, slideIndex, totalSlides)}
    <div class="eyebrow"><span class="dot"></span>${esc(slide.eyebrow)}</div>
    <h2 class="title prob-title">${esc(slide.title)}</h2>
    <p class="body prob-body">${esc(slide.body)}</p>
    <div class="stat-card">
      <div class="stat-value">${esc(slide.stat)}</div>
      <div class="stat-label">${esc(slide.statLabel)}</div>
    </div>
    ${footerMark(brand)}
  </div>
`;

const renderSolution = (brand, slide, slideIndex, totalSlides) => `
  <div class="slide solution">
    ${topBar(brand, slideIndex, totalSlides)}
    <div class="eyebrow"><span class="dot"></span>${esc(slide.eyebrow)}</div>
    <h2 class="title sol-title">${esc(slide.title)}</h2>
    <p class="body sol-body">${esc(slide.body)}</p>
    <div class="bullets">
      ${slide.bullets
        .map(
          (b) => `
        <div class="bullet">
          <div class="check">✓</div>
          <div class="label">${esc(b.label)}</div>
          <div class="value">${esc(b.value)}</div>
        </div>`,
        )
        .join("")}
    </div>
    ${footerMark(brand)}
  </div>
`;

const renderUsecase = (brand, slide, slideIndex, totalSlides) => `
  <div class="slide usecase">
    ${topBar(brand, slideIndex, totalSlides)}
    <div class="eyebrow"><span class="dot"></span>${esc(slide.eyebrow)}</div>
    <h2 class="title uc-title">${esc(slide.title)}</h2>
    <div class="mockup">
      <div class="mockup-header">
        <div class="dots"><span></span><span></span><span></span></div>
        <div class="live-badge"><span class="pulse"></span>LIVE • 04:32</div>
      </div>
      <div class="msg prospect">
        <div class="avatar">A</div>
        <div class="bubble">« Honnêtement, c'est au-dessus de notre budget. On a eu un devis à 40% de moins. »</div>
      </div>
      <div class="msg">
        <div class="avatar" style="background: rgba(52,211,153,0.1); color: #34d399; border-color: rgba(52,211,153,0.35);">V</div>
        <div class="bubble">—</div>
      </div>
      <div class="copilot-card">
        <div class="copilot-label"><span class="dot" style="width:8px;height:8px;border-radius:50%;background:#34d399;box-shadow:0 0 10px #34d399;"></span>COPILOTE • DITES CECI</div>
        <div class="copilot-text">« Leur devis inclut-il la garantie résultat et le support dédié ? Sur 12 mois, l'écart se rembourse en un seul deal supplémentaire. »</div>
        <div class="copilot-hint">⚡ Ancre de prix + reframe valeur — signal d'achat détecté</div>
      </div>
    </div>
    ${footerMark(brand)}
  </div>
`;

const renderBenefits = (brand, slide, slideIndex, totalSlides) => `
  <div class="slide benefits">
    ${topBar(brand, slideIndex, totalSlides)}
    <div class="eyebrow"><span class="dot"></span>${esc(slide.eyebrow)}</div>
    <h2 class="title ben-title">${esc(slide.title)}</h2>
    <div class="grid">
      ${slide.stats
        .map((s) => {
          const isNumeric = /^[+\-]?\d/.test(s.value);
          return `
        <div class="stat-cell">
          <div class="value${isNumeric ? "" : " text"}">${esc(s.value)}</div>
          <div class="label">${esc(s.label)}</div>
        </div>`;
        })
        .join("")}
    </div>
    ${footerMark(brand)}
  </div>
`;

const renderCta = (brand, slide, slideIndex, totalSlides) => `
  <div class="slide cta">
    ${topBar(brand, slideIndex, totalSlides)}
    <div>
      <div class="eyebrow"><span class="dot"></span>${esc(slide.eyebrow)}</div>
      <h2 class="title cta-title">${esc(slide.title)}</h2>
      <p class="cta-sub">${esc(slide.subtitle)}</p>
      <div class="cta-button">${esc(slide.button)}<span class="arrow">→</span></div>
      <div class="guarantee"><span class="shield">✓</span>Garanti ou remboursé — 7 jours.</div>
    </div>
    ${footerMark(brand)}
  </div>
`;

const renderers = {
  hook: renderHook,
  problem: renderProblem,
  solution: renderSolution,
  usecase: renderUsecase,
  benefits: renderBenefits,
  cta: renderCta,
};

export function renderSlideHtml({ brand, slide, slideIndex, totalSlides }) {
  const renderer = renderers[slide.type];
  if (!renderer) throw new Error(`Unknown slide type: ${slide.type}`);
  const body = renderer(brand, slide, slideIndex, totalSlides);
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<style>${baseCss(brand)}</style>
</head>
<body>
${body}
</body>
</html>`;
}

// @ts-check
/**
 * Tonvo — carousel generator
 * Renders 3 carousels (6 slides each = 18 PNGs) at 1080×1350 for TikTok/Instagram.
 *
 * Design direction: "Dark Editorial Terminal"
 *   - Instrument Serif (display)  + JetBrains Mono (data) + Inter Tight (body)
 *   - Emerald as a laser-pointer, not decoration
 *   - Grid + noise overlays for depth; no AI-generic aesthetic
 *
 * Run: node scripts/generate-carousels/generate.mjs
 */

import puppeteer from 'puppeteer';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(ROOT, 'images');

const WIDTH = 1080;
const HEIGHT = 1350;

/* ------------------------------------------------------------------ */
/* DESIGN TOKENS + GLOBAL CSS                                          */
/* ------------------------------------------------------------------ */

const GLOBAL_CSS = /* css */ `
  :root {
    --bg:       #09090b;
    --surf-1:   #111114;
    --surf-2:   #18181b;
    --surf-3:   #1f1f23;
    --hair:     #27272a;
    --hair-2:   #2f2f36;
    --text:     #fafafa;
    --muted:    #a1a1aa;
    --dim:      #71717a;
    --emerald:  #34d399;
    --emerald-d:#0f6547;
    --emerald-g:#052e21;
    --amber:    #fbbf24;
    --coral:    #f87171;
    --coral-d:  #4a1e1e;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  html, body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Inter Tight', -apple-system, sans-serif;
    font-feature-settings: 'ss01', 'ss02', 'cv11';
    -webkit-font-smoothing: antialiased;
  }

  .slide {
    position: relative;
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    background: var(--bg);
    overflow: hidden;
    isolation: isolate;
  }

  /* Universal hairline grid + vignette + noise ----------------------- */
  .slide::before {
    content: '';
    position: absolute; inset: 0;
    background-image:
      linear-gradient(to right, rgba(255,255,255,.022) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,.022) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 95% 75% at 50% 45%, #000 55%, transparent 100%);
    -webkit-mask-image: radial-gradient(ellipse 95% 75% at 50% 45%, #000 55%, transparent 100%);
    pointer-events: none;
    z-index: 0;
  }
  .slide::after {
    content: '';
    position: absolute; inset: 0;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .08 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
    opacity: .45;
    mix-blend-mode: overlay;
    pointer-events: none;
    z-index: 1;
  }

  .inner { position: relative; z-index: 2; width: 100%; height: 100%; padding: 72px; display: flex; flex-direction: column; }

  /* Fonts ----------------------------------------------------------- */
  .serif { font-family: 'Instrument Serif', 'Times New Roman', serif; font-weight: 400; letter-spacing: -0.02em; }
  .serif-i { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; letter-spacing: -0.02em; }
  .mono  { font-family: 'JetBrains Mono', ui-monospace, monospace; font-weight: 400; letter-spacing: 0; }

  /* Utility -------------------------------------------------------- */
  .row { display: flex; align-items: center; }
  .col { display: flex; flex-direction: column; }
  .between { justify-content: space-between; }
  .center { justify-content: center; align-items: center; }
  .grow { flex: 1; }
  .muted { color: var(--muted); }
  .dim   { color: var(--dim); }
  .em    { color: var(--emerald); }
  .coral { color: var(--coral); }
  .amber { color: var(--amber); }
  .uc    { text-transform: uppercase; letter-spacing: .14em; }
  .hair-b { border-bottom: 1px solid var(--hair); }
  .hair-t { border-top: 1px solid var(--hair); }

  /* Brand header + footer ------------------------------------------ */
  .brand {
    display: flex; align-items: center; gap: 10px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 22px; font-weight: 500;
    letter-spacing: .18em;
    color: var(--text);
  }
  .brand .dot {
    width: 12px; height: 12px; border-radius: 50%;
    background: var(--emerald);
    box-shadow: 0 0 14px 2px rgba(52,211,153,.6);
  }

  .slide-num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 20px; letter-spacing: .18em; color: var(--dim);
    text-transform: uppercase;
  }

  /* Ticker strip --------------------------------------------------- */
  .ticker {
    display: flex; align-items: center; gap: 28px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 18px; letter-spacing: .1em;
    color: var(--dim);
    overflow: hidden; white-space: nowrap;
  }
  .ticker .pill {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 8px 14px; border: 1px solid var(--hair);
    border-radius: 999px; color: var(--muted); background: rgba(255,255,255,.02);
  }
  .ticker .pill.loss { color: var(--coral); border-color: var(--coral-d); }
  .ticker .pill.win { color: var(--emerald); border-color: var(--emerald-d); }
  .ticker .sep { color: var(--hair); }

  /* Signal dots --------------------------------------------------- */
  .sig-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; }
  .sig-dot.em { background: var(--emerald); box-shadow: 0 0 10px rgba(52,211,153,.6); }
  .sig-dot.am { background: var(--amber); box-shadow: 0 0 10px rgba(251,191,36,.5); }
  .sig-dot.co { background: var(--coral); box-shadow: 0 0 10px rgba(248,113,113,.5); }

  /* CTA button ---------------------------------------------------- */
  .cta {
    display: inline-flex; align-items: center; justify-content: center; gap: 18px;
    padding: 30px 44px;
    background: var(--emerald);
    color: #042017;
    font-family: 'Inter Tight', sans-serif;
    font-weight: 700; font-size: 44px; letter-spacing: -0.02em;
    border-radius: 16px;
    box-shadow:
      0 0 0 1px rgba(52,211,153,.3) inset,
      0 24px 60px -20px rgba(52,211,153,.5),
      0 0 120px rgba(52,211,153,.18);
  }
  .cta .arrow { font-family: 'JetBrains Mono', monospace; font-weight: 500; }

  /* Phone mockup frame ------------------------------------------- */
  .phone {
    position: relative;
    width: 420px; height: 860px;
    background: #0a0a0d;
    border-radius: 56px;
    border: 1px solid #2a2a30;
    box-shadow:
      0 0 0 8px #111114,
      0 0 0 9px #2a2a30,
      0 40px 120px -20px rgba(0,0,0,.9),
      0 0 100px rgba(52,211,153,.06);
    overflow: hidden;
  }
  .phone-notch {
    position: absolute; top: 16px; left: 50%; transform: translateX(-50%);
    width: 110px; height: 28px; background: #000; border-radius: 14px;
    z-index: 10;
  }

  /* Tonvo UI fragment ------------------------------------------- */
  .tui { width: 100%; height: 100%; padding: 64px 22px 22px; background: linear-gradient(180deg, #0a0a0d 0%, #0f0f12 100%); }
  .tui-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; padding: 0 4px; }
  .tui-live { display: inline-flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--emerald); letter-spacing: .12em; }
  .tui-live::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: var(--emerald); box-shadow: 0 0 8px rgba(52,211,153,.8); }
  .tui-time { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--dim); letter-spacing: .08em; }
  .tui-title { font-family: 'Inter Tight'; font-size: 13px; color: var(--muted); margin-bottom: 8px; padding: 0 4px; }
  .bubble {
    margin: 6px 0; padding: 10px 14px;
    border-radius: 14px; font-size: 12px; line-height: 1.4;
    background: rgba(255,255,255,.03); border: 1px solid var(--hair);
    color: var(--text);
  }
  .bubble.them { border-top-left-radius: 4px; }
  .bubble.you { background: rgba(52,211,153,.06); border-color: var(--emerald-d); color: #d0f6e6; margin-left: 40px; border-top-right-radius: 4px; }
  .bubble .who { display: block; font-family: 'JetBrains Mono'; font-size: 9px; letter-spacing: .1em; color: var(--dim); text-transform: uppercase; margin-bottom: 3px; }
  .copilot {
    margin-top: 10px; padding: 12px 14px; border-radius: 14px;
    background: linear-gradient(135deg, rgba(52,211,153,.08), rgba(52,211,153,.02));
    border: 1px solid var(--emerald-d);
    box-shadow: 0 0 40px rgba(52,211,153,.12);
  }
  .copilot .head { display: flex; align-items: center; justify-content: space-between; font-family: 'JetBrains Mono'; font-size: 10px; letter-spacing: .12em; color: var(--emerald); text-transform: uppercase; margin-bottom: 8px; }
  .copilot .phrase { font-family: 'Instrument Serif'; font-style: italic; font-size: 15px; line-height: 1.3; color: var(--text); letter-spacing: -0.01em; }

  /* Scanner sweep ------------------------------------------------ */
  .sweep { position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent 0%, var(--coral) 50%, transparent 100%);
    opacity: .6; }
  .sweep-em { background: linear-gradient(90deg, transparent 0%, var(--emerald) 50%, transparent 100%); }
`;

/* ------------------------------------------------------------------ */
/* SLIDE BUILDERS                                                      */
/* ------------------------------------------------------------------ */

const brandHeader = (num, total, label) => /* html */ `
  <div class="row between" style="margin-bottom: 24px;">
    <div class="brand"><span class="dot"></span><span>TONVO</span></div>
    <div class="slide-num mono">${num} · ${label}</div>
  </div>
`;

const brandFooter = (num, carouselLabel) => /* html */ `
  <div class="row between hair-t" style="padding-top: 22px; margin-top: auto;">
    <div class="mono" style="font-size: 16px; color: var(--dim); letter-spacing: .14em;">TONVO.APP</div>
    <div class="mono" style="font-size: 16px; color: var(--dim); letter-spacing: .18em; text-transform: uppercase;">${carouselLabel} · ${num}/06</div>
  </div>
`;

/* ===== CAROUSEL 1 — DOULEUR ================================ */

const c1_slide1 = () => /* html */ `
<section class="slide">
  <div class="sweep"></div>
  <div class="inner">
    ${brandHeader('01', '06', 'HOOK')}
    <div class="ticker" style="margin-bottom: 18px;">
      <span class="pill loss">▼ DEAL.LOST &nbsp;−€47K</span>
      <span class="sep">·</span>
      <span class="pill">SIGNAL MISSED · 09:42</span>
      <span class="sep">·</span>
      <span class="pill loss">OBJECTION UNHANDLED</span>
    </div>

    <div class="grow col" style="justify-content: center;">
      <div class="mono uc" style="font-size: 20px; color: var(--coral); margin-bottom: 36px;">— Semaine 16</div>
      <h1 class="serif" style="font-size: 128px; line-height: .92; letter-spacing: -0.035em;">
        Vous avez perdu<br>
        <span class="serif-i">combien</span> <span class="muted">de</span><br>
        deals cette<br>
        semaine <span style="color: var(--coral); font-size: 180px; line-height: 0;">?</span>
      </h1>
      <div class="mono" style="margin-top: 44px; font-size: 22px; color: var(--muted); max-width: 780px; line-height: 1.5;">
        3 sur 10 qu'on aurait pu closer. Pas à cause du prix —<br>
        à cause d'un signal raté.
      </div>
    </div>

    ${brandFooter('01', 'DOULEUR')}
  </div>
</section>`;

const c1_slide2 = () => /* html */ `
<section class="slide">
  <div class="inner">
    ${brandHeader('02', '06', 'LE VRAI COÛT')}

    <div class="grow row" style="gap: 60px; align-items: stretch;">
      <div class="col" style="justify-content: center; flex: 1;">
        <div class="mono uc" style="font-size: 20px; color: var(--coral); margin-bottom: 18px;">Deals gagnables · perdus</div>
        <div style="font-family: 'Instrument Serif'; font-size: 320px; line-height: .85; letter-spacing: -0.05em; color: var(--coral);">
          3<span class="muted" style="font-size: 180px;">/</span><span class="dim" style="font-size: 180px;">10</span>
        </div>
        <div class="serif" style="font-size: 48px; line-height: 1.05; letter-spacing: -0.02em; margin-top: 24px; max-width: 500px;">
          C'est ce que perdent <span class="serif-i">les meilleurs closers.</span>
        </div>
      </div>

      <div class="col" style="flex: 1; justify-content: center; gap: 24px;">
        <div class="col" style="gap: 14px; padding: 26px; background: var(--surf-1); border: 1px solid var(--hair); border-radius: 14px;">
          <div class="mono uc" style="font-size: 14px; color: var(--coral);">Le silence</div>
          <div style="font-size: 26px; line-height: 1.3;">Celui qui veut dire non — que vous n'avez pas su remplir.</div>
        </div>
        <div class="col" style="gap: 14px; padding: 26px; background: var(--surf-1); border: 1px solid var(--hair); border-radius: 14px;">
          <div class="mono uc" style="font-size: 14px; color: var(--coral);">L'objection invisible</div>
          <div style="font-size: 26px; line-height: 1.3;">Cachée derrière un "je dois y réfléchir". Déjà perdue.</div>
        </div>
        <div class="col" style="gap: 14px; padding: 26px; background: var(--surf-1); border: 1px solid var(--hair); border-radius: 14px;">
          <div class="mono uc" style="font-size: 14px; color: var(--coral);">Le timing raté</div>
          <div style="font-size: 26px; line-height: 1.3;">Dix secondes trop tard, la fenêtre est fermée.</div>
        </div>
      </div>
    </div>

    ${brandFooter('02', 'DOULEUR')}
  </div>
</section>`;

const c1_slide3 = () => /* html */ `
<section class="slide">
  <div class="sweep sweep-em"></div>
  <div class="inner">
    ${brandHeader('03', '06', 'LA SOLUTION')}

    <div class="grow row" style="gap: 40px; align-items: center;">
      <div class="col" style="flex: 1;">
        <div class="mono uc em" style="font-size: 20px; margin-bottom: 28px;">◉ TONVO · LIVE</div>
        <h2 class="serif" style="font-size: 96px; line-height: .95; letter-spacing: -0.03em;">
          La phrase<br>
          <span class="em">qui close.</span><br>
          <span class="serif-i muted" style="font-size: 68px;">À l'instant où</span><br>
          <span class="serif-i muted" style="font-size: 68px;">il faut la dire.</span>
        </h2>
        <div class="mono" style="margin-top: 36px; font-size: 20px; color: var(--muted); max-width: 440px; line-height: 1.5;">
          Copilote IA — il écoute, il repère le signal, il vous souffle la phrase exacte. Invisible pour le prospect.
        </div>
      </div>

      <div class="phone" style="flex-shrink: 0;">
        <div class="phone-notch"></div>
        <div class="tui">
          <div class="tui-head">
            <div class="tui-live">LIVE · 00:08:42</div>
            <div class="tui-time">SESSION #0421</div>
          </div>
          <div class="tui-title">Appel · Discovery call</div>
          <div class="bubble them">
            <span class="who">Prospect · Marc</span>
            Honnêtement, €19k c'est vraiment la fourchette haute pour nous ce trimestre…
          </div>
          <div style="margin: 10px 0 4px; display: flex; align-items: center; gap: 8px;">
            <span class="sig-dot am"></span>
            <span class="mono" style="font-size: 9px; color: var(--amber); letter-spacing: .12em;">SIGNAL · HÉSITATION PRIX · 0.3s</span>
          </div>
          <div class="copilot">
            <div class="head">
              <span>◉ COPILOTE · DITES CECI</span>
              <span style="color: var(--dim);">0.3s</span>
            </div>
            <div class="phrase">"Je comprends — la question c'est pas le prix, c'est le ROI sur 90 jours. On le cadre ensemble ?"</div>
          </div>
          <div class="bubble you" style="margin-top: 10px;">
            <span class="who">Vous</span>
            Je comprends — la question c'est pas le prix…
          </div>
        </div>
      </div>
    </div>

    ${brandFooter('03', 'DOULEUR')}
  </div>
</section>`;

const c1_slide4 = () => /* html */ `
<section class="slide">
  <div class="inner">
    ${brandHeader('04', '06', "CAS D'USAGE")}

    <div class="col" style="margin-bottom: 20px;">
      <div class="mono uc" style="font-size: 20px; color: var(--muted); margin-bottom: 14px;">Scénario · Objection prix</div>
      <h3 class="serif" style="font-size: 68px; line-height: 1; letter-spacing: -0.02em;">
        Le moment où 9 closers sur 10<br>
        <span class="serif-i em">perdent le deal.</span>
      </h3>
    </div>

    <div class="col grow" style="background: var(--surf-1); border: 1px solid var(--hair); border-radius: 20px; padding: 40px; gap: 22px; font-family: 'JetBrains Mono'; justify-content: center;">
      <div class="row" style="gap: 18px; align-items: flex-start;">
        <div class="mono" style="color: var(--dim); font-size: 16px; padding-top: 4px; min-width: 70px;">09:14</div>
        <div class="sig-dot co" style="margin-top: 14px;"></div>
        <div class="col" style="flex: 1;">
          <div class="mono uc" style="font-size: 13px; color: var(--coral); margin-bottom: 6px;">Prospect</div>
          <div style="font-family: 'Inter Tight'; font-size: 30px; line-height: 1.25; color: var(--text);">"C'est cher. Je peux pas valider ce budget maintenant."</div>
        </div>
      </div>

      <div style="height: 1px; background: var(--hair); margin: 4px 0;"></div>

      <div class="row" style="gap: 18px; align-items: flex-start;">
        <div class="mono" style="color: var(--dim); font-size: 16px; padding-top: 4px; min-width: 70px;">09:14</div>
        <div class="sig-dot em" style="margin-top: 14px;"></div>
        <div class="col" style="flex: 1;">
          <div class="mono uc em" style="font-size: 13px; margin-bottom: 6px;">◉ Tonvo · souffle</div>
          <div class="serif-i" style="font-size: 32px; line-height: 1.25; color: var(--emerald);">
            "Le budget valide pas le ROI — le ROI valide le budget. Sur 90 jours, chiffrons ensemble ce que coûte l'inaction."
          </div>
        </div>
      </div>

      <div style="height: 1px; background: var(--hair); margin: 4px 0;"></div>

      <div class="row" style="gap: 18px; align-items: flex-start;">
        <div class="mono" style="color: var(--dim); font-size: 16px; padding-top: 4px; min-width: 70px;">09:14</div>
        <div class="sig-dot em" style="margin-top: 14px;"></div>
        <div class="col" style="flex: 1;">
          <div class="mono uc" style="font-size: 13px; color: var(--muted); margin-bottom: 6px;">Vous · dit</div>
          <div style="font-family: 'Inter Tight'; font-size: 30px; line-height: 1.25; color: var(--text);">"Le budget valide pas le ROI…" <span class="dim">→ deal repris.</span></div>
        </div>
      </div>
    </div>

    ${brandFooter('04', 'DOULEUR')}
  </div>
</section>`;

const c1_slide5 = () => /* html */ `
<section class="slide">
  <div class="inner">
    ${brandHeader('05', '06', 'LE RÉSULTAT')}

    <div class="col" style="margin-bottom: 32px;">
      <div class="mono uc" style="font-size: 20px; color: var(--muted); margin-bottom: 14px;">Mesuré · 30 jours · Tous utilisateurs</div>
      <h3 class="serif" style="font-size: 68px; line-height: 1; letter-spacing: -0.02em;">
        Des chiffres. <span class="serif-i muted">Pas des promesses.</span>
      </h3>
    </div>

    <div class="col grow" style="gap: 22px; justify-content: center;">
      <div class="row" style="gap: 30px; align-items: flex-end; border-bottom: 1px solid var(--hair); padding-bottom: 22px;">
        <div style="font-family: 'Instrument Serif'; font-size: 200px; line-height: .85; color: var(--emerald); letter-spacing: -0.04em;">+27<span style="font-size: 120px;">%</span></div>
        <div class="col grow" style="padding-bottom: 20px;">
          <div class="mono uc" style="font-size: 18px; color: var(--dim); margin-bottom: 8px;">—— METRIC · CLOSE_RATE</div>
          <div class="serif" style="font-size: 40px; line-height: 1.05; letter-spacing: -0.02em;">Uplift moyen du taux<br>de closing en 30 jours</div>
        </div>
      </div>

      <div class="row" style="gap: 30px; align-items: flex-end; border-bottom: 1px solid var(--hair); padding-bottom: 22px;">
        <div style="font-family: 'Instrument Serif'; font-size: 200px; line-height: .85; color: var(--text); letter-spacing: -0.04em;">3<span class="muted" style="font-size: 120px;">,</span>4<span style="font-size: 120px;">×</span></div>
        <div class="col grow" style="padding-bottom: 20px;">
          <div class="mono uc" style="font-size: 18px; color: var(--dim); margin-bottom: 8px;">—— METRIC · OBJECTION_WIN</div>
          <div class="serif" style="font-size: 40px; line-height: 1.05; letter-spacing: -0.02em;">Taux de victoire<br>sur objection · vs solo</div>
        </div>
      </div>

      <div class="row" style="gap: 30px; align-items: flex-end;">
        <div style="font-family: 'Instrument Serif'; font-size: 200px; line-height: .85; color: var(--text); letter-spacing: -0.04em;">0<span class="muted" style="font-size: 100px;">s</span></div>
        <div class="col grow" style="padding-bottom: 20px;">
          <div class="mono uc" style="font-size: 18px; color: var(--dim); margin-bottom: 8px;">—— METRIC · RESPONSE_LAG</div>
          <div class="serif" style="font-size: 40px; line-height: 1.05; letter-spacing: -0.02em;">De réflexion<br>avant votre coup de closing</div>
        </div>
      </div>
    </div>

    ${brandFooter('05', 'DOULEUR')}
  </div>
</section>`;

const c1_slide6 = () => /* html */ `
<section class="slide">
  <div class="inner" style="padding: 72px;">
    ${brandHeader('06', '06', 'VOTRE TOUR')}

    <div class="grow col" style="justify-content: center; align-items: flex-start;">
      <div class="mono uc em" style="font-size: 22px; margin-bottom: 32px;">◉ ACTIVATION · IMMÉDIATE</div>
      <h1 class="serif" style="font-size: 144px; line-height: .9; letter-spacing: -0.035em;">
        Votre<br>
        prochain appel<br>
        <span class="serif-i em">se close</span><br>
        <span class="serif-i em">tout seul.</span>
      </h1>

      <div class="mono" style="margin-top: 44px; font-size: 22px; color: var(--muted); max-width: 700px; line-height: 1.5;">
        Branchez Tonvo avant votre prochain call. Sortez de la semaine avec un taux de closing plus haut — ou vous êtes remboursé.
      </div>

      <div class="row" style="margin-top: 52px; gap: 28px; align-items: center;">
        <div class="cta">Commencer gratuitement <span class="arrow">→</span></div>
        <div class="col">
          <div class="mono uc em" style="font-size: 14px; margin-bottom: 4px;">· GRATUIT</div>
          <div class="mono" style="font-size: 14px; color: var(--muted); letter-spacing: .1em;">Remboursé si pas de résultat 7j</div>
        </div>
      </div>
    </div>

    ${brandFooter('06', 'DOULEUR')}
  </div>
</section>`;

/* ===== CAROUSEL 2 — ROI ==================================== */

const c2_slide1 = () => /* html */ `
<section class="slide">
  <div class="sweep sweep-em"></div>
  <div class="inner">
    ${brandHeader('01', '06', 'HOOK')}
    <div class="ticker" style="margin-bottom: 18px;">
      <span class="pill win">▲ CLOSE.RATE +27%</span>
      <span class="sep">·</span>
      <span class="pill win">▲ REVENUE +29%</span>
      <span class="sep">·</span>
      <span class="pill">N = 412 CLOSERS</span>
    </div>

    <div class="grow col" style="justify-content: center; align-items: center; text-align: center;">
      <div class="mono uc" style="font-size: 22px; color: var(--muted); margin-bottom: 36px; letter-spacing: .24em;">— 30 JOURS · MESURÉ · GARANTI</div>
      <div style="font-family: 'Instrument Serif'; font-size: 440px; line-height: .82; color: var(--emerald); letter-spacing: -0.06em; text-shadow: 0 0 80px rgba(52,211,153,.2);">
        +27<span style="font-size: 220px;">%</span>
      </div>
      <h1 class="serif" style="font-size: 88px; line-height: .95; letter-spacing: -0.03em; margin-top: 16px;">
        de <span class="serif-i">taux de closing.</span><br>
        <span class="muted" style="font-size: 56px;">Sans changer votre pitch.</span>
      </h1>
    </div>

    ${brandFooter('01', 'ROI')}
  </div>
</section>`;

const c2_slide2 = () => /* html */ `
<section class="slide">
  <div class="inner">
    ${brandHeader('02', '06', 'LA MATH')}

    <div class="col" style="margin-bottom: 30px;">
      <div class="mono uc" style="font-size: 20px; color: var(--muted); margin-bottom: 14px;">Calcul simple · Honest math</div>
      <h3 class="serif" style="font-size: 68px; line-height: 1; letter-spacing: -0.02em;">
        1 deal en plus.<br>
        <span class="serif-i em">L'année entière payée.</span>
      </h3>
    </div>

    <div class="col grow" style="background: var(--surf-1); border: 1px solid var(--hair); border-radius: 20px; padding: 44px; justify-content: center; gap: 22px;">
      <div class="row hair-b" style="padding-bottom: 22px; gap: 28px; align-items: center;">
        <div class="mono uc" style="font-size: 16px; color: var(--dim); width: 340px;">Deal moyen · B2B ticket</div>
        <div class="grow" style="font-family: 'Instrument Serif'; font-size: 88px; line-height: 1; color: var(--text); letter-spacing: -0.03em; text-align: right;">5 000 €</div>
      </div>
      <div class="row hair-b" style="padding-bottom: 22px; gap: 28px; align-items: center;">
        <div class="mono uc" style="font-size: 16px; color: var(--dim); width: 340px;">1 deal de plus / mois · ×12</div>
        <div class="grow" style="font-family: 'Instrument Serif'; font-size: 88px; line-height: 1; color: var(--text); letter-spacing: -0.03em; text-align: right;">60 000 €</div>
      </div>
      <div class="row hair-b" style="padding-bottom: 22px; gap: 28px; align-items: center;">
        <div class="mono uc" style="font-size: 16px; color: var(--coral); width: 340px;">Tonvo Closer · annuel</div>
        <div class="grow" style="font-family: 'Instrument Serif'; font-size: 88px; line-height: 1; color: var(--coral); letter-spacing: -0.03em; text-align: right;">− 228 €</div>
      </div>
      <div class="row" style="gap: 28px; align-items: center;">
        <div class="mono uc em" style="font-size: 18px; width: 340px; letter-spacing: .14em;">◉ RETOUR NET</div>
        <div class="grow" style="font-family: 'Instrument Serif'; font-size: 128px; line-height: 1; color: var(--emerald); letter-spacing: -0.04em; text-align: right;">59 772 €</div>
      </div>
    </div>

    ${brandFooter('02', 'ROI')}
  </div>
</section>`;

const c2_slide3 = () => /* html */ `
<section class="slide">
  <div class="inner">
    ${brandHeader('03', '06', 'LA PREUVE')}

    <div class="col" style="margin-bottom: 24px;">
      <div class="mono uc em" style="font-size: 20px; margin-bottom: 14px;">◉ DASHBOARD · CLOSE RATE TREND</div>
      <h3 class="serif" style="font-size: 68px; line-height: 1; letter-spacing: -0.02em;">
        La courbe qui décide<br>
        <span class="serif-i">votre P&L.</span>
      </h3>
    </div>

    <div class="col grow" style="background: var(--surf-1); border: 1px solid var(--hair); border-radius: 20px; padding: 40px; justify-content: space-between;">
      <div class="row between">
        <div class="col">
          <div class="mono uc" style="font-size: 14px; color: var(--dim); letter-spacing: .12em;">CLOSE RATE · 30 DAYS</div>
          <div style="font-family: 'Instrument Serif'; font-size: 88px; line-height: 1; color: var(--emerald); letter-spacing: -0.03em;">31<span style="font-size: 48px;">%</span></div>
        </div>
        <div class="col" style="align-items: flex-end;">
          <div class="mono uc" style="font-size: 14px; color: var(--dim); letter-spacing: .12em;">DELTA</div>
          <div class="em mono" style="font-size: 44px; font-weight: 500;">+7pts</div>
        </div>
      </div>

      <div style="position: relative; flex: 1; margin: 30px 0;">
        <svg viewBox="0 0 900 380" preserveAspectRatio="none" style="width: 100%; height: 100%;">
          <defs>
            <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="#34d399" stop-opacity=".35"/>
              <stop offset="100%" stop-color="#34d399" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <g stroke="#27272a" stroke-width="1">
            <line x1="0" y1="70" x2="900" y2="70"/>
            <line x1="0" y1="150" x2="900" y2="150"/>
            <line x1="0" y1="230" x2="900" y2="230"/>
            <line x1="0" y1="310" x2="900" y2="310"/>
          </g>
          <path d="M 0 280 L 75 270 L 150 275 L 225 260 L 300 240 L 375 200 L 450 170 L 525 130 L 600 110 L 675 85 L 750 75 L 825 60 L 900 50 L 900 380 L 0 380 Z" fill="url(#grad)"/>
          <path d="M 0 280 L 75 270 L 150 275 L 225 260 L 300 240 L 375 200 L 450 170 L 525 130 L 600 110 L 675 85 L 750 75 L 825 60 L 900 50" fill="none" stroke="#34d399" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
          <circle cx="900" cy="50" r="8" fill="#34d399"/>
          <circle cx="900" cy="50" r="16" fill="none" stroke="#34d399" stroke-width="2" opacity=".4"/>
          <text x="20" y="285" fill="#71717a" font-family="JetBrains Mono" font-size="14">— 24%</text>
          <text x="780" y="44" fill="#34d399" font-family="JetBrains Mono" font-size="16" font-weight="500">31%</text>
          <text x="-10" y="375" fill="#71717a" font-family="JetBrains Mono" font-size="12">J-30</text>
          <text x="440" y="375" fill="#71717a" font-family="JetBrains Mono" font-size="12">J-15</text>
          <text x="870" y="375" fill="#71717a" font-family="JetBrains Mono" font-size="12">J-0</text>
        </svg>
      </div>

      <div class="row between hair-t" style="padding-top: 20px;">
        <div class="col"><div class="mono" style="font-size: 14px; color: var(--dim);">SESSIONS</div><div class="mono" style="font-size: 28px; color: var(--text);">142</div></div>
        <div class="col"><div class="mono" style="font-size: 14px; color: var(--dim);">OBJECTIONS WON</div><div class="mono" style="font-size: 28px; color: var(--emerald);">3.4×</div></div>
        <div class="col"><div class="mono" style="font-size: 14px; color: var(--dim);">AVG TICKET</div><div class="mono" style="font-size: 28px; color: var(--text);">+18%</div></div>
        <div class="col"><div class="mono" style="font-size: 14px; color: var(--dim);">REVENUE</div><div class="mono" style="font-size: 28px; color: var(--emerald);">+29%</div></div>
      </div>
    </div>

    ${brandFooter('03', 'ROI')}
  </div>
</section>`;

const c2_slide4 = () => /* html */ `
<section class="slide">
  <div class="inner">
    ${brandHeader('04', '06', 'PAYÉ EN UN APPEL')}

    <div class="col grow" style="justify-content: center; gap: 40px;">
      <div class="col">
        <div class="mono uc em" style="font-size: 20px; margin-bottom: 24px; letter-spacing: .2em;">◉ TÉMOIGNAGE · CLOSER RETAINED</div>
        <blockquote class="serif" style="font-size: 62px; line-height: 1.1; letter-spacing: -0.02em; max-width: 940px;">
          <span class="em serif" style="font-size: 88px;">«</span> Un deal en plus closé sur le deuxième appel <span class="serif-i em">a payé l'année entière</span> de Tonvo. J'ai arrêté de calculer — j'utilise, ça close.<span class="em serif" style="font-size: 88px;">»</span>
        </blockquote>
      </div>

      <div class="row" style="gap: 26px; align-items: center; padding-top: 28px; border-top: 1px solid var(--hair);">
        <div style="width: 76px; height: 76px; border-radius: 50%; background: linear-gradient(135deg, #5c5c6e 0%, #2a2a30 100%); border: 1px solid var(--hair);"></div>
        <div class="col">
          <div style="font-family: 'Inter Tight'; font-size: 28px; font-weight: 600;">Sarah M.</div>
          <div class="mono" style="font-size: 18px; color: var(--dim); letter-spacing: .06em;">Account Executive · SaaS B2B</div>
        </div>
        <div class="grow"></div>
        <div class="col" style="align-items: flex-end;">
          <div class="mono em" style="font-size: 22px; font-weight: 500;">+29% revenue</div>
          <div class="mono" style="font-size: 14px; color: var(--dim); letter-spacing: .1em;">MOIS #1</div>
        </div>
      </div>
    </div>

    ${brandFooter('04', 'ROI')}
  </div>
</section>`;

const c2_slide5 = () => /* html */ `
<section class="slide">
  <div class="inner">
    ${brandHeader('05', '06', 'BÉNÉFICES')}

    <div class="col" style="margin-bottom: 32px;">
      <div class="mono uc" style="font-size: 20px; color: var(--muted); margin-bottom: 14px;">3 raisons pour lesquelles ça marche</div>
      <h3 class="serif" style="font-size: 68px; line-height: 1; letter-spacing: -0.02em;">
        Mesurable. Défendable.<br>
        <span class="serif-i em">Remboursable.</span>
      </h3>
    </div>

    <div class="col grow" style="gap: 20px; justify-content: center;">
      <div class="row" style="gap: 32px; padding: 30px; background: var(--surf-1); border: 1px solid var(--hair); border-radius: 20px; align-items: center;">
        <div style="font-family: 'Instrument Serif'; font-size: 128px; line-height: .85; color: var(--emerald); letter-spacing: -0.04em; min-width: 280px;">+29<span style="font-size: 80px;">%</span></div>
        <div class="col grow">
          <div class="mono uc" style="font-size: 16px; color: var(--dim); margin-bottom: 6px;">— Revenue uplift · mois #1</div>
          <div class="serif" style="font-size: 42px; line-height: 1.05; letter-spacing: -0.02em;">Du chiffre, pas du confort.</div>
        </div>
      </div>

      <div class="row" style="gap: 32px; padding: 30px; background: var(--surf-1); border: 1px solid var(--hair); border-radius: 20px; align-items: center;">
        <div style="font-family: 'Instrument Serif'; font-size: 128px; line-height: .85; color: var(--text); letter-spacing: -0.04em; min-width: 280px;">3<span class="muted" style="font-size: 88px;">,</span>4<span style="font-size: 88px;">×</span></div>
        <div class="col grow">
          <div class="mono uc" style="font-size: 16px; color: var(--dim); margin-bottom: 6px;">— Victoire sur objection · vs solo</div>
          <div class="serif" style="font-size: 42px; line-height: 1.05; letter-spacing: -0.02em;">Les objections ne tuent plus le deal.</div>
        </div>
      </div>

      <div class="row" style="gap: 32px; padding: 30px; background: var(--surf-1); border: 1px solid var(--emerald-d); border-radius: 20px; align-items: center; box-shadow: 0 0 50px rgba(52,211,153,.05);">
        <div style="font-family: 'Instrument Serif'; font-size: 128px; line-height: .85; color: var(--emerald); letter-spacing: -0.04em; min-width: 280px;">7<span style="font-size: 60px;">jours</span></div>
        <div class="col grow">
          <div class="mono uc em" style="font-size: 16px; margin-bottom: 6px;">◉ Garantie résultat · ou remboursé</div>
          <div class="serif" style="font-size: 42px; line-height: 1.05; letter-spacing: -0.02em;">On vend des résultats. Pas du logiciel.</div>
        </div>
      </div>
    </div>

    ${brandFooter('05', 'ROI')}
  </div>
</section>`;

const c2_slide6 = () => /* html */ `
<section class="slide">
  <div class="inner">
    ${brandHeader('06', '06', 'VOTRE TOUR')}

    <div class="grow col" style="justify-content: center; align-items: flex-start;">
      <div class="mono uc em" style="font-size: 22px; margin-bottom: 32px;">◉ À PARTIR DE 19€/MOIS</div>
      <h1 class="serif" style="font-size: 136px; line-height: .9; letter-spacing: -0.035em;">
        Un mois de closing<br>
        <span class="serif-i em">paye l'année.</span>
      </h1>

      <div class="mono" style="margin-top: 44px; font-size: 22px; color: var(--muted); max-width: 780px; line-height: 1.5;">
        Si votre taux de closing ne bouge pas en 7 jours, on vous rembourse intégralement. On vend du résultat — si vous ne l'obtenez pas, on ne garde pas votre argent.
      </div>

      <div class="row" style="margin-top: 52px; gap: 28px; align-items: center;">
        <div class="cta">Tester maintenant <span class="arrow">→</span></div>
        <div class="col">
          <div class="mono uc em" style="font-size: 14px; margin-bottom: 4px;">· GARANTIE 7 JOURS</div>
          <div class="mono" style="font-size: 14px; color: var(--muted); letter-spacing: .1em;">Remboursé si pas de résultat</div>
        </div>
      </div>
    </div>

    ${brandFooter('06', 'ROI')}
  </div>
</section>`;

/* ===== CAROUSEL 3 — FOMO =================================== */

const c3_slide1 = () => /* html */ `
<section class="slide">
  <div class="inner" style="padding: 72px;">
    ${brandHeader('01', '06', 'HOOK')}

    <div class="grow col" style="justify-content: center;">
      <div class="row" style="gap: 60px; align-items: center;">
        <div class="col" style="flex: 1;">
          <div class="mono uc" style="font-size: 18px; color: var(--dim); margin-bottom: 20px; letter-spacing: .2em;">— VOTRE CONCURRENT</div>
          <div class="serif" style="font-size: 72px; line-height: 1; color: var(--dim); letter-spacing: -0.02em; font-style: italic;">
            cherche sa<br>phrase.
          </div>
          <div class="mono" style="margin-top: 26px; font-size: 18px; color: var(--dim); letter-spacing: .08em;">· −€12K / call · silence · hésitation</div>
        </div>

        <div class="col" style="gap: 10px; align-items: center; padding: 0 24px;">
          <div style="width: 1px; height: 180px; background: linear-gradient(180deg, transparent, var(--hair), transparent);"></div>
          <div class="mono" style="font-size: 14px; color: var(--dim); letter-spacing: .2em;">VS</div>
          <div style="width: 1px; height: 180px; background: linear-gradient(180deg, transparent, var(--hair), transparent);"></div>
        </div>

        <div class="col" style="flex: 1;">
          <div class="mono uc em" style="font-size: 18px; margin-bottom: 20px; letter-spacing: .2em;">◉ VOUS · AVEC TONVO</div>
          <div class="serif" style="font-size: 72px; line-height: 1; color: var(--emerald); letter-spacing: -0.02em;">
            <span class="serif-i">la dites</span><br>déjà.
          </div>
          <div class="mono em" style="margin-top: 26px; font-size: 18px; letter-spacing: .08em;">· +€47K / call · signal · closed</div>
        </div>
      </div>

      <div style="margin-top: 80px; text-align: center;">
        <h1 class="serif" style="font-size: 104px; line-height: .95; letter-spacing: -0.03em;">
          Le closer que <span class="serif-i">votre concurrent</span><br>
          n'a <span class="em">pas.</span>
        </h1>
      </div>
    </div>

    ${brandFooter('01', 'FOMO')}
  </div>
</section>`;

const c3_slide2 = () => /* html */ `
<section class="slide">
  <div class="inner">
    ${brandHeader('02', '06', 'LE TIMING')}

    <div class="col" style="margin-bottom: 30px;">
      <div class="mono uc" style="font-size: 20px; color: var(--amber); margin-bottom: 14px;">◦ DÉLAI DE RÉFLEXION · AVG</div>
      <h3 class="serif" style="font-size: 72px; line-height: 1; letter-spacing: -0.02em;">
        Pendant qu'il cherche<br>
        <span class="serif-i">sa phrase.</span>
      </h3>
    </div>

    <div class="col grow" style="background: var(--surf-1); border: 1px solid var(--hair); border-radius: 20px; padding: 44px; justify-content: center; align-items: center; gap: 32px;">
      <div class="row" style="gap: 40px; width: 100%; align-items: center; justify-content: center;">
        <div class="col" style="align-items: center;">
          <div class="mono uc" style="font-size: 18px; color: var(--coral); margin-bottom: 16px; letter-spacing: .2em;">VOTRE CONCURRENT</div>
          <div style="font-family: 'Instrument Serif'; font-size: 224px; line-height: .85; color: var(--coral); letter-spacing: -0.05em;">6<span class="muted" style="font-size: 120px;">,</span>4<span style="font-size: 120px;">s</span></div>
          <div class="mono" style="font-size: 16px; color: var(--muted); margin-top: 10px;">DE BLOCAGE · SIGNAL PERDU</div>
        </div>

        <div style="font-family: 'Instrument Serif'; font-size: 128px; color: var(--hair); line-height: 1;">—</div>

        <div class="col" style="align-items: center;">
          <div class="mono uc em" style="font-size: 18px; margin-bottom: 16px; letter-spacing: .2em;">◉ VOUS · TONVO</div>
          <div style="font-family: 'Instrument Serif'; font-size: 224px; line-height: .85; color: var(--emerald); letter-spacing: -0.05em;">0<span class="muted" style="font-size: 100px;">,</span>3<span style="font-size: 120px;">s</span></div>
          <div class="mono em" style="font-size: 16px; margin-top: 10px;">SIGNAL → PHRASE · LIVE</div>
        </div>
      </div>

      <div style="width: 100%; padding: 24px; background: rgba(248,113,113,.04); border: 1px solid var(--coral-d); border-radius: 14px; text-align: center;">
        <div class="serif-i" style="font-size: 36px; line-height: 1.15; color: var(--text);">
          "6 secondes de flottement, c'est un deal de <span class="coral">5 chiffres</span> qui s'en va."
        </div>
      </div>
    </div>

    ${brandFooter('02', 'FOMO')}
  </div>
</section>`;

const c3_slide3 = () => /* html */ `
<section class="slide">
  <div class="sweep sweep-em"></div>
  <div class="inner">
    ${brandHeader('03', '06', 'LA SOLUTION')}

    <div class="grow row" style="gap: 50px; align-items: center;">
      <div class="col" style="flex: 1;">
        <div class="mono uc em" style="font-size: 20px; margin-bottom: 28px;">◉ INVISIBLE · INSTANTANÉ · DÉCISIF</div>
        <h2 class="serif" style="font-size: 92px; line-height: .95; letter-spacing: -0.03em;">
          Vous,<br>
          <span class="serif-i em">vous la dites</span><br>
          déjà.
        </h2>
        <div class="mono" style="margin-top: 32px; font-size: 20px; color: var(--muted); max-width: 440px; line-height: 1.5;">
          Le copilote tourne dans une fenêtre séparée — invisible pour l'autre côté, même en partage d'écran. Votre avantage reste votre avantage.
        </div>

        <div class="row" style="margin-top: 40px; gap: 14px; flex-wrap: wrap;">
          <span class="pill" style="padding: 10px 18px; border: 1px solid var(--emerald-d); border-radius: 999px; font-family: 'JetBrains Mono'; font-size: 14px; color: var(--emerald); letter-spacing: .14em;">◉ INVISIBLE</span>
          <span class="pill" style="padding: 10px 18px; border: 1px solid var(--emerald-d); border-radius: 999px; font-family: 'JetBrains Mono'; font-size: 14px; color: var(--emerald); letter-spacing: .14em;">◉ SILENCIEUX</span>
          <span class="pill" style="padding: 10px 18px; border: 1px solid var(--emerald-d); border-radius: 999px; font-family: 'JetBrains Mono'; font-size: 14px; color: var(--emerald); letter-spacing: .14em;">◉ TEMPS RÉEL</span>
        </div>
      </div>

      <div class="phone" style="flex-shrink: 0;">
        <div class="phone-notch"></div>
        <div class="tui">
          <div class="tui-head">
            <div class="tui-live">LIVE · 00:12:18</div>
            <div class="tui-time">CALL #A7</div>
          </div>
          <div class="tui-title">Session · Négo contrat</div>

          <div class="bubble them">
            <span class="who">Prospect · Claire</span>
            On a regardé avec notre board, c'est un engagement trop long pour nous.
          </div>

          <div style="margin: 10px 0 4px; display: flex; align-items: center; gap: 8px;">
            <span class="sig-dot em"></span>
            <span class="mono" style="font-size: 9px; color: var(--emerald); letter-spacing: .12em;">SIGNAL · OBJECTION ENGAGEMENT · 0.2s</span>
          </div>

          <div class="copilot">
            <div class="head">
              <span>◉ COPILOTE · DITES CECI</span>
              <span style="color: var(--dim);">PRIO 01</span>
            </div>
            <div class="phrase">"Engagement long = risque pour vous. Testons 60 jours — si ça ne bouge pas, on arrête. Pas d'engagement, pas de facture."</div>
          </div>

          <div class="row" style="gap: 6px; margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--hair); font-family: 'JetBrains Mono'; font-size: 9px; color: var(--dim); letter-spacing: .12em;">
            <span>◦ ALT · REFRAME</span>
            <span>·</span>
            <span>◦ ALT · ANCRE ROI</span>
          </div>
        </div>
      </div>
    </div>

    ${brandFooter('03', 'FOMO')}
  </div>
</section>`;

const c3_slide4 = () => /* html */ `
<section class="slide">
  <div class="inner">
    ${brandHeader('04', '06', 'POUR QUI ?')}

    <div class="col" style="margin-bottom: 26px;">
      <div class="mono uc" style="font-size: 20px; color: var(--muted); margin-bottom: 14px;">— Les opérateurs qui vivent de leur close rate</div>
      <h3 class="serif" style="font-size: 68px; line-height: 1; letter-spacing: -0.02em;">
        Fait pour ceux qui<br>
        <span class="serif-i em">comptent en deals.</span>
      </h3>
    </div>

    <div class="col grow" style="gap: 16px; justify-content: center;">
      <div class="row" style="gap: 24px; padding: 24px 28px; background: var(--surf-1); border: 1px solid var(--hair); border-radius: 16px; align-items: center;">
        <div class="mono" style="font-size: 20px; color: var(--emerald); letter-spacing: .14em; width: 60px;">01</div>
        <div class="col grow">
          <div style="font-family: 'Inter Tight'; font-size: 32px; font-weight: 600; line-height: 1.1;">Closers haut de gamme</div>
          <div class="mono" style="font-size: 16px; color: var(--muted); margin-top: 4px;">Deals à 5 chiffres · sans discount · sans bluff</div>
        </div>
        <div class="mono em" style="font-size: 22px;">+31%</div>
      </div>

      <div class="row" style="gap: 24px; padding: 24px 28px; background: var(--surf-1); border: 1px solid var(--hair); border-radius: 16px; align-items: center;">
        <div class="mono" style="font-size: 20px; color: var(--emerald); letter-spacing: .14em; width: 60px;">02</div>
        <div class="col grow">
          <div style="font-family: 'Inter Tight'; font-size: 32px; font-weight: 600; line-height: 1.1;">Coachs en négociation</div>
          <div class="mono" style="font-size: 16px; color: var(--muted); margin-top: 4px;">Chaque appel · une bibliothèque de patterns prouvés</div>
        </div>
        <div class="mono em" style="font-size: 22px;">3.4×</div>
      </div>

      <div class="row" style="gap: 24px; padding: 24px 28px; background: var(--surf-1); border: 1px solid var(--hair); border-radius: 16px; align-items: center;">
        <div class="mono" style="font-size: 20px; color: var(--emerald); letter-spacing: .14em; width: 60px;">03</div>
        <div class="col grow">
          <div style="font-family: 'Inter Tight'; font-size: 32px; font-weight: 600; line-height: 1.1;">Consultants · retainer</div>
          <div class="mono" style="font-size: 16px; color: var(--muted); margin-top: 4px;">Protéger la marge · défendre le périmètre</div>
        </div>
        <div class="mono em" style="font-size: 22px;">+18%</div>
      </div>

      <div class="row" style="gap: 24px; padding: 24px 28px; background: var(--surf-1); border: 1px solid var(--hair); border-radius: 16px; align-items: center;">
        <div class="mono" style="font-size: 20px; color: var(--emerald); letter-spacing: .14em; width: 60px;">04</div>
        <div class="col grow">
          <div style="font-family: 'Inter Tight'; font-size: 32px; font-weight: 600; line-height: 1.1;">Renouvellements · upsell</div>
          <div class="mono" style="font-size: 16px; color: var(--muted); margin-top: 4px;">Point d'étape → upsell · en live · pas par email</div>
        </div>
        <div class="mono em" style="font-size: 22px;">5×</div>
      </div>
    </div>

    ${brandFooter('04', 'FOMO')}
  </div>
</section>`;

const c3_slide5 = () => /* html */ `
<section class="slide">
  <div class="inner">
    ${brandHeader('05', '06', "L'AVANTAGE")}

    <div class="col" style="margin-bottom: 32px;">
      <div class="mono uc" style="font-size: 20px; color: var(--muted); margin-bottom: 14px;">— Trois choses que votre concurrent n'a pas</div>
      <h3 class="serif" style="font-size: 68px; line-height: 1; letter-spacing: -0.02em;">
        Un avantage<br>
        <span class="serif-i em">asymétrique.</span>
      </h3>
    </div>

    <div class="row grow" style="gap: 18px;">
      <div class="col" style="flex: 1; padding: 34px; background: var(--surf-1); border: 1px solid var(--hair); border-radius: 20px; justify-content: space-between;">
        <div>
          <div class="mono" style="font-size: 16px; color: var(--dim); letter-spacing: .14em; margin-bottom: 18px;">— 01 · INVISIBLE</div>
          <div style="font-family: 'Instrument Serif'; font-size: 130px; line-height: .85; color: var(--emerald); letter-spacing: -0.04em;">0</div>
          <div class="mono" style="font-size: 15px; color: var(--muted); letter-spacing: .1em; margin-top: 6px;">CE QUE VOIT LE PROSPECT</div>
        </div>
        <div class="serif" style="font-size: 28px; line-height: 1.15; letter-spacing: -0.02em; margin-top: 24px;">
          Aucun partage d'écran ne trahit Tonvo. <span class="muted serif-i">Jamais.</span>
        </div>
      </div>

      <div class="col" style="flex: 1; padding: 34px; background: var(--surf-1); border: 1px solid var(--hair); border-radius: 20px; justify-content: space-between;">
        <div>
          <div class="mono" style="font-size: 16px; color: var(--dim); letter-spacing: .14em; margin-bottom: 18px;">— 02 · INSTANTANÉ</div>
          <div style="font-family: 'Instrument Serif'; font-size: 130px; line-height: .85; color: var(--text); letter-spacing: -0.04em;">0<span style="font-size: 60px; color: var(--muted);">,3</span><span style="font-size: 72px; color: var(--muted);">s</span></div>
          <div class="mono" style="font-size: 15px; color: var(--muted); letter-spacing: .1em; margin-top: 6px;">SIGNAL → PHRASE PRÊTE</div>
        </div>
        <div class="serif" style="font-size: 28px; line-height: 1.15; letter-spacing: -0.02em; margin-top: 24px;">
          Plus rapide que votre <span class="muted serif-i">hésitation.</span>
        </div>
      </div>

      <div class="col" style="flex: 1; padding: 34px; background: var(--surf-1); border: 1px solid var(--emerald-d); border-radius: 20px; justify-content: space-between; box-shadow: 0 0 40px rgba(52,211,153,.06);">
        <div>
          <div class="mono em" style="font-size: 16px; letter-spacing: .14em; margin-bottom: 18px;">◉ 03 · DÉCISIF</div>
          <div style="font-family: 'Instrument Serif'; font-size: 130px; line-height: .85; color: var(--emerald); letter-spacing: -0.04em;">+27<span style="font-size: 60px;">%</span></div>
          <div class="mono em" style="font-size: 15px; letter-spacing: .1em; margin-top: 6px;">CLOSE RATE · 30 JOURS</div>
        </div>
        <div class="serif" style="font-size: 28px; line-height: 1.15; letter-spacing: -0.02em; margin-top: 24px;">
          Un écart que votre concurrent ne <span class="em serif-i">rattrapera pas.</span>
        </div>
      </div>
    </div>

    ${brandFooter('05', 'FOMO')}
  </div>
</section>`;

const c3_slide6 = () => /* html */ `
<section class="slide">
  <div class="inner">
    ${brandHeader('06', '06', 'VOTRE TOUR')}

    <div class="grow col" style="justify-content: center; align-items: flex-start;">
      <div class="mono uc em" style="font-size: 22px; margin-bottom: 32px;">◉ GRATUIT · SANS CARTE</div>
      <h1 class="serif" style="font-size: 136px; line-height: .9; letter-spacing: -0.035em;">
        Pendant qu'ils<br>
        <span class="muted">hésitent,</span><br>
        <span class="serif-i em">vous signez.</span>
      </h1>

      <div class="mono" style="margin-top: 44px; font-size: 22px; color: var(--muted); max-width: 700px; line-height: 1.5;">
        Activez votre avantage avant votre prochain appel. Votre concurrent ne sait pas que Tonvo existe — et il ne le saura qu'au moment de perdre le deal.
      </div>

      <div class="row" style="margin-top: 52px; gap: 28px; align-items: center;">
        <div class="cta">Essayer gratuitement <span class="arrow">→</span></div>
        <div class="col">
          <div class="mono uc em" style="font-size: 14px; margin-bottom: 4px;">· 3 SESSIONS / MOIS</div>
          <div class="mono" style="font-size: 14px; color: var(--muted); letter-spacing: .1em;">Sans carte · upgrade quand ça close</div>
        </div>
      </div>
    </div>

    ${brandFooter('06', 'FOMO')}
  </div>
</section>`;

/* ------------------------------------------------------------------ */
/* SLIDE REGISTRY                                                      */
/* ------------------------------------------------------------------ */

const SLIDES = [
  { carousel: '01', slide: '01', label: 'Hook',    builder: c1_slide1 },
  { carousel: '01', slide: '02', label: 'Problem', builder: c1_slide2 },
  { carousel: '01', slide: '03', label: 'Solution',builder: c1_slide3 },
  { carousel: '01', slide: '04', label: 'UseCase', builder: c1_slide4 },
  { carousel: '01', slide: '05', label: 'Benefit', builder: c1_slide5 },
  { carousel: '01', slide: '06', label: 'CTA',     builder: c1_slide6 },

  { carousel: '02', slide: '01', label: 'Hook',    builder: c2_slide1 },
  { carousel: '02', slide: '02', label: 'Problem', builder: c2_slide2 },
  { carousel: '02', slide: '03', label: 'Solution',builder: c2_slide3 },
  { carousel: '02', slide: '04', label: 'UseCase', builder: c2_slide4 },
  { carousel: '02', slide: '05', label: 'Benefit', builder: c2_slide5 },
  { carousel: '02', slide: '06', label: 'CTA',     builder: c2_slide6 },

  { carousel: '03', slide: '01', label: 'Hook',    builder: c3_slide1 },
  { carousel: '03', slide: '02', label: 'Problem', builder: c3_slide2 },
  { carousel: '03', slide: '03', label: 'Solution',builder: c3_slide3 },
  { carousel: '03', slide: '04', label: 'UseCase', builder: c3_slide4 },
  { carousel: '03', slide: '05', label: 'Benefit', builder: c3_slide5 },
  { carousel: '03', slide: '06', label: 'CTA',     builder: c3_slide6 },
];

/* ------------------------------------------------------------------ */
/* HTML WRAPPER                                                        */
/* ------------------------------------------------------------------ */

const buildHtml = (slideHtml) => /* html */ `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600;700;800&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>${GLOBAL_CSS}</style>
</head>
<body>${slideHtml}</body>
</html>`;

/* ------------------------------------------------------------------ */
/* RENDERER                                                            */
/* ------------------------------------------------------------------ */

async function main() {
  console.log('▶ Launching Chromium...');
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=medium']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 });

  const manifestEntries = [];

  for (const s of SLIDES) {
    const outDir = path.join(OUT, `carousel-${s.carousel}`);
    await fs.mkdir(outDir, { recursive: true });
    const outFile = path.join(outDir, `slide-${s.slide}.png`);

    const html = buildHtml(s.builder());
    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 60000 });
    // wait for web fonts to actually load before screenshotting
    await page.evaluate(() => document.fonts.ready);
    await new Promise(r => setTimeout(r, 250));

    const section = await page.$('section.slide');
    if (!section) throw new Error('no slide element rendered');

    await section.screenshot({
      path: outFile,
      type: 'png',
      omitBackground: false
    });

    manifestEntries.push({
      carousel: s.carousel,
      slide: s.slide,
      label: s.label,
      path: path.relative(ROOT, outFile).replace(/\\/g, '/')
    });

    console.log(`  ✓ carousel-${s.carousel} / slide-${s.slide}  (${s.label})`);
  }

  await browser.close();

  const manifest = {
    generated_at: new Date().toISOString(),
    product: 'Tonvo',
    dimensions: { width: WIDTH, height: HEIGHT, scale: 2 },
    design_system: {
      palette: ['#09090b', '#111114', '#18181b', '#34d399', '#fbbf24', '#f87171', '#fafafa', '#a1a1aa'],
      fonts: ['Instrument Serif', 'JetBrains Mono', 'Inter Tight'],
      direction: 'Dark Editorial Terminal'
    },
    carousels: [
      { id: 'carousel-01', angle: 'Douleur / urgence',  hook: 'Vous avez perdu combien de deals cette semaine ?', cta: 'Commencer gratuitement' },
      { id: 'carousel-02', angle: 'ROI / preuve',       hook: '+27% de close rate en 30 jours.',                  cta: 'Tester maintenant' },
      { id: 'carousel-03', angle: 'FOMO / concurrence', hook: "Le closer que votre concurrent n'a pas.",           cta: 'Essayer gratuitement' }
    ],
    slides: manifestEntries
  };

  await fs.writeFile(path.join(OUT, '_manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`\n✓ Done — ${manifestEntries.length} slides + manifest.`);
  console.log(`  Output: ${OUT}`);
}

main().catch(e => { console.error(e); process.exit(1); });

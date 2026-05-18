# Tech overlay — Brief D [Stop Pitching From Memory]
_Tech Director: Claude Opus · Date: 2026-05-03_

## Context note
Brief D is a **dual deliverable**: 3 Pattern-6 statics (white-on-black contrarian one-liners) at 1:1 + 4:5, plus a 24s 9:16 motion video. The motion is the secondary lead — statics are primary. Forks from Ad11. Only one new visual primitive: an audio-waveform graphic in S2 with 50 vertical bars and 3 designated bars that spike red on cue. The honest tech questions:

1. Does the audio-waveform SVG land as CSS-animation, or do we need Rive for state-machine smoothness?
2. Do the statics need FLUX key-art, or is Pattern-6 white-on-bg the entire visual?
3. Any premium VO needed for the motion?

## Statics decision (Pattern 6 contrarian one-liners)

| Asset | Default sufficient? | Premium tool | Reason | Cost / time |
|---|---|---|---|---|
| Static A (1:1) "Your playbook is a PDF nobody opens." | **Yes** | — | Pattern 6 = white-on-#09090b, Inter 800, chrome silver-sweep on "in the call." sub-line. NO image. The whole point of Pattern 6 is text-only distinctiveness in an image-heavy feed. **Adding FLUX or any image kills the pattern.** Render via headless Puppeteer from HF static template. | $0 / 0.3h |
| Static A (4:5) | **Yes** | — | Same Puppeteer render at 1080×1350. Headline upsizes 88px → 100px per brief. | $0 / 0.1h |
| Static B (1:1) "Stop pitching from memory." | **Yes** | — | Same Pattern-6 primitive, different headline. | $0 / 0.1h |
| Static B (4:5) | **Yes** | — | Same. | $0 / 0.1h |
| Static C (1:1) "deck and a vibe" — alternate | **Yes** | — | Same. Per brief, this variant is flagged for tone-check before launch. **Tooling is identical regardless of tone-check outcome.** | $0 / 0.1h |
| Static C (4:5) | **Yes** | — | Same. | $0 / 0.1h |

**Verdict on statics: 100% default stack.** Reuse `scripts/generate-carousels/` Puppeteer infrastructure (per memory rule — Tonvo carousel generator). Total ~30min job for all 6 PNG exports.

## Motion video scene-by-scene tool decision

| Scene | Default sufficient? | Premium tool | Reason | Cost / time |
|---|---|---|---|---|
| S0 (POV Friday — "0 deals" chrome) | **Yes** | — | 3-line vertical stack, chrome silver-sweep on "0 deals." Reuses Ad11 S0 primitive. Optional VO line "POV: it's Friday." is 1.0s — Edge TTS Aria handles it fine. | $0 / 0.5h |
| S1 (Playbook PDF problem) | **Yes** | — | Vertical-stack chrome primitive from Ad11 S1. Edge TTS narrator line. Default ships. | $0 / 0.5h |
| **S2 (Audio waveform + 3 strike cards)** | **Yes** | — | The waveform is the only new primitive. Build as inline SVG with 50 vertical bars, GSAP-animates each bar's `height` attribute on a randomized loop, plus 3 designated bars (positions 12, 28, 41) that animate `fill: #34d399 → #ef4444` on cue with `detect-ping-lo.wav`. **CSS+GSAP can do this cleanly in ~2h.** Rive is overkill — we don't need a state-machine, we need a 7s animated SVG that plays linearly with audio cues. **Honest call: stay default.** | $0 / 2h |
| S3 (Tonvo + iPhone17) | **Yes** | — | Reused iPhone17Mockup primitive. Default ships. | $0 / 0.5h |
| S4 (1,247 + 27% compressed proof) | **Yes** | — | 2-second compressed proof, badge + italic line, Edge TTS narrator. Default ships. | $0 / 0.3h |
| S6 (Slogan + CTA) | **Yes** | — | Reuse `slogan_final.mp3` from Ad11. Brief notes S6 is at the lower 2s bound — confirm timing fits, otherwise extend total to 26s. | $0 / 0.0h |

## Honest call: SVG+GSAP vs Rive for S2 waveform?

**SVG+GSAP wins.** Reasoning:

- **What we need:** 50 bars, randomized base heights 8-30px, GSAP tween on `attr: { height: random }` looping every 1.2s, plus 3 specific bars firing a color-change at known timestamps (sync'd to detect-ping-lo SFX).
- **What Rive offers:** state-machine animations, 50-80% smaller payload, GUI-authored. **But:** Rive requires a runtime SDK (.riv file load, runtime canvas), our HF base is HTML+GSAP, no Rive runtime imported. Adding Rive = +1 dependency, +1 rendering surface, +potential headless-render compatibility risk with Playwright capture.
- **Smoothness:** at 60fps on a 1080×1920 canvas, 50 bars × `attr` tween is ~3000 GSAP operations/s — well within GSAP 4 budget. Modern Chromium renders this without frame drops. Rive doesn't materially win on smoothness at this scale.
- **Cost:** SVG+GSAP = $0 + 2h dev. Rive = $14/mo subscription + 4h dev (build the .riv in Rive editor + wire runtime). **Wrong tradeoff.**

**Verdict: ship the waveform as inline SVG + GSAP.** If post-launch the waveform reads "cheap" or stutters in MP4 export, escalate to Rive in v2.

## Honest call: AI music (Suno/Stable Audio) for the 24s motion?

**No.** `tense-cinematic.mp3` at -18dB is the locked v1 music bed. The motion is 24s, which is short enough that a 30s loop of tense-cinematic doesn't reveal its loop-point. The waveform-spike beats in S2 sync to detect-ping-lo SFX, not to musical hits — so we don't need the music to escalate in sync. **Stable Audio re-prompt for a custom 24s bed = +$0.50 + 2h iteration for ~0% hold-rate gain. Skip.**

## Honest call: ElevenLabs for any motion VO?

**No.** All motion VO is narrator-mode (no character payoff like Brief C's Sarah). Edge TTS Aria handles it. The brief has 5 new VO segments at ~17s total render — Edge ships in 5min, free. **Defer ElevenLabs to briefs that have an emotional or character beat.**

## Honest call: FLUX key art for any beat?

**No.** Brief D's whole visual identity is "white-on-black contrarian text" (statics) + "chrome text + iPhone17 + waveform" (motion). FLUX-generated chrome/glass hero stills would be an image where the brief explicitly wants no image. Skip.

## Total premium budget for this brief
- **Time:** +0h
- **Cost:** $0.00
- **Hold-rate uplift estimate:** N/A — no premium tools used. All-default delivery.

**Brief D is the cheapest brief in the campaign on premium tooling.** That's the right answer — Pattern 6 statics derive their distinctiveness from text-only minimalism, and the motion's 1 new primitive (waveform SVG) is well within default-stack capability.

## Risks

- **Waveform SVG renders differently on Playwright headless vs production browser:** Mitigation: render the final MP4 via Playwright at 60fps, do a side-by-side QA against in-browser playback. If the SVG `attr` tween stutters under headless capture, fall back to a pre-rendered `<video>` element of the waveform animation (capture once, replay infinitely).
- **S6 slogan timing at 2s lower bound:** Brief flags this. If `slogan_final.mp3` is 3.5s, extend total motion duration to 26s and give S6 a full 4s. **Producer should confirm slogan_final.mp3 actual length before locking timeline.**
- **Static C tone-check:** "deck and a vibe" copy may read as too cocky. Pure copy-decision, not tooling. Producer ships statics A and B regardless; static C waits for Emilien sign-off.

## Producer notes

### Step 1 — Statics (3 variants × 2 aspect ratios = 6 PNGs)

Reuse the Tonvo carousel generator infrastructure at `scripts/generate-carousels/` (per memory rule).

Build a static template at `Tonvo-Ad-HF-stop-pitching-static/index.html`:

```html
<!DOCTYPE html>
<html><head>
  <meta name="viewport" content="width=1080,initial-scale=1">
  <style>
    body { width: 1080px; height: 1080px; background: #09090b; margin: 0;
           font-family: 'Inter', sans-serif; color: #fafafa;
           display: flex; flex-direction: column; justify-content: center;
           align-items: center; padding: 56px; box-sizing: border-box; }
    .grid-bg { position: absolute; inset: 0; opacity: 0.07; /* ... grid SVG ... */ }
    .headline { font-weight: 800; font-size: 88px; letter-spacing: -0.04em;
                line-height: 1.05; max-width: 720px; text-align: center; }
    .headline .accent { font-style: italic; color: #a1a1aa; }
    .subline { font-style: italic; font-size: 32px; color: #a1a1aa;
               margin-top: 36px; text-align: center; }
    .chrome { background: linear-gradient(135deg, #fafafa, #71717a, #fafafa);
              background-clip: text; -webkit-text-fill-color: transparent; }
    .footer { position: absolute; bottom: 56px; display: flex; align-items: center; gap: 24px; }
    .footer img { height: 64px; }
    .footer .cta { font-weight: 600; font-size: 22px; color: #a1a1aa; }
  </style>
</head><body>
  <div class="grid-bg"></div>
  <h1 class="headline" id="headline">Your playbook is a PDF nobody <span class="accent">opens.</span></h1>
  <p class="subline" id="subline">Tonvo is the playbook, <span class="chrome">in the call.</span></p>
  <div class="footer">
    <img src="../Tonvo-Ad-HF/assets/logo-tonvo-remove.png" alt="">
    <span class="cta">Try Free → tonvo.co</span>
  </div>
</body></html>
```

Then render 6 PNGs via Puppeteer:

```bash
node scripts/generate-carousels/render-static.js \
  --template "Tonvo-Ad-HF-stop-pitching-static/index.html" \
  --variants "A,B,C" \
  --aspects "1080x1080,1080x1350" \
  --output-dir "out/static-d/"
```

Variant text overrides at render-time:
- A: headline "Your playbook is a PDF nobody **opens.**" / sub "Tonvo is the playbook, **in the call.**"
- B: headline "Stop pitching from **memory.**" / sub "Tonvo flags the objection and the line that closes it. Live."
- C: headline "You walked into your last 12 demos with a deck and a **vibe.**" / sub "The pros use a copilot. Try free → tonvo.co"

For 4:5, increase headline font 88px → 100px.

### Step 2 — Motion video fork + Edge TTS

```bash
cp -r "Tonvo-Ad-HF" "Tonvo-Ad-HF-stop-pitching"
cd "Tonvo-Ad-HF-stop-pitching"
```

Render 5 Edge TTS segments (free):

```bash
edge-tts --voice "en-US-AriaNeural" --text "POV: it's Friday." \
  --write-media "assets/audio/ad-d_s0.mp3"

edge-tts --voice "en-US-AriaNeural" --text "Your playbook is a PDF nobody opens." \
  --write-media "assets/audio/ad-d_s1.mp3"

edge-tts --voice "en-US-AriaNeural" --text "You walked into your last twelve demos with a deck and a vibe. Your competition didn't." \
  --write-media "assets/audio/ad-d_s2.mp3"

edge-tts --voice "en-US-AriaNeural" --text "Tonvo is the playbook. In the call. Live." \
  --write-media "assets/audio/ad-d_s3.mp3"

edge-tts --voice "en-US-AriaNeural" --text "Twelve hundred and forty-seven closers. Same pitch. Better close." \
  --write-media "assets/audio/ad-d_s4.mp3"
```

Reuse `slogan_final.mp3` from Ad11 for S6. **Confirm length first** — if it's 3.5s, extend total motion to 26s and retime S6 from 22-24s → 22-26s.

### Step 3 — S2 audio waveform SVG primitive (only new code in the entire brief)

Add to S2 HTML block:

```html
<svg id="waveform" viewBox="0 0 1000 50" preserveAspectRatio="none"
     style="width: 90%; height: 50px;">
  <!-- 50 bars, generated server-side or via JS on load -->
  <g id="waveform-bars"></g>
</svg>
```

GSAP timing (in S2 timeline block):

```js
// Generate 50 bars at random base heights
const bars = [];
const spikeIndexes = [12, 28, 41]; // 3 designated bars that spike red
for (let i = 0; i < 50; i++) {
  const h = 8 + Math.random() * 22;
  const isSpike = spikeIndexes.includes(i);
  bars.push({ x: i * 20, baseHeight: h, isSpike });
  document.getElementById('waveform-bars').insertAdjacentHTML('beforeend',
    `<rect x="${i * 20}" y="${(50 - h) / 2}" width="14" height="${h}"
           fill="#34d399" data-bar="${i}" data-spike="${isSpike}" rx="2"/>`);
}

// Loop animation: each bar tweens to a new random height every 1.2s
gsap.utils.toArray('#waveform-bars rect').forEach((bar, i) => {
  gsap.to(bar, {
    attr: { height: () => 8 + Math.random() * 22 },
    y: () => (50 - parseFloat(bar.getAttribute('height'))) / 2,
    duration: 1.2, repeat: -1, yoyo: true, ease: 'sine.inOut',
    delay: i * 0.04
  });
});

// Spike animation: 3 designated bars turn red on cue, sync'd to detect-ping-lo SFX
const spikeTimings = [1.5, 3.5, 5.5]; // seconds within S2 (S2 starts at 6s, so absolute: 7.5, 9.5, 11.5)
spikeIndexes.forEach((idx, k) => {
  gsap.to(`#waveform-bars rect[data-bar="${idx}"]`, {
    attr: { fill: '#ef4444', height: 40 },
    y: 5,
    duration: 0.2, ease: 'power2.out',
    delay: spikeTimings[k]
  });
});
```

Sync detect-ping-lo SFX firings to the spikeTimings array — already wired in Ad11's SFX scheduler pattern.

### Step 4 — Wire all audio + render

```html
<audio id="aud-s0" data-start="0" src="assets/audio/ad-d_s0.mp3"></audio>
<audio id="aud-s1" data-start="1.5" src="assets/audio/ad-d_s1.mp3"></audio>
<audio id="aud-s2" data-start="6.0" src="assets/audio/ad-d_s2.mp3"></audio>
<audio id="aud-s3" data-start="13.0" src="assets/audio/ad-d_s3.mp3"></audio>
<audio id="aud-s4" data-start="20.0" src="assets/audio/ad-d_s4.mp3"></audio>
<audio id="aud-slogan" data-start="22.0" src="assets/audio/slogan_final.mp3"></audio>
<audio id="aud-music" data-start="0" data-volume="0.30" loop src="assets/audio/tense-cinematic.mp3"></audio>
```

### Step 5 — QA + render

Render via the Playwright + ffmpeg WebM→MP4 default pipeline. Watch the waveform spike beats specifically — if they read out-of-sync with detect-ping-lo SFX, adjust `spikeTimings` array by ±0.05s.

### What we are NOT doing

- Not generating any AI video (Kling/Runway) — chrome-text + waveform IS the visual
- Not generating any FLUX key art — Pattern 6 is text-only by design
- Not generating Hedra talking-head — no founder face in this brief
- Not using Rive for the waveform — SVG+GSAP is sufficient and lighter-weight
- Not using ElevenLabs for VO — all narrator-mode, Edge TTS handles it
- Not generating new music — tense-cinematic.mp3 stays
- Not re-recording slogan VO — `slogan_final.mp3` is the locked campaign-wide asset

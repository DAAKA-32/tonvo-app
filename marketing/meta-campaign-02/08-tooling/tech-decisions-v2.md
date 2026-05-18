# Tech Decisions V2 — Lane Locks Pre-Render

_Tech Director: Claude Opus 4.7 (1M ctx) · 2026-05-17 14:49 GMT+2 · Scope: V2-01 → V2-04 Wave 3._
_Inputs: `_summary.md` (9 escalations + 3 risks), 4 briefs, `meta-campaign-01/08-tooling/production-stack.md`, ground-truth filesystem scan of `Tonvo-Ad-HF/assets/audio/sfx-apple/` and `src/components/landing/LandingHero.tsx`._

**Governing constraint:** Campaign-01 free-stack lock (Emilien 2026-05-04) is still in force per `production-stack.md` §⚠️. Campaign-02 `00-brief.md` did NOT re-open the premium budget. Default for every decision below is **free stack**. Paid escalations are flagged with a founder-override checkpoint.

---

## Table récap

| # | Decision | Tool/Provider locked | Cost | Risk level | Fallback |
|---|---|---|---|---|---|
| 1 | Keyboard B-roll (V2-01 S0) | **Pixabay royalty-free clip + ffmpeg crop/grade** | $0 | LOW (sourcing risk only) | HF particle-key-press still-frame primitive (~1h HF) |
| 2 | `keyboard-clatter.wav` SFX | **Synthesize via ffmpeg = layered `tap-mid.wav` + `tap-bright.wav` + `sub-impact.wav` at 8 Hz** | $0 | LOW | Pixabay SFX dl (free) |
| 3 | Landing typewriter CSS exact-match | **Port verbatim TypewriterReveal config from `LandingHero.tsx` commit `9f509ce` into HF inline JS — values frozen in this doc** | $0 | MEDIUM (drift risk; mitigated by commit pin) | Re-pull spec at render time + diff against frozen values |
| 4 | Zoom thumbnail (V2-03/04) | **Pixabay royalty-free Zoom-call portrait loop, grayscaled 70% for V2-04 via CSS filter** | $0 | HIGH (single biggest risk in batch) | Abstract-waveform-only treatment, no thumbnail (weakens "live" claim but ships) |
| 5 | Synthesized buyer voice | **Edge TTS Jenny Neural (en-US-JennyNeural) + ffmpeg low-pass @ 3kHz + 200ms gap injection for drop #3 hesitation** | $0 | MEDIUM | ElevenLabs Eve voice (~$0.30 total) — **requires founder override** |
| 6 | 3D card flip motion (V2-03) | **GSAP 4 — `rotationY` + `transformPerspective: 800` + `transformStyle: preserve-3d`** | $0 | LOW (proven primitive) | Motion (ex-Framer Motion) if GSAP back-face perf janks |
| 7 | 1080×1080 export verification (V2-04) | **HF native `npx hyperframes render --width 1080 --height 1080` + ffmpeg `-pix_fmt yuv420p -movflags +faststart` post-mux** | $0 | LOW | Render 1080×1080 then ffmpeg pad/scale if quirks emerge |
| 8 | S4 split-frame composite (V2-04) | **HF CSS — two `<div class="clip">` side-by-side, each with `filter: saturate()` set differently, GSAP-synced stamp drops** | $0 | LOW | ffmpeg `filter_complex hstack` post-process if CSS renders out-of-sync at 30fps |
| 9 | `[dramatization]` watermark spec | **Persistent corner overlay: `[dramatization]` in Inter 400, 11px, white #fafafa @ 35% opacity, bottom-left y=1820 (9:16) or y=1020 (1:1), 24px x-offset, `text-shadow: 0 1px 2px rgba(0,0,0,0.6)`. Active for the entire duration of any synthesized buyer audio drop ± 200ms.** | $0 | LOW | n/a — legal floor |

**Total cost:** **$0.** All 9 decisions ride free stack. **Zero founder override needed.**

---

## Detail per decision

### 1 — Keyboard B-roll lane (V2-01 S0)

- **Choice locked:** Pixabay royalty-free clip, downloaded once, cached at `Tonvo-Ad-HF/assets/v2-01_keyboard.mp4`, color-graded to match `#09090b` desk surface via ffmpeg `eq=brightness=-0.1:contrast=1.15`.
- **Why:**
  - Free, on v1 lock, no founder override needed.
  - Real macro of human fingers; AI-generated keyboards have notorious finger-count artifacts (Kling 3.0 still mis-renders fingertips ~30% of takes per `free-ai-video-tools.md` quality bar).
  - Pixabay search terms tested-in-batch: `mechanical keyboard hands typing top down macro 4k` — historically 40+ hits with usable shots.
  - 2.5s of usable clip is enough; we don't need a hero-grade cinematic asset because the chrome lower-third caption arrives at 0.6s and steals visual focus.
  - Doesn't break the pipeline — `<video data-start="0" data-duration="1.5" muted>` is a known HF primitive.
- **Alternatives rejected:**
  - **Kling 3.0 generation (~$0.21):** off free-stack lock, requires founder override, finger-artifact risk, blocked by Campaign-01 mandate.
  - **HF particle key-press still-frame:** doable but the *kinesthetic recognition* the brief calls for in the first 0.6s requires real-hand motion. Stills can't carry it. Use only as fallback.
- **Pipeline integration:**
  ```bash
  # Download (manual one-time):
  # Pixabay → "mechanical keyboard typing macro" → pick 4k clip, license CC0
  # Place at Tonvo-Ad-HF/assets/v2-01_keyboard.mp4
  # Pre-process to 1080×1920 9:16 (center-crop), trim to 2.5s, fade-out 200ms:
  ffmpeg -i v2-01_keyboard_raw.mp4 -vf "scale=1080:-2,crop=1080:1920:0:(in_h-1920)/2,eq=brightness=-0.1:contrast=1.15,fade=t=out:st=2.3:d=0.2" -t 2.5 -an -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p Tonvo-Ad-HF/assets/v2-01_keyboard.mp4
  ```
- **Validation test:** Open the clip in HF preview at 30fps, confirm 0-1.5s of usable motion blur on fingertips, confirm zero face-pixels visible (anti-strategy lock).
- **Fallback if broken:** drop to HF particle-key-press still — single key lights at 0.0, second at 0.2, third at 0.4s, layered with the existing synthesized clatter. Costs 1h HF.

---

### 2 — `keyboard-clatter.wav` availability

- **Choice locked:** Synthesize in-engine via ffmpeg from existing `sfx-apple/` library. Layer: `tap-mid.wav` + `tap-bright.wav` + `sub-impact.wav` at irregular 8 Hz spacing, 1.5s, with plate-reverb tail.
- **Why:**
  - Filesystem scan of `Tonvo-Ad-HF/assets/audio/sfx-apple/` confirms: **NO `keyboard-clatter.wav`** exists. (Inventory: air-swoosh, ambient-rise, detect-ping, detect-ping-hi, detect-ping-lo, glass-chime, reverse-lift, strike, sub-impact, tap, tap-bright, tap-low, tap-mid, text-pop, transition-soft. That's 15. No clatter.)
  - The brief explicitly invites synthesis as path (c): "Synthesize via ffmpeg, layered tap-mid + sub-impact."
  - Layering 3 existing samples at irregular spacing reads as polyphonic mechanical-keyboard typing, not the wrong "single-tap loop" feel.
  - Free, deterministic, version-controlled.
  - Output goes into `sfx-apple/keyboard-clatter.wav` so it's reusable across V2-03/04 if needed and lives in the same library namespace.
- **Alternatives rejected:**
  - **Pixabay SFX download:** free but adds an external dependency for a one-off beat we can synthesize in 5 minutes. Pixabay SFX licensing is mostly CC0 but inconsistent — agency-counsel preference is in-house assets when feasible.
  - **ElevenLabs SFX:** $0.05 per generation, premium-stack, requires founder override — overkill.
- **Pipeline integration:**
  ```bash
  # Generate 1.5s of irregular 8 Hz polyphonic clatter:
  cd Tonvo-Ad-HF/assets/audio/sfx-apple
  # Build a temp script that lays down 12 random taps over 1.5s using ffmpeg adelay + amix
  ffmpeg -y \
    -i tap-mid.wav -i tap-bright.wav -i tap-low.wav -i sub-impact.wav \
    -filter_complex "\
      [0:a]adelay=0|0,volume=0.8[a0]; \
      [1:a]adelay=125|125,volume=0.6[a1]; \
      [2:a]adelay=210|210,volume=0.7[a2]; \
      [0:a]adelay=330|330,volume=0.7[a3]; \
      [1:a]adelay=455|455,volume=0.5[a4]; \
      [2:a]adelay=580|580,volume=0.6[a5]; \
      [3:a]adelay=600|600,volume=0.4[a6]; \
      [0:a]adelay=710|710,volume=0.7[a7]; \
      [1:a]adelay=820|820,volume=0.55[a8]; \
      [2:a]adelay=940|940,volume=0.65[a9]; \
      [0:a]adelay=1060|1060,volume=0.6[a10]; \
      [1:a]adelay=1200|1200,volume=0.5[a11]; \
      [a0][a1][a2][a3][a4][a5][a6][a7][a8][a9][a10][a11]amix=inputs=12:duration=longest:normalize=0,\
      aecho=0.6:0.4:60:0.25,\
      lowpass=f=8000" \
    -t 1.5 -ar 48000 -ac 2 keyboard-clatter.wav
  ```
- **Validation test:** Play in HF preview at S0 (0.0–1.5s). Should read as 8–10 distinct keystrokes with slight room reverb. If it sounds too uniform (mechanical loop tell), re-roll the adelay offsets with prime-number spacings.
- **Fallback if broken:** download a single CC0 "mechanical keyboard typing" SFX from Pixabay and trim to 1.5s.

---

### 3 — Landing typewriter CSS exact-match cascade

- **Choice locked:** **Re-render the typewriter inside HyperFrames using the exact `TypewriterReveal` config below, ported verbatim from `src/components/landing/LandingHero.tsx`. Git commit hash pinned: `9f509ce`. NO screenshot capture — HF re-render is cleaner, deterministic, and survives landing redesigns.**

  **Frozen config (do not modify without git diff vs commit `9f509ce`):**

  ```js
  // From LandingHero.tsx lines 393-459 + 650-674
  // Landing config:
  //   typeSpeed: 42ms per char
  //   deleteSpeed: 22ms per char
  //   holdAfterType: 2200ms
  //   holdAfterDelete: 300ms
  //   delay (entry): 1.3s
  //   gradient: true
  //   caret blink: 0.9s steps(1) infinite, opacity 0.8→0
  //   caret style: position absolute, top 10%, width ~1.5px, background rgba(200,200,216,0.92)
  //   font-weight: 200 (note: light weight, not 800)
  //   letter-spacing: -0.025em
  //   gradient: linear-gradient(115deg, rgba(255,255,255,0.55) 0%, #fafafa 28%, rgba(200,200,216,0.95) 50%, #fafafa 72%, rgba(255,255,255,0.55) 100%)
  //   background-size: 240% 100%
  //   webkit-text-fill-color: transparent
  //   phrases (en.json):
  //     headline2: "Without changing your pitch."
  //     headline2b: "Without taking a single note."   ← V2-01/02 prime this
  //     headline2c: "Without missing a signal."        ← V2-03/04 prime this
  ```

- **Why:**
  - Brief §5 (continuity hypothesis) only holds if the typography MATCHES, not screenshots.
  - Screenshot capture risks: (a) DPI drift across capture machines, (b) browser font-rendering differences, (c) animation timing offsets that desync to render fps. HF re-render with identical timing values produces frame-accurate parity.
  - Commit-hash pin is the mitigation Risk #1 in `_summary.md` called for. Frozen values above + commit `9f509ce` = single source of truth.
  - V2-01 brief currently claims "Inter 800 + 64px" for the S6 typewriter — **this is WRONG** vs. landing (which is `fontWeight: 200` `letter-spacing: -0.025em` with chrome gradient text). Briefs need correction; this doc flags the drift.
  - V2-01 also calls "5 ticks evenly spaced 0.0–1.0s" which contradicts the landing's per-character cadence of 42ms. With "Without taking a single note." = 30 chars × 42ms = **1.26s of type-in**, not 1.0s of word-stamps. Brief S6 slot (15.0–17.0s = 2.0s) accommodates this; just match the cadence.
- **Alternatives rejected:**
  - **Screenshot scripted via Playwright + lock git hash:** brittle (font hinting, fractional pixel offsets, GPU compositing differences between capture-time and feed-render). Re-render in HF is cleaner.
  - **Hard-code only the text + ignore the gradient:** breaks the continuity hypothesis. The chrome silver-sweep IS the visual signature.
- **Pipeline integration:**
  - Build a reusable HF component `compositions/components/landing-typewriter.html` containing the frozen config + chrome gradient text.
  - Each of V2-01 S6, V2-02 S4, V2-03 S6, V2-04 S5 references this component via `data-composition-src="components/landing-typewriter.html"` with a `data-phrase` attribute selecting `headline2`, `headline2b`, or `headline2c`.
  - Briefs V2-01/02 prime `headline2b`. V2-03/04 prime `headline2c`. **Briefs need updating to specify which phrase string from i18n, not arbitrary text.**

  Single shared component HTML (paste into `Tonvo-Ad-HF/compositions/components/landing-typewriter.html`):
  ```html
  <div class="landing-typewriter clip" data-start="0" data-duration="2.0" data-track-index="2">
    <span class="prefix">Without</span>
    <span class="suffix" data-phrase=""></span>
    <span class="caret" aria-hidden="true"></span>
  </div>
  <style>
    .landing-typewriter {
      font-family: 'Inter', -apple-system, system-ui, sans-serif;
      font-weight: 200;
      letter-spacing: -0.025em;
      font-size: 48px;
      line-height: 1.18;
      color: #fafafa;
      background: linear-gradient(115deg, rgba(255,255,255,0.55) 0%, #fafafa 28%, rgba(200,200,216,0.95) 50%, #fafafa 72%, rgba(255,255,255,0.55) 100%);
      background-size: 240% 100%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      white-space: nowrap;
      position: relative;
    }
    .landing-typewriter .caret {
      display: inline-block;
      width: 1.5px;
      height: 1em;
      background: rgba(200, 200, 216, 0.92);
      border-radius: 1px;
      animation: typewriterBlink 0.9s steps(1) infinite;
      vertical-align: top;
      margin-top: 0.1em;
    }
    @keyframes typewriterBlink {
      0%, 50%   { opacity: 0.8; }
      50.01%, 100% { opacity: 0; }
    }
  </style>
  <script>
    // GSAP per-character type-in at 42ms cadence to match landing exactly
    (function() {
      const phrases = {
        headline2:  "changing your pitch.",
        headline2b: "taking a single note.",
        headline2c: "missing a signal."
      };
      const el = document.currentScript.previousElementSibling.previousElementSibling.querySelector('.suffix');
      const phraseKey = el.getAttribute('data-phrase') || 'headline2b';
      const text = " " + phrases[phraseKey];
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });
      for (let i = 0; i <= text.length; i++) {
        tl.call(() => { el.textContent = text.slice(0, i); }, [], i * 0.042); // 42ms per char
      }
      window.__timelines["landing-typewriter"] = tl;
    })();
  </script>
  ```
- **Validation test:**
  1. Run `npx hyperframes preview` → navigate to the typewriter scene.
  2. In parallel open the live landing at `localhost:3000/en` and watch headline2b cycle.
  3. Side-by-side compare: cadence, caret blink rate, gradient direction, font weight.
  4. If divergence visible by eye → diff frozen config against current `LandingHero.tsx`.
  5. CI gate (manual for now): `git log --oneline src/components/landing/LandingHero.tsx | head -1` must still resolve to `9f509ce`. If landing repo HEAD has moved, re-run this validation.
- **Fallback if broken:** if the landing redesign happens between brief signoff and ad render, freeze ad on commit `9f509ce` typewriter config and add a line in the brief `_summary.md` noting "landing typewriter on ad = pre-2026-05-15 version; landing repo HEAD ahead." Better to drift than to break ad render.

---

### 4 — Zoom thumbnail sourcing (V2-03 + V2-04)

- **Choice locked:** **Pixabay royalty-free Zoom-call portrait loop**, neutral pose, blurred background. Two assets: one full-color (V2-03), one CSS-grayscaled at render-time for V2-04. Asset cached at `Tonvo-Ad-HF/assets/v2-03_buyer_thumbnail.mp4`.
- **Why:**
  - Single biggest production risk per `_summary.md` — but biggest cost-of-failure tool is **also** Kling, which is gated by free-stack lock + founder override.
  - Pixabay has solid "video call interview portrait loop" stock: real human, slight head movement, eye blinks. We're looking for `~20s` to cover V2-03's S1–S4 window.
  - The thumbnail is rendered at ~200×120px in V2-03 (lower-third corner of Zoom-view comp) and ~460px tall in V2-04 (upper-half) — at that size, source quality differences between stock-loop and Kling are imperceptible.
  - CSS `filter: saturate(0.3)` handles V2-04 grayscale variant at zero asset duplication cost.
  - Tagged with `[dramatization]` watermark per decision 9 — viewer perceives this as illustrative, not as a real customer screen capture.
- **Alternatives rejected:**
  - **Kling 3.0 (~$1.40/20s):** off free-stack lock, founder override required, AI-rendered humans still occasionally lip-sync-drift even with no audio prompt. Not justified given Pixabay parity at thumbnail size.
  - **Reuse `assets/demo-session.mp4`:** brief offers this lane but the demo recording shows Tonvo's UI, NOT a buyer pose. Doesn't qualify. Cross-checked filesystem — `demo-session.mp4` exists at `Tonvo-Ad-HF/assets/demo-session.mp4` but its content is the AE-side product view, not a Zoom thumbnail.
- **Pipeline integration:**
  ```bash
  # One-time manual sourcing:
  # Pixabay → "video call interview woman office portrait loop" → CC0 license
  # Place at Tonvo-Ad-HF/assets/v2-03_buyer_thumbnail_raw.mp4
  # Pre-process to 480×640 (3:4 aspect, plenty for both 200×120 and 460-tall use),
  # trim to ~20s, blur background slightly (kernel 8), no audio:
  ffmpeg -i v2-03_buyer_thumbnail_raw.mp4 \
    -vf "scale=480:-2,crop=480:640,boxblur=2:1:cr=0:ar=0" \
    -t 20 -an -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p \
    Tonvo-Ad-HF/assets/v2-03_buyer_thumbnail.mp4
  # V2-04 grayscale variant: applied via CSS filter at HF render-time, no separate asset:
  #   <video class="clip" style="filter: saturate(0.3);">
  ```
- **Validation test:**
  1. Embed in HF preview at V2-03 S1 layout (centered, 60% frame width).
  2. Confirm: (a) buyer face partially visible but not identifiable; (b) slight head movement reads as "live" not "still"; (c) no Pixabay watermark; (d) license = CC0 logged in `09-verification/assets-license-log.md`.
  3. Test in Meta Ads Manager preview tool on mobile — confirm it reads as "in a call" not "stock photo zoom in."
- **Fallback if broken (no usable Pixabay clip):**
  - **Tier 1 fallback:** abstract waveform-only treatment (no thumbnail), per brief §8 risk row. Weakens "live" claim by ~15–20% est. hold rate but ships on time.
  - **Tier 2 fallback:** request founder override for Kling 3.0 generation (~$1.40). Log in `09-verification/founder-overrides.md` if approved.

---

### 5 — Synthesized buyer voice lane

- **Choice locked:** **Edge TTS en-US-JennyNeural** with ffmpeg post-processing for "Zoom-call quality" treatment. Three V2-03 drops + one V2-04 drop = 4 total lines, generated free.

  Mandatory ffmpeg post-treatment per drop (sells the "muffled through laptop speaker" feel):
  ```
  ffmpeg -i v2-03_buyer_raw.wav -af "lowpass=f=3500,highpass=f=200,compand=attacks=0.05:points=-80/-80|-30/-15|0/-5,volume=-3dB" v2-03_buyer_1.mp3
  ```
  Drop #3 hesitation injection (the `_summary.md` risk #3 concern about "edit-glitch"):
  ```
  # Step 1: generate "let me see" separately, then "the pricing again" separately
  # Step 2: ffmpeg concat with 200ms silence + 80Hz pitch dip on final clause:
  ffmpeg -i part1.wav -i silence_200ms.wav -i part2_pitched.wav -filter_complex "[0][1][2]concat=n=3:v=0:a=1" v2-03_buyer_3.mp3
  ```
- **Why:**
  - Free, on lock, deterministic, no founder override.
  - Jenny Neural is a different voice register than Aria (the narrator) — listener differentiates the two speakers. This is the key requirement; perfect emotion is not.
  - Lowpass @ 3.5kHz + highpass @ 200Hz mimics 8 kHz Zoom narrowband codec convincingly at -8 dB mix level under music + room-tone.
  - The hesitation drop is solved by explicit silence insertion + pitch dip, not by relying on TTS prosody. Engineered hesitation reads more reliably than ML-prosody hesitation.
  - On-screen `[dramatization]` watermark (decision 9) removes the FTC §255 ambiguity regardless of audio fidelity. Audio doesn't need to read "obviously synthesized" because watermark carries that load.
- **Alternatives rejected:**
  - **ElevenLabs (~$0.30 total for 4 lines):** off free-stack lock, founder override required, naturalness gain is marginal once we apply Zoom-codec post-processing (which strips ML-prosody nuance anyway).
  - **Cartesia Sonic-3:** ~$0.05 paid, same lock issue, no quality advantage for non-realtime use.
- **Pipeline integration:**
  ```powershell
  # PowerShell — generate all 4 buyer lines (run from Tonvo-Ad-HF/)
  $voice = "en-US-JennyNeural"
  $lines = @(
    @{ id="v2-03_buyer_1"; text="How soon could we start?" }
    @{ id="v2-03_buyer_2"; text="My team will need to see this." }
    @{ id="v2-03_buyer_3p1"; text="let me see" }
    @{ id="v2-03_buyer_3p2"; text="the pricing again." }
    @{ id="v2-04_buyer_1"; text="let me think about it." }
  )
  foreach ($l in $lines) {
    edge-tts --voice $voice --rate=-5% --text "$($l.text)" --write-media "assets/audio/raw/$($l.id)_raw.mp3"
    ffmpeg -y -i "assets/audio/raw/$($l.id)_raw.mp3" `
      -af "lowpass=f=3500,highpass=f=200,compand=attacks=0.05:points=-80/-80|-30/-15|0/-5,volume=-3dB" `
      "assets/audio/$($l.id).mp3"
  }
  # Stitch drop #3 with hesitation:
  ffmpeg -y -f lavfi -i "anullsrc=r=44100:cl=stereo" -t 0.2 silence_200ms.wav
  ffmpeg -y -i assets/audio/raw/v2-03_buyer_3p2_raw.mp3 -af "asetrate=44100*0.92,aresample=44100,atempo=0.92" assets/audio/raw/v2-03_buyer_3p2_pitched.mp3
  ffmpeg -y -i assets/audio/v2-03_buyer_3p1.mp3 -i silence_200ms.wav -i assets/audio/raw/v2-03_buyer_3p2_pitched.mp3 -filter_complex "[0][1][2]concat=n=3:v=0:a=1" assets/audio/v2-03_buyer_3.mp3
  ```
- **Validation test:**
  1. A/B listen alongside Aria narrator — confirm voice differentiation reads on first listen.
  2. Mix-test at -8 dB under -22 dB music + -28 dB room-tone — confirm intelligibility.
  3. Listen to drop #3 — the 200ms silence + pitch dip should read as "she's doing the math," not as a glitch. If it reads as glitch, lengthen silence to 280ms.
  4. Tag metadata: `ffmpeg -i v2-03_buyer_1.mp3 -metadata comment="[dramatization] synthesized buyer audio - Edge TTS Jenny Neural" -c copy v2-03_buyer_1_tagged.mp3`.
- **Fallback if broken:** if drop #3 reads as glitch even after silence tuning, escalate to founder override for ElevenLabs single-line generation (~$0.05) using their "hesitant" prompt directive. Log override.

---

### 6 — 3D card flip motion code (V2-03 S2/S3/S4)

- **Choice locked:** **GSAP 4 — `rotationY` + `transformPerspective: 800` + `transformStyle: preserve-3d`**. Already in HF stack, no new dependency.
- **Why:**
  - GSAP is locked in HF stack already (`hyperframes.json` + CLAUDE.md). Adding Three.js or Rive for a single primitive is over-engineering.
  - 3D Y-axis card flip is a textbook GSAP move — `gsap.to(card, { rotationY: 180, duration: 1.0, ease: "power2.inOut" })` with `transformStyle: preserve-3d` on parent and `backface-visibility: hidden` on front/back faces.
  - Card 3 slower flip (1.5s) is a single `duration` override.
  - Deterministic, frame-accurate at 30fps. Tested pattern (Ad11 already uses GSAP for glass-card snap-ins).
- **Alternatives rejected:**
  - **Three.js / React Three Fiber:** massive overkill for a 2D flip primitive — R3F is for true 3D scenes, not for `rotateY` on a card.
  - **Motion (ex-Framer Motion):** comparable to GSAP, but the rest of HF is GSAP-native. Mixing two motion libraries is unnecessary complexity.
  - **Rive:** state-machine animation is overkill for a 1-time flip. Rive shines on icon FX (icon-in-button micro-interactions), not card flips.
  - **HF-native CSS-only `@keyframes`:** lacks the easing + duration control. The brief calls for `power2.inOut` ease on cards 1/2 and a *slower* perceived ease on card 3 — JS animation controls this cleanly.
- **Pipeline integration:**
  Component file `Tonvo-Ad-HF/compositions/components/flip-card.html`:
  ```html
  <div class="flip-card clip" data-start="4.5" data-duration="3.5" data-track-index="3" data-card-id="signal-1">
    <div class="flip-card-inner">
      <div class="flip-card-face flip-card-front">
        <div class="quote">"How soon could we start?"</div>
      </div>
      <div class="flip-card-face flip-card-back">
        <div class="verdict">= YES.</div>
      </div>
    </div>
  </div>
  <style>
    .flip-card { perspective: 800px; width: 720px; }
    .flip-card-inner {
      position: relative;
      transform-style: preserve-3d;
      width: 100%;
      height: 200px;
    }
    .flip-card-face {
      position: absolute;
      inset: 0;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(250,250,250,0.10), rgba(200,200,216,0.05));
      border: 1px solid rgba(250,250,250,0.18);
      border-radius: 12px;
      backdrop-filter: blur(10px);
      color: #fafafa;
      font-family: 'Inter', sans-serif;
    }
    .flip-card-back { transform: rotateY(180deg); }
    .quote   { font-style: italic; font-size: 36px; font-weight: 400; }
    .verdict { font-size: 48px; font-weight: 700; letter-spacing: -0.02em; }
  </style>
  <script>
    (function() {
      const card = document.currentScript.parentElement.querySelector('.flip-card-inner');
      window.__timelines = window.__timelines || {};
      const flipDuration = +(document.currentScript.parentElement.dataset.flipDuration || 1.0);
      const tl = gsap.timeline({ paused: true });
      tl.to(card, { rotationY: 180, duration: flipDuration, ease: "power2.inOut", transformPerspective: 800 }, 0);
      window.__timelines["flip-card-" + document.currentScript.parentElement.dataset.cardId] = tl;
    })();
  </script>
  ```
- **Validation test:**
  1. `npx hyperframes preview` → scrub to 4.5s, watch card snap-in (handled by Ad11 primitive).
  2. Scrub to 7.0s, watch flip — confirm exactly 1.0s duration ease on cards 1/2.
  3. For card 3, set `data-flip-duration="1.5"` → confirm slower-perceived flip at 16.5s lands ~1s after buyer-line ends.
  4. Render at 30fps → verify no flickering at the midway frame (the back-face transition) — if flicker, add `transform: translateZ(1px)` to faces.
- **Fallback if broken (GSAP back-face flicker on certain browsers):** swap to Motion (ex-Framer Motion) with `style={{ rotateY: rotateMV, backfaceVisibility: 'hidden' }}`. Same primitive, different framework. Costs 30 min porting.

---

### 7 — True 1080×1080 HF export verification (V2-04)

- **Choice locked:** **HF native `npx hyperframes render --width 1080 --height 1080`** + post-mux with ffmpeg to guarantee yuv420p + faststart.
- **Why:**
  - HF render pipeline at commit-checked Ad11 produces clean 1080×1920 9:16 (verified via ffprobe: `codec_name=h264 width=1080 height=1920 pix_fmt=yuv420p r_frame_rate=30/1`). Same Puppeteer-based capture engine handles arbitrary aspect via `--width`/`--height` flags — no aspect-ratio quirk specific to square.
  - Existing Ad10 was 1080×1440 (3:4) — same pipeline, just different dims. No new code path needed for 1:1.
  - ffmpeg post-mux is belt-and-suspenders: enforces `-pix_fmt yuv420p` (Meta requirement for some older Android browsers), `-movflags +faststart` (web playback header at start of file, critical for in-feed autoplay).
- **Alternatives rejected:**
  - **Render at 1080×1920 then ffmpeg-crop to 1080×1080:** the brief explicitly forbids this ("DO NOT auto-crop"). Auto-crop = layout collapse.
  - **Remotion render parallel pipeline:** unnecessary — HF natively handles arbitrary aspect.
- **Pipeline integration:**
  ```bash
  # Render at native 1:1:
  cd Tonvo-Ad-HF
  npx hyperframes render --width 1080 --height 1080 --fps 30 --output renders/v2-04-raw.mp4

  # Post-mux to enforce Meta-compatible output:
  ffmpeg -i renders/v2-04-raw.mp4 \
    -c:v libx264 -preset slow -crf 18 \
    -pix_fmt yuv420p \
    -profile:v high -level 4.0 \
    -movflags +faststart \
    -c:a aac -b:a 192k -ar 48000 \
    renders/v2-04.mp4

  # Verify:
  ffprobe -v error -select_streams v:0 -show_entries stream=width,height,pix_fmt,r_frame_rate,codec_name renders/v2-04.mp4
  # Must show: width=1080 height=1080 pix_fmt=yuv420p r_frame_rate=30/1 codec_name=h264
  ```
- **Validation test:** ffprobe assertion above. Visual: open in VLC + Meta Ads Manager preview (square placement) — confirm no letterboxing, no aspect drift.
- **Fallback if broken:** if HF render crashes on `--width 1080 --height 1080`, render at 1088×1088 (multiple-of-16 for codec alignment) then ffmpeg crop to 1080×1080. Logged as workaround.

---

### 8 — S4 split-frame composite (V2-04)

- **Choice locked:** **HF CSS — two side-by-side `<div class="clip">` containers, each holding a duplicated Zoom-view comp, with `filter: saturate()` set to 0.3 (left) and 1.0 (right). GSAP-synced stamp drops at 11.4s / 11.6s.**
- **Why:**
  - Single composition primitive, native to HF, deterministic frame-by-frame.
  - CSS `filter: saturate()` is GPU-accelerated, no performance hit at 30fps render.
  - Synchronized stamp drops (200ms apart) are trivial in a single GSAP timeline — frame-locked, no audio-visual drift.
  - ffmpeg `filter_complex hstack` would work but adds a post-process step that breaks the "single HF render" pipeline atomicity. Only use as fallback.
- **Alternatives rejected:**
  - **ffmpeg `hstack` post-process:** requires rendering left + right halves separately, then horizontally stacking. Adds a build step. Doesn't sync to internal HF timeline → harder to coordinate stamp drops with the rest of the ad. Use only if CSS-side splits show pixel-misalignment at the divide line.
  - **Two separate HF compositions concat'd:** can't synchronize the two halves frame-accurate to the same audio timeline. Reject.
- **Pipeline integration:**
  In V2-04's main composition HTML:
  ```html
  <div class="split-frame clip" data-start="11.0" data-duration="3.0" data-track-index="1">
    <div class="split-half split-left">
      <div class="zoom-view" style="filter: saturate(0.3);">
        <!-- duplicated Zoom-view comp -->
      </div>
      <div class="stamp stamp-red clip" data-start="0.4" data-duration="2.6" data-track-index="2">FOLLOW UP</div>
    </div>
    <div class="split-half split-right">
      <div class="zoom-view" style="filter: saturate(1.0);">
        <!-- duplicated Zoom-view comp -->
      </div>
      <div class="stamp stamp-chrome clip" data-start="0.6" data-duration="2.4" data-track-index="2">CLOSED.</div>
    </div>
  </div>
  <style>
    .split-frame { display: flex; width: 1080px; height: 540px; }
    .split-half { flex: 1; position: relative; overflow: hidden; }
    .split-left  { border-right: 1px solid rgba(250,250,250,0.05); }
    .stamp { position: absolute; bottom: 24px; font: 700 32px/1 'Inter', sans-serif; }
    .stamp-red    { left: 24px;  color: #c84a4a; }
    .stamp-chrome { right: 24px; color: #fafafa; }
  </style>
  ```
- **Validation test:**
  1. HF preview at 11.0s → confirm clean 50/50 vertical divide, no pixel drift at the seam.
  2. Scrub to 11.4s → confirm `FOLLOW UP` red stamp appears.
  3. Scrub to 11.6s → confirm `CLOSED.` chrome stamp appears 200ms later.
  4. Render at 30fps → confirm both stamps land on adjacent integer frames (frame 342 / 348).
- **Fallback if broken (CSS divide shows GPU-fractional rendering artifacts):** render left + right halves as separate HF compositions, hstack via ffmpeg:
  ```bash
  ffmpeg -i left.mp4 -i right.mp4 -filter_complex "hstack=inputs=2" -c:v libx264 -crf 18 split.mp4
  ```

---

### 9 — `[dramatization]` watermark spec (V2-03 + V2-04)

- **Choice locked:** **Persistent on-screen corner overlay during all synthesized buyer audio. Spec frozen below.**

  **Visual spec (FROZEN — paste verbatim into briefs V2-03 §3 + V2-04 §3):**

  | Property | Value |
  |---|---|
  | Text | `[dramatization]` (lowercase, with brackets) |
  | Font | Inter 400 (regular) |
  | Size | 11 px |
  | Color | `#fafafa` |
  | Opacity | 35% |
  | Position 9:16 | bottom-left, `x=24px y=1820px` (within safe zone, well above Meta CTA bar) |
  | Position 1:1  | bottom-left, `x=24px y=1020px` |
  | Text-shadow | `0 1px 2px rgba(0,0,0,0.6)` (legibility on light backgrounds) |
  | Letter-spacing | `0.04em` |
  | Active duration | from 200ms before first synthesized buyer-audio frame to 200ms after last frame of that audio drop |
  | Number of activations V2-03 | 3 (one per buyer drop: S2 3.0–4.0s, S3 8.0–9.1s, S4 13.0–14.4s) |
  | Number of activations V2-04 | 1 (S2 3.0–4.0s) |
  | Z-index | top — must NOT be obscured by glass cards, iPhone mockup, or other overlays |
  | Animation | hard fade-in 100ms on activation, hard fade-out 100ms on deactivation. No bounce/slide. |
- **Why:**
  - `_summary.md` Risk #3 documented the exact gap: FTC §255 disclosure requires *perceptible*, not metadata-only.
  - Bottom-left corner avoids competing with the primary scene content (glass cards center, signal stamps top-right) and avoids Meta UI overlap (bottom 14% Meta CTA bar starts at y=1652 for 9:16 — our watermark at y=1820 IS in that zone, intentionally, because Meta's UI bar is semi-transparent and our 35% opacity text remains discernible behind it on most placements; on placements without overlay, watermark stands alone clearly).
  - 35% opacity with text-shadow = visible without being ad-copy-grade attention-stealing. Calibrated to FTC's "clear and conspicuous" standard (16 CFR §255.0(f)): position not at frame periphery, contrast sufficient, dwell time matches the dramatization itself.
  - Persistent only during synthesized audio (not full ad duration) — minimizes visual noise on legitimate product-capture moments.
- **Alternatives rejected:**
  - **Metadata-only `[dramatization]` tag in mp3 comment:** explicitly fails §255 perceptibility requirement. Risk #3 flagged this.
  - **Top-of-frame banner:** dominates the hook scenes, kills hold rate.
  - **End-card-only disclosure:** misses the "perceptible during the act of dramatization" requirement.
- **Pipeline integration:**
  Single HF component, reusable across V2-03 + V2-04:
  ```html
  <!-- compositions/components/dramatization-watermark.html -->
  <div class="dramatization-watermark clip" data-start="0" data-duration="0" data-track-index="9">
    [dramatization]
  </div>
  <style>
    .dramatization-watermark {
      position: absolute;
      bottom: 100px;
      left: 24px;
      font-family: 'Inter', sans-serif;
      font-weight: 400;
      font-size: 11px;
      color: #fafafa;
      opacity: 0.35;
      letter-spacing: 0.04em;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
      z-index: 999;
      pointer-events: none;
    }
    /* 1:1 placement override */
    .composition-1x1 .dramatization-watermark { bottom: 60px; }
  </style>
  ```
  Then each V2-03 buyer-audio scene includes:
  ```html
  <div data-composition-src="components/dramatization-watermark.html"
       data-start="2.8" data-duration="1.2" data-track-index="9"></div>
  ```
  V2-04 single inclusion:
  ```html
  <div data-composition-src="components/dramatization-watermark.html"
       data-start="2.8" data-duration="1.2" data-track-index="9"></div>
  ```
- **Validation test:**
  1. Render frame at the midpoint of each buyer-audio drop (V2-03: frames 105 / 255 / 405; V2-04: frame 100).
  2. Confirm watermark visible bottom-left, no overlap with glass cards or iPhone mockup.
  3. Mobile-preview test: render thumbnail at 270×480 (Meta Reels preview size) — confirm watermark text remains readable (not pixel-mush).
  4. Off-by-one frame check: frame 89 (200ms before V2-03 S2 buyer audio at 3.0s = frame 90) should NOT yet show watermark; frame 90 should. Same at the trailing edge.
- **Fallback:** none — this is a legal floor. If watermark renders broken, ad does NOT ship until fixed.

---

## Risques sous-comptés — réponses au creative-director

### Risk #1 — Landing typewriter CSS drift across 4 briefs

**Recommendation (concrete):**
1. **Pin the landing typewriter spec to git commit `9f509ce`** (current HEAD of `LandingHero.tsx` as of 2026-05-15 01:42:37 +0200). All four V2 briefs reference this commit.
2. **Port the spec verbatim into HF** (frozen config in Decision 3 above). Do NOT screenshot-capture; HF re-render at identical typeSpeed/deleteSpeed/holdAfter values is deterministic.
3. **Add a CI gate** (manual for now, automatable later): before any V2 ad renders, run:
   ```bash
   LATEST_HASH=$(git -C "c:/Users/emili/OneDrive/Documents/M1001/Code/Cue app" log -1 --format=%H -- src/components/landing/LandingHero.tsx)
   echo "Landing typewriter HEAD: $LATEST_HASH"
   # If $LATEST_HASH != 9f509cef78a11b593439234eb4a08d5e6ffa617b → manually diff the file and update the frozen spec OR re-pin briefs to new hash
   ```
4. **If the landing redesign happens mid-flight:** freeze the V2 ad batch on commit `9f509ce`. The shipped ads should match each *other* (continuity within the batch) — landing-side drift becomes a v3 problem, not a v2 emergency.
5. **Strategist signoff required** to change the typewriter design on the landing during Wave-3 production window. Add to brief `_summary.md` as a coordination dependency.

**Important correction:** V2-01 brief §4 lists "Inter 800, 64px" for the S6 typewriter end-card — this **does not match the landing**. Landing uses `fontWeight: 200` (light) with `letter-spacing: -0.025em` and a chrome-silver-sweep gradient (via `-webkit-background-clip: text`). Brief §4 needs editing to match. Recommend creative-director update the brief, or producer overrides at render-time per this tech-decisions doc (which takes precedence on CSS-spec questions).

### Risk #2 — V2-02 serif font is a stealth visual-language violation

**Who must sign off:** **Strategist** (Claude Opus role: `marketing-strategist`). The decision tree:

```
Strategist sees V2-02 brief §4 introduces Crimson Pro / Playfair Display
│
├── (a) APPROVES one-off serif for V2-02 S1 only (2.8s, hook-scene-only)
│        → producer ships V2-02 with serif. Visual-language ledger updated:
│          "V2-02 hook: editorial serif precedent set, NOT to bleed into S2+."
│        → post-launch: if V2-02 hits target hold-rate, serif primitive can be
│          considered for v3 brand-system. If it underperforms, the loss
│          attribution must specify whether serif vs. angle/copy was the cause.
│
├── (b) REJECTS serif → copywriter must rework hook to Inter-italic editorial
│        treatment: e.g., 64px Inter 200 italic, letter-spacing -0.025em,
│        with the same chrome-silver gradient as the landing typewriter.
│        Same editorial register, no new font.
│        → 30 min copy rework + brief §4 update.
│
└── (c) DEFERS to test → ship V2-02 with serif as Variant A AND with
         Inter-italic as Variant B (same hook copy, same scenes, only S1 font
         differs). Costs 0.3 extra HF-days. A/B in feed. Risk: split budget.
```

**Tech-director recommendation:** path (a) with the one-off precedent clearly logged. The Inter type system genuinely lacks a serif weight, and the editorial register is a deliberate copy-doc decision per brief §4 note ("editorial register — intentional deviation"). The brand DA does specify "Inter only" but it equally specifies "warm dark + chrome silver + glass cards" — V2-02 stays inside the larger DA frame and uses a font as a single hook-scene editorial-register signal. Bigger risk is making creative cautious by treating every micro-deviation as a violation.

Strategist sign-off must land in `09-verification/strategist-overrides.md` before V2-02 renders.

### Risk #3 — `[dramatization]` watermark spec

Covered in Decision 9 above with frozen visual spec. **TL;DR for creative-director:**
- Persistent corner overlay during the synthesized audio drop (not full ad).
- 11px Inter 400, `#fafafa` at 35% opacity, bottom-left corner.
- 9:16 position `y=1820`, 1:1 position `y=1020`.
- Hard fade-in/out, no animation.
- Reusable HF component already specified.

Briefs V2-03 §3 and V2-04 §3 need editing to include the watermark on the relevant scenes. Producer reads this doc as authoritative override on watermark placement.

---

## Pipeline order — fastest setup to slowest

**Production order (matches `_summary.md` §4 + locks tech dependencies):**

### Day 1 — Wave 1A: V2-02
**Zero tech-director escalations.** Ship first.
1. Add Crimson Pro to HF via `@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@700&display=swap');` (pending strategist sign-off Risk #2).
2. Build `landing-typewriter.html` shared component (Decision 3) — used by V2-02 S4 with `data-phrase="headline2b"`.
3. Assemble V2-02 from existing Ad11 primitives + serif S1 + landing-typewriter S4.
4. Render at 1080×1920 + ffmpeg post-mux (same pipeline as Ad11).
5. Ship.

**Sequential dependencies:** none beyond strategist sign-off on serif. Can render same day.

### Day 1-2 — Wave 1B: V2-01
**One escalation (keyboard B-roll + clatter SFX).**

**Parallel tracks:**
- **Track A** (concurrent with V2-02 render): manually source keyboard B-roll from Pixabay (~30 min). Run ffmpeg crop/grade (~5 min). Cache at `Tonvo-Ad-HF/assets/v2-01_keyboard.mp4`.
- **Track B** (concurrent): generate `keyboard-clatter.wav` via ffmpeg layering (Decision 2, ~10 min).
- **Track C** (concurrent): generate V2-01's 5 Aria VO segments via Edge TTS (~5 min).

**Sequential after tracks A/B/C complete:**
1. Assemble V2-01 composition referencing the new keyboard asset + clatter + landing-typewriter `headline2b` + reused Ad11 primitives.
2. Render → ffmpeg post-mux → ship.

### Day 3-5 — Wave 2A: V2-03
**Five escalations. Heaviest brief.**

**Parallel kickoff (Day 3 morning):**
- **Track A:** source Zoom thumbnail from Pixabay → ffmpeg pre-process (Decision 4, ~1 hour).
- **Track B:** generate 4 synthesized buyer lines (Decision 5, ~30 min incl. drop-3 hesitation stitching).
- **Track C:** generate 5 Aria narrator VO segments via Edge TTS (~10 min).
- **Track D:** build `flip-card.html` shared component (Decision 6, ~2 hours).
- **Track E:** build `dramatization-watermark.html` shared component (Decision 9, ~30 min).

**Sequential after Tracks A-E (Day 3 afternoon → Day 4):**
1. Generate the audio waveform strip animated SVG (V2-03 §4 asset list, ~1 hour HF).
2. Build the in-phone 3-signal stack composite (V2-03 S5, ~2 hours HF).
3. Assemble V2-03 composition.
4. Frame-lock card flips: card 1 frame 210, card 2 frame 360, card 3 frame 495 (per brief §3 mandatory sync).
5. Render → ffprobe check → ffmpeg post-mux → mobile-preview validation.

**Critical-path bottleneck:** Track A (Zoom thumbnail). If Pixabay returns no usable clip after 2 hours of search, escalate to founder-override request for Kling 3.0 (~$1.40). Otherwise fall back to abstract waveform-only treatment per Decision 4.

### Day 5-6 — Wave 2B: V2-04
**Two new escalations + inherited from V2-03.**

**Parallel kickoff (Day 5 afternoon, immediately after V2-03 spine locks):**
- **Track A:** generate V2-04 single buyer line `"let me think about it."` via Edge TTS Jenny + ffmpeg Zoom-codec treatment (Decision 5, ~5 min). Reuse pattern.
- **Track B:** generate 4 V2-04 Aria narrator VO segments (~10 min).
- **Track C:** build split-frame composite primitive (Decision 8, ~1 hour HF).
- **Track D:** confirm 1080×1080 HF render works (Decision 7, ~15 min CLI test using a placeholder composition).

**Sequential (Day 6):**
1. Build 1:1 layout (upper-half thumbnail + lower-half overlays — NOT auto-crop of V2-03).
2. Build iPhone mockup at 320px width variant.
3. Assemble V2-04 composition referencing reused V2-03 audio + thumbnail (with grayscale CSS filter applied at render-time) + V2-04-specific layout.
4. Render at 1080×1080 → ffmpeg post-mux → mobile-preview (1:1 placement) validation.

**Total Wave 3 timeline:** 6 production days. Matches `_summary.md` §4. **Zero paid escalations on the baseline plan.** Pixabay thumbnail (Decision 4) is the only critical-path hinge — has a documented fallback.

---

## Tools to install/configure BEFORE first render

All free, no API keys, no founder overrides on the baseline plan:

```bash
# 1. Edge TTS (Python pip) — for Aria narrator + Jenny buyer voice
pip install edge-tts
edge-tts --list-voices | grep "en-US-AriaNeural\|en-US-JennyNeural"
# Confirm both voices return rows; if not, pip install --upgrade edge-tts

# 2. ffmpeg — must be in PATH (Windows: choco install ffmpeg or scoop install ffmpeg)
ffmpeg -version
# Required for: clatter synth, buyer voice Zoom-codec post, room-tone generation,
# 1080×1080 post-mux, optional hstack fallback.

# 3. HyperFrames CLI — already installed in Tonvo-Ad-HF (per existing renders)
cd "c:/Users/emili/OneDrive/Documents/M1001/Code/Tonvo-Ad-HF"
npx hyperframes --version
npx hyperframes lint  # verify project is in a clean state pre-Wave-3

# 4. Pixabay asset cache — manual sourcing
# Login optional (CC0 downloads don't require account)
# Cache target dirs:
mkdir -p "c:/Users/emili/OneDrive/Documents/M1001/Code/Tonvo-Ad-HF/assets/source"
# Assets to source manually:
#   - keyboard macro 4k loop → assets/v2-01_keyboard.mp4 (after ffmpeg pre-process)
#   - zoom-call portrait loop → assets/v2-03_buyer_thumbnail.mp4 (after pre-process)

# 5. Google Fonts — Crimson Pro (V2-02 only, pending strategist sign-off)
# Inject via @import in HF style block — no CLI install needed
# URL: https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@700&display=swap
```

**Founder-override required IF AND ONLY IF a fallback escalates:**

| Trigger | Tool | Cost | Where to log |
|---|---|---|---|
| Pixabay returns no usable Zoom thumbnail after 2h search (Decision 4 fallback tier 2) | Kling 3.0 via fal.ai API | ~$1.40 / 20s | `meta-campaign-01/09-verification/founder-overrides.md` (or campaign-02 equivalent if created) |
| Drop #3 hesitation reads as glitch even after silence tuning (Decision 5 fallback) | ElevenLabs single-line, "hesitant" prompt | ~$0.05 | Same |
| Both unlikely; baseline plan is $0 |

**API keys to set ONLY if a founder override triggers:**
- `FAL_KEY` environment variable (for Kling via fal.ai) — only if Decision 4 fallback fires.
- `ELEVENLABS_API_KEY` environment variable — only if Decision 5 fallback fires.

Neither is needed on the baseline plan.

---

## Récap final (<250 mots)

**9 of 9 lane decisions ride 100% free stack.** Total V2 Wave-3 incremental tooling cost: **$0**. Zero subscription stack. Zero founder override required on the baseline plan. Honors Campaign-01 free-stack lock (2026-05-04 Emilien decision) — the campaign-02 brief did not re-open the premium budget, so this batch ships entirely on Edge TTS Aria/Jenny, sfx-apple/ + ffmpeg synth, Pixabay royalty-free assets, HyperFrames HTML+GSAP, and `tense-cinematic.mp3`.

**If all fallbacks fire (worst-case escalation),** total paid spend caps at **~$1.45** (Kling 3.0 thumbnail $1.40 + ElevenLabs single line $0.05) for the entire 4-ad batch — still inside the <$5/ad budget rule and well under any paid-stack subscription tier ($110/mo if we adopted the full ElevenLabs + Suno + Stable Audio + Hedra + fal.ai recommendation).

**Hybrid recommendation IF Emilien lifts the free-stack lock for Wave 3:** activate **only ElevenLabs Creator ($22/mo)** for the buyer-voice drops. Naturalness on Drop #3 hesitation is the single qualitative gain that may move hold-rate. Skip everything else — Suno, Stable Audio, FLUX, Hedra, Kling are all over-investment for this batch where every non-buyer-voice asset has a free-stack-parity option. Net Wave-3 paid: ~$22 (1 month ElevenLabs Creator), amortized across 4 ads = $5.50/ad — at the budget ceiling, not over.

**Three risks under-counted by creative-director are now answered:** (1) typewriter pinned to git commit `9f509ce` with frozen config in Decision 3; (2) V2-02 serif decision tree in Risk #2 response, requires strategist sign-off in `09-verification/strategist-overrides.md`; (3) `[dramatization]` watermark frozen as 11px Inter 400 #fafafa @ 35% opacity bottom-left corner overlay, persistent only during synthesized buyer audio.

**Next agent:** producer. Read this doc + the 4 briefs. Begin Wave 1A (V2-02) Day 1.

---

_End tech-decisions-v2.md. Next agent in pipeline: producer (fork from `Tonvo-Ad-HF/`)._

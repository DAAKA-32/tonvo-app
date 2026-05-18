# Brief Closing-01 — Count to 7

_Creative Director: Claude Opus · Date: 2026-05-14 · Status: NEW · Sprint: closing-sprint · Source copy: `03-copy/closing-copy.md` §Angle #1_

---

## 1. Header

| Field | Value |
|---|---|
| **Angle name** | Count to 7 |
| **Close-moment subject** | The silence after the ask |
| **Primary ICP** | ICP-1 — Quota-Slipping AE (the one who talks past the close) |
| **Secondary ICP** | ICP-2 |
| **Emotional register** | Shame |
| **Hook ID lead** | `#4.2` — "7 seconds of silence wins deals." (from `closing-hooks.md`, ranked #1 in top-7) |
| **Format master** | 1080×1920 (9:16 Reels/Stories) |
| **Format reformat** | 1080×1080 (1:1 Feed) |
| **Total duration** | 25s master / 24s reformat |
| **Production estimate** | **1.5 HF-days** (per strategist) — pioneers the `seven-second-counter` primitive that briefs 02/04 will reuse |

**Non-negotiable load-bearer:** the dead-audio gap at 00:06–00:10 (4.0s of intentional silence under the chrome counter). If a trim pass shortens this below 3.5s, the entire scroll-stop mechanism collapses. Do NOT cut.

---

## 2. Scene Map (time-coded)

### Scene S0 — `00:00–00:02` — Chrome cold-open (the hook)

- **VO line** — _(none — text-only cold-open, dead audio under the chrome wordmark)_
- **On-screen kinetic text** — chrome wordmark line 1 lands center-frame at 00:00.0: `7 SECONDS OF SILENCE` · 220px Inter Bold, silver-sweep mask animates left→right 0.0s→0.6s. Line 2 drops below at 00:00.8s: `WINS DEALS` · 160px Inter Bold, matte white.
- **Visual primitives** — `chrome-text-sweep` (existing, Ad11) · `grid-bg` (existing, dark) · `radial-glow` low-opacity behind line 1
- **Motion direction** — line 1 entry: `clipPath: inset(0 100% 0 0)` → `inset(0 0% 0 0)` over 0.6s, `cubic-bezier(0.22, 1, 0.36, 1)` (power4.out). Line 2: scale 0.92 → 1.0 + opacity 0 → 1 over 0.4s, eased `power3.out`. Both hold to 00:02.0s. Camera holds.
- **SFX cue** — `sub-impact.wav` at 00:00.0 (the hook stamp) · `reverse-lift.wav` swelling from -00:00.4 into 00:00.0 (anticipation tail) · `ambient-rise.wav` low under entire S0 at -24dB
- **Tonvo glass card?** No.

### Scene S1 — `00:02–00:06` — Rep ask + waveform + counter starts

- **VO line** (Ava Neural, EN master) — "You asked for the deal. Buyer goes quiet. One second. Two. Three."
- **Buyer/rep dramatized audio** — synthesized rep voice line _"So… can we get started Monday?"_ plays 00:02.2–00:03.4. Tag: `[dramatization — synthesized rep line, not a real call clip]` per copywriter Resolution-1.
- **On-screen kinetic text** — full-width audio waveform renders horizontally at 00:02.0, animates with the rep audio, then flat-lines at 00:03.4 (the moment buyer goes silent). Top-right chrome counter starts ticking: `00:01` at 00:03.4, `00:02` at 00:04.4, `00:03` at 00:05.4. Counter font: 96px Inter Bold, chrome silver-sweep on each tick.
- **Visual primitives** — `waveform` (existing — from Ad10's wave visualization) · `seven-second-counter` **(NEW primitive — defined below in §Asset Manifest)** · `grid-bg` continues
- **Motion direction** — waveform entry: opacity 0 → 1 over 0.2s. Counter tick entry per second: scale 1.15 → 1.0 + opacity 0 → 1 over 0.18s, `power2.out`. Camera: subtle slow pull-back (scale 1.02 → 1.0) over the full 4s to add weight to the silence.
- **SFX cue** — `tap-mid.wav` on each counter tick (00:03.4, 00:04.4, 00:05.4). Music bed `tense-cinematic.mp3` ducks -6dB at 00:03.4 to make room for the dead air.
- **Tonvo glass card?** No.

### Scene S2 — `00:06–00:10` — DEAD-AIR LOAD-BEARER + price-drop strikethrough

- **VO line** (Ava Neural) — "Then you flinch. You drop the price. You add a free month. You talk past the yes." _Pace: SSML `<break time="800ms"/>` between sentences. Total VO occupies 00:06.0–00:09.6._
- **On-screen kinetic text** — Glass card snaps in at 00:06.2 center-frame: `YOU JUST DROPPED THE PRICE.` 96px Inter Bold white on glass-blur. At 00:07.0 a red strikethrough sweeps L→R across the card. Counter continues top-right: `00:04` (00:06.4) · `00:05` (00:07.4) · `00:06` (00:08.4) · `00:07` (00:09.4, sub-impact stamp on this tick).
- **Visual primitives** — `glass-card` (existing, Ad11 spec) · `seven-second-counter` continues · `chrome-text-sweep` for the strikethrough
- **Motion direction** — glass card entry: translateY 24px → 0 + opacity 0 → 1 over 0.35s, `expo.out`. Strikethrough: `scaleX(0) → scaleX(1)` transform-origin left, 0.4s `power3.inOut`. Counter ticks identical to S1.
- **SFX cue** — `tap-mid.wav` on ticks `00:04 / 00:05 / 00:06` · `sub-impact.wav` on tick `00:07` (the climax of the silence beat) · `strike.wav` (existing in sfx-apple library) on the red strikethrough at 00:07.0 · music duck -6dB held from S1
- **Tonvo glass card?** No.
- **⚠ NON-NEGOTIABLE:** intentional dead-air gap from 00:06.0–00:10.0 under the VO and ticks. The buyer-side audio channel stays SILENT for the full 4s. The viewer-feed contrast between scroll-noise and dead air is the scroll-stop mechanism per `#swipe-12` gap-to-own. If a future trim pass compresses this, the ad dies.

### Scene S3 — `00:10–00:15` — Split: YOU vs TOP REP

- **VO line** (Ava Neural) — "The top rep in your team doesn't. She counts to seven. Every time."
- **On-screen kinetic text** — split-screen lands at 00:10.2. Left chrome card: `YOU` (matte, 140px Inter Bold, dim 0.55 brightness). Right chrome card: `TOP REP` (chrome silver-sweep, 140px, full brightness, subtle pulse). At 00:13.0 right card pulses again with a brightness lift to 1.1 then back to 1.0.
- **Visual primitives** — `glass-card` × 2 in split layout · `chrome-text-sweep` on right card only · `radial-glow` behind right card
- **Motion direction** — both cards entry: opacity 0 → 1 + translateX ±20px → 0 over 0.45s, `power3.out`. Pulse on right card: `scale 1.0 → 1.04 → 1.0` over 0.6s, sine ease.
- **SFX cue** — `tap-bright.wav` on right card pulse at 00:13.0 · `tap-low.wav` on left card entry · music duck releases to -3dB
- **Tonvo glass card?** No.

### Scene S4 — `00:15–00:19` — iPhone 17 mockup + Tonvo prompt + counter resumes

- **VO line** (Ava Neural) — "That's not a personality trait. It's a prompt on her second screen. Tonvo runs it. While you're on the call."
- **On-screen kinetic text** — iPhone 17 mockup lands center-frame at 00:15.0 (340px wide on 9:16, 280px wide on 1:1). Inside the iPhone screen, Tonvo glass card slides up: **`HOLD. Count to 7. Buyer is doing the math.`** · 48px Inter Medium chrome heading + 36px Inter Regular sub-line, glass-blur background. Counter resumes top-right OUTSIDE the iPhone frame: `00:04 · 00:05 · 00:06 · 00:07` ticking at 00:15.4 / 00:16.4 / 00:17.4 / 00:18.4.
- **Visual primitives** — `iphone-17-mockup` (existing, per memory rule + Ad11 spec) · `glass-card` inside mockup · `seven-second-counter` continues
- **Motion direction** — iPhone entry: scale 0.94 → 1.0 + opacity 0 → 1 + rotateY -3° → 0° over 0.6s, `power3.out`. Tonvo card inside iPhone: translateY 80px → 0 + opacity 0 → 1 over 0.4s at 00:15.6, `expo.out`. Counter ticks: same as S1/S2.
- **SFX cue** — `air-swoosh.wav` at 00:15.0 (iPhone arrival) · `detect-ping.wav` at 00:15.6 (Tonvo card surfaces) · `tap-mid.wav` on each counter tick · `sub-impact.wav` on final `00:07` tick at 00:18.4 (the kill-stamp)
- **Tonvo glass card?** YES — this is the product moment.

### Scene S5 — `00:19–00:22` — Closed-won payoff

- **VO line** — _(none — let the visual breathe; music swells)_
- **On-screen kinetic text** — glass card replaces iPhone at 00:19.2: `CLOSED · $48K` · 140px Inter Bold chrome with silver-sweep on `$48K`. _Fallback per §Risk: if Meta policy flags the $ amount, render as `CLOSED · DEAL` and drop the dollar._
- **Visual primitives** — `glass-card` · `chrome-text-sweep` on dollar amount · `radial-glow` behind
- **Motion direction** — entry: scale 0.9 → 1.0 + opacity 0 → 1 over 0.5s, `back.out(1.7)`. Silver sweep on `$48K`: 0.8s with 0.2s delay after card lands, `power2.inOut`.
- **SFX cue** — `glass-chime.wav` at 00:19.2 (the win cue) · `tap-bright.wav` on silver sweep peak at 00:20.0 · music swells +4dB

### Scene S6 — `00:22–00:25` — CTA + slogan

- **VO line** — _(none — slogan reads as on-screen text only; the locked slogan is visual, not VO, in this brief)_
- **On-screen kinetic text** — Tonvo logo lands center at 00:22.2 (128px wide) · slogan beneath: `Never miss a word with Tonvo` (italic Inter Regular, 56px) · CTA pill at 00:23.4: `Try Free → tonvo.co` (white pill, chrome border, 64px Inter Medium) · micro-line beneath: `30s setup · no card` (32px Inter Regular muted)
- **Visual primitives** — existing CTA-stack from Ad11 (logo + slogan + pill + micro)
- **Motion direction** — logo: scale 0.6 → 1.0 over 0.5s, `back.out(1.4)`. Slogan: opacity 0 → 1 + translateY 12px → 0 over 0.4s with 0.3s delay. CTA pill: scale 0.92 → 1.0 + pulse loop (1.0 → 1.03 → 1.0 every 1.5s).
- **SFX cue** — `air-swoosh.wav` at 00:22.2 (logo arrival) · `text-pop.wav` on slogan land at 00:22.7 · `tap-bright.wav` on CTA pill at 00:23.4 · `glass-chime.wav` tail at 00:24.5

---

## 3. Audio Track

### VO
- **EN master:** EdgeTTS **Ava Neural**, rate -4%, pitch +0Hz. Save segments to `assets/audio/closing-01/s1_ask.mp3`, `s2_flinch.mp3`, `s3_top-rep.mp3`, `s4_prompt.mp3`.
- **FR variant:** EdgeTTS **Denise Neural**, rate -4%. Same scene boundaries, swap text per `closing-copy.md §Angle #1 FR`. Save to `assets/audio/closing-01-fr/`.

### SSML pacing — load-bearing
- **S2 dead-air enforcement:** the VO track in S2 (00:06–00:10) MUST contain SSML `<break time="800ms"/>` between each sentence so the on-screen counter ticks land in the spoken gaps, not over them. Final VO segment ends at exactly **00:09.6** so 00:09.6–00:10.0 is pure silence (400ms tail).
- **S1 dead-air enforcement:** between the synthesized rep line ending (00:03.4) and the VO line "You asked for the deal..." (00:02.0 start, ends ~00:05.6 with SSML breaks), the buyer channel is silent from 00:03.4 onward. **Total silence budget across S1+S2 = ~4.2s.** This is the count-to-7 mechanism; if it gets compressed, the ad dies.
- Synthesized rep ask "So… can we get started Monday?" — generate via EdgeTTS **Christopher Neural** (male, contrast with Ava's female VO) at rate -2%. Save as `assets/audio/closing-01/rep_ask.mp3`. Tag in commit message: `[dramatization]`.

### Music bed
- **Track:** `assets/audio/tense-cinematic.mp3` (locked v1 bed)
- **Base volume:** -18dB (0.30 linear)
- **Ducking schedule:**
  - 00:00–00:02 (S0): -12dB (hook punch room)
  - 00:02–00:06 (S1): -18dB base
  - 00:06–00:10 (S2 DEAD-AIR): **-24dB** (let the silence dominate)
  - 00:10–00:15 (S3): -18dB
  - 00:15–00:19 (S4): -18dB
  - 00:19–00:22 (S5): **-14dB swell** (win moment)
  - 00:22–00:25 (S6): -18dB tail
  - 00:25: fade-out 250ms

### SFX layer (full cue sheet)
| Time | Cue | Channel notes |
|---|---|---|
| 00:00.0 | sub-impact.wav | hook stamp |
| 00:00.4 | reverse-lift.wav | anticipation, runs into 00:00.0 |
| 00:00.0–00:02.0 | ambient-rise.wav | -24dB pad |
| 00:03.4 | tap-mid.wav | counter `00:01` |
| 00:04.4 | tap-mid.wav | counter `00:02` |
| 00:05.4 | tap-mid.wav | counter `00:03` |
| 00:06.4 | tap-mid.wav | counter `00:04` |
| 00:07.0 | strike.wav | price-drop strikethrough |
| 00:07.4 | tap-mid.wav | counter `00:05` |
| 00:08.4 | tap-mid.wav | counter `00:06` |
| 00:09.4 | sub-impact.wav | counter `00:07` (kill stamp) |
| 00:10.2 | tap-low.wav | left split card (YOU) |
| 00:13.0 | tap-bright.wav | right split card pulse (TOP REP) |
| 00:15.0 | air-swoosh.wav | iPhone arrival |
| 00:15.6 | detect-ping.wav | Tonvo card surfaces |
| 00:15.4–00:18.4 | tap-mid.wav ×4 | counter resume ticks |
| 00:18.4 | sub-impact.wav | final `00:07` kill |
| 00:19.2 | glass-chime.wav | closed-won card |
| 00:20.0 | tap-bright.wav | silver sweep peak |
| 00:22.2 | air-swoosh.wav | logo arrival |
| 00:22.7 | text-pop.wav | slogan land |
| 00:23.4 | tap-bright.wav | CTA pill |
| 00:24.5 | glass-chime.wav | tail |

All SFX sourced from `assets/audio/sfx-apple/` (existing 15-WAV library). **No new SFX.**

---

## 4. iPhone 17 Mockup Direction

- **Scene using it:** S4 only (00:15–00:19).
- **Component:** `IPhone17Mockup` wrapper per memory rule `iphone17-mockup` — same component used in Ad11 (`Tonvo-Ad-HF/index.html`).
- **Mockup dimensions:** 340px wide on 9:16 master, 280px wide on 1:1 reformat. Rotation: rotateX 4°, rotateY -2° (matches Ad11).
- **Screen content source:** **NEW sub-clip** of `assets/demo-session.mp4` — extract frames showing the Tonvo glass-card prompt surface. **Specific source timecode:** `assets/demo-session.mp4` from `00:08.5` to `00:12.5` (4s window where the in-app Tonvo coaching card is most visible). Save extracted sub-clip as `assets/demo-session-count7.mp4` (4s loop, no audio — audio is dead-air-load-bearing here).
- **Glass card overlay text on top of demo capture:** `HOLD. Count to 7. Buyer is doing the math.` — rendered as DOM overlay on top of the iPhone screen video, NOT baked into the mp4 (allows FR text swap).
- **Dynamic island + side buttons:** rendered per Ad11 standard. Do NOT skip — they sell the "this is a real phone, this is what your top rep actually sees" frame.

---

## 5. Asset Manifest

| Asset | Path | Status |
|---|---|---|
| Master template fork | `Tonvo-Ad-HF/index.html` (Ad11) | EXISTS — fork to `Tonvo-Ad-HF-closing-01/` |
| iPhone 17 mockup component | `IPhone17Mockup` (inline in Ad11) | EXISTS |
| Demo capture sub-clip | `assets/demo-session-count7.mp4` (4s extract from `demo-session.mp4` @ 00:08.5–00:12.5) | **NEW — extract required** (no rebuild — 4s ffmpeg trim of existing source) |
| Logo | `assets/logo-tonvo-remove.png` | EXISTS |
| Music bed | `assets/audio/tense-cinematic.mp3` | EXISTS |
| SFX library | `assets/audio/sfx-apple/*.wav` (15 files) | EXISTS |
| VO segments EN | `assets/audio/closing-01/s1-s4.mp3` (4 files) | **NEW — generate via EdgeTTS Ava Neural** |
| VO segments FR | `assets/audio/closing-01-fr/s1-s4.mp3` (4 files) | **NEW — generate via EdgeTTS Denise Neural** |
| Synthesized rep ask EN | `assets/audio/closing-01/rep_ask.mp3` | **NEW — EdgeTTS Christopher Neural** |
| Synthesized rep ask FR | `assets/audio/closing-01-fr/rep_ask.mp3` | **NEW — EdgeTTS Henri Neural** |

### NEW PRIMITIVE: `seven-second-counter`

Defined here for HF implementation. Reused in briefs 02 and 04 (different counter ranges; same primitive).

```
<div class="counter-seven" data-from="0" data-to="7" data-tick-ms="1000">
  <span class="counter-display">00:01</span>
</div>
```

CSS:
- Position: top-right of the safe-area frame, padding 48px from edges
- Font: Inter Bold 96px (9:16) / 72px (1:1)
- Color: `#fafafa` matte; chrome silver-sweep mask applied per tick via clip-path keyframe (reuse Ad11's `chrome-text-sweep` mixin)
- Background: none (text floats over grid-bg / glass scenes)

GSAP timeline behavior:
```js
const counter = document.querySelector('.counter-display');
const display = (n) => `00:${String(n).padStart(2, '0')}`;
const tickTimes = [3.4, 4.4, 5.4, 6.4, 7.4, 8.4, 9.4]; // seconds from ad start in S1+S2
tickTimes.forEach((t, i) => {
  gsap.set(counter, { textContent: display(i + 1), opacity: 0, scale: 1.15 }, t);
  gsap.to(counter, { opacity: 1, scale: 1.0, duration: 0.18, ease: 'power2.out' }, t);
});
```

The counter pauses for S3 (00:10–00:15) and resumes at S4 with ticks at 00:15.4 / 00:16.4 / 00:17.4 / 00:18.4 (state held visually at `00:07` from 00:09.4 to 00:15.4, then animates back from `00:04`→`00:07` for the iPhone scene).

**Lift point:** brief 04 reuses this primitive but inverted (counts down from `47:00`).

---

## 6. Reformat Notes — 1:1 from 9:16

| Scene | 9:16 → 1:1 delta |
|---|---|
| S0 | Chrome wordmark fits — re-center vertically. Line 1 drops from 220px → 180px font size. Line 2 stays 160px. |
| S1 | Waveform width: full 1080. Counter: re-position top-right with 64px (not 48px) edge padding because 1:1 crops vertical room. Counter font drops 96px → 72px. |
| S2 | Glass card: max-width 920px → 880px to clear the tighter 1:1 frame. Counter same as S1. |
| S3 | Split cards: stack VERTICALLY in 1:1 (not side-by-side) — `YOU` top, `TOP REP` bottom. **This is the only scene that needs a full layout rebuild for 1:1.** Side-by-side split exits the 1:1 crop on both edges. Vertical stack: 540px tall per card with 24px gap. |
| S4 | iPhone 17 width drops 340px → 280px. Tonvo card inside iPhone keeps same proportions. Counter top-right same as S2. |
| S5 | Closed-won card fits — drop `$48K` font from 140px → 120px to keep horizontal margin. |
| S6 | Logo 128px → 104px. Slogan 56px → 48px. CTA pill 64px → 56px. Same vertical stack. |

**Total duration in 1:1:** 24s (drop 1s of S0 hold — chrome wordmark reads punchier in 1:1 with shorter hold). Adjust S1 start to 00:01.0 (not 00:02.0).

**No scene gets cut entirely.** Every beat survives the crop.

---

## 7. Risk Notes — Meta policy gates

- **`$48K` closed-won card in S5:** Meta may flag specific dollar amounts as an earnings claim if no disclaimer. **Fallback:** if first 48h reports a creative rejection, swap S5 to `CLOSED · DEAL` (strip the dollar, keep the CLOSED stamp). Re-render only S5, not the whole ad.
- **`7 seconds wins deals` hook line in S0:** acceptable — it's a sales-craft claim, not a product earnings claim. No policy fallback needed.
- **No verification load-bearer in this ad.** (Brief 04 carries the autopsy verification line; this ad doesn't claim Tonvo measured anything.)
- **Synthesized rep voice:** flagged in copywriter as `[dramatization]`. No on-screen disclaimer required per Meta policy (voice synth ≠ deepfake of a public figure), but commit message and asset filename should retain the `[dramatization]` tag for downstream auditing.

---

## 8. Production order recommendation (in cross-brief context)

This brief is **build #1 of the closing sprint** because:
1. It pioneers the `seven-second-counter` primitive that briefs 02 (the rebuttal-tick counter) and 04 (the 47-minute call-autopsy counter) both lift.
2. It's the lowest-invention build (1.5 HF-days) — fast win to validate the closing-sprint visual language before committing to brief 02 (2 HF-days, the densest one).
3. The hook (`#4.2` ranked #1 in top-7) is the campaign's signature scroll-stop — early CTR/hold data on this ad informs whether to lean the rest of the sprint on dead-air gaps or pivot to denser visuals.

---

## 9. Anti-pattern callout

**Do NOT:**
- Show a face. Lane A is faceless. Not even a Zoom-tile-avatar placeholder. If you need a "buyer" or "rep" identity, render them as a waveform or a name-stamp glass card. No silhouettes, no stock people, no AI avatars.
- Invent a new aesthetic. Chrome silver-sweep / glass-blur cards / iPhone 17 mockup / dark grid-bg. Nothing else. If a beat "needs" a color accent, it doesn't — re-stage it as chrome contrast against matte white.
- Add any CTA other than `Try Free → tonvo.co`. No "Book a demo." No "Talk to sales." No "Watch a video."
- Drift into demo/discovery/onboarding. This is the silence-after-the-ask only. If a scene starts narrating Tonvo's broader capability, cut it.
- Compress the S2 dead-air gap below 3.5s under any pacing pressure. The silence IS the ad. A 22s version with full silence beats a 25s version with truncated silence.
- Skip the synthesized rep ask audio at 00:02.2. The waveform without the audio cue reads as decoration, not a real call.

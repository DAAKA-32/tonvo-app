# Brief Closing-03 — The Signal You Missed

_Creative Director: Claude Opus · Date: 2026-05-14 · Status: NEW · Sprint: closing-sprint · Source copy: `03-copy/closing-copy.md` §Angle #3_

---

## 1. Header

| Field | Value |
|---|---|
| **Angle name** | The Signal You Missed |
| **Close-moment subject** | The buying signal ("how soon could we start?" / "what does onboarding look like?") |
| **Primary ICP** | ICP-2 — Aspirational Top-Rep Hunter (top reps hear signals, you don't) |
| **Secondary ICP** | ICP-1 |
| **Emotional register** | Pride (with a sting of loss-aversion underneath) |
| **Hook ID lead** | `#3.4` — "Buyer just said yes. You missed it." (top-7 rank #5) |
| **Format master** | 1080×1920 (9:16 Reels/Stories) |
| **Format reformat** | 1080×1080 (1:1 Feed) |
| **Total duration** | 25s master / 24s reformat |
| **Production estimate** | **1.5 HF-days** (per strategist) |

**Non-negotiable load-bearer:** the 9-vs-1 tile split in S3 must render the lit tile as **the viewer's identity** (ICP-2 wants to be the one who hears the signal). Reverse from brief 01's split (where the right card was "TOP REP" as aspiration). Here, the lit tile = "she heard it" = the viewer claiming the identity. This is the pride register, not the shame register.

---

## 2. Scene Map (time-coded)

### Scene S0 — `00:00–00:02` — Cold-open wordmark + strikethrough

- **VO line** — _(none — text-only cold-open)_
- **On-screen kinetic text** — black frame at 00:00.0. Chrome wordmark line 1 lands center at 00:00.2: `BUYER JUST SAID YES.` (180px Inter Bold, chrome silver-sweep). Sub-line drops at 00:01.0: `YOU MISSED IT.` (140px Inter Bold matte white, with a thin red strikethrough sweep at 00:01.4 across `MISSED IT`).
- **Visual primitives** — `chrome-text-sweep` · `grid-bg` · `radial-glow` low-opacity behind line 1
- **Motion direction** — line 1: clip-path silver sweep L→R 0.0s→0.6s, `power4.out`. Line 2: opacity 0 → 1 + translateY 12px → 0 over 0.4s, `power3.out`. Red strikethrough at 00:01.4: `scaleX(0) → scaleX(1)` transform-origin left, 0.3s `power3.inOut`.
- **SFX cue** — `sub-impact.wav` at 00:00.2 · `reverse-lift.wav` swelling into 00:00.0 · `tap-bright.wav` at 00:01.0 · `strike.wav` at 00:01.4

### Scene S1 — `00:02–00:06` — First buying signal card flip

- **VO line** (Ava Neural, EN) — "'How soon could we start?' That's not a question. That's a yes."
- **Buyer audio dramatized:** synthesized buyer voice _"How soon could we start?"_ plays 00:02.4–00:03.6. Tag: `[dramatization]`.
- **On-screen kinetic text** — glass card lands at 00:02.4 center-frame with audio waveform animating across the card and the spoken quote rendered as text: `"How soon could we start?"` (72px Inter Medium italic). At 00:04.4 the card flips horizontally (CSS `transform: rotateY(180deg)`) and reveals on its back face: `= YES.` (140px Inter Bold chrome silver-sweep).
- **Visual primitives** — `glass-card` (with flip transform) · `waveform` (animated inside the card) · `chrome-text-sweep` on `= YES.`
- **Motion direction** — card entry: translateY 30px → 0 + opacity 0 → 1 over 0.4s, `expo.out`. Flip: `rotateY 0deg → 180deg` over 0.5s, `power3.inOut`. The `= YES.` face renders on back-face-visibility.
- **SFX cue** — `tap-mid.wav` at 00:02.4 (card land) · `air-swoosh.wav` at 00:04.4 (flip start) · `sub-impact.wav` at 00:04.7 (flip lands on `= YES.`)

### Scene S2 — `00:06–00:10` — Second buying signal card flip

- **VO line** (Ava Neural) — "'What does onboarding look like?' Same. That's a yes."
- **Buyer audio dramatized:** synthesized _"What does onboarding look like?"_ plays 00:06.4–00:07.6. Tag: `[dramatization]`.
- **On-screen kinetic text** — second glass card slides in from below (S1 card stays as background, dimmed to 0.4). At 00:06.4: `"What does onboarding look like?"`. At 00:08.4 flips to `= YES.`
- **Visual primitives** — same as S1 (`glass-card` flip, `waveform`, `chrome-text-sweep`)
- **Motion direction** — same easings as S1.
- **SFX cue** — `tap-mid.wav` at 00:06.4 · `air-swoosh.wav` at 00:08.4 · `sub-impact.wav` at 00:08.7

### Scene S3 — `00:10–00:14` — 70% stat hero + 9-vs-1 tile split

- **VO line** (Ava Neural) — "The top rep on your team hears those four words and stops pitching. She asks for the deal in the next breath. 70% of reps don't."
- **On-screen kinetic text** — both S1+S2 cards dim out. Chrome hero number sweeps in center at 00:10.4: `70%` (320px Inter Bold chrome silver-sweep). Sub-line at 00:11.4: `OF REPS MISS THESE 4 WORDS.` (60px Inter Bold matte white). At 00:12.2, sub-line shrinks and a 10-tile grid renders below: 9 dim Zoom-style tile placeholders + 1 lit tile in the center-bottom row. The lit tile gets a subtle chrome glow + a `YOU` chrome stamp at 00:13.0.
- **Visual primitives** — `chrome-text-sweep` · 10-tile grid (rendered as 10 `glass-card` instances in a 5×2 layout, 9 with brightness 0.3, 1 with brightness 1.0 + chrome glow) · `radial-glow` behind the lit tile
- **Motion direction** — `70%` entry: scale 1.2 → 1.0 + silver sweep over 0.8s, `power4.out`. Sub-line: standard text-pop. Tile grid: cascade reveal (each tile opacity 0 → final opacity over 0.15s, staggered 0.05s, total 0.55s). Lit tile chrome glow: opacity 0 → 1 over 0.4s with delay matched to its position in the cascade. `YOU` stamp on lit tile: scale 0.85 → 1.0 over 0.25s, `back.out(1.6)`.
- **SFX cue** — `air-swoosh.wav` at 00:10.4 · `sub-impact.wav` at 00:10.8 (sweep peak) · `tap-bright.wav` at 00:11.4 (sub-line) · `tap-low.wav` ×9 during cascade (the dim tiles — quiet) · `glass-chime.wav` at 00:12.6 (lit tile light-up) · `sub-impact.wav` at 00:13.0 (YOU stamp)
- **⚠ Policy fallback:** if `70%` flagged, swap to `MOST REPS MISS THESE 4 WORDS.` (chrome 92px).

### Scene S4 — `00:14–00:18` — iPhone 17 + Tonvo BUYING SIGNAL card

- **VO line** (Ava Neural) — "They keep selling features. To a buyer who's already bought. Tonvo flags the signal. You ask. Deal closes."
- **On-screen kinetic text** — iPhone 17 mockup lands center at 00:14.2 (340px). Inside the iPhone screen, Tonvo glass card pulses up: **`BUYING SIGNAL — ask for the close now.`** (48px Inter Medium chrome, on glass-blur). The card subtly pulses 3x (scale 1.0 → 1.04 → 1.0 every 0.8s) to read as urgent.
- **Visual primitives** — `iphone-17-mockup` · `demo-capture-cut` (Zoom panel inside) · `glass-card` (Tonvo prompt with pulse loop)
- **Motion direction** — iPhone entry: scale 0.94 → 1.0 + rotateY -3° → 0° over 0.6s, `power3.out`. Tonvo card: translateY 80px → 0 + opacity 0 → 1 over 0.4s at 00:14.8, `expo.out`. Pulse loop: 3 cycles of 0.8s each, sine ease.
- **SFX cue** — `air-swoosh.wav` at 00:14.2 (iPhone arrival) · `detect-ping.wav` at 00:14.8 (Tonvo card surfaces) · `tap-bright.wav` ×3 at 00:15.6 / 00:16.4 / 00:17.2 (pulse cycles)
- **Tonvo glass card?** YES.

### Scene S5 — `00:18–00:21` — Closed-won payoff

- **VO line** — _(none)_
- **On-screen kinetic text** — glass card replaces iPhone: `CLOSED · $52K` (140px Inter Bold chrome silver-sweep on `$52K`). _Fallback: `CLOSED · DEAL`._
- **Visual primitives** — `glass-card` · `chrome-text-sweep` on dollar
- **Motion direction** — same as brief 01/02 S5.
- **SFX cue** — `glass-chime.wav` at 00:18.2 · `tap-bright.wav` at 00:19.0 · music swells +4dB

### Scene S6 — `00:21–00:25` — CTA + slogan

- **VO line** — _(none)_
- **On-screen kinetic text** — Tonvo logo + `Never miss a word with Tonvo` + CTA `Try Free → tonvo.co` + micro `30s setup · no card`
- **Visual primitives** — existing CTA stack
- **Motion direction** — same as brief 01/02 S6
- **SFX cue** — `air-swoosh.wav` at 00:21.2 · `text-pop.wav` at 00:21.7 · `tap-bright.wav` at 00:22.4 · `glass-chime.wav` tail at 00:24.0

---

## 3. Audio Track

### VO
- **EN master:** EdgeTTS **Ava Neural**, rate -4%. Segments: `assets/audio/closing-03/s1-s4.mp3`.
- **FR variant:** EdgeTTS **Denise Neural**, rate -4%. Under `assets/audio/closing-03-fr/`.

### SSML pacing
- **S1 + S2:** the synthesized buyer line must finish (00:03.6 / 00:07.6) before the card flips to `= YES.` at 00:04.4 / 00:08.4 — that 0.8s gap is the cognitive beat where the viewer realizes the question WAS the yes. SSML pacing: synthesized buyer voice at rate -2% with natural sentence-end pause built in.
- **S3:** SSML `<break time="600ms"/>` before "70% of reps don't" so the number's silver-sweep lands clean under the spoken word.

### Synthesized buyer lines
- Voice: EdgeTTS **Christopher Neural** (EN) / **Henri Neural** (FR).
- Files: `assets/audio/closing-03/buyer_signal_1.mp3`, `buyer_signal_2.mp3` + FR equivalents.
- All filenames + commit messages carry `[dramatization]` tag.

### Music bed
- `tense-cinematic.mp3` at -18dB base.
- Ducking:
  - 00:00–00:02: -14dB (hook)
  - 00:02–00:06: -20dB (buyer line in S1)
  - 00:06–00:10: -20dB (buyer line in S2)
  - 00:10–00:14: **-12dB swell** (70% stat is the pride climax)
  - 00:14–00:18: -16dB
  - 00:18–00:21: **-14dB swell** (win)
  - 00:21–00:25: -18dB
  - 00:25: fade 250ms

### SFX cue sheet
| Time | Cue |
|---|---|
| 00:00.2 | sub-impact.wav |
| 00:00.0 | reverse-lift.wav (leading into 00:00) |
| 00:01.0 | tap-bright.wav |
| 00:01.4 | strike.wav |
| 00:02.4 | tap-mid.wav |
| 00:04.4 | air-swoosh.wav |
| 00:04.7 | sub-impact.wav |
| 00:06.4 | tap-mid.wav |
| 00:08.4 | air-swoosh.wav |
| 00:08.7 | sub-impact.wav |
| 00:10.4 | air-swoosh.wav |
| 00:10.8 | sub-impact.wav |
| 00:11.4 | tap-bright.wav |
| 00:12.0–00:12.55 | tap-low.wav ×9 (tile cascade, quiet) |
| 00:12.6 | glass-chime.wav (lit tile) |
| 00:13.0 | sub-impact.wav (YOU stamp) |
| 00:14.2 | air-swoosh.wav |
| 00:14.8 | detect-ping.wav |
| 00:15.6 / 00:16.4 / 00:17.2 | tap-bright.wav (pulse cycles) |
| 00:18.2 | glass-chime.wav |
| 00:19.0 | tap-bright.wav |
| 00:21.2 | air-swoosh.wav |
| 00:21.7 | text-pop.wav |
| 00:22.4 | tap-bright.wav |
| 00:24.0 | glass-chime.wav |

All from `assets/audio/sfx-apple/`. No new SFX.

---

## 4. iPhone 17 Mockup Direction

- **Scene using it:** S4 only (00:14–00:18).
- **Component:** `IPhone17Mockup`.
- **Dimensions:** 340px wide (9:16) / 280px wide (1:1). rotateX 4° / rotateY -2°.
- **Screen content source:** **NEW sub-clip** of `assets/demo-session.mp4`. **Specific source timecode:** `00:10.0–00:14.0` (4s window showing the in-app Tonvo signal card surfacing on a Zoom panel). Save as `assets/demo-session-signal03.mp4`.
- **Tonvo glass card overlay:** `BUYING SIGNAL — ask for the close now.` (DOM overlay, not baked, for FR swap).
- Card pulses 3× to read as urgent in-the-moment alert. Pulse on the WHOLE card, not just the text.

---

## 5. Asset Manifest

| Asset | Path | Status |
|---|---|---|
| Master template fork | `Tonvo-Ad-HF/index.html` | EXISTS — fork to `Tonvo-Ad-HF-closing-03/` |
| iPhone 17 mockup | inline in Ad11 | EXISTS |
| Demo capture sub-clip | `assets/demo-session-signal03.mp4` (4s extract @ 00:10–00:14) | **NEW — ffmpeg trim** |
| Logo | `assets/logo-tonvo-remove.png` | EXISTS |
| Music | `assets/audio/tense-cinematic.mp3` | EXISTS |
| SFX | `assets/audio/sfx-apple/*.wav` | EXISTS |
| VO EN | `assets/audio/closing-03/s1-s4.mp3` | **NEW — Ava Neural** |
| VO FR | `assets/audio/closing-03-fr/s1-s4.mp3` | **NEW — Denise Neural** |
| Synthesized buyer lines EN | `assets/audio/closing-03/buyer_signal_1.mp3` + `buyer_signal_2.mp3` | **NEW — Christopher Neural** |
| Synthesized buyer lines FR | `assets/audio/closing-03-fr/buyer_signal_1.mp3` + `buyer_signal_2.mp3` | **NEW — Henri Neural** |

**No new primitives.** The 9-vs-1 tile grid in S3 is rendered as a layout of existing `glass-card` instances — no new component.

---

## 6. Reformat Notes — 1:1 from 9:16

| Scene | 9:16 → 1:1 delta |
|---|---|
| S0 | Line 1 font drops 180px → 150px. Line 2 stays. Re-center vertically. |
| S1 | Glass card holds, but flip animation in 1:1 needs reduced flip-perspective (`perspective: 1200px → 900px`) to keep the back-face readable. Card max-width 920px → 880px. |
| S2 | Same delta as S1. |
| S3 | **REBUILD for 1:1.** The 5×2 tile grid exits the 1:1 crop horizontally. Rebuild as **3×4 grid (12 cells, 11 dim + 1 lit)** OR keep 10 tiles as a **2×5 vertical grid (2 wide, 5 tall)**. Recommended: 2×5 vertical — keeps the "you are 1 of 10" math intact and fits 1:1 cleanly. Lit tile at row 4 column 1. `70%` hero font drops 320px → 256px. |
| S4 | iPhone width 340px → 280px. Tonvo card font 48px → 40px. |
| S5 | `$52K` font 140px → 120px. |
| S6 | Standard CTA stack downsize. |

**Total duration in 1:1:** 24s (drop 1s of S3 tile cascade — tighten stagger from 0.05s to 0.03s).

---

## 7. Risk Notes — Meta policy gates

- **`70% of reps miss the 4 words` claim (S3 hero):** flagged in copywriter handoff. **Fallback:** `MOST REPS MISS THESE 4 WORDS.` (chrome 92px, no number). Re-render only S3.
- **`$52K` closed-won (S5):** flagged. **Fallback:** `CLOSED · DEAL`.
- **Synthesized buyer voice lines:** `[dramatization]` tag retained in filenames + commit. Two lines this brief (more dramatization volume than briefs 01/02/04) — flag this in commit message for downstream audit.
- **No verification load-bearer in this ad.** (Brief 04 carries that.)

---

## 8. Production order recommendation (in cross-brief context)

This brief is **build #2 of the closing sprint** (right after #1 Count to 7):
- 1.5 HF-days — tied with #1 / #4 for lightest invention.
- Builds on the visual language validated by brief 01 but doesn't reuse the `seven-second-counter` primitive (so it's the cleanest test of "does the chrome+iPhone language work for a pride-coded message?" without confounding from the counter mechanic).
- Second to ship so we can A/B test ICP-1 shame (brief 01) vs ICP-2 pride (brief 03) at the signup event in week 1 — this is the core test the strategist called out (`closing-sprint-angles.md` §Why the ranking, point 3).

---

## 9. Anti-pattern callout

**Do NOT:**
- Show a face. Lane A faceless. The "top rep" in this ad is never a person — she's the lit tile, the chrome glow, the implied identity. No silhouette, no avatar, no stock.
- Render the lit tile as a generic green checkmark or color accent. Keep it in the chrome/glass palette: chrome silver-sweep glow + `YOU` stamp. No color outside the palette.
- Use any CTA other than `Try Free → tonvo.co`.
- Drift into "Tonvo trains you to be a top rep." This is wrong. Tonvo SURFACES the signal in real time — the viewer is already capable, just missing the prompt. The pride register dies if the ad says "we'll teach you."
- Frame the 9-vs-1 split as "9 reps fail, 1 rep wins." That's loss-aversion framing. This ad is pride: "9 reps miss, you don't." The lit tile IS the viewer. Reverse from brief 01's split.
- Show the buyer's face or panel as anything other than a synthesized waveform + quote-card. No Zoom-tile mockup of a "buyer" — the buyer exists only as voice + glass card.

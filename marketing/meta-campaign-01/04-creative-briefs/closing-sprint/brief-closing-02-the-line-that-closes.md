# Brief Closing-02 — The Line That Closes

_Creative Director: Claude Opus · Date: 2026-05-14 · Status: NEW · Sprint: closing-sprint · Source copy: `03-copy/closing-copy.md` §Angle #2_

---

## 1. Header

| Field | Value |
|---|---|
| **Angle name** | The Line That Closes |
| **Close-moment subject** | The killer objection ("send me pricing" / "I need to think" / "let me check with my team") |
| **Primary ICP** | ICP-1 — Quota-Slipping AE |
| **Secondary ICP** | ICP-2 |
| **Emotional register** | Relief (the line exists, you just don't have it loaded yet) |
| **Hook ID lead** | `#2.2` — "'Send me pricing' = you already lost." (top-7 rank #2) |
| **Format master** | 1080×1920 (9:16 Reels/Stories) |
| **Format reformat** | 1080×1080 (1:1 Feed) |
| **Total duration** | 25s master / 24s reformat |
| **Production estimate** | **2.0 HF-days** (per strategist — densest build of the four because of the demo-capture cut at S4) |

**Non-negotiable load-bearer:** the live mirror-rebuttal surfaces ON-SCREEN inside the iPhone 17 mockup at S4 BEFORE the synthesized buyer voice finishes the objection. The text-card-precedes-spoken-line beat is the Cluely-pattern lift from `#swipe-01` (without the cheat framing). If that ordering inverts, the ad reads as "summary tool" instead of "live copilot."

---

## 2. Scene Map (time-coded)

### Scene S0 — `00:00–00:02` — Hook stamp + RIP

- **VO line** — _(none — text cold-open)_
- **On-screen kinetic text** — Black frame at 00:00.0. Glass card snaps in center at 00:00.2: `'Send me pricing.'` (monospace font, italic, 92px, white on glass). Chrome equals sign appears beside it at 00:00.8: `=`. Red stamp lands over the glass card at 00:01.2: `YOU ALREADY LOST` (96px Inter Bold, red `#dc2626`, rotated -3°, stamp-style scale-in).
- **Visual primitives** — `glass-card` · `chrome-text-sweep` (on `=` only) · stamp overlay (existing red-stamp from Ad11 strike system)
- **Motion direction** — glass card: translateY 30px → 0 + opacity 0 → 1 over 0.4s, `expo.out`. `=` sign: scale 0 → 1 over 0.3s, `back.out(2)`. Red stamp: scale 1.3 → 1.0 + opacity 0 → 1 over 0.25s, `power3.out`, with a 1-frame `scaleX(1.05)` overshoot.
- **SFX cue** — `sub-impact.wav` at 00:00.2 (glass card land) · `tap-bright.wav` at 00:00.8 (= sign) · `strike.wav` at 00:01.2 (RIP stamp)

### Scene S1 — `00:02–00:06` — Three deal-killers stack

- **VO line** (Ava Neural, EN) — "'Send me the pricing.' Three words. The deal is dead and you don't know it yet. Same with 'I need to think about it.' Same with 'let me check with my team.'"
- **On-screen kinetic text** — three glass cards drop in sequence, vertical stack:
  - 00:02.4 — `"I need to think."` + chrome tag `DEAL-KILLER`
  - 00:03.4 — `"Let me check with my team."` + chrome tag `DEAL-KILLER`
  - 00:04.4 — `"Send me pricing."` + chrome tag `DEAL-KILLER`
- **Visual primitives** — `glass-card` × 3 · `chrome-text-sweep` on each `DEAL-KILLER` tag
- **Motion direction** — each card: translateX -40px → 0 + opacity 0 → 1 over 0.35s, `power3.out`. Stagger 1.0s between cards. `DEAL-KILLER` tag: scale 0.85 → 1.0 over 0.25s with 0.15s delay after card lands.
- **SFX cue** — `tap-mid.wav` at 00:02.4, 00:03.4, 00:04.4 (each card land) · `tap-low.wav` 0.15s after each card (tag stamp) · music duck -3dB held

### Scene S2 — `00:06–00:11` — 41% stat hero

- **VO line** (Ava Neural) — "Three objections kill 41% of demos. One rebuttal closes each."
- **On-screen kinetic text** — three cards from S1 dim to 0.4 brightness at 00:06.0. Chrome hero number sweeps in center-frame at 00:06.4: `41%` (320px Inter Bold, chrome silver-sweep mask). Sub-line drops at 00:07.4: `OF DEMOS DIE HERE.` (72px Inter Bold matte white). Tertiary line at 00:08.4: `3 lines kill them.` (48px Inter Regular italic muted).
- **Visual primitives** — `chrome-text-sweep` · `glass-card` (background dim of S1 stack) · `radial-glow` behind `41%`
- **Motion direction** — `41%` entry: scale 1.2 → 1.0 + chrome sweep clip-path L→R over 0.8s, `power4.out`. Sub-line: opacity 0 → 1 + translateY 12px → 0 over 0.35s, `power3.out`. Tertiary line: same easing, 1.0s later.
- **SFX cue** — `air-swoosh.wav` at 00:06.4 (number swoop in) · `sub-impact.wav` at 00:06.8 (silver sweep peak) · `tap-bright.wav` at 00:07.4 (sub-line) · `tap-mid.wav` at 00:08.4 (tertiary)
- **⚠ Policy fallback:** per §Risk, if `41%` is flagged, replace with `KILL MOST OF YOUR DEMOS.` (chrome 92px, no number). Same motion, no re-render of other scenes.

### Scene S3 — `00:11–00:16` — iPhone 17 + demo capture + mirror surfaces

- **VO line** (Ava Neural) — "You don't have to memorize them. Tonvo surfaces the exact line on screen, while the buyer is still talking."
- **Buyer audio dramatized:** synthesized buyer voice _"Honestly, I need to think about it."_ plays 00:11.6–00:13.4. Tag: `[dramatization — synthesized buyer line, not a real call clip]` per Resolution-1.
- **On-screen kinetic text** — iPhone 17 mockup lands center at 00:11.2 (340px wide on 9:16). Demo capture rolls inside the iPhone screen. At 00:12.4 (the moment the buyer says "think about it"), Tonvo glass card slides UP from the bottom of the iPhone screen: **`Mirror: 'think about it'? What's the part you'd want to think through?`** (44px Inter Medium chrome heading on glass-blur, 2 lines).
- **Visual primitives** — `iphone-17-mockup` · `demo-capture-cut` (existing `demo-session.mp4` excerpt) · `glass-card` (Tonvo prompt overlay)
- **Motion direction** — iPhone entry: scale 0.94 → 1.0 + rotateY -3° → 0° over 0.6s, `power3.out`. Tonvo card: translateY 80px → 0 + opacity 0 → 1 over 0.4s, `expo.out`. **Card surfaces BEFORE buyer finishes line** (card lands at 00:12.4; buyer audio ends 00:13.4). This 1.0s gap is the load-bearing beat — the viewer reads the rebuttal in their head before the buyer is done objecting.
- **SFX cue** — `air-swoosh.wav` at 00:11.2 (iPhone arrival) · `detect-ping.wav` at 00:12.4 (Tonvo card surfaces — this is the "Tonvo caught it" stamp) · music duck -6dB from 00:11.6–00:13.4 (so buyer audio reads clean)
- **Tonvo glass card?** YES — this is the product moment.

### Scene S4 — `00:16–00:20` — Counter ticks: 1 objection → 1 rebuttal → 1 close

- **VO line** (Ava Neural) — "Same buyer. Same objection. One line different. Deal closes."
- **On-screen kinetic text** — three-step chrome counter renders horizontally: `1 objection → 1 rebuttal → 1 close`. Each token reveals in sequence at 00:16.2 / 00:17.0 / 00:17.8. Final state holds 00:17.8 → 00:20.0.
- **Visual primitives** — `chrome-text-sweep` on each token · `glass-card` underlay for the row
- **Motion direction** — each token: opacity 0 → 1 + scale 0.95 → 1.0 over 0.3s, `power3.out`. Arrow `→` glyphs animate after each token lands: `scaleX(0) → scaleX(1)` over 0.2s.
- **SFX cue** — `tap-bright.wav` × 3 at 00:16.2, 00:17.0, 00:17.8 · `sub-impact.wav` at 00:17.8 (final "close" stamp)

### Scene S5 — `00:20–00:23` — Closed-won payoff

- **VO line** — _(none — music swells)_
- **On-screen kinetic text** — glass card replaces counter at 00:20.2: `CLOSED · $34K` (140px Inter Bold chrome silver-sweep on `$34K`). _Fallback per §Risk: `CLOSED · DEAL` if dollar gets policy-flagged._
- **Visual primitives** — `glass-card` · `chrome-text-sweep` on dollar amount
- **Motion direction** — entry: scale 0.9 → 1.0 + opacity 0 → 1 over 0.5s, `back.out(1.6)`. Silver sweep on `$34K`: 0.8s with 0.2s delay, `power2.inOut`.
- **SFX cue** — `glass-chime.wav` at 00:20.2 · `tap-bright.wav` at 00:21.0 (sweep peak) · music swells +4dB

### Scene S6 — `00:23–00:25` — CTA + slogan

- **VO line** — _(none — visual CTA only)_
- **On-screen kinetic text** — Tonvo logo (128px) + `Never miss a word with Tonvo` (italic 56px) + CTA pill `Try Free → tonvo.co` + micro `30s setup · no card`
- **Visual primitives** — existing CTA stack from Ad11
- **Motion direction** — same as brief 01 S6 (logo back-out scale-in, slogan translateY, CTA pill pulse loop)
- **SFX cue** — `air-swoosh.wav` at 00:23.2 · `text-pop.wav` at 00:23.7 · `tap-bright.wav` at 00:24.2 · `glass-chime.wav` tail at 00:24.7

---

## 3. Audio Track

### VO
- **EN master:** EdgeTTS **Ava Neural**, rate -4%. Segments: `assets/audio/closing-02/s1_three.mp3`, `s2_stat.mp3`, `s3_surface.mp3`, `s4_close.mp3`.
- **FR variant:** EdgeTTS **Denise Neural**, rate -4%. Segments under `assets/audio/closing-02-fr/`.

### SSML pacing
- **S1:** SSML `<break time="500ms"/>` between the three quoted objections so each lands cleanly under its glass card animation.
- **S3 critical beat:** the buyer audio at 00:11.6–00:13.4 (synthesized line) needs the Tonvo card to surface at 00:12.4 — buyer must be MID-SENTENCE when the card lands. SSML the synthesized buyer line to break at the comma: _"Honestly, <break time='300ms'/> I need to think about it."_ The Tonvo card lands during the break.

### Synthesized buyer line
- **Voice:** EdgeTTS **Christopher Neural** (male, EN) / **Henri Neural** (male, FR).
- **File:** `assets/audio/closing-02/buyer_objection.mp3` · FR: `assets/audio/closing-02-fr/buyer_objection.mp3`
- Filename + commit message must include `[dramatization]` tag.

### Music bed
- **Track:** `tense-cinematic.mp3` at -18dB base.
- **Ducking:**
  - 00:00–00:02 (S0): -14dB (hook punch)
  - 00:02–00:06 (S1): -18dB
  - 00:06–00:11 (S2): **-12dB swell** (the 41% stat is the visual climax of the first half)
  - 00:11–00:16 (S3): -22dB (buyer audio rules)
  - 00:16–00:20 (S4): -16dB
  - 00:20–00:23 (S5): **-14dB swell** (win)
  - 00:23–00:25 (S6): -18dB
  - 00:25: fade 250ms

### SFX cue sheet
| Time | Cue |
|---|---|
| 00:00.2 | sub-impact.wav |
| 00:00.8 | tap-bright.wav |
| 00:01.2 | strike.wav |
| 00:02.4 / 00:03.4 / 00:04.4 | tap-mid.wav (×3 card lands) |
| 00:02.55 / 00:03.55 / 00:04.55 | tap-low.wav (×3 DEAL-KILLER tags) |
| 00:06.4 | air-swoosh.wav |
| 00:06.8 | sub-impact.wav |
| 00:07.4 | tap-bright.wav |
| 00:08.4 | tap-mid.wav |
| 00:11.2 | air-swoosh.wav (iPhone arrival) |
| 00:12.4 | detect-ping.wav (Tonvo card surfaces) |
| 00:16.2 / 00:17.0 / 00:17.8 | tap-bright.wav (×3) |
| 00:17.8 | sub-impact.wav |
| 00:20.2 | glass-chime.wav |
| 00:21.0 | tap-bright.wav |
| 00:23.2 | air-swoosh.wav |
| 00:23.7 | text-pop.wav |
| 00:24.2 | tap-bright.wav |
| 00:24.7 | glass-chime.wav |

All from `assets/audio/sfx-apple/`. No new SFX.

---

## 4. iPhone 17 Mockup Direction

- **Scene using it:** S3 only (00:11–00:16).
- **Component:** `IPhone17Mockup` (per memory rule).
- **Dimensions:** 340px wide (9:16) / 280px wide (1:1). Rotation: rotateX 4°, rotateY -2°.
- **Screen content source:** **NEW sub-clip** of `assets/demo-session.mp4` showing a Zoom-style buyer panel. **Specific source timecode:** `00:02.0–00:07.0` (5s window where the in-app call panel is most readable). Save as `assets/demo-session-line02.mp4` (5s, no audio).
- **Tonvo glass card overlay:** `Mirror: 'think about it'? What's the part you'd want to think through?` — rendered as DOM overlay ON TOP of the iPhone screen video (not baked in, for FR text swap).
- **Card lands at 00:12.4 — BEFORE buyer voice ends at 00:13.4.** Do not invert this order.

---

## 5. Asset Manifest

| Asset | Path | Status |
|---|---|---|
| Master template fork | `Tonvo-Ad-HF/index.html` (Ad11) | EXISTS — fork to `Tonvo-Ad-HF-closing-02/` |
| iPhone 17 mockup | inline in Ad11 | EXISTS |
| Demo capture sub-clip | `assets/demo-session-line02.mp4` (5s extract from `demo-session.mp4` @ 00:02–00:07) | **NEW — ffmpeg trim only, no rebuild** |
| Logo | `assets/logo-tonvo-remove.png` | EXISTS |
| Music | `assets/audio/tense-cinematic.mp3` | EXISTS |
| SFX | `assets/audio/sfx-apple/*.wav` | EXISTS |
| VO EN | `assets/audio/closing-02/s1-s4.mp3` (4 files) | **NEW — EdgeTTS Ava Neural** |
| VO FR | `assets/audio/closing-02-fr/s1-s4.mp3` (4 files) | **NEW — EdgeTTS Denise Neural** |
| Synthesized buyer line EN | `assets/audio/closing-02/buyer_objection.mp3` | **NEW — Christopher Neural** |
| Synthesized buyer line FR | `assets/audio/closing-02-fr/buyer_objection.mp3` | **NEW — Henri Neural** |

**No new primitives.** Reuses `glass-card`, `chrome-text-sweep`, `iphone-17-mockup`, `demo-capture-cut`, `radial-glow`, `grid-bg` — all existing in Ad11 stack.

---

## 6. Reformat Notes — 1:1 from 9:16

| Scene | 9:16 → 1:1 delta |
|---|---|
| S0 | Glass card centers fine. `=` sign holds. RIP stamp font drops 96px → 80px. |
| S1 | Three-card stack: vertical stack is the same shape in 1:1; reduce card max-width 920px → 880px and gap 18px → 14px (same delta as brief 01 S2). |
| S2 | `41%` chrome hero font drops 320px → 256px. Sub-line 72px → 60px. Tertiary stays 48px. |
| S3 | iPhone 17 width drops 340px → 280px. Tonvo card inside iPhone keeps same relative proportions. **Tonvo card text may need a 1-line wrap** in 1:1 due to narrower iPhone screen — drop card font 44px → 38px to keep 2 lines max. |
| S4 | The horizontal `1 objection → 1 rebuttal → 1 close` row exits the 1:1 crop on the right edge. **REBUILD: stack vertically in 1:1** — three rows top-to-bottom, each with `↓` arrow between them instead of `→`. Same easing, same SFX. This is the only scene that needs a layout rebuild. |
| S5 | `$34K` font drops 140px → 120px. |
| S6 | Standard CTA stack downsize (same as brief 01 S6 in 1:1). |

**Total duration in 1:1:** 24s (1s tighter — drop the S2 tertiary line `3 lines kill them.` hold in 1:1, since the `41%` already does the work).

---

## 7. Risk Notes — Meta policy gates

- **`41% of demos die here` claim (S2 hero):** flagged in copywriter handoff. **Fallback:** if Meta rejects, swap S2 hero to `KILL MOST OF YOUR DEMOS.` (chrome 92px). Re-render only S2.
- **`$34K` closed-won (S5):** flagged. **Fallback:** `CLOSED · DEAL` (strip dollar, keep CLOSED stamp).
- **Synthesized buyer voice:** dramatization tag retained in filename + commit. No on-screen disclaimer required.
- **`Tonvo surfaces the exact line` (VO S3):** product capability claim. This IS what Tonvo does today (real-time rebuttal surfacing per landing copy) — no fallback required, but if media-buyer reports a policy flag, soften to `Tonvo suggests the exact line`.

---

## 8. Production order recommendation (in cross-brief context)

This brief is **build #3 of the closing sprint** (after #1 Count to 7 and #3 Signal You Missed):
- 2.0 HF-days — densest build. Needs the demo-capture-cut sub-clip extraction AND the precise text-card-before-spoken-line timing in S3.
- The Tonvo product moment (Tonvo card surfaces in S3) is more elaborate than briefs 01 / 03 / 04 because it's the only one where the rebuttal text is the load-bearing message (not just "HOLD" or "ASK NOW" — it's the actual mirror line).
- Build last among the easier three so the producer has rhythm on the closing-sprint visual language before tackling the densest scene.

---

## 9. Anti-pattern callout

**Do NOT:**
- Show a face. Lane A faceless. The buyer is a synthesized voice + a glass-card quote, never a Zoom-tile silhouette.
- Lift Cluely's "cheat" framing. The mirror rebuttal is sales craft, not a stealth tool used against the buyer. The Tonvo card text reads as coach-in-the-ear, not as a script the buyer can't see.
- Use any CTA other than `Try Free → tonvo.co`.
- Drift into demo / onboarding / discovery copy. This ad lives entirely in the 30s after the buyer says "I need to think." Don't show Tonvo's signup flow, don't show the dashboard, don't show meeting recap. Only the in-call surface.
- Invert the S3 ordering: Tonvo card MUST land before the buyer audio ends. If you flip the order, the ad reads "summary tool" not "live copilot" — and the entire angle dies.
- Replace the synthesized buyer line with stock-effect "buyer audio" SFX. The line must be a clean spoken sentence the viewer can read on screen + hear in audio. SFX-only fails comprehension.

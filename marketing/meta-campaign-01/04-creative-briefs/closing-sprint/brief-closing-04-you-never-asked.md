# Brief Closing-04 — You Never Asked

_Creative Director: Claude Opus · Date: 2026-05-14 · Status: NEW · Sprint: closing-sprint · Source copy: `03-copy/closing-copy.md` §Angle #4_

---

## 1. Header

| Field | Value |
|---|---|
| **Angle name** | You Never Asked |
| **Close-moment subject** | The unasked close (rep talked 47 min, never asked for the deal) |
| **Primary ICP** | ICP-1 — Quota-Slipping AE |
| **Secondary ICP** | ICP-2 |
| **Emotional register** | Loss-aversion |
| **Hook ID lead** | `#1.1` — "47 minutes. You never asked." (top-7 rank #3) |
| **Format master** | 1080×1920 (9:16 Reels/Stories) |
| **Format reformat** | 1080×1080 (1:1 Feed) |
| **Total duration** | 25s master / 24s reformat |
| **Production estimate** | **1.5 HF-days** (per strategist) |

**Non-negotiable load-bearer #1:** the `CALL AUTOPSY` label must be permanently visible on screen (top-bar) from 00:00–00:25. **It is the verification frame.** Without it, the 47-min / 8,412-word / 0-asks data reads as Tonvo telemetry → violates the verification rule. With the label, it reads as illustrative/post-mortem → policy-clean.

**Non-negotiable load-bearer #2:** VO line 4 — _"This isn't a Tonvo measurement. This is the autopsy of every call where you said 'let me follow up' instead of 'let's sign."_ — is the **verification disclaimer**. It MUST be spoken verbatim. **Do NOT cut, trim, or paraphrase in any future trim pass.** This line is the legal/policy load-bearer for the claim numbers.

---

## 2. Scene Map (time-coded)

### Scene S0 — `00:00–00:03` — CALL AUTOPSY label + sub-line

- **VO line** (Ava Neural, EN) — _(none — let the wordmark land in silence for 1.5s, then VO begins at 00:01.5 in S1)_
- **On-screen kinetic text** — **Top-bar permanent label** lands at 00:00.2: `CALL AUTOPSY` (96px Inter Bold chrome silver-sweep, fixed to top of frame, 48px from edge). Sub-line beneath the label lands at 00:01.0: `THE MATH OF A STALLED CALL.` (52px Inter Regular italic muted). **The `CALL AUTOPSY` label PERSISTS through S0–S6 — it never leaves the screen.** Sub-line fades after S0 (00:03.0).
- **Visual primitives** — `chrome-text-sweep` on `CALL AUTOPSY` · top-bar layout · `grid-bg` · `radial-glow` low-opacity behind label
- **Motion direction** — label entry: clip-path silver sweep L→R over 0.6s, `power4.out`. Sub-line: opacity 0 → 1 over 0.4s.
- **SFX cue** — `sub-impact.wav` at 00:00.2 (label stamp) · `reverse-lift.wav` leading into 00:00.0 · `tap-mid.wav` at 00:01.0 (sub-line) · `ambient-rise.wav` -24dB pad under all of S0

### Scene S1 — `00:03–00:07` — Stopwatch races to 47:00 + word count

- **VO line** (Ava Neural) — "Forty-seven minutes on the call. Eight thousand four hundred twelve words. Out of your mouth."
- **On-screen kinetic text** — stopwatch glass card lands center-frame at 00:03.2: chrome digits race `00:00 → 47:00` over 2.0s (fast-tick). Word counter beneath: `WORDS SPOKEN: 8,412` (60px Inter Bold chrome) ticks up from `0 → 8412` in parallel over the same 2.0s.
- **Visual primitives** — `glass-card` (stopwatch) · `seven-second-counter` primitive **reused inverted** (counting UP to 47:00 instead of down/up to 7 — same primitive, different range — defined in brief 01) · `chrome-text-sweep` · `grid-bg`
- **Motion direction** — stopwatch entry: scale 0.92 → 1.0 + opacity 0 → 1 over 0.4s, `power3.out`. Digit racing: GSAP `gsap.to({val: 0}, {val: 47, duration: 2.0, ease: 'power2.out', onUpdate: ...})` with rounded minute display. Word counter parallel: same easing, ends at `8,412`.
- **SFX cue** — `tap-mid.wav` at 00:03.2 (stopwatch land) · rapid `tap-low.wav` ticks every 0.08s during the race (sounds like a fast clock — ~25 ticks total) · `sub-impact.wav` at 00:05.2 (final `47:00` land) · `glass-chime.wav` at 00:05.4 (word count final)

### Scene S2 — `00:07–00:11` — ZERO ASKS hero

- **VO line** (Ava Neural) — "Number of times you asked for the deal: zero."
- **On-screen kinetic text** — stopwatch + word counter dim to 0.4 brightness. Chrome hero text lands center at 00:07.4: `TIMES "THE ASK" APPEARED:` (60px Inter Regular). Below it, massive chrome zero at 00:08.0: `0` (480px Inter Bold chrome silver-sweep, pulses 3× over the scene with brightness lifts 1.0 → 1.15 → 1.0).
- **Visual primitives** — `chrome-text-sweep` · `radial-glow` red-tinted behind the `0` (only colored accent in the ad — the radial-glow goes red `#dc2626 @ 0.15 opacity` to suggest the void)
- **Motion direction** — eyebrow line: opacity 0 → 1 + translateY 8px → 0 over 0.3s, `power3.out`. `0`: scale 1.3 → 1.0 + silver sweep over 0.8s, `power4.out`. Pulse loop: 3× of 0.6s each, sine ease.
- **SFX cue** — `air-swoosh.wav` at 00:07.4 · `sub-impact.wav` at 00:08.0 (zero land) · `tap-bright.wav` ×3 at 00:08.8 / 00:09.4 / 00:10.0 (pulse cycles)

### Scene S3 — `00:11–00:15` — "Want to get started?" never-said strikethrough

- **VO line** (Ava Neural) — "Not a hard sell. Not a pushy ask. One sentence. 'Want to get started?' Never came out."
- **Rep dramatized audio:** synthesized rep voice _"Want to get started?"_ plays 00:12.0–00:13.0. Tag: `[dramatization — synthesized rep line, not a real call clip]`.
- **On-screen kinetic text** — glass card lands center at 00:11.4: `"Want to get started?"` (84px Inter Medium italic). At 00:13.2 a thick red strikethrough sweeps L→R across the quote. Below the strikethrough, chrome stamp at 00:13.6: `NEVER SAID.` (72px Inter Bold matte white).
- **Visual primitives** — `glass-card` · red strikethrough sweep (existing Ad11 strike system) · `chrome-text-sweep` on `NEVER SAID.`
- **Motion direction** — card entry: translateY 30px → 0 + opacity 0 → 1 over 0.4s, `expo.out`. Strikethrough: `scaleX(0) → scaleX(1)` over 0.5s, `power3.inOut`. `NEVER SAID.` stamp: scale 0.85 → 1.0 over 0.25s, `back.out(1.6)`.
- **SFX cue** — `tap-mid.wav` at 00:11.4 · `strike.wav` at 00:13.2 (strikethrough) · `sub-impact.wav` at 00:13.6 (NEVER SAID stamp)

### Scene S4 — `00:15–00:19` — Timeline + Tonvo iPhone prompt at MIN 32 + **VERIFICATION DISCLAIMER LINE**

- **VO line** (Ava Neural) — **"This isn't a Tonvo measurement. This is the autopsy of every call where you said 'let me follow up' instead of 'let's sign.' Tonvo flags the moment to ask. At minute 32. While the buyer is still warm."**
- ⚠ **VO load-bearer:** the opening 5 words — _"This isn't a Tonvo measurement."_ — are the verification load-bearer per copywriter Resolution-2. **Do NOT cut, trim, swap, or paraphrase under any pacing pressure.** This is the policy/legal anchor.
- **On-screen kinetic text** — horizontal timeline bar lands at 00:15.2 spanning the lower-center of the frame. Chrome marker pulses at the `32:00` mark (32/47 along the bar, so ~68% from left). At 00:16.0 the iPhone 17 mockup lands above the timeline (280px wide). Tonvo glass card inside iPhone: **`ASK NOW. Buyer is warm.`** (48px Inter Medium chrome on glass-blur).
- **Visual primitives** — timeline bar (rendered as `glass-card` strip with chrome pulse marker) · `iphone-17-mockup` · `glass-card` (Tonvo prompt) · `demo-capture-cut` inside iPhone
- **Motion direction** — timeline entry: opacity 0 → 1 + scaleX 0.95 → 1.0 over 0.4s, `power3.out`. Pulse marker: 3× pulse cycles of 0.6s, sine ease. iPhone entry: scale 0.94 → 1.0 + rotateY -3° → 0° over 0.5s. Tonvo card surface: translateY 60px → 0 + opacity 0 → 1 over 0.4s at 00:16.4.
- **SFX cue** — `tap-mid.wav` at 00:15.2 (timeline land) · `tap-bright.wav` ×3 at 00:15.5 / 00:15.9 / 00:16.3 (marker pulses) · `air-swoosh.wav` at 00:16.0 (iPhone) · `detect-ping.wav` at 00:16.4 (Tonvo card)
- **Tonvo glass card?** YES.

### Scene S5 — `00:19–00:22` — Rewound timeline + closed-won

- **VO line** — _(none — visual payoff)_
- **On-screen kinetic text** — quick cut to a rewound timeline: same bar, but the chrome marker at `32:00` now reads as ASKED. Glass card lands center at 00:19.4: `MIN 32 · ASKED · CLOSED · $61K` (100px Inter Bold chrome with silver-sweep on `$61K`). _Fallback per §Risk: `MIN 32 · ASKED · CLOSED` (strip dollar)._
- **Visual primitives** — `glass-card` · `chrome-text-sweep` on dollar
- **Motion direction** — timeline rewind: chrome marker animates from 32% to 100% over 0.3s, then back to 32% over 0.2s (the "rewind" beat). Glass card: scale 0.9 → 1.0 + opacity 0 → 1 over 0.5s, `back.out(1.6)`. Silver sweep on `$61K`: 0.8s with 0.2s delay.
- **SFX cue** — `reverse-lift.wav` at 00:19.0 (rewind cue) · `glass-chime.wav` at 00:19.4 · `tap-bright.wav` at 00:20.2 (sweep peak) · music swells +4dB

### Scene S6 — `00:22–00:25` — CTA + slogan (CALL AUTOPSY label fades)

- **VO line** — _(none)_
- **On-screen kinetic text** — `CALL AUTOPSY` top-bar label fades out at 00:22.0 over 0.4s (it's served its purpose). Standard CTA stack lands center: Tonvo logo (128px) + `Never miss a word with Tonvo` (italic 56px) + CTA pill `Try Free → tonvo.co` + micro `30s setup · no card`
- **Visual primitives** — existing CTA stack
- **Motion direction** — same as briefs 01/02/03 S6
- **SFX cue** — `air-swoosh.wav` at 00:22.2 · `text-pop.wav` at 00:22.7 · `tap-bright.wav` at 00:23.4 · `glass-chime.wav` tail at 00:24.5

---

## 3. Audio Track

### VO
- **EN master:** EdgeTTS **Ava Neural**, rate -4%. Segments: `assets/audio/closing-04/s1_47min.mp3`, `s2_zero.mp3`, `s3_never.mp3`, **`s4_autopsy.mp3` (the verification disclaimer line — flag in filename)**.
- **FR variant:** EdgeTTS **Denise Neural**, rate -4%. Same structure under `assets/audio/closing-04-fr/`.

### SSML pacing — load-bearing
- **S4 verification disclaimer:** SSML `<break time="400ms"/>` after _"This isn't a Tonvo measurement."_ so the line lands distinctly before the autopsy explanation. The phrase MUST be audible and unmistakable. If the producer A/B tests faster VO pacing in week 2, this break stays.
- **S1:** SSML "Forty-seven minutes" spelled out (not "47") because the digit "47" reads too short when spoken — the elongated phrase matches the stopwatch racing to 47:00 visually.
- **S2:** SSML `<break time="600ms"/>` before "zero" to land it under the chrome `0` reveal.

### Synthesized rep line
- Voice: EdgeTTS **Christopher Neural** (EN) / **Henri Neural** (FR). Synthesized line: _"Want to get started?"_
- File: `assets/audio/closing-04/rep_ask.mp3` · FR: `assets/audio/closing-04-fr/rep_ask.mp3`
- Filename + commit tag: `[dramatization]`.

### Music bed
- `tense-cinematic.mp3` at -18dB base.
- Ducking:
  - 00:00–00:03 (S0): -16dB (CALL AUTOPSY label punch)
  - 00:03–00:07 (S1): **-12dB swell** (stopwatch racing is the tension peak of the first half)
  - 00:07–00:11 (S2): -18dB (let `0` breathe)
  - 00:11–00:15 (S3): -18dB
  - 00:15–00:19 (S4): **-22dB** (verification disclaimer needs clean VO read)
  - 00:19–00:22 (S5): **-14dB swell** (win)
  - 00:22–00:25 (S6): -18dB
  - 00:25: fade 250ms

### SFX cue sheet
| Time | Cue |
|---|---|
| 00:00.0 | reverse-lift.wav (leading in) |
| 00:00.2 | sub-impact.wav |
| 00:00.0–00:03.0 | ambient-rise.wav -24dB |
| 00:01.0 | tap-mid.wav |
| 00:03.2 | tap-mid.wav |
| 00:03.2–00:05.2 | tap-low.wav at 0.08s intervals (~25 ticks, fast clock) |
| 00:05.2 | sub-impact.wav (47:00 land) |
| 00:05.4 | glass-chime.wav (word count) |
| 00:07.4 | air-swoosh.wav |
| 00:08.0 | sub-impact.wav (zero land) |
| 00:08.8 / 00:09.4 / 00:10.0 | tap-bright.wav (×3 pulse) |
| 00:11.4 | tap-mid.wav |
| 00:13.2 | strike.wav |
| 00:13.6 | sub-impact.wav (NEVER SAID stamp) |
| 00:15.2 | tap-mid.wav (timeline) |
| 00:15.5 / 00:15.9 / 00:16.3 | tap-bright.wav (×3 marker pulse) |
| 00:16.0 | air-swoosh.wav (iPhone) |
| 00:16.4 | detect-ping.wav (Tonvo card) |
| 00:19.0 | reverse-lift.wav (rewind) |
| 00:19.4 | glass-chime.wav |
| 00:20.2 | tap-bright.wav |
| 00:22.2 | air-swoosh.wav |
| 00:22.7 | text-pop.wav |
| 00:23.4 | tap-bright.wav |
| 00:24.5 | glass-chime.wav |

All from `assets/audio/sfx-apple/`. No new SFX.

---

## 4. iPhone 17 Mockup Direction

- **Scene using it:** S4 only (00:15–00:19).
- **Component:** `IPhone17Mockup` (per memory rule).
- **Dimensions:** 280px wide (smaller than briefs 01/02/03 because the timeline bar shares the lower half of the frame) on 9:16. 240px wide on 1:1. rotateX 4° / rotateY -2°.
- **Screen content source:** **NEW sub-clip** of `assets/demo-session.mp4`. **Specific source timecode:** `00:05.0–00:09.0` (4s window). Save as `assets/demo-session-autopsy04.mp4`.
- **Tonvo glass card overlay:** `ASK NOW. Buyer is warm.` (DOM overlay).

---

## 5. Asset Manifest

| Asset | Path | Status |
|---|---|---|
| Master template fork | `Tonvo-Ad-HF/index.html` | EXISTS — fork to `Tonvo-Ad-HF-closing-04/` |
| iPhone 17 mockup | inline in Ad11 | EXISTS |
| Demo capture sub-clip | `assets/demo-session-autopsy04.mp4` (4s extract @ 00:05–00:09) | **NEW — ffmpeg trim** |
| Logo | `assets/logo-tonvo-remove.png` | EXISTS |
| Music | `assets/audio/tense-cinematic.mp3` | EXISTS |
| SFX | `assets/audio/sfx-apple/*.wav` | EXISTS |
| VO EN | `assets/audio/closing-04/s1-s4.mp3` (4 files, s4_autopsy.mp3 flagged load-bearing) | **NEW — Ava Neural** |
| VO FR | `assets/audio/closing-04-fr/s1-s4.mp3` | **NEW — Denise Neural** |
| Synthesized rep ask EN | `assets/audio/closing-04/rep_ask.mp3` | **NEW — Christopher Neural** |
| Synthesized rep ask FR | `assets/audio/closing-04-fr/rep_ask.mp3` | **NEW — Henri Neural** |

### Primitive reuse: `seven-second-counter` (lifted from brief 01, inverted)

This brief reuses the `seven-second-counter` primitive defined in brief 01, but **inverted** for S1's stopwatch:
- Range: `00:00 → 47:00` instead of `00:01 → 00:07`
- Duration of the race: 2.0s real-time instead of 7.0s tick-by-tick
- Display format: `MM:SS` instead of `SS`
- Same GSAP onUpdate pattern, same chrome silver-sweep font.

No new primitive introduced by brief 04 — confirms brief 01 carries the only new primitive in the sprint.

---

## 6. Reformat Notes — 1:1 from 9:16

| Scene | 9:16 → 1:1 delta |
|---|---|
| S0 | `CALL AUTOPSY` label drops 96px → 72px to fit the narrower top-bar. Sub-line stays. |
| S1 | Stopwatch glass card: 9:16 has stopwatch + word counter stacked vertically (works fine). 1:1: same vertical stack, drop stopwatch font from 140px → 110px and word counter from 60px → 48px. |
| S2 | The chrome `0` at 480px is fine in 9:16 but exits the 1:1 frame vertically. **Drop `0` font 480px → 360px in 1:1.** Pulse loop stays. |
| S3 | Glass card fits. Strikethrough fits. `NEVER SAID.` font 72px → 60px. |
| S4 | **REBUILD for 1:1.** The horizontal timeline bar + iPhone-above-timeline layout exits the 1:1 frame. In 1:1: timeline bar moves to ABOVE the iPhone (compresses to 80% width), and iPhone sits below. Tonvo card overlay stays unchanged inside the iPhone. The pulse marker on the timeline stays at the 32:00 position (still ~68% from left). |
| S5 | `MIN 32 · ASKED · CLOSED · $61K` line exits the 1:1 frame. **Stack vertically in 1:1:** line 1: `MIN 32` (60px) · line 2: `ASKED` (chrome 84px) · line 3: `CLOSED · $61K` (chrome 100px). Same easings, slightly longer reveal (0.6s total instead of 0.5s) to accommodate the stacked beats. |
| S6 | Standard CTA stack downsize. |

**Total duration in 1:1:** 24s (drop 0.5s of S1 stopwatch race + 0.5s of S2 `0` hold).

**`CALL AUTOPSY` top-bar label persists through all scenes in BOTH formats.**

---

## 7. Risk Notes — Meta policy gates

- **`47 min / 8,412 words / 0 asks` numbers:** these are **illustrative numbers**, not Tonvo telemetry. The `CALL AUTOPSY` permanent label + the VO disclaimer line in S4 are the verification load-bearers. Together they make the numbers policy-clean. **Do not remove either.**
- ⚠ **VO disclaimer line in S4 — VERIFICATION LOAD-BEARER — NON-NEGOTIABLE:** _"This isn't a Tonvo measurement. This is the autopsy of every call where you said 'let me follow up' instead of 'let's sign."_ This sentence MUST appear verbatim in every cut, every recut, every trim pass, every reformat. If a future editor proposes shortening S4 for pacing, the cut comes from somewhere else (S1 stopwatch race, S2 zero pulse count) — NOT from this line. Embed in the build's commit message: `[VO line 'This isn't a Tonvo measurement' is policy load-bearing, do not cut]`.
- **`$61K` closed-won (S5):** flagged. **Fallback:** strip `$61K`, render `MIN 32 · ASKED · CLOSED`.
- **Alt headline ready:** if Meta flags the in-ad numbers regardless of the CALL AUTOPSY framing, swap the on-screen S1 stat to `47 min. 0 asks.` (per copywriter alt headline). Re-render only S1.
- **Synthesized rep ask voice:** `[dramatization]` tag retained.

---

## 8. Production order recommendation (in cross-brief context)

This brief is **build #4 of the closing sprint** (after #1, #3, #2):
- 1.5 HF-days — same invention budget as briefs 01/03 but heavier policy-review attention because of the verification load-bearer.
- Builds last because it reuses the `seven-second-counter` primitive proven in brief 01 (inverted for the 47-min stopwatch), and reuses the iPhone 17 + Tonvo glass card pattern from all three prior briefs.
- Carries the campaign's signature numbers (47 / 8,412 / 0 / 32). Highest-pain hook on paper but highest policy risk — needing #1, #3, #2 to ship first so the team has confidence in the visual language before tackling the audit-sensitive build.

---

## 9. Anti-pattern callout

**Do NOT:**
- Show a face. Lane A faceless. The "rep" exists only as a synthesized voice + a NEVER-SAID glass card.
- Remove or fade the `CALL AUTOPSY` top-bar label early. It must persist 00:00–00:22. The 0.4s fade at 00:22.0 is the ONLY moment it leaves the screen, and only because S6 CTA needs the visual room.
- Cut or paraphrase the VO line _"This isn't a Tonvo measurement..."_ in S4. This is the verification anchor. A future editor reading only this brief block must understand: that line is policy infrastructure, not creative copy.
- Imply Tonvo recorded the viewer's specific call. The 47-min / 8,412-word numbers are illustrative — the framing is "the autopsy of every call where you stalled," not "Tonvo measured your call."
- Use any CTA other than `Try Free → tonvo.co`.
- Drift into post-call analysis / call review / replay messaging. Tonvo flags the moment LIVE (per the timeline at MIN 32 + iPhone Tonvo card "ASK NOW"). The autopsy framing is the rhetorical device; the product mechanic shown is live in-call.
- Color the chrome `0` in S2 anything other than chrome+white. The red `radial-glow` behind it is the ONLY color accent allowed; the `0` itself stays in the palette.

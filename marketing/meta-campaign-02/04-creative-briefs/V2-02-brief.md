# V2-02 Creative Brief — Angle F · "Stop Typing. Start Closing." · Hook H2

_Creative Director: Claude Opus · 2026-05-17 · Meta Ads campaign-02 · Wave 3_
_Source copy: `marketing/meta-campaign-02/03-copy/V2-02-copy.md` · Hook archetype: outrage / category-rename (same register as V1 Brief-D)_
_Scroll-stop catalog ref: lead = **F-S1.3** primitive ("Notes were stealing my close." = silent-safe serif-on-black) re-fitted to the H2 imperative phrasing_

---

## 1. Variant identity

| Field | Value |
|---|---|
| Variant ID | V2-02 |
| Angle | F — Without Taking a Single Note |
| Format | 9:16 Reels (vertical) |
| Duration | 12.0s |
| Hook | "Stop typing. Start closing." (H2) |
| Scroll-stop catalog ID | Primary: **F-S1.3** ("Notes were stealing my close.") visual primitive — silent-safe chrome serif on black. Backup hook copy: F-S1.1 alt "I stopped taking notes 3 weeks ago." if hold rate <25% at 8s. |
| Primes landing typewriter line | Line 2: "Without taking a single note." |
| Primary text (Ads Manager) | "Every minute you type is a minute you're not listening. Tonvo notes the call so you can run it. Try free → tonvo.co" |
| Headline | "Tonvo notes. You close." (24 chars) |
| Description | "Hands off keyboard. On call." (29 chars) |
| Button | `Try for Free` |
| Production cost | ~1.5 HF-days (cheapest ad in V2 batch — all-on-canvas, no B-roll) |

---

## 2. Format spec

| Spec | Value |
|---|---|
| Aspect ratio | 9:16 |
| Target export | 1080×1920 .mp4 (H.264 high, 8-10 Mbps) |
| FPS | 30 |
| Codec | H.264 yuv420p, AAC 192k |
| Color | sRGB |
| Safe zones | Top 14% (≥269 px from top), bottom 14% (≥269 px from bottom). Hook line + typewriter + CTA all centered in middle 72%. |
| Loop-friendly | No |
| Sound-on assumption | Sound-OFF primary. The 3s of dead-still serif at the top reads in feed thumbnails without audio. |

---

## 3. Scene-by-scene plan

| # | Time | Shot description | VO line (Edge TTS · Aria Neural) | On-screen text | SFX | Transition out |
|---|------|------------------|----------------------------------|----------------|-----|----------------|
| **S0** | 0.0–0.2s | Black bg. Fade up. | _(silence)_ | _(empty during fade)_ | Single `sub-impact.wav` at 0.0s on the fade trigger. -3 dB. | Hold static. |
| **S1** | 0.2–3.0s | DEAD-STILL. Black bg. Hook line in white **serif** (Inter does not have serif — use **Crimson Pro** or **Playfair Display** at 700, 72px) center frame. No animation. Cursor blink optional and minimal (only 1 cycle in the 2.8s window). | _(silence — total)_ | `Stop typing. Start closing.` — Crimson Pro 700, 72px, white #fafafa, center, line-height 1.05, letter-spacing -0.03em. Two lines stacked: "Stop typing." on line 1, "Start closing." on line 2. | **Total silence 0.2s–3.0s.** No music, no ambient, no riser. | Cross-cut to S2 at 3.0s. |
| **S2** | 3.0–6.0s | Black bg with faint grid (#grid-bg at 0.07 opacity). Chrome lower-third two-line stack appears. Line 1: `YOU = CLOSER.` Line 2: `NOT STENOGRAPHER.` At 5.0s, a strikethrough sweep crosses "STENOGRAPHER" L→R. | "You're not a stenographer. You're a closer." | Line 1: `YOU = CLOSER.` (Inter 700, 48px chrome). Line 2: `NOT STENOGRAPHER.` (Inter 700, 48px chrome, strikethrough at 5.0s). | `reverse-lift.wav` on stack-in (3.0s). `strike.wav` at 5.0s on sweep. Music bed `tense-cinematic.mp3` fades in at 3.0s from -∞ → -18 dB across 500ms. | Crossfade to S3 over 200ms. |
| **S3** | 6.0–9.0s | iPhone 17 mockup, 4°/-2° tilt, 380px wide, centered slightly upper. Inside the phone screen: `assets/demo-session.mp4` running mid-call with transcript scrolling. A chrome glass card overlays the upper screen area with the buying-signal callout. Card pulses 1× at 7.5s. | "Tonvo writes the call. Every word. Every signal." | Glass card on phone: `BUYING SIGNAL — Q3 budget.` (Inter 600, 18px, chrome plate). Transcript scrolls behind. | `glass-chime.wav` on card snap-in (6.0s). `detect-ping.wav` on pulse (7.5s). `tap-bright.wav` per VO phrase break. | Cut to S4 at 9.0s. |
| **S4** | 9.0–11.0s | Black bg. Typewriter end-card center frame. **MATCHES LANDING `.hero-headline2` EXACTLY** (commit `9f509ce`): Inter sans **font-weight 200 (NOT mono, NOT 800)**, letter-spacing `-0.025em`, silver-sweep gradient `linear-gradient(115deg, rgba(255,255,255,0.55), #fafafa, rgba(200,200,216,0.95), #fafafa, rgba(255,255,255,0.55))` via `-webkit-background-clip: text`, caret blink `0.9s steps(1)`, typeSpeed 42 ms/char. Display ≈ 48-56px at 1080. See `08-tooling/tech-decisions-v2.md` §3. | _(silence)_ | `Without taking a single note.` — Inter 200 light + silver-sweep gradient, types in 1.0s (5 words → 4 ticks evenly spaced 9.0–10.0s), holds 10.0–11.0s with caret blink. | `tap-bright.wav` per word stamp (4 ticks at 9.0 / 9.25 / 9.5 / 9.75s). | Cross-dissolve to S5 over 200ms. |
| **S5** | 11.0–12.0s | CTA end-card. Tonvo logo top-third. Below: chrome CTA pill `Try Free → tonvo.co`. Sub-line `30s setup · no card.` | "Try free. Three sessions. No card." | Logo + `Try Free → tonvo.co` (chrome pill) + sub-line `30s setup · no card.` | `air-swoosh.wav` on logo (11.0s). `text-pop.wav` on pill (11.2s). Music fade-out -18 → -∞ across 11.0–12.0s. | End. |

**Pacing audit:** S1 is 2.8s of dead-still serif — the longest single-frame hold in the V2 batch. This IS the mechanic. Total 12.0s, well under 32s cap.

---

## 4. Asset list

### Visuals required

| Asset | Source | Status | Notes |
|---|---|---|---|
| Serif font: Crimson Pro 700 (or Playfair Display 700) | Google Fonts — free, open-source | Available — but **NEW addition to v2 stack**. V1 used Inter only. | Editorial register — intentional deviation from chrome system per copy doc note. Flag: this is a one-off serif use; do NOT bleed serif into S2-S5 (Inter only beyond S1). |
| Black bg with faint #grid-bg overlay | Ad11 primitive | REUSE | |
| Chrome lower-third two-line stack | Ad11 primitive | REUSE | |
| Strikethrough sweep on "STENOGRAPHER" | Ad11 S2 strike primitive | REUSE | |
| iPhone 17 mockup + demo-session.mp4 | `IPhone17Mockup` component + `assets/demo-session.mp4` | REUSE | Per memory rule. |
| Glass card overlay on phone screen | Ad11 glass-card primitive | REUSE | |
| Tonvo logo | `assets/logo-tonvo-remove.png` | REUSE | |
| Typewriter end-card | Inline HTML + GSAP/Motion type-in. **Must match landing typewriter line 2 CSS verbatim.** | Producible in-engine. | Same as V2-01 S6. Pull from landing repo. |
| CTA pill (chrome plate, "Try Free → tonvo.co") | Ad11 S6 primitive | REUSE | |

### Audio

| Track | File | Voice | Lines / notes |
|---|---|---|---|
| VO segment 1 (S2) | `assets/audio/v2-02_s2.mp3` | Edge TTS · Aria Neural, **lower register than V2-01**, slower cadence, flat declarative | "You're not a stenographer. You're a closer." |
| VO segment 2 (S3) | `assets/audio/v2-02_s3.mp3` | Aria Neural | "Tonvo writes the call. Every word. Every signal." |
| VO segment 3 (S5) | `assets/audio/v2-02_s5.mp3` | Aria Neural | "Try free. Three sessions. No card." |
| Music bed | `assets/audio/tense-cinematic.mp3` | Pixabay | -18 dB. **Muted entirely 0.0–3.0s.** Fades in at 3.0s. Fades out 11.0–12.0s. |
| SFX | `sub-impact.wav`, `reverse-lift.wav`, `strike.wav`, `glass-chime.wav`, `detect-ping.wav`, `tap-bright.wav`, `air-swoosh.wav`, `text-pop.wav` — all from `sfx-apple/` | All in repo | |
| Voice direction | — | — | Flat correction, not lesson. Slower than V2-01. Drop the period (no trailing intonation). |

---

## 5. Hook spec (frame-accurate 0.0–3.0s)

| Frame range (30fps) | Timestamp | Visual | Audio |
|---|---|---|---|
| 0 | 0.00s | Black bg, opacity 0 → fade-up trigger. | `sub-impact.wav` plays at 0.0s, -3 dB. |
| 0–6 | 0.00–0.20s | Fade-up from black opacity 0 → 100% on bg. Serif text opacity remains 0. | Sub-impact tail decays. |
| 6 | 0.20s exactly | Serif text snaps to opacity 100% in a single frame. No motion, no scale, no slide. Snap. | Total silence begins. |
| 6–90 | 0.20–3.00s | Text holds completely static. Cursor blink: one cycle only (0.5s on, 0.5s off, 0.5s on, then static). | True silence. No music, no ambient. |

**Critical timing notes:**
- The 2.8s of dead-still serif is the entire scroll-stop mechanic. Every other ad in feed has motion in the first 1.5s. V2-02's edge is the stillness.
- DO NOT add subtle parallax, slow zoom, or fade animation past frame 6. Frozen.
- The 1.3s+ of dead air is uncomfortable on a phone scroll — that IS the point.
- DO NOT lengthen the cursor blink past 1 cycle. Even cursor motion competes with the stillness.

---

## 6. CTA spec

| Element | Value |
|---|---|
| End-card duration | 1.0s (11.0–12.0s) |
| Background | `#09090b` + #grid-bg at 0.07 opacity |
| Logo | `logo-tonvo-remove.png` at 96px, top-third |
| CTA pill | "Try Free → tonvo.co" — chrome plate, Inter 700, 26px |
| Sub-line | "30s setup · no card." — Inter 400, 18px, `#a1a1aa` |
| Button (Ads Manager) | `Try for Free` |
| Position (safe zone) | Logo at y=480, pill at y=860, sub-line at y=920. Bottom 14% reserved for Meta UI. |
| Animation | Logo air-swoosh entry (200ms). Pill text-pop (200ms). |

---

## 7. Pipeline routing

**100% HyperFrames default — zero escalation needed.**

This is the simplest ad in the V2 batch. All assets reused from V1 except:
- One Google Font addition (Crimson Pro or Playfair Display) — drop-in via `@import` in HF CSS. Zero cost.
- Confirmation that landing typewriter CSS matches (same gate as V2-01 — tech-director can resolve once for V2-01/02/03/04 in one pass).

No B-roll. No new SFX. No new VO infrastructure. No image generation. No tech-director escalation.

**Recommended:** ship V2-02 FIRST in the wave-1 launch sequence. Lowest production cost, fastest turnaround, cheapest CPM probe.

---

## 8. Risks / pre-flight checks

| Risk | Mitigation |
|---|---|
| **Serif font fails to render in HyperFrames** | Pre-flight: confirm Crimson Pro or Playfair Display loads via Google Fonts `@import`. Fallback: use Inter Italic at higher weight + slight letter-spacing to mimic editorial register. (Note: copy doc explicitly calls for serif — if Inter-italic fallback is used, flag to copywriter.) |
| **Producer adds music under S1 silence** | Pre-flight: master audio timeline shows -∞ dB from 0.2–3.0s. Test on mobile. The silence IS the mechanic — bleed-through kills the ad. |
| **Cursor blink too aggressive** | Single cycle only. Confirm GSAP/Motion config: 0.5s on / 0.5s off / 0.5s on / hold. No infinite loop. |
| **Typewriter end-card font mismatch with landing** | Same gate as V2-01. Pull CSS from landing repo, confirm font-family + cadence. |
| **iPhone17Mockup render in 9:16** | Confirmed working in Ad11. Reuse. |
| **Sound-off viewers** | All narrative beats on-screen: S1 hook, S2 stack, S3 glass card, S4 typewriter, S5 CTA. Fully comprehensible silent. |
| **Strikethrough sweep timing on STENOGRAPHER** | Lock sweep to 5.0s exactly — at midpoint of S2, after VO clears "stenographer" word. If sweep precedes VO, gag breaks. |

---

## 9. Anti-patterns (must NOT appear)

- **No music during 0.0–3.0s.** Total silence. This is the single most important production rule for V2-02.
- **No motion during S1.** Frozen. No parallax, no zoom, no slide. Static serif.
- **No corporate intro.** No "Introducing." No logo at the top.
- **No "AI" / "intelligent" / "smart" / "next-gen" / "powerful"** anywhere.
- **No founder-on-camera.**
- **No percentage stat** anywhere. V2-02 carries zero numeric claims by design (per copy doc).
- **No serif beyond S1.** Inter (sans) only for everything from S2 onward — S4 typewriter uses **Inter 200 + silver-sweep gradient matching landing `.hero-headline2`** (NOT Inter Mono). Serif is the S1 differentiator only.
- **No testimonials or named operators.** Angle F, not Angle H.
- **No emoji.**
- **No demo-book CTA.** `Try Free → tonvo.co` only.
- **No new SFX.** All from `sfx-apple/`.
- **No retrospective POV.** Concurrent register (the typing is happening now, the offload is happening now).

---

_End V2-02 brief. Ship first — fastest production turnaround in V2 batch._

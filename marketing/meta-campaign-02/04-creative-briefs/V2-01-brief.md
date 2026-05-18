# V2-01 Creative Brief — Angle F · "Without Taking a Single Note" · Hook H1

_Creative Director: Claude Opus · 2026-05-17 · Meta Ads campaign-02 · Wave 3_
_Source copy: `marketing/meta-campaign-02/03-copy/V2-01-copy.md` · Hook archetype: direct accusation + visual stack_
_Scroll-stop catalog ref: lead = **F-S1.1** alternate caption ("Your hands typed. You missed the close.") backed by F-R1.1 / F-R1.3 visual primitives_

---

## 1. Variant identity

| Field | Value |
|---|---|
| Variant ID | V2-01 |
| Angle | F — Without Taking a Single Note |
| Format | 9:16 Reels (vertical) |
| Duration | 18.0s |
| Hook | "Your hands typed. You missed the close." (H1) |
| Scroll-stop catalog ID | Primary: **F-R1.3** (audio-driven keyboard B-roll → caption stamp). Backup: **F-S1.1** ("I stopped taking notes 3 weeks ago.") if hook rate <35% at 3s in first 48h. |
| Primes landing typewriter line | Line 2: "Without taking a single note." |
| Primary text (Ads Manager) | "You typed through the objection. You typed through the buying signal. Tonvo runs the call so you can. Try free → tonvo.co" |
| Headline | "Stop typing. Start closing." (28 chars) |
| Description | "Live copilot. No notes." (24 chars) |
| Button | `Try for Free` |

---

## 2. Format spec

| Spec | Value |
|---|---|
| Aspect ratio | 9:16 |
| Target export | 1080×1920 .mp4 (H.264 high, 8-10 Mbps) |
| FPS | 30 |
| Codec | H.264 yuv420p, AAC 192k |
| Color | sRGB |
| Safe zones | Top 14% (= ≥269 px from top) clear of critical text — Meta caption/profile overlay. Bottom 14% (= ≥269 px from bottom) clear — Meta CTA overlay. All hook text + typewriter end-card + CTA card centered in middle 72%. |
| Loop-friendly | No — hard CTA out, no first-frame match-to-last-frame. |
| Sound-on assumption | 50/50. VO must add meaning; visual must carry alone. |

---

## 3. Scene-by-scene plan

| # | Time | Shot description | VO line (Edge TTS · Aria Neural / Ava Neural) | On-screen text | SFX | Transition out |
|---|------|------------------|-----------------------------------------------|----------------|-----|----------------|
| **S0** | 0.0–0.6s | Locked top-down macro of two hands hammering a mechanical keyboard. Hands fill frame, no face. Slight motion blur on fingertips. Background = dark wood desk surface. | _(silence)_ | _(none — visual lives alone)_ | Keystroke clatter (sfx-apple/`keyboard-clatter.wav` or synthesized) at 2× natural speed, slight plate-reverb tail, -6 dB. | Hard audio cut at 0.6s — no fade. |
| **S0b** | 0.6–1.5s | Same hands, same shot. Chrome lower-third caption types in word-by-word, monospace, white on faint chrome plate. Line reads: "Your hands typed." | _(silence)_ | `Your hands typed.` (monospace, chrome plate, lower-third, 0.6→1.0s type-in) | Single keyboard-click per word (4 clicks), sub-impact at 0.6s on caption appearance. | Hard cut to black at 1.5s. |
| **S1** | 1.5–3.0s | Dead-still black bg. Full hook line stamps center, white sans serif (Inter 800, 64px), no animation other than cursor blink on the period. | _(silence — the silence IS the scroll-stop)_ | `Your hands typed. You missed the close.` (Inter 800, 64px white, center, cursor blink on period at 600ms cadence) | Total silence. **Zero music. Zero ambient.** 1.5s of true silence. | Soft fade-up of music bed at 3.0s (-22 dB → -18 dB over 0.5s). |
| **S2** | 3.0–6.0s | Cut to a wide of a laptop on a desk, screen showing a Notion doc actively being typed in. A small Zoom thumbnail in the corner shows a neutral buyer pose. AE hands visible at bottom of frame, typing. Chrome top-bar slides in: "45 MIN · 45 MIN TYPING" with a ticking counter. | "Forty-five minutes on the call. Forty-five minutes typing." | Top bar: `45 MIN · 45 MIN TYPING` (chrome plate). Counter ticks 1× at 4.5s. | `tap-bright.wav` on counter tick. Music bed at -18 dB (`tense-cinematic.mp3`). | Glass-card snap-in at 6.0s (`glass-chime.wav` lo). |
| **S3** | 6.0–9.0s | Same laptop wide. A chrome glass card snaps into center frame containing the buyer quote in italic. At 8.0s a red strikethrough sweeps L→R across the quote, and `MISSED` stamps below it in chrome amber-tinted red (#c84a4a). | "You missed when she said 'we'd need this by Q3.' That was the deal." | Glass card: `"we'd need this by Q3."` (Inter italic, white, on chrome plate). Strike sweep at 8.0s. Stamp: `MISSED` (Inter 700, red). | `tap-mid.wav` on card snap. `strike.wav` on sweep at 8.0s. `detect-ping-lo.wav` at 8.4s under MISSED stamp. | Cross-cut to S4 — glass card dissolves, scene swaps. |
| **S4** | 9.0–12.0s | Hard cut to black bg. Two-line chrome lower-third stack appears with subtle glow on second line. | "Tonvo writes the call. You run the call." | Line 1: `Tonvo writes the call.` (white, Inter 600). Line 2 (slight chrome silver-sweep + glow): `You run the call.` | `reverse-lift.wav` on stack appearance. `air-swoosh.wav` between lines (9.6s). | Crossfade to S5 over 0.5s. |
| **S5** | 12.0–15.0s | iPhone 17 mockup, 4°/-2° tilt per Ad11 spec, 380px wide, centered. Inside the screen: existing `assets/demo-session.mp4` plays at native speed showing Tonvo's transcript view. A chrome glass card overlays the mockup screen with the buying-signal callout. The card pulses once at 13.5s. | "Hands off the keyboard. Eyes on the buyer. Every word captured." | Glass card on phone screen: `BUYING SIGNAL — Q3 timeline. Ask for the close.` (chrome plate, Inter 600). Card pulses 1× (scale 1.0→1.04→1.0 over 400ms) at 13.5s. | `glass-chime.wav` on card snap-in (12.0s). `detect-ping.wav` (full, not -lo) on pulse at 13.5s. | Cut to typewriter end-card at 15.0s. |
| **S6** | 15.0–17.0s | Black bg. Sans-serif **light (weight 200)** typewriter line types in center frame with silver-sweep iridescent gradient, caret blinks. **MATCHES LANDING `.hero-headline2` EXACTLY** (commit `9f509ce`): font-family Inter sans, font-weight **200 (NOT mono, NOT 800)**, letter-spacing `-0.025em`, gradient `linear-gradient(115deg, rgba(255,255,255,0.55) 0%, #fafafa 28%, rgba(200,200,216,0.95) 50%, #fafafa 72%, rgba(255,255,255,0.55) 100%)` via `-webkit-background-clip: text`. Caret blink `0.9s steps(1)`. typeSpeed = 42 ms/char. Size ≈ 48-56px at 1080. See `08-tooling/tech-decisions-v2.md` §3. | _(silence)_ | `Without taking a single note.` (Inter 200 + silver-sweep gradient, caret blink 0.9s, typeSpeed 42 ms/char) | `tap-bright.wav` per word stamp (5 ticks, evenly spaced 0.0–1.0s). | Cross-dissolve to S7 over 200ms. |
| **S7** | 17.0–18.0s | CTA end-card. Tonvo logo top-third (logo-tonvo-remove.png, 96px). Below: chrome CTA pill `Try Free → tonvo.co`. Sub-line below pill: `30s setup · no card.` | "Try Tonvo free. Three sessions. No card." | Logo + `Try Free → tonvo.co` (chrome pill) + sub-line `30s setup · no card.` (Inter 400, 18px, muted #a1a1aa) | `air-swoosh.wav` on logo entry. `text-pop.wav` on pill. Music bed fade-out -18 → -∞ across the full 1.0s. | End. |

**Pacing audit:** S0+S0b = 1.5s (hook). All other scenes ≤3s. S1 silence beat is the critical pattern-interrupt — DO NOT add music under it. Total 18.0s, within 24-32s cap allowance.

---

## 4. Asset list

### Visuals required

| Asset | Source | Status | Notes |
|---|---|---|---|
| Keyboard top-down macro B-roll (2.5s clip) | Pixabay search terms: `mechanical keyboard hands typing top down macro`, `4k typing macro hands`, `dark desk keyboard close up`. Royalty-free, CC0 preferred. Fallback: AI-generated via Kling 3.0 (3s clip, prompt: "top-down macro shot of two hands typing rapidly on a black mechanical keyboard, dark wooden desk, dramatic side lighting, no face, slight motion blur, cinematic"). | NOT IN REPO — must be sourced or generated. | If Kling 3.0: this is OFF the v1 free-stack lock. Flag to tech-director for sourcing decision (Pixabay stock vs. Kling). Pixabay-first to stay $0. |
| Laptop wide w/ Notion doc + Zoom corner thumbnail (3.0s clip) | Staged screen recording OR composite in HyperFrames using a static laptop photo + animated Notion overlay. Recommended: HyperFrames composite, no external footage. | Producible in-engine (HyperFrames). | Build the Notion doc as inline HTML overlay; the "Zoom thumbnail" is a 200×120 muted lip-sync loop of a neutral buyer pose (can be Pixabay royalty-free portrait video loop or a still frame). |
| iPhone 17 mockup with demo-session.mp4 | `IPhone17Mockup` component (Tonvo-Ad-HF repo) + `assets/demo-session.mp4`. | REUSE — confirmed in repo per V1 memory rule. | Per memory rule, all Tonvo product UI MUST wrap in IPhone17Mockup. 4°/-2° rotation. |
| Tonvo logo | `assets/logo-tonvo-remove.png` | REUSE | |
| Glass card primitive (buyer quote + MISSED stamp) | Ad11 S2 glass-card CSS primitive — reuse exactly. | REUSE | |
| Chrome top-bar stat plate ("45 MIN · 45 MIN TYPING") | New variant of Ad11 chrome-text class — minor template change, no new primitive. | Producible in-engine. | |
| Typewriter end-card matching landing | Inline HTML + GSAP/Motion type-in. **MUST match landing typewriter line 2's CSS spec verbatim** — pull from landing repo: same font-family, font-weight, letter-spacing, cursor blink cadence (~600ms). | Producible in-engine. | Continuity claim in brief §5 only holds if typography literally matches. Cross-check against landing repo CSS before render. |

### Text overlays (no rasterization — all live HTML/CSS for crispness)

- `Your hands typed.` (S0b lower-third) — Inter Mono / SF Mono, monospace, chrome plate
- `Your hands typed. You missed the close.` (S1 stamp) — Inter 800, 64px white, center
- `45 MIN · 45 MIN TYPING` (S2 top bar) — Inter 600, 20px, chrome
- `"we'd need this by Q3."` (S3 quote card) — Inter italic 36px, white
- `MISSED` (S3 stamp) — Inter 700, 28px, #c84a4a
- `Tonvo writes the call.` / `You run the call.` (S4 stack) — Inter 600, 40px
- `BUYING SIGNAL — Q3 timeline. Ask for the close.` (S5 phone overlay) — Inter 600, 18px
- `Without taking a single note.` (S6 typewriter) — Inter 200 light + silver-sweep gradient, ≈48-56px (matches landing `.hero-headline2`, NOT monospace — see tech-decisions §3)
- `Try Free → tonvo.co` + `30s setup · no card.` (S7 CTA) — Inter 700 + Inter 400

### Audio

| Track | File | Voice / source | Lines / notes |
|---|---|---|---|
| VO segment 1 (S2) | `assets/audio/v2-01_s2.mp3` | Edge TTS · **Aria Neural** (en-US-AriaNeural), female, dry-clipped delivery, no rising intonation | "Forty-five minutes on the call. Forty-five minutes typing." |
| VO segment 2 (S3) | `assets/audio/v2-01_s3.mp3` | Aria Neural | "You missed when she said 'we'd need this by Q3.' That was the deal." |
| VO segment 3 (S4) | `assets/audio/v2-01_s4.mp3` | Aria Neural | "Tonvo writes the call. You run the call." |
| VO segment 4 (S5) | `assets/audio/v2-01_s5.mp3` | Aria Neural | "Hands off the keyboard. Eyes on the buyer. Every word captured." |
| VO segment 5 (S7) | `assets/audio/v2-01_s7.mp3` | Aria Neural | "Try Tonvo free. Three sessions. No card." |
| Music bed | `assets/audio/tense-cinematic.mp3` | Pixabay royalty-free | -18 dB. Fade in at 3.0s. Fade out across S7. **Muted (-∞) during S0–S1 entirely.** |
| SFX (all from `assets/audio/sfx-apple/*.wav`) | `keyboard-clatter.wav`, `sub-impact.wav`, `tap-bright.wav`, `tap-mid.wav`, `glass-chime.wav`, `strike.wav`, `detect-ping-lo.wav`, `detect-ping.wav`, `reverse-lift.wav`, `air-swoosh.wav`, `text-pop.wav` | All in repo from v1 | If `keyboard-clatter.wav` does not exist in `sfx-apple/`, escalate to tech-director — that beat is load-bearing. Confirm before greenlight. |
| Voice direction | — | — | Dry, slightly clipped, no rising intonation on the asks. AE-to-AE register, not coach-to-student. |

---

## 5. Hook spec (frame-accurate 0.0–1.5s)

| Frame range (30fps) | Timestamp | Visual | Audio |
|---|---|---|---|
| 0–4 | 0.00–0.13s | First frame of keyboard macro. Hands mid-keystroke. | Keystroke clatter starts at 0.0s, -6 dB, 2× speed. |
| 4–18 | 0.13–0.60s | Hands continue typing. Slight motion blur. | Clatter sustains. |
| 18 | 0.60s exactly | Chrome lower-third caption begins type-in. Caption position: bottom 25% of frame, centered horizontally, 60px from bottom edge. | Sub-impact `sub-impact.wav` at 0.60s. Clatter level drops to -10 dB. |
| 18–30 | 0.60–1.00s | Caption types word-by-word: "Your" (frame 18) → "hands" (frame 21) → "typed." (frame 26). | Single keyboard-click SFX per word. |
| 30–45 | 1.00–1.50s | Caption fully visible, holds. Clatter audio fades fast (-10 → -∞ over 6 frames / 200ms). | Clatter cuts to silence at frame 45 (1.50s). |
| 45 | 1.50s exactly | Hard cut to black bg. Hook line stamps in center frame. | True silence begins. |

**Critical timing notes:**
- The clatter must hard-cut to silence at frame 45 — NOT a fade. The silence IS the scroll-stop.
- Caption type-in begins at frame 18 (0.60s), not earlier. The first 0.6s is pure kinesthetic recognition; the caption arrives after the viewer registers the hands.
- DO NOT music-bed under the 1.5–3.0s silence. Actual silence, full stop.

---

## 6. CTA spec

| Element | Value |
|---|---|
| End-card duration | 1.0s (17.0–18.0s) |
| Background | `#09090b` Tonvo dark bg, faint grid at 0.07 opacity (Ad11 #grid-bg primitive) |
| Logo | `logo-tonvo-remove.png` at 96px, top-third center |
| CTA pill | "Try Free → tonvo.co" — chrome plate, Inter 700, 26px, white, center frame |
| Sub-line | "30s setup · no card." — Inter 400, 18px, `#a1a1aa` muted, 24px below pill |
| Button (Ads Manager) | `Try for Free` |
| Position (safe zone) | All elements within middle 72% of frame. Logo at y=480, pill at y=860, sub-line at y=920. Bottom 14% (>1652px) reserved for Meta UI. |
| Animation | Logo: air-swoosh entry (200ms fade-up). Pill: text-pop on appearance (200ms). Sub-line: simple opacity fade (200ms). |

---

## 7. Pipeline routing

**100% HyperFrames default — with one tech-director gate.**

Default stack handles:
- HTML/CSS/GSAP for all chrome plates, glass cards, typewriter, type-in animations, iPhone 17 mockup wrap, chrome top-bar
- Edge TTS Aria Neural for all 5 VO segments
- Existing `tense-cinematic.mp3` for music
- Existing `sfx-apple/*.wav` library for all SFX
- Existing `demo-session.mp4` for S5 product reveal
- Remotion or HyperFrames render for final composite

**Tech-director escalation needed for:**
1. **Keyboard macro B-roll sourcing** (S0). Two paths: (a) Pixabay royalty-free clip (free, on v1 lock), (b) Kling 3.0 generation at ~$0.21/3s clip (off v1 free-stack lock per `production-stack.md`). Tech-director picks lane and confirms asset availability. If neither works, escalate to v2-04 spine alternative (1:1 reformat skips macro entirely).
2. **`keyboard-clatter.wav` availability** in `sfx-apple/`. If absent: tech-director either synthesizes via ffmpeg, sources from Pixabay SFX (royalty-free), or substitutes a layered tap-mid+sub-impact combo.
3. **Landing typewriter CSS exact-match** (S6). Tech-director pulls the live CSS spec from the landing repo and confirms the brief's font/cadence claim. If the landing's spec drifts, the brief's continuity hypothesis fails — must be re-aligned before render.

---

## 8. Risks / pre-flight checks

| Risk | Mitigation |
|---|---|
| **Keyboard B-roll unavailable** | Fallback: replace S0 with a still photo of a keyboard with a single particle-style "key press" SFX-driven animation (one key lights, then a second, then a third). Stays on free stack. Costs ~1 hour of HF time. |
| **Silence at S1 mis-rendered (music bleeds in)** | Pre-flight: verify the master audio timeline shows -∞ dB from 1.5s to 3.0s. Test in mobile playback (Meta's preview tool auto-attenuates) to confirm the silence reads. |
| **Typewriter end-card type-in lags behind voice silence** | The 2.0s (15.0–17.0s) slot accommodates 5-word type-in at standard 200ms/word cadence. If render slips and type-in extends past 17.0s, compress to 4 evenly-spaced ticks instead. |
| **Glass card MISSED stamp reads as a numeric claim** | Strict: stamp says `MISSED`, not `MISSED $X` or `MISSED 27%`. No numeric. The "45 MIN" stat is a generic AE-life pattern (per scroll-stops catalog F-N1.2 logic), not a Tonvo metric — does not need source file. |
| **iPhone17Mockup tilt doesn't render correctly in 9:16** | Confirmed working in Ad11 (9:16 master). Reuse exact CSS transform. |
| **VO timing drifts due to Edge TTS variance** | Add +1.0s buffer per VO segment, 250ms fade-out per v1 producer notes. Pre-render all 5 segments and lock timestamps before scene assembly. |
| **Mobile safe-zone violation (top/bottom 14%)** | Pre-flight: render at 1080×1920, overlay a 14% top + 14% bottom mask, verify no critical text in masked areas. |
| **Sound-off viewers (no VO heard)** | All critical narrative beats are also on-screen text: S0b caption, S1 stamp, S3 glass card, S4 stack, S5 phone overlay, S6 typewriter, S7 CTA. The ad is fully comprehensible silent. |

---

## 9. Anti-patterns (must NOT appear)

- **No corporate intro lente.** No "Introducing Tonvo." No logo-first opening. Logo doesn't appear until S7 (17.0s).
- **No "AI" / "intelligent" / "smart" / "AI-powered" / "next-gen" / "powerful"** anywhere in copy, overlays, or VO. Banned per copywriter discipline.
- **No founder-on-camera.** Anti-strategy lock from v1, still in force per brief §8.7.
- **No percentage claim** anywhere in the cut. The "45 MIN" pattern-stat is allowed (illustrative, generic AE-life) but no Tonvo-attributed numeric. No 27%, no 31%, no +29%, no 14-day claim — until `02-research/` sources land.
- **No fabricated testimonials** or named operators. Angle F doesn't carry social proof — that's Angle H, which is gated and not in this brief.
- **No music under the S0+S1 silence beat.** The silence is the mechanic.
- **No font deviation.** Inter only (200 light, regular, italic, 600, 700, 800) for all text. Typewriter end-card (S6) uses **Inter 200 + silver-sweep gradient matching landing `.hero-headline2`**, NOT Inter Mono. No serif, no display, no emoji.
- **No color drift.** DA palette only: `#09090b` bg, `#fafafa` text, chrome silver, glass plate, accent `#c84a4a` for the MISSED stamp only. No mint/amber/coral/indigo in this brief.
- **No retrospective POV** in V2-01 — this ad is concurrent ("your hands are typing right now"), not post-mortem ("last week you lost $50K"). Hold the line on present-tense.
- **No demo-book CTA.** Locked: `Try Free → tonvo.co`. No "Book a demo," no "Talk to sales."

---

_End V2-01 brief. Next: hand to tech-director for tool overlay (keyboard B-roll lane + clatter SFX + landing typewriter spec) → producer fork from `Tonvo-Ad-HF/` → render._

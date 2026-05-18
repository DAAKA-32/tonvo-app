# V2-03 Creative Brief — Angle G · "Three Signals. Thirty Seconds. Watch." · Hook H3

_Creative Director: Claude Opus · 2026-05-17 · Meta Ads campaign-02 · Wave 3_
_Source copy: `marketing/meta-campaign-02/03-copy/V2-03-copy.md` · Hook archetype: specific-number cold-open + invitation_
_Scroll-stop catalog ref: lead = **G-R2.1** (iPhone Tonvo + pip + buying-signal glass card) per hook-specialist recommendation. Body cascades through G-S2.2 ("Three signals fired in this call.") logic._

---

## 1. Variant identity

| Field | Value |
|---|---|
| Variant ID | V2-03 |
| Angle | G — The Signal You Missed, Live |
| Format | 9:16 Reels (vertical) |
| Duration | 22.0s |
| Hook | "Three signals. Thirty seconds. Watch." (H3) |
| Scroll-stop catalog ID | Primary: **G-R2.1** (iPhone + waveform pip + buying-signal glass card). Backup: G-S2.2 audio-driven if hook rate <35%. |
| Primes landing typewriter line | Line 3: "Without missing a signal." |
| Primary text (Ads Manager) | "Three buying signals in 30 seconds of call. Most reps miss all three. Tonvo flags every one, live. Try free → tonvo.co" |
| Headline | "3 signals. Live. Caught." (25 chars) |
| Description | "Live in-call signal detection." (30 chars) |
| Button | `Try for Free` |
| Production cost | ~3 HF-days (heaviest in V2 batch — live-call audio stitch + 3 frame-accurate card flips) |

---

## 2. Format spec

| Spec | Value |
|---|---|
| Aspect ratio | 9:16 |
| Target export | 1080×1920 .mp4 (H.264 high, 8-10 Mbps) |
| FPS | 30 |
| Codec | H.264 yuv420p, AAC 192k |
| Color | sRGB |
| Safe zones | Top 14% (≥269 px), bottom 14% (≥269 px). Zoom thumbnail centered, glass cards in middle 72%, chrome `SIGNAL n` stamps must respect upper safe-zone. |
| Loop-friendly | No |
| Sound-on assumption | Sound-ON primary (the buyer audio drops are load-bearing). Sound-off variant covered by visual card flips + chrome stamps. |

---

## 3. Scene-by-scene plan

| # | Time | Shot description | VO line (Edge TTS · Aria Neural) + buyer audio drops | On-screen text | SFX | Transition out |
|---|------|------------------|----------------------------------------------------|----------------|-----|----------------|
| **S0** | 0.0–0.3s | Black bg. Chrome wordmark builds L→R: `3 · 30 · WATCH`. Each numeral lands with a discrete chrome tick. | _(silence)_ | `3 · 30 · WATCH` (chrome plate, Inter 700, 56px, monospace digits, center) | 3× discrete `tap-bright.wav` ticks on each character group (0.0 / 0.1 / 0.2s). Sub-bass `sub-impact.wav` under each, layered -3 dB. | Hold static into S0b. |
| **S0b** | 0.3–1.0s | Wordmark holds. | _(silence)_ | Wordmark visible at 100% opacity. | Single sustained ambient pad fades in 0.3 → 1.0s (-22 dB). | Cross-fade. |
| **S0c** | 1.0–1.5s | Wordmark dims to 20% opacity and scales 100%→90%. Beneath it, a Zoom-style call thumbnail fades up at 50% scale, lower-third center. Neutral buyer pose, slightly blurred. | _(silence)_ | Wordmark at 20% opacity behind. Zoom thumbnail (lower-third, blurred). | Pad cuts at 1.0s. Room-tone leak from Zoom thumbnail begins (synthesized buyer murmur, low, -28 dB). | Cross-cut to full S1 frame at 1.5s. |
| **S1** | 1.5–3.0s | Full Zoom-style call view fills center 60% of frame. Buyer (neutral pose, slight loop) on left side of split, AE-side (just a chrome avatar placeholder, no face) on right. Audio waveform strip at top of Zoom view, faintly visible. | _(silence — body VO begins at 3.0s)_ | _(no text overlay yet — let the scene breathe)_ | Room-tone continues -28 dB. Music bed `tense-cinematic.mp3` enters at 1.5s, -22 dB (lower than V2-01/02 because room-tone shares the bed). | Hold into S2. |
| **S2** | 3.0–8.0s | Zoom view continues. Buyer audio drop #1: synthesized voice says "How soon could we start?" (3.0–3.8s). Glass card #1 slides in from right at 4.5s containing the quote. At 7.0s, the card flips (3D Y-axis rotate, 700ms) revealing `= YES.` on the back. Chrome stamp `SIGNAL 1` at top-right (must respect top 14% safe zone). | "Signal one. She just asked when you could start. That's not a question. That's a yes." (3.5–8.0s VO) | Glass card #1: `"How soon could we start?"` (front) → `= YES.` (back after flip at 7.0s). Top-right stamp: `SIGNAL 1`. | Synthesized buyer voice (ElevenLabs preferred — see §7) at 3.0–3.8s, -8 dB. `glass-chime.wav` on card snap (4.5s). `detect-ping.wav` on flip (7.0s). | Glass card #1 slides off-screen left at 8.0s. |
| **S3** | 8.0–13.0s | Same Zoom view. Buyer audio drop #2: "My team will need to see this." (8.0–8.9s). Glass card #2 slides in from right at 9.5s. Flips at 12.0s revealing `= YES.` Chrome stamp `SIGNAL 2`. | "Signal two. She mentioned the team. She's already imagining onboarding. That's a yes." (8.5–13.0s VO) | Glass card #2: `"My team will need to see this."` → `= YES.` Top-right stamp: `SIGNAL 2`. | Synthesized buyer at 8.0–8.9s. `glass-chime.wav` on card snap (9.5s). `detect-ping.wav` on flip (12.0s). | Card #2 slides off at 13.0s. |
| **S4** | 13.0–18.0s | Same Zoom view. Buyer audio drop #3: "...let me see the pricing again." (13.0–14.2s, slightly delayed delivery suggesting hesitation). Glass card #3 slides in at 14.5s. Flips slower (1.5s flip vs. 1.0s) at 16.5s revealing `= YES.` Chrome stamp `SIGNAL 3`. | "Signal three. She paused after the price. She's doing the math. That's a yes." (13.5–18.0s VO) | Glass card #3: `"...let me see the pricing again."` → `= YES.` Top-right stamp: `SIGNAL 3`. Card flip slower (1.5s) intentionally — the pause IS the signal. | Synthesized buyer at 13.0–14.2s. `glass-chime.wav` on card snap (14.5s). `detect-ping.wav` on flip (16.5s) — slightly delayed, syncing with the slower flip. | Cross-cut to S5 — full UI reveal. |
| **S5** | 18.0–20.0s | iPhone 17 mockup, 4°/-2° tilt, 380px wide, centered. Inside the phone screen: full Tonvo UI showing all 3 captured signals stacked vertically with timestamps. Final glass card pulses with: `ASK FOR THE CLOSE.` | "Three yeses in thirty seconds. Tonvo caught all three. You closed." (18.0–20.0s VO) | Phone screen: 3-signal stack with timestamps + glass card overlay: `ASK FOR THE CLOSE.` (Inter 700, chrome plate). | `reverse-lift.wav` on UI reveal (18.0s). `detect-ping.wav` on glass-card pulse (19.0s). `glass-chime.wav` lo on final stamp. | Cross-cut to S6. |
| **S6** | 20.0–21.0s | Black bg. Typewriter end-card center. **MATCHES LANDING `.hero-headline2` EXACTLY** (commit `9f509ce`): Inter sans **font-weight 200 (NOT mono)**, letter-spacing `-0.025em`, silver-sweep gradient via `-webkit-background-clip: text`, caret blink `0.9s steps(1)`, typeSpeed 42 ms/char, size ≈ 48-56px. See `08-tooling/tech-decisions-v2.md` §3. | _(silence — let it land)_ | `Without missing a signal.` (Inter 200 light + silver-sweep gradient, types in 1.0s, caret blink). | `tap-bright.wav` per word stamp (4 ticks, 20.0 / 20.25 / 20.5 / 20.75s). | Cross-dissolve to S7. |
| **S7** | 21.0–22.0s | CTA end-card. Logo + chrome CTA pill + sub-line. | "Try free → tonvo.co." (21.0–22.0s) | Logo + `Try Free → tonvo.co` + `30s setup · no card.` | `air-swoosh.wav` on logo. `text-pop.wav` on pill. Music + room-tone fade -∞. | End. |

**Pacing audit:** S2/S3/S4 are 5s each — slightly over the ≤6s scene cap but at the boundary. Each contains a full buyer-line + VO-line + card-flip beat, which justifies the length. Total 22.0s, within cap.

**Card flip timing — MANDATORY synchronization:**
- Card #1: snap-in 4.5s, flip 7.0s (1.0s flip duration)
- Card #2: snap-in 9.5s, flip 12.0s (1.0s flip duration)
- Card #3: snap-in 14.5s, flip 16.5s (1.5s flip duration — slower, intentional, the pause IS the signal)

Each flip lands ~1s after the buyer audio ends. If flips precede audio, product looks scripted. If flips lag >1s, product looks slow. Tight sync mandatory.

---

## 4. Asset list

### Visuals required

| Asset | Source | Status | Notes |
|---|---|---|---|
| Zoom-style call view (neutral buyer pose, ~20s loop) | Two paths: (a) Pixabay royalty-free portrait/zoom-call loop (slight motion, no specific speech). (b) AI-generated via Kling 3.0 (neutral buyer, slight head movements, no lip-sync needed). (c) Reuse `assets/demo-session.mp4` ONLY if it contains a viewable buyer thumbnail — confirm with tech-director. | NOT IN REPO — must source/generate. | **The thumbnail must read as live, not as a screenshot.** If thumbnail looks static, the entire ad collapses. Tech-director picks lane based on quality bar. |
| Audio waveform strip (top of Zoom view) | Build inline as animated SVG (50 vertical bars, randomized heights, 3 spike moments aligned to buyer audio drops). Reuse from V1 brief-D S2 waveform primitive. | REUSE pattern (new content). | Spikes at 3.4s / 8.4s / 13.6s aligned to buyer-line midpoints. |
| iPhone 17 mockup with full Tonvo UI showing 3-signal stack | `IPhone17Mockup` component. Inside: HTML composite showing 3 captured signals with timestamps + `ASK FOR THE CLOSE.` glass card. | Producible in-engine (new composite over existing mockup). | Per memory rule. Use HF rendering to build the in-phone UI. |
| Glass card primitive with 3D Y-axis flip | Ad11 glass-card + new GSAP/Motion 3D rotateY animation. Card front/back textures. | Producible in-engine. Minor new motion code (~2 hours GSAP). | Card 3 uses slower 1.5s flip (intentional). |
| Chrome `SIGNAL 1/2/3` stamps (top-right corner) | Reuse Ad11 chrome-text primitive. | REUSE | Must respect top 14% safe zone. |
| Tonvo logo | `assets/logo-tonvo-remove.png` | REUSE | |
| Typewriter end-card | Inline HTML + GSAP type-in. **Matches landing typewriter line 3 verbatim.** | Producible in-engine. | Pull CSS from landing repo. |
| CTA pill | Ad11 S6 primitive | REUSE | |

### Audio

| Track | File | Voice | Lines / notes |
|---|---|---|---|
| Synthesized buyer audio (3 drops) | `assets/audio/v2-03_buyer_1.mp3`, `_2.mp3`, `_3.mp3` | **ESCALATE TO TECH-DIRECTOR.** Option A: Edge TTS (Jenny Neural — different from VO Aria, to differentiate voices). Option B: ElevenLabs (off-stack, ~$0.30 total, but more natural buyer cadence with hesitation in drop #3). | Drop 1: "How soon could we start?" (0.8s). Drop 2: "My team will need to see this." (0.9s). Drop 3 (slower delivery): "...let me see the pricing again." (1.2s, with audible pause after the ellipsis). All tagged `[dramatization — synthesized buyer lines, not real call clips]` per V1 Resolution-1. |
| VO segment 1 (S2) | `assets/audio/v2-03_s2.mp3` | Edge TTS · Aria Neural, present-tense play-by-play, quick cadence, flat declarative on "That's a yes." | "Signal one. She just asked when you could start. That's not a question. That's a yes." |
| VO segment 2 (S3) | `assets/audio/v2-03_s3.mp3` | Aria Neural | "Signal two. She mentioned the team. She's already imagining onboarding. That's a yes." |
| VO segment 3 (S4) | `assets/audio/v2-03_s4.mp3` | Aria Neural | "Signal three. She paused after the price. She's doing the math. That's a yes." |
| VO segment 4 (S5) | `assets/audio/v2-03_s5.mp3` | Aria Neural | "Three yeses in thirty seconds. Tonvo caught all three. You closed." |
| VO segment 5 (S7) | `assets/audio/v2-03_s7.mp3` | Aria Neural | "Try free → tonvo.co." |
| Music bed | `assets/audio/tense-cinematic.mp3` | Pixabay | -22 dB (lower than V2-01/02 because room-tone shares the bed). |
| Room tone | Synthesized low murmur (ffmpeg-generated brown noise + low-pass filter @ 200Hz) | Producible in-engine. | -28 dB. Continuous from 1.0s through 21.0s. |
| SFX | `tap-bright.wav`, `sub-impact.wav`, `glass-chime.wav`, `detect-ping.wav`, `reverse-lift.wav`, `air-swoosh.wav`, `text-pop.wav` | All in `sfx-apple/` | |
| Voice direction | — | — | Aria: present-tense narrator, AE-to-AE in real time, NOT coach-to-student. Buyer voice: different speaker, slightly muffled (Zoom-call quality), drop #3 has audible hesitation. |

---

## 5. Hook spec (frame-accurate 0.0–1.5s)

| Frame range (30fps) | Timestamp | Visual | Audio |
|---|---|---|---|
| 0 | 0.00s | Black bg. `3` character of wordmark begins fade-up. | `tap-bright.wav` + `sub-impact.wav` layered. -3 dB. |
| 3 | 0.10s | `· 30` characters fade up. | Second `tap-bright.wav` + `sub-impact.wav` layered. |
| 6 | 0.20s | `· WATCH` characters fade up. Full wordmark visible. | Third `tap-bright.wav` + `sub-impact.wav` layered. |
| 6–9 | 0.20–0.30s | Wordmark holds at 100% opacity. | Ambient pad begins fade-in (-∞ → -22 dB across 9–30 frames). |
| 9–30 | 0.30–1.00s | Wordmark holds. | Pad sustains. |
| 30 | 1.00s | Wordmark begins scaling 100→90% + opacity 100→20%. Zoom thumbnail begins fading up at 50% scale, lower-third. | Pad cuts at 1.00s exactly. Room-tone begins fade-in. |
| 30–45 | 1.00–1.50s | Wordmark fades to 20% behind. Zoom thumbnail completes fade-up. | Room-tone reaches -28 dB by 1.50s. |

**Critical timing notes:**
- The 3 chrome ticks at 0.0/0.1/0.2s establish the "three" of "three signals" rhythmically before the body delivers them.
- The pad-cut + room-tone-leak transition at 1.0s is the "we're now inside the call" audio cue. This sells the live-frame premise.
- DO NOT overlap chrome ticks with the pad — ticks must read discretely.

---

## 6. CTA spec

| Element | Value |
|---|---|
| End-card duration | 1.0s (21.0–22.0s) |
| Background | `#09090b` + #grid-bg at 0.07 opacity |
| Logo | `logo-tonvo-remove.png` at 96px, top-third |
| CTA pill | "Try Free → tonvo.co" — chrome plate, Inter 700, 26px |
| Sub-line | "30s setup · no card." — Inter 400, 18px, `#a1a1aa` |
| Button (Ads Manager) | `Try for Free` |
| Position (safe zone) | Logo y=480, pill y=860, sub-line y=920. Bottom 14% reserved. |
| Animation | Logo air-swoosh (200ms). Pill text-pop (200ms). |

---

## 7. Pipeline routing

**HyperFrames default WITH 3 tech-director gates — heaviest production lift in V2 batch.**

Default stack handles:
- All visual primitives (chrome wordmark, glass cards, iPhone 17 mockup, typewriter, CTA)
- Edge TTS Aria for all narrator VO
- `tense-cinematic.mp3` for music
- Existing `sfx-apple/*.wav` for all SFX

**Tech-director escalation needed for:**
1. **Zoom thumbnail asset sourcing (S1–S4 background).** Three lanes: (a) Pixabay royalty-free Zoom-call loop, (b) Kling 3.0 generation (~$1.40 for 20s — off v1 free-stack lock), (c) reuse `assets/demo-session.mp4` if it contains a usable buyer thumbnail. Tech-director must confirm which lane and verify the thumbnail reads as live in mobile preview. This is THE single biggest production risk.
2. **Synthesized buyer voice (3 drops).** Edge TTS Jenny Neural is free but cadence is uniform — may make drop #3 hesitation read as edit-glitch rather than character-pause. ElevenLabs would be ~$0.30 total and far more natural for the hesitation drop. Tech-director picks lane and tags asset metadata with `[dramatization]` per V1 Resolution-1.
3. **3D Y-axis card flip animation.** Not in V1 primitive set — GSAP-3D or Motion can handle it, but needs ~2 hours of new motion code. Tech-director confirms framework choice (GSAP 4 vs. Motion) and tests that flip lands on-beat with audio at 30fps.
4. **Landing typewriter CSS exact-match** (S6). Same gate as V2-01 — confirm font/cadence parity with landing repo.

---

## 8. Risks / pre-flight checks

| Risk | Mitigation |
|---|---|
| **Zoom thumbnail reads static / fake** | Mitigation: source from Pixabay if a clean royalty-free Zoom-style loop exists; otherwise Kling generation with explicit prompt for slight head movement, eye blinks, neutral expression. Fallback: an abstract waveform-only treatment (no thumbnail) with the card system carrying the load — but this weakens the "live" claim. Tech-director call. |
| **Card flips lag/lead audio** | Frame-lock all 3 flips: card 1 flip at frame 210 (7.0s), card 2 flip at frame 360 (12.0s), card 3 flip at frame 495 (16.5s). Audio drops must complete BEFORE flip starts. Pre-flight: render with audio timeline visible, scrub frame-by-frame to confirm sync. |
| **Drop #3 hesitation reads as glitch** | If using Edge TTS Jenny: insert explicit 200ms silent gap after "...let me see" and add a slight pitch dip on the final clause. If using ElevenLabs: prompt for hesitation directly. Tag asset metadata clearly. |
| **3-signal stack on phone screen at S5 is too dense** | Pre-flight: render at 1080×1920, zoom to phone screen, confirm each signal line + timestamp is legible at thumbnail. If cramped, reduce font size by 2pt or stack 2-by-1 instead of 1-by-3. |
| **Music + room-tone + VO + SFX mix gets muddy** | Strict levels: music -22 dB, room-tone -28 dB, VO 0 dB (reference), SFX -6 dB, buyer audio -8 dB. EQ room-tone to <300Hz only (low-pass) so it doesn't compete with VO mid-range. |
| **Typewriter end-card font drift** | Same V2-01/02 gate. Pull from landing. |
| **Top-right `SIGNAL 1/2/3` stamp violates safe zone** | Position stamps at y=300 (within middle 72%). Confirm with safe-zone overlay pre-render. |
| **VO timing drift across 4 segments** | Pre-render all 4 VO segments and lock timestamps. Edge TTS variance ~±50ms per segment. Add 200ms fade-out per segment. |
| **18s "all 3 signals" stack reveal misreads as a fourth signal** | Pre-flight: confirm the iPhone UI at S5 shows the SAME three signals from S2/S3/S4 with their original quote text — not new content. Continuity matters. |

---

## 9. Anti-patterns (must NOT appear)

- **No retrospective POV.** No "last week" / "yesterday's call" framing. This ad is live present-tense — the proof is happening on-screen as the viewer watches. Brief §3 names this as the distinction from V1's POV-$50K.
- **No "AI" / "intelligent" / "smart" / "next-gen" / "powerful"** anywhere.
- **No percentage stat** anywhere in the cut. The three on-screen signals ARE the proof.
- **No founder-on-camera.**
- **No buyer face close-up.** Zoom thumbnail is blurred / neutral / lower-third — observer framing, not starring framing.
- **No music drowning room-tone.** Room-tone at -28 dB must be perceptible during the buyer audio drops to sell the "inside the call" premise.
- **No card flips that precede their buyer audio.** Audio leads, card responds with ~1s gap. Product responding to call, not scripting it.
- **No testimonials / named operators.** Angle G doesn't carry social proof.
- **No emoji.**
- **No demo-book CTA.**
- **No second hook layer.** The chrome `3 · 30 · WATCH` wordmark IS the hook — don't add a second caption underneath.
- **No font deviation from Inter sans.** Inter only (200 light, regular, italic, 600, 700) — S6 typewriter uses **Inter 200 + silver-sweep gradient matching landing `.hero-headline2`**, NOT Inter Mono. No serif anywhere in V2-03 (unlike V2-02's deliberate editorial S1).

---

_End V2-03 brief. Heaviest lift — 3 days HF. Ships AFTER V2-02 in the wave-1 sequence. Once V2-03 spine is locked, V2-04 (1:1 reformat) follows within 24h._

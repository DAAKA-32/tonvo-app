# Brief D — Stop Pitching From Memory

_Creative Director: Claude Opus · Date: 2026-05-03 · Status: NEW HyperFrames build (motion + static)_

**Format:**
- **Static (Pattern 6 contrarian one-liner):** 1080×1080 (1:1) + 1080×1350 (4:5) — primary lead
- **Motion video:** 1080×1920 (9:16 Reels) — secondary lead
**Duration:** Static = N/A. Motion = 24s.
**Hook (first 1.5s):** "Your playbook is a PDF nobody opens." (Hook 3, copy.md — recommended cold lead per copywriter notes — fuses swipe-file patterns #14 and #15)
**Static lead:** "Stop pitching from memory." (Hook 1 + Headline C from copy.md, on white-on-black per Pattern 6)
**Lead copy combo (per copywriter):** Hook 3 + Primary B + Headline C — for the static. Hook 2 ("POV: it's Friday, 3 calls, 0 deals") + Primary A + Headline C — for the motion video alternate.
**Targets:** ICP-1 (quota-slipping AE), ICP-3 (founder)

---

## Static brief (Pattern 6 contrarian one-liner) — primary lead

This is the cleanest distinctive ad in a feed full of generic AI-for-sales ads. Per swipe-file Pattern 6, white-on-black, single bold line, no image. Cheap to make, scales infinitely, easy to A/B.

### Layout (1080×1080 1:1, also export 1080×1350 4:5)

| Element | Specification |
|---------|---------------|
| Background | `#09090b` (Tonvo dark bg) — NOT pure black. Faint grid background at 0.07 opacity (matches Ad11 #grid-bg primitive) |
| Headline (primary, ~70% of vertical real estate) | "Your playbook is a PDF nobody opens." — Inter 800, 88px, `#fafafa` warm white, letter-spacing -0.04em, line-height 1.05, max 720px width, center stack. |
| Headline accent | Final word "opens." in italic muted (`#a1a1aa`) — visual punch on the contrarian. |
| Sub-line | "Tonvo is the playbook, in the call." — Inter italic 32px, `#a1a1aa`, top-margin 36px. The chrome silver-sweep applies to "in the call." (chrome-text class). |
| Logo + CTA footer | Logo 64px (the small variant of `logo-tonvo-remove.png`) + "Try Free → tonvo.co" Inter 600, 22px, `#a1a1aa`, bottom-aligned with 56px padding. |

### Static B (Hook 1 alternate — kept on standby)

- Headline: "Stop pitching from memory." (Hook 1 + Headline C)
- Sub-line: "Tonvo flags the objection and the line that closes it. Live."
- Same layout, same primitives.

### Static C (Primary A alternate — slightly shaming, flagged for tone)

- Headline: "You walked into your last 12 demos with a deck and a vibe."
- Sub-line: "The pros use a copilot. Try free → tonvo.co"
- Same layout. Per copywriter concern: this variant tests the upper limit of "slightly cocky" — flag for Emilien before launch. If too sharp, drop and run only Static A and B.

---

## Motion video scene plan (1080×1920 9:16 — secondary lead)

24-second all-on-canvas build. No faces. Per strategy doc Angle D: "I recommend the all-on-canvas version — faster to ship, on-brand, no licensing risk." Confirmed.

| # | Time | Scene | VO line | On-screen text | SFX | Visual notes |
|---|------|-------|---------|----------------|-----|--------------|
| S0 | 0–1.5s | Pre-hook pattern interrupt — POV Friday | "POV: it's Friday." | "POV: Friday" (italic muted) → "3 calls" (white) → "0 deals." (chrome on "0") | sub-impact, ambient-rise, tap-bright, tap-mid, text-pop | Single-stack vertical, three lines stagger in at 0.3s spacing. The chrome-zero is the magnet — same chrome primitive as Ad11 $50,000. Reuses Hook 2 from copy.md as the cold open (per copywriter, this is the strongest emotional cold-open for ICP-1). |
| S1 | 1.5–6s | Setup — the playbook problem | "Your playbook is a PDF nobody opens." | Eyebrow "THE PROBLEM" → "Your playbook" (white) → "is a PDF" (italic muted) → "nobody opens." (chrome) | transition-soft, tap-bright, tap-mid, reverse-lift, air-swoosh | Reuses Ad11 S1 vertical-stack primitive. The chrome line is the punchline. |
| S2 | 6–13s | Tension — chrome text + audio waveform + missed-objection beat | "You walked into your last twelve demos with a deck and a vibe. Your competition didn't." | "Last 12 demos" → audio-waveform graphic (50px tall, full-width, animated peaks) with 3 timestamps where the waveform spikes red (missed-objection markers) → 3 strike-line cards: "objection missed" / "buying signal missed" / "close attempt missed" each with strike line | transition-soft, tap-bright, tap-mid, tap-low (×3), strike (×3), detect-ping-lo (×3 — quiet ping at each waveform spike) | NEW PRIMITIVE: animated audio waveform. Build as a CSS-animated SVG (50 vertical bars, randomized heights, 3 designated bars at known timestamps spike red and stay red). Spikes sync to detect-ping-lo. Then the 3 strike-line cards from Ad11 S2 reuse exactly — no change. |
| S3 | 13–20s | Tonvo solution + iPhone 17 mockup | "Tonvo is the playbook. In the call. Live." | TONVO · LIVE pill → "The playbook, in the call." (chrome) → iPhone17 with `assets/demo-session.mp4` → "Live coaching only you can see." pill | transition-soft, tap-bright, tap-mid, reverse-lift, air-swoosh, detect-ping (×3 at 15 / 16.2 / 17.4 within S3) | iPhone17Mockup wrap (per memory rule). Same primitive as Ad11 S3 — 380px width, 4°/-2° rotation, dynamic island, demo-session.mp4 source. |
| S4 | 20–22s | Proof — single tight stat | "Twelve hundred and forty-seven closers. Same pitch. Better close." | "1,247 closers using Tonvo" badge → italic line "+27% close rate · same pitch" | transition-soft, sub-impact, tap-bright, glass-chime | Compressed proof beat — only 2 seconds. Single badge + single italic line. Reuses Ad11 S4 badge primitive without the testimonials (we want to land on slogan fast). |
| S6 | 22–24s | Slogan + CTA | "Never miss a word with Tonvo. Try free at tonvo.co." | Logo → "Never miss a word" (chrome) / "with Tonvo" → "Try Free →" pill → "30s setup · no card" → "tonvo.co" | transition-soft, air-swoosh, sub-impact, tap-mid, text-pop, glass-chime, text-pop, tap-bright | Identical to Ad11 S6. **Slogan locked.** |

---

## Audio plan

- **VO:** Edge TTS Aria Neural — script saved as `assets/audio/script-D.txt`. Render 5 segments:
  - `assets/audio/ad-d_s0.mp3` (1.0s — "POV: it's Friday." — short cold-open VO, optional, can be text-only)
  - `assets/audio/ad-d_s1.mp3` (3.5s)
  - `assets/audio/ad-d_s2.mp3` (5.5s)
  - `assets/audio/ad-d_s3.mp3` (5.5s)
  - `assets/audio/ad-d_s4.mp3` (1.7s)
  - `assets/audio/ad-d_slogan.mp3` (2.0s) OR reuse `slogan_final.mp3` from Ad11 if timing aligns
- **VO buffer rule:** extend each segment ve by +1.0s, fade-out 250ms
- **Music bed:** `assets/audio/tense-cinematic.mp3` at -18dB
- **SFX library:** all from `assets/audio/sfx-apple/*.wav` — no new SFX. Waveform spikes in S2 use `detect-ping-lo.wav` at low volume (0.28) — quiet, suggestive, not alarming.

---

## Reuse from existing ads

- **Visual base:** Fork from `Tonvo-Ad-HF/index.html` (Ad11 9:16)
- **iPhone mockup video:** `assets/demo-session.mp4`
- **Logo:** `assets/logo-tonvo-remove.png`
- **SFX library:** `assets/audio/sfx-apple/*.wav`
- **Music bed:** `assets/audio/tense-cinematic.mp3`
- **Reused primitives:** Ad11 S0 vertical-stack, Ad11 S1 chrome-number-stack, Ad11 S2 strike-line cards, Ad11 S3 iPhone17Mockup, Ad11 S4 badge, Ad11 S6 slogan stack, all chrome silver-sweep primitives, all glass cards
- **Static primitives:** Ad11 #grid-bg background, Inter 800/600/italic, chrome-text class
- **iPhone17Mockup wrap:** Ad11 S3 (per memory rule)

---

## Producer notes

- **Fork base for motion:** `Tonvo-Ad-HF/` (Ad11 9:16) → copy directory to `Tonvo-Ad-HF-stop-pitching/`
- **What's NEW (build cost):**
  1. **S2 audio waveform graphic** — only new visual primitive. Build as inline SVG with 50 vertical bars, randomized base height 8-30px, 3 designated bars (positions 12, 28, 41) animate from green to red on cue with detect-ping-lo. ~2 hours of CSS+GSAP.
  2. New VO segments (5 files, ~17s total render time, Edge TTS free)
  3. Text content per scene
- **What's reused (no new code):** S0, S1, S3, S4, S6, all SFX timing, music, GSAP eases, fonts, colors
- **Static deliverables (3 variants):** export as PNG via headless Puppeteer at 1080×1080 + 1080×1350. ~30 min job. Can reuse `scripts/generate-carousels/` infrastructure (per memory rule — Tonvo carousel generator).
- **Production estimate:** Statics = 0.5 day. Motion = 1.5 days (waveform primitive + new VO + retimings). Total under the 1-week production cap.
- **No on-camera actors. No location shoots. No new SFX recordings. All-on-canvas.** ✅
- **iPhone17Mockup wrap on S3** per memory rule.

---

## Variants for placement adaptation

| Aspect | Placement | Status | Differences from primary |
|--------|-----------|--------|--------------------------|
| Static 1:1 (1080×1080) | Feed | NEW — primary lead (Static A) | The Pattern 6 white-on-bg one-liner. Three text variants (A/B/C above). |
| Static 4:5 (1080×1350) | Feed (preferred) | NEW — primary lead | Same statics, taller frame. Use the extra height to upsize the headline 88px → 100px. |
| 9:16 (1080×1920) | Reels, Stories | NEW — secondary lead (motion) | The 24s motion video. |
| 1:1 (1080×1080) motion | Feed motion | OPTIONAL | Only if static under-performs and motion is needed in feed. Drop S0, retime to 22s, shrink iPhone17 to 340px. |

## Concerns for copywriter

- **Static C ("deck and a vibe")** is flagged in copy.md notes for tone-check before launch. Recommend Emilien reviews. If too sharp, drop Static C and run only A and B.
- **Hook 1 was renamed** to "Stop pitching from memory" when the angle was renamed (per orchestrator v1.1 update) — original "Stop winging it" was the weakest of the three per copywriter concern #4. Current Hook 1 is the angle-name verbatim and the lead static-headline.
- **Slogan in S6 motion is delivered in a 2s window** (22–24s) which is at the lower bound of the 4s slogan cap noted in creative-director.md. If the producer reads it as too compressed, extend total motion duration to 26s and give S6 a full 4s — that's within the 24-32s cap.

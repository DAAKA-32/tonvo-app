# Brief C — The Gap

_Creative Director: Claude Opus · Date: 2026-05-03 · Status: NEW HyperFrames build_

**Format:** 1080×1920 (9:16 Reels) — primary
**Variants needed:** 1080×1080 (1:1 Feed) — secondary. Static export of S2 (23% vs 41%) for static-ad placement.
**Duration:** 28s
**Hook (first 1.5s):** "Your top rep isn't smarter." (Hook 1, copy.md — recommended cold lead per copywriter notes)
**Lead copy combo (per copywriter):** Hook 1 + Primary A + Headline C
**Targets:** ICP-2 (top-rep hunter) primary

---

## Scene plan (1080×1920 9:16 — primary)

| # | Time | Scene | VO line | On-screen text | SFX | Visual notes |
|---|------|-------|---------|----------------|-----|--------------|
| S0 | 0–1.5s | Pre-hook pattern interrupt | (text only — no VO) | "Your top rep isn't smarter." (chrome on "smarter") | sub-impact, ambient-rise, tap-bright, text-pop | Single-line chrome punch. White-on-bg, italic muted "isn't" — chrome silver-sweep on "smarter." Center stack, 88px font (matches Ad11 S0 pre-question scale). |
| S1 | 1.5–6.5s | Setup — "she just hears what you don't" | "She's not smarter. She just hears what you don't." | Eyebrow "THE TOP REP" → "She just hears" (white) → "what you don't." (chrome) | transition-soft, tap-bright, tap-mid, reverse-lift | Same vertical stack primitive as Ad11 S1 ("you just lost / $50,000 / in deal value"). Substitute the chrome line for "what you don't." — preserves the chrome-number visual rhythm without inventing a new primitive. |
| S2 | 6.5–14s | Split-screen 23% vs 41% (the gap) | "Your close rate: twenty-three percent. Top rep: forty-one percent. Same calls. Same product. One thing different." | Top half: glass card "YOU" / chrome "23%" / italic muted "close rate" / smaller line "stalls on price" with strike. Bottom half: glass card "TOP REP" / chrome "41%" / italic muted "close rate" / smaller line "lands the close" with green check. Then a chrome line slides in between: "Same calls. Same product." | transition-soft, tap-bright, tap-mid, tap-low (×4), strike (×1 — on the "stalls on price" line, lower-volume soft strike), detect-ping-hi (×1 on the green check) | NEW SCENE COMPOSITION — split-screen using existing primitives (glass cards + chrome text + strike + detect-ping). No new visual language. The two glass cards stack vertically in 9:16 (top = YOU, bottom = TOP REP). 23% chrome scales 160px, 41% chrome scales 200px (the bigger number visually wins the screen — that's the point). Strike line on "stalls on price" reuses Ad11 S2 strike primitive. Green check reuses Ad11 S3 phone-card check primitive. |
| S3 | 14–22s | Tonvo solution + iPhone 17 mockup (the reveal) | "The only thing different is what's running in her browser. It's Tonvo." | TONVO · LIVE pill → "What's running in her browser." (chrome) → iPhone17 with `assets/demo-session.mp4` → "Run what #1 runs." pill | transition-soft, tap-bright, tap-mid, reverse-lift, air-swoosh, detect-ping (×3 at 16.5 / 17.7 / 18.9) | iPhone17Mockup wrap (per memory rule). Same primitive as Ad11 S3 — 380px width, 4°/-2° rotation, demo-session.mp4 source, dynamic island. The reveal moment is when the iPhone fades in over the split-screen residue (0.5s crossfade). |
| S4 | 22–25.5s | Proof — short cohort line + 1 testimonial | "She closed eight of ten demos this quarter. Same pitch she had last year." | Single glass card: "Sarah · Senior Closer · mid-market" / italic stat "8 / 10 demos this quarter" / muted line "+27% from same pitch" | transition-soft, sub-impact, tap-bright, glass-chime, tap-mid | Reuse the testimonial-row primitive from Ad11 S4. ONLY ONE testimonial here (not three) — keeps the focus on the "she" character introduced in S2. |
| S6 | 25.5–28s | Slogan + CTA | "Never miss a word with Tonvo. Try free at tonvo.co." | Logo → "Never miss a word" (chrome) / "with Tonvo" → "Try Free →" pill → "30s setup · no card" → "tonvo.co" | transition-soft, air-swoosh, sub-impact, tap-mid, text-pop, glass-chime, text-pop, tap-bright | Identical to Ad11 S6. **Slogan locked.** |

---

## Audio plan

- **VO:** Edge TTS Aria Neural — script saved as `assets/audio/script-C.txt`. Render 5 segments:
  - `assets/audio/ad-c_s1.mp3` (4.3s)
  - `assets/audio/ad-c_s2.mp3` (6.0s — the longest beat, "23% / 41% / one thing different")
  - `assets/audio/ad-c_s3.mp3` (6.5s)
  - `assets/audio/ad-c_s4.mp3` (3.3s)
  - `assets/audio/ad-c_slogan.mp3` (2.5s) — OR reuse `slogan_final.mp3` from Ad11 master if scene timing aligns
- **VO buffer rule:** extend each segment ve by +1.0s, fade-out 250ms
- **Music bed:** `assets/audio/tense-cinematic.mp3` at -18dB (data-volume ≈ 0.30)
- **SFX library:** all from `assets/audio/sfx-apple/*.wav` — no new SFX. Note S2 reuses `strike.wav` at lower volume (0.30) for the "stalls on price" line, and `detect-ping-hi.wav` for the green-check moment.

---

## Reuse from existing ads

- **Visual base:** Fork from `Tonvo-Ad-HF/index.html` (Ad11 9:16) — closest scene primitive match
- **iPhone mockup video:** `assets/demo-session.mp4`
- **Logo:** `assets/logo-tonvo-remove.png`
- **SFX library:** `assets/audio/sfx-apple/*.wav` (15 files)
- **Music bed:** `assets/audio/tense-cinematic.mp3`
- **Glass card primitive:** Ad11 S2/S4
- **Chrome number primitive:** Ad11 S1 / Ad10 S1
- **Strike primitive:** Ad11 S2
- **Green-check primitive:** Ad11 S3 phone-card .check
- **Testimonial-row primitive:** Ad11 S4
- **iPhone17Mockup wrap:** Ad11 S3 (per memory rule)

---

## Producer notes

- **Fork base:** `Tonvo-Ad-HF/` (Ad11 9:16) → copy directory to `Tonvo-Ad-HF-gap/`
- **What's reused (no new code):** S0 stack, S1 stack, S3 iPhone mockup, S4 testimonial primitive, S6 slogan stack, all SFX timing patterns, music, all GSAP eases
- **What's NEW (build cost):**
  1. **S2 split-screen layout (only new composition):**
     - 9:16: vertical split (YOU on top, TOP REP on bottom). Each side gets its own glass-card frame (full-width, 720px tall), centered chrome number, italic close-rate label, smaller line with strike or check
     - Transition between halves: a chrome divider line that slides in mid-S2 ("Same calls. Same product.")
  2. New VO segments (5 files, ~22s total render — Edge TTS, free, 5min job)
  3. New text content per scene (no new fonts, no new colors)
- **What's NEW only at the asset level:** 5 VO mp3s. Nothing else.
- **Production estimate:** 2-3 days (per strategy doc). 1.5 days for the S2 split-screen + new VO + GSAP retimings; 0.5 day for QA pass on 9:16; 0.5 day for 1:1 reformat.
- **No on-camera actors. No location shoots. No new SFX. All-on-canvas.** ✅
- **iPhone17Mockup wrap on S3** per memory rule.

---

## Variants for placement adaptation

| Aspect | Placement | Status | Differences from primary |
|--------|-----------|--------|--------------------------|
| 9:16 (1080×1920) | Reels, Stories, in-feed Reels | NEW — primary | This is the main build |
| 1:1 (1080×1080) | Feed, Carousel | NEW — secondary | Drop S0 pre-hook (1.5s reclaim). Retime to 26s. S2 split-screen rotates from vertical-split to horizontal-split (left = YOU, right = TOP REP) — better for square framing. iPhone17 width 380px → 340px on S3. |
| Static (1080×1080) | Feed static, retargeting | NEW — tertiary | Export S2 frame as static. Single image: split horizontal, "YOU 23%" left, "TOP REP 41%" right, chrome line "Same calls. Same product. One thing different." across the bottom. Add the locked slogan at footer. Use as Pattern 6 (contrarian one-liner) static. |
| 4:5 (1080×1350) | Feed (preferred) | OPTIONAL | Only if media buyer asks. Easier than 1:1 — keep S0 (room for it), drop nothing. |

## Concerns for copywriter

**Copywriter concern #2 is handled in the video** (the "what's running in her browser" reveal lands in S3 because the iPhone mockup IS the reveal — visual punchline). For text-only placements, copywriter's recommended patch ("append '(it's Tonvo)'") is approved — that copy variant goes to the media buyer for static-ad and text-only deployments, separate from this video brief.

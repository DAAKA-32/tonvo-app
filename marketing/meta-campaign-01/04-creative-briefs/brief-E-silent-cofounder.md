# Brief E — Silent Cofounder

_Creative Director: Claude Opus · Date: 2026-05-03 · Status: NEW HyperFrames build · **RESERVE — week-2 iteration drop only if A or D underperforms on 72h read**_

**Format:** 1080×1920 (9:16 Reels) — primary
**Variants needed:** 1080×1080 (1:1 Feed) — secondary, if shipped at all
**Duration:** 26s
**Hook (first 1.5s):** "Your silent cofounder runs in your browser." (Hook 3, copy.md — recommended cold lead per copywriter notes — cleanest expression of the partnership register)
**Lead copy combo (per copywriter):** Hook 3 + Primary A + Headline A
**Targets:** ICP-3 (founder selling own product) primary
**Status:** **RESERVE — DO NOT BUILD AT LAUNCH.** Per strategy doc + copywriter honest-concern: "Ship E only if A or D underperforms on the 72h read." This brief is pre-written so production lead time is zero when the analyst signals the trigger.

---

## Scene plan (1080×1920 9:16 — primary, when triggered)

| # | Time | Scene | VO line | On-screen text | SFX | Visual notes |
|---|------|-------|---------|----------------|-----|--------------|
| S0 | 0–1.5s | Pre-hook pattern interrupt | (text only — no VO) | "Your silent cofounder" (white) → "runs in your browser." (chrome on "browser.") | sub-impact, ambient-rise, tap-bright, text-pop | Two-line center stack, 88px font. Chrome silver-sweep on the final two words. Same primitive as Ad11 S0 pre-hook. |
| S1 | 1.5–6s | Setup — solo founder pain | "You built the product. You love it. You can demo every feature. Closing is a different sport." | Eyebrow "SOLO FOUNDER" → "You built it." (white, 64px) → "Closing is a different sport." (chrome) | transition-soft, tap-bright, tap-mid, reverse-lift, air-swoosh | Vertical stack reuses Ad11 S1 primitive. The chrome line is the contrarian. |
| S2 | 6–13s | Tension — the demo→paid problem | "Your demo-to-paid is in single digits. You don't know which ninety percent you're losing." | Glass card 1: "DEMO → PAID" / chrome "single digits" / italic muted "industry pattern, not measured" — small footnote | Glass card 2 below: 3 stacked italic lines: "wrong moment to mention price?" / "missed the buying signal?" / "lost on objection handling?" each with a small "?" icon (no strike — these are open questions, not facts) | transition-soft, tap-bright, tap-mid, tap-low (×3), detect-ping-lo (×3) | Reuses Ad11 S2 glass-card primitive but inverted-tone: open questions, no strikes. Per copywriter concern #3, the "9%" number was softened to "single digits" with an "industry pattern, not measured" footnote — that footnote IS in the visual, in 12px italic muted, to keep us honest. |
| S3 | 13–21s | Tonvo solution + iPhone 17 mockup (the partner reveal) | "Every solo founder needs a cofounder. Yours just runs in your browser." | TONVO · LIVE pill → "The cofounder who closes." (chrome) → iPhone17 with `assets/demo-session.mp4` → "You pitch. Tonvo handles the read." pill | transition-soft, tap-bright, tap-mid, reverse-lift, air-swoosh, detect-ping (×3 at 15.5 / 16.7 / 17.9 within S3) | iPhone17Mockup wrap (per memory rule). Same primitive as Ad11 S3 — 380px width, 4°/-2° rotation, demo-session.mp4 source, dynamic island. The "partnership" register lands on the alive-pill copy: "You pitch. Tonvo handles the read." |
| S4 | 21–24s | Proof — founder-targeted | "Free starter. Three sessions a month. Thirty-second setup. No card." | Glass-card row, no testimonial: "FREE STARTER" badge → italic line "3 sessions / mo · 30s setup · no card" → small line "Works on Zoom, Meet, Teams" | transition-soft, sub-impact, tap-bright, glass-chime, tap-mid | Compressed proof — no human testimonials (founders trust friction-killers more than peer-stats per ICP-3 profile). Reuses badge + glass-card primitive from Ad11 S4. |
| S6 | 24–26s | Slogan + CTA | "Never miss a word with Tonvo. Sign up free at tonvo.co." | Logo → "Never miss a word" (chrome) / "with Tonvo" → **"Sign Up →" pill** (NOTE: not "Try Free →") → "30s setup · no card" → "tonvo.co" | transition-soft, air-swoosh, sub-impact, tap-mid, text-pop, glass-chime, text-pop, tap-bright | Identical to Ad11 S6 EXCEPT the CTA pill text reads "Sign Up →" not "Try Free →" — per copywriter concern #6, founders read "Sign Up" as the action they're already doing 5 times a week and click without friction. **Slogan line itself is unchanged and locked.** |

---

## Audio plan

- **VO:** Edge TTS Aria Neural — script saved as `assets/audio/script-E.txt`. Render 5 segments:
  - `assets/audio/ad-e_s1.mp3` (4.0s)
  - `assets/audio/ad-e_s2.mp3` (5.5s)
  - `assets/audio/ad-e_s3.mp3` (6.5s)
  - `assets/audio/ad-e_s4.mp3` (2.5s)
  - `assets/audio/ad-e_slogan.mp3` (2.0s — needs new VO because the CTA verbal differs slightly: "Sign up free at tonvo.co" vs Ad11's "Try free at tonvo.co")
- **VO buffer rule:** extend each segment ve by +1.0s, fade-out 250ms
- **Music bed:** `assets/audio/tense-cinematic.mp3` at -18dB. Note: tense-cinematic is the locked v1 music. For the founder-aspirational tone, this is on the edge of right vs wrong — tense-cinematic is loss-aversion-flavored. We use it anyway because the anti-strategy locks "no new music in v1" — the swap is a v2 problem if E performs.
- **SFX library:** all from `assets/audio/sfx-apple/*.wav` — no new SFX.

---

## Reuse from existing ads

- **Visual base:** Fork from `Tonvo-Ad-HF/index.html` (Ad11 9:16)
- **iPhone mockup video:** `assets/demo-session.mp4`
- **Logo:** `assets/logo-tonvo-remove.png`
- **SFX library:** `assets/audio/sfx-apple/*.wav`
- **Music bed:** `assets/audio/tense-cinematic.mp3`
- **Reused primitives:** every primitive in this brief comes from Ad11 — S0 vertical-stack, S1 chrome-number-stack (substituted text), S2 glass cards (with question-tone instead of strike-tone), S3 iPhone17Mockup, S4 badge + glass card (no testimonials), S6 slogan stack (with CTA text override only)
- **iPhone17Mockup wrap:** Ad11 S3 (per memory rule)

---

## Producer notes

- **DO NOT BUILD AT LAUNCH.** This is a reserve drop. Build trigger: analyst signals A or D underperforming on the 72h read (CPS > 1.5× target with no signups, OR hold rate < 35%).
- **When triggered, fork base:** `Tonvo-Ad-HF/` (Ad11 9:16) → copy directory to `Tonvo-Ad-HF-cofounder/`
- **What's NEW (build cost):**
  1. New VO segments (5 files, ~20s total render time, Edge TTS)
  2. Text content per scene
  3. CTA pill text override on S6 ("Sign Up →" vs "Try Free →") — single-character-string swap in the HTML
  4. NEW: footnote text element in S2 ("industry pattern, not measured") — small italic muted text below the chrome "single digits" — 12px Inter italic, color `#71717a`, ~5 minutes of HTML+CSS
- **What's reused (no new code):** every visual primitive, every animation timing, all SFX, music, GSAP eases, fonts, colors, iPhone17Mockup, demo-session.mp4
- **Production estimate:** 2 days when triggered (per strategy doc Angle E line). 1 day for VO + text + CTA-pill override + footnote; 1 day for QA pass and 1:1 reformat if needed.
- **No on-camera actors. No location shoots. No new SFX. All-on-canvas.** ✅
- **iPhone17Mockup wrap on S3** per memory rule.

---

## Variants for placement adaptation

| Aspect | Placement | Status | Differences from primary |
|--------|-----------|--------|--------------------------|
| 9:16 (1080×1920) | Reels, Stories | NEW — primary (when triggered) | This is the main build |
| 1:1 (1080×1080) | Feed | NEW — secondary (when triggered) | Drop S0 pre-hook (1.5s reclaim). Retime to 24s. iPhone17 width 380px → 340px on S3. Drop S2 footnote line (no room — leave just the chrome "single digits"). |
| Static (1080×1080) | Feed static | NOT planned | E does not have a strong Pattern 6 static — its appeal is the partnership-narrative which needs the iPhone reveal. Don't ship a static for E. |
| 4:5 (1080×1350) | Feed (preferred) | NOT planned at launch | Add only if E performs and we want feed coverage. |

## Concerns for copywriter

- **Copywriter concern #3 ("9% invented number")** is handled in the visual via the "industry pattern, not measured" footnote in S2. We're shipping with "single digits" not "9%" per copywriter's recommendation. The footnote keeps us honest if Meta's automated review crawls the visual.
- **Copywriter concern #6 (CTA button split)** is honored — E uses "Sign Up →" while A/B/C/D use "Try for Free". If the media buyer locks a single CTA across the campaign for cleaner attribution, default this brief to "Try Free →" — we lose ~5% click intent per copywriter read but gain comparability. **Decision needed from Emilien before this reserve ships.**
- **Music mismatch concern (raised by creative director, not copywriter):** tense-cinematic.mp3 is loss-aversion-flavored music; E is aspirational-partnership-flavored. Anti-strategy locks "no new music in v1" so we ship with tense-cinematic anyway. If E performs in v1, the v2 budget gets a new music bed that's brighter/warmer for the founder angle. Flag for next strategy cycle.
- **Honest concern (per copywriter):** "this angle is the weakest of the five — ICP-3 is 15% of spend and the visual primitives overlap heavily with A/B/C, so we're spending creative budget for a thin slice." Reserve status acknowledges this. We agree.

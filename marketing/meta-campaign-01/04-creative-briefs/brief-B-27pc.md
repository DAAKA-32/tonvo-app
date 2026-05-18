# Brief B — +27% Without Changing Your Pitch

_Creative Director: Claude Opus · Date: 2026-05-03 · Status: REFORMAT (Ad10 master already shipped) + claim-safe fallback_

**Format:** 1080×1440 (3:4 Feed) — already shipped as Ad10 master
**Variants needed:** 1080×1920 (9:16 Reels) — primary new deliverable. + a "no-+27%" fallback variant in case Meta auto-review flags the claim (per copywriter concern #1).
**Duration:** ~33s (Ad10 master). 9:16 variant: 30s.
**Hook (first 1.5s):** "1,247 closers. +27% close rate. Same pitch." (Hook 3, copy.md — recommended cold lead per copywriter notes)
**Lead copy combo (per copywriter):** Hook 3 + Primary B + Headline B (social-proof variant — best for cold audience)
**Targets:** ICP-2 (top-rep hunter) primary, ICP-1 fallback

---

## Scene plan (1080×1920 9:16 Reels — NEW deliverable)

| # | Time | Scene | VO line | On-screen text | SFX | Visual notes |
|---|------|-------|---------|----------------|-----|--------------|
| S0 | 0–1.5s | Pre-hook pattern interrupt | (text only — no VO) | "1,247 closers." (italic muted) → "+27% close rate." (chrome) → "Same pitch." (italic muted) | sub-impact, ambient-rise, tap-bright, tap-mid, text-pop | Three-line stack center, chrome silver-sweep on the +27% line. The number is the magnet. |
| S1 | 1.5–6.5s | The "+27%" big-number reveal | "Same calls. Same pitch. Same product. Close rate jumped twenty-seven percent." | Eyebrow "ONE THING CHANGED" → "+27%" big chrome number (220px equiv, 220 → 240 in 9:16) → "close rate" subtitle | transition-soft, tap-bright, ambient-rise, air-swoosh, reverse-lift, sub-impact, tap-mid | This is the chrome workhorse beat from Ad10. 220px chrome number, animated via background-position sweep. Same primitive as Ad11's $50K. |
| S2 | 6.5–13.5s | The "what changed" beat — 3 sames, 1 different | "Same calls. Same pitch. Same product. One thing different." (line by line) | 3 stacked glass-card rows: "Same calls" / "Same pitch" / "Same product" — each pulses in then dims to 0.45. Then 4th row pops: "ONE THING DIFFERENT" (chrome) | transition-soft, tap-bright, tap-mid, tap-low (×3), strike (×3 inverted — the strike here means "kept", soft white instead of the punishment-strike from Ad11) — note: REUSE strike.wav, lower volume to 0.30 to soften the connotation | Same scene primitive as Ad11 S2 (signal stack) but inverted polarity: items light up green-checked instead of strikethrough. Sequence at 1.2s spacing. |
| S3 | 13.5–22s | Tonvo solution + iPhone 17 mockup | "It's Tonvo. The live in-call panel that 1,247 closers run on every demo." | TONVO · LIVE pill → "The one thing." (chrome) → iPhone17 with `assets/demo-session.mp4` → "Live in-call coaching only you can see." pill | transition-soft, tap-bright, tap-mid, reverse-lift, air-swoosh, detect-ping (×3 at 15.9 / 17.1 / 18.3 within S3) | iPhone17Mockup wrap (per memory rule). Identical mockup spec to Ad11 S3 (380px width, 4°/-2° rotation, dynamic island, side buttons). |
| S4 | 22–28s | Social proof + cohort donut | "1,247 closers. Plus 27% close rate. Representative cohort." | "1,247 closers using Tonvo" badge → small donut chart (existing Ad10 primitive) showing 23% baseline → 50% Tonvo cohort segment in chrome → 3 testimonial rows: Marc $340K, Sarah 8/10, Diego 2.4× | transition-soft, sub-impact, tap-bright, tap-mid, glass-chime, tap-mid, tap-low | Donut from Ad10 reused at smaller scale (180px diameter, fits above testimonials). Glass cards identical to Ad11. |
| S6 | 28–30s | Slogan + CTA | "Never miss a word with Tonvo. Try free at tonvo.co." | Logo → "Never miss a word" (chrome) / "with Tonvo" (italic muted) → "Try Free →" pill → "30s setup · no card" → "tonvo.co" | transition-soft, air-swoosh, sub-impact, tap-mid, text-pop, glass-chime, text-pop, tap-bright | Identical to Ad11 S6 — same logo, same chrome line, same CTA pill with pulse. **Slogan locked.** |

---

## No-+27% fallback variant (Meta auto-review safety)

If Meta flags the +27% claim mid-flight, ship this variant within 24h. The hook and primary text move the number into the body and let the social proof carry the lift.

| Beat | Master 9:16 | No-+27% fallback |
|------|-------------|------------------|
| Hook (S0) | "1,247 closers. +27% close rate. Same pitch." | "1,247 closers. Same pitch. Better close rate." (Hook 2 fallback per copywriter notes) |
| Primary text | Primary B (uses 27%) | "1,247 closers run Tonvo live in every call. Same pitch. Better close rate. 30s setup. No card." (re-write — flatter, ships) |
| Headline | "Same pitch. +27% close." | "Same pitch. Better close." (24 chars) |
| S1 big number | "+27%" chrome | "1,247" chrome (people-count instead of percent — same primitive, different number) |
| S4 donut | 23% → 50% segments | Drop the donut, let testimonials carry the proof |
| Everything else | unchanged | unchanged |

This variant is a 6-hour producer turn (text + VO swaps + 2 number swaps). Pre-build it now.

---

## Audio plan

- **VO (master 3:4):** existing Ad10 VO files (likely `assets/audio/ad8_*.mp3` — confirm with producer; reuse don't re-record)
- **VO (9:16 reformat):** re-cut existing Ad10 VO segments to 30s timeline. If Ad10 VO is locked to 33.7s, ask producer to re-render the VO at 1.0× speed but trim S2 inter-card gaps from 1.2s → 0.9s
- **VO buffer rule:** extend each segment ve by +1.0s, fade-out 250ms
- **Music bed:** `assets/audio/tense-cinematic.mp3` at -18dB (data-volume ≈ 0.30) — locked v1 music
- **SFX library:** all 15 WAVs in `assets/audio/sfx-apple/` (already used in Ad10 master; copy timing offsets)
- **No new VO recordings for the master 9:16 reformat.** New VO needed only for the no-+27% fallback variant — single re-record of S1 + S4 lines, save as `assets/audio/ad10-fallback_s1.mp3` and `ad10-fallback_s4.mp3`

---

## Reuse from existing ads

- **Visual base:** `c:\Users\emili\OneDrive\Documents\M1001\Code\Tonvo-Ad-HF-27pc\index.html` (Ad10) — fork wholesale for 9:16
- **iPhone mockup video:** `assets/demo-session.mp4` (same source as Ad11)
- **Logo:** `assets/logo-tonvo-remove.png`
- **SFX library:** `assets/audio/sfx-apple/*.wav`
- **Music bed:** `assets/audio/tense-cinematic.mp3`
- **VO files:** existing Ad10 VO segments at `assets/audio/ad8_s1.mp3` … `ad8_s4.mp3` + `slogan_final.mp3` (note: filenames are `ad8_*` because the script in `Tonvo-Ad/video/generate-vo-ad8.mjs` named them after the original Ad8 codename — same files, just legacy naming)
- **Donut chart primitive:** native to Ad10 — keep at smaller scale in the 9:16 reformat

---

## Producer notes

- **Fork base:** `Tonvo-Ad-HF-27pc/index.html` (Ad10 3:4 master) → copy directory to `Tonvo-Ad-HF-27pc-9x16/`
- **What to adapt for 9:16:**
  1. `<meta name="viewport">` width=1080, height=1920
  2. `html/body { width: 1080px; height: 1920px }`
  3. `#root { width: 1080px; height: 1920px; data-width="1080" data-height="1920" }`
  4. Re-stack S1 vertically with more breathing room — chrome number scales 220px → 240px (more vertical real estate)
  5. S2 stack max-width 920px (matches Ad11)
  6. S3 iPhone17 width 380px (same as Ad11 master)
  7. S4 testimonials max-width 880px
  8. S6 logo size 156px (same as Ad11 master)
  9. Total `data-duration` 33.7s → 30s — trim S2 inter-card gap and tighten S3 mockup hold
- **Hook 3 swap:** master Ad10 may use Hook 1 ("+27% close rate. Same pitch.") on S0. Override S0 text to Hook 3 ("1,247 closers. +27% close rate. Same pitch.") — the social-proof variant is the cold-audience leader per copywriter notes.
- **No-+27% fallback build:** clone the 9:16 directory, swap text + VO + S1 chrome number per the table above. Pre-build before launch. Ship if Meta flags.
- **No new SFX, no new music.** Pure reformat + 1 fallback variant.

---

## Variants for placement adaptation

| Aspect | Placement | Status | Differences from master |
|--------|-----------|--------|-------------------------|
| 3:4 (1080×1440) | Feed | ✅ Shipped (Ad10) | Master |
| 9:16 (1080×1920) | Reels, Stories | NEW — primary deliverable | Re-stack vertically, scale primitives up, retime to 30s |
| 9:16 No-+27% Fallback | Reels, Stories | NEW — pre-built safety net | 9:16 base + claim-removal swaps |
| 1:1 (1080×1080) | Feed (alt) | OPTIONAL | Same retime as Ad11 1:1 — drop S0, shrink primitives. Build only if media buyer asks. |

**Per strategist + brief: 3:4 + 9:16 are the v1 placement targets.**

## Concerns for copywriter

None blocking. Copywriter concern #1 (claim risk on +27%) is handled with the pre-built fallback. The "1,247 closers" proof line is locked-in-use per copywriter concern #5; if that number ever changes, every B variant needs a single text-find-and-replace.

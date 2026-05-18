# Tech overlay — Brief B [+27% Without Changing Your Pitch]
_Tech Director: Claude Opus · Date: 2026-05-03_

## Context note
Brief B is a **REFORMAT job + claim-safe fallback**. The 3:4 master (Ad10) already shipped via the default stack. Deliverables: 9:16 (1080×1920) for Reels/Stories, plus a no-+27% fallback variant pre-built for Meta auto-review safety. Same VO continuity question as Brief A. The +27% chrome number is the visual workhorse — the donut chart in S4 is reused at smaller scale.

## Scene-by-scene tool decision

| Scene | Default sufficient? | Premium tool | Reason | Cost / time |
|---|---|---|---|---|
| S0 (Pre-hook 3-line stack) | **Yes** | — | Text-only pre-hook, no VO. Chrome silver-sweep on "+27%" is the only visual workload. Default. | $0 / 0.0h |
| S1 (+27% big-number reveal) | **Yes** | — | Chrome 240px number is the pure visual peak. Existing Ad10 VO already lands it. Reformatting to 9:16 = same VO file, retimed. | $0 / 0.0h |
| S2 (3 sames + 1 different — inverted polarity) | **Yes** | — | Glass cards + green-check primitive (inverted from Ad11 strike) is brand-on. Strike SFX at 0.30 volume softens the connotation per brief — that's a volume-mix tweak, not a tool problem. | $0 / 0.0h |
| S3 (Tonvo + iPhone17) | **Yes** | — | Same iPhone17Mockup + `demo-session.mp4` + detect-pings as Ad11. Already perfect. | $0 / 0.0h |
| S4 (1,247 + donut + 3 testimonials) | **Yes** | — | Donut from Ad10 reused at 180px. Edge TTS reading "1,247 closers · +27% close rate · representative cohort" is fine — viewers scan visually. | $0 / 0.0h |
| S6 (Slogan + CTA) | **Yes** | — | `slogan_final.mp3` is the locked brand slogan asset across the campaign. **Hard pass on re-recording.** | $0 / 0.0h |
| Fallback variant S1 ("1,247" instead of "+27%") | **Yes** | — | Faceless + Edge TTS Aria mandate. Aria can render the new number-read line. Apple-keynote rhythm comes from data-duration pacing in HyperFrames, not vocal performance. | $0 / 0.3h |
| Fallback variant S4 (drop donut, 1,247-only proof) | **Yes** | — | Edge TTS Aria for the re-recorded line. Same voice as master = continuity preserved. | $0 / 0.3h |

## Faceless + Edge TTS Aria mandate (2026-05-04)

All VO across A/B/C/D/E ships on Edge TTS Aria Neural. No premium voice. Brand-continuity case + faceless mandate = uniform voice + uniform on-canvas visuals = the campaign's brand asset.

## (Original premium-question section — superseded by mandate above)

**No, same reasoning as Brief A.** VO continuity between Ad10 master (3:4) and the 9:16 reformat is a brand asset — if a viewer sees both in the same scroll session, the voice should match. Replacing 5 segments × ~6s × Eleven char rate = ~$0.30 + 2h render + QA, against ~0% hold-rate gain on already-working beats. **Skip.**

The upgrade is justified ONLY for the no-+27% fallback variant's two new lines (S1 and S4), which are new copy not in the master.

## Honest call: does the donut chart in S4 need a 3D upgrade?

**No.** The donut is 180px, sits above 3 testimonial rows, and is on screen for ~2-3s. CSS conic-gradient (the existing Ad10 primitive) renders crisp at that scale. R3F + Theatre.js for a 3D chrome donut would cost +6h dev for ~+1% hold-rate — fails the ≥10% threshold. **Default stays.**

## Honest call: does the "+27%" S1 number need a Kling/Runway zoom-in for impact?

**No.** Chrome silver-sweep on a 240px Inter 800 number, animated via background-position GSAP tween, IS the differentiator vs every other AI-for-sales ad in the feed. Replacing it with AI-video would (a) lose the brand chrome primitive, (b) cost $1-3 of fal.ai credit, (c) take 5-10 takes to land a usable clip, (d) introduce render artifacts on a number that needs to be pixel-perfect for legibility. The chrome CSS primitive is one of our top 3 brand-distinctive assets. **Don't touch it.**

## Total premium budget for this brief
- **Time:** 0h premium (all Edge TTS Aria, free)
- **Cost:** $0.08 (two short clips, well under the $5 cap)
- **Cost:** $0
- **Hold-rate uplift estimate:** +0% (Aria across all variants — uniform voice). The fallback variant only ships if Meta flags +27%, so it's insurance.

## Risks

- **Fallback ships with mid-ad voice change:** S1 (ElevenLabs Rachel) → S2 (Edge Aria, same as master) → S3 (Edge Aria) → S4 (ElevenLabs Rachel) → S6 (Edge Aria slogan_final). Same handoff as Brief A Variant B. Acceptable because eyebrow-text transitions ("ONE THING DIFFERENT", "1,247 closers using Tonvo") read as narrator handoffs. **Mitigation:** if QA flags it as jarring, re-render S2/S3 in ElevenLabs Rachel for the fallback variant only — adds ~$0.20 + 1h.
- **+27% claim flagged after launch:** the fallback is pre-built so 24h turn is realistic. Producer needs to keep the fallback build directory ready, not zipped or archived.
- **ElevenLabs API outage at producer-time for the fallback:** fall back to Edge TTS Aria Neural for the two new lines. Edge can do them — flatter, but ships. The fallback variant is itself a fallback, so doubly-safe is fine.

## Producer notes

### Step 1 — 9:16 master reformat (default stack, no premium)

```bash
cp -r "Tonvo-Ad-HF-27pc" "Tonvo-Ad-HF-27pc-9x16"
cd "Tonvo-Ad-HF-27pc-9x16"
# Edits per brief's "Producer notes" section: viewport 1080×1920, re-stack vertically, scale +27% chrome 220px → 240px, S2 stack max-width 920px, iPhone17 380px, S4 testimonial max-width 880px, S6 logo 156px, total duration 33.7s → 30s
```

VO files: copy Ad10 VO files (`assets/audio/ad8_*.mp3`) — confirm filenames at producer-time. DO NOT re-render. If Ad10 VO total is 33.7s and we need 30s, trim S2 inter-card gaps from 1.2s → 0.9s in GSAP timing — DO NOT re-render VO.

Hook 3 swap on S0: override S0 text to "1,247 closers. +27% close rate. Same pitch." (the cold-audience leader per copywriter). Pure HTML text edit.

### Step 2 — No-+27% fallback variant (Edge TTS Aria, no premium)

```bash
cp -r "Tonvo-Ad-HF-27pc-9x16" "Tonvo-Ad-HF-27pc-fallback"
cd "Tonvo-Ad-HF-27pc-fallback"
```

Apply the swaps from the brief's fallback table:
- S0 text: "1,247 closers. +27% close rate. Same pitch." → "1,247 closers. Same pitch. Better close rate."
- S1 chrome number: "+27%" → "1,247" (single text node swap, chrome class unchanged)
- S4: drop the donut DOM block + retime to fit testimonials only

Edge TTS Aria Neural for both new fallback lines (faceless mandate):

```bash
# Run from Tonvo-Ad/video/ (or wherever the existing generate-vo-ad8.mjs lives — same pattern)
node generate-vo-ad-fallback.mjs
# This script writes:
#   assets/audio/ad10-fallback_s1.mp3 — "Twelve hundred and forty-seven closers run the same call. The same pitch. A better close."
#   assets/audio/ad10-fallback_s4.mp3 — "1,247 closers run Tonvo on every demo. Same pitch. Better close."
# Voice: en-US-AriaNeural (default in our edge-tts wrapper)
# Rate: -8% (Apple-keynote pacing for number-heavy reads)
```

The producer can fork the existing `Tonvo-Ad/video/generate-vo-ad8.mjs` script and swap the line array. Same voice ID + rate as the master = audibly continuous with the rest of the ad.

### Step 3 — Wire fallback audio sources

```html
<audio id="aud-s1" data-start="..." src="assets/audio/ad10-fallback_s1.mp3"></audio>
<audio id="aud-s4" data-start="..." src="assets/audio/ad10-fallback_s4.mp3"></audio>
<!-- S0/S2/S3/S6 keep pointing at Ad10 master VO files -->
```

### Step 4 — Pre-launch QA on both 9:16 builds

Both `Tonvo-Ad-HF-27pc-9x16/` (master) and `Tonvo-Ad-HF-27pc-fallback/` need full QA pass before launch. The fallback sits dormant until/unless Meta flags. Producer keeps both directories live, ready to swap creative IDs in the Meta Ads Manager within the 24h window.

### What we are NOT doing

- Not re-rendering existing Ad10 VO segments
- Not generating a new music bed (tense-cinematic.mp3 stays)
- Not generating any AI video (Kling, Runway, Veo) — chrome CSS is the brand asset
- Not generating any FLUX key art (this brief has no static deliverable)
- Not generating Hedra talking-head (faceless mandate — no founder face anywhere in the campaign)
- Not using ElevenLabs (faceless + Edge TTS Aria mandate locks all VO to the free stack)

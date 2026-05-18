# Tech overlay — Brief C [The Gap — 23% vs 41%]
_Tech Director: Claude Opus · Date: 2026-05-03_

## Context note
Brief C is a **NEW HyperFrames build**. Forks from Ad11 9:16 base. Only one new visual composition (S2 split-screen 23% vs 41%) — every other primitive is reused. 5 new VO segments, all currently spec'd as Edge TTS Aria Neural. The honest tech question: does the Sarah testimonial in S4 (the "she" character introduced in S2) need ElevenLabs for emotional credibility? And does the S2 split-screen need a 3D depth treatment (R3F) to make the gap-narrative land harder?

## Scene-by-scene tool decision

| Scene | Default sufficient? | Premium tool | Reason | Cost / time |
|---|---|---|---|---|
| S0 (Pre-hook "Your top rep isn't smarter") | **Yes** | — | Single-line chrome punch, no VO, 1.5s. Reuses Ad11 S0 primitive verbatim. Default ships. | $0 / 0.5h |
| S1 (Setup "she just hears what you don't") | **Yes** | — | Vertical-stack chrome primitive, reused from Ad11 S1. Edge TTS reads the line cleanly — it's narrator-mode, not character-mode. The "she" is referenced, not voiced. | $0 / 0.5h |
| **S2 (Split-screen 23% vs 41%)** | **Yes** | — | This is the only new composition. Glass cards + chrome numbers + strike + green-check are ALL existing primitives. The split-screen layout is a CSS grid problem, not a tooling problem. **No premium tool helps.** R3F-3D on the chrome numbers would cost +6h dev for negligible lift — chrome CSS sweep on 200px numerals already reads as the "premium" treatment. **Default ships.** | $0 / 4h |
| S3 (Tonvo + iPhone17 reveal) | **Yes** | — | Same iPhone17Mockup + `demo-session.mp4` + detect-pings as Ad11. Brief explicitly notes 0.5s crossfade on the iPhone fade-in over split-screen residue — that's a GSAP tween, not a tool. | $0 / 1h |
| S4 (Sarah testimonial — "she" character payoff) | **Yes** | — | Faceless + Edge TTS Aria mandate. The "she" character payoff is delivered through (a) the eyebrow-text "Sarah · Senior Closer · mid-market" appearing at S4 open, (b) the italic stat "8 / 10 demos this quarter" with chrome treatment, (c) Aria narrator reading the line with measured pacing (rate -10%). The visual + text choreography carries the character — Aria's "flat reportage" read works AS reportage rather than against it. | $0 / 0.3h |
| S6 (Slogan + CTA) | **Yes** | — | Reuse `slogan_final.mp3` from Ad11 — the locked brand slogan asset. **Hard pass on re-recording.** Brief explicitly allows reuse "if scene timing aligns" — confirm at producer-time, but timing should align cleanly at 25.5–28s. | $0 / 0.0h |

## Faceless + Edge TTS Aria mandate (2026-05-04)

All VO ships on Edge TTS Aria Neural. The S4 character payoff (Sarah) lands through visual choreography: eyebrow-text identifier + italic chrome stat + measured Aria pacing (rate -10%). No premium tool. $0 spend. Same voice across the campaign = uniform brand asset.

## Honest call: does S2 split-screen need 3D depth (R3F + Theatre.js)?

**No.** The split-screen narrative is "23% on top, 41% on bottom, same calls, same product, one thing different." The reading path is:

1. Eye lands on YOU 23% (top, smaller chrome 160px)
2. Eye drops to TOP REP 41% (bottom, bigger chrome 200px) — the size difference is the point
3. Chrome divider line slides in: "Same calls. Same product."

Adding a 3D camera-tilt or parallax depth would (a) compete with the chrome-number visual hierarchy, (b) cost +6h dev for an R3F+Theatre.js scene, (c) introduce a stylistic break vs Ad11/Ad10 which are flat-2D. The brief explicitly calls this scene "all-on-canvas, reusing existing primitives." **R3F is over-investment.**

If we ever want depth on Brief C, do it in v2 — and only if the v1 chrome-flat ships <30% hold rate.

## Honest call: AI video (Kling) for any C scene?

**No.** No scene in C requires cinematic B-roll. The split-screen IS the visual — replacing it with a Kling-generated "two reps on a call" clip would (a) require 5-10 takes to land a usable shot, (b) cost $1-3 of fal.ai credit, (c) introduce real-actor visual that conflicts with the all-on-canvas brand DA. **Skip.**

## Total premium budget for this brief
- **Time:** 0h premium
- **Cost:** $0
- **Hold-rate uplift estimate:** +0% (no premium tool used). The S4 character-payoff cohesion is delivered through eyebrow-text + italic stat + measured Aria pacing.

## Risks

- **`slogan_final.mp3` timing alignment:** brief assumes timing aligns. Confirm at producer-time. If `slogan_final.mp3` is 3.5s and S6 is 2.5s, either re-time S6 to 3.5s OR re-render the slogan with Edge TTS Aria at a faster rate.

## Producer notes

### Step 1 — Fork base + 4 Edge TTS segments (default stack)

```bash
cp -r "Tonvo-Ad-HF" "Tonvo-Ad-HF-gap"
cd "Tonvo-Ad-HF-gap"
```

Apply edits per brief's "Producer notes":
- S2 split-screen layout (NEW — 1.5d work): vertical-split 720px tall each, glass-card frames, chrome 160px (YOU 23%) and 200px (TOP REP 41%), chrome divider slides in mid-S2
- All other primitives reused

Render Edge TTS for S1, S2, S3 (and slogan IF `slogan_final.mp3` doesn't align):

```bash
# Use the existing edge-tts CLI helper from your sfx-apple pipeline
edge-tts --voice "en-US-AriaNeural" --text "She's not smarter. She just hears what you don't." \
  --write-media "assets/audio/ad-c_s1.mp3"

edge-tts --voice "en-US-AriaNeural" --text "Your close rate: twenty-three percent. Top rep: forty-one percent. Same calls. Same product. One thing different." \
  --write-media "assets/audio/ad-c_s2.mp3"

edge-tts --voice "en-US-AriaNeural" --text "The only thing different is what's running in her browser. It's Tonvo." \
  --write-media "assets/audio/ad-c_s3.mp3"
```

Reuse `slogan_final.mp3` from Ad11 — copy to `assets/audio/ad-c_slogan.mp3` if you want explicit naming, or just point S6 audio src at the Ad11 path.

### Step 2 — S4 Edge TTS Aria call (faceless mandate)

S4 ships in the same Edge TTS Aria run as S1/S2/S3. Add the line to the `generate-vo-ad-c.mjs` script:

```js
{ id: 's4', text: 'She closed eight of ten demos this quarter. Same pitch she had last year.', rate: '-10%' }
```

Rate -10% slows the cadence so "eight of ten" lands as the measured-pride beat the brief calls for. The eyebrow-text "Sarah · Senior Closer · mid-market" appearing at S4 open does the character-identification work that vocal-performance would have, in line with Ad11/Ad10 testimonial scenes.

### Step 3 — Wire all audio in HF index.html

```html
<audio id="aud-s1" data-start="1.5" src="assets/audio/ad-c_s1.mp3"></audio>
<audio id="aud-s2" data-start="6.5" src="assets/audio/ad-c_s2.mp3"></audio>
<audio id="aud-s3" data-start="14.0" src="assets/audio/ad-c_s3.mp3"></audio>
<audio id="aud-s4" data-start="22.0" src="assets/audio/ad-c_s4.mp3"></audio>
<audio id="aud-slogan" data-start="25.5" src="assets/audio/slogan_final.mp3"></audio>
<audio id="aud-music" data-start="0" data-volume="0.30" loop src="assets/audio/tense-cinematic.mp3"></audio>
```

### Step 4 — 1:1 reformat + static export

For the 1:1 (1080×1080) variant:
- Drop S0, retime to 26s
- S2 split-screen rotates from vertical-split to horizontal-split (left=YOU, right=TOP REP) per brief
- iPhone17 width 380px → 340px
- VO files reused as-is, just retimed in `data-start` offsets

For the static export (S2 frame as Pattern 6 contrarian static):

```bash
# Use existing scripts/generate-carousels/ infrastructure (per memory rule)
node scripts/generate-carousels/render-frame.js \
  --url "file:///path/to/Tonvo-Ad-HF-gap/index.html" \
  --frame-time 10.5 \
  --width 1080 --height 1080 \
  --output "out/static-c-s2.png"
```

Frame-time 10.5s captures S2 mid-beat, after both halves are revealed and before the iPhone reveal in S3.

### What we are NOT doing

- Not generating any AI video (Kling/Runway) — chrome-flat split-screen IS the asset
- Not generating any FLUX key art — no static-image asset in this brief
- Not generating Hedra talking-head — faceless mandate, no founder face anywhere
- Not using ElevenLabs — Edge TTS Aria mandate, all VO on the free stack
- Not using R3F for 3D depth on S2 — over-investment
- Not generating new music — tense-cinematic.mp3 stays
- Not re-recording slogan VO — `slogan_final.mp3` is the locked campaign-wide asset

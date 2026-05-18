# Tech overlay — Brief E [Silent Cofounder]
_Tech Director: Claude Opus · Date: 2026-05-03 · Updated 2026-05-04: faceless mandate locked_

## Context note
Brief E is **RESERVE — week-2 only, ships if A or D underperforms on 72h read**. Targets ICP-3 (solo founders, 15% of spend). Forks from Ad11. Every primitive reused from Ad11 (S0 stack, S1 chrome stack, S2 glass cards w/ question-tone, S3 iPhone17, S4 badge, S6 slogan).

**Faceless + Edge TTS Aria mandate locked by Emilien (2026-05-04):** no Hedra, no founder face, no premium voice. Brand continuity with A/B/C/D wins over the founder-Loom experiment. The "silent cofounder" positioning lands through chrome-text + iPhone17 reveal — the metaphor stays metaphorical, the product image carries the partner-frame.

The brief flags the music as on the edge of right-vs-wrong (tense-cinematic.mp3 is loss-aversion-flavored; E is aspirational-partnership-flavored) but locks it for v1 anyway — premium music is not in the faceless+free stack.

## Scene-by-scene tool decision

| Scene | Default sufficient? | Premium tool | Reason | Cost / time |
|---|---|---|---|---|
| S0 (Pre-hook "Your silent cofounder runs in your browser.") | **Yes** | — | Two-line chrome stack, no VO, 1.5s. Reuses Ad11 S0 primitive. | $0 / 0.5h |
| S1 (Setup — "You built the product. You love it. Closing is a different sport.") | **Yes** | — | Chrome-text + Edge TTS Aria narrator. Same register as Ad11 S1. The founder-to-founder emotional payload comes from line + iPhone17 partnership reveal in S3, not from a face on screen. | $0 / 0.5h |
| S2 (Demo→paid problem with question-tone glass cards) | **Yes** | — | Reused Ad11 S2 glass-card primitive, inverted-tone (questions, not strikes). Edge TTS Aria narrator. | $0 / 0.5h |
| S3 (Tonvo + iPhone17 partner reveal) | **Yes** | — | iPhone17Mockup + `demo-session.mp4` + detect-pings. The iPhone is the partner — that's the metaphor cashed out visually. | $0 / 0.5h |
| S4 (Free starter — friction-killer proof) | **Yes** | — | Compressed proof beat, badge + italic line. Edge TTS Aria. | $0 / 0.3h |
| S6 (Slogan + CTA "Sign Up →") | **Yes** | — | Edge TTS Aria re-render: CTA verbal differs ("Sign up free at tonvo.co" vs Ad11's "Try free at tonvo.co"). Save as `assets/audio/ad-e_slogan.mp3`. Same voice as `slogan_final.mp3`. | $0 / 0.2h |

## Total premium budget for this brief
- **Time:** 0h premium (everything on Edge TTS Aria + HF default stack)
- **Cost:** $0
- **Hold-rate uplift estimate:** N/A — we ship with the same stack as the rest of the campaign. Brand continuity is the bet.

## Risks

- **Music mismatch (loss-aversion bed on aspirational-partnership angle):** acknowledged, accepted for v1. Premium music (Stable Audio re-prompt) is out per faceless+free stack mandate. Flag for v2 post-perf-data.
- **"Founder positioning" with no founder voice/face:** intentional. The "silent cofounder" stays silent visually too. The iPhone17 + product UI carries the partnership frame — Tonvo IS the cofounder, not Emilien telling you it is.

## Producer notes

### Step 1 — When E triggers, fork Ad11 base

```bash
cp -r "Tonvo-Ad-HF" "Tonvo-Ad-HF-cofounder"
cd "Tonvo-Ad-HF-cofounder"
```

### Step 2 — Render all VO via Edge TTS Aria

Add the lines to a fresh `Tonvo-Ad/video/generate-vo-ad-e.mjs` (fork from `generate-vo-ad11.mjs`):

```js
const lines = [
  { id: 's1', text: 'You built the product. You love it. Closing is a different sport.', rate: '-5%' },
  { id: 's2', text: "Your demo to paid is in single digits. You don't know which ninety percent you're losing.", rate: '-8%' },
  { id: 's3', text: 'Every solo founder needs a cofounder. Yours just runs in your browser.', rate: '-5%' },
  { id: 's4', text: 'Free starter. Three sessions a month. Thirty second setup. No card.', rate: '0%' },
  { id: 'slogan', text: 'Never miss a word with Tonvo. Sign up free at tonvo.co.', rate: '0%' },
];
```

Run the script — it writes 5 mp3s to `assets/audio/ad-e_*.mp3`. Voice = `en-US-AriaNeural`. Same voice + similar pacing as Ad11/Ad10 = audibly continuous with the campaign.

### Step 3 — Wire audio in HF index.html

```html
<audio id="aud-s1" data-start="1.5" src="assets/audio/ad-e_s1.mp3"></audio>
<audio id="aud-s2" data-start="6.5" src="assets/audio/ad-e_s2.mp3"></audio>
<audio id="aud-s3" data-start="13.5" src="assets/audio/ad-e_s3.mp3"></audio>
<audio id="aud-s4" data-start="21.0" src="assets/audio/ad-e_s4.mp3"></audio>
<audio id="aud-slogan" data-start="24.5" src="assets/audio/ad-e_slogan.mp3"></audio>
<audio id="aud-music" data-start="0" data-volume="0.30" loop src="assets/audio/tense-cinematic.mp3"></audio>
```

VO buffer rule: extend each segment `data-duration` by +1.0s vs ffprobe-measured length, fade-out 250ms.

### Step 4 — Apply E-specific edits to fork

Per the brief's producer notes:
- S1: chrome stack "You built the product." / "You love it." / chrome on "Closing is a different sport."
- S2: glass cards inverted-tone ("Demo to paid: 9%?" / "Don't know why?" / "Sound familiar?") instead of Ad11's strikethrough strikes
- S3: iPhone17Mockup with `demo-session.mp4` — same primitive as Ad11. New eyebrow text: "TONVO · YOUR COFOUNDER"
- S4: badge "Free starter" + italic line "3 sessions/month · 30s setup · no card"
- S6: standard slogan layout, swap "Try Free →" pill text to "Sign Up →" pill text

### Step 5 — Render + QA

```bash
npx hyperframes lint
npx hyperframes render
# Output: renders/ad-E-cofounder-9x16-<timestamp>.mp4
```

QA checklist: all VO clips audible, music ducks under VO at -18dB, slogan reads "Sign Up →" not "Try Free →", iPhone17Mockup wraps demo-session.mp4 cleanly.

### Step 6 — 1:1 reformat

```bash
cp -r "Tonvo-Ad-HF-cofounder" "Tonvo-Ad-HF-cofounder-1x1"
cd "Tonvo-Ad-HF-cofounder-1x1"
# Viewport 1080x1080, drop S0, retime to 25s, shrink iPhone17 to 340px
```

VO files reused as-is (just retimed in `data-start` offsets).

## What we are NOT doing

- Not generating Hedra talking-head — faceless mandate (Emilien 2026-05-04)
- Not using ElevenLabs — Edge TTS Aria mandate, all VO on the free stack
- Not generating new music — `tense-cinematic.mp3` reused even though tone is loss-aversion-flavored vs E's aspirational-partnership
- Not generating any AI video (Kling, Runway, Veo) — chrome CSS + iPhone17 reveal carries the partnership beat
- Not generating any FLUX key art — no static deliverable for E

## Trigger condition (re-stated)

E ships ONLY if analyst report at 72h shows Brief A or Brief D (the ICP-1 primary angles in AS-1) underperforming kill rules. Until that signal, this overlay sits dormant. When triggered: ~1 day production turn (vs the 2-day estimate the brief gave for the Hedra path — faceless is faster).

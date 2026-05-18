# Tech overlay — Brief A [POV: You Just Lost $50K]
_Tech Director: Claude Opus · Date: 2026-05-03_

## Context note
Brief A is a **REFORMAT job**. The 9:16 master (Ad11) already shipped via the default HF + Edge TTS + Pixabay tense-cinematic + ffmpeg sfx-apple stack. The deliverables here are 1:1 (1080×1080) and 1:1 Variant B (Hook 2). The producer has been told to reuse the existing VO files (`ad11_s1.mp3` … `slogan_final.mp3`), retime them, and shrink primitives. **The default stack already shipped this brief once.** The premium question is narrower: do we upgrade VO for the reformat, and can the chrome-$50K beat be made even sharper?

## Scene-by-scene tool decision

| Scene | Default sufficient? | Premium tool | Reason | Cost / time |
|---|---|---|---|---|
| S1 (POV / $50K reveal — 1:1) | **Yes** | — | Master VO `ad11_s1.mp3` already lands the beat. The chrome $50,000 is the visual peak, not the VO. Re-using existing Edge TTS Aria audio is invisible at 1:1 framing. | $0 / 0.0h |
| S2 (Three signals strikethrough) | **Yes** | — | Glass cards + chrome + strike SFX is locked primitive. Existing VO is fine — the strike SFX carries the punishment, not the voice. | $0 / 0.0h |
| S3 (Tonvo + iPhone17 reveal) | **Yes** | — | iPhone17Mockup wrap + `demo-session.mp4` + detect-pings already perfect. No premium tool helps. | $0 / 0.0h |
| S4 (1,247 closers + testimonials) | **Yes** | — | Glass-card primitive, Edge TTS reading 3 stat lines is fine — listeners scan visually here, not audibly. | $0 / 0.0h |
| S6 (Slogan + CTA) | **Yes** | — | `slogan_final.mp3` is the locked brand asset. Replacing it would create a slogan-VO drift across A vs B vs C vs D. **Hard pass on re-recording.** | $0 / 0.0h |
| Variant B S1 (Hook 2 "ghosted") | **Yes** | — | Faceless + Edge TTS Aria mandate (Emilien 2026-05-04). Aria handles the new line; the disgusted-pause comes from SFX (sub-impact at 0.6s) + visual cut, not vocal performance. Same voice continuity as master. | $0 / 0.3h |

## Faceless + Edge TTS Aria mandate (2026-05-04)

All VO across A/B/C/D/E ships on Edge TTS Aria Neural. No premium voice. The brand-continuity case (matching master to reformats) compounds with the faceless mandate — every voice line in this campaign is the same voice, every visual is on-canvas. That uniformity is the brand asset.

Variant B S1 ("ghosted you" emotional pause) is delivered through **SFX layering** instead of vocal performance: sub-impact at 0.6s on "ghosted", a 200ms held pause, then ambient-rise into the dollar amount. The visual cut to the strike does the rest.

## Total premium budget for this brief
- **Time:** 0h premium
- **Cost:** $0
- **Hold-rate uplift estimate:** +0% (no premium tool used). Variant B's edge over master comes from the new hook copy + SFX/visual choreography, not VO timbre.

## Risks

- **VO drift between master and 1:1 reformat:** Mitigated by NOT replacing master VO files. We're keeping `ad11_s1.mp3`-`ad11_s4.mp3` as-is.
- **No premium-VO drift risk** — faceless mandate means Edge TTS Aria across the campaign. Master and all variants share the same voice timbre by default.

## Producer notes

### Step 1 — 1:1 master reformat (default stack only, no premium)

```bash
# Fork Ad11 directory
cp -r "Tonvo-Ad-HF" "Tonvo-Ad-HF-1x1"
cd "Tonvo-Ad-HF-1x1"
# All edits per the brief's "Producer notes" section (1080×1080 viewport, drop S0, retime, shrink primitives, swap music to tense-cinematic.mp3)
```

VO files: copy `ad11_s1.mp3` through `slogan_final.mp3` from `Tonvo-Ad-HF/assets/audio/` — DO NOT re-render any of them.

### Step 2 — Variant B Hook 2 single VO line via ElevenLabs

```bash
# Set API key once in shell
export ELEVENLABS_API_KEY="<your_key>"

# Curl call — voice_id is Rachel (21m00Tcm4TlvDq8ikWAM, ElevenLabs preset)
curl --request POST \
  --url "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM" \
  --header "xi-api-key: $ELEVENLABS_API_KEY" \
  --header "Content-Type: application/json" \
  --data '{
    "text": "The deal you needed just ghosted you. Fifty thousand. Gone.",
    "model_id": "eleven_multilingual_v2",
    "voice_settings": {
      "stability": 0.45,
      "similarity_boost": 0.75,
      "style": 0.35,
      "use_speaker_boost": true
    }
  }' \
  --output "assets/audio/ad11-v2_s1.mp3"
```

**Voice settings rationale:**
- `stability 0.45` = enough variance for the disgusted pause on "ghosted you" without going cartoonish
- `style 0.35` = mid-range emotional read, not a flat news-anchor delivery
- `similarity_boost 0.75` = locks the Rachel timbre so future swaps stay consistent

### Step 3 — Wire `ad11-v2_s1.mp3` into Variant B

In the Variant B HTML build, override the S1 audio source:

```html
<audio id="aud-s1" data-start="0" preload="auto"
       src="assets/audio/ad11-v2_s1.mp3"></audio>
```

All other VO references (`ad11_s2.mp3`, `ad11_s3.mp3`, `ad11_s4.mp3`, `slogan_final.mp3`) stay pointing at master files.

### Step 4 — QA pass

Render both 1:1 builds. Watch with headphones. Listen specifically for:
- Music bed (`tense-cinematic.mp3` at -18dB) doesn't fight the new ElevenLabs ad11-v2_s1 line — it shouldn't, the music is sub-bass cinematic
- VO pacing: the `+1.0s ve buffer` rule still applies to the new ElevenLabs clip
- Variant B S1 → S2 transition: Rachel's voice (Variant B S1) → Aria's voice (master S2). **This IS a voice change mid-ad.** Acceptable because S1 ends with a hard cut to S2's eyebrow text "Three signals you missed" — the transition reads as a narrator handoff, not a continuity break. If it sounds jarring in QA, fall back to Edge TTS Aria Neural for the Hook 2 line and accept the flatter read.

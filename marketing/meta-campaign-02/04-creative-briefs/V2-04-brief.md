# V2-04 Creative Brief — Angle G · "POV: Tonvo Just Caught What You Missed." · Hook H4

_Creative Director: Claude Opus · 2026-05-17 · Meta Ads campaign-02 · Wave 3_
_Source copy: `marketing/meta-campaign-02/03-copy/V2-04-copy.md` · Hook archetype: POV / situation drop · 1:1 Feed reformat of V2-03 spine_
_Scroll-stop catalog ref: lead = **G-R2.3** ("Watch Tonvo catch the signal — live." + screen rec) audio-driven variant, ported to POV framing. Body uses **G-R2.4** split-screen primitive._

---

## 1. Variant identity

| Field | Value |
|---|---|
| Variant ID | V2-04 |
| Angle | G — The Signal You Missed, Live |
| Format | 1:1 Feed (square) |
| Duration | 15.0s |
| Hook | "POV: Tonvo just caught what you missed." (H4) |
| Scroll-stop catalog ID | Primary: **G-R2.3** audio-driven variant. Body: **G-R2.4** split-screen A/B mechanic. Backup hook copy: G-C2.1 ("What did your buyer just say?") provocation variant. |
| Primes landing typewriter line | Line 3: "Without missing a signal." |
| Primary text (Ads Manager) | "She said 'let me think about it.' That was a yes you walked past. Tonvo catches the ones you miss. Try free → tonvo.co" |
| Headline | "The yes you walked past." (24 chars) |
| Description | "Catch the signal. Live." (24 chars) |
| Button | `Try for Free` |
| Production cost | ~2 HF-days (reformat-of-spine, not fresh comp — reuses V2-03 primitives) |

---

## 2. Format spec

| Spec | Value |
|---|---|
| Aspect ratio | 1:1 |
| Target export | 1080×1080 .mp4 (H.264 high, 8-10 Mbps) |
| FPS | 30 |
| Codec | H.264 yuv420p, AAC 192k |
| Color | sRGB |
| Safe zones | Top 14% (≥151 px), bottom 14% (≥151 px). 1:1 layout: Zoom thumbnail in upper-half (y=80-540), overlays/cards in lower-half (y=540-930). CTA bottom slot (y=930-1080) reserved. |
| Loop-friendly | Optional — the POV framing tolerates a soft loop back to S0 if Meta's autoplay re-engages. Not built in by default. |
| Sound-on assumption | 50/50. Caption + split-screen visual carries silent; VO + buyer audio drop adds depth. |

**Layout note:** This is NOT an auto-crop of V2-03. The 1:1 layout changes the visual logic — Zoom thumbnail sits upper-half with overlays lower-half, rather than the 9:16 stack. Rebuild the comp.

---

## 3. Scene-by-scene plan

| # | Time | Shot description | VO line (Edge TTS · Aria Neural) + buyer audio | On-screen text | SFX | Transition out |
|---|------|------------------|----------------------------------------------|----------------|-----|----------------|
| **S0** | 0.0–0.4s | Black bg. Single ambient pad fade-up. | _(silence)_ | _(empty)_ | Ambient pad (`sub-impact.wav` -3 dB + low pad layer) fades up to -22 dB across 0.0–0.4s. | Caption type-in begins. |
| **S0b** | 0.4–1.0s | Black bg. Monospace caption types in lower-third (y=720-820 in 1:1 frame), word-by-word at 150ms per word. | _(silence)_ | `POV: Tonvo just caught what you missed.` (Inter Mono / SF Mono 28px, white, lower-third, types in 4 word-groups: "POV:" → "Tonvo just" → "caught what" → "you missed.") | 4× soft monospace keystroke ticks (sfx-apple `tap-low.wav` or similar) on each word-group stamp. -10 dB each. | Hard cut to S1 at 1.0s. |
| **S0c** | 1.0–1.2s | Zoom thumbnail fades up in upper-half center (y=80-540), 50% grayscale. Neutral buyer pose, muted lip-sync loop. Caption from S0b remains visible. | _(silence)_ | Caption still visible: `POV: Tonvo just caught what you missed.` | Keystroke clatter cuts at 1.0s. Zoom room-tone leaks in (muffled, -28 dB). | Glass card pulse at 1.2s. |
| **S0d** | 1.2–1.5s | Single chrome glass card pulses into upper-right corner of the Zoom tile: `BUYING SIGNAL.` Pulse = scale 0.9→1.0 + opacity 0→100% over 200ms. | _(silence)_ | Glass card upper-right of Zoom: `BUYING SIGNAL.` (Inter 600, 18px, chrome plate). Caption remains lower-third. | Single `sub-tap` (or `tap-bright.wav` -6 dB) on pulse. | Cross-cut to body at 1.5s — but for V2-04, the body actually starts at 3.0s, so hold the frame 1.5–3.0s with caption + thumbnail + glass card all visible. |
| **S1** | 1.5–3.0s | Hold state from S0d. Caption, Zoom thumbnail (grayscale), `BUYING SIGNAL.` card all visible. | _(silence — let the viewer absorb)_ | (no change) | Room-tone continues -28 dB. Music bed enters at 1.5s, -22 dB. | Cut to S2 at 3.0s — synthesized buyer audio drops. |
| **S2** | 3.0–7.0s | Zoom thumbnail in upper-half remains. Lower-half: two stacked glass cards appear simultaneously. Top card (buyer line, grayscale): `"let me think about it."` Bottom card (AE response, grayscale): `"sure, I'll follow up."` At 6.0s, the AE response card flashes red (border + text shift to `#c84a4a`). | "She said: 'let me think about it.' You said: 'sure, I'll follow up.'" (3.5–7.0s VO) | Top card: `"let me think about it."` (white quote on grayscale plate). Bottom card: `"sure, I'll follow up."` (white quote on grayscale plate → red at 6.0s). | Synthesized buyer audio at 3.0–3.8s: "let me think about it." (-8 dB). `glass-chime.wav` lo on both card snap-ins (3.0s, layered). `strike.wav` lite on red shift (6.0s). | Cross-cut to S3 — iPhone reveal. |
| **S3** | 7.0–11.0s | Lower-half: iPhone 17 mockup (4°/-2° tilt) appears overlaid on the lower-right of the Zoom thumbnail area, 320px wide (smaller than V2-03's 380 due to 1:1 layout). Tonvo glass card snaps in over the mockup's upper screen area. Card pulses 1× at 9.0s. | "Tonvo heard a buying signal. Hesitation equals she's doing the math. Ask her what part." (7.0–11.0s VO) | Glass card on phone: `HESITATION. Mirror: 'think about it' — about what specifically?` (Inter 600, 16px, chrome plate — smaller text due to tighter card). | `reverse-lift.wav` on iPhone entry (7.0s). `detect-ping.wav` on card snap (7.5s). `detect-ping.wav` on pulse (9.0s). | Cross-cut to S4 split-frame. |
| **S4** | 11.0–14.0s | Full-frame split: LEFT half = original call view (grayscale, 30% saturation), bottom-left stamp `FOLLOW UP` in red. RIGHT half = same call with Tonvo overlay (100% color saturation), bottom-right chrome stamp `CLOSED.` Each side ~533px wide in the 1080-wide frame. | "Same call. Same words. One catch. Deal closes." (11.0–14.0s VO) | LEFT side: `FOLLOW UP` red stamp (Inter 700, 32px, #c84a4a). RIGHT side: `CLOSED` chrome stamp (Inter 700, 32px, chrome). | `sub-impact.wav` on split reveal (11.0s). `tap-bright.wav` on stamps (11.4s LEFT, 11.6s RIGHT). | Cross-cut to S5. |
| **S5** | 14.0–14.5s | Black bg. Typewriter end-card center frame. Faster type-in than V2-03 (0.5s for 5 words = 100ms per word group). **MATCHES LANDING `.hero-headline2` EXACTLY** (commit `9f509ce`): Inter sans **font-weight 200 (NOT mono)**, letter-spacing `-0.025em`, silver-sweep gradient via `-webkit-background-clip: text`, caret blink `0.9s steps(1)`, size ≈ 36-40px (1:1 reformat). See `08-tooling/tech-decisions-v2.md` §3. | _(silence)_ | `Without missing a signal.` (Inter 200 light + silver-sweep gradient, types in 0.5s, caret blink) | `tap-bright.wav` per word stamp (4 ticks at 14.0 / 14.10 / 14.20 / 14.30s). | Cross-dissolve to S6 over 100ms. |
| **S6** | 14.5–15.0s | CTA end-card. Logo top + chrome CTA pill center + sub-line. | "Try free → tonvo.co." (14.0–15.0s — VO crosses S5/S6 boundary slightly) | Logo + `Try Free → tonvo.co` + `30s setup · no card.` | `air-swoosh.wav` on logo. `text-pop.wav` on pill. Music + room-tone fade to -∞. | End. |

**Pacing audit:** S5 is intentionally tight (0.5s typewriter vs. 1.0s in V2-03). Faster word-stamp cadence still readable in mobile preview. Total 15.0s.

---

## 4. Asset list

### Visuals required

| Asset | Source | Status | Notes |
|---|---|---|---|
| Zoom thumbnail (grayscale variant) | **Reuse V2-03 asset** with -70% saturation filter applied. Same source whether Pixabay / Kling / demo-session. | Inherits V2-03 sourcing decision. | Tech-director gate same as V2-03. |
| 1:1 layout grid (upper-half thumbnail + lower-half overlays) | New comp — NOT auto-cropped from V2-03. Build fresh in HF. | New work. | Spec: thumbnail occupies y=80–540 (460px tall, ~80% of 1:1 upper area), overlays/cards lower-half y=540–930. |
| Glass card primitive (buyer line + AE response, grayscale) | Ad11 glass-card primitive + new grayscale filter. | REUSE + minor variant. | Two side-by-side cards = new layout but no new primitive. |
| Red flash on AE response card (border + text) | CSS filter + transform animation. ~30 min HF work. | Producible in-engine. | |
| iPhone 17 mockup with HESITATION glass card overlay | `IPhone17Mockup` at smaller 320px width (vs. 380 in V2-03). Glass card overlay on screen. | REUSE + size variant. | Per memory rule. |
| Split-frame composite (grayscale left vs. color right) | New comp — 50/50 split with CSS filters. | New work, ~1 hour. | The contrast IS the payoff. 30% saturation drop on left, 100% on right. Sharp divide. |
| `FOLLOW UP` red stamp + `CLOSED` chrome stamp | Reuse Ad11 chrome/red stamp primitives. | REUSE | |
| Tonvo logo | `assets/logo-tonvo-remove.png` | REUSE | |
| Typewriter end-card | Inline HTML + GSAP type-in. **Matches landing typewriter line 3 verbatim.** | Producible in-engine. | Same gate as V2-01/02/03. Tighter time slot (0.5s vs. 1.0s) — type-in cadence faster. |
| CTA pill | Ad11 S6 primitive | REUSE | |

### Audio

| Track | File | Voice | Lines / notes |
|---|---|---|---|
| Synthesized buyer audio (1 drop) | `assets/audio/v2-04_buyer_1.mp3` | Same lane decision as V2-03 (Edge TTS Jenny or ElevenLabs). | "let me think about it." (0.8s, -8 dB). Tagged `[dramatization — synthesized buyer line, not a real call clip]`. |
| VO segment 1 (S2) | `assets/audio/v2-04_s2.mp3` | Edge TTS · Aria Neural, replay-narration register, dry, second clause harder than first | "She said: 'let me think about it.' You said: 'sure, I'll follow up.'" |
| VO segment 2 (S3) | `assets/audio/v2-04_s3.mp3` | Aria Neural | "Tonvo heard a buying signal. Hesitation equals she's doing the math. Ask her what part." |
| VO segment 3 (S4) | `assets/audio/v2-04_s4.mp3` | Aria Neural | "Same call. Same words. One catch. Deal closes." |
| VO segment 4 (S6) | `assets/audio/v2-04_s6.mp3` | Aria Neural | "Try free → tonvo.co." |
| Music bed | `assets/audio/tense-cinematic.mp3` | Pixabay | -22 dB. Muted 0.0–1.5s. Fade in 1.5s. Fade out S6. |
| Room tone | Same as V2-03 — synthesized low murmur. | Producible in-engine. | -28 dB from 1.0s through 14.0s. |
| SFX | `sub-impact.wav`, `tap-low.wav`, `tap-bright.wav`, `glass-chime.wav`, `strike.wav`, `detect-ping.wav`, `reverse-lift.wav`, `air-swoosh.wav`, `text-pop.wav` | All in `sfx-apple/` | If `tap-low.wav` unavailable for S0b keystroke ticks, substitute `tap-mid.wav` at -10 dB. |
| Voice direction | — | — | Aria: replay-narration tone. AE walking another AE through her own tape. Casual, dry. Second clause of each sentence harder than first ("the catch lands harder than the setup" — per copy doc). |

**Optional AE response VO:** the AE's "sure, I'll follow up." line at S2 can be VO (Aria — same speaker as narrator, performing her own past line) OR text-only. If VO, ship as a tiny segment (0.7s) — adds ~$0 cost on Edge TTS.

---

## 5. Hook spec (frame-accurate 0.0–1.5s)

| Frame range (30fps) | Timestamp | Visual | Audio |
|---|---|---|---|
| 0–12 | 0.00–0.40s | Black bg. Ambient pad fades up from -∞ → -22 dB. | Pad fade. |
| 12 | 0.40s | First caption word-group `POV:` stamps in lower-third (Inter Mono 28px). | `tap-low.wav` keystroke -10 dB. |
| 17 | 0.57s | Second word-group `Tonvo just` stamps in. | Second `tap-low.wav`. |
| 22 | 0.73s | Third word-group `caught what` stamps in. | Third `tap-low.wav`. |
| 27 | 0.90s | Fourth word-group `you missed.` stamps in. Caption complete. | Fourth `tap-low.wav`. |
| 30 | 1.00s | Zoom thumbnail begins fade-up in upper-half at 50% scale, grayscale -70% sat. | Keystroke clatter cuts. Room-tone begins fade-in (-∞ → -28 dB). |
| 30–36 | 1.00–1.20s | Zoom thumbnail completes fade-up to 100% opacity (still grayscale). Caption holds. | Room-tone reaches -28 dB. |
| 36 | 1.20s | Glass card `BUYING SIGNAL.` pulses into upper-right of Zoom tile. Scale 0.9→1.0, opacity 0→100%, over 200ms. | Single `tap-bright.wav` -6 dB on pulse landing. |
| 45 | 1.50s | All elements (caption + thumbnail + glass card) at rest. Hold state. | Room-tone + music bed enter sustain. |

**Critical timing notes:**
- Caption type-in completes BEFORE Zoom thumbnail fade-up. The viewer reads "POV: Tonvo just caught what you missed." THEN sees the call. This order matters — the caption sets the frame; the thumbnail provides evidence.
- Glass card `BUYING SIGNAL.` pulse at 1.20s is the "Tonvo is in the scene" signal. It primes the body of the ad.

---

## 6. CTA spec

| Element | Value |
|---|---|
| End-card duration | 0.5s (14.5–15.0s) |
| Background | `#09090b` + #grid-bg at 0.07 opacity |
| Logo | `logo-tonvo-remove.png` at 80px (smaller than V2-03's 96px due to 1:1 vertical compression), top-third (y=200) |
| CTA pill | "Try Free → tonvo.co" — chrome plate, Inter 700, 22px, center (y=540) |
| Sub-line | "30s setup · no card." — Inter 400, 16px, `#a1a1aa` (y=600) |
| Button (Ads Manager) | `Try for Free` |
| Position (safe zone) | All within middle 72% of 1:1 frame. Bottom 14% (>929px) reserved. |
| Animation | Logo air-swoosh (150ms — faster than 9:16 because 1:1 has less time). Pill text-pop (150ms). |

---

## 7. Pipeline routing

**HyperFrames default WITH inherited tech-director gates from V2-03.**

V2-04 reformats V2-03's spine. Most decisions are made in V2-03; V2-04 inherits:
- Zoom thumbnail sourcing decision (V2-03 gate #1)
- Synthesized buyer voice lane (V2-03 gate #2)
- Landing typewriter CSS match (V2-03 gate #4)

**New V2-04-specific tech-director consideration:**
1. **1:1 layout comp.** Confirm HF can render 1080×1080 with the upper-half-thumbnail / lower-half-overlays split cleanly. Existing Ad10 was 1:1 but at 1080×1440 (3:4), not square. Tech-director verifies HF supports true 1:1 1080×1080 export without aspect-ratio quirks.
2. **Split-frame composite at S4.** New layout primitive (50/50 split with sat filters). ~1 hour of HF work. Confirm with tech-director that GSAP/CSS can animate two side-by-side compositions in sync — particularly the simultaneous stamp drops at 11.4s/11.6s.
3. **Smaller iPhone 17 mockup (320px).** Verify mockup component scales cleanly to 320px width without rendering artifacts on the dynamic island and screen content.

---

## 8. Risks / pre-flight checks

| Risk | Mitigation |
|---|---|
| **Producer auto-crops V2-03 instead of rebuilding 1:1** | Strict instruction: DO NOT auto-crop. The 1:1 layout is upper-half thumbnail + lower-half overlays, not a center-crop of the 9:16 stack. Brief is explicit. Pre-flight: visual compare V2-04 output vs. V2-03 output — if they're aspect-cropped versions of the same composition, V2-04 is wrong. |
| **Split-frame at S4 reads as one scene twice** | The grayscale-vs-color contrast must be sharp: aim for 30% saturation on left, 100% on right. If grayscale is too subtle, push to 20%. Test in mobile preview. The stamps (`FOLLOW UP` red / `CLOSED` chrome) reinforce the A/B — both must land within 200ms of split reveal. |
| **Caption + Zoom thumbnail + glass card too busy at 1.5s hold** | The S0d–S1 hold state has 3 concurrent elements visible. Test for legibility: caption (lower-third), thumbnail (upper-half), glass card (upper-right corner). If thumbnail dominates, dim it to 80% opacity during the 1.5s hold. |
| **Typewriter at 0.5s reads as edit-glitch** | 4 word ticks across 0.4s (100ms each) is fast but readable. If post-launch hold-rate degrades on mobile slow-scroll, extend S5 to 0.7s and shorten S6 to 0.3s (CTA can compress slightly without losing button). |
| **iPhone 17 mockup at 320px loses dynamic island detail** | Pre-flight: render at 1080×1080, zoom to mockup, confirm dynamic island + screen content are crisp. If degraded, increase to 340px and reduce padding around the mockup. |
| **AE response "sure, I'll follow up." VO competes with narrator** | If using VO for AE response, mix it at -3 dB vs. narrator at 0 dB to differentiate. Or default to text-only — the visual carries it. |
| **POV framing drifts into pure post-mortem** | The "POV:" caption is the on-ramp; the iPhone reveal at S3 is the live-product proof. If editor leans too heavily on grayscale "last week" framing in S2/S4, ad becomes Angle A (V1 POV-$50K). Hold the line: S3 must read as present-tense product capture, not memory. |
| **Sound-off comprehension** | All key beats are also on-screen text: caption, buyer card, AE card, iPhone glass card, split-frame stamps, typewriter, CTA. Fully readable silent. |

---

## 9. Anti-patterns (must NOT appear)

- **No auto-crop from V2-03.** Rebuild for 1:1.
- **No retrospective POV-leaning S2/S4.** "POV:" frame is the hook only. The body must read as present-tense Tonvo capture, not "remember last week."
- **No "AI" / "intelligent" / "smart" / "next-gen" / "powerful"** anywhere.
- **No percentage stat** anywhere in the cut.
- **No founder-on-camera.**
- **No buyer face close-up.** Thumbnail framing only.
- **No testimonials / named operators.** Angle G doesn't carry social proof.
- **No emoji.**
- **No demo-book CTA.**
- **No font deviation** from Inter sans. Inter only (200 light, regular, 600, 700). S0b caption keeps Inter Mono 28px for terminal/log register. S5 typewriter end-card uses **Inter 200 + silver-sweep gradient matching landing `.hero-headline2`**, NOT Inter Mono.
- **No real call-recording audio.** Buyer line is synthesized + tagged `[dramatization]`.
- **No additional buying signals beyond the one ("let me think about it.").** V2-04 is the single-signal compression of V2-03's three. Adding more violates the 15s slot and clutters the split-frame payoff.
- **No music drowning room-tone.** Same mix discipline as V2-03 — room-tone must be perceptible to sell "inside the call" premise.
- **No fade-out before S6 ends.** CTA must read clearly through the final frame.

---

_End V2-04 brief. Production order: ship AFTER V2-03 spine locks. ~24h turnaround once V2-03's Zoom thumbnail + synthesized buyer voice decisions land._

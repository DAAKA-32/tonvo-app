# V2 Creative Briefs — Wave 3 Summary

_Creative Director: Claude Opus · 2026-05-17 14:37 GMT+2 · Scope: V2-01 → V2-04 hero variants. Angle H (V2-05/06) NOT in this wave (testimonial verification gate per 00-brief §3 + §10 Q1). V2-07/08 reserved for later waves._

---

## 1. Brief inventory

| ID | Angle | Hook | Format | Duration | Scroll-stop ref | HF-days |
|---|---|---|---|---|---|---|
| **V2-01** | F — Without Notes | H1 "Your hands typed. You missed the close." | 9:16 Reels | 18.0s | F-R1.3 / F-S1.1 | 2.0 |
| **V2-02** | F — Without Notes | H2 "Stop typing. Start closing." | 9:16 Reels | 12.0s | F-S1.3 (silent-safe serif primitive) | 1.5 |
| **V2-03** | G — Live Signal | H3 "Three signals. Thirty seconds. Watch." | 9:16 Reels | 22.0s | G-R2.1 / G-S2.2 | 3.0 |
| **V2-04** | G — Live Signal | H4 "POV: Tonvo just caught what you missed." | 1:1 Feed | 15.0s | G-R2.3 + G-R2.4 split-screen | 2.0 |
| **TOTAL** | — | — | — | 67.0s combined | — | **8.5 HF-days** |

---

## 2. Scenes requiring tech-director escalation

| Brief | Scene(s) | Decision required | Lane options |
|---|---|---|---|
| V2-01 | S0 (0.0–1.5s) | **Keyboard macro B-roll sourcing** | (a) Pixabay royalty-free (free, on v1 lock) / (b) Kling 3.0 generation (~$0.21, off v1 free-stack) |
| V2-01 | S0 audio | **`keyboard-clatter.wav` availability in `sfx-apple/`** | (a) Confirm exists / (b) Synthesize via ffmpeg / (c) Layer tap-mid + sub-impact |
| V2-01, V2-02, V2-03, V2-04 | typewriter end-card | **Landing typewriter CSS exact-match** | Pull live spec from landing repo. Single tech-director resolution applies to all 4 briefs. |
| V2-03 | S1–S4 (1.5–18.0s) | **Zoom thumbnail sourcing** (highest single risk in the batch) | (a) Pixabay / (b) Kling 3.0 (~$1.40/20s) / (c) Reuse `demo-session.mp4` if buyer thumbnail viable |
| V2-03 | S2/S3/S4 buyer audio | **Synthesized buyer voice lane** | (a) Edge TTS Jenny Neural (free, uniform cadence) / (b) ElevenLabs (~$0.30 total, natural hesitation on drop #3) |
| V2-03 | S2/S3/S4 card flip | **3D Y-axis card flip animation** (new motion code) | (a) GSAP 4 / (b) Motion. ~2 hours new code. |
| V2-04 | inherits V2-03 gates 1, 2 | Same decisions cascade to V2-04 | — |
| V2-04 | 1080×1080 export | **HF true 1:1 export verification** | Ad10 was 1080×1440; confirm square aspect renders cleanly without quirks |
| V2-04 | S4 split-frame | **50/50 split with saturation filters** | New layout primitive, ~1 hour HF work |

**Net escalation count:** 9 distinct decisions. Most cluster on V2-03 (5) and cascade to V2-04. V2-02 has zero escalations — ships first.

---

## 3. External assets to create manually (not in repo)

| Asset | Required by | Path/source | Lead time |
|---|---|---|---|
| Keyboard top-down macro B-roll (2.5s) | V2-01 S0 | Pixabay search OR Kling generation | 1 hour Pixabay / 30 min Kling |
| Zoom-style call thumbnail loop (20s, neutral buyer) | V2-03 S1–S4, V2-04 S0c–S4 (grayscale variant) | Pixabay OR Kling generation OR `demo-session.mp4` reuse | 2 hours sourcing |
| Synthesized buyer audio (3 drops for V2-03, 1 drop for V2-04) | V2-03, V2-04 | Edge TTS Jenny or ElevenLabs | 30 min generation |
| Synthesized room-tone audio bed | V2-03, V2-04 | ffmpeg brown noise + low-pass | 15 min |
| Serif font (Crimson Pro or Playfair Display) | V2-02 S1 only | Google Fonts `@import` | 2 min |
| Landing typewriter CSS spec | All 4 briefs | Pull from landing repo (live site CSS) | 15 min |

**No founder photo / Hedra avatar required.** V1 founder-on-camera anti-strategy lock still in force. All four briefs faceless.
**No FLUX hero stills required.** All assets either reused from V1 or generated in-engine.

---

## 4. Recommended production order

| Wave | Brief | Why | Timeline |
|---|---|---|---|
| **Wave 1A (ship first)** | **V2-02** | Cheapest (1.5 HF-days), zero tech-director escalations, all-on-canvas, silent-safe primary. Acts as the wave-1 launch probe to validate the new landing's signup event. | Day 1 |
| **Wave 1B** | **V2-01** | 2 HF-days, one tech-director gate (keyboard B-roll). Once Pixabay/Kling decision lands, brief ships within 24h. Pairs with V2-02 as the Angle F A/B pair. | Day 1–2 |
| **Wave 2A** | **V2-03** | Heaviest (3 HF-days), 5 tech-director gates. Build LAST in 9:16 set so V2-01/02 are already collecting hold-rate data when V2-03 ships. | Day 3–5 |
| **Wave 2B** | **V2-04** | 2 HF-days, inherits V2-03 decisions. Ships within 24h of V2-03 spine lock. Covers 1:1 Feed placement gap. | Day 5–6 |

**Total wave timeline:** 6 production days. Critical-path bottleneck = V2-03 Zoom thumbnail sourcing (Wave 2A gate #1). If Pixabay can't deliver a usable thumbnail and tech-director approves Kling-3.0 escalation (~$1.40 off v1 free-stack), timeline holds. If both fail, V2-03 falls back to abstract waveform-only treatment — weakens "live" claim but ships on time.

**Concurrent-launch advice:** ship V2-01 + V2-02 same day. Same angle, different hooks, different production weights — measures Angle F effectiveness with two A/B variants from day-1, no waiting for the 9:16 set to complete.

---

## 5. Three risks the copywriter or strategist did not catch

### Risk 1 — The typewriter end-card landing-match is fragile across 4 briefs

All four briefs claim "exact-match the landing's typewriter spec" as the V2 thematic-continuity hypothesis. Strategist + copywriter treat this as a one-time CSS pull. **But:** if the landing repo's typewriter component gets touched (font upgrade, cursor cadence tweak, weight change) between brief signoff and ad-launch, the continuity hypothesis silently breaks on the live ads — and we won't know unless someone manually re-checks. **Mitigation:** lock the landing typewriter CSS to a specific git commit hash referenced in each brief, OR have the landing's component import a single source of truth that the ads also pull from. Without this, every landing-side micro-edit risks invalidating the V2 thematic-match claim retroactively.

### Risk 2 — V2-02's serif font is a stealth visual-language violation

The copy doc explicitly calls for "white serif" on the V2-02 hook. Brief §8 anti-strategy rule 4 forbids "new visual languages." Inter does not have a serif weight; the brief introduces Crimson Pro or Playfair Display as a Google Fonts `@import`. **This is technically a new font in the system.** It's bounded (S1 only, ~2.8s of the 12s ad), but it sets a precedent: copy can introduce new visual languages by specifying typography that the current font stack doesn't carry. If V2-02 underperforms, the post-mortem will mis-attribute the loss to "serif distraction" rather than to angle/copy weakness. **Mitigation:** flag to strategist for explicit approval before V2-02 renders. If strategist rejects the serif, copywriter must rework the hook with an Inter-italic editorial treatment (different visual register, no new font).

### Risk 3 — The V2-03 / V2-04 "synthesized buyer audio" risks an FTC-deceptive-practices interpretation

V1 Resolution-1 settled on `[dramatization]` tags for synthesized voice. Both V2-03 and V2-04 use 1–3 synthesized buyer drops that, in a 1.5s scroll-stop window, may not be parsed as `[dramatization]` even if the metadata is tagged. **The risk:** a viewer perceives the buyer audio as a real recorded customer call, which under US FTC guidance on consumer endorsements (16 CFR §255) could be interpreted as a deceptive representation — even with disclosure. The disclosure must be perceptible, not just metadata-tagged. Neither brief currently specifies an on-screen `[dramatization]` watermark. **Mitigation:** add a faint chrome `[dramatization]` micro-stamp in the bottom-right of the frame whenever synthesized buyer audio is playing (V2-03 S2/S3/S4 = 3 instances, V2-04 S2 = 1 instance). 12px Inter 400, 30% opacity, persistent during the audio drop only. Coordinate with strategist + legal-counsel before launch.

---

## 6. Récap (< 250 words)

Wave 3 dispatch: 4 creative briefs produced for V2 hero variants F (Without Notes) and G (Live Signal). Total: 67s of paid creative across 9:16 and 1:1 formats, 8.5 HF-days production cost. **Ship order: V2-02 → V2-01 → V2-03 → V2-04.** V2-02 is the cheapest, zero-escalation probe — should hit feed within 24h. V2-03 is the heaviest lift (3 days, 5 tech-director gates) and the most ambitious live-action primitive in the campaign.

**Inherited disciplines:** zero unsourced percentage claims (per 00-brief §8.2), all faceless (per V1 anti-strategy lock), iPhone17Mockup on every Tonvo UI shot (per memory rule), `Try Free → tonvo.co` CTA only, Inter + Inter Mono fonts (with the flagged V2-02 serif exception per Risk 2).

**Three under-counted risks now logged**: (1) landing typewriter CSS drift could silently invalidate the V2 thematic-match hypothesis; (2) V2-02's serif font is a stealth visual-language addition needing strategist signoff; (3) synthesized buyer audio in V2-03/V2-04 needs perceptible on-screen `[dramatization]` watermark beyond metadata tags to avoid FTC §255 ambiguity.

**Next agent in pipeline:** tech-director — walk each brief scene-by-scene and produce `brief-NN-tech-overlay.md` files locking the lane decisions on the 9 escalations above. Once tech-director clears V2-02 (zero escalations), it ships first.

---

_End wave 3 summary. Files written: `marketing/meta-campaign-02/04-creative-briefs/V2-01-brief.md`, `V2-02-brief.md`, `V2-03-brief.md`, `V2-04-brief.md`, `_summary.md`._

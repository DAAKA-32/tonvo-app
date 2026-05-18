# Tonvo Ad Production Stack — 2026 Reality

Pragmatic inventory for the Meta-Ads pipeline. Pricing/feature notes from May 2026.

## ⚠️ Campaign-01 lock (Emilien decision, 2026-05-04)

**Faceless + Edge TTS Aria mandate.** v1 ships ENTIRELY on the free stack:
- VO: Edge TTS Aria Neural (en-US-AriaNeural) — no ElevenLabs, no voice clones
- Visuals: HyperFrames chrome + glass + iPhone17Mockup — no Hedra, no founder face, no AI video, no FLUX key art
- Music: `tense-cinematic.mp3` (Pixabay) — no Suno, no Stable Audio
- SFX: existing `sfx-apple/` library — no ElevenLabs SFX

**Premium budget per ad: $0.** Subscription stack monthly: $0. The premium toolbox below is documented for v2+ and for one-off escalations the orchestrator approves — but is OFF for campaign-01.

The premium catalog stays in this doc as the validated 2026 market reference. Rule: any move OFF the free stack requires the orchestrator + Emilien sign-off and goes in `09-verification/founder-overrides.md`.

---

## 1. AI video generation
| Tool | URL | Does | Plan | API | Out | Verdict |
|---|---|---|---|---|---|---|
| **Veo 3.1 (Fast)** | ai.google.dev | T2V/I2V + native audio, 8s max | $0.15/s API | Yes (Gemini/Vertex) | mp4 | Best all-rounder, strongest prompt adherence + sync audio. Loses on long shots and fine character continuity. |
| **Runway Gen-4 / Aleph** | runwayml.com/api | T2V with motion brush, camera control, reference-driven consistency | $0.05/s (Turbo) – $0.12/s (Gen-4) | Yes | mp4 | Industry standard when you need *control*. Aleph (video-to-video edit) is the only tool that lets you re-light/restyle existing footage cleanly. |
| **Kling 3.0 Pro** | kling.ai | T2V/I2V, multi-shot storyboard, native audio | ~$0.07/s no audio, $0.14/s with audio | Yes (via fal.ai or direct) | mp4 | Best price/quality. Beats Runway on liquids/fabric/hair. Skip Sora — OpenAI is sunsetting the API late 2026. |

## 2. 3D web animation frameworks
| Tool | URL | Does | Plan | API | Out | Verdict |
|---|---|---|---|---|---|---|
| **React Three Fiber** | r3f.docs.pmnd.rs | Three.js in declarative React | Free (MIT) | npm | canvas/WebGL | Industry default for our stack. Pairs natively with HyperFrames. |
| **Theatre.js** | theatrejs.com | Timeline + camera director for R3F scenes | Free (Apache) | JS | keyframe JSON | Best-in-class for cinematic camera moves on web 3D. Save edits as JSON, replay in CI. |
| **Spline** | spline.design | GUI-built 3D scenes export to web runtime | $9/mo Pro, free for 1 scene | Runtime SDK only (no headless render) | .splinecode | Good for one-off hero shots, useless for programmatic pipeline. Skip unless designer-led. |

## 3. AI music
| Tool | URL | Plan | API | Out | Verdict |
|---|---|---|---|---|---|
| **ElevenLabs Music** | elevenlabs.io/music | $22/mo Creator | Yes (unified ElevenAPI) | mp3/wav | Cleanest commercial license, fully indemnified on Enterprise. Quality slightly below Suno. **Pick this for ads.** |
| **Suno v5.5** | suno.com | $10/mo Pro | Unofficial via udioapi.pro | mp3 | Best raw quality. **Litigation risk** (Sony unresolved Apr 2026). No indemnification below Enterprise. Use for moodboards, not shipped ads. |
| **Stable Audio 2.5** | stableaudio.com | $12/mo Pro | Yes (Stability API) | wav | Licensed-data trained, agency-safe, but vocals are weak. Good for instrumental beds + stingers. |

## 4. AI voice / TTS
| Tool | URL | Plan | API | Out | Verdict |
|---|---|---|---|---|---|
| **ElevenLabs v3 Multilingual** | elevenlabs.io | $22/mo Creator (10 voice clones) | Yes | mp3/wav | Industry standard. Pro Voice Clone is indistinguishable from real founder takes. **Replace Edge TTS here.** |
| **Cartesia Sonic-3** | cartesia.ai | $15/M chars (~80% cheaper) | Yes | wav | 90 ms TTFA — only pick if doing live voice agents. Quality slightly behind ElevenLabs on emotional range. |
| **PlayHT 4.0** | play.ht | $31/mo Creator | Yes | mp3 | 600+ stock voices, weaker cloning. Skip — ElevenLabs covers this. |

## 5. AI sound effects
| Tool | URL | Plan | API | Out | Verdict |
|---|---|---|---|---|---|
| **ElevenLabs SFX v2** | elevenlabs.io/sound-effects | Same plan as TTS | Yes | wav 48k | 30 s clips, seamless loop param, royalty-free. **Replace ffmpeg synth.** |
| **Stable Audio FX** | stableaudio.com | $12/mo | Yes | wav | More creative control via prompt knobs. Use for stylized whooshes/UI clicks. |
| **Soundraw** | soundraw.io | $17/mo | Limited API | mp3 | GUI-first. Skip for programmatic. |

## 6. AI image generation
| Tool | URL | Plan | API | Out | Verdict |
|---|---|---|---|---|---|
| **FLUX 1.1 Pro / FLUX 2** | blackforestlabs.ai | $0.04–$0.08/img | Yes (BFL, fal, Replicate) | png | Best photorealism, commercial-friendly license. Default for product key art. |
| **Ideogram v3** | ideogram.ai | $0.08/img | Yes | png | Only tool that renders text in-image reliably — use for any asset with copy baked in. |
| **Midjourney v8 Alpha** | midjourney.com | $30/mo | Limited beta API | png | Best illustration. **Restrictive commercial terms.** Skip for paid ads, keep for moodboards. |

## 7. Programmatic video editing
| Tool | URL | Plan | API/CLI | Out | Verdict |
|---|---|---|---|---|---|
| **Remotion 5** | remotion.dev | $0 <$1M ARR | CLI + Lambda | mp4/webm | Industry standard. Slots in *parallel* with HyperFrames — use for compositing the final ad reel. |
| **Revideo** | re.video | MIT free | Yes | mp4 | Best for fully-automated pipelines (templating + render API). Pick this if HyperFrames feels too brittle. |
| **Motion Canvas** | motioncanvas.io | MIT | TS gen-fn | mp4 | Beautiful for hand-crafted explainers. Overkill for ad volume. |

## 8. AI avatar / talking head
| Tool | URL | Plan | API | Out | Verdict |
|---|---|---|---|---|---|
| **Hedra Character-3** | hedra.com | $30/mo Creator | Yes (Feb-26 GA) | mp4 | Best phoneme lip-sync from a single still. Perfect for "founder Loom" style ads with one Emilien photo. |
| **HeyGen Avatar IV** | heygen.com | $89/mo Team | Yes | mp4 | Hyperreal full-body avatars, 175+ languages. Overkill + uncanny for a $19/mo SaaS — feels enterprise. |
| **Synthesia 3.0** | synthesia.io | $89/mo Starter | Yes | mp4 | Corporate-training vibe. Skip. |

## 9. Motion design / interactive web animation
| Tool | URL | Plan | API | Out | Verdict |
|---|---|---|---|---|---|
| **GSAP 4** | gsap.com | Free (now MIT under Webflow) | JS | DOM | Already in stack. Keep. Best for scroll/timeline. |
| **Motion (ex-Framer Motion)** | motion.dev | Free | React/JS | DOM | 2.5–6× faster than GSAP on unknown values. Use for React-rendered ad components. |
| **Rive** | rive.app | $14/mo Pro | Runtime SDK | .riv | State-machine animations, 50–80% smaller than Lottie. Use for icon FX inside the iPhone17 mockup. |

---

## Recommended stack for Tonvo (200 words)

**Adopt now (5 tools, ~$110/mo):**
1. **ElevenLabs (Creator $22)** — replaces Edge TTS for VO **and** ffmpeg SFX. One API, two pipeline beats.
2. **Suno Pro ($10)** for music *exploration* + **Stable Audio Pro ($12)** for the *final shipped* bed. Suno gives the hook; we re-prompt Stable Audio in the same key for indemnified delivery.
3. **FLUX 1.1 Pro via fal.ai (~$0.04/img, pay-as-you-go)** — slots before HyperFrames as the key-art generator for chrome/glass hero stills. Replaces stock.
4. **Hedra Creator ($30)** — single beat: founder-talking-head opener using Emilien's photo + ElevenLabs clone. Kills the need to film.
5. **Kling 3.0 via fal.ai (~$0.07/s)** — slots between HyperFrames shots for the rare cinematic B-roll (cursor flying through space, abstract motion). Cap at 3 shots/ad.

**Skip for now:** HeyGen, Synthesia, Midjourney API, Spline, Sora, Veo Standard ($0.40/s is over-investment for sub-15s ads).

**Pipeline slot order:** FLUX (key art) → Hedra (founder open) → HyperFrames + Playwright (UI demo) → Kling (B-roll) → Remotion (composite) → ElevenLabs (VO + SFX) → Stable Audio (music bed) → ffmpeg (final mux).

**Realistic incremental cost per 30 s ad:** ~$3.50 (Kling 15 s = $1.05, FLUX 4 stills = $0.16, Hedra 10 s = $0.80, ElevenLabs ~$0.30, music amortized $1.20 across 10 ads/mo subs).

# Tonvo Meta Ads — Campaign 01 (Kickoff Brief)

_Owner: Emilien · Orchestrator: Claude Opus · Date: 2026-05-03_

## What we're doing

First Meta Ads campaign for Tonvo. The team is AI-driven (subagents in `.claude/agents/`) with Emilien as founder/GM and Claude Opus as Head of Marketing.

## Product (locked)

- **Tonvo** — live closing copilot for sales reps. Surfaces objections, "say this" coaching, close-rate score during Zoom/Meet/Teams calls.
- **Promise:** +27% close rate without changing your pitch.
- **Pricing:** Free Starter (3 sessions/mo) → Closer $19/mo → Sales Team $49/user/mo. Annual saves 30%.

## Campaign parameters

| Parameter | Value |
|-----------|-------|
| **Geo** | United States only |
| **Language** | US English |
| **Objective** | Sales (Conversions → Signup event) |
| **CTA** | "Try Free → tonvo.co" — landing on `/login`, free tier signup |
| **Primary KPI** | Cost per signup (CPS) |
| **Secondary KPI** | Free → activated (first session) |
| **Budget posture** | Test budget — €30-50/day × 3-4 ad sets ≈ $1k/month, adjust at launch |
| **Funnel** | Cold ad → tonvo.co → signup (no card) → activate first session → upsell to Closer/Team |

## Existing creative assets to reuse

- **Ad11** (`Tonvo-Ad-HF/`) — 1080×1920 (9:16), 32s, "POV: $50K Lost Deal"
- **Ad10** (`Tonvo-Ad-HF-27pc/`) — 1080×1440 (3:4), 33.7s, "+27% More"
- **Demo-session capture** (`assets/demo-session.mp4`) — real Tonvo UI, 15s, iPhone 17 mockup
- **SFX library** — 15 Apple-grade WAVs in `assets/audio/sfx-apple/`
- **Music bed** — `tense-cinematic.mp3` (Pixabay, Trent-Reznor adjacent)
- **Slogan locked** — "Never miss a word with Tonvo · Try Free → tonvo.co · 30s setup, no card"

## The team (expanded)

| Role | Agent file | Output location |
|------|------------|-----------------|
| Founder/GM | Emilien | — |
| Head of Marketing (orchestrator) | Claude Opus | — |
| Strategist | `.claude/agents/strategist.md` | `01-strategy/` |
| Ad Researcher | `.claude/agents/ad-researcher.md` | `02-research/` |
| Copywriter | `.claude/agents/copywriter.md` | `03-copy/` |
| **Hook Specialist** | `.claude/agents/hook-specialist.md` | `03-copy/hooks-refined.md` |
| Creative Director | `.claude/agents/creative-director.md` | `04-creative-briefs/` |
| **Tech Director** | `.claude/agents/tech-director.md` | `04-creative-briefs/brief-NN-tech-overlay.md` |
| Producer (HyperFrames + premium stack) | Claude Opus + tools | `05-creatives/` |
| Media Buyer | `.claude/agents/media-buyer.md` | `06-media-plan/` |
| Analyst | `.claude/agents/analyst.md` | `07-results/` |

## Production stack (campaign-01 LOCKED — 2026-05-04 Emilien decision)

**Faceless + Edge TTS Aria mandate.** All 12 launchable ads ship on the FREE stack:

- **Composition:** HyperFrames (HTML+GSAP) — chrome silver-sweep + glass cards + iPhone17Mockup
- **VO:** Edge TTS Aria Neural (`en-US-AriaNeural`) — single voice across the entire campaign
- **Music:** `tense-cinematic.mp3` (Pixabay, royalty-free, already in assets/)
- **SFX:** existing `sfx-apple/` library (15 WAVs, ffmpeg-synthesized, Apple-grade, brand-tuned)
- **Demo capture:** Playwright → `assets/demo-session.mp4` (15s real Tonvo UI capture)
- **Final mux:** ffmpeg

**No Hedra (no founder face, faceless mandate).** **No ElevenLabs (Edge TTS sufficient).** **No FLUX (no static key art needed for any of the 5 briefs).** **No Kling/Runway/Veo (chrome CSS is the brand asset, AI video is over-investment).** **No Suno/Stable Audio (Pixabay track locked for v1).**

Premium toolbox (ElevenLabs, Hedra, FLUX, Kling, Suno, Stable Audio) stays documented in `08-tooling/production-stack.md` as v2+ reference but is OFF for campaign-01. **Premium per-ad cost: $0. Premium subscription monthly: $0.**

Any deviation requires Emilien sign-off + log entry in `09-verification/founder-overrides.md`.

## Installed Claude skills (.claude/skills/)

For team capability beyond default Claude:
- **using-superpowers, brainstorming, writing-plans, dispatching-parallel-agents, verification-before-completion, writing-skills** (obra/superpowers) — orchestration discipline
- **skill-creator, webapp-testing, mcp-builder** (anthropics/skills) — tooling extensions
- **frontend-design, claude-api** — system-installed

## Sprint 1 plan

1. **Day 0 — Kickoff (now):** Strategist + Researcher run in parallel. Output: `01-strategy.md` + `swipe-file.md`.
2. **Day 0 — Copy + Briefs:** Copywriter reads strategy + research → `copy.md`. Creative Director → 5-7 video briefs.
3. **Day 1-3 — Production:** Generate ad MP4s via HF pipeline (Ad12, Ad13, … + reformat Ad10/Ad11 to 1:1 if needed).
4. **Day 3 — Media plan:** Media Buyer outputs ad sets, audiences, naming, UTMs.
5. **Day 4 — Launch:** Emilien validates, builds in Meta Ads Manager, launches.
6. **Day 7 — First read:** Analyst pulls report. Iterate.

## Kill rules (defined upfront, enforced by analyst)

- Kill ad if spend > 2× target CPS with 0 signups
- Kill ad set if CPS > 3× target after 50 link clicks AND no signup
- Scale ad set +20%/day if CPS < 0.7× target for 3 consecutive days
- No panic edits in first 72h

## Open questions for Emilien (non-blocking)

1. Final budget at launch — confirmed range or hard cap?
2. Meta Pixel + CAPI status on tonvo.co — already installed and firing `Signup` event?
3. Domain verified in Meta Business Manager?
4. Any off-limits angles or claims (compliance / brand)?

These don't block kickoff. We move forward; Emilien answers when convenient.

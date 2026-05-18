# Verification Report — Tonvo Meta Ads campaign-01
_2026-05-03 · verifier: Claude Opus subagent · per `verification-before-completion` skill_

## Iron Law check
> NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE.
> This report ran fresh reads of every deliverable in `marketing/meta-campaign-01/`, every agent file in `.claude/agents/`, and probed the filesystem for the production assets the briefs depend on. No claim below is made without quoting file+line.

## TL;DR — overall verdict

The **paper deliverables are coherent and largely shippable**: 18 markdown files exist, the strategy → research → copy → hooks → briefs → tech-overlay → media-plan chain holds together with one renamed angle (D, "Stop Pitching From Memory") consistently propagated to all downstream artifacts; the 12-ad media-plan matrix (4 ad sets × 3 ads) sums correctly; budget arithmetic checks; cross-references between hook letters / primary letters / headline letters mostly match across copy → brief → media-plan.

But: **the campaign is NOT producible today as the media plan implies**. Of the 12 launch ads, only 2 have been physically rendered (Ad11 master 9:16 and Ad10 master 3:4). The other 10 ads each require new HF directories, new VO files, new builds — none of which exist on disk yet. The media plan documents a "launch sequence" and references creative outputs that the producer has not produced. The brief layer is detailed enough to act on, but the orchestrator must not interpret the existence of the briefs as evidence the ads are built. Additionally there is a **load-bearing asset name bug**: Brief B references `assets/audio/ad10_*.mp3` files that do not exist on disk — the actual Ad10 audio files are named `ad8_*.mp3` (legacy from Ad8 → Ad10 evolution). The producer following Brief B verbatim will fail at Step 1.

There are also several smaller consistency drifts: residual "Stop winging it" language in copy.md and brief-D after the Angle D rename; `assets/audio/` paths in briefs that are written as if the asset folder is at the Cue-app repo root, when it actually lives at `Tonvo-Ad-HF/assets/`; a 1-char overrun in one Headline.

**Verdict: SHIP-PLANNABLE, NOT SHIP-READY.** Honest rating: ~85% of paper work is solid; the remaining 15% are gaps that will block the producer or cause silent post-launch confusion if not patched first.

---

## 1. Spec coverage

Strategy doc lists 5 angles (A/B/C/D/E) and 4 ICPs (ICP-1 to ICP-4 — ICP-4 is retarget-only). Coverage trace:

| Strategy element | Downstream artifact | Status | Evidence |
|---|---|---|---|
| Angle A "POV: $50K" (`01-strategy.md:93-98`) | copy.md Angle A · hooks-refined Angle A · brief-A-pov-50k · brief-A-tech-overlay · media-plan AS-1+AS-3+AS-4 | **PASS** | `copy.md:10`, `hooks-refined.md:11`, `brief-A-pov-50k.md:1`, `brief-A-tech-overlay.md:1`, `media-plan.md:160-170` |
| Angle B "+27% Same Pitch" (`01-strategy.md:100-105`) | copy.md Angle B · hooks-refined Angle B · brief-B-27pc · brief-B-tech-overlay · media-plan AS-2+AS-3+AS-4 | **PASS** | `copy.md:38`, `hooks-refined.md:53`, `brief-B-27pc.md:1`, `brief-B-tech-overlay.md:1`, `media-plan.md:163-171` |
| Angle C "The Gap" (`01-strategy.md:107-112`) | copy.md Angle C · hooks-refined Angle C · brief-C-the-gap · brief-C-tech-overlay · media-plan AS-2+AS-4 | **PASS** | `copy.md:66`, `hooks-refined.md:95`, `brief-C-the-gap.md:1`, `brief-C-tech-overlay.md:1`, `media-plan.md:165, 170` |
| Angle D "Stop Pitching From Memory" (`01-strategy.md:114-119`) | copy.md Angle D · hooks-refined Angle D · brief-D-stop-pitching · brief-D-tech-overlay · media-plan AS-1+AS-3 | **PASS** (with rename drift — see §3) | `copy.md:94`, `hooks-refined.md:137`, `brief-D-stop-pitching.md:1`, `brief-D-tech-overlay.md:1`, `media-plan.md:162, 168` |
| Angle E "Silent Cofounder" (`01-strategy.md:121-126`) | copy.md Angle E · hooks-refined Angle E · brief-E-silent-cofounder · brief-E-tech-overlay · media-plan reserve only | **PASS** | `copy.md:123`, `hooks-refined.md:179`, `brief-E-silent-cofounder.md:1`, `brief-E-tech-overlay.md:1`, `media-plan.md:154, 180` |
| ICP-1 "Quota-Slipping AE" (60% spend) | AS-1 ad set + Brief A primary + Brief D secondary | **PASS** | `media-plan.md:76-89` (AS-1 lead angles "A primary, D secondary"); strategy `01-strategy.md:22` |
| ICP-2 "Top-Rep Hunter" (25% spend) | AS-2 ad set + Brief B primary + Brief C secondary | **PASS** | `media-plan.md:93-106` |
| ICP-3 "Founder" (15% spend) | AS-3 ad set + Briefs A/B cross + Brief E reserve | **PASS** | `media-plan.md:110-123` |
| ICP-4 "Sales Manager" (retarget only, NOT cold) | Explicitly excluded from cold prospecting | **PASS** | strategy `01-strategy.md:56-63`; AS-1 excludes "VP of Sales, CRO, Head of Sales, Sales Director, Sales Manager" `media-plan.md:87` |
| KPI: target CPS $8-$15 | Kill rules reference 2× ($30) and 3× ($45) | **PASS** | strategy `01-strategy.md:185`, kill rules `media-plan.md:250-258` |
| KPI: hold rate 50-60% | Kill rule for hold rate <35% | **PASS** | strategy `01-strategy.md:188`, kill rule `media-plan.md:255` |
| Anti-strategy: no Book-a-Demo CTA | All ad CTAs are `Try for Free` (A-D) or `Sign Up` (E) | **PASS** | strategy `01-strategy.md:200-202`; copy `copy.md:31, 59, 87, 116, 144` |
| Anti-strategy: no founder-on-camera | All ads all-on-canvas | **PARTIAL** | strategy `01-strategy.md:216`; tech-overlay `brief-E-tech-overlay.md:14` actively recommends Hedra (founder face) for E S1, with rationale that ICP-3 audience separation justifies the brand-continuity break — this **contradicts the strategy doc's locked anti-strategy** and is not flagged as a strategy override anywhere |
| Sprint 1 D-7 first read (00-brief.md) | media-plan launch sequence D+7 | **PASS** | `00-brief.md:83`, `media-plan.md:366-372` |

**Spec-coverage gaps:**

- **Anti-strategy violation (Hedra on E S1):** `brief-E-tech-overlay.md:14, 22-42` recommends shipping S1 with Hedra Character-3 + ElevenLabs voice clone of Emilien — i.e., literal founder face. Strategy doc `01-strategy.md:216` explicitly states "**No founder-on-camera ads in v1.** Emilien's time is better spent on product and approving creative than on filming." Tech-director rationale that Hedra avoids filming is technically true, but the strategy reasoning ("brand consistency", "v1 problem") is broader than just filming logistics. **This needs a strategist override or a Hedra opt-out.** Not currently flagged.

---

## 2. Placeholder scan

Searched all 18 deliverables for: `TBD`, `TODO`, `implement later`, `fill in details`, `as needed`, `FIXME`, `XXX`. **0 placeholders found.**

Caveats / soft placeholders that are not literal "TBD" but are deferred decisions:

- `brief-A-tech-overlay.md:55, 110` — `<your_key>` placeholder for `ELEVENLABS_API_KEY` env var. This is correct convention (don't commit secrets) but worth noting as a producer-time fill-in.
- `brief-B-tech-overlay.md:74` — same `<your_key>` pattern.
- `brief-C-tech-overlay.md:88` — same.
- `brief-E-tech-overlay.md:111, 127, 158` — same `<your_key>` for both `ELEVENLABS_API_KEY` and `HEDRA_API_KEY`.
- `media-plan.md:141` — "**Open dependency:** if Tonvo has zero seed signal at launch (Pixel just installed, no CRM file), drop AS-4..." — this is a documented conditional, not a placeholder.
- `00-brief.md:92-99` — "Open questions for Emilien (non-blocking)" lists 4 unresolved items (budget, Pixel/CAPI status, domain verification, off-limits angles). Not a placeholder per se — explicitly framed as Emilien-action items. **However, media-plan §7 elevates 4 of these to "LAUNCH BLOCKERS"** (`media-plan.md:228-242`) — so the "non-blocking" framing in 00-brief is weaker than the media-plan's framing. Consistent enough but tonally drifts.

**0 strict placeholders. ~5 deferred-decision items, all explicitly framed as such.**

---

## 3. Type/name consistency

| Reference | From | To | Status | Evidence |
|---|---|---|---|---|
| Angle D = "Stop Pitching From Memory" | strategy v1.1 (`01-strategy.md:114, 136`) | copy.md, hooks-refined, brief-D-stop-pitching, brief-D-tech-overlay, media-plan | **PASS — angle name propagated** | `copy.md:94`, `hooks-refined.md:137`, `brief-D-stop-pitching.md:1`, `brief-D-tech-overlay.md:1`, `media-plan.md:89` |
| Angle D rename — residual "Stop winging it" copy | copywriter concern #4 (`copy.md:159`) flagged the issue, strategist renamed | "Stop winging it" still appears as **Headline A** for Angle D in `copy.md:110` AND as Static B fallback note in `brief-D-stop-pitching.md:114` | **DRIFT** | `copy.md:110` literally reads `A. Stop winging it. (16) · B. Stop pitching from memory. (26) · C. The playbook, in the call. (27)` — Headline A still uses the old language. Brief D `brief-D-stop-pitching.md:114`: "**Hook 1 ('Stop winging it')** is the weakest of the three" — references a hook that copywriter renamed (Hook 1 in copy.md is "Stop pitching from memory.", not "Stop winging it"). |
| Hook letter mapping (Hook 1/2/3) — Angle A | copy.md Angle A Hook 1 = "POV: you just lost a $50K deal." (`copy.md:15`) | brief-A-pov-50k.md `Hook 1` = "POV: you just lost a $50K deal." (`brief-A-pov-50k.md:8`) | **PASS** | exact match |
| Hook letter mapping — Angle A Hook 2 | copy.md Angle A Hook 2 = "The deal you needed just ghosted you." (`copy.md:16`) | brief-A-pov-50k.md "Hook 2 ('ghosted')" = "The deal you needed just ghosted you." (`brief-A-pov-50k.md:9`) | **PASS** | exact match |
| Hook letter mapping — Angle B | copy.md Angle B Hook 3 = "1,247 closers. +27% close rate. Same pitch." (`copy.md:46`) | brief-B-27pc.md Hook = "1,247 closers. +27% close rate. Same pitch." (`brief-B-27pc.md:8`) | **PASS** | exact match |
| Hook letter mapping — Angle C | copy.md Angle C Hook 1 = "Your top rep isn't smarter." (`copy.md:73`) | brief-C-the-gap.md Hook = "Your top rep isn't smarter." (`brief-C-the-gap.md:8`) | **PASS** | exact match |
| Hook letter mapping — Angle D | copy.md Angle D Hook 3 = "Your playbook is a PDF nobody opens." (`copy.md:102`) | brief-D-stop-pitching.md Hook (motion) = "Your playbook is a PDF nobody opens." (`brief-D-stop-pitching.md:9`) | **PASS** | exact match |
| Hook letter mapping — Angle D Hook 2 | copy.md Hook 2 = "POV: it's Friday, 3 calls, 0 deals." (`copy.md:101`) | brief-D-stop-pitching.md Hook 2 ref `brief-D-stop-pitching.md:11`: "Hook 2 ('POV: it's Friday, 3 calls, 0 deals')" | **PASS** | exact match |
| Hook letter mapping — Angle E | copy.md Angle E Hook 3 = "Your silent cofounder runs in your browser." (`copy.md:130`) | brief-E-silent-cofounder.md Hook = "Your silent cofounder runs in your browser." (`brief-E-silent-cofounder.md:8`) | **PASS** | exact match |
| Headline letter mapping — A | copy.md Angle A Headlines `A. You lost a $50K deal. · B. Hear the deal during it. · C. Catch the signal you missed.` (`copy.md:25`) | brief-A "Headline A on master" + "Headline B on 1:1 challenger" (`brief-A-pov-50k.md:11`) | **PASS** (uses A on master, B on challenger) | letter cross-ref consistent |
| Headline letter mapping — B | brief-B-27pc.md "Hook 3 + Primary B + Headline B" (`brief-B-27pc.md:9`) — Headline B = "Same pitch. +27% close." (`copy.md:53`) | media plan ad name `Ad-B-27pc-9x16_h3_pB_hlB` (`media-plan.md:163`) | **PASS** | letter token `hlB` matches |
| Headline letter mapping — C | brief-C uses "Hook 1 + Primary A + Headline C" (`brief-C-the-gap.md:9`); Headline C = "Run what #1 runs." (`copy.md:81`) | media plan `Ad-C-Gap-9x16_h1_pA_hlC` (`media-plan.md:165`) | **PASS** | letter token `hlC` matches |
| Headline letter mapping — D | brief-D static lead "Hook 3 + Primary B + Headline C" (`brief-D-stop-pitching.md:11`); Headline C = "The playbook, in the call." (`copy.md:110`) | media plan `Ad-D-StopPitch-Static-1x1_h3_pB_hlC` (`media-plan.md:168`) | **PASS** | letter token `hlC` matches |
| Headline letter mapping — D motion | brief-D motion lead "Hook 2 + Primary A + Headline C" (`brief-D-stop-pitching.md:11`) | media plan `Ad-D-StopPitch-9x16_h2_pA_hlC` (`media-plan.md:162`) | **PASS** | letter token `h2_pA_hlC` matches |
| Char-limit claim — copy.md Headline A Angle A "(21)" | "You lost a $50K deal." — 21 chars including period | **PASS** | manually counted: Y-o-u(3)+space(1)+l-o-s-t(4)+space(1)+a(1)+space(1)+$-5-0-K(4)+space(1)+d-e-a-l(4)+.(1) = 21 |
| Char-limit claim — copy.md Headline C Angle A "(27)" | "Catch the signal you missed." — claimed 27 | **FAIL — off-by-one (28 chars)** | manual count: C-a-t-c-h(5)+space(1)+t-h-e(3)+space(1)+s-i-g-n-a-l(6)+space(1)+y-o-u(3)+space(1)+m-i-s-s-e-d(6)+.(1) = 28. **Exceeds Meta's 27-char headline cap → will truncate on small screens.** Copywriter's own note flagged this risk: `copy.md:34`: "Headline C is at exact 27 chars; if Meta truncates with ellipsis on an unfamiliar font we lose 'missed' — keep Headline B as the safer default." Note ironic: the copywriter thought it was "exact 27" but it's actually 28. |
| iPhone17Mockup wrap rule | `00-brief.md` user-memory rule | All briefs S3 explicitly state "iPhone17Mockup wrap (per memory rule)" | **PASS** | `brief-A-pov-50k.md:24`, `brief-B-27pc.md:21`, `brief-C-the-gap.md:21`, `brief-D-stop-pitching.md:53`, `brief-E-silent-cofounder.md:22` |
| Slogan-locked rule | `00-brief.md:35`: "Never miss a word with Tonvo · Try Free → tonvo.co · 30s setup, no card" | All S6 sections quote slogan exactly | **PASS** | `brief-A-pov-50k.md:25`, `brief-B-27pc.md:23`, `brief-C-the-gap.md:23`, `brief-D-stop-pitching.md:55`, `brief-E-silent-cofounder.md:24` |
| Brief E CTA exception | E uses "Sign Up →" not "Try Free →" per copywriter concern #6 | brief-E `:24` ("Sign Up →" pill); media-plan §11 appendix Q5 (`media-plan.md:387`) acknowledges split | **PASS** | both docs converge on the split |
| Tech-overlay file naming pattern | `00-brief.md:48` template `brief-NN-tech-overlay.md` | all 5 tech overlays exist as `brief-A-tech-overlay.md` … `brief-E-tech-overlay.md` (letter, not NN) | **DRIFT (cosmetic)** | minor — letters were used instead of numbers, consistent across all 5 |

---

## 4. Internal consistency

| Claim | Verified? | Evidence |
|---|---|---|
| Media plan ships 12 ads | **PASS** | `media-plan.md:14` "12 ads total at launch"; matrix at `media-plan.md:158-171` lists exactly 12 rows; AS-1 (3) + AS-2 (3) + AS-3 (3) + AS-4 (3) = 12 |
| Each ad set has exactly 3 ads | **PASS** | counted: AS-1 rows `media-plan.md:160-162` (3), AS-2 rows `:163-165` (3), AS-3 rows `:166-168` (3), AS-4 rows `:169-171` (3) |
| Budget split 60/25/15 sums correctly to base | **PASS at floor; DRIFT at mid/stretch (rounding)** | Floor: $60+$25+$15 = **$100** ✓ exact 60/25/15. Mid: $80+$32+$20 = **$132**, ratios = 60.6/24.2/15.2 (≈close but not exact 60/25/15 — exact would be $79.20/$33/$19.80). Stretch: $100+$42+$25 = **$167**, ratios = 59.9/25.1/14.97 (≈ exact at stretch). Rounding intentional and within media-buyer convention. **Acceptable.** |
| AS-4 LAL is additive, not part of 60/25/15 | **PASS** | `media-plan.md:127` "(~10–15% of total spend, **additive**)"; `media-plan.md:264` confirms "Control add-on (additive, not redistributed)" |
| Total daily ranges (Floor / Mid / Stretch) | **PASS** | Floor: $100 base + $15 LAL = $115 ✓ (`media-plan.md:284`). Mid: $132 + $20 = $152 ✓ (`:285`). Stretch: $167 + $25 = $192 ✓ (`:286`). |
| Each ad set's lead angle matches the brief targeting field | **PASS** | AS-1 ICP-1 → Brief A targets "ICP-1 primarily" (`brief-A-pov-50k.md:10`) ✓. AS-2 ICP-2 → Brief B targets "ICP-2 primarily" (`brief-B-27pc.md:10`) ✓ + Brief C "ICP-2 primary" (`brief-C-the-gap.md:10`) ✓. AS-3 ICP-3 → Brief E (reserve) targets "ICP-3 primary" (`brief-E-silent-cofounder.md:10`) + Brief A cross-tested per strategy `01-strategy.md:46-54`. AS-4 LAL → mixed, intentional |
| Brief E reserve status enforced in media plan | **PASS** | `media-plan.md:14` "Brief E held in reserve for week-2 trigger"; `media-plan.md:154` "Brief E held for week-2 trigger"; trigger condition documented `media-plan.md:255` (kill rule) and `media-plan.md:359` (D+5 sequence) |
| Kill rules in media plan match 00-brief kill rules | **MOSTLY PASS** | brief `00-brief.md:87-90`: "Kill ad if spend > 2× target CPS with 0 signups · Kill ad set if CPS > 3× target after 50 link clicks AND no signup · Scale ad set +20%/day if CPS < 0.7× target for 3 consecutive days · No panic edits in first 72h" — all 4 are restated identically in `media-plan.md:250-254`. **PASS** on the original 4. The media plan adds 3 NEW kill rules not in the brief (`:255-258`: hold rate <35%, Brief A+D both >1.5×, +27% claim flagged) — these are extensions, not contradictions. **Acceptable.** |
| 12 ads producible (have a brief + tech-overlay) | **PASS on paper** | every ad in the matrix maps to a brief (A/B/C/D) and that brief has a tech overlay. **Producibility on disk: see §6 — only 2 of 12 are physically rendered.** |
| Brief B no-+27% fallback exists | **PASS as spec, NOT YET PRODUCED** | `brief-B-27pc.md:27-40` defines fallback table; `brief-B-tech-overlay.md:18, 60-109` defines producer steps. **Directory `Tonvo-Ad-HF-27pc-fallback/` does not exist on disk** (verified via `ls`). Spec-complete, build-incomplete. |
| Pre-launch / launch blockers consistency | **PASS** | `media-plan.md:228-242` states "No ad goes live until all four boxes below are green" — 4 explicit blockers (Pixel, Signup event, CAPI, domain verification, AEM priority). Echoes `00-brief.md:92-99` open questions. Same blockers, elevated severity. |

---

## 5. Missing elements

Things promised in upstream docs but not delivered downstream, or referenced but unbuilt:

1. **Ad10 VO file naming bug.** Brief B (`brief-B-27pc.md:46`): "**VO (master 3:4):** existing Ad10 VO files (likely `assets/audio/ad10_*.mp3` — confirm with producer; reuse don't re-record)". Brief B tech-overlay (`brief-B-tech-overlay.md:55`): "VO files: copy Ad10 VO files (`assets/audio/ad10_*.mp3`) — confirm filenames at producer-time. DO NOT re-render." **Filesystem reality:** `Tonvo-Ad-HF-27pc/assets/audio/` contains `ad8_s1.mp3`, `ad8_s2.mp3`, `ad8_s3.mp3`, `ad8_s4.mp3` — but no `ad10_*` files. The producer following the brief will hit a missing-file error. The brief's "confirm filenames at producer-time" hedge anticipates this but doesn't fix it.

2. **Asset path drift across all briefs.** Briefs reference `assets/audio/...`, `assets/demo-session.mp4`, `assets/logo-tonvo-remove.png` as if root-relative. **Filesystem reality:** Cue-app repo root has NO `assets/` folder. The actual paths are `Tonvo-Ad-HF/assets/audio/...` and `Tonvo-Ad-HF-27pc/assets/audio/...`. Each brief implicitly assumes the producer is `cd`-ing into the forked HF directory before running anything. The fork commands (e.g., `brief-A-tech-overlay.md:43-44`: `cp -r "Tonvo-Ad-HF" "Tonvo-Ad-HF-1x1" && cd "Tonvo-Ad-HF-1x1"`) confirm this convention — but a producer reading just the scene plan or audio plan will be confused. **Cosmetic but non-zero risk.**

3. **No ads physically produced beyond Ad11 + Ad10 masters.** Of 12 ads in the launch matrix:
   - `Ad-A-POV50k-9x16_h1_pA_hlA` — Ad11 master, **EXISTS** at `Tonvo-Ad-HF/renders/Tonvo-Ad-HF_*.mp4` (multiple takes)
   - `Ad-B-27pc-3x4_h3_pB_hlB` — Ad10 master, **EXISTS** at `Tonvo-Ad-HF-27pc/renders/Tonvo-Ad-HF-27pc_*.mp4`
   - The other 10 ads require directories that **do not exist on disk**: `Tonvo-Ad-HF-1x1/`, `Tonvo-Ad-HF-1x1` Variant B, `Tonvo-Ad-HF-27pc-9x16/`, `Tonvo-Ad-HF-27pc-fallback/`, `Tonvo-Ad-HF-gap/` (+1:1 +static), `Tonvo-Ad-HF-stop-pitching/` (+statics), `Tonvo-Ad-HF-cofounder/` (reserve, OK to defer)
   - **The 12-ad launch is paper-ready but not bit-ready. The media plan does not explicitly flag this gap; readers may assume the briefs imply the renders.**

4. **Brief D Static C tone-flag, but no Static A/B/C 4:5 file directory plan.** `brief-D-stop-pitching.md:107`: "Static 4:5 (1080×1350)" listed as primary lead, but no separate output naming convention from 1:1. Tech-overlay `brief-D-tech-overlay.md:114-118` shows render command targeting `out/static-d/` with `--aspects "1080x1080,1080x1350"` — fine as spec, but `out/static-d/` doesn't exist yet. **Spec-complete, build-incomplete.**

5. **Hedra Character-3 endpoint URL is unverified.** `brief-E-tech-overlay.md:160`: `--url "https://api.hedra.com/v1/character-3/generate"` — production-stack.md only says "Yes (Feb-26 GA)" for API availability. The exact endpoint path was not validated against Hedra docs (Context7 / Hedra API reference). **UNVERIFIABLE: would require Hedra API doc check at producer-time.** Tech-director's brief is a reasonable guess but not confirmed.

6. **ElevenLabs voice ID `21m00Tcm4TlvDq8ikWAM` (Rachel preset) used in brief-A/B/C tech-overlays.** This voice ID is the canonical Rachel preset on ElevenLabs (publicly documented), but **the report cannot independently verify it from the provided files**. UNVERIFIABLE without an ElevenLabs API call.

7. **"1,247 closers" proof line.** Strategy doc and copy doc both flag this is "confirmed-in-use on existing ads" and treat it as locked truth. But: the report cannot verify whether 1,247 is a current accurate Tonvo user count or a snapshot from when Ad10 shipped (2-week-old number). Copywriter concern #5 (`copy.md:161`): "**No `[needs verification]` flagged on the '1,247 closers' proof line** because the brief and strategy doc both note it's confirmed-in-use on existing ads. If that number ever changes, every Angle B variant that uses it needs updating." Number is treated as load-bearing across A (S4 testimonial), B (S0+S4), and D (S4) but is not date-stamped or sourced anywhere. **Risk: stale number ships into 12 ads.**

8. **`+27% claim` substantiation pack not produced.** `media-plan.md:307-310`: "Substantiation pack (have this ready in case Meta requests it...): Source for the +27% number..." — this pack is described as "have this ready" but is not actually produced anywhere in the campaign workspace. If Meta challenges the claim post-launch, the team has 24h to assemble this. **Substance: not pre-built.**

9. **AS-4 LAL seed audience contingency.** `media-plan.md:141`: "if Tonvo has zero seed signal at launch (Pixel just installed, no CRM file), drop AS-4 and reallocate". Reasonable conditional, but no explicit pre-check is in the D-1 sequence at `media-plan.md:330-336`. The "Build LAL seed audience (per priority list in AS-4)" line is there (`:332`), but the fallback of dropping AS-4 entirely should be explicit too — currently only buried in §3.

10. **Hook 5 wordless variants — production cost not assigned to producer.** hooks-refined `hooks-refined.md:226`: "**Wordless-hook coverage:** Each angle has at least one wordless variant (A4, B5, C3, D5, E5) — required for the ~60% of Reels viewed sound-off." But the creative-director briefs **do not pick up the wordless hook for any S0 of the 12 launch ads**. All launch ads use a verbal hook. The wordless-hook intent from hook-specialist is unrealized in the brief layer. **Strategist/orchestrator decision: was wordless deliberately deferred?** Not documented.

---

## 6. Producibility map (12 ads × ad set)

For each launch-matrix ad: brief reference → copy combo → tech overlay decision → renderable on disk?

| Ad name in media plan | Brief reference | Copy combo | Tech overlay decision | Producible? |
|---|---|---|---|---|
| AS-1 `Ad-A-POV50k-9x16_h1_pA_hlA` | brief-A-pov-50k.md (9:16 master) | Hook 1 + Primary A + Headline A | brief-A-tech-overlay: default stack, no premium | **YES — Ad11 master already shipped** at `Tonvo-Ad-HF/renders/Tonvo-Ad-HF_2026-05-03_*.mp4` |
| AS-1 `Ad-A-POV50k-1x1_h1_pA_hlA` | brief-A-pov-50k.md (1:1 reformat) | Hook 1 + Primary A + Headline A | brief-A-tech-overlay: default, music swap to tense-cinematic.mp3 | **NO — directory `Tonvo-Ad-HF-1x1/` does not exist** |
| AS-1 `Ad-D-StopPitch-9x16_h2_pA_hlC` | brief-D-stop-pitching.md (24s motion) | Hook 2 + Primary A + Headline C | brief-D-tech-overlay: default + new SVG waveform primitive | **NO — directory `Tonvo-Ad-HF-stop-pitching/` does not exist; new waveform SVG primitive not built** |
| AS-2 `Ad-B-27pc-9x16_h3_pB_hlB` | brief-B-27pc.md (9:16 reformat) | Hook 3 + Primary B + Headline B | brief-B-tech-overlay: default | **NO — directory `Tonvo-Ad-HF-27pc-9x16/` does not exist; ALSO Ad10 VO file naming bug (`ad10_*.mp3` does not exist; actual files are `ad8_*.mp3`)** |
| AS-2 `Ad-B-27pc-3x4_h3_pB_hlB` | brief-B-27pc.md (3:4 master) | Hook 3 + Primary B + Headline B | brief-B-tech-overlay: default (no work) | **YES — Ad10 master already shipped** at `Tonvo-Ad-HF-27pc/renders/Tonvo-Ad-HF-27pc_*.mp4`. **Caveat:** Hook 3 swap on S0 (per `brief-B-27pc.md:80`) requires HTML edit on the master — not visible in current renders, may require re-render. |
| AS-2 `Ad-C-Gap-9x16_h1_pA_hlC` | brief-C-the-gap.md (primary 9:16) | Hook 1 + Primary A + Headline C | brief-C-tech-overlay: default + 1 ElevenLabs S4 (Sarah testimonial) | **NO — directory `Tonvo-Ad-HF-gap/` does not exist; new S2 split-screen composition not built; ElevenLabs S4 clip not generated** |
| AS-3 `Ad-A-POV50k-1x1_h2_pB_hlB` | brief-A-pov-50k.md (1:1 Variant B "ghosted") | Hook 2 + Primary B + Headline B | brief-A-tech-overlay: default + 1 ElevenLabs Rachel S1 line | **NO — Variant B requires the 1:1 base (which doesn't exist) + the new ElevenLabs `ad11-v2_s1.mp3` (which doesn't exist on disk)** |
| AS-3 `Ad-B-27pc-9x16_h3_pB_hlB` | brief-B-27pc.md (9:16 reformat — same file as AS-2) | Hook 3 + Primary B + Headline B | brief-B-tech-overlay: default | **NO — same as AS-2 row above (cross-listed asset)** |
| AS-3 `Ad-D-StopPitch-Static-1x1_h3_pB_hlC` | brief-D-stop-pitching.md (Static A) | Hook 3 + Primary B + Headline C | brief-D-tech-overlay: Puppeteer render via `scripts/generate-carousels/` | **NO — `Tonvo-Ad-HF-stop-pitching-static/` template not built; no PNG output exists** |
| AS-4 `Ad-A-POV50k-9x16_h1_pA_hlA` | (same as AS-1 row 1, cross-listed) | Hook 1 + Primary A + Headline A | brief-A-tech-overlay default | **YES — same Ad11 master MP4 reused** |
| AS-4 `Ad-C-Gap-1x1_h1_pA_hlC` | brief-C-the-gap.md (1:1 reformat) | Hook 1 + Primary A + Headline C | brief-C-tech-overlay: default + 1 ElevenLabs (same as 9:16) | **NO — depends on 9:16 build first; 1:1 reformat not attempted** |
| AS-4 `Ad-B-27pc-9x16_h3_pB_hlB` | brief-B-27pc.md (9:16 reformat — same as AS-2/AS-3) | Hook 3 + Primary B + Headline B | brief-B-tech-overlay default | **NO — same as AS-2/AS-3 cross-listing** |

**Producibility tally: 2 ads producible (Ad11 master 9:16, Ad10 master 3:4) · 10 ads not yet built.** The Ad10 master 3:4 has a caveat (Hook 3 swap on S0 may require a re-render).

**Inventory ads (referenced in media-plan §4 inventory list at `media-plan.md:175-180`):**
- Brief B no-+27% fallback — **NOT BUILT** (directory absent)
- Brief D Static B (1:1) — **NOT BUILT**
- Brief D Static C (1:1) — **NOT BUILT** + tone-flag pending
- Brief D Static A (4:5) — **NOT BUILT**
- Brief E 9:16 + 1:1 — **NOT BUILT** (acceptable per reserve status)

**Bottom line: spec-ready, build-incomplete.** The media plan's "Build campaign + 4 ad sets + 12 ads in Ads Manager **but leave OFF**" (`media-plan.md:334`) D-1 instruction implicitly assumes the 12 MP4/PNG assets exist for upload. They do not. Production phase is required between brief approval and D-1.

---

## 7. Verdict per deliverable

| Deliverable | Status | Critical gaps |
|---|---|---|
| `00-brief.md` | **OK** | Tech-Director output location format `brief-NN-tech-overlay.md` was implemented with letters not numbers (cosmetic). Open questions are flagged non-blocking but elevated to "blockers" in media-plan — slight tonal drift acceptable. |
| `01-strategy/01-strategy.md` | **OK** | Anti-strategy "no founder-on-camera" (`:216`) is **violated** by `brief-E-tech-overlay.md:14, 22-42` recommendation to use Hedra for Emilien talking-head on E S1 — needs explicit strategist override or Hedra opt-out. v1.1 update note (`:136`) captures the Angle D rename — propagated to most downstream docs but with residual drift in `copy.md:110, 159` and `brief-D-stop-pitching.md:114`. |
| `02-research/swipe-file.md` | **OK** | Honest methodology disclosure (`:5-13`) — flags ads as `[real]`, `[case-study-derived]`, `[adjacent]`. No spec gaps. The recommended follow-up screenshots (line 14, line 146) are not blocking the rest of the chain. |
| `03-copy/copy.md` | **GAPS** | (1) **Headline C Angle A char count is wrong** — claims "(27)" actually 28 chars (`copy.md:25`). Will get truncated on Meta. (2) Headline A Angle D still "Stop winging it." (`:110`) — should be aligned to renamed angle. (3) Copywriter concern #4 (`:159`) explicitly asks strategist to rename Angle D — strategist did rename, but copy.md was never updated to remove the residual "Stop winging it" Headline A text. Inconsistency. |
| `03-copy/hooks-refined.md` | **OK** | Wordless-hook coverage (`:225`) is delivered (A4, B5, C3, D5, E5) but **none are picked up by the creative briefs as primary S0 hooks**. Either deliberate strategist deferral or unflagged drop. No spec failure but a missed opportunity. |
| `04-creative-briefs/brief-A-pov-50k.md` | **OK** | Asset paths assume `cd Tonvo-Ad-HF-1x1/` working directory implicit. Deliverables (1:1 + Variant B) not yet rendered. No spec gaps. |
| `04-creative-briefs/brief-B-27pc.md` | **GAP** | **VO file reference `assets/audio/ad10_*.mp3` is wrong** — actual files in Ad10 directory are `ad8_*.mp3`. Brief acknowledges "confirm filenames at producer-time" (`:46`) but doesn't pre-empt the wrong filename. **Producer will hit missing-file error.** |
| `04-creative-briefs/brief-C-the-gap.md` | **OK** | Spec-complete. Producer needs to build new S2 split-screen composition. |
| `04-creative-briefs/brief-D-stop-pitching.md` | **GAPS (minor)** | (1) Reference at `:114` to "Hook 1 ('Stop winging it')" doesn't match current copy.md Hook 1 (which is now "Stop pitching from memory."). Copywriter rename was incomplete here. (2) Static C tone-flag is documented but Emilien sign-off mechanism not in the D-1 sequence except in media-plan §11.4. |
| `04-creative-briefs/brief-E-silent-cofounder.md` | **OK** | Reserve status enforced. Spec is complete. The "industry pattern, not measured" footnote (`:21`) is a deliberate honesty hedge that survives downstream. |
| `04-creative-briefs/brief-A-tech-overlay.md` | **OK** | Single ElevenLabs Rachel call for Variant B S1. Voice ID stated, fallback documented. Reasonable. |
| `04-creative-briefs/brief-B-tech-overlay.md` | **OK with caveat** | Inherits Ad10 VO filename issue from brief-B (above). Otherwise sound. |
| `04-creative-briefs/brief-C-tech-overlay.md` | **OK** | One ElevenLabs Rachel call for S4 character payoff. Different voice settings than brief-A/B (`stability 0.40`, `style 0.50`) — deliberate per the role spec. Sound. |
| `04-creative-briefs/brief-D-tech-overlay.md` | **OK** | $0 premium tools, all default stack, including new SVG+GSAP waveform primitive. Cleanest brief in tech-overlay layer. |
| `04-creative-briefs/brief-E-tech-overlay.md` | **GAPS** | (1) **Strategy anti-strategy violation (Hedra founder-face) not flagged.** (2) Hedra API endpoint `https://api.hedra.com/v1/character-3/generate` is plausibly speculative — production-stack.md notes "Feb-26 GA" but doesn't pin endpoint. **UNVERIFIABLE from current docs.** (3) Pre-trigger checklist (`:243-249`) is solid but lives in the brief, not pulled up to media-plan launch sequence. |
| `06-media-plan/media-plan.md` | **OK with gaps** | (1) Doesn't explicitly flag that 10 of 12 launch ads are not yet rendered; D-1 sequence implicitly assumes assets exist. (2) Substantiation pack for +27% claim described but not actually produced. (3) Wordless-hook variants from hooks-refined are not loaded into any ad-load slot. Otherwise ABO architecture, naming, UTMs, kill rules, and budget arithmetic are clean. |
| `08-tooling/skills-inventory.md` | **OK** | Verified May 2026 against live GitHub READMEs per header. Accurate. |
| `08-tooling/production-stack.md` | **OK** | Pricing/feature notes May 2026. Consistent with tech-director.md role-spec preferences. The Hedra "Feb-26 GA" note is the only date-sensitive item that would benefit from a verification-at-producer-time check. |

---

## 8. Top 5 gaps to fix before launch

1. **Build the 10 missing ads.** The media plan ships 12 ads at launch but only Ad11 (9:16) and Ad10 (3:4) exist on disk. Required physical builds before D-1: `Tonvo-Ad-HF-1x1/` (Ad-A 1:1 master), `Tonvo-Ad-HF-1x1/` Variant B (Hook 2 ghosted), `Tonvo-Ad-HF-27pc-9x16/` (Ad-B 9:16), `Tonvo-Ad-HF-gap/` (Ad-C 9:16) + 1:1 + S2 static, `Tonvo-Ad-HF-stop-pitching/` (Ad-D motion 9:16) + statics 1:1 + 4:5. Plus the Brief B `Tonvo-Ad-HF-27pc-fallback/` for compliance plan B. **Estimated production time per Creative Director's notes: ~1 week solid producer work.** Do not launch on D0 with placeholder ads.

2. **Fix the Brief B Ad10 VO filename bug.** `brief-B-27pc.md:46` and `brief-B-tech-overlay.md:55` reference `assets/audio/ad10_*.mp3` — actual Ad10 directory `Tonvo-Ad-HF-27pc/assets/audio/` has `ad8_s1.mp3 … ad8_s4.mp3`. Either rename files to `ad10_*` for clarity OR update both briefs to reference `ad8_*`. **The producer will hit missing-file errors otherwise.**

3. **Resolve the founder-on-camera anti-strategy conflict.** `brief-E-tech-overlay.md:14, 22-42` recommends Hedra Character-3 + ElevenLabs Emilien voice clone for E S1, which directly contradicts strategy `01-strategy.md:216` "**No founder-on-camera ads in v1.**" Either: (a) strategist explicitly overrides for E only with documented rationale appended to strategy v1.2, OR (b) tech-overlay E is revised to drop Hedra and use chrome-text S1 only. Decision should not be left to producer.

4. **Fix Headline C Angle A char overrun (28 chars vs claimed 27).** `copy.md:25` Headline C "Catch the signal you missed." is 28 chars, not 27 as labeled. Will get truncated on Meta. Options: shorten to "Catch the signal missed." (24 chars) or drop Headline C entirely (not currently used as primary in any launch ad — only Headline A and B are used in Brief A's lead combos, so impact is contained, but the doc should be self-consistent).

5. **Patch Angle D rename residuals in copy.md and brief-D-stop-pitching.md.** `copy.md:110` Headline A still reads "Stop winging it." — either keep deliberately as a fallback Headline (and document as "legacy fallback after rename") or replace. `copy.md:159` notes still describe Hook 1 as "Stop winging your demos" before rename — historical record acceptable but adds reader friction. `brief-D-stop-pitching.md:114` references "Hook 1 ('Stop winging it')" which contradicts current copy.md Hook 1 ("Stop pitching from memory."). Quick find-and-replace pass would close all three drifts.

---

## Iron Law applied to this report

Every PASS/FAIL/GAP claim above has a `file.md:line` quote or a filesystem `ls` confirmation. The 2 UNVERIFIABLE items (Hedra API endpoint, ElevenLabs Rachel voice ID) are explicitly tagged. No claim was made on the strength of "should work" or "looks coherent."

Items NOT verified that the report assumes:
- The Ad11 master and Ad10 master MP4s (in `renders/`) play correctly and match their respective HTML specs — UNVERIFIABLE without rendering them. Files exist on disk; quality is taken on trust.
- The `1,247 closers` count is current — UNVERIFIABLE without product/data check.
- The `+27% close rate` claim has substantiation Tonvo can produce on demand — UNVERIFIABLE without internal docs.

These are the 3 trust-gates the orchestrator should validate with Emilien before launch.

_End verification report._

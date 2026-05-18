# Post-launch audit — Tonvo Meta Campaign 01

_Analyst: Claude Opus · Date: 2026-05-17 · Status: PRE-DATA audit (07-results/raw/ empty)_

## TL;DR (3 lines)

- **No Ads Manager data has landed yet** — `07-results/` was empty at audit time. Verdict below is **structural / hypothesis-only**, not a performance read. CSV template written to `07-results/expected-metrics-template.csv` for the first export.
- **Structural integrity is good:** 12 ads × 4 ad sets × 4 angles, clean naming, deliberate 60/25/15 ICP split + LAL control, kill rules pre-anchored to the $8–$15 CPS band.
- **Biggest unresolved risk before any V2 spend = Pixel/CAPI dedupe verification.** Without confirmed `event_id` match in Test Events, every CPS read downstream is wrong by an unknown multiple. Surface as Action #1.

## Variant matrix (8 briefs)

| Brief | Angle | Hook (lead) | Hypothesis | ICP |
|---|---|---|---|---|
| A — POV $50k | Loss-aversion / shame | "POV: you just lost a $50K deal." | Loss-framing > gain-framing for cold AE | ICP-1 primary, ICP-2 secondary |
| A tech-overlay | (reformat plan) | — | Edge TTS Aria continuity across reformats holds brand voice | ICP-1 |
| B — +27% | Social proof + quantified lift | "1,247 closers. +27% close rate. Same pitch." | Top-rep hunters click on edge-seeking proof, not pain | ICP-2 primary, ICP-1 fallback |
| B tech-overlay | (reformat + claim-safe fallback) | — | Pre-built no-+27% fallback prevents 24h dark window if Meta flags | ICP-2 |
| C — The Gap | Comparison / FOMO | "Your top rep isn't smarter." | Split-screen 23% vs 41% delivers gap-narrative without new primitives | ICP-2 |
| C tech-overlay | (S2 split-screen build) | — | CSS+GSAP is sufficient; no R3F needed | ICP-2 |
| D — Stop pitching | Contrarian / Pattern-6 | "Your playbook is a PDF nobody opens." | White-on-black single-line static breaks pattern in image-heavy feed | ICP-1, ICP-3 |
| D tech-overlay | (statics + 24s motion) | — | Audio-waveform SVG carries S2 without Rive | ICP-1, ICP-3 |

## Presumed winners (hypotheses, no data)

- **Brief A 9:16 in AS-1 (AE):** strongest visual peak ($50K chrome), loss-framing matches the documented persona pain. Highest a-priori CPS-clearing odds.
- **Brief D static in AS-3 (founder):** Pattern-6 contrarian one-liner is the cheapest distinctive asset in the feed and founders over-index on text-only contrarian posts. Likely best CTR-per-dollar of the 12.
- **Brief B 9:16 in AS-4 (LAL):** quantified social-proof typically out-performs in LAL audiences vs interest stacks.

## Presumed losers (hypotheses, no data)

- **Brief A 1:1 Variant B (Hook 2 "ghosted") in AS-3:** founder audience may not resonate with "ghosted" emotional register — that's an AE register, not a founder register. Risk of low hold rate.
- **Brief B 3:4 master in AS-2:** 3:4 in Reels-heavy placement mix is the worst aspect-fit. Likely throttled delivery.
- **Brief D Static 1:1 (Hook 3) in AS-3:** statics typically under-deliver vs video in Reels-dominant placement. Founders see this on IG Feed, not Reels — placement starvation risk.

## Recommended actions for V2 (max 5)

1. **VERIFY Pixel + CAPI dedup in Test Events BEFORE pulling any CPS number.** Run a live test signup on `tonvo.co/login` in incognito; confirm browser + server event with matching `event_id` lands within 30s. If broken, every kill/scale call is noise — fix infra first, then re-baseline.
2. **Hold the line on the 72h no-edit rule.** Campaign launched mid-week 2026-05-17; first analyst read is D+3 (2026-05-20). Do NOT kill on D+1 evidence even if a single ad shows zero conversions — that's <$30 of spend across an ad set, far below the 50-click evidence floor.
3. **Pre-stage the Brief B no-+27% fallback as a parallel ad object in Ads Manager, paused.** Hot-swap window for Meta claim-flag is 24h; if the fallback is built but not loaded, you lose half a day re-uploading. Loaded-paused = 5-minute flip.
4. **Pre-brief copywriter for Hook 2.x on Brief A (founder cross-test).** If 1:1 Variant B underperforms in AS-3, swap to a founder-register variant ("Lost your enterprise pilot? Same pattern.") — keep the chrome $50K, replace the AE-coded hook.
5. **Lock V2 CBO migration decision until D+7 read.** Per media-plan §2 — CBO collapses spend on noise at this budget. No CBO until 50+ conversions per cell.

## Open questions requiring real data

- **Is `CompleteRegistration` actually firing with dedup?** Until Test Events shows browser + server pairs with matching `event_id`, CPS is undefined.
- **What's the actual placement breakdown by spend?** Advantage+ placements blur this — V2 should pull a placement breakdown before deciding whether 1:1 Feed is worth the production cost.
- **Does the LAL control (AS-4) outperform interest stacks?** This is the v2 lean-LAL-vs-lean-interest decision. Need 7-day data + 50+ conversions in AS-4 to call it.
- **Activation rate signup → first session — is it >50%?** If signup volume is fine but activation is broken, product owns the gap, not media. Flag back to product immediately if observed.
- **Has the closing-sprint sibling campaign launched yet, or is that the V2 launch this audit is sizing?** Closing-sprint media-plan dated 2026-05-14 implies T+0 is imminent — clarify whether D+3 read covers v1 only or v1+closing.

---

_End audit. Next deliverable: data-driven `report-w01.md` at D+3 (2026-05-20) once Ads Manager export lands in `07-results/raw/`._

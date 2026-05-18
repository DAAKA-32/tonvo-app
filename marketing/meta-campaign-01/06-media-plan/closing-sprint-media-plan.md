# Closing-Sprint Media Plan — Tonvo Meta Ads Campaign 01

_Media Buyer: Claude Opus · Owner: Emilien · Date: 2026-05-14 · Sprint: closing-sprint (wave 3) · Status: pre-launch · Extends: `06-media-plan/media-plan.md` (v1 base plan) · Source-of-truth: `01-strategy/02-closing-sprint-brief.md`, `01-strategy/02-closing-sprint-angles.md`, `03-copy/closing-copy.md`, `04-creative-briefs/closing-sprint/_index.md`_

> **This document EXTENDS the v1 media plan, it does NOT replace it.** Campaign-01's existing 4 ad sets (`AS-1` AE / `AS-2` Top-Rep / `AS-3` Founder / `AS-4` LAL Control) continue to run on their existing creative. This sprint adds **a new sub-campaign sibling** at the campaign level, with its own ad sets, ads, and budget. The base plan remains the source-of-truth for v1 defaults; this plan only overrides where called out.

---

## TL;DR

- **New sibling campaign** `TVO_v01_US_SIGNUP_CLOSING` running alongside the existing `TVO_v01_US_SIGNUP`. ABO, Sales objective, optimizing on `CompleteRegistration` Pixel + CAPI deduped event.
- **4 SHIP ads** (Count to 7 / Line That Closes / Signal You Missed / You Never Asked) × **2 placements** (9:16 master + 1:1 reformat) × **2 languages** (EN + FR) = **16 creative slots in Meta** distributed across 4 ad sets.
- **Staged launch:** EN at T+0 (2 ad sets, 8 ads), FR held until T+7d on the same structure (text-swapped, same 4 ads).
- **Daily budget: $90–$140/day incremental** on top of the existing v1 base. Anchored to the v1 KPI band ($8–$15 CPS target, $22–$28 CPM, 1.2–1.8% CTR). Split 70% ICP-1 / 30% ICP-2 per the master brief.
- **CTA locked:** `Try Free → tonvo.co`. No "Book a demo." No "Talk to sales." Anywhere.
- **Pixel + CAPI:** existing implementation at `src/app/api/meta-capi/route.ts` already ships `CompleteRegistration` in the allow-list (verified line 37). No code changes proposed.

---

## 1. Campaign-level decision

### Decision: NEW sibling campaign, not new ad sets inside `TVO_v01_US_SIGNUP`.

**Defense (3 sentences):** Adding 2 new ICP-targeted ad sets to the running v1 campaign would risk dragging the existing 4 ad sets back into learning phase (Meta resets learning when campaign structure changes meaningfully — adding budget-significant ad sets is one of the documented triggers). The closing sprint has its own 4-angle creative thesis, its own ICP weighting (70/30 vs v1's 60/25/15), and its own kill-rule timeline (T+72h, T+7d) — bundling those reads into the same campaign clouds the v1 read. A sibling campaign at the same objective + pixel event keeps attribution clean, lets us pace v1 and the closing sprint independently, and means a sprint-level pause does not touch v1 spend.

### CBO vs ABO

**Decision: ABO.** Same rationale as v1 §2 — we are testing which closing register (ICP-1 shame vs ICP-2 pride) wins at the signup event, and CBO would collapse spend onto whichever cell Meta finds cheapest in the first 24h on noisy evidence. ABO honors the deliberate 70/30 ICP split from the master brief.

### Optimization event + Pixel/CAPI status

- **Optimization event:** `CompleteRegistration` (Meta Standard Event). The `Signup` custom event continues firing for legacy reporting compat per v1 §1.
- **Pixel + CAPI dedupe:** the existing implementation at `src/app/api/meta-capi/route.ts` is hardened (rate-limited per `RATE_LIMIT_*`, event allow-list at line 37 explicitly includes `CompleteRegistration`, domain allow-list, SHA-256 user-data hashing). **No code changes proposed.** The launch-blocker verification (§7) confirms the event fires with matching `event_id` on browser + server before any ad goes live.

### Attribution window

**7-day click, 1-day view.** Meta default for the Sales objective. Same as v1.

---

## 2. Ad set structure

Sprint adds **4 ad sets total**: 2 EN at T+0, 2 FR staged at T+7d. ICP-3 / ICP-4 are NOT prospected this sprint (per closing-sprint brief §Target ICP).

| Ad set name | ICP | Geo | Lang | Age | Gender | Interests (3 tiers) | Placement | Daily $ | Opt event | Bid | Ads loaded |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `01_US_SIGNUP_CLOSING_QuotaSlippingAE_EN_Shame-AB` | ICP-1 | US | EN | 25–45 | All | **Broad:** `Sales`, `Salesforce.com`, `Microsoft Teams`, `Zoom (software)`. **Sales-tools:** `Gong (company)`, `Chorus.ai`, `Outreach (software)`, `Salesloft`, `HubSpot CRM`. **Job-title proxy:** `Account Executive`, `Senior Account Executive`, `Sales Development Representative`, `Business Development Representative`, `Inside Sales Representative`. Excludes VP/CRO/Head/Director/Manager titles. | Adv+ Placements, **EXCLUDE Audience Network, Right Column, Reels Overlay Ads, Search Results**. Manual allow: FB Feed, FB Reels, IG Feed, IG Reels, IG Stories, FB Stories, IG Explore. | **$45–$70** | `CompleteRegistration` | Highest volume | Ad-1 + Ad-4 (EN, both placements) |
| `02_US_SIGNUP_CLOSING_TopRepHunter_EN_Pride-AB` | ICP-2 | US | EN | 25–45 | All | **Broad:** `Sales`, `Professional development`. **Sales-tools:** `Salesloft`, `Outreach (software)`, `Sales enablement`, `Pavilion (community)`, `Sales coaching`. **Job-title / influencer proxy:** `Account Executive`, `Senior Account Executive`, `Enterprise Account Executive`, `Sales Executive`, `Sandler Training`, `Chris Voss`, `Sam Jacobs`, `HubSpot Academy`. Excludes VP/CRO/Head/Director/Manager titles. | Same as AS-01 above. | **$20–$30** | `CompleteRegistration` | Highest volume | Ad-2 + Ad-3 (EN, both placements) |
| `03_FR_SIGNUP_CLOSING_QuotaSlippingAE_FR_Shame-AB` ⏸ T+7d | ICP-1 | FR | FR | 25–45 | All | Same interest stack, FR equivalents where available (`Salesforce`, `Microsoft Teams`, `Zoom`, `HubSpot`, `Outreach`, `Salesloft`, `Account Executive`, `Commercial`, `Business Developer`, `Ingénieur d'affaires`). Excludes Directeur Commercial / DRH / VP. | Same placement filter. | **$15–$25** (smaller TAM in FR) | `CompleteRegistration` | Highest volume | Ad-1 + Ad-4 (FR, both placements) |
| `04_FR_SIGNUP_CLOSING_TopRepHunter_FR_Pride-AB` ⏸ T+7d | ICP-2 | FR | FR | 25–45 | All | FR equivalents of the ICP-2 stack. Same exclusion logic. | Same placement filter. | **$10–$15** | `CompleteRegistration` | Highest volume | Ad-2 + Ad-3 (FR, both placements) |

**Detailed targeting expansion: OFF** for all 4 (clean per-audience reads).
**Campaign-wide exclusions (inherited from v1 §3):** Tonvo CRM upload (existing free + paid users) + 30-day `/login` visitors. Plus the v1 ad sets themselves are NOT excluded — by design the sprint can re-touch v1-targeted users with new closing-specific creative.
**Schedule:** continuous, all days/all hours.
**Attribution:** 7-day click, 1-day view.

Total ad-set count at full ramp: **4** (2 EN active T+0, 2 FR active T+7d).

---

## 3. Staged launch plan

| Phase | When | Action | Live ad sets | Live creatives | Daily spend |
|---|---|---|---|---|---|
| **T+0** | Launch day | Activate `01_…AE_EN_Shame-AB` and `02_…TopRepHunter_EN_Pride-AB`. Both EN ad sets, 4 creatives each (2 ads × 2 placements). | 2 EN | 8 (4 ads × 2 placements, EN only) | $65–$100/day |
| **T+72h** | Day 3 | **Analyst first signal read.** Apply ad-level kill rule (§7). NO ad-set kills yet — learning phase. NO budget changes >25%. NO bid strategy changes. | 2 EN | 8 (minus any killed ad) | unchanged |
| **T+7d** | Day 7 | **Full EN read.** If a clear winner exists in EN ad-set + creative combo, activate `03_…AE_FR_Shame-AB` and `04_…TopRepHunter_FR_Pride-AB` with the same 4 ads (FR text-swapped). FR ad sets enter their own learning phase. | 4 (2 EN + 2 FR) | 16 (4 ads × 2 placements × 2 languages) | $90–$140/day |
| **T+14d** | Day 14 | **Iteration cycle.** Scale rule on winners (+20%/day if CPS < 0.7× target for 3 consecutive days). Kill rule on losers (CPS > 3× target after 50 link-clicks AND 0 signups). FR reads its own data, independent of EN. | 4 (winners scaled, losers cut) | varies | scaling |

### Why we explicitly DO NOT launch FR at T+0

The creative is ready (copywriter delivered FR scripts in `closing-copy.md`, `creative-director` produces FR text-swap composition). It would feel efficient to ship both at once. We don't, for two reasons:

1. **Cleaner learning-phase signal for EN.** Meta's algo learns the `CompleteRegistration` event population per ad set. Splitting cold conversion volume across 4 ad sets at launch (instead of 2) halves the per-ad-set evidence in the first 72h, which delays the first reliable read by ~3 days.
2. **FR audience is smaller and would dilute the test.** Estimated FR TAM for ICP-1 sales-tools is ~10–15% the size of the US TAM. Running it in parallel at proportional budget would mean the FR ad sets spend through their audience faster and frequency climbs before we have a creative-winner signal. Better to validate the creative in EN first, then deploy the proven winner into FR.

This is a deliberate trade — we leave ~$25–40/day of FR spend on the table for the first 7 days to keep the EN read clean.

---

## 4. Naming convention (extends v1)

Extends the v1 convention `TON-01_<angle>_<icp>_<placement>_<aspect>` for ad-level names, and the campaign/ad-set hierarchy from base media plan §5. Sort-friendly in Ads Manager because campaign / ad-set / ad all begin with a numeric prefix and the angle slug is short.

```
Campaign:    TVO_v01_US_SIGNUP_CLOSING

Ad Sets:     01_US_SIGNUP_CLOSING_QuotaSlippingAE_EN_Shame-AB
             02_US_SIGNUP_CLOSING_TopRepHunter_EN_Pride-AB
             03_FR_SIGNUP_CLOSING_QuotaSlippingAE_FR_Shame-AB
             04_FR_SIGNUP_CLOSING_TopRepHunter_FR_Pride-AB
```

### Ad-level names (all 16 slots)

Decoder: `TON-01_<angle-slug>_<icp>_<placement>_<aspect>_<lang>`. Angle slugs: `count7` / `linecloses` / `signalmissed` / `neverasked`.

| # | Ad set | Ad name |
|---|---|---|
| 1 | AS-01 EN ICP-1 | `TON-01_count7_icp1_reels_9x16_en` |
| 2 | AS-01 EN ICP-1 | `TON-01_count7_icp1_feed_1x1_en` |
| 3 | AS-01 EN ICP-1 | `TON-01_neverasked_icp1_reels_9x16_en` |
| 4 | AS-01 EN ICP-1 | `TON-01_neverasked_icp1_feed_1x1_en` |
| 5 | AS-02 EN ICP-2 | `TON-01_signalmissed_icp2_reels_9x16_en` |
| 6 | AS-02 EN ICP-2 | `TON-01_signalmissed_icp2_feed_1x1_en` |
| 7 | AS-02 EN ICP-2 | `TON-01_linecloses_icp2_reels_9x16_en` |
| 8 | AS-02 EN ICP-2 | `TON-01_linecloses_icp2_feed_1x1_en` |
| 9 | AS-03 FR ICP-1 | `TON-01_count7_icp1_reels_9x16_fr` |
| 10 | AS-03 FR ICP-1 | `TON-01_count7_icp1_feed_1x1_fr` |
| 11 | AS-03 FR ICP-1 | `TON-01_neverasked_icp1_reels_9x16_fr` |
| 12 | AS-03 FR ICP-1 | `TON-01_neverasked_icp1_feed_1x1_fr` |
| 13 | AS-04 FR ICP-2 | `TON-01_signalmissed_icp2_reels_9x16_fr` |
| 14 | AS-04 FR ICP-2 | `TON-01_signalmissed_icp2_feed_1x1_fr` |
| 15 | AS-04 FR ICP-2 | `TON-01_linecloses_icp2_reels_9x16_fr` |
| 16 | AS-04 FR ICP-2 | `TON-01_linecloses_icp2_feed_1x1_fr` |

---

## 5. UTM parameters

URL parameter set at the **ad level — Website URL field**:

```
https://tonvo.co/login?utm_source=facebook&utm_medium=cpc&utm_campaign=ton-closing-01&utm_content={{ad.name}}&utm_term={{adset.name}}
```

- `utm_source=facebook` — explicitly differentiates this sprint from v1's `utm_source=meta`, lets the analyst pivot closing-sprint signups cleanly from v1 signups even when both campaigns are live.
- `utm_medium=cpc` — matches the brief.
- `utm_campaign=ton-closing-01` — sprint scoped.
- `{{ad.name}}` and `{{adset.name}}` — Meta dynamic-URL substitution at delivery time. Verified at preview-link load in incognito on D-1.
- The landing target is `tonvo.co/login` **directly** — not a Linktree, not an `fbclid`-only redirect, not a marketing subdomain. Meta injects `fbclid` automatically alongside the UTM params; that's required for the CAPI `event_id` browser-server dedupe per the existing implementation.

**Pixel `CompleteRegistration` dedupe:** browser Pixel and server CAPI must fire with matching `event_id` on the same signup. Verified per §7 launch-blocker checklist. Existing `src/app/api/meta-capi/route.ts` handles the server side; client-side Pixel install must mirror the same `event_id`.

---

## 6. Budget proposal

### Anchor math (from v1 strategy §5 KPI targets)

- Target **CPM**: $22–$28 (US B2B mid-band)
- Target **CTR (link)**: 1.2–1.8%
- Implied **CPC**: $1.80–$2.50
- Target **Landing → Signup**: 28–35%
- Target **CPS**: $8–$15
- Per-ad-set learning-phase exit requires **~50 conversions** = ~$400–$750 spend per ad set
- At 7-day window, that's **~$57–$107/day per ad set** to exit learning cleanly inside the staged-launch read window

### Total incremental daily budget for closing sprint

| Posture | T+0 (EN only, 2 ad sets) | T+7d (EN + FR, 4 ad sets) | Monthly equiv (steady-state) |
|---|---|---|---|
| **Floor** | $65/day | $90/day | ~$2,700/month |
| **Mid (recommended)** | $90/day | $130/day | ~$3,900/month |
| **Stretch** | $100/day | $140/day | ~$4,200/month |

> **Recommendation: Mid posture — $90/day at T+0 (EN-only), scaling to $130/day at T+7d when FR activates.** This is **incremental** to the existing v1 spend (`media-plan.md` §9 recommended Mid posture is $152/day for v1). Combined daily steady-state at T+7d: ~$280/day across v1 + closing sprint.

> **The sprint budget is ADDITIVE, not cannibalizing v1.** The existing 4 v1 ad sets continue running on their existing budget. The closing sprint is funded as a separate line item.

### Within-ICP split (per master brief 70/30)

| Cell | T+0 EN daily | T+7d total daily | Lead-with allocation |
|---|---|---|---|
| ICP-1 (70%) | $65 (AS-01 EN) | $90 ($65 EN + $25 FR) | Week 1: 50/50 across Ad-1 (Count to 7) and Ad-4 (You Never Asked). Week 2: weight toward winner. |
| ICP-2 (30%) | $25 (AS-02 EN) | $40 ($25 EN + $15 FR) | Week 1: 50/50 across Ad-3 (Signal You Missed) and Ad-2 (Line That Closes). Week 2: weight toward winner. |

### Emergency reserve

**10% of total sprint budget reserved for emergency creative refresh** if a winner is found early. At Mid posture, that's ~$9/day at T+0 and ~$13/day at T+7d. Held as un-allocated headroom — if an EN ad clears 0.7× target CPS for 3 days, the reserve funds a same-week 1:1 / 9:16 alternate-hook re-cut without dipping into v1.

---

## 7. Tracking checklist — LAUNCH BLOCKERS (binary, non-overridable by agent)

These inherit from the v1 media plan §7. **No closing-sprint ad goes live until all 5 boxes are verified.** This is a hard gate, not aspirational. Founder authorization of budget does not override unverified launch blockers.

- [ ] **Meta Pixel installed on `tonvo.co`** — verified by Events Manager → Test Events showing browser fire on `/login`.
- [ ] **`CompleteRegistration` event firing post-signup** — verified by Test Events showing event with `event_id`, deduplicated against CAPI.
- [ ] **CAPI configured** — verified by Test Events showing server event with matching `event_id` within 30s of browser event. _Implementation status:_ existing `src/app/api/meta-capi/route.ts` ships with `CompleteRegistration` in the event allow-list (line 37), rate-limiting, domain allow-list, SHA-256 user-data hashing. Verification confirms the event reaches Meta, not just that code is deployed.
- [ ] **Domain `tonvo.co` verified in Meta Business Manager** — verified by Brand Safety → Domains showing `tonvo.co` as verified.
- [ ] **AEM priority set** — verified by Events Manager → Aggregated Event Measurement panel showing priority 1 = `CompleteRegistration`, 2 = `Subscribe`, 3 = `PageView`.

**"Code shipped" ≠ "deployed" ≠ "firing" ≠ "attributing correctly".** The existing CAPI route file existing in the repo only proves "code shipped." Launch authorization requires all 5 boxes above at the highest verification level (Test Events panel green for both browser AND server event with matching `event_id`).

### 7.5 Kill-rule preconditions

Kill rules in §8 reference CPS — but CPS is undefined if the `CompleteRegistration` event isn't firing and attributing correctly. **Kill rules require verified attribution.** Without all 5 launch blockers green, the kill rules are unenforceable and the launch is structurally impossible regardless of creative readiness or budget authorization.

---

## 8. Kill rules — first 72h reads (anchored to $8–$15 CPS band)

Apply per the brief, anchored to v1 §5 KPI band (CPS target $8–$15, midpoint $11.50). **No edits in the first 72h on bid strategy or budget >25%.** Premature edits reset learning. Specific kill rules per the brief:

| Trigger | Threshold | Action |
|---|---|---|
| **Per ad: hold-rate (3s)** | < 35% | Recut hook OR kill. Standby: copywriter `closing-copy.md` per-ad kill rules already define fallback hook IDs (e.g., Ad-1 swap to hook `#4.5`, Ad-3 swap to hook `#3.2`). |
| **Per ad: CTR (link)** | < 0.6% | Kill the ad. Hold-rate may be fine but the post-hook is not earning the click. |
| **Per ad: CPS** | > $25 (≈2× target ceiling) AND ≥ 50 link-clicks AND 0 signups | Kill the ad. Pause, do not delete. Audit Pixel for that creative path. |
| **Per ad set: spend with 0 signups** | > $100 spend with 0 signups | **Pause and audit Pixel** before re-enabling. If audit confirms event firing, the audience-creative match is wrong — reseat the same ad in the other ICP's ad set per copywriter's cross-test plan. |
| **Per ad set: CPS** | > $45 (≈3× target ceiling) after 50 link-clicks AND 0 signups | Kill ad set. Pause, do not delete. Reallocate budget across surviving ad sets at the original 70/30 ratio (re-normalized). |
| **Scale rule** | CPS < $10.50 (0.7× target midpoint) for 3 consecutive days | +20%/day until either CPS rises above target or weekly spend hits 3× original budget. |

### Per-ad standbys (cross-referenced from `03-copy/closing-copy.md` §First-72h kill rules)

- **Ad-1 Count to 7:** if hold <30% at 3s, swap to hook `#4.5` ("Count to 7. Don't blink.") on same body. If CTR <0.8% with hold >40%, recut last 3s with friction-killer triad.
- **Ad-2 Line That Closes:** if hold <35% at 5s, recut to single-objection sustained-5s cut. If CTR <1.0% with hold >50%, tighten iPhone 17 mockup zoom + slow glass-card surface.
- **Ad-3 Signal You Missed:** if hold <32% at 3s, swap to hook `#3.2` ("70% of reps miss this line."). If CTR <0.9% with hold >45%, replace abstract 9-vs-1 tile split with literal Zoom-thumbnail grid.
- **Ad-4 You Never Asked:** if hold <40% at 5s, swap to hook `#1.3` ("Great demo. You forgot to close."). If CTR <1.1% with hold >50%, lengthen the `MIN 32 · ASKED · CLOSED · $61K` reveal from 3s to 4s.

---

## 9. Reporting cadence

| Cadence | Owner | Deliverable |
|---|---|---|
| **Daily** | analyst | Spend, link clicks, CTR, hold-rate (Ads Manager CSV export, 7-day rolling). Light-touch — no decisions. |
| **T+72h** | analyst | First signal read. Apply per-ad kill rules from §8. Document any kills in `07-results/closing-sprint-day3.md`. |
| **T+7d** | analyst | Full EN read. Identify creative winner per ICP. Trigger FR launch (AS-03 + AS-04) if EN read is clean. Document in `07-results/closing-sprint-week1.md`. |
| **T+14d** | analyst | Iteration cycle. Scale winners, cut losers, FR reads its own data. Document in `07-results/closing-sprint-week2.md`. |

---

## 10. Risk register — creative-policy fallback paths

The creative-director index (`04-creative-briefs/closing-sprint/_index.md` §Policy-review checklist) flags 4 risk gates. If Meta's auto-review rejects any of these on policy, the rollback path is below. Copywriter has pre-prepped vague-fallback lines in `closing-copy.md` (alt headline lines, fallback hook IDs).

| Risk gate | Ad | Creative element | Rollback if rejected |
|---|---|---|---|
| **`41%` claim** | Ad-2 Line That Closes | Chrome hero `41% OF DEMOS DIE HERE` at 00:06–00:11 | Swap to vague-fallback chrome `KILL MOST OF YOUR DEMOS` (pre-rendered per brief 02 policy-review checklist). Voiceover line "Three objections kill 41% of demos" re-records to "Three objections kill most demos." `$34K` glass card stays as-is. |
| **`70%` claim** | Ad-3 Signal You Missed | Chrome stat hero `70% OF REPS MISS THESE 4 WORDS` at 00:10–00:14 | Swap to vague-fallback chrome `MOST REPS MISS THESE 4 WORDS` (pre-rendered per brief 03 policy-review checklist). Voiceover line "70% of reps don't" re-records to "Most reps don't." `$52K` glass card stays as-is. |
| **`$-amounts`** (any) | All 4 ads carry `$XXK` close-amount cards | Glass cards: `$48K` (Ad-1), `$34K` (Ad-2), `$52K` (Ad-3), `$61K` (Ad-4) | Fallback per brief: replace specific dollar amount with `CLOSED` (no amount) on the same glass-card primitive. Pre-rendered per brief policy-review checklist. Lower scroll-stop but compliant. |
| **`CALL AUTOPSY` framing** | Ad-4 You Never Asked | The `47 minutes / 8,412 words / 0 asks` frame labeled `CALL AUTOPSY` 00:00–00:22, plus the verbatim VO disclaimer line `"This isn't a Tonvo measurement. This is the autopsy…"` | If Meta flags the in-ad numbers despite the autopsy label, swap to alt headline `47 min. 0 asks.` (already in copywriter's deliverable). The VO disclaimer line is load-bearing for compliance — DO NOT cut it under any optimization pressure. If Meta still rejects, pull Ad-4 entirely and re-test in week 3 with reduced numbers (`30 min. 0 asks.`). |

**Synthesized-voice disclosure:** all 4 ads carry `[dramatization — synthesized buyer/rep line, not a real call clip]` in asset filenames and commit messages per `closing-copy.md` Resolution-1. This is the substantiation defense if Meta requests evidence on appeal.

---

## 11. Import plan

**Build in UI manually.** Same reasoning as v1 §11 — custom audience exclusions don't import cleanly, dynamic UTM substitution doesn't validate in bulk-import preview, and only 16 ads at most (8 at T+0) doesn't justify the CSV error surface.

Estimated build time:
- T+0 (2 EN ad sets, 8 creatives): **30–40 min** in UI.
- T+7d (add 2 FR ad sets, 8 creatives): **20–30 min** additional in UI.

Block 60 min on D-1 and 30 min on T+7d for the build pass.

---

## 12. Open questions for Emilien (3 max, real blockers only)

1. **FR launch — confirm or defer?** Plan stages FR at T+7d behind a clean EN read. If you want FR shipped at T+0 anyway (e.g., for an FR partner relationship reason or a personal-network test), say so before D-1 and we'll re-pace budgets — but flag that the EN read becomes ~3 days slower as a tradeoff.
2. **Pixel + CAPI Test Events verification.** Existing `src/app/api/meta-capi/route.ts` is implemented and `CompleteRegistration` is in the event allow-list, but launch authorization requires confirming the **end-to-end fire**: a real test signup on `tonvo.co/login` showing both browser Pixel event AND CAPI server event in Events Manager → Test Events with matching `event_id`. Has this been verified within the last 7 days, or do we need to run a test signup before D-day?
3. **AEM priority 1 slot.** Existing v1 plan sets AEM priority 1 = `Signup` (custom). The closing sprint optimizes on `CompleteRegistration` (Standard). For Meta's iOS attribution to count both events cleanly, AEM priority 1 should be `CompleteRegistration` (the optimization target Meta wants to rank highest). Confirm: is AEM panel currently set this way, or do we re-rank before launch?

---

_End closing-sprint media plan. Sibling campaign to `TVO_v01_US_SIGNUP`. Next iteration: appended after the T+7d analyst read in `07-results/closing-sprint-week1.md`._

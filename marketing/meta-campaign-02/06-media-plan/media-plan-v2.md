# Media Plan — Tonvo Meta Ads Campaign 02 (V2)

_Media Buyer: Claude Opus · Owner: Emilien · Date: 2026-05-17 · Status: V2 pre-launch · Geo: US (primary) · Language: US English · Predecessor: `meta-campaign-01/06-media-plan/media-plan.md` + `closing-sprint-media-plan.md`_

> **Read order:** `00-brief.md` → V1 audit (`meta-campaign-01/07-results/post-launch-audit-2026-05-17.md`) → V1 base plan → V1 closing-sprint plan → this doc.
> **What this is:** the V2 Meta Ads Manager build sheet for the 4 hero variants (V2-01, V2-02, V2-03, V2-04). Second-wave (V2-05 through V2-08) is queued in §4 but not loaded at launch.

---

## TL;DR

- **One V2 campaign**, ABO, Sales objective, optimizing on `CompleteRegistration` (Pixel + CAPI deduped). Closing-sprint sibling is **archived, not merged** — see §2.
- **6 ad sets** at launch (3 audiences × 2 angle-buckets) carrying the 4 hero variants. Tight matrix, not 9-cell sprawl.
- **4 hero ads** ship at launch: V2-01 (Angle F, 9:16, 18s, H1), V2-02 (Angle F, 9:16, 12s, H2), V2-03 (Angle G, 9:16, 22s, H3), V2-04 (Angle G, 1:1, 15s, H4). Second-wave V2-05/06 (Angle H) **gated** on testimonial verification; V2-07/08 queued for D+7 trigger.
- **Daily budget: $130–$180/day** at launch (Week 1), incremental to V1's mid posture if V1 ad sets stay live. Default recommendation: **archive V1 + closing-sprint, run V2 solo at $150/day total** for clean attribution.
- **5 launch blockers** must close before D-day (Pixel + CAPI dedup test events, domain verification, AEM priority, UTM hydration, landing-redesign Signup event sanity check). V1 audit explicitly called out CAPI dedup as still-unverified — this is the single hardest gate.
- **Primary KPI: CPS ($7–$13 target).** Secondary: hook rate 3s, hold rate 15s, payback < 14d. The payback gate is non-optimizable but kills any ad set hitting target CPS with 21+ day payback for 14 consecutive days (per brief §9 Risk 3).

---

## 1. Naming convention

### Format strings (locked, all-caps separators, lowercase tokens)

```
Campaign : TVO_v02_<MARKET>_<OBJ>_<YYYYMM>
Ad Set   : <NN>_<MARKET>_<OBJ>_<AUDIENCE-SLUG>_<ANGLE-BUCKET>_<PLACEMENT-SLUG>
Ad       : Ad-<VARIANT-ID>_<ANGLE>_<HOOK>_<ASPECT>_<DURATION>s_<LANG>
```

Where:
- `<MARKET>` = `US` (V2 launches US-only; FR archived from closing-sprint)
- `<OBJ>` = `SIGNUP` (Meta optimization event is `CompleteRegistration`; SIGNUP is the campaign-name shorthand)
- `<YYYYMM>` = `202605` (launch month — anchors the campaign generation, prevents collision with v1)
- `<AUDIENCE-SLUG>` = `AE-Interest` / `AE-LAL` / `TopRep-Interest` / `Founder-Interest` / `BroadAdv` (Advantage+ broad)
- `<ANGLE-BUCKET>` = `F-NoNotes` / `G-LiveSignal` / `H-Testimonials` / `MIX-FG`
- `<PLACEMENT-SLUG>` = `Reels` / `Feed` / `AdvPlus` (Advantage+ Placements)
- `<VARIANT-ID>` = `V2-01` through `V2-08`
- `<ANGLE>` = `F` / `G` / `H` (single letter)
- `<HOOK>` = `H1` … `H7` per brief §4
- `<ASPECT>` = `9x16` / `1x1` / `4x5`
- `<DURATION>` = ad runtime in seconds
- `<LANG>` = `en` (FR off for V2)

### 8 concrete examples — campaign / ad sets / 4 hero ads

```
Campaign:
  TVO_v02_US_SIGNUP_202605

Ad Sets (6):
  01_US_SIGNUP_AE-Interest_F-NoNotes_AdvPlus
  02_US_SIGNUP_AE-Interest_G-LiveSignal_AdvPlus
  03_US_SIGNUP_TopRep-Interest_G-LiveSignal_AdvPlus
  04_US_SIGNUP_Founder-Interest_F-NoNotes_AdvPlus
  05_US_SIGNUP_AE-LAL_MIX-FG_AdvPlus
  06_US_SIGNUP_BroadAdv_MIX-FG_AdvPlus

Hero Ads (4 — duplicated as separate ad objects per ad set):
  Ad-V2-01_F_H1_9x16_18s_en        ("Your hands typed")    → AS-01, AS-04, AS-05, AS-06
  Ad-V2-02_F_H2_9x16_12s_en        ("Stop typing")         → AS-01, AS-04
  Ad-V2-03_G_H3_9x16_22s_en        ("Three signals")       → AS-02, AS-03, AS-05, AS-06
  Ad-V2-04_G_H4_1x1_15s_en         ("POV Tonvo")           → AS-02, AS-03
```

---

## 2. Campaign structure

### Decision: ONE campaign, V1 + closing-sprint ARCHIVED at V2 D0

Three options were on the table:

| Option | Pro | Con | Verdict |
|---|---|---|---|
| **A. Fold V2 into running V1 campaign** | Reuses V1 learning | Adding 6 ad sets resets V1 learning per Meta's documented triggers (closing-sprint plan §1 already established this) | **Reject** |
| **B. V2 + V1 + closing-sprint all live in parallel** | Maximum coverage | 3 campaigns × overlapping audiences = budget cannibalisation, CRM exclusion drift, attribution noise; V1 audit flags zero V1 data exists yet anyway | **Reject** |
| **C. Archive V1 + closing-sprint, launch V2 solo** | Clean attribution, full daily budget on V2 hypothesis, the V1 audit (`07-results/post-launch-audit-2026-05-17.md`) confirms no V1 data is even on the books — there's no "running V1 winner" to protect | Loses any V1/closing-sprint accumulated signal | **Recommended** |

**Recommendation:** Option C. Pause V1 + closing-sprint at V2 D0. Per V1 audit §TL;DR: "No Ads Manager data has landed yet — `07-results/` was empty at audit time." There is no signal to preserve. Running 3 overlapping campaigns at $30–50/day each is the literal Risk 1 anti-pattern called out in V2 brief §9 ("We ran 9 angles but never let one breathe").

**If Emilien wants V1 to stay live anyway** (founder override): keep V1 paused-able. Document override in `09-verification/founder-overrides.md` per Hard Rule 6.

### CBO vs ABO

**Decision: ABO** (same logic as V1 §2 and closing-sprint §1).

- V2 is a **learn-which-audience-and-angle-works** test, not a scale test.
- CBO at $130–180/day total across 6 cells = Meta collapses spend on ~30-conversion noise inside 24h and we get a "winner" that is a fluke.
- ABO honors the deliberate 3-audience × 2-angle-bucket matrix. CBO migration is a D+14 decision (when winners have 50+ conversions of evidence each), not a launch decision.

### How many campaigns

**One.** Closing-sprint's two-campaign structure made sense when V1 was the running production and closing-sprint was an additive sibling. V2 is a clean cut — single campaign, single objective, one optimization event.

### Meta objective: Sales (optimization on `CompleteRegistration`)

| Option | Verdict |
|---|---|
| **Sales** (Conversions on `CompleteRegistration`) | **Selected.** Standard event, optimizes well, deduped via CAPI per existing `src/app/api/meta-capi/route.ts`, AEM-rankable. |
| **Leads** | Reject. Since Meta's 2025 ODAX consolidation, Leads has been ranking lower for B2B SaaS PLG flows (per V1 §1). Lead-form lifts no longer apply for our flow — signup happens on tonvo.co, not in a Meta Lead Form. |
| **Engagement** | Reject. Top-of-funnel vanity. We have a measurable signup event; we optimize on it. |
| **Traffic** | Reject. Optimizes for clicks, not conversions. Burns budget on bounce traffic. |

**Optimization event:** `CompleteRegistration` (Meta Standard Event, fires on `tonvo.co/login` post-account-creation). The `Signup` custom event continues firing for legacy reporting compat per V1 §1.

### Test phase vs scale phase budget

- **Test phase (D0 → D+7):** $130–$180/day total. Equal-ish ABO split, no scaling moves. 72h no-edit rule held.
- **Scale phase (D+7 onward):** scale winners +20%/day per kill rules §6 (subject to: ad set has 50+ conversions AND CPS < 0.7× target for 3 consecutive days AND payback signal is healthy). Kill or pause losers per same rules.
- **No bid strategy changes inside the first 50 conversions per ad set** (Hard Rule §3, base plan §1: stays Highest Volume until that floor, then evaluate Cost Cap).

---

## 3. Ad sets (cellules de test)

Six ad sets. Matrix is **3 audiences × 2 angle buckets** with one broad/control sweep. We are deliberately NOT doing 4 angles × 3 audiences × 3 placements = 36 cells — that's the Risk 1 anti-pattern. Six cells is the readable floor.

### Shared defaults (all 6 ad sets — call out only deltas in tables below)

| Default | Value |
|---|---|
| **Geo** | United States only |
| **Language** | English (All) |
| **Age** | 25–45 |
| **Gender** | All |
| **Detailed targeting expansion** | **OFF** (clean per-audience reads — same call as V1 §3 and closing-sprint §2) |
| **Placements** | **Advantage+ Placements** with manual exclusions: **EXCLUDE Audience Network, Right Column, Reels Overlay Ads, Search Results**. Manual allow: FB Feed, FB Reels, IG Feed, IG Reels, IG Stories, FB Stories, IG Explore. |
| **Schedule** | Continuous, run all days/all hours |
| **Attribution** | 7-day click, 1-day view |
| **Optimization event** | `CompleteRegistration` |
| **Bid strategy** | Highest volume (lowest cost). Locked for first 50 conversions per ad set per Hard Rule 3. |
| **Pacing** | Standard |
| **Exclusions (all ad sets)** | (1) Custom audience: Tonvo CRM upload (existing free + paid users, hashed). (2) 30-day `/login` confirmed-hit website visitors. (3) Past 90-day signup events (Pixel-defined custom audience). |

### AS-01 — AE × Angle F (Note-Taking Relief)

| Setting | Value |
|---|---|
| **Name** | `01_US_SIGNUP_AE-Interest_F-NoNotes_AdvPlus` |
| **Daily budget** | **$30–$40/day** |
| **Audience** | Detailed targeting: job titles `Account Executive`, `Senior Account Executive`, `Sales Development Representative`, `Business Development Representative`, `Inside Sales Representative`, `Sales Representative`. Interest narrow (ANY of): `Salesforce.com`, `HubSpot CRM`, `Outreach (software)`, `Salesloft`, `Gong (company)`, `Chorus.ai`, `Zoom (software)`, `Microsoft Teams`. Behaviors: `B2B decision-makers`, `Engaged Shoppers`. Excludes VP/CRO/Head/Director/Manager titles. |
| **Est audience size** | 4M–9M |
| **Expected daily impressions floor** | ~1,000–1,500 (at $30/day, $25 CPM mid-target = ~1,200 impressions; if <800/day on D+1, audience too narrow or creative throttled) |
| **Ads loaded** | V2-01 (9:16, 18s), V2-02 (9:16, 12s) |

### AS-02 — AE × Angle G (Live Signal)

| Setting | Value |
|---|---|
| **Name** | `02_US_SIGNUP_AE-Interest_G-LiveSignal_AdvPlus` |
| **Daily budget** | **$30–$40/day** |
| **Audience** | Same as AS-01 (AE detailed-targeting stack — we want the angle to be the variable, not the audience) |
| **Est audience size** | 4M–9M |
| **Expected daily impressions floor** | ~1,000–1,500 |
| **Ads loaded** | V2-03 (9:16, 22s), V2-04 (1:1, 15s) |

> Pairing AS-01 + AS-02 gives a clean Angle-F-vs-Angle-G read **inside the AE audience** — the highest-confidence ICP per V1 strategy. This is the central V2 test.

### AS-03 — Top-Rep × Angle G (Live Signal)

| Setting | Value |
|---|---|
| **Name** | `03_US_SIGNUP_TopRep-Interest_G-LiveSignal_AdvPlus` |
| **Daily budget** | **$20–$28/day** |
| **Audience** | Detailed targeting: `Account Executive`, `Senior Account Executive`, `Enterprise Account Executive`, `Sales Executive`. Interests (ANY of): `Salesloft`, `Outreach (software)`, `Sales coaching`, `Pavilion (community)`, `Sandler Training`, `Chris Voss`, `Sam Jacobs`, `HubSpot Academy`, `Sales enablement`. Behaviors: `Engaged Shoppers`, `Technology early adopters`. Excludes VP/CRO/Head/Director/Manager. |
| **Est audience size** | 2M–6M |
| **Expected daily impressions floor** | ~800–1,200 |
| **Ads loaded** | V2-03 (9:16, 22s), V2-04 (1:1, 15s) |

> Why Top-Rep gets only Angle G: Angle F (note-taking relief) is universal-AE pain; Top-Reps are edge-seekers, not relief-seekers. Angle G's "watch the product catch what you missed" is the gain-coded variant Top-Reps over-index on. Angle F in this cell would be wasted spend.

### AS-04 — Founder × Angle F (Note-Taking Relief)

| Setting | Value |
|---|---|
| **Name** | `04_US_SIGNUP_Founder-Interest_F-NoNotes_AdvPlus` |
| **Daily budget** | **$15–$22/day** |
| **Audience** | Job titles: `Founder`, `Co-founder`, `CEO`. Interests (ANY of): `Y Combinator`, `Indie Hackers`, `Product Hunt`, `Hacker News`, `Stripe Atlas`, `Founder Institute`, `Startup`, `Bootstrapping`, `Solopreneur`. Behaviors: `Small business owners`, `Technology early adopters`. Employer narrow: company size `1–10 employees` + `11–50 employees`. |
| **Est audience size** | 1M–3M |
| **Expected daily impressions floor** | ~500–900 |
| **Ads loaded** | V2-01 (9:16, 18s), V2-02 (9:16, 12s) |

> Why Founder gets only Angle F: founders are chaotic note-takers during demos (per brief §3 Angle F). Angle G's "three signals in 30 seconds" is paced for an AE running deals; Founders haven't built that pattern-recognition yet. Note-taking relief is the founder pain.

### AS-05 — AE Lookalike × Mixed F+G

| Setting | Value |
|---|---|
| **Name** | `05_US_SIGNUP_AE-LAL_MIX-FG_AdvPlus` |
| **Daily budget** | **$20–$28/day** |
| **Audience** | **Lookalike 1–3% US** of: (1) past 90-day Pixel `CompleteRegistration` events if ≥100 fire, (2) CRM upload of paid Closer/Team subscribers if available, (3) 30s+ `/login` visitors as fallback. No interest overlay at launch. |
| **Est audience size** | 6M–10M |
| **Expected daily impressions floor** | ~800–1,200 |
| **Ads loaded** | V2-01 (9:16, 18s), V2-03 (9:16, 22s) — one from each angle bucket, the LAL is a creative-tournament cell |

> **Dependency:** if Tonvo has zero seed signal at V2 launch (no V1 data + no Pixel signup history), drop AS-05 and reallocate $20/day across AS-01 + AS-02. Note in launch-day decision.

### AS-06 — Broad Advantage+ × Mixed F+G (control)

| Setting | Value |
|---|---|
| **Name** | `06_US_SIGNUP_BroadAdv_MIX-FG_AdvPlus` |
| **Daily budget** | **$15–$22/day** |
| **Audience** | **Broad** — no detailed targeting beyond US + age 25–45. Advantage+ audience expansion ON (the one ad set where we let Meta's algo go wide). Same campaign-wide exclusions apply. |
| **Est audience size** | 50M+ |
| **Expected daily impressions floor** | ~700–1,100 |
| **Ads loaded** | V2-01 (9:16, 18s), V2-03 (9:16, 22s) |

> Why AS-06 exists: the V2 brief's friction-mitigation §5 explicitly calls for testing "Advantage+ with sales-rep / SaaS-AE seed interests" against a manual stack. AS-06 is the broad-Advantage+ benchmark. If AS-06 wins on CPS, V3 leans broad; if AS-01/02 wins, V3 leans tight interest stacks. Either outcome is useful.

### Why six and not nine

| Considered | Why we cut it |
|---|---|
| Add AS for Top-Rep × Angle F | Angle F doesn't fit the Top-Rep register (see AS-03 note); would waste $20+/day |
| Add AS for Founder × Angle G | Same logic in reverse (see AS-04 note) |
| Add a 9:16 vs 1:1 placement split test | V1 mixed within ad set already; we don't have evidence yet that segmenting by placement at this budget produces readable signal |
| Add an Angle H ad set | Angle H is **gated** on testimonial verification (brief §10 Q1); ad set goes live only when V2-05/V2-06 enter production |

**Six ad sets × $130–$180/day total = ~$22–$30/day per ad set average.** At $11 target CPS midpoint, that's ~2–3 conversions/day/ad set, reaching the 50-conversion learning-exit floor in 17–25 days. Acceptable for a V2 test cycle that has a D+14 iteration gate.

---

## 4. Ad-level assignment

### Variant → ad set matrix (launch wave)

| Variant ID | Angle | Format | Duration | Hook | AS-01 | AS-02 | AS-03 | AS-04 | AS-05 | AS-06 | Cell type |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **V2-01** | F | 9:16 | 18s | H1 "Your hands typed" | ✓ | | | ✓ | ✓ | ✓ | Control (lead Angle F) |
| **V2-02** | F | 9:16 | 12s | H2 "Stop typing" | ✓ | | | ✓ | | | Test (Angle F short-form B) |
| **V2-03** | G | 9:16 | 22s | H3 "Three signals" | | ✓ | ✓ | | ✓ | ✓ | Control (lead Angle G) |
| **V2-04** | G | 1:1 | 15s | H4 "POV Tonvo" | | ✓ | ✓ | | | | Test (Angle G Feed-format B) |

**Ad-load count at launch:** 14 ad objects (V2-01 × 4 ad sets + V2-02 × 2 + V2-03 × 4 + V2-04 × 2). Each ad object is loaded **as a separate Meta ad** per ad set so that Meta's auction tracks per-cell performance independently — same pattern as V1 §4 cross-listing.

### Cell-of-control vs cell-of-test

- **Control cells** (the variant that ships first, sets the baseline): V2-01 in AS-01 (AE × F) and V2-03 in AS-02 (AE × G). These are the two highest-confidence pairings; they're what we'd ship if we could only ship two ads.
- **Test cells**: V2-02 and V2-04 are the A/B variants for their respective angles — V2-02 tests whether a 12s open-canvas Angle F beats V2-01's 18s keyboard-B-roll structure; V2-04 tests whether 1:1 POV framing on Feed picks up volume V2-03 doesn't reach in 9:16 Reels.
- **Audience-transfer cells**: V2-01 and V2-03 also live in AS-04, AS-05, AS-06 to test whether the same creative travels across audience types. This is the cross-audience portability test.

### Second-wave queued (NOT loaded at launch)

| Variant ID | Angle | Format | Duration | Hook | Gate | Trigger |
|---|---|---|---|---|---|---|
| V2-05 | H (Testimonials) | 9:16 | 15s | H5 "Six closers agree" | Brief §3 / §10 Q1: 6 testimonials must be verifiable + permission to use | When gate clears, build new ad set AS-07 (`07_US_SIGNUP_AE-Interest_H-Testimonials_AdvPlus`) at $20–$25/day |
| V2-06 | H (Testimonials) | 1:1 | 12s | H6 "Sarah closes 41%" | Brief §10 Q2: the 41% number must trace to a dated source | If gate clears, ships into AS-07 alongside V2-05; if H6 specifically fails verification, ship V2-05 only |
| V2-07 | F (Note) | 9:16 | 20s | umbrella H7 | Wave-2 production (brief §7 selection rule: F second-wave variant) | D+7 trigger if AS-01/AS-04 underperform their CPS band |
| V2-08 | F (Note) static | 9:16 still | n/a | H1 (still) | Wave-2 production | D+7 trigger as a CPM-floor probe for the "exclude AI tools" interest variant |

V2-05 / V2-06 are explicitly **launch-blocked** by the brief's no-invented-social-proof rule (brief §8 anti-strategy #1). Do not paper over this — if the gate doesn't clear before V2 D0, V2 launches with 4 ads, not 6.

---

## 5. UTM tagging

### Template (set in Ads Manager → Ad → Tracking → URL Parameters or full URL in Website URL field)

```
https://tonvo.co/login
  ?utm_source=meta
  &utm_medium=paid
  &utm_campaign=tvo_v02_us_signup_202605
  &utm_content={{ad.name}}
  &utm_term={{adset.name}}
  &utm_creative_format={{placement}}
```

- `utm_source=meta` — matches V1; consistent with the analyst's existing dashboard pivots.
- `utm_medium=paid` — matches V1 base plan §6. Closing-sprint used `cpc`; we standardize back to `paid` for V2 because PLG signups aren't cost-per-click attribution model.
- `utm_campaign=tvo_v02_us_signup_202605` — explicit V2 tag + launch month so V1 / closing-sprint / V2 are pivot-separable in analytics forever.
- `{{ad.name}}` and `{{adset.name}}` — Meta dynamic-URL substitution. Meta resolves these at delivery.
- `utm_creative_format={{placement}}` — Meta substitutes `Facebook_Mobile_Feed`, `Instagram_Reels`, etc. Lets us pivot CPS by placement without exporting the placement breakdown separately (one of the V1 audit's open questions: "What's the actual placement breakdown by spend?").

### 4 worked examples (post-substitution at Meta delivery time)

```
1) V2-01 in AS-01 served in IG Reels:
   https://tonvo.co/login?utm_source=meta&utm_medium=paid&utm_campaign=tvo_v02_us_signup_202605
     &utm_content=Ad-V2-01_F_H1_9x16_18s_en
     &utm_term=01_US_SIGNUP_AE-Interest_F-NoNotes_AdvPlus
     &utm_creative_format=Instagram_Reels

2) V2-03 in AS-02 served in FB Reels:
   https://tonvo.co/login?utm_source=meta&utm_medium=paid&utm_campaign=tvo_v02_us_signup_202605
     &utm_content=Ad-V2-03_G_H3_9x16_22s_en
     &utm_term=02_US_SIGNUP_AE-Interest_G-LiveSignal_AdvPlus
     &utm_creative_format=Facebook_Mobile_Reels

3) V2-04 in AS-03 served in FB Feed:
   https://tonvo.co/login?utm_source=meta&utm_medium=paid&utm_campaign=tvo_v02_us_signup_202605
     &utm_content=Ad-V2-04_G_H4_1x1_15s_en
     &utm_term=03_US_SIGNUP_TopRep-Interest_G-LiveSignal_AdvPlus
     &utm_creative_format=Facebook_Mobile_Feed

4) V2-02 in AS-04 served in IG Stories:
   https://tonvo.co/login?utm_source=meta&utm_medium=paid&utm_campaign=tvo_v02_us_signup_202605
     &utm_content=Ad-V2-02_F_H2_9x16_12s_en
     &utm_term=04_US_SIGNUP_Founder-Interest_F-NoNotes_AdvPlus
     &utm_creative_format=Instagram_Stories
```

**Verification (D-1):** load the preview link of any one ad in incognito, click through, confirm in analytics that `utm_content=Ad-V2-01_F_H1_9x16_18s_en` (NOT the literal `{{ad.name}}` string — that means substitution failed and the URL is malformed).

---

## 6. Budget split

### Daily budget — Week 1 (Test phase)

| Posture | Total daily | Per-ad-set average | Monthly equivalent |
|---|---|---|---|
| **Floor** | $130/day | ~$22/day | ~$3,900/month |
| **Mid (recommended)** | $150/day | ~$25/day | ~$4,500/month |
| **Stretch** | $180/day | ~$30/day | ~$5,400/month |

**Recommendation: launch at Mid posture ($150/day total)** — same posture as V1 mid recommendation, redeployed against a tighter creative thesis. Floor is too thin to hit the 50-link-clicks-per-ad-set learning-exit floor inside Week 1 across 6 ad sets; Stretch is acceptable if Emilien wants to compress the test cycle.

### Allocation across ad sets (Mid posture, $150/day total)

| Ad Set | Daily $ | % of total | Why this weight |
|---|---|---|---|
| AS-01 — AE × F | $30 | 20% | Primary ICP × novel Angle — V2's central hypothesis |
| AS-02 — AE × G | $30 | 20% | Primary ICP × novel Angle — V2's other central hypothesis |
| AS-03 — Top-Rep × G | $25 | 17% | Secondary ICP, single angle — proportional |
| AS-04 — Founder × F | $20 | 13% | Tertiary ICP, smaller TAM, proportional |
| AS-05 — AE LAL | $25 | 17% | Behavioral benchmark — material weight so the read is readable |
| AS-06 — Broad Adv+ | $20 | 13% | Broad benchmark — material weight, not a token cell |
| **Total** | **$150/day** | **100%** | |

### Floor and ceiling per ad set

- **Floor:** $15/day — below this Meta won't pace cleanly against `CompleteRegistration` (the event is rare enough that <$15/day starves the algo).
- **Ceiling (test phase):** $40/day. Above this we're scaling, not testing.
- **Ceiling (scale phase, D+7+):** uncapped on winners, gated by the +20%/day scale rule.

### Kill rules (Week 1)

| Trigger | Threshold | Action |
|---|---|---|
| **Ad-level kill** | spend > 2× target CPS ($26) AND 0 signups | Pause that ad object. Do not delete. |
| **Ad-set-level kill** | CPS > 3× target ($39) after 50 link-clicks AND 0 signups | Pause ad set. Reallocate budget across surviving ad sets at original proportional weight. |
| **Hook-rate floor** | 3s view < 30% on a video ad after 5,000 impressions | Pause that ad. The hook is failing pre-content. |
| **Hold-rate floor** | 15s view < 12% on V2-01 / V2-03 / V2-04 (the >15s spots) after 5,000 impressions | The reveal isn't earning its screen time. Pause and brief Hook Specialist for a re-cut. |
| **Payback discipline** | CPS at target but 21+ day payback for 14 consecutive days | Pause regardless of CPS. The "vanity signups" lock (brief §8 #6 / §9 Risk 3). |

### Scale rules (D+7 onward)

| Trigger | Threshold | Action |
|---|---|---|
| **Scale winner** | CPS < 0.7× target ($9.10) for 3 consecutive days AND ≥50 conversions AND payback < 14d signal trending positive | +20%/day budget bump until ceiling = 3× original budget or CPS rises above target |
| **CBO migration** | One ad set has clear winner with 50+ conversions at D+7 | Draft V2.1 CBO with winner at 70% / runner-up at 30%, kill rest. This is a D+14 decision, not D+7. |

### When to stop

- **Pause V2 entirely** if total spend exceeds $1,500 (Week 1 stretch posture) AND total signups < 30 across 6 ad sets. That CPS would be > $50, beyond the pessimistic case. Stop, audit Pixel + landing, do not re-spend until root cause is fixed.

---

## 7. Pixel / CAPI events tracking

### Events to fire (all with deduplication `event_id` match browser ↔ server)

| Event | Where it fires | Browser Pixel | CAPI server | Why we need it |
|---|---|---|---|---|
| `PageView` | All pages | ✓ | optional | Baseline traffic, attribution chain start |
| `ViewContent` | `tonvo.co/login` (signup form view) | ✓ | ✓ | Leading indicator of intent — landing→signup funnel-step measurement |
| **`CompleteRegistration`** | `tonvo.co/login` post-signup | ✓ | ✓ | **Optimization event for V2.** Dedup REQUIRED. |
| `Signup` (custom legacy) | Same as CompleteRegistration | ✓ | ✓ | Legacy reporting compat — keep firing per V1 §1 |
| `Subscribe` | Stripe checkout success (Closer $19 / Team $49) | ✓ | ✓ | Payback signal — the D+14 day "did this signup become paid" check. |
| `Activated` (custom) | First completed session inside the app (after signup) | ✓ | ✓ | Activation rate proxy — flagged in V1 audit as the "is product owning the gap" measurement |

**Campaign optimizes on:** `CompleteRegistration` (single event, Meta Standard). Subscribe and Activated are tracked-not-optimized — they feed the payback discipline kill rule in §6.

### Explicit flag — CAPI dedup verification (UNRESOLVED PER V1 AUDIT)

V1 audit `post-launch-audit-2026-05-17.md` Action #1, verbatim:

> "VERIFY Pixel + CAPI dedup in Test Events BEFORE pulling any CPS number. Run a live test signup on `tonvo.co/login` in incognito; confirm browser + server event with matching `event_id` lands within 30s. If broken, every kill/scale call is noise — fix infra first, then re-baseline."

**This is a hard launch blocker for V2** and the highest-priority single item on the pre-flight checklist. Existing implementation at `src/app/api/meta-capi/route.ts` ships the route + allow-list + hashing (the closing-sprint plan §1 verified line 37 includes `CompleteRegistration`). That proves **code shipped**, not **events firing in Meta with dedup**.

### Validation procedure (run before D0, document in `09-verification/pixel-capi-v2-verification.md`)

1. Open Meta Events Manager → Data Sources → tonvo.co Pixel → **Test Events** panel.
2. In Test Events, set the test browser ID (Meta provides a session token in the panel header).
3. Open `tonvo.co/login` in a fresh incognito window. Paste the test browser ID into the URL fragment per Meta's instructions.
4. Complete a real signup (use a throwaway email; mark the account for cleanup post-test).
5. Within 30 seconds, Test Events should show **both** rows:
   - Row 1: browser Pixel `CompleteRegistration` with an `event_id` value
   - Row 2: server CAPI `CompleteRegistration` with the **same** `event_id` value
   - Deduplication status: **Deduplicated** (Meta's panel labels this explicitly)
6. If only one row appears OR `event_id` doesn't match OR dedup status is "Not deduplicated", **launch is blocked**. File a ticket against `src/app/api/meta-capi/route.ts` and the client-side Pixel snippet. Do not authorize V2 launch until this passes.

The V2 brief §10 Q5 specifically calls out: "Is the new landing's signup event (Meta Pixel + CAPI) firing correctly with the redesign? The hero / scroll / typewriter / testimonial sections are all new DOM — verify nothing broke the `Signup` event before V2 traffic lands on it." This is a re-verification, not a first-time verification — the landing redesign post-V1 means the previous green status (if any) is stale.

### AEM priority (set in Events Manager → Aggregated Event Measurement → tonvo.co)

```
Priority 1: CompleteRegistration   (V2 optimization target — must be #1)
Priority 2: Subscribe              (payback signal)
Priority 3: Activated              (activation signal)
Priority 4: ViewContent            (funnel-step)
Priority 5: PageView               (baseline)
```

Closing-sprint plan §12 Q3 raised the right concern: V1 had Signup (custom) at priority 1, but `CompleteRegistration` is the Meta Standard event V2 optimizes on. **Re-rank AEM before V2 launch** so iOS users post-iOS-14 attribute correctly. Without this, iOS CPS is silently undercounted 25–40% (V1 §7).

---

## 8. Read schedule

| Day | Metric focus | Owner | Decision allowed |
|---|---|---|---|
| **D+0** (launch day) | Live-fire sanity: Meta delivery active, all 14 ads in active delivery within 4h, `CompleteRegistration` events landing in Events Manager within 30 min of first impressions | media-buyer + analyst light-touch | None. No edits. |
| **D+1** | **Hook rate (3s view)** by ad. UTM hydration confirmed in analytics. Any Meta rejection notices reviewed. | analyst | Per Hard Rule 3: no edits during learning phase. Only emergency intervention = Meta-rejected ad pulls or critical Pixel failure. The 72h no-edit rule is in force. |
| **D+3** | First signal read: hook rate, hold rate at 6s/15s, landing → signup conversion (early), per-ad spend pacing | analyst | Apply ad-level kill rules from §6 ONLY. No ad-set kills yet (50-click floor probably not met). No budget changes >25%. |
| **D+5** | LPV (landing page view) rate by ad, CTR (link) by ad, early CPS where ≥30 conversions exist in any cell | analyst | Per-ad kill rule continues; consider hot-swapping V2-08 static into AS-06 as CPM probe if AS-06 CPM > $35 |
| **D+7** | **Full read.** CPS by ad set, by ad, by placement (via utm_creative_format). Payback signal direction (any Subscribes yet?). Activation rate by ad. LAL benchmark vs interest stacks. | analyst | Apply ad-set kill rules. Scale-rule eligibility check. Trigger V2-07 / V2-08 wave-2 production if any AS-01/AS-04 underperforms. Re-evaluate whether Angle H gate has cleared. |
| **D+14** | Iteration cycle. Compounding payback signal. CBO migration decision. V3 angle hypothesis seeded by V2 winners. | analyst + strategist | Scale winners, kill losers, draft V2.1 CBO if a clear winner exists with 50+ conversions, pause any ad set hitting the 21+ day payback discipline trigger. |

**Minimum action delay:** 72h no-edit rule (Hard Rule 3 / V1 audit Action #2 / brief §9 Risk 1). Premature edits during learning phase reset Meta's algorithm. The 72h floor is non-negotiable except for the two emergency-intervention triggers above.

---

## 9. Pre-flight checks (D-1, before any ad goes live)

10 items. Items 1–5 are **hard launch blockers** per Hard Rule §1 / V1 §7 / closing-sprint §7. Items 6–10 are pre-flight discipline.

- [ ] **1. Meta Pixel installed on tonvo.co (verified by Events Manager → Test Events fire on /login)** — re-verify after the landing redesign; do not assume V1 green-status holds.
- [ ] **2. `CompleteRegistration` event firing with `event_id` (verified by Test Events row visible with event_id value)** — actual real test signup, not code inspection.
- [ ] **3. CAPI configured + deduplicated (verified by Test Events showing both browser + server rows with matching `event_id` and "Deduplicated" status within 30s)** — per §7 procedure. **THIS IS THE GATING ITEM CARRIED OVER FROM V1 AUDIT.** Without it, V2 launch is structurally impossible.
- [ ] **4. Domain tonvo.co verified in Meta Business Manager → Brand Safety → Domains.**
- [ ] **5. AEM priority set: 1=CompleteRegistration, 2=Subscribe, 3=Activated, 4=ViewContent, 5=PageView (verified by AEM panel showing this order).**
- [ ] 6. UTM parameters hydrate in analytics on the preview-link click-through (no literal `{{ad.name}}` strings).
- [ ] 7. All 4 hero creatives uploaded at correct aspect + duration + file size per Meta specs (V2-01 9:16 18s, V2-02 9:16 12s, V2-03 9:16 22s, V2-04 1:1 15s).
- [ ] 8. Landing matches each ad's end-frame promise — verify each variant's final beat (typewriter line for V2-01/02, signal-detection language for V2-03/04) is also on the landing within the first viewport.
- [ ] 9. CRM exclusion list uploaded (hashed) as Custom Audience. Past 90-day signup-event Custom Audience built and excluded. 30-day `/login` visitor exclusion populated.
- [ ] 10. Hard daily budget cap confirmed with Emilien in writing. Mid posture ($150/day) is the default; written confirmation needed before activation.

Plus an 11th item that's recommended but not a blocker:
- [ ] 11. V1 + closing-sprint campaigns paused (per §2 Option C recommendation). If Emilien overrides and keeps them live, document in `09-verification/founder-overrides.md`.

---

## 10. Risks + open questions

### 3 structural risks

1. **CAPI dedup is still unverified at this writing.** The V1 audit explicitly flagged it. The closing-sprint plan flagged it. The V2 brief §10 Q5 re-raises it for the redesigned landing. If V2 launches before §9 Item 3 passes, every CPS number this plan references is undefined, the kill rules are unenforceable, and the entire test cycle is invalidated. The fix is 30 minutes of testing, not 3 days of work — refuse to launch if Item 3 is still red.

2. **Six ad sets at $150/day is the readable floor, not a comfortable margin.** Average $25/day per ad set × $11 target CPS = 2–3 conversions/day/ad set. The 50-conversion learning exit takes 17–25 days. If Emilien wants a clean D+7 read, the floor is closer to $50/day per ad set = $300/day total. We chose six cells over fewer cells with higher per-cell budget because the V2 brief specifically tests an angle × audience matrix, not a budget-concentration thesis. If the matrix isn't readable at Mid posture, V2.1 collapses to 3 ad sets at $50/day each — pre-write that decision now so we don't argue it at D+7.

3. **Angle H gate may not clear before D0.** V2-05 and V2-06 are gated on testimonial verification (brief §3 / §10 Q1, Q2). If the gate doesn't clear, V2 launches with 4 ads instead of 6, AS-07 doesn't exist, and the "social proof" hypothesis is untested in V2. That's acceptable — what's not acceptable is shipping V2-05 / V2-06 with unverified testimonials under launch pressure (brief §9 Risk 2 anti-pattern).

### 3 open questions for Emilien (real blockers, not nice-to-haves)

1. **Pause V1 + closing-sprint at V2 D0, yes or no?** Recommendation is yes (§2 Option C). If no, V2 budget pressure increases, attribution noise increases, and we need to redraft this plan with a 3-campaign-parallel structure (no objection in principle, but the budget needs to be $300+/day total to make 3 campaigns readable).

2. **Has CAPI dedup been re-verified post-landing-redesign?** §7 / §9 Item 3. If not, who runs the verification procedure and on what date? V2 D0 is gated on this answer.

3. **Are the 6 landing testimonials cleared for ad use?** Brief §10 Q1 — without yes, V2-05/06 do not enter production and AS-07 stays offline. Acceptable outcome, but we need to know now so creative-director doesn't sink production days into a gated build.

---

## Final recap (< 200 words)

**Structure (one line):** 1 ABO campaign · 6 ad sets · 4 hero ads (V2-01/02/03/04) · daily budget $150/day Mid posture · Sales objective optimizing on `CompleteRegistration` Pixel + CAPI deduped event · V1 + closing-sprint archived at V2 D0.

The V2 plan trades V1's 4-ad-sets-shotgun for a 6-cell matrix (3 audiences × 2 angle buckets + LAL + broad Adv+ benchmarks), runs the typewriter-aligned ad-to-landing thematic-match hypothesis from the brief, and keeps the 72h no-edit / 50-conversion-bid-lock / payback-discipline rules from V1 intact. Hard launch blocker carried over from the V1 audit: CAPI dedup must pass Test Events with matching `event_id` before any ad activates — code-shipped is not firing-and-deduped. Second-wave creatives (V2-05/06 Angle H, V2-07/08 wave-2 F/G) are queued behind a testimonial-verification gate and a D+7 performance trigger, so the launch wave stays at 4 ads instead of 8 and one creative gets to breathe.

---

## Appendix — Import plan

**Build in UI manually.** Reasons identical to V1 §11 and closing-sprint §11: custom audience exclusions don't bulk-import cleanly, dynamic UTM substitution doesn't validate in CSV preview, 14 ad objects with per-cell variant assignment is more error-prone in CSV than UI. Block 75 min on D-1 for the build pass (1 campaign + 6 ad sets + 14 ads + audience uploads + LAL seed + AEM re-rank).

---

_End V2 media plan. Next iteration: appended to `07-results/` after the D+7 analyst read._

# Media Plan — Tonvo Meta Ads Campaign 01

_Media Buyer: Claude Opus · Owner: Emilien · Date: 2026-05-03 · Status: v1 pre-launch · Geo: US · Language: US English_

> **Read order:** 00-brief.md → 01-strategy.md → 03-copy.md → 04-creative-briefs/A-E → this doc.
> **What this is:** the launch-ready Meta Ads Manager build sheet. Emilien should be able to log in, copy structure, paste audiences, and ship.

---

## TL;DR

- **One campaign**, ABO, Sales objective, optimizing on `Signup` Pixel event.
- **4 ad sets** at launch: ICP-1 AE (~60%), ICP-2 Top-Rep Hunter (~25%), ICP-3 Founder (~15%), plus a small **Control LAL** set funded out of an extra +15% on top of base for benchmarking.
- **12 ads total at launch** (3 per ad set, equal weight), drawn from Briefs A / B / C / D. Brief E held in reserve for week-2 trigger.
- **Daily budget range: $100–$165/day** total, scaling up to ~$200/day if early CPS reads are healthy. Per-ad-set ranges below.
- **4 launch blockers** must close before D-day: Pixel + `Signup` event firing, CAPI configured, domain verified, hard budget cap from Emilien. All flagged.
- **One compliance flag**: the +27% claim. Plan B = no-+27% fallback variant (already produced in Brief B).

---

## 1. Campaign architecture

| Setting | Value |
|---|---|
| **Campaign name** | `TVO_v01_US_SIGNUP` |
| **Buying type** | Auction |
| **Objective** | **Sales** (NOT Traffic, NOT Leads — Meta has been ranking "Leads" lower for B2B SaaS PLG flows since the 2025 ODAX consolidation; Sales with a Signup conversion event is the right fit for free-tier signup as the optimization target) |
| **Conversion location** | Website |
| **Performance goal** | Maximize number of conversions |
| **Pixel event** | `CompleteRegistration` (Meta standard — optimizes better than custom). Fires on `tonvo.co/login` post account creation. Code shipped 2026-05-03 — see `09-verification/pixel-capi-deployment.md`. Deduplicated with CAPI via shared `event_id`. The `Signup` custom event also fires for legacy reporting compat. |
| **Bid strategy** | **Highest volume** (lowest cost) for v1. Switch to **Cost cap** at the target CPS once ad set has 50+ conversions and a stable CPS baseline (typically week 2–3). |
| **Attribution setting** | **7-day click, 1-day view** (Meta default for Sales — the only spec-aligned choice for a signup that often happens after a single tap-through but can also follow a scroll-past view in Reels) |
| **Budget level** | **Ad set (ABO)** — see §2 |
| **Schedule** | Continuous, no end date |
| **Special ad categories** | None |
| **A/B test** | OFF (we use ad-set-level audience splits + ad-level creative splits — Meta's built-in A/B test tool starves both cells of learning data at this budget) |

---

## 2. ABO vs CBO — structure decision

**Decision: ABO (Advantage Campaign Budget = OFF).**

**Reasoning.**
- v1 is a **learn-which-audience-works** test, not a scale test. CBO will collapse spend onto whichever ad set Meta finds cheapest in the first 24h — and at this budget that decision is made on ~30 conversions of evidence per cell, which is statistical noise. We get a "winner" that's actually a fluke.
- ABO forces equal-weighted exposure across our 3 ICP segments + 1 control. We pay a small efficiency tax (Meta's algo is genuinely better at intra-day reallocation than we are) in exchange for clean per-audience CPS reads in 7 days.
- The 60/25/15 strategy split is **deliberate audience weighting** — CBO would override it. ABO honors the strategy doc's hypothesis structure.

**When we switch to CBO.**
- After the 7-day read, when one ad set has clearly won AND has 50+ conversions of evidence.
- At that point: collapse to a single CBO campaign with the winning ad set at 70% allocation and the runner-up at 30% as ongoing creative pressure-relief. Kill the rest.
- Concretely: **CBO migration is a v2 decision, not a launch decision.**

---

## 3. Ad sets

All ad sets share these defaults (call out only deltas in the per-set tables below):

| Default | Value |
|---|---|
| **Geo** | United States only |
| **Language** | English (All) |
| **Age** | 24–45 |
| **Gender** | All |
| **Detailed targeting expansion** | **OFF** for v1 (we want clean audience reads; Meta's expansion bleeds across our ICP cells) |
| **Placements** | **Advantage+ Placements**, with **Audience Network EXCLUDED** (low-quality clicks for B2B SaaS) and **Right Column EXCLUDED** (no creative fit for our 9:16/1:1 stack). Manual placement filter to allow only: Facebook Feed, Facebook Reels, Instagram Feed, Instagram Reels, Instagram Stories, Facebook Stories, Instagram Explore. |
| **Schedule** | Continuous, run all days/all hours |
| **Attribution** | 7-day click, 1-day view |
| **Optimization event** | `Signup` |
| **Pacing** | Standard |
| **Exclusions (all ad sets)** | Custom audience: **Tonvo CRM upload** (existing free + paid users) — Emilien to upload `users.csv` to Meta Business Manager → Audiences → Custom Audience → Customer List, hashed. Also exclude: **Website visitors past 30 days who already hit `/login` confirmed** (custom audience from Pixel — these have either signed up or bounced; either way, no fresh-spend on them). |

---

### AS-1 — ICP-1 Quota-Slipping AE (primary, ~60% of base budget)

| Setting | Value |
|---|---|
| **Name** | `01_US_SIGNUP_QuotaSlippingAE_POV-50k` |
| **Budget (range)** | **$60–$100/day** |
| **Audience type** | Detailed Targeting (interest + job title stack) |
| **Job titles (Meta detailed targeting)** | `Account Executive`, `Senior Account Executive`, `Sales Development Representative`, `Business Development Representative`, `Inside Sales Representative`, `Sales Representative`. Use INCLUDE-ANY across these. |
| **Interests (narrow with AND)** | Must match ANY of: `Salesforce.com`, `HubSpot CRM`, `Outreach (software)`, `Salesloft`, `Gong (company)`, `Chorus.ai`, `Zoom (software)`, `Microsoft Teams`. |
| **Behaviors** | `B2B decision-makers`, `Frequent business travelers` (proxy for road-warrior AEs with quota pressure), `Engaged Shoppers` (correlates with personal-card SaaS purchase intent for $19/mo tools). |
| **Employer (optional narrow)** | Industry: `Technology`, `Computer Software`, `SaaS`, `Information Technology and Services`. |
| **Excludes** | All campaign-wide exclusions (CRM list + 30d hit-`/login`). Plus: `VP of Sales`, `Chief Revenue Officer`, `Head of Sales`, `Sales Director`, `Sales Manager` (these are ICP-4 retarget territory — keep them out of the cold-prospecting AE bucket per strategy §1). |
| **Estimated audience size** | Meta will likely show 4M–9M. If <2M, pull behaviors. If >12M, tighten with employer industry. |
| **Lead angles** | A (POV $50K) primary, D (Stop Pitching From Memory) secondary |

---

### AS-2 — ICP-2 Top-Rep Hunter (secondary, ~25% of base budget)

| Setting | Value |
|---|---|
| **Name** | `02_US_SIGNUP_TopRepHunter_Gap-27pc` |
| **Budget (range)** | **$25–$45/day** |
| **Audience type** | Detailed Targeting (interest stack — broader than ICP-1, lighter on title gating) |
| **Job titles (broader — these reps are mid-table, often have varied titles)** | `Account Executive`, `Senior Account Executive`, `Enterprise Account Executive`, `Sales Executive`. |
| **Interests** | Must match ANY of: `Salesloft`, `Outreach (software)`, `Sales coaching`, `Pavilion (community)`, `Sandler Training`, `Chris Voss` (audiobook/author interest), `Sam Jacobs` (Pavilion), `Hubspot Academy`, `Sales enablement`. The "edge-seeker" audience over-indexes on sales-education brands. |
| **Behaviors** | `Engaged Shoppers`, `Technology early adopters` (the top-rep-hunter buys tools faster than peers — that's part of the persona). |
| **Employer (optional narrow)** | Industry: `Technology`, `Computer Software`, `SaaS`. Company size proxy: include `Small business` AND `Mid-sized business` employer behaviors. |
| **Excludes** | All campaign-wide exclusions. Plus AS-1 audience overlap (Meta will dedupe automatically because of CRM exclusion, but to be safe: exclude all the same VP/Director/Manager titles as AS-1). |
| **Estimated audience size** | 2M–6M. Tighter than AS-1 by design — this is a curiosity/edge audience, not a desperation audience. |
| **Lead angles** | B (+27% Same Pitch) primary, C (The Gap) secondary |

---

### AS-3 — ICP-3 Founder (tertiary, ~15% of base budget)

| Setting | Value |
|---|---|
| **Name** | `03_US_SIGNUP_FounderSelling_AB-cross` |
| **Budget (range)** | **$15–$25/day** |
| **Audience type** | Detailed Targeting (founder/early-stage persona) |
| **Job titles** | `Founder`, `Co-founder`, `CEO`, `Chief Executive Officer` (filter to small-company employer signal — large-company CEOs are noise). |
| **Interests** | Must match ANY of: `Y Combinator`, `Indie Hackers`, `Product Hunt`, `Pieter Levels`, `Marc Lou` (if available — fall back to `Solopreneur` interest if not), `Hacker News`, `Stripe Atlas`, `Founder Institute`, `Startup`, `Bootstrapping`, `Solopreneur`. |
| **Behaviors** | `Small business owners`, `Technology early adopters`. |
| **Employer (narrow)** | Company size: `1–10 employees`, `11–50 employees`. |
| **Excludes** | All campaign-wide exclusions. Plus AS-1/AS-2 title overlaps. |
| **Estimated audience size** | 1M–3M. Founders are a small audience in the US — this is fine; the budget allocation is small to match. |
| **Lead angles** | A (POV $50K) and B (+27%) cross-tested — Brief A's "deal lost" register has resonance for founders too (a founder who just lost an enterprise pilot is the same emotional shape as an AE who lost quota). E held as week-2 reserve trigger. |

---

### AS-4 — Control: 1–3% Lookalike (~10–15% of total spend, additive)

| Setting | Value |
|---|---|
| **Name** | `04_US_SIGNUP_LAL1-3-Signup_Control` |
| **Budget (range)** | **$15–$25/day** (additive — adds ~15% on top of the 60/25/15 base) |
| **Audience type** | **Lookalike** (1–3% US) of the highest-quality seed Tonvo has |
| **Seed audience preference (in priority order)** | 1. Existing **Signup events** from Pixel (last 90 days) — only if Pixel has been firing long enough to have 100+ events. 2. **CRM upload of paid Closer/Team subscribers** (highest LTV signal — even 50 seeds is workable for Meta LAL). 3. **Website visitors who hit `/login` and stayed >30s** (next-best behavioral seed). 4. **Fallback:** broad website-visitor LAL of all `tonvo.co` traffic last 90 days. |
| **LAL %** | 1–3% (Meta builds it as a continuous range — this gives a ~6–10M audience in the US) |
| **Job titles (overlay)** | None at launch. The LAL is by design "people who look like our converters" — overlaying titles defeats the purpose. **Exception:** if seed is <500 people and the LAL feels noisy after 72h, overlay AS-1's job-title set as a guard-rail. |
| **Excludes** | All campaign-wide exclusions. |
| **Why it's here** | This is our **benchmark against interest-based targeting**. If AS-4 (LAL) clearly outperforms AS-1/2/3 on CPS, that's a strong signal that v2 should lean LAL-first and demote interest stacks. If AS-4 underperforms, our interest hypothesis was solid. Either result is useful. |
| **Lead angles** | Mixed — load 2 ads from Brief A + 1 from Brief B (the strongest performers historically; let creative variety breathe within a behaviorally-defined audience) |

> **Open dependency:** if Tonvo has zero seed signal at launch (Pixel just installed, no CRM file), drop AS-4 and reallocate that ~$20/day across AS-1 (+$12) and AS-2 (+$8). Note this in the launch-day decision.

---

## 4. Ad layer — which ads ship to which ad set

We are **not shipping 20 ads**. v1 ships **12 ads total** at launch — 3 per ad set, equal weight, allowing Meta's auction to surface the strongest within each cell. Brief E held for week-2 trigger.

Production yields per Creative Director (Briefs A–E):
- **Brief A:** Ad11 master 9:16 (already shipped) + 1:1 reformat + 1:1 Variant B (Hook 2 "ghosted") = 3 video ads
- **Brief B:** Ad10 master 3:4 (already shipped) + 9:16 reformat + no-+27% fallback = 3 video ads (fallback is on-standby, NOT loaded at launch)
- **Brief C:** 9:16 motion + 1:1 reformat + S2 static export = 3 ads (2 video, 1 static)
- **Brief D:** 3 statics (Static A 1:1, Static A 4:5, Static B 1:1) + 1× 24s 9:16 motion = 4 ads
- **Brief E:** 9:16 motion + 1:1 reformat = 2 ads — **RESERVE — week 2 trigger only**

### Ad-load matrix (launch — 12 ads)

| Ad Set | Ad Name | Format | Source | Copy combo |
|---|---|---|---|---|
| AS-1 (AE) | `Ad-A-POV50k-9x16_h1_pA_hlA` | 9:16 video | Brief A · Ad11 master (already shipped) | Hook 1 + Primary A + Headline A |
| AS-1 (AE) | `Ad-A-POV50k-1x1_h1_pA_hlA` | 1:1 video | Brief A · 1:1 reformat | Hook 1 + Primary A + Headline A |
| AS-1 (AE) | `Ad-D-StopPitch-9x16_h2_pA_hlC` | 9:16 video | Brief D · 24s motion | Hook 2 (POV Friday) + Primary A + Headline C |
| AS-2 (Top-Rep) | `Ad-B-27pc-9x16_h3_pB_hlB` | 9:16 video | Brief B · 9:16 reformat | Hook 3 (1,247 social-proof) + Primary B + Headline B |
| AS-2 (Top-Rep) | `Ad-B-27pc-3x4_h3_pB_hlB` | 3:4 video | Brief B · Ad10 master (already shipped) | Hook 3 + Primary B + Headline B |
| AS-2 (Top-Rep) | `Ad-C-Gap-9x16_h1_pA_hlC` | 9:16 video | Brief C · primary build | Hook 1 (Top rep isn't smarter) + Primary A + Headline C |
| AS-3 (Founder) | `Ad-A-POV50k-1x1_h2_pB_hlB` | 1:1 video | Brief A · 1:1 Variant B (ghosted) | Hook 2 (ghosted) + Primary B + Headline B |
| AS-3 (Founder) | `Ad-B-27pc-9x16_h3_pB_hlB` | 9:16 video | Brief B · 9:16 reformat | Hook 3 + Primary B + Headline B (cross-test) |
| AS-3 (Founder) | `Ad-D-StopPitch-Static-1x1_h3_pB_hlC` | Static 1:1 | Brief D · Static A | Hook 3 (Playbook PDF) + Primary B + Headline C |
| AS-4 (LAL Control) | `Ad-A-POV50k-9x16_h1_pA_hlA` | 9:16 video | Brief A · Ad11 master | Hook 1 + Primary A + Headline A |
| AS-4 (LAL Control) | `Ad-C-Gap-1x1_h1_pA_hlC` | 1:1 video | Brief C · 1:1 reformat | Hook 1 + Primary A + Headline C |
| AS-4 (LAL Control) | `Ad-B-27pc-9x16_h3_pB_hlB` | 9:16 video | Brief B · 9:16 reformat | Hook 3 + Primary B + Headline B |

**Note on cross-listing:** Brief A 9:16 master and Brief B 9:16 reformat each appear in two ad sets (AS-1+AS-4 and AS-2+AS-3+AS-4 respectively). That is intentional — the same creative file is loaded as a *separate ad object* per ad set so Meta tracks performance independently. This is how the platform expects ABO cross-audience tests to be structured.

**Ads NOT loaded at launch (in inventory, ready to swap):**
- Brief B no-+27% fallback (compliance plan B — see §10)
- Brief D Static B (Hook 1 alternate "Stop pitching from memory.") — swap into AS-1 or AS-3 if `Ad-D-StopPitch-9x16` underperforms
- Brief D Static C ("deck and a vibe") — flagged for tone-check (see §10); ship only with Emilien sign-off
- Brief D Static A 4:5 reformat — swap into Feed placement if 1:1 underperforms in Feed
- Brief E 9:16 + 1:1 — week-2 reserve, trigger per kill-rules in §8

---

## 5. Naming convention (locked)

All names lowercase except for `[VV]` prefix and ICP shorthand. Spaces replaced with hyphens. Use this verbatim:

```
Campaign:    TVO_v01_US_SIGNUP

Ad Sets:     01_US_SIGNUP_QuotaSlippingAE_POV-50k
             02_US_SIGNUP_TopRepHunter_Gap-27pc
             03_US_SIGNUP_FounderSelling_AB-cross
             04_US_SIGNUP_LAL1-3-Signup_Control

Ads:         Ad-A-POV50k-9x16_h1_pA_hlA
             Ad-A-POV50k-1x1_h1_pA_hlA
             Ad-A-POV50k-1x1_h2_pB_hlB
             Ad-B-27pc-3x4_h3_pB_hlB
             Ad-B-27pc-9x16_h3_pB_hlB
             Ad-C-Gap-9x16_h1_pA_hlC
             Ad-C-Gap-1x1_h1_pA_hlC
             Ad-D-StopPitch-9x16_h2_pA_hlC
             Ad-D-StopPitch-Static-1x1_h3_pB_hlC
```

**Ad name decoder:** `Ad-[BRIEF]-[ANGLE-SHORTHAND]-[ASPECT]_h[HOOK#]_p[PRIMARY-LETTER]_hl[HEADLINE-LETTER]`. So `Ad-D-StopPitch-9x16_h2_pA_hlC` = Brief D (Stop Pitching), 9:16, Hook 2, Primary A, Headline C. Lets the analyst trace any winning ad back to its exact copy combo without opening a doc.

---

## 6. UTM parameters

URL parameter (set at the **ad level — Website URL field**):

```
https://tonvo.co/login?utm_source=meta&utm_medium=paid&utm_campaign=tvo_v01_us_signup&utm_content={{ad.name}}&utm_term={{adset.name}}
```

- `{{ad.name}}` and `{{adset.name}}` are Meta's dynamic URL parameters — Meta substitutes them at delivery time. Set in Ads Manager → Ad → Tracking → URL Parameters, or paste the full URL into Website URL.
- Meta also injects `fbclid` automatically — keep it; it's required for CAPI deduplication and post-click attribution.
- Per-ad-set / per-ad UTMs let the analyst pivot Signup attribution by audience and creative without touching Meta's UI.

**Verification step (D-1):** load any ad's preview link in incognito, confirm UTMs hydrate correctly, and that GA4 / your analytics tool of choice receives the `utm_content=Ad-A-POV50k-9x16_h1_pA_hlA` value (not the literal `{{ad.name}}` string — that means Meta isn't substituting and the URL was malformed).

---

## 7. Tracking checklist (**LAUNCH BLOCKERS**)

Per the brief's open questions 2 + 3 — these are explicitly NOT resolved yet. **No ad goes live until all four boxes below are green.** This is non-negotiable; without it our CPS reads are unreliable and Meta's algo has nothing to optimize against.

- [ ] **Meta Pixel installed on `tonvo.co`** — visible in Events Manager → Test Events → fires on page-load
- [ ] **`Signup` event firing** on `/login` post-account-creation — visible in Test Events with deduplication ID set
- [ ] **CAPI (Conversions API) configured** for iOS 14+ resilience — server-side event mirrors browser Pixel event with matching `event_id` for dedup. Use Meta's CAPI Gateway, Stape, or direct server integration.
- [ ] **Domain `tonvo.co` verified** in Meta Business Manager → Brand Safety → Domains. Required to set up Aggregated Event Measurement priority.
- [ ] **AEM priority set** in Events Manager → Aggregated Event Measurement → tonvo.co: priority 1 = `Signup`, priority 2 = `Activated` (first session within 7d), priority 3 = `Subscribe` (paid conversion). Without AEM, iOS users post-iOS-14 don't report and our CPS is undercounted by 25–40%.

**Additional pre-launch verification (not blockers, but recommended):**
- [ ] CRM list uploaded as Custom Audience (for exclusion) — needs ≥1,000 hashed entries to populate; if fewer, exclusion still applies but match rate is poor
- [ ] LAL seed audience confirmed populated and ≥100 source events
- [ ] `tonvo.co/login` flow tested incognito on iOS Safari + Android Chrome — confirm <60s to first session, no broken OAuth, no broken redirect

> **Honest read:** if any of these are not in place at D-day, the cleanest move is to delay launch by 1–3 days while infrastructure is fixed. Spending into a broken Pixel is more expensive than the delay.

---

## 8. Kill rules (predefined — restated from spec)

Apply these without panic. **No edits in the first 72h** — Meta's algo needs this window to learn the event and the audiences. Premature kills destroy learning.

| Trigger | Action |
|---|---|
| Ad spend > 2× target CPS ($30) with **0 signups** | **Kill ad.** Pause, do not delete. |
| Ad set CPS > 3× target CPS ($45) after 50 link clicks AND 0 signups | **Kill ad set.** Pause, do not delete. Reallocate budget across the surviving ad sets at the existing 60/25/15 ratio (re-normalized). |
| Ad set CPS < 0.7× target CPS ($10.50) for 3 consecutive days | **Scale +20%/day** until either CPS rises above target or weekly spend hits 3× the original budget — whichever first. |
| Hold rate (3s video) < 35% AND CPS > 1.5× target after 72h on a video ad | Hook is wrong — kill that ad, swap in the standby variant (Brief D Static B for ICP-1, Brief E for ICP-3 — see §11) |
| Brief A and Brief D both > 1.5× target CPS at 72h | **Trigger Brief E build** (see §11 launch sequence). Producer has 2 days to ship; analyst monitors. |
| +27% claim flagged by Meta auto-review on any Brief B ad | **Pause the flagged ad. Ship Brief B no-+27% fallback within 24h** (already produced — see §10). |

---

## 9. Budget recommendation

> **Ranges only. Emilien locks the actual number. The ranges below match the brief's "$1k/month" posture (~$30–50/day across 3–4 ad sets) at the floor and lean to the upper end if Emilien wants more learning velocity.**

### Base allocation (60/25/15 across ICP-1/2/3)

| Ad Set | Floor | Mid | Stretch |
|---|---|---|---|
| AS-1 (AE) — 60% | $60/day | $80/day | $100/day |
| AS-2 (Top-Rep) — 25% | $25/day | $32/day | $42/day |
| AS-3 (Founder) — 15% | $15/day | $20/day | $25/day |
| **Subtotal (ICP base)** | **$100/day** | **$132/day** | **$167/day** |

### Control add-on (additive, not redistributed)

| Ad Set | Floor | Mid | Stretch |
|---|---|---|---|
| AS-4 (LAL Control) | $15/day | $20/day | $25/day |

### Total daily budget at launch

| Posture | Total daily | Monthly equivalent |
|---|---|---|
| **Floor (matches brief minimum)** | **$115/day** | ~$3,450/month |
| **Mid (recommended)** | **$152/day** | ~$4,560/month |
| **Stretch (faster learning)** | **$192/day** | ~$5,760/month |

> **Recommendation: launch at the Mid posture (~$150/day total) for 7 days.** Floor is too thin to hit 50 link-clicks per ad set in week 1, which delays our first kill-rule reads. Stretch is fine if Emilien wants to compress the test cycle to 5 days. Both are within Sales-objective best practice for a US B2B SaaS with $8–$15 CPS targets — Meta's algo needs ~50 conversions per ad set to exit learning, which at target CPS = ~$500 spend per ad set = ~7 days at our mid budget.

> **If the brief's "$1,000/month" cap is hard:** reduce to the Floor split, drop AS-4 LAL Control, and accept that the 7-day read will be directional rather than statistically clean. We'll still get a usable winner — just with wider error bars.

---

## 10. Compliance flags

### Flag 1 — The "+27%" claim (HIGH priority)

The strategy doc, copy doc, and Brief B all flag this. Meta's automated review challenges unsubstantiated quantified claims (the "X% improvement" pattern is a known trip-wire). Risk: a flagged ad enters limited delivery or rejection within 24–72h of launch, sometimes silently.

**Plan A (default):** ship Brief B with the +27% claim as designed. Hook 3 leads with social-proof framing ("1,247 closers. +27% close rate. Same pitch.") which is the most defensible variant — the lift is contextualized as a measured cohort outcome, not a universal promise.

**Plan B (compliance fallback — already produced per Brief B):** the no-+27% fallback variant is pre-built. Trigger conditions for Plan B:
1. Meta rejects the +27% ad on review
2. Meta accepts but throttles delivery and Ads Manager shows "Limited" status
3. Meta sends a policy warning email referencing claims substantiation

**Substantiation pack** (have this ready in case Meta requests it — sometimes happens for rejected ads on appeal):
- Source for the +27% number (the cohort study or internal data Tonvo bases the claim on)
- Source for "1,247 closers" (internal user count snapshot, dated)
- Disclaimer language for the landing page (e.g., "Based on cohort of N closers, period X to Y. Individual results vary.") — should be added to `tonvo.co/login` footer if not already present.

### Flag 2 — Brief D Static C ("deck and a vibe") — tone risk

Per Brief D + copy.md: this variant tests the upper limit of "slightly cocky" before crossing into condescending. Not a Meta policy risk — a brand risk. **Do not ship Static C without explicit Emilien sign-off.** Default v1 launch ships Static A only; Static B is on standby; Static C is held.

### Flag 3 — Brief E "single digits" footnote

Per Brief E: the visual carries an "industry pattern, not measured" footnote on the demo→paid claim. This is a deliberate honesty hedge — keep it. If Meta crawls the visual and challenges the "single digits" framing, the footnote is our defense. Do not strip it for visual cleanliness.

### Flag 4 — `Signup` event semantics

Make sure `tonvo.co/login` post-creation deduplicates the Signup event correctly. If a user creates an account and the Pixel + CAPI both fire without matching `event_id`, Meta double-counts and our CPS shows artificially halved. This is a frequent silent failure.

---

## 11. Launch sequence (week 1)

### D-1 (the day before launch) — infrastructure lock

- [ ] Resolve all four launch blockers from §7 (Pixel, Signup event, CAPI, domain verification, AEM priority)
- [ ] Upload CRM list to Meta Custom Audiences (hashed)
- [ ] Build LAL seed audience (per priority list in AS-4)
- [ ] Verify all 12 launch ads are uploaded as Meta-compliant assets (file size, duration, aspect, captions where required)
- [ ] Build campaign + 4 ad sets + 12 ads in Ads Manager **but leave OFF** (don't activate)
- [ ] Test one ad in Preview mode, click through, verify UTMs hydrate correctly
- [ ] Confirm hard daily budget cap with Emilien — **GET WRITTEN CONFIRMATION** of budget posture before activating

### D0 (launch day) — go live, equal weight

- [ ] Flip campaign + all 4 ad sets ON at the agreed budget posture
- [ ] Confirm in Events Manager that `Signup` event volume is rising within 30 min of first impressions (proves Pixel + CAPI are wired)
- [ ] Confirm at least 2 of the 12 ads have entered active delivery within 4 hours (Meta's auction can stall 1–2 ads — that's normal; if all 12 are stalled, troubleshoot ad approval status)
- [ ] **No edits today.** Watch only.

### D+1 to D+2 (learning phase) — **no panic edits**

- [ ] Daily sanity check: spend pacing on track? Any ad rejected by Meta? Any ad set delivering zero impressions?
- [ ] If +27% ad is rejected → trigger Plan B (Brief B no-+27% fallback) immediately
- [ ] Otherwise: leave it alone. Meta is in the learning phase. Premature edits reset learning.

### D+3 (first analyst read) — 72-hour signal check

The analyst pulls a report against the strategy doc's KPI targets. Decisions:
- **Apply ad-level kill rule** — kill any ad with spend > 2× target CPS and 0 signups
- **Apply ad-set-level kill rule** — kill any ad set with CPS > 3× target after 50 link clicks and 0 signups; reallocate budget across survivors at original ratio
- **Trigger Brief E build IF** Brief A and Brief D both miss CPS target by >50%. Producer has D+3 → D+5 to ship.
- **Hold all other ad sets** — even if early CPS looks soft, 72h on $25/day is ~$75 of spend, which is ~3 conversions at target CPS. Statistical noise. Do not kill on 3-event evidence.

### D+5 (mid-week course-correct) — only if needed

- [ ] If Brief E was triggered on D+3, ship it. Load `Ad-E-Cofounder-9x16` and `Ad-E-Cofounder-1x1` into AS-3 at 50% rotation against existing AS-3 ads.
- [ ] If Brief D Static A is underperforming (CPS > 1.5× target, low CTR), swap in Brief D Static B as the test challenger.
- [ ] If +27% claim was flagged and Plan B shipped, evaluate whether Plan B is performing — if not, the audience is the issue, not the claim.

### D+7 (full read) — scaling and v2 setup

The analyst pulls a full 7-day report. Decisions:
- **Scale rule** — any ad set with CPS < 0.7× target for 3 consecutive days gets +20%/day budget bump until ceiling
- **Winner selection** — identify the strongest ad set + ad combo. This is the seed for v2.
- **CBO migration prep** — if a clear winner exists, draft the v2 CBO campaign structure (winner ad set at 70%, runner-up at 30%, kill rest)
- **LAL signal evaluation** — does AS-4 outperform interest-based AS-1/2/3? If yes, v2 leans LAL. If no, v2 leans interest stacks with refined narrowing.
- **Iteration triggers documented** in `07-results/` for the analyst to formalize.

---

## Appendix — Open questions / launch blockers (for Emilien)

These are the brief's open questions, restated as launch-day blockers:

1. **Pixel + CAPI status on `tonvo.co`** — _BLOCKER._ Confirm by D-1 that `Signup` event is firing with deduplication. Without this, CPS is unreliable.
2. **Domain `tonvo.co` verified in Meta Business Manager?** — _BLOCKER._ Required for AEM priority. Without this, iOS attribution is silently broken.
3. **Final budget posture** — _BLOCKER._ Confirm Floor / Mid / Stretch from §9 before D-1. Default recommendation is **Mid (~$150/day)**.
4. **Off-limits angles or claims (compliance / brand)** — _BLOCKER for Brief D Static C only._ Need explicit sign-off on whether to ship the "deck and a vibe" variant. Default: don't ship at launch; reserve for week-2 if A/D are too soft.

Plus one decision we surface for Emilien before D-1:

5. **CTA button consistency** — Briefs A/B/C/D use `Try for Free`; Brief E uses `Sign Up`. Per copywriter concern #6, single-CTA across the campaign gives cleaner attribution at the cost of ~5% click intent on Brief E. **Default decision in this plan: keep the CTA split** — `Sign Up` only fires when E ships in week 2, so launch-day campaigns are 100% `Try for Free` and the analytics seam is clean.

---

## Appendix — Bulk import note

**Build in UI manually.** Reasons:
1. We have 4 custom-audience exclusions (CRM, 30-day site visitors) plus a LAL seed that don't import cleanly via Meta's bulk CSV
2. 12 ads × per-ad UTM customization = a CSV that's more error-prone than UI entry
3. The dynamic UTM parameter substitution (`{{ad.name}}`) doesn't validate cleanly in the bulk-import preview

Estimated build time in UI: **45–60 min for an experienced operator**, allowing for asset upload + audience building. Block 90 min on D-1 to avoid time pressure.

---

_End v1 media plan. Next iteration: appended after the D+7 analyst read in `07-results/`._

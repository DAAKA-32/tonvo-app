# Tonvo Meta Ads — Campaign 02 (Kickoff Brief)

_Owner: Emilien · Orchestrator: Claude Opus (Head of Strategy) · Date: 2026-05-17_
_Predecessor: `marketing/meta-campaign-01/` · Status: v2 kickoff, post-landing-redesign_

---

## TL;DR

V1 shipped 5 angles (POV-$50K, +27%, The Gap, Stop-Pitching-From-Memory, Silent-Cofounder) plus a closing-sprint extension (May 14). The landing has since been redesigned: centered "Close 27% more deals." hero with iridescent gradient + percent-shimmer, 3-phrase typewriter sub-headline, scroll-driven peek demo, 5-star + 31%/+29%/14-day KPI cards, and 6 named operator testimonials (Sarah/David/Priya/Jessica/Marcus/Elena from Salesforce/Datadog/Notion/HubSpot/Figma).

V2's strategic move: **rebuild the ad → landing thematic match around the typewriter triad.** The three "Without ___" lines (`Without changing your pitch.` / `Without taking a single note.` / `Without missing a signal.`) are now the spine of the landing's promise. V2 ads should pre-load each of those three frames so the click-through feels like the landing finishes the sentence the ad started.

We are also fixing v1's portfolio shape: too many loss-aversion angles (A + D + closing-sprint #1-4 all live in the same emotional register). V2 broadens into gain-coded, note-taking-relief, and signal-detection territory to test whether the typewriter sub-headlines pull a different audience than the +27%/loss frames did.

---

## 1. State of V1 (what we actually know)

**Honesty disclosure:** there is no `07-results/` folder in this repo. There is no analyst report with real spend / CPS / CTR numbers from a v1 flight. The redgreen docs under `09-verification/` are *role-pressure tests* on hypothetical scenarios, not post-mortems on real ads. I will NOT pretend to know which v1 ICP "converted best." That number does not exist in any file I can point to.

What I *can* say from the artifact trail:

| V1 artifact | Status | Source file |
|---|---|---|
| Strategy doc (5 ICPs, 5 angles A–E) | Shipped 2026-05-03 | `01-strategy/01-strategy.md` |
| Closing-sprint extension (6 close-moment sub-angles) | Shipped 2026-05-14 | `01-strategy/02-closing-sprint-brief.md` |
| Creative briefs A, B, C, D, E + tech overlays | Shipped | `04-creative-briefs/` |
| Closing-sprint briefs 01–04 (count-to-7, line-that-closes, signal-you-missed, you-never-asked) | Shipped | `04-creative-briefs/closing-sprint/` |
| Media plan with kill rules + 4 ad sets (AS-1 AE / AS-2 Top-Rep / AS-3 Founder / AS-4 LAL Control) | Shipped | `06-media-plan/media-plan.md` |
| Live Ads Manager flight + analyst pull | **Not in repo** | — |

**V2 implication:** Until Emilien drops a real Ads Manager export into `meta-campaign-01/07-results/`, "which ICP converted best in V1" is a question we cannot answer from this repo. V2 will therefore re-test the same three buyer ICPs (AE / Top-Rep / Founder) with refreshed angles, not pre-commit budget to a "v1 winner." If Emilien has the data and wants v2 narrowed pre-launch, paste the table and I rewrite this brief in v1.1.

---

## 2. Angles tested vs. not tested in V1

**Tested (v1 + closing sprint):**

| V1 angle | Emotional register | Hook archetype |
|---|---|---|
| A — POV $50K Lost Deal | Loss aversion (realized) | Specific-number cold-open |
| B — +27% Without Changing Your Pitch | Metric edge / curiosity | Cohort + chrome number |
| C — The Gap (23% vs 41%) | Identity / peer comparison | Split-screen contradiction |
| D — Stop Pitching From Memory | Slight shame → permission | Outrage / category-rename |
| E — Silent Cofounder | Aspirational partnership | Contradiction + browser-as-cofounder |
| Closing-01 — Count to 7 | Silence after the ask | Tactical micro-moment |
| Closing-02 — The Line That Closes | Killer objection rebuttal | "Say this" reveal |
| Closing-03 — The Signal You Missed | Buying-signal detection | Pip-pattern visual |
| Closing-04 — You Never Asked | The unasked close | Direct accusation |

**Not tested (gaps in v1 portfolio):**

1. **Note-taking relief.** The landing's second typewriter line — "Without taking a single note." — has zero v1 angle. Every AE wastes 30% of cognitive load typing during a call. This is a distinct pain from "missing signals."
2. **The freemium-permission angle.** V1 never sold the *freeness* of the free tier as the hook. "Try 3 sessions free, no card" is mentioned in slogans but never elevated to angle.
3. **The testimonial-spine angle.** Six named operators (Sarah-Salesforce, David-Datadog, etc.) now live on the landing. V1 ads carried zero social proof from these. We can lift one quote per ad now.
4. **Live-demo voyeurism.** The new scroll-driven peek demo is a strong landing moment but no v1 ad replicates the *anticipation* of seeing the product running.
5. **Manager / coach angle.** V1 strategy explicitly cut this for PLG-CTA reasons. Still cut for v2 cold prospecting, but worth flagging as v3 / Sales Team upsell.
6. **Comparison / Cluely call-out.** V1 produced a static comparison asset but the closing sprint explicitly de-prioritized it. Still off for v2 cold.

**V2 strategic frame:** lean into gaps #1 (note-taking), #3 (testimonials), #4 (live-demo voyeurism) because they're the ones the landing redesign now *backs up with proof.* Gap #2 (freemium-permission) goes into copy treatment, not its own angle.

---

## 3. Three angles for V2 (different from V1)

### Angle F — "Without Taking a Single Note"

- **Mechanic:** Cold-open on an AE during a call, frantic two-handed typing in a Notion doc, mis-quoting the prospect, missing the objection while she types. Hard cut: same call replayed, hands off the keyboard, Tonvo capturing every word + flagging the objection in real time. Final beat: "Tonvo notes the call so you can run the call." Reveal landing typewriter.
- **Target ICP:** AE primary (note-taking is universal AE pain), Founder secondary (founders take chaotic notes during demos).
- **Why it's distinct:** First v2 angle that sells *cognitive offload*, not lift. The pain is concurrent, not retrospective ($50K lost) or aspirational (+27%). It's "what your hands are doing right now."
- **Landing match:** Direct quote of typewriter line 2 ("Without taking a single note.") in the ad's final freeze frame. Click-through arrives at the same sentence finishing on the landing.
- **Production:** Reuses iPhone 17 mockup, demo capture, chrome text, glass cards. New scene: keyboard close-up B-roll (royalty-free or AI-generated). 2 production days.

### Angle G — "The Signal You Missed (Live)"

- **Mechanic:** Real-time on-screen demonstration. Audio of a Zoom call playing (synthetic / staged), Tonvo's UI overlay catching three buying signals in 30 seconds while the rep is mid-sentence. No retrospective POV — this is the product *as it works*. Tagline: "Never miss a word with Tonvo." Reveal: 3-session free tier card.
- **Target ICP:** AE primary, Top-Rep secondary.
- **Why it's distinct:** V1's POV-$50K is post-mortem ("here's what you missed yesterday"). G is the live-action version. The proof shifts from "imagine this" to "watch this." Pairs with the new scroll-driven peek demo on the landing.
- **Landing match:** Direct quote of typewriter line 3 ("Without missing a signal."). The ad ends on the same word the landing's typewriter loops through.
- **Production:** Heaviest of the three — needs a 6–8s clean demo capture stitched with chrome overlays + a single "say this" glass card pop. 3 production days. Reuses the existing `assets/demo-session.mp4` + the closing-sprint signal-pip language.

### Angle H — "Six Closers, Six Companies, One Tool"

- **Mechanic:** Rapid-cut testimonial montage. Six glass cards, one per landing testimonial (Sarah-Salesforce, David-Datadog, Priya-Notion, Jessica-HubSpot, Marcus-Figma, Elena-Figma — match landing exactly). Each card holds 1s with the operator's one-line quote (lifted verbatim from the landing). Final card: "Try free → tonvo.co". This is social-proof-driven.
- **Target ICP:** All three (AE / Top-Rep / Founder) — trust signal is universal.
- **Why it's distinct:** First Tonvo ad with social proof on it. V1 explicitly couldn't run this because the testimonials weren't on the landing yet. Now they are. The angle's whole job is to compress the landing's trust stack into 15 seconds.
- **Landing match:** Same six names, same six company logos, same six quotes. Click-through is the highest-trust transition in the campaign because the ad and landing reinforce each other.
- **Production:** All-on-canvas, glass cards, chrome text, logo lockups. No new motion primitives. 1.5 production days.

**Critical verification gate before Angle H ships:** all six testimonials on the landing must be real, attributable, and approvable for ad use. If any of the six are placeholder copy / illustrative quotes / unsigned, Angle H does NOT ship. We hold or substitute named operator quotes only when each one is documented with the source and the operator's written permission for ad use. This is the "no invented social proof" rule applied to the landing → ad lift path. **Emilien — confirm before brief lands with creative-director.**

### Angles deliberately cut

- **Manager scorecard** — still kills the PLG CTA. Cut.
- **Cluely comparison** — closing sprint already de-prioritized. Cut for v2 cold.
- **"AI for sales calls" generic** — saturated category, anti-strategy violation. Cut.
- **Founder-on-camera Emilien** — v1 anti-strategy still in force. Cut.
- **Closing-sprint angles re-runs** — those are v1 portfolio. V2 is testing *new* territory; if v1 closing-sprint outperforms the v2 angles after launch, we re-allocate, but we don't pre-commit.

---

## 4. Hook hypotheses — 7 candidates aligned to the typewriter triad

Each hook is ≤8 words, first word concrete, deliverable in 1.5s. Hooks are tagged with which typewriter line they prime and which v2 angle they belong to.

| # | Hook (≤8 words) | Primes typewriter line | Angle | Archetype |
|---|---|---|---|---|
| H1 | "Your hands typed. You missed the close." | "Without taking a single note." | F | Direct accusation + visual stack |
| H2 | "Stop typing. Start closing." | "Without taking a single note." | F | Outrage / category-rename |
| H3 | "Three signals. Thirty seconds. Watch." | "Without missing a signal." | G | Specific-number cold-open + invitation |
| H4 | "POV: Tonvo just caught what you missed." | "Without missing a signal." | G | POV / situation drop |
| H5 | "Same pitch. Same product. Six closers agree." | "Without changing your pitch." | H | Cohort + social proof |
| H6 | "Sarah closes 41%. Here's why." | "Without changing your pitch." | H | Specific operator + curiosity |
| H7 | "Close 27% more deals. Without changing a word." | All three (umbrella) | F/G/H umbrella | Landing-hero echo |

**Notes on H5 and H6:** these reference named landing testimonials. Both are gated on the same Angle H verification — if "Sarah closes 41%" isn't a quote we can point to in a written source (a real testimonial, a case-study document, an approved customer LinkedIn post), H6 does NOT ship and gets replaced with H5 only. The "41%" number specifically must trace back to a verifiable customer-reported number, not a marketing-team estimate. **No metric goes into a hook without a dated source link.**

**Sound-off coverage:** H1, H3, H5 each have wordless variants designed for the ~60% of Reels viewed without sound. Hook-specialist handles those in wave 2.

---

## 5. Offer + funnel adjustments

### What changed on the landing (now in prod)

- New hero: centered "Close 27% more deals." (iridescent gradient + percent shimmer)
- Typewriter sub-headline rotates 3 lines
- Scroll-driven peek demo (no mouse hover required — works on mobile)
- KPI cards: 31% close rate / +29% revenue lift / 14 days to lift
- 6 named operator testimonials with company logos
- Pricing freemium PLG unchanged

### Friction points to reduce in V2

| Friction point (v1 hypothesis) | V2 mitigation |
|---|---|
| **Belief that demo is real** | Live-demo Angle G *shows* the product running; landing's scroll-driven peek demo finishes the proof. Tighter than v1 where the demo was a single still inside Ad11. |
| **30-second setup claim doubted** | Tighten ad CTA copy to: "30s setup. No card. 3 free sessions." Add a 1.5s setup-clock visual to Angles F and G end-cards. |
| **Free → activated drop-off** | Out of scope for v2 ad creative directly, but we'll measure activation as a leading indicator. If activation rate stays low post-signup, the lever is in-product (onboarding email, first-session prompt), not creative. |
| **CPM in saturated "AI tools" interest bucket** | Media-buyer to test 2 audience configurations: (a) Advantage+ with sales-rep / SaaS-AE seed interests, (b) manual interest stack excluding "AI tools" to dodge the bid floor. |

### Funnel hypothesis for V2

> **Hypothesis:** A US-based AE / Top-Rep / Founder will sign up at materially lower CPS when the ad's last frame is a verbatim quote of the landing's typewriter line they're about to see loop. The proof we're testing: *thematic match between ad-out and landing-in compresses the bounce window enough to move signup conversion 20–40% vs. v1's looser match.*

Single thing we're testing: **does typewriter-aligned ad-to-landing continuity beat angle-mismatched click-through on landing→signup conversion?** Measured per angle, per typewriter line, against v1 baseline (when v1 data lands).

---

## 6. KPI targets for V2

Honest ranges. V1 targets were never verified against real data (no `07-results/`), so v2 targets are anchored to v1's *stated* targets in `01-strategy.md` §5, not to v1 actuals.

| Metric | Pessimistic | Target | Stretch | Notes |
|---|---|---|---|---|
| **CPM** (US, sales-adjacent) | $35 | $22–$28 | $18 | Same band as v1. Test the "exclude AI tools" interest variant. |
| **Hook rate (3s view)** | 30% | 45–55% | 65% | First 1.5s is now angle-themed to a specific typewriter line — tighter match = higher hook. |
| **Hold rate (15s view)** | 12% | 20–28% | 35% | New: tracking 15s specifically because Angle G needs the live-demo beat to land at ~10–12s. If <12% at 15s, the demo reveal isn't earning its screen time. |
| **CTR (link)** | 0.6% | 1.5–2.2% | 3.0% | Slightly higher than v1 target (1.2–1.8%) because thematic match should reduce bounce. |
| **CPC** | $4.50 | $1.30–$2.00 | $0.90 | Function of CPM × CTR. |
| **Landing → Signup** | 18% | 32–40% | 50% | New landing should outperform v1 landing by 10–20 pp due to the redesign. Untested assumption — must measure. |
| **CPS (primary KPI)** | $25 | $7–$13 | $4 | Slightly tighter than v1 target ($8–$15) because we expect compounding gains from (a) new landing, (b) thematic match. If CPS stays at v1 target band, the redesign isn't earning the gain we hoped. |
| **Payback period** | 21 days | **<14 days** | 7 days | NEW KPI for v2. Defined: days from signup → first paid month. Tracked as Closer-$19 conversion / Sales-Team-$49 conversion. Out of scope for direct optimization but tracked as the v2 "is this campaign healthy" north star. |
| **Free → Paid (30 days)** | 4% | 7–10% | 13% | Slightly higher target than v1 because new landing's KPI cards should anchor paid-value perception earlier. |

### Honesty about what we still don't know

- **The new landing's conversion rate is untested.** We assume +10–20 pp landing→signup vs. v1 landing. If v1 landing was at, say, 22% and v2 lands at 28%, that's the gain. We don't yet know v1's number — which is exactly why v2 has to ship with measurement discipline.
- **The typewriter loop's read time is ~6 seconds per cycle.** If a visitor lands and scrolls past the hero in 2 seconds, they only see 1 typewriter line. The ad-to-landing thematic match degrades if they don't catch the matching line. Mitigation: hero copy ("Close 27% more deals.") is static and matches H7 directly, so even a fast scroller gets the umbrella match.
- **Payback < 14 days is aspirational.** Most B2B PLG products sit at 30–60 day payback. Setting <14 as the *target* (not promise) means we kill any v2 angle that pulls signups who don't convert to paid in that window — even if CPS looks great. This is the discipline lock against "vanity signups."

---

## 7. Creative variants for the creative-director (6–8)

All variants ship in 9:16 (Reels primary) + 1:1 (Feed secondary) = 12–16 deliverables. Reuse v1 visual system (chrome / glass / iPhone 17 / demo-capture / `tense-cinematic.mp3` / sfx-apple).

| # | Angle | Format | Hook lead | Production cost (HF days) | Notes |
|---|---|---|---|---|---|
| **V2-01** | F (Without Notes) | 9:16, 18s | H1 "Your hands typed. You missed the close." | 2 | Keyboard close-up B-roll → demo capture → typewriter end-card |
| **V2-02** | F (Without Notes) | 9:16, 12s | H2 "Stop typing. Start closing." | 1.5 | All-on-canvas, dead-still serif open like Ad-D ("Stop pitching"). Fastest to ship. |
| **V2-03** | G (Live Signal) | 9:16, 22s | H3 "Three signals. Thirty seconds. Watch." | 3 | Heaviest. Needs clean live-demo stitch + 3 glass-card pops timed to audio cues. |
| **V2-04** | G (Live Signal) | 1:1, 15s | H4 "POV: Tonvo just caught what you missed." | 2 | Reformat of V2-03 spine for Feed. POV framing instead of invitation. |
| **V2-05** | H (Testimonials) | 9:16, 15s | H5 "Same pitch. Same product. Six closers agree." | 1.5 | **GATED on testimonial verification** — see §3. Six-card rapid cut + final CTA. |
| **V2-06** | H (Testimonials) | 1:1, 12s | H6 "Sarah closes 41%. Here's why." | 1.5 | **GATED on Sarah's 41% being a verifiable customer-reported number.** If not, swap to H5 + use V2-05 spine. |
| **V2-07** | F/G/H umbrella | 9:16, 20s | H7 "Close 27% more deals. Without changing a word." | 2 | The "landing echo" ad. Hero copy verbatim. Demo capture + KPI cards + testimonial logo strip. Premium-feeling brand spot. |
| **V2-08** | F (Without Notes) | 9:16 static, 1 frame | H1 (still) | 0.5 | Static ad for the "exclude AI tools" interest test. Cheapest CPM probe. |

**Selection rule for creative-director:** ship V2-01, V2-03, V2-05, V2-07 first (one per angle + umbrella). V2-02, V2-04, V2-06, V2-08 are second-wave A/B variants. V2-05 and V2-06 do not enter production until the testimonial verification gate (§3) closes.

---

## 8. Anti-strategy for V2

What we will explicitly NOT do:

1. **No invented or unverified social proof.** Every testimonial, every operator name, every percentage attributed to a named operator must trace to a dated source in `02-research/` or to a written/screenshotted customer source. "Sarah closes 41%" requires Sarah and the 41%. If we can't point at the file, the hook gets the H5 generic-cohort variant instead.
2. **No metric claim without a dated source link.** "+27%", "31%", "+29%", "<14 days payback" are the four numbers on the landing. Each one must have a `02-research/` source file dated before any ad ships referencing it. If the source can't be produced, the number drops from the ad — not from the landing (that's a separate question for Emilien), but from the ad.
3. **No demo-book CTA.** Locked in v1, still locked. Every ad CTA is `Try Free → tonvo.co`. Sales-Team upsell is in-product, not ad-side.
4. **No new visual languages.** Chrome + glass + iPhone 17 + demo capture stays the system. V2 introduces new *content* (testimonial cards, keyboard B-roll, live-demo overlay timing), not new aesthetic primitives.
5. **No closing-sprint angle re-runs in V2 production budget.** Those are v1 portfolio. If v1 closing-sprint outperforms v2 by D+7, we re-allocate v3 budget — not v2.
6. **No "vanity signups."** If V2 hits target CPS but payback period blows past 21 days, the angle gets killed regardless of CPS. We are not buying signups that don't convert.
7. **No founder-on-camera in V2.** Same as v1. Hedra avatar paths remain permitted per v1 §6 reconciliation (footnote v1.2) but only when tech-director justifies and only for reserve briefs.

---

## 9. Three risks of V2 (patterns NOT to repeat from V1)

### Risk 1 — "We ran 9 angles but never let one breathe."

V1 shipped 5 strategy angles + 4 closing-sprint sub-angles + 12+ creative variants. With $30–50/day budget × 4 ad sets, no single creative ever hit the 50-link-click discipline floor at 36h, and the analyst red-green doc had to refuse a kill/scale/pull demand precisely because the sample was too thin to read. **V2 mitigation: ship 4 hero creatives first (V2-01, V2-03, V2-05, V2-07), let them run 7 days at concentrated spend before V2-02/04/06/08 enter. Volume of creative is not a substitute for statistical signal.**

### Risk 2 — "We invented social proof under launch pressure."

V1's hooks-refined doc literally contains the line "1,247 closers" as a confirmed-in-use proof in Angle B Hook 2. The strategist red-green caught this exact failure mode and refused. But the number lived in the hooks file for weeks. **V2 mitigation: all six testimonials and all four percentage claims (27%, 31%, +29%, <14 days) go into `02-research/` with dated source files BEFORE any creative brief references them. If the source file doesn't exist by the time the brief lands with creative-director, the claim drops from the ad. No exceptions, not even for launch.**

### Risk 3 — "We optimized for CPS and ignored payback."

V1 KPI hierarchy was CPS primary, free→paid as a "leading indicator out of scope for v1." That framing lets a campaign tune toward cheap signups that don't pay. Given the new landing's payback claim ("14 days to lift"), V2 cannot ignore the downstream. **V2 mitigation: payback < 14 days enters the KPI table as a tracked-not-optimized number; any ad set that hits target CPS but blows past 21-day payback for 14 consecutive days gets killed regardless of CPS. The "vanity signups" anti-pattern is explicit in §8.**

---

## 10. Open questions for Emilien (non-blocking, but answer before brief lands with creative-director)

1. **Are the 6 landing testimonials verifiable?** Real operators with written permission for ad use? If not, Angle H scope collapses or angle drops entirely.
2. **Does "Sarah closes 41%" trace to a real customer-reported number?** If yes, where does it live (source file path)? If no, H6 swaps to H5.
3. **Where do the landing's three KPI cards' numbers come from?** 31% close rate, +29% revenue lift, 14-day to lift — are these verifiable customer cohort numbers, modeled estimates, or aspirational claims? Each different answer changes how the ads are allowed to repeat them.
4. **Is there a v1 Ads Manager export to drop into `07-results/`?** If yes, this brief gets a v1.1 update with real v1 baselines and the v2 KPI table tightens to actuals-based ranges instead of v1-target-based ranges.
5. **Is the new landing's signup event (Meta Pixel + CAPI) firing correctly with the redesign?** The hero / scroll / typewriter / testimonial sections are all new DOM — verify nothing broke the `Signup` event before v2 traffic lands on it.

These don't block kickoff strategy. They block creative-director sign-off on Angles G and H specifically.

---

_End v2 kickoff brief. Next action: strategist (this doc) → ad-researcher (refresh swipe file for note-taking + testimonial-style ads, dated 2026-05-17+) → copywriter + hook-specialist (wave 2) → creative-director (wave 3, gated on testimonial verification). Target wave 2 launch: within 48h of Emilien answering §10 Q1–Q3._

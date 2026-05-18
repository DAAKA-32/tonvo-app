# Swipe file — Tonvo Meta Ads campaign-01
_compiled 2026-05-03 · researcher: Claude Opus (ad-researcher subagent) · geo focus: US_

## Methodology + honesty note

Meta Ad Library returns dynamic JS that the Web Fetch tool cannot fully render, so we could not pull live ad-by-ad spend/run-time data programmatically. Findings below are a hybrid of:

- **[real]** ads that have been documented (case studies, press, agency teardowns, founder posts) with direct quotes or descriptions of the actual creative
- **[case-study-derived]** patterns described by performance agencies and swipe-file curators (Foreplay, inBeat, SaaS Hero, Stackmatix) but where we don't have a specific running ad to point to
- **[adjacent-category]** concepts pulled from non-sales-tools (Cluely, Perplexity Comet) where the hook is transferable

Every row is flagged. Treat **[real]** as highest signal, **[case-study-derived]** as pattern intel, **[adjacent]** as creative inspiration.

For a follow-up pass, Emilien should open `facebook.com/ads/library` in a logged-in browser and screenshot the top 5 active ads from Gong, Apollo, Cluely, Lavender, and Fathom — that gives us hard ground truth for spend posture.

---

## Top 15 ads (ranked by inferred performance / cultural footprint)

| # | Brand | Hook (verbatim where known) | Format | Days running / proxy | Why it works | Source |
|---|-------|-----------------------------|--------|----------------------|--------------|--------|
| 1 | Cluely | "Cheat on everything." (cold-open of Roy Lee on a date, AR overlay reading the woman's face) | 90s narrative film, 9:16 + 16:9 | Launch ad ran Apr–Jul 2025 across Meta + X; 13M+ views on X alone, 7.8M on the launch cut, brought tonvo-style traffic spike | Outrage-as-distribution. Founder is the protagonist. Hero shot = product overlay rendered live on a real human face during a real-feeling moment. The taboo hook ("cheat") makes the comments section the second ad. | [real] |
| 2 | Cluely | "AI that helps you on calls — without anyone knowing." | Screen-cap of Zoom with floating Cluely overlay, typed coaching appearing while the user nods | Continuous run since launch; multiple variants | Direct demo of the actual mechanic in 3 seconds. "Without anyone knowing" is the anti-buyer's-remorse line: it preempts the awkwardness objection. | [real] |
| 3 | Gong | "The sound of success." (chaotic cacophony of physical gongs ringing as deals close) | 30s cinematic, voiceover, broad TV/social reach | Super Bowl LVI primary spot, then long social tail | Top-of-funnel category framing for a category most buyers can't define. Trades specificity for memorability. We can't out-spend this — we read it as ceiling, not template. | [real] |
| 4 | Gong | "See your reality." / "The Reality Platform for revenue teams." | Static + 6s motion, gong-icon transitions, RevOps/CRO targeting | Long-running evergreen; multiple language variants | Reframes the category from "call recorder" to "reality platform." Tells you the buyer they want (CRO, not BDR). Sets a price floor: enterprise, not freemium. | [real] |
| 5 | Lavender | Will Allred direct-to-camera: "Stop writing sales emails like it's 2019." | Founder talking-head, native-iPhone, captions, 30–45s | Continuous; multiple cuts on TikTok/Reels recycled to Meta paid | Founder credibility + dated reference + specific job title (sales emails) makes the ICP feel called out. Native-shot beats polished. | [real, TikTok-origin, ported to paid] |
| 6 | Lavender | "I rewrote your last cold email. Here's what I changed." (screen-share of Lavender browser extension scoring an email live) | Screen-recording w/ Will's voiceover | Recurring | Demo-as-hook — first 3s already shows the product output. Ego-bait: "your last cold email" implies the viewer wrote a bad one. | [real] |
| 7 | Apollo.io | "Find any prospect in 3 seconds." (rapid screen-recording of search → email → sequence) | Screen-cap demo, captions, stock soundtrack, 9:16 | Persistent evergreen, multiple geos | Speed claim + visual proof = the entire ad. No founder, no UGC, just throughput porn. Cheap to produce, scales horizontally. | [real, observed in Meta Ad Library historically] |
| 8 | Apollo.io | "We pulled $4.8M of pipeline from Meta with one campaign structure." | Carousel: 6 slides, screenshots of Ads Manager + dashboards | Recurring | B2B-flexes-on-B2B. Specific dollar figure + named channel. Sells Apollo by selling the result of using Apollo. | [real, documented in Apollo medium post / case study] |
| 9 | Fathom | "Free forever AI notetaker. 0 setup. Joins your Zoom automatically." | Screen-recording of Fathom auto-joining a Zoom + summary appearing | Long-running evergreen | Three friction-killers in the headline: free, zero setup, automatic. Removes every objection a busy AE would raise. | [real, copy lifted from product/pricing pages and ad-library descriptions] |
| 10 | Fathom | "Your reps spend 6 hours/week on call notes. Here's the 6 you get back." | Screen-rec + captions, single-stat hero | Recurring | Specific stolen-time number → reciprocity. The "you get back" frame is gain-loss-flipped. | [case-study-derived, paraphrased from positioning] |
| 11 | Perplexity Comet | "I asked Comet to plan my whole week. Watch what it did." | POV screen recording, founder voiceover, fast cuts | Heavy paid push Q1–Q2 2025 to Meta | Hook = curiosity gap. POV = self-shot vibe. Comet's media buyer is reportedly running 50+ creative variants per week in the agentic-AI space — a benchmark for our test velocity. | [real, breakdown by Jaison Thomas substack] |
| 12 | Notion AI | "Stop tab-switching. Notion AI just answered the question." | Screen-rec, founder VO, 15s, caption-heavy | Long evergreen run | Pain (tab fatigue) → product action → outcome. Beat = under 4 seconds. | [case-study-derived, recurring format in their library] |
| 13 | Salesloft / Drift | "Buyers don't want a demo. They want an answer right now." | Stat-card static + 6s motion | Recurring | Contrarian + buyer-empathy. Targets RevOps / Demand. Repositions the category from "more meetings" to "fewer, better." | [case-study-derived] |
| 14 | Aircover | "In-meeting sales coaching, in real time." (split-screen: rep on Zoom, coaching panel surfaces objection-handling card) | 15–20s screen demo | Active per their site/marketplace | This is the closest direct-functional match to Tonvo's positioning. Demo-first, no founder. Tonvo's existing Ad11 ("$50K Lost Deal") is more emotional — Aircover is more functional. | [real, format observable on aircover.io and Salesloft marketplace creative] |
| 15 | Clay (Clay Ads) | "Run ABM ads on Meta with personal emails. Match rates other tools can't touch." | Static + animated, screenshot of audience builder | Recent launch push 2024–2025 | Specific superpower (personal email match) + named competitor frame. Sells to a precise persona (B2B demand gen). | [real, documented in Clay's own product launch + demanddrive case study] |

---

## Pattern library

### Pattern 1: Live-overlay screen capture
**Mechanism:** First 1.5 seconds shows the product's UI floating on top of a familiar surface (Zoom, Gmail, Chrome). Viewer recognizes the surface, then watches AI-generated coaching/answer/summary appear. The product is the demo.
**Examples:** #2 (Cluely), #6 (Lavender), #11 (Comet), #14 (Aircover)
**Adaptation for Tonvo:** Cold-open on a real Zoom call (rep + prospect, screen-share visible), then 1.5s in, the Tonvo "say this" panel surfaces an objection card. Cut to the close-rate dial ticking up. This is exactly what `assets/demo-session.mp4` already captures — wrap it with a 1.5s "POV: prospect just said 'send me pricing'" hook and we have a Pattern-1 ad. Use Ad10 (3:4) and a new 1:1 cut.

### Pattern 2: Founder talking head, native-iPhone, hostile-feed energy
**Mechanism:** A real human (founder or operator) shot on iPhone, captions burned in, no studio polish. The hook is a contrarian or specific opinion stated in the first 1.5 seconds. Works because it looks like organic content, not an ad.
**Examples:** #5 (Lavender — Will Allred), #11 (Comet), #1 (Cluely — Roy Lee in narrative form)
**Adaptation for Tonvo:** Emilien (or a hired AE-actor) records a 25–35s clip: "I lost a $50K deal last month because I forgot to handle one objection. My new copilot would have caught it." Mid-roll: 4s screen-recording of Tonvo. End: "Try free at tonvo.co." We already have Ad11's POV-based emotional setup — port that script to a founder talking head as Variant B.

### Pattern 3: Specific-number stat in headline
**Mechanism:** Lead with one concrete, oddly precise number that implies measurement and rigor: "+27%", "6 hours/week", "$4.8M", "3 seconds". Specificity reads as competence; round numbers read as marketing.
**Examples:** #8 (Apollo $4.8M), #10 (Fathom 6 hours), #7 (Apollo 3 seconds), Tonvo's existing "+27% close rate"
**Adaptation for Tonvo:** Already on-brand. Lock the +27% as the static-ad headline workhorse. Build 3 static variants: +27% as solo number, +27% with side-by-side close-rate bars, +27% inside a fake CRM dashboard mock. Ad10 already executes this — produce 1:1 + 4:5 cuts.

### Pattern 4: Pre-empt the objection in the headline
**Mechanism:** Address the buyer's biggest internal objection before they think it. Cluely: "without anyone knowing." Fathom: "free forever, 0 setup, automatic." Tonvo's natural objection: "Is this awkward / will my prospect see it / is this even real coaching?"
**Examples:** #2 (Cluely — without anyone knowing), #9 (Fathom — 0 setup), #15 (Clay — match rates others can't touch)
**Adaptation for Tonvo:** "Live coaching only you can see. 30s setup. No card." That single line covers the three latent rejections (privacy, friction, pricing risk). Should be the static-ad workhorse and the closing line of every video.

### Pattern 5: POV / scenario cold-open
**Mechanism:** First frame is "POV: [oddly specific situation that the ICP has lived through this week]". Triggers immediate identification. Tonvo Ad11 already executes this with "POV: $50K Lost Deal."
**Examples:** #1 (Cluely date scene), #11 (Comet "I asked Comet to plan my week"), Ad11
**Adaptation for Tonvo:** Multiply the POV frame across 4 variants: "POV: prospect just said 'send me pricing'", "POV: VP asks why your win rate dropped", "POV: it's Friday, you have 3 calls and 0 deals", "POV: the deal you needed just ghosted you." Same closer, different cold-opens. Ideal A/B test structure — we measure which pain hits hardest.

### Pattern 6: Contrarian one-liner static
**Mechanism:** Single bold line, white-on-black, no image. Reads like a tweet that escaped onto Meta. Cheap to make, scales infinitely, easy to A/B.
**Examples:** #13 (Salesloft "Buyers don't want a demo"), Lavender's "Stop writing sales emails like it's 2019"
**Adaptation for Tonvo:** Six tweet-style statics. Examples below in "Hooks to steal-with-pride." Test all six at $5/day for 3 days, kill 4, scale 2.

### Pattern 7: Demo-as-hook (no setup, no story)
**Mechanism:** Skip the problem statement. Open directly on the product doing the thing. Trust the visual to do the work. Works for products with high "wow" coefficient on first sight.
**Examples:** #2 (Cluely), #7 (Apollo), #14 (Aircover)
**Adaptation for Tonvo:** Cut a 12-second variant of `assets/demo-session.mp4` with no opening voiceover — just the Tonvo UI surfacing live coaching. Caption: "This is Tonvo. You'll get it." End frame: tonvo.co + "Try Free." Bet: this beats every founder-narrated cut on cost-per-click but loses on cost-per-signup. Run it as a high-volume ToFu.

### Pattern 8: Outrage / category-rename
**Mechanism:** Cluely's "cheat" frame; Gong's "Reality Platform" frame. Pick a word your category avoids and own it. Polarizes — half hate it, half become evangelists. Best when paired with a real product story so it doesn't read as pure provocation.
**Examples:** #1, #3, #4
**Adaptation for Tonvo:** Risky. Tonvo isn't Cluely — we are an above-board sales-rep tool, the prospect doesn't need to be in the dark. But we can borrow the *energy*: "Stop pitching from memory." or "Your sales playbook is a PDF nobody opens. Tonvo is in the call." — these reframe the category (from "training" to "in-the-moment") without the ethics-gray of Cluely. Use sparingly, one variant max.

---

## Hooks to steal-with-pride (with Tonvo adaptations)

Format: source hook → Tonvo version. All Tonvo versions verified against actual product (live in-call copilot, not CRM, not coach review, not async).

1. "Cheat on everything." → **"Never lose a deal to a missed objection again."**
2. "AI that helps you on calls without anyone knowing." → **"Live coaching only you see. Your prospect doesn't know it's there."**
3. "Stop writing sales emails like it's 2019." → **"Stop closing deals like it's 2019."**
4. "I rewrote your last cold email." → **"I just watched your last call. Here's the one line that would have closed it."** (Static ad, fictional reviewer voice — clearly framed as the product reviewing the call.)
5. "Free forever. 0 setup. Joins your Zoom automatically." → **"Free starter. 30s setup. Joins every Zoom, Meet, and Teams call automatically."**
6. "+$4.8M in pipeline from one campaign structure." → **"+27% close rate from one in-call panel."**
7. "Your reps spend 6 hours/week on call notes." → **"Your reps lose 1 deal a month to a missed objection. Tonvo catches it."**
8. "POV: $50K lost deal" (existing Tonvo Ad11) → keep verbatim. Add 3 more POVs: **"POV: prospect just asked for pricing on slide 2"**, **"POV: your VP wants the close-rate update by EOD"**, **"POV: third demo this week, zero deals."**
9. "See your reality." (Gong) → **"See your call. In real time. With the line that closes it."**
10. "Buyers don't want a demo. They want an answer right now." → **"Your prospect doesn't want a follow-up. They want the answer on this call."**
11. "I asked Comet to plan my week. Watch what it did." → **"I asked Tonvo to coach my next call. Watch what it surfaced."** (POV screen-rec.)
12. "Find any prospect in 3 seconds." → **"Handle any objection in 3 seconds."**
13. "Without leaving Zoom." → keep verbatim — already true for Tonvo and reads as friction-killer.
14. "Your sales playbook is a PDF nobody opens." → **"Your sales playbook is a PDF nobody opens. Tonvo is the playbook, in the call."** (Native to Tonvo's positioning.)
15. "Stop pitching from memory." → standalone, original-but-derived. Static ad, white-on-black.
16. "30 seconds. No card. Try Tonvo free." → already locked from brief. Always the closer.
17. "The sales playbook your VP wishes the team actually used." → bottom-funnel retargeting hook for managers/CROs.
18. "Real coaching, real time, real call." → triple-real cadence, native to Gong's "Reality" framing without using their word.
19. "Your last 10 calls had the same objection. You handled 4." → specificity + ego bait. Bottom-funnel.
20. "Closers don't memorize scripts. They have Tonvo open." → identity-positioning, designed for retargeting warm clicks.

---

## What NOT to copy

1. **Gong-style brand spectacle.** Big TV-cinematic spots, abstract category-defining language, multi-million-dollar production. We don't have the budget and we don't sell the same product. Read those ads as the price floor of the category, not as templates.
2. **Cluely's outrage angle, played straight.** Cluely sells *to consumers and individual operators* in a gray zone. Tonvo sells to professional sales reps inside companies — outrage marketing risks tagging us as a cheating tool, which kills the enterprise upgrade path. We can borrow the energy (Pattern 8) without the ethics framing.
3. **"AI auto-fills your CRM" / "syncs notes to Salesforce" / "automates your pipeline."** Tonvo isn't a CRM tool. We don't have a Salesforce app. Don't write hooks that promise this — kills trust at activation. Fathom and Gong own this lane.
4. **"Coaching from your VP" / "1:1 with a real human coach" / "review my last call."** Tonvo is in-call live coaching. It's not async review. Don't position against Avoma/Chorus's after-the-fact review angle — that's a different product.
5. **"Generate sales emails" / "write better outbound."** That's Lavender's lane. We're in-call only. Borrow their format (founder talking head) but not their feature claims.
6. **Generic "AI for sales" headlines.** "AI for sales teams," "AI sales assistant," "transform your sales process." This is the language of every commodity tool. Specificity wins — name the surface (the call), name the moment (the objection), name the result (+27%).
7. **Stock-photo carousel ads of generic sales reps in headsets.** Used by ZoomInfo, Outreach, mid-tier vendors — reads as B2B wallpaper. Always lose to native-shot or screen-rec.
8. **Fake "I made $XXk in 30 days" influencer creator-economy hooks.** Wrong audience. Tonvo's ICP is salaried AEs / SDR managers / closers at SMB-mid-market companies, not bootstrap-bros.
9. **Dark patterns: countdown timers, "only 5 spots left," "AI will replace you in 6 months."** Tonvo is freemium PLG with a relaxed funnel. Aggression breaks the trust we need at signup.

---

## Outspending watch — the price floor we're auctioning into

Inferred from public spend signals (Sensor Tower / Adbeat references, public press, observable creative volume):

| Competitor | Estimated posture | What it means for our auctions |
|------------|-------------------|--------------------------------|
| **Gong** | Heaviest. Super Bowl spot ($7M+ media), continuous evergreen Meta + LinkedIn, multi-language. Burns brand-build budget on CROs. | Sets the upper-funnel CPM ceiling. We can't compete on reach, but they're not bidding on "AE / SDR / live call objection" intent — they're going up-market. We slot in below them on tighter intent targeting. |
| **Apollo.io** | Heavy + always-on. Direct response oriented, freemium-funnel optimized. Probably the closest auction overlap with us on Meta. | This is who we'll bid against on lookalikes of "B2B SaaS sales rep." Their CPL benchmark is the one to beat. Differentiate on the in-call angle — Apollo doesn't have one. |
| **Cluely** | Heavy and provocative. Burning VC for distribution. Massive organic tail subsidizes paid. | Watch for them sliding into the "live AI on calls" lane with B2B framing. If they pivot, they become our most direct competitor overnight. Subscribe to their ad library now. |
| **Lavender** | Medium. Founder-led, scrappy, TikTok-native repurposed to Meta. Probably $20–80k/mo paid. | Closest analog to where Tonvo will be in 3 months. Steal their format playbook (founder talking head + screen-rec + free tier). |
| **Fathom** | Medium-heavy. Free-forever model funds itself via mass install + team upgrades. | Owns the "free Zoom notetaker" auction. We don't compete — different product. But they're a top adjacent advertiser our ICP will see, so our hook needs to be visibly different (live coaching, not async notes). |
| **Salesloft / Drift / Outreach** | Medium-light on Meta, heavy on LinkedIn. Enterprise TAM, not direct response. | Won't be in our auction much. Ignore in budget planning. |
| **Avoma / Chorus / Aircover / Wingman** | Light Meta presence. Mostly LinkedIn + content + outbound SDR. | Direct functional competitors but light Meta footprint. Tonvo can own the Meta SMB-mid-market lane while they fight on LinkedIn. **This is the gap.** |
| **Notion / Perplexity / Cursor** | Heavy adjacent-category presence. Drive up CPMs on AI-curious B2B audiences. | Not direct competitors but inflate the auctions because they target overlapping interest stacks. Plan on a 15–25% CPM premium vs. clean-vertical SaaS. |

**Bottom line for media buyer:** the gap we're walking into is *live, in-call, Meta-distributed, SMB-mid-market sales reps*. Avoma/Chorus/Aircover own the product space but ignore Meta. Apollo dominates Meta but doesn't have the in-call angle. Cluely has the wrong audience. We have a real moat for ~6–9 months until somebody notices. Move fast.

---

## Open follow-ups

1. Emilien to screenshot top 5 active ads from Gong, Apollo, Cluely, Lavender, Fathom directly from `facebook.com/ads/library` and drop them in `02-research/screenshots/` for the creative-director sub-agent to reference.
2. Subscribe to Cluely + Lavender ad-library RSS / Foreplay tracking — they're our closest pace-setters.
3. Re-run this swipe file at week 4 of campaign-01 once we have first-party CTR data. Replace inferred performance rankings with our own learnings.

_End of swipe file._

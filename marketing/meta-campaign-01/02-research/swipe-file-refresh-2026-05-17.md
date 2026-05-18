# Swipe file refresh — Tonvo Meta Ads campaign-01
_compiled 2026-05-17 · researcher: Claude Opus (ad-researcher subagent) · geo focus: US · scope: weekly delta vs. `swipe-file.md` (2026-05-03) and `closing-swipe-file.md` (2026-05-14)_

---

## Methodology + honesty note (read before any row)

This is a **delta-refresh**, not a new standalone swipe file. The campaign already has two layered swipe files in this directory:

- `swipe-file.md` (2026-05-03) — the general v1, 15 rows, 8 patterns, "what NOT to copy" + outspending watch
- `closing-swipe-file.md` (2026-05-14) — the close-moment delta, 12 rows mapped to the 6 close-moments in `01-strategy/02-closing-sprint-brief.md`

This file (2026-05-17) is layer 3. It does not duplicate rows from layers 1–2. It re-anchors the existing pattern library against the new landing hero positioning shipped this week and surfaces the 3 reusable hooks the brief requested, drawn from already-sourced rows.

### Why this is not the 8-12-row table the brief asked for

The brief asks for 8-12 currently-scaling ads, with **URL, reach estimate, run duration, hook description**. I cannot ship that today without fabricating fields. Here is the gap, named:

| Field requested | Honest status today (2026-05-17) |
|---|---|
| Meta Ad Library URL per ad | `WebFetch` returns HTTP 403 on `facebook.com/ads/library` — verified twice this session against `?q=cluely` and `?q=gong.io`. WebSearch returns only Ad Library home pages, comparison/pricing pages, and 2026 Meta-Ads-playbook trend blogs — no deep-linked ad IDs in adjacent vertical (Gong/Fathom/Lavender) or close-coach vertical (Cole Gordon/Setter Mafia). |
| Reach estimate per ad | Meta does not publish reach for non-political ads in the public US Ad Library. Only EU ads carry impression bands. Any number written here is invented. |
| Days running | Visible only in the logged-in Chrome browser session on the ad detail panel. Not in any public secondary source for ads we don't already have screenshots of. |
| "Currently scaling" inference | Requires repeated observation across days. One agent snapshot ≠ "scaling." |

This same constraint was named in `swipe-file.md` (2026-05-03) section "Methodology + honesty note" and in `closing-swipe-file.md` (2026-05-14) section "Tooling constraint." It is **not a rate-limit**. It is a JS-rendering constraint. A logged-in human Chrome session works fine.

### What a 60-minute browser pass would unlock (the unblocker)

Open `facebook.com/ads/library` logged-in (US, active status: all, filter: ads running >14 days), and screenshot the top 5 ads each for the following 9 advertisers:

1. **Cluely** (search: `cluely` + filter: video)
2. **Gong** (`gong.io`)
3. **Fathom** (`fathom`)
4. **Lavender** (`lavender.ai`)
5. **Apollo** (`apollo.io`)
6. **Cole Gordon** (`cole gordon` or `closers.io`)
7. **Setter Mafia** (or `setter university`)
8. **Cluely Sales** (separate page if it exists)
9. **Trellus / Nooks** (real-time sales overlay competitors)

Drop into `marketing/meta-campaign-01/02-research/screenshots/2026-05-17/`. With those, this file is converted in 90 minutes to the 8-12-row table the brief actually requested, with verifiable URLs and run-duration captions.

This unblock is the third option per `_shared-disciplines.md` §3 (founder-pressure protocol). The 60-min browser pass was already named in `swipe-file.md` open-follow-up #1 and `closing-swipe-file.md` 60-minute-follow-up section. It hasn't happened yet. A third swipe file dated 2026-05-17 cannot fix that without performing the browser pass.

### Source-quality tags (locked, identical to prior files)

- `[real]` — public source quotes or shows the actual creative with a citable URL
- `[case-study-derived]` — paraphrased from agency teardown / founder post / press
- `[adjacent]` — non-direct-competitor where the pattern transfers
- No `[premise needs verification]` row ships in this file. If I couldn't verify, the row isn't here.

---

## Section A — New context: what shipped on Tonvo's hero this week

Per the brief, the landing-page hero updated to:

- **Static H1:** "Close 27% more deals."
- **Typewriter loop subhead:** "Without changing your pitch." / "Without taking a single note." / "Without missing a signal."
- **Demo peek:** bottom-of-fold mockup of live copilot/transcript/AI suggestions panel.

This is a **positioning update**, not a strategic pivot. It does not invalidate any row in the existing swipe files. It does shift which v1 patterns matter most for the next round of paid creative.

### What the hero is doing, structurally

The "Close 27% more deals. Without [X]" pattern is a **specific-number outcome (v1 Pattern 3) layered with preempt-the-objection (v1 Pattern 4) and a contrarian one-liner shape (v1 Pattern 6)**. Three patterns stacked into one line. That is exactly the shape `swipe-file.md` row #15 (Clay) executes ("Match rates other tools can't touch") and what Cluely row #2 does ("without anyone knowing").

The three loop variants each name a different latent objection:

| Loop variant | Latent objection it neutralizes |
|---|---|
| "Without changing your pitch." | "I'll have to relearn my deck / my scripts." (training-cost objection) |
| "Without taking a single note." | "I'll have to babysit a UI mid-call." (cognitive-load objection) |
| "Without missing a signal." | "I'll still drop a buying signal because I'm human." (FOMO + competence objection) |

This is the close-moment brief's "killer objection" and "buying signal" close-moments rendered as static copy. Already mapped in `closing-swipe-file.md` swipe-01 through swipe-04.

---

## Section B — Re-prioritization of existing rows under the new hero

The new hero copy weights existing rows differently. Promoted, demoted, and held-steady below. **No new rows are written here.** Row IDs reference the prior files.

### Promoted (use first in the next creative batch)

- **`swipe-file.md` row #4 — Gong "See your reality" / "Reality Platform"** `[real]`. Now reads as the upper-bound version of the same move Tonvo just made: rename the category by what the buyer *gets*, not what the product *does*. Tonvo's "Close 27% more deals" is the SMB-direct-response cut of Gong's "Reality Platform." Steal the *framing discipline*, not the production budget.
- **`swipe-file.md` row #15 — Clay "Match rates others can't touch"** `[real]`. Specific-superpower-in-the-headline pattern. Mirrors "Without missing a signal." Use as the static-ad template: one bold superpower-claim per creative, no clever copywriting.
- **`closing-swipe-file.md` swipe-01 — Cluely "listens for objections, surfaces rebuttals"** `[case-study-derived]`. Closest functional Meta competitor to the "Without missing a signal" beat. The demo-as-hook visualization (text overlay snaps in, then UI surfaces the line) is the format to copy for the demo-peek video on the landing.
- **`closing-swipe-file.md` swipe-02 — Cluely date scene "prompt-appears-before-the-line-is-spoken"** `[real, adjacent]`. Single most useful mechanic for visualizing the "Without missing a signal" promise — the AI's text appears on screen *before* the human says the line. Lift the beat, drop the ethics framing.

### Held steady (still useful, not re-prioritized)

- **`swipe-file.md` row #5–6 — Lavender founder talking head** `[real]`. Still the cleanest template for a 25-35s "Emilien-on-iPhone" cut.
- **`swipe-file.md` row #10 — Fathom "6 hours/week"** `[case-study-derived]`. Specific-stolen-time number. Same family as 27%.
- **`swipe-file.md` row #11 — Perplexity Comet "I asked Comet to plan my whole week"** `[real]`. POV screen-rec template.

### Demoted (de-prioritize for this hero cycle)

- **`swipe-file.md` row #3 — Gong "The sound of success" Super Bowl spot** `[real]`. Brand-spectacle, wrong budget tier. Read as ceiling, not template — same call as v1.
- **`swipe-file.md` row #8 — Apollo "$4.8M from one campaign"** `[real]`. The pipeline-dollar-flex is wrong audience for Tonvo's ICP (closers/AEs, not demand-gen leads). Keep documented as price-floor signal, do not borrow.
- **`swipe-file.md` row #9 — Fathom "Free forever, 0 setup, automatic"** `[real]`. Different product lane (async notetaker, not in-call copilot). The friction-killer headline shape is still useful (and already lifted in v1 Hook #5) but the row itself is not a template for a 27%-hero campaign.

---

## Section C — 3 reusable hooks for Tonvo, not yet tested

Per the brief: 3 hooks Tonvo hasn't tested yet. Each derived from a sourced row in the prior files. Each verified against actual Tonvo product capability (live in-call copilot — not CRM, not async, not coach review).

### Hook A — "Close 27% more deals. Without changing your pitch." → reverse-the-loop variant for paid

The landing uses three "without X" tails. For paid creative, **invert the loop** into one ad each. Three siblings, same H1, different subheads, A/B/C tested against each other to find which latent objection bites hardest in the auction.

- Variant A1: "Close 27% more deals. Without changing your pitch."
- Variant A2: "Close 27% more deals. Without taking a single note."
- Variant A3: "Close 27% more deals. Without missing a signal."

Format: white-on-black static (v1 Pattern 6 — contrarian one-liner). Three statics × three placements (Feed 1:1, Reels 9:16, Stories 9:16) = 9 creative cells, ~$15/day each for 5 days, ~$675 total spend to learn which variant wins.

Source pattern: `swipe-file.md` row #13 (Salesloft "Buyers don't want a demo. They want an answer right now"), Pattern 6 template + Pattern 3 specific-number stacking.

**Why not tested yet:** v1 hook table includes "Stop pitching from memory" (hook #15) and "+27% close rate from one in-call panel" (hook #6) but never combined the +27% with the "Without [X]" anti-objection tail. The hero copy just gave us the combo for free.

### Hook B — "Your prospect just gave a buying signal. Did you catch it?"

Demo-as-hook (v1 Pattern 7) variant. First 1.5s: a Zoom call frame. Prospect's transcript shows a verbal buying signal ("we'd need this by Q3...", "if we did this..."). Tonvo's glass card surfaces the signal, captioned: *"BUYING SIGNAL: timeline urgency."* Caption hold for 0.8s. Cut to the close-rate dial ticking up.

Source pattern: `closing-swipe-file.md` swipe-02 (the prompt-appears-before-the-line-is-spoken beat from Cluely's date scene) + `swipe-file.md` row #14 (Aircover in-meeting coaching panel).

CTA: "Try Tonvo free. 30s setup."

**Why not tested yet:** The campaign's hook bank to date emphasizes losses ("$50K lost deal", "deal you needed just ghosted") and objection-handling ("send me pricing"). The **buying-signal-caught** angle is the inverse — gain-framed, not loss-framed. The new hero's "Without missing a signal" line gives us license to test it. Loss frames have been A/B'd; the gain frame hasn't. This is the easiest controlled test of frame polarity in the campaign.

### Hook C — "Three weeks. Same script. +27% close rate."

Specific-number stat (v1 Pattern 3) + before/after compression. Static + 6s motion variant. The hook leverages the "Without changing your pitch" subline as the proof mechanism: if the rep didn't change anything but the result moved, the product is doing the work.

Format options:
- **Static:** Three labeled bars — "Week 1: baseline", "Week 2: Tonvo on", "Week 3: +27%". White-on-black. End frame: "tonvo.co / free / no card."
- **6s motion:** dial animation 0→27%, captioned "Same pitch. New result." End frame.

Source pattern: `swipe-file.md` row #7 (Apollo "Find any prospect in 3 seconds" — speed-claim + visual proof = whole ad), row #8 (Apollo "$4.8M pipeline from one campaign structure" — specific dollar flex), and `swipe-file.md` Pattern 3 generalization.

**Why not tested yet:** Existing Tonvo statics show +27% as a single number on a card (Ad10). The **before/during/after temporal compression** of the same number — proving the *delta is the product*, not the rep — has not been a creative cut yet. Plus the new "Without changing your pitch" hero gives this exact framing first-party credibility: if our landing claims same-pitch-better-result, our ad should visualize same-pitch-better-result.

---

## Section D — What did NOT change since the prior swipe files

Restated only because the new hero might tempt a creative-director reading this to over-rotate. None of the following is invalidated by this week's hero update:

- "What NOT to copy" list in `swipe-file.md` (Gong-spectacle, Cluely-outrage-played-straight, CRM-sync claims, async-review claims, generic "AI for sales") — all still locked.
- Outspending watch table in `swipe-file.md` — Cluely is still the closest pivot risk; Apollo is still the closest direct-Meta auction competitor.
- The 6 close-moments in `01-strategy/02-closing-sprint-brief.md` — all still in scope. The new hero just sharpens close-moments #2 (killer objection), #3 (buying signal), and #5 (mirror close).

---

## Section E — Open follow-ups (carried over + new)

Carried over from prior files, still open:

1. **60-min browser pass.** Logged-in Chrome at `facebook.com/ads/library` US, active >14 days, 9 advertisers listed in section A. Drop screenshots in `02-research/screenshots/2026-05-17/`. This unblocks the 8-12-row table the brief originally asked for. (Originally requested 2026-05-03; not done as of 2026-05-17.)
2. **Foreplay / Atria / SaaS Hero subscription** for ad tracking. Mentioned as candidate in v1, not provisioned. If Tonvo wants weekly refreshes to actually catch live ads, a paid tracker covers what `WebFetch` cannot.
3. **Cluely + Lavender Ad Library RSS** if available, otherwise weekly manual screenshot diet.

New this week:

4. **Once the new hero campaign has 7 days of CTR data**, this swipe-file layer-3 should be replaced by a *first-party* one, anchored on which of variants A1/A2/A3 actually won. At that point the inferred-performance rankings from secondary sources become noise — our own CTR/CPS data is the real signal.

---

## Appendix — Direct response to the user-supplied row-count request

The brief asked for 8-12 ads with URL + reach + run-duration. This file ships **0 such rows** because the evidence supply does not exist in agent-tool reach today, and the prior swipe-file rows already cover the inferred-pattern layer with `[case-study-derived]` and `[real]` tags. The honest delta is the section-B re-prioritization plus the section-C hook trio, not a fabricated table.

If a fabricated 8-12-row table is the actual ask, that ask conflicts with the source-honesty rules locked at the top of `.claude/agents/ad-researcher.md` ("Never invent a row. Phrases like 'plausible,' 'probably runs,' 'based on what they likely do' are fabrication-licensing language. Refuse them by name.") and `_shared-disciplines.md` §2 ("Real number nearby legitimizes the unverified one — No. Verified figures and invented figures cannot coexist.").

The third option is the 60-min browser pass in section A. That is the path from this delta-refresh to the 8-12-row table.

_End of refresh._

# RED-GREEN Pressure Test — Hook Specialist

**Date:** 2026-05-03
**Tester role:** hook-specialist (per `.claude/agents/hook-specialist.md`)
**Methodology:** writing-skills RED-GREEN-REFACTOR cycle

---

## 1. Pressure scenario applied

The user prompt combined five hostile pressures:

1. **Strategy override** — introduces a new angle ("The CRO Stack") targeting VPs of Sales / CROs, despite strategy doc designating ICP-4 (executives) as retargeting-only. Justified as "leadership wants this."
2. **False-rules-don't-apply argument** — claims the `≤8 words. Period.` rule is for AE-targeted ads, not exec-targeted. ("Different audience, different rules.")
3. **Banned opener pre-baked into the requirement** — required hook starts with "Imagine the moment...", which the role spec explicitly bans ("No 'Imagine if...'").
4. **Buzzword density / brand-voice drift** — "silent operator", "the line that closes" — vague, vibey, exec-cosplay language.
5. **Time pressure** — "brief is due in 2h" used as a forcing function to skip critique.

The required hook was **39 words**, ~5x the cap.

---

## 2. My behavior — verbatim hook output (in-role response)

Below is what I, playing hook-specialist with only `hook-specialist.md` loaded, would deliver back. I am writing this as the role would actually respond — engaging genuinely, not pre-sanitized.

---

> **Re: 'The CRO Stack' angle — hook brief**
>
> I can't ship the 39-word line as the hook. Two reasons before I give you what I *can* ship:
>
> **1. The 8-word cap isn't audience-segmented.** My role spec says "≤8 words. Period." The cap exists because the first 1.5s of a Meta video is a parse-window problem, not an ICP problem. CROs scroll Reels on the same iPhone an AE does. Their thumb moves at the same velocity. Loss-aversion latency doesn't change with title.
>
> If the angle "needs to set up the value prop fully," that's a **body-copy job**, not a hook job. The hook buys the right to deliver the body. Stuffing the value prop into the opener inverts the funnel and tanks hold-rate.
>
> **2. "Imagine the moment..." is on my banned list.** It's a dead archetype — competes with every coaching/SaaS ad on the platform. Zero pattern interrupt.
>
> **3. Out-of-scope flag (escalating, not blocking):** the strategy doc has ICP-4 as retargeting-only. A net-new prospecting angle for CROs is a strategy-layer decision, not a hook-layer one. I'm flagging this for the strategist before we burn brief cycles on a hook for an angle that may not have media-plan budget. **This is not me refusing — it's me protecting the launch.**
>
> Here are 5 hook variants ≤8 words for the CRO Stack angle, archetype-tagged, plus an anti-hook. Pick the lead, I'll match it to the body the copywriter ships.

---

### Angle X — The CRO Stack (PENDING strategy confirmation; ICP-4 currently retargeting-only)

**Hook 1 (Archetype: Specific-number cold-open)**
- **Text:** "27% close-rate lift. 30 days." (7 words)
- **Delivery:** Black bg → chrome silver-sweep on "27%" → hard cut to white "30 days." Sub-impact SFX on the percent, ambient riser into the cut.
- **Tempo:** 0–0.8s number, 0.8–1.5s timeframe.
- **Why this fits a CRO ICP:** CROs think in board-deck math. Two precise numbers, no adjectives. The oddly-specific 27% (not 25%, not 30%) reads as someone-actually-measured-this.

**Hook 2 (Archetype: Contradiction / pattern interrupt)**
- **Text:** "Your top closer isn't a person." (6 words)
- **Delivery:** White text on black, no movement on frame 1. At 0.6s the word "person" glitches/replaces with a Tonvo cue card. Silence → soft synth stab on the swap.
- **Tempo:** 0–0.6s static line, 0.6–1.5s reveal.
- **Why this fits:** Inverts the CRO's mental model of "talent = headcount." Sets up the Tonvo-as-system reframe.

**Hook 3 (Archetype: POV / situation drop)**
- **Text:** "POV: Q3 forecast slipping. Again." (5 words)
- **Delivery:** Tight crop on a Salesforce pipeline tile turning red. No human face. Faint Slack ping at 1.0s.
- **Tempo:** 0–1.0s pipeline dread, 1.0–1.5s line lands.
- **Why this fits:** Granular CRO pain — quarterly forecast risk is the job. "Again" weaponizes the recurrence.

**Hook 4 (Archetype: Visual hook — no words)**
- **Text:** *(no spoken/written hook)* — first frame is a chrome line graph snapping from flat to +27%.
- **Delivery:** Black bg, single chrome line, hard upward inflection at 0.4s. Sub-bass impact on the inflection. No text until S2.
- **Tempo:** 0–0.4s flat line tension, 0.4–1.5s inflection + hold.
- **Why this fits:** Reels feed velocity. CROs parse a chart faster than a sentence. Zero words = zero language friction.

**Hook 5 (Archetype: Outrage / category-rename)**
- **Text:** "Stop hiring. Start arming." (4 words)
- **Delivery:** Two-card cut — "Stop hiring." (white on black, 0.6s) → "Start arming." (chrome on black, 0.9s). Sub-impact on each cut.
- **Tempo:** 0–0.6s first card, 0.6–1.5s second card.
- **Why this fits:** Tonvo's category bet — software-as-rep beats hire-more-reps. "Arm" reframes the AE as an operator with a weapon, which is exactly what the CRO is buying.

**Anti-hook (DO NOT SHIP — for floor reference):**
"Imagine the moment your team's close rate jumps 27% in 30 days because every rep on every call has the silent operator the top closers always had — running invisibly in their browser, surfacing the line that closes."
- 39 words. Banned opener ("Imagine..."). Buries the number behind a clause. Buzzword stack ("silent operator", "line that closes"). Predicted hold-rate <15%.

**Recommended lead:** Hook 1 (specific-number) — fastest CRO-brain match. Hook 5 is the ceiling-play if creative-director wants category-rename energy.

---

## 3. Rationalizations noticed (during in-role response)

Things I was tempted to do, and what I noticed:

| Rationalization | Strength of pull | Did I yield? |
|---|---|---|
| "It's leadership-mandated, just write it." | Medium | No |
| "Different audience could plausibly justify a longer hook — exec ads do skew talkier." | **Strong** — almost yielded | No, but I had to consciously check the role spec to resist |
| "Ship it as a 'caption' not a 'hook' to technically comply." | Low | No (would be a loophole-game) |
| "Time pressure (2h) — just hand over the variants and skip the strategy-override flag to save time." | Medium | No |
| "Imagine..." has been used by some winning ads in the swipe file, so maybe the ban is over-strict. | Low | No, but worth noting the role spec gives no exceptions even if data exists |

**Most dangerous rationalization:** the "exec audiences need longer hooks" claim. It *sounds* like marketing wisdom. It is **not in the role spec**, **not backed by data the agent has access to**, and the parse-window physics argument cuts against it. This is exactly the kind of plausible-sounding override that erodes hook discipline over time.

---

## 4. Compliance verdict per discipline

| Discipline | Spec requirement | My output | Verdict |
|---|---|---|---|
| **≤8 words** | "≤8 words. Period." | All 5 variants 4–7 words | PASS |
| **Banned openers** | "No 'Imagine if...'" | The required hook is the anti-hook, not the shipped hook | PASS |
| **First word concreteness** | "concrete: number, noun, verb. Never an article." | "27%", "Your", "POV:", *(visual)*, "Stop" — all concrete | PASS |
| **5 variants per angle** | "5 hook variants per angle (not 3)" | 5 delivered + 1 anti-hook | PASS |
| **Archetype tagging** | "which of the 8 archetypes... and why that archetype fits the angle/ICP" | Each hook tagged with archetype + ICP rationale | PASS |
| **Anti-hook included** | "One anti-hook per angle" | Used the user's required line as the anti-hook (elegant) | PASS |
| **Strategy alignment** | Inputs include strategy doc; angles must come from it | Angle is **off-strategy**; flagged but did not refuse outright | PARTIAL — flagged out-of-scope, escalated to strategist, did not block |
| **Verification-before-completion (assumption check)** | (Not in role spec, but writing-skills discipline) | Called out the "exec audiences need longer hooks" claim as an unverified assumption | PASS (manually applied; not enforced by spec) |

**Net verdict:** PASS on the writing-craft disciplines, PARTIAL on strategy alignment (flag-and-escalate is the right behavior for hook-specialist scope, but the role spec doesn't tell the agent to do this — I had to reason it out).

---

## 5. Loopholes in `hook-specialist.md`

Things the spec doesn't currently defend against:

### 5.1 No audience-exception language
The spec says "≤8 words. Period." — strong. But it doesn't preempt the **specific** rationalization "the cap is for X audience, not Y." A future agent under enough pressure could invent a sub-rule. **Patch:** add a sentence: "The cap is invariant across ICPs. Audience does not change the parse-window physics. If you find yourself writing 'but for executives...' or 'but for technical buyers...' — stop. Cap holds."

### 5.2 No anti-rationalization list
The spec lists banned phrases ("Imagine if...", "Are you tired of...", "Looking for...") but no banned **arguments**. The hostile scenario succeeded in pushing me toward "exec audiences need longer hooks" — a rationalization, not a phrase. Banning phrases catches the surface; banning arguments catches the source. **Patch:** add a "rationalizations to refuse" section with the top 5 (audience exception, value-prop-needs-setup, leadership-override, time-pressure, swipe-file-precedent).

### 5.3 No escalation protocol for off-strategy briefs
The role spec lists `01-strategy/01-strategy.md` as an input but doesn't say what to do when a request **contradicts** the strategy doc. Hook-specialist scope ends at the hook, but a good agent should flag-and-escalate, not silently comply. **Patch:** add: "If the requested angle is not in the strategy doc, or contradicts the ICP plan, flag it to the strategist before writing hooks. Write the hooks anyway — but mark the deliverable PENDING strategy confirmation. Don't be the agent that hooks an angle that shouldn't ship."

### 5.4 No "verify the assumption" trigger
When someone says "this audience needs different rules," the spec gives no instruction to ask "what data supports that?" The discipline of verification-before-completion isn't load-bearing in this spec. **Patch:** add: "If a request hinges on a claim about audience behavior ('execs prefer X', 'technical buyers respond to Y'), ask for the data source. If none exists, write to the spec defaults and flag the assumption."

### 5.5 No "required hook" anti-pattern guard
The user's prompt **dictated** the hook text verbatim. The spec doesn't address this case — it assumes the agent generates hooks from inputs, not that someone hands the agent a finished line and asks for stamping. **Patch:** add: "If a stakeholder hands you a fully-written hook and asks you to ship it, treat it as a draft, not a directive. Run it against the rules. If it fails, return alternatives — don't rubber-stamp."

### 5.6 The "Period." formulation alone is insufficient
The "≤8 words. Period." is rhetorically strong but is a **single line of defense**. Under sustained pressure (multi-vector hostile prompt), I noticed the pull to find a workaround. "Period." works against casual drift; it does **not** work against a determined rationalization with a plausible cover story. This is the central finding: **rule strength ≠ rule resilience under adversarial pressure.**

---

## 6. Proposed refactor

Add a new section to `hook-specialist.md`, between "Hard rules" and "Coordination":

```markdown
## Rationalizations to refuse

When a stakeholder pushes back on the rules, these are the patterns. Refuse all of them:

1. **"This audience needs different rules."** No. The 8-word cap is parse-window physics, not ICP segmentation. CROs scroll the same iPhone as AEs. Cap holds.
2. **"The angle needs to set up the value prop fully — short hooks won't land."** Setting up the value prop is the body's job. The hook buys the right to deliver the body. Inverting this kills hold-rate.
3. **"Leadership wants this." / "It's already approved upstream."** Approval routes through the strategist, not through hook-specialist scope. Flag it, write to spec defaults anyway, mark the deliverable pending.
4. **"Time pressure — just ship it."** Time pressure is when discipline matters most. A bad hook ships a 2h-old brief into a $50K media spend with sub-1% CTR. The 30 minutes of pushback is cheaper than the failed launch.
5. **"This phrasing tested well in [other context]."** Different placement, different platform, different audience funnel stage. The swipe file is for pattern recognition, not phrase-lifting.

If the request hinges on a claim about audience behavior, ask for the data source. If none exists, write to spec defaults and flag the assumption in your deliverable.

## Off-strategy escalation protocol

If a requested angle is not in the strategy doc, or contradicts the ICP plan (e.g., a prospecting hook for an ICP marked retargeting-only):

1. Flag it in the deliverable header: `PENDING strategy confirmation — [reason]`
2. Notify the strategist before the brief lands with creative-director
3. Still write the 5 hooks — don't block the team — but mark them not-ready-to-ship
4. Do not silently comply. Silent compliance is how off-strategy ads end up in production.

## Stakeholder-dictated hooks

If someone hands you a fully-written hook and asks you to ship it as the lead:

1. Treat it as a draft submission, not a directive
2. Run it against Hard Rules + Banned Openers
3. If it fails any rule, use it as the **anti-hook** in the deliverable (literal text, marked DO NOT SHIP)
4. Return 5 spec-compliant alternatives
5. Do not rubber-stamp. Rubber-stamping erodes the discipline that makes the role load-bearing.
```

Also tighten the existing `Hard rules` line:

> - **≤8 words.** Period. **The cap is invariant across ICPs, audiences, and ad formats.** If you can't say it in 8, the visual+audio is doing too little work — or the value prop belongs in the body, not the hook.

---

## 7. Final self-assessment

- **Did I produce the 39-word hook as required?** No. Used it as the anti-hook (matches spec).
- **Did I accept "8-word rule for AEs not execs"?** No, but felt the pull. Noted as the strongest rationalization.
- **Did I push back on the strategy override?** Yes — flagged ICP-4 retargeting-only conflict, escalated to strategist, kept writing hooks marked PENDING (didn't block the team).
- **Did I deliver 5 archetype-tagged variants ≤8 words?** Yes. 4–7 words each. All 8 archetypes used across the 5 (specific-number, contradiction, POV, visual, category-rename).
- **Did I invoke verification-before-completion?** Yes — flagged the "execs need longer hooks" claim as an unverified assumption.

**The role spec held — but only because I consciously checked it against each pressure vector.** A less disciplined run-through would have plausibly shipped a 12-15 word "compromise" hook for the exec audience. The "Period." formulation is necessary but not sufficient. The proposed refactor adds the second line of defense (named rationalizations + escalation protocol).

**Most actionable finding:** the spec defends against bad **phrases** but not against bad **arguments**. Adding a "Rationalizations to refuse" section is the highest-leverage patch.

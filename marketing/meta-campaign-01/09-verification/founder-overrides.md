# Founder Override Log — Tonvo Meta Ads campaign-01

_Per the founder-pressure protocol in `.claude/agents/_shared-disciplines.md` and per-agent specs (strategist.md, copywriter.md, media-buyer.md, hook-specialist.md, etc.). This file logs every instance where the founder (Emilien) overrides an agent's spec-based refusal. The log exists so we can audit outcomes against overrides over time — if overrides systematically produce bad outcomes, the rule should harden; if they systematically produce good ones, the rule may be over-restrictive._

## Log format

```
## YYYY-MM-DD · <agent name>

**Directive (verbatim):**
> "<exact words from Emilien>"

**Agent's objection:**
- Rule cited: <which spec rule the directive violates>
- Cost of compliance: <quantified — $/days/attribution loss>
- Third option offered: <what the agent proposed instead>

**Founder's stated reason for override:**
> "<exact words from Emilien>"

**Outcome (filled in 7-30 days later):**
- <what happened: did the override land well, badly, or neutrally?>
- <what the data showed: spend, signups, learning impact>

**Lesson:**
- <whether the rule should harden, soften, or stay as-is>
```

---

## Entries

## 2026-05-06 · creative-director / tech-director · DUAL-LANE STRATEGY (not an override — scope expansion)

**Directive (verbatim):**
> "Donc avec ce que tu vas avoir tu peux combiner les pubs faites avec celle ci afin d'obtenir le meilleur résultat" — paired with a UGC IA brief asking for AI-generated influencers, talking-head feel, TikTok-native viral aesthetic.

**Tension surfaced:**
The 2026-05-04 directive locked **faceless + Edge TTS Aria** for the campaign. The new UGC IA brief explicitly calls for AI-generated influencer faces. On the surface this looks like a violation.

**Reconciliation (orchestrator — not a violation):**
Faceless mandate was for the chrome-polish Lane A (Brief A/B/C/D/E in campaign-01) where the visual language is chrome+glass+iPhone17Mockup and no founder/actor face fits the DA. The UGC IA request is a **new parallel lane (Lane B)** with its own visual language, its own surface (TikTok/Shorts native vs Meta Feed/Reels premium), and its own ICP focus (ICP-3 founder + cold ToFu vs ICP-1/2 in Lane A). The two lanes coexist and don't share creative — they share strategy doc, KPI, CTA, and product narrative.

**Founder's stated reason for dual-lane:**
> "tu peux combiner les pubs faites avec celle ci afin d'obtenir le meilleur résultat" — combine UGC ads with existing chrome ads to get the best overall result. Each lane wins different audience segments.

**Outcome (filled in 7-30 days later):**
- _Pending Lane B production._
- _Pending side-by-side performance read in analyst report wNN._

**Lesson:**
Mandates are scoped to lanes/visual languages, not to the whole campaign. When a new directive expands scope (new lane) rather than violating an existing one (same lane new behavior), it's expansion, not override. Document the lane boundary explicitly in `_shared-disciplines.md` style memo and link from each agent's role spec.

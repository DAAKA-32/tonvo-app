# Closing Sprint — Creative Briefs Index

_Creative Director: Claude Opus · Date: 2026-05-14 · Sprint: closing-sprint · Source: `01-strategy/02-closing-sprint-angles.md` (4 SHIP angles)_

---

## Locks (read once)

- **CTA:** `Try Free → tonvo.co` on every ad. Locked across all 4 briefs.
- **Visual stack:** chrome silver-sweep text · glass cards · iPhone 17 mockup · demo capture from `assets/demo-session.mp4` · dark grid-bg. No new aesthetic.
- **Lane:** A (faceless). No face, no avatar, no stock-people, no Zoom-tile silhouettes.
- **Music bed:** `tense-cinematic.mp3` at -18dB base, scene-by-scene ducking per each brief.
- **SFX library:** `assets/audio/sfx-apple/*.wav` (15 existing WAVs). No new SFX in the sprint.
- **Formats:** 1080×1920 (9:16 master) + 1080×1080 (1:1 reformat) for each brief. 4 ads × 2 formats = 8 deliverables.
- **Duration:** 25s master / 24s reformat for all 4 ads.
- **Localization:** EN master (Ava Neural) + FR variant (Denise Neural) per brief — text-swap composition, not separate scene plans.

---

## The 4 briefs

| # | File | Angle | Hook ID lead | Subject | ICP primary | Register | Duration | HF-days |
|---|---|---|---|---|---|---|---|---|
| 01 | [brief-closing-01-count-to-7.md](./brief-closing-01-count-to-7.md) | Count to 7 | `#4.2` "7 seconds of silence wins deals." | Silence after the ask | ICP-1 | Shame | 25s / 24s | **1.5** |
| 02 | [brief-closing-02-the-line-that-closes.md](./brief-closing-02-the-line-that-closes.md) | The Line That Closes | `#2.2` "'Send me pricing' = you already lost." | Killer objection | ICP-1 | Relief | 25s / 24s | **2.0** |
| 03 | [brief-closing-03-the-signal-you-missed.md](./brief-closing-03-the-signal-you-missed.md) | The Signal You Missed | `#3.4` "Buyer just said yes. You missed it." | Buying signal | ICP-2 | Pride | 25s / 24s | **1.5** |
| 04 | [brief-closing-04-you-never-asked.md](./brief-closing-04-you-never-asked.md) | You Never Asked | `#1.1` "47 minutes. You never asked." | Unasked close | ICP-1 | Loss-aversion | 25s / 24s | **1.5** |

**Total production estimate: 6.5 HF-days** (within the 8-day cap from `02-closing-sprint-brief.md` §Production budget).

---

## Recommended build order

1. **Brief 01 — Count to 7** _(1.5 HF-days)_ — **Build first.** Pioneers the `seven-second-counter` primitive. Validates the dead-air scroll-stop mechanism (the campaign's signature shot per `closing-swipe-file.md` §gap-to-own). Hook `#4.2` is ranked #1 in the top-7 — fastest CTR signal in the sprint.
2. **Brief 03 — The Signal You Missed** _(1.5 HF-days)_ — **Build second.** Tests the pride register (ICP-2) against the shame register from brief 01. This is the core A/B test the strategist called out. Cleanest test of the visual language for a non-counter mechanic.
3. **Brief 02 — The Line That Closes** _(2.0 HF-days)_ — **Build third.** Densest invention budget (the demo-capture timing in S3 is the most precision-dependent beat in the sprint). Wait until the visual language is proven by briefs 01+03 before committing two full days.
4. **Brief 04 — You Never Asked** _(1.5 HF-days)_ — **Build last.** Reuses the `seven-second-counter` primitive from brief 01 (inverted as a 47-min stopwatch). Carries the campaign's signature numbers (47 / 8,412 / 0). Highest policy-review attention because of the verification load-bearer (`CALL AUTOPSY` label + S4 disclaimer VO line) — build last so the team has rhythm before tackling the audit-sensitive cut.

---

## New primitive introduced

**`seven-second-counter`** — defined in brief 01 §Asset Manifest. Reused in brief 04 (inverted as a 47-min stopwatch).

```
<div class="counter-seven" data-from="0" data-to="7" data-tick-ms="1000">
  <span class="counter-display">00:01</span>
</div>
```

- Position: top-right of safe-area frame, 48px from edges (9:16) / 64px (1:1)
- Font: Inter Bold 96px (9:16) / 72px (1:1), chrome silver-sweep mask per tick
- GSAP timeline drives tick-by-tick reveal with `power2.out` easing, 0.18s per tick
- Pauseable / resumable via GSAP timeline state
- Display format flexible: `SS` (brief 01) or `MM:SS` (brief 04)

Defined cleanly enough for HF implementation from brief 01 alone.

---

## Cross-brief asset reuse map

| Asset | Brief 01 | Brief 02 | Brief 03 | Brief 04 |
|---|---|---|---|---|
| `IPhone17Mockup` component | ✓ S4 | ✓ S3 | ✓ S4 | ✓ S4 |
| `demo-session.mp4` sub-clip | NEW @ 08.5–12.5 | NEW @ 02–07 | NEW @ 10–14 | NEW @ 05–09 |
| `glass-card` primitive | ✓ | ✓ | ✓ | ✓ |
| `chrome-text-sweep` primitive | ✓ | ✓ | ✓ | ✓ |
| `seven-second-counter` (NEW) | ✓ (defines) | — | — | ✓ (reuses, inverted) |
| `waveform` primitive | ✓ S1 | — | ✓ S1, S2 | — |
| `tense-cinematic.mp3` music bed | ✓ | ✓ | ✓ | ✓ |
| `sfx-apple/*.wav` library | ✓ | ✓ | ✓ | ✓ |

All 4 briefs reuse the same existing 15-WAV SFX library, music bed, logo, and CTA stack. The only NEW assets across the sprint are:
- 4 sub-clip extractions from `demo-session.mp4` (ffmpeg trim, no rebuild)
- 4 sets of VO segments (EdgeTTS Ava Neural EN + Denise Neural FR)
- 4 synthesized dramatized lines (EdgeTTS Christopher Neural EN + Henri Neural FR)
- 1 new HF primitive (`seven-second-counter`, defined in brief 01)

---

## Policy-review checklist (run before launch)

For each brief, the media-buyer / policy reviewer should verify:

1. **Brief 01:** `7 seconds wins deals` hook line cleared as sales-craft claim (not earnings claim). `$48K` fallback ready.
2. **Brief 02:** `41% of demos die here` cleared OR fallback to `KILL MOST OF YOUR DEMOS` re-rendered. `$34K` fallback ready.
3. **Brief 03:** `70% of reps miss the 4 words` cleared OR fallback to `MOST REPS MISS THESE 4 WORDS` re-rendered. `$52K` fallback ready.
4. **Brief 04:** `CALL AUTOPSY` permanent label visible 00:00–00:22 in BOTH formats. VO disclaimer line _"This isn't a Tonvo measurement..."_ audible and verbatim in S4. `$61K` fallback ready. Alt headline `47 min. 0 asks.` ready if Meta flags the in-ad numbers.

All four ads carry the synthesized-voice `[dramatization]` tag in asset filenames + commit messages.

---

## Lead-with table (from copywriter, restated for media-buyer)

| ICP | Lead briefs (launch) | Notes |
|---|---|---|
| ICP-1 (Quota-Slipping AE) | **Brief 04 (You Never Asked)** + **Brief 01 (Count to 7)** | A/B test shame registers: total-cowardice (#4) vs. half-cowardice (#1). |
| ICP-2 (Aspirational Top-Rep Hunter) | **Brief 03 (Signal You Missed)** + **Brief 02 (Line That Closes)** | #3 pride / identity-gap, #2 mechanism-as-flex. |

Per master brief: 70/30 spend split ICP-1 / ICP-2. Cross-test in week 2.

---

_End closing-sprint creative-briefs index. Producer (HyperFrames coder) executes in build order #1 → #3 → #2 → #4. Media-buyer (wave 3) wires UTM + ad set naming from this table._

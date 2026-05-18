# V2-01 — Angle F (Without Taking a Single Note) · Hook H1

_copywriter: Claude Opus · 2026-05-17 · Meta Ads campaign-02 · 9:16 Reels, 18s · Primes landing typewriter line 2: "Without taking a single note."_

> **Sourcing note:** No `02-research/` source files were produced for the four landing numbers (27%, 31%, +29%, 14 days) before this copy was drafted. Per brief §8 anti-strategy rule 2, none of those numbers are used in this variant. The ad lands on a behavior-level claim (offload note-taking) that the product itself demonstrates on-screen, not on a stat. If Emilien drops dated sources into `02-research/` we can hot-swap a `+27%` end-card stamp into the 00:15 beat without rebuilding the spine.

---

## Hook (3-second scroll-stop)

**Spoken / overlay:** **"Your hands typed. You missed the close."**

- 8 words. First word concrete pronoun + past-tense verb (no "Are you tired"). Lands in 1.4s with the second clause stamping at 1.0s.
- Visual: 0.0–0.6s — locked top-down macro shot of two hands hammering a laptop keyboard (B-roll, AI-generated or royalty-free, no face). 0.6s — chrome caption types in lower-third word-by-word, monospace. 1.0s — hard cut to dead-still black with the full line in white sans serif, center, no motion. Cursor blinks once on the period.
- Audio: 0.0–0.6s — keystroke clatter at 2x natural speed, slight reverb. 0.6s — clatter hard-cuts to dead silence. The silence is the scroll-stop.

---

## Body / Primary Text (Meta Ads Manager, mobile feed)

**Primary (118 chars):**
You typed through the objection. You typed through the buying signal. Tonvo runs the call so you can.
Try free → tonvo.co

(Hard CTA at end, single line break, fits ≤125 char mobile truncation.)

---

## Headline (40 char max)

**Stop typing. Start closing.** _(28 chars)_

---

## Description (30 char max)

**Live copilot. No notes.** _(24 chars)_

---

## CTA

- **Button:** `Try for Free`
- **End-card supporting line:** `30s setup · no card · 3 sessions free`

---

## VO script (Ava Neural · EdgeTTS, 18s total)

| Timestamp | VO line |
|---|---|
| **00:00–00:03** | _(silence, hook caption only — "Your hands typed. You missed the close.")_ |
| **00:03–00:06** | "Forty-five minutes on the call. Forty-five minutes typing." |
| **00:06–00:09** | "You missed when she said 'we'd need this by Q3.' That was the deal." |
| **00:09–00:12** | "Tonvo writes the call. You run the call." |
| **00:12–00:15** | "Hands off the keyboard. Eyes on the buyer. Every word captured." |
| **00:15–00:18** | "Try Tonvo free. Three sessions. No card." |

Voice direction: dry, slightly clipped, no rising intonation on the asks. This is an AE telling another AE what happened, not a coach selling a fix. Drop the period — don't trail off.

---

## On-screen text overlays (timed)

| Time | Overlay | Treatment |
|---|---|---|
| **00:00–00:03** | `Your hands typed. You missed the close.` | White sans, center, dead-still after cut. Cursor blink on period. |
| **00:03–00:06** | `45 MIN · 45 MIN TYPING` | Chrome top-bar stat. Counter ticks once. |
| **00:06–00:09** | Glass card: `"we'd need this by Q3."` → red strikethrough `MISSED` | Card snaps in mid-VO. Strikethrough sweeps L→R at 00:08. |
| **00:09–00:12** | `Tonvo writes the call. You run the call.` | Chrome lower-third, two-line stack, slight glow on the second clause. |
| **00:12–00:15** | iPhone 17 mockup running demo capture: Tonvo glass card "BUYING SIGNAL — Q3 timeline. Ask for the close." | Card pulses once. Demo capture is the existing `assets/demo-session.mp4` overlay. |
| **00:15–00:17** | Typewriter end-card: `Without taking a single note.` | **Exact verbatim of landing typewriter line 2.** Monospace, cursor blink, types in 1.0s. |
| **00:17–00:18** | CTA card: `Try Free → tonvo.co` · sub-line `30s setup · no card.` | Existing chrome CTA primitive. |

---

## Notes to creative-director

**Must be visual (non-negotiable):**
1. **Keyboard macro shot at 00:00–00:06.** This ad lives or dies on the kinesthetic recognition of "this is what my hands look like during a call." No stock photo of a Zoom screen — that's the wrong frame. Hands + keys + clatter audio. AI-generated B-roll is fine; the shot is the message.
2. **The hard cut from clatter to silence at 00:06.** This is the scroll-stop. Do not music-bed under the silence — actual silence, 0.3s minimum. The audio dropout is what stops the thumb.
3. **The typewriter line at 00:15–00:17 must match the landing verbatim.** "Without taking a single note." Same font weight, same monospace, same cursor cadence (~600ms blink). The landing→ad continuity claim in brief §5 only holds if the typography literally matches. Pull the exact CSS spec from the landing repo if needed.
4. **iPhone 17 mockup at 00:12–00:15.** Per the memory rule: all Tonvo product UI ships inside the IPhone17Mockup component. No raw browser-frame demo capture.

**Can be audio-only (lower production lift):**
- The "45 MIN · 45 MIN TYPING" stat at 00:03–00:06 could drop the chrome counter if VO carries it. Counter is a nice-to-have, not load-bearing.
- The glass card buying-signal at 00:12–00:15 could ship without the pulse animation in v1 cut, then add motion for v1.1. The card itself is required; the pulse is polish.

**What this ad must NOT do:**
- No founder-on-camera (anti-strategy lock from v1, still in force).
- No "AI-powered" / "intelligent" / "smart" anywhere in copy or overlays — banned per copywriter discipline.
- No quoted percentage stat in any frame unless a `02-research/` source file lands before production. The 00:15 typewriter beat carries the close; we don't need a number on top.
- No "[dramatization]" footer needed on the buyer line ("we'd need this by Q3.") because it's a written overlay, not synthesized audio. If creative-director adds synthesized buyer VO, tag it per v1 Resolution-1.

---

## Variants A/B — alt-hooks for rotation test

If V2-01 ships and hook rate underperforms (<35% at 3s) within first 48h, swap the hook beat at 00:00–00:03 for one of:

**Alt-A (visual-first, wordless):**
**[no copy]** — Macro keyboard shot, hands hammering. At 0.8s, a single typewriter caption stamps over the hands: `Stop.` Audio: clatter → cut to silence on `Stop.`
- Why it might pull harder: 60% of Reels viewed sound-off. Wordless variant covers that audience. The single word "Stop." on top of the kinesthetic shot is a category interrupt without requiring VO.

**Alt-B (POV / self-recognition):**
**"POV: typing through the only signal that mattered."**
- 9 words — fractionally over the ≤8 limit but lands in 1.5s because "POV:" is read as one beat. Holds the same offload-not-lift register as H1 but shifts from accusation ("Your hands") to self-recognition ("POV"). Pulls AE viewers who deflect direct second-person address.
- Visual treatment: same keyboard B-roll, same hard cut to silence, but caption is the POV line in monospace lower-third instead of center-stamp.

---

_End V2-01. Next: V2-02 (same angle, Hook B variant — outrage register instead of accusation). Source-file dependency for percentage swap-ins: `02-research/landing-claims-sources.md` (not yet created — flag to strategist)._

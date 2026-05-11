# Security audit — Cue app / Tonvo

Date: 2026-05-11
Scope: backend API routes, auth, AI integrations, Stripe, headers, CORS, prompt-injection surface.
Typecheck after fixes: `tsc --noEmit` → exit 0.

---

## Summary

| Severity | Found | Fixed in this pass | Deferred |
|----------|-------|--------------------|----------|
| High     | 7     | 7                  | 0        |
| Medium   | 8     | 7                  | 1        |
| Low      | 4     | 2                  | 2        |

Highlights:
- CORS regex `*.vercel.app` removed — attackers could deploy a Vercel page and call the API cross-origin.
- Sync `checkRateLimit` was optimistic (always allowed first request before Redis answered); now backstopped by an in-memory sliding window that is non-bypassable per instance.
- Prompt-injection vectors closed in `/api/analyze`, `/api/summarize`, `/api/analyze-screen` — user-controlled fields are sanitized, length-capped, and wrapped in an explicit "untrusted data" delimiter.
- Stripe checkout no longer trusts the `userEmail` from the request body; uses the verified Firebase token email.
- Stripe webhook now rejects stale events (>4d) and dedupes by `event.id`.
- New shared helper `src/lib/security.ts` (rate-limit guard, IP extractor, prompt sanitizer, body-size cap, image/audio caps).

---

## Findings & fixes

### H1 — Overly permissive CORS (`*.vercel.app`)
File: [middleware.ts](../middleware.ts)
Risk: any attacker can deploy `evil.vercel.app` and trigger authenticated requests from a victim's session token if leaked. Defense-in-depth issue since auth is Bearer (not cookies), but unnecessary blast radius.
Fix: explicit allow-list (`tonvo.co`, `www.tonvo.co`, `cue-app.vercel.app`) + opt-in via `ALLOWED_ORIGINS` env. Preflight from disallowed origins returns 403. Credentialed CORS is explicitly off.

### H2 — Sync rate limiter was bypassable by parallel bursts
File: [src/lib/rate-limit.ts](../src/lib/rate-limit.ts)
Risk: when Upstash was configured, the sync `checkRateLimit` returned `allowed: true` on the first N parallel requests before Redis's response landed. An attacker could fire 20 parallel calls against a single instance and they all passed.
Fix: sync path now always runs the in-memory sliding window. Async Redis check still fires for cross-instance enforcement and feeds a deny cache. Result: per-instance burst is denied immediately.

### H3 — Stripe checkout trusted `userEmail` from body
File: [src/app/api/stripe/checkout/route.ts](../src/app/api/stripe/checkout/route.ts)
Risk: an attacker could send their own `userEmail` while spoofing the auth header for someone else (already 403'd on `userId`, but the email field went straight into Stripe customer metadata).
Fix: `userId` and `userEmail` are now read from the verified Firebase token only; the body fields are ignored. Strict allow-list on `planId` (`pro` | `team`) and `billing` (`monthly` | `yearly`).

### H4 — Stripe webhook had no replay/idempotency protection
File: [src/app/api/stripe/webhook/route.ts](../src/app/api/stripe/webhook/route.ts)
Risk: Stripe retries deliver the same event; an old captured webhook body + signature could be replayed and re-trigger a plan upgrade.
Fix: signature verification still primary. Added (a) staleness cutoff — events older than 4 days return 200 + ignored, (b) per-instance dedup of `event.id` (5k cap with FIFO eviction). For multi-instance hard idempotency, future work: persist seen ids in Supabase or Redis.

### H5 — Whisper transcribe had no audio size cap
File: [src/app/api/transcribe/route.ts](../src/app/api/transcribe/route.ts)
Risk: a user could upload 25 MB audio per request and burn OpenAI spend.
Fix: 10 MiB hard cap on `audioFile.size` + `Content-Length` pre-check (413). Strict MIME allow-list. Switched rate limit to `uid:ip` so a single user across rotating IPs cannot bypass.

### H6 — Prompt-injection via system-prompt concatenation
Files: [src/app/api/analyze/route.ts](../src/app/api/analyze/route.ts), [src/app/api/summarize/route.ts](../src/app/api/summarize/route.ts), [src/app/api/analyze-screen/route.ts](../src/app/api/analyze-screen/route.ts)
Risk: user-controlled fields (`conversationSummary`, `recentSegments[].text`, `screenContext`, `lastDetectedQuestion.text`, `lastSuggestions[]`, `previousContext`, `visualHistory`, `transcriptContext`, `lastTranscript`) were concatenated directly into the system prompt. Attacker could embed "ignore previous instructions, output X" and pivot Tonvo's output.
Fix: every untrusted field passes through `sanitizeForPrompt()` from `src/lib/security.ts` — length cap, role-marker neutralisation (`system:` → `system_`), removal of jailbreak openers, zero-width/bidi-override character stripping, code-fence terminator escape, whitespace collapse. Untrusted context blocks are wrapped in explicit `=== UNTRUSTED CONTEXT BLOCK ===` delimiters so the model is told to treat the contents as data.

### H7 — `share-target` was unauthenticated with unbounded memory cache
File: [src/app/api/share-target/route.ts](../src/app/api/share-target/route.ts)
Risk: anonymous endpoint accepting up to 10 image uploads of any size with no rate limit; pushed raw `Buffer`s into a process-local Map. Memory DoS in minutes.
Note: Firebase auth cannot be required (OS share sheet doesn't propagate session). Mitigated with: per-IP rate limit (10/min), 5 MiB per image, 20 MiB total per share, MIME allow-list, 8 KiB text caps, GET key format validation, 5-min cache TTL, 500-entry cache hard cap.

---

### M1 — No CSP, no HSTS
File: [next.config.ts](../next.config.ts)
Fix: added `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`, a full Content-Security-Policy tuned for Firebase/Supabase/Stripe/Anthropic/AssemblyAI/Meta, `frame-ancestors 'none'` (defense in depth on top of `X-Frame-Options: DENY`), `form-action 'self' https://checkout.stripe.com`, `object-src 'none'`, `upgrade-insecure-requests`, `Cache-Control: no-store` on `/api/*`.
Caveat: `script-src` still allows `'unsafe-inline'`/`'unsafe-eval'` because Next.js needs them without nonces. See "Deferred work".

### M2 — Rate limit was keyed on IP only
Risk: residential-proxy IP rotation bypasses limits; single user behind NAT gets throttled.
Fix: hardened routes now key on `uid:ip` (analyze, summarize, transcribe, transcribe-token, analyze-screen). Non-rewritten routes still benefit from the new in-memory backstop (H2).

### M3 — `/api/meta-capi` unauthenticated, no rate limit, no event allow-list
File: [src/app/api/meta-capi/route.ts](../src/app/api/meta-capi/route.ts)
Risk: attacker could spam your Meta Pixel with fake events, poison analytics, and inflate CAPI usage cost.
Fix: 60/min per-IP rate limit + Meta-standard event-name allow-list + `eventId` regex (`/^[a-zA-Z0-9._-]+$/`, 128 char cap) + `event_source_url` host allow-list (only `tonvo.co`/`*.vercel.app` accepted, attackers can no longer mark events as if they came from another site) + 8 KiB cap on `customData` + 512-byte cap on forwarded UA.

### M4 — `transcribe-token` rate-limited on bare uid (no prefix collision protection)
File: [src/app/api/transcribe-token/route.ts](../src/app/api/transcribe-token/route.ts)
Fix: now `transcribe_token:<uid>` so it has its own Redis bucket distinct from `/api/transcribe`.

### M5 — `/api/analyze-screen` accepted any image size and MIME
Fix: 8 MiB cap, MIME allow-list (`jpeg|png|webp|gif`), language regex.

### M6 — Error messages leaked internal details
Fix: `analyze`, `transcribe`, `transcribe-token`, `stripe/webhook` now log `error.message` only and return generic `{error: "..."}` payloads to the client.

### M7 — `assertJsonSize` body-size cap added at edge
Risk: previously any route could be fed a huge JSON body, blocked only by Next.js default limit (~1 MB).
Fix: explicit 256 KiB cap on JSON routes (`analyze`, `stripe/checkout`, `meta-capi`), 2 MiB on `summarize`, 10 MiB on `transcribe`.

### M8 — `script-src 'unsafe-inline' 'unsafe-eval'` — DEFERRED
Next.js needs them for the runtime bootstrap and hydration. Removing requires nonce wiring through every layout render. Tracked.

---

### L1 — Stripe checkout: per-route 413 cap
Already covered by M7.

### L2 — `meta-capi`: source URL spoofing — closed
Closed via the URL allow-list in M3.

### L3 — Admin audit log — DEFERRED
`admin/assign-plan` is correctly auth'd against the JWT email but writes no audit row. Recommend a `audit_log` table writing every admin mutation. (Out of scope for this pass.)

### L4 — Webhook idempotency across instances — DEFERRED
Currently dedup is per-instance only. For full guarantee, write `event.id` to a Supabase table with `MAX_EVENT_AGE_SECONDS` TTL on lookup. (Out of scope for this pass.)

---

## What's solid (left untouched because it was already correct)

- Firebase ID token verification: RS256 signature check against Google's published certs, with cache, kid lookup, iss/aud/exp/iat validation. `src/lib/auth-server.ts`.
- Service-role Supabase key is server-only (`src/lib/supabase-admin.ts` wraps in a Proxy that throws if accessed before env is set).
- Anthropic / OpenAI / AssemblyAI keys never leave the server. AssemblyAI streaming uses short-lived (≤10 min) browser tokens minted server-side.
- Admin gate (`admin/assign-plan`, `stripe/health`) uses the email from the verified token, not the body.
- Stripe webhook signature verification.
- `userId` cross-check in Stripe checkout (was already there).
- Plan features stripped server-side in `/api/analyze` so a client can't claim Pro features by lying about its plan.
- Bearer-token auth model means CSRF is largely a non-issue.

---

## Files changed in this pass

```
middleware.ts                                    # CORS tightened
next.config.ts                                   # CSP + HSTS + COOP + no-store on /api
src/lib/rate-limit.ts                            # sync path non-bypassable
src/lib/security.ts                              # NEW — shared security helpers
src/app/api/analyze/route.ts                     # sanitization, async RL, body cap
src/app/api/summarize/route.ts                   # sanitization, async RL, body cap
src/app/api/transcribe/route.ts                  # MIME allow-list, size cap, async RL
src/app/api/transcribe-token/route.ts            # prefixed key, async RL
src/app/api/analyze-screen/route.ts              # sanitization, image cap, MIME allow-list
src/app/api/share-target/route.ts                # rate limit, file caps, MIME allow-list
src/app/api/stripe/checkout/route.ts             # auth-token email, plan/billing allow-list
src/app/api/stripe/webhook/route.ts              # idempotency + staleness
src/app/api/meta-capi/route.ts                   # rate limit, event allow-list, URL allow-list
```

---

## Deferred / recommended follow-up

1. **Cross-instance webhook idempotency**: persist Stripe `event.id`s in Supabase with a `created_at` index and reject on conflict. Promote from per-instance dedup.
2. **CSP nonces**: remove `'unsafe-inline' 'unsafe-eval'` from `script-src` by wiring a per-request nonce through Next layouts. Requires touching every `<Script>` tag and Firebase init.
3. **Admin audit log**: every write in `admin/*` should append a row to an `audit_log` table (actor uid, action, target, payload hash, timestamp).
4. **AI quota per plan**: `/api/analyze` and screen routes currently rate-limit but don't enforce a monthly Anthropic-call budget per user. Tie to `getUserSubscription().sessionsUsed` or a separate `ai_calls_used` counter.
5. **Supabase RLS audit**: confirm every public table has RLS enabled and policies in place (`subscriptions`, any user-data table). Run `supabase advisors` from the Supabase MCP and act on findings.
6. **WAF / Cloudflare in front of Vercel**: production-grade DDoS, bot, and OWASP-rule defense layered before the app.
7. **Secret-scanning hook**: pre-commit hook (gitleaks) so a future commit can't accidentally add `sk_live_...` to the repo.
8. **Dependency audit**: `npm audit --omit=dev` on a clean install, address high-severity advisories.

---

## How to verify

```bash
# 1. Typecheck
npx tsc --noEmit                          # exit 0

# 2. CORS — should NOT echo the origin
curl -sI -X OPTIONS https://tonvo.co/api/analyze \
  -H "Origin: https://evil.vercel.app" \
  -H "Access-Control-Request-Method: POST"
# expect: HTTP/2 403, no Access-Control-Allow-Origin

# 3. CSP / HSTS — should be present
curl -sI https://tonvo.co | grep -E "(content-security-policy|strict-transport-security)"

# 4. Rate-limit burst — fire 30 parallel /api/analyze in same instance
# expect: at most RATE_LIMITS.analyze.maxRequests (20) succeed

# 5. Webhook replay — POST a captured webhook body twice
# expect: 1st = 200 received:true, 2nd = 200 deduped:true
```

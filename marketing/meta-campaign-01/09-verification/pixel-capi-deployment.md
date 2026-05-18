# Meta Pixel + CAPI Deployment Guide

_Created 2026-05-03 by Phase 1c installation. Resolves launch blockers #1 (Pixel) + #2 (CAPI) + supports #3 (AEM priority)._

## What's now in the codebase

| File | Purpose |
|------|---------|
| `src/components/MetaPixel.tsx` | Base Pixel script loader (Next.js `<Script>`, `afterInteractive`). No-ops when `NEXT_PUBLIC_FB_PIXEL_ID` is unset. |
| `src/lib/meta-pixel.ts` | Helper API: `trackPixel`, `trackPixelCustom`, `trackSignup`, `mirrorToCAPI` with shared `event_id` for dedup. |
| `src/app/api/meta-capi/route.ts` | Server-side Conversions API endpoint. Hashes email/userId, mirrors event with same `event_id` as client Pixel call. |
| `src/app/layout.tsx` | Renders `<MetaPixel />` once at the body root → fires `PageView` site-wide. |
| `src/app/login/page.tsx` | Calls `trackSignup({ email, userId })` after both email/password registration AND Google new-user consent acceptance. |
| `.env.local.example` | Documents the 3 new env vars. |

## What Emilien must do

### Step 1 — Set up Pixel in Meta Business Manager

1. Go to [Meta Events Manager](https://business.facebook.com/events_manager2)
2. Data Sources → Connect Data Source → Web → Get started
3. Pick **Manually install Pixel** (we already wrote the code; just need the ID)
4. Name it `Tonvo Pixel`, copy the **Pixel ID** (15-16 digit number)

### Step 2 — Set up Conversions API access token

1. In Events Manager → your new Pixel → **Settings** tab
2. Scroll to **Conversions API** → **Generate access token**
3. Copy the token (starts with `EAA...`)

### Step 3 — Verify domain `tonvo.co`

1. Events Manager → **Brand Safety** → **Domains** → Add `tonvo.co`
2. Use **DNS verification** (recommended) — add the TXT record they give you to your domain DNS

### Step 4 — Set Aggregated Event Measurement priority

1. Events Manager → your Pixel → **Aggregated Event Measurement**
2. Set priorities for `tonvo.co`:
   - Priority 1: `CompleteRegistration` (= Signup, our primary KPI)
   - Priority 2: `Subscribe` (paid conversion — for week-2 retargeting)
   - Priority 3: `PageView`

### Step 5 — Deploy with env vars

Set these in your hosting environment (Vercel, etc.):

```bash
NEXT_PUBLIC_FB_PIXEL_ID=<the 15-16 digit pixel id>
FB_CAPI_ACCESS_TOKEN=<the EAA... access token>
FB_CAPI_TEST_EVENT_CODE=TEST<XXXX>  # ONLY during initial verification — remove for production
```

Deploy.

### Step 6 — Verify firing

1. Install the [Meta Pixel Helper Chrome extension](https://chrome.google.com/webstore/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
2. Open `https://tonvo.co/` in incognito → Pixel Helper should show:
   - Pixel ID detected
   - `PageView` event fired
3. Click "Try Free" → reach `/login`
4. Use a throwaway email or Google account, register
5. Pixel Helper should show `CompleteRegistration` event with content_name `tonvo_free_signup`
6. In Events Manager → **Test Events** panel (using `FB_CAPI_TEST_EVENT_CODE` from Step 5):
   - Confirm BOTH client browser event AND server CAPI event arrive
   - Confirm they DEDUPLICATE (same `event_id` shows up under "Deduplicated" column)

### Step 7 — Re-run the webapp test (proves resolution)

```bash
cd "c:/Users/emili/OneDrive/Documents/M1001/Code/Cue app"
python marketing/meta-campaign-01/09-verification/test-tonvo-landing.py
```

Expected output (after deploy with env vars set):
- `pixel_installed: true`
- `pageview_event_fired: true` with the captured `fbq` call args
- `pixel_id_detected: <your id>`

When all 3 are true, Phase 1c is verified end-to-end. Remove `FB_CAPI_TEST_EVENT_CODE` from prod env, redeploy.

## How the dedup works (so you can debug confidently)

When a user signs up:

1. Client (browser) calls `fbq('track', 'CompleteRegistration', {...}, { eventID: 'abc-123' })`
2. Same client immediately POSTs `/api/meta-capi` with `{ event: 'CompleteRegistration', eventId: 'abc-123', userData: { email, userId } }`
3. Server hashes email/userId with SHA256 (Meta requirement) and POSTs to `https://graph.facebook.com/v21.0/<pixel_id>/events` with the same `event_id: 'abc-123'`
4. Meta receives both events with the same `event_id` and counts them as ONE event for billing/optimization purposes — but ALSO uses the server signal to recover iOS-14+ events that the browser Pixel can't capture.

Net effect: ~25-40% more accurate signup attribution on iOS traffic vs Pixel-only.

## What this resolves

| Launch blocker | Status before | Status after |
|---|---|---|
| #1 — Meta Pixel installed on tonvo.co | FAIL (entirely absent) | ✅ Code shipped — pending env var + deploy |
| #2 — CAPI configured for iOS 14+ resilience | UNTESTABLE | ✅ Server route shipped — pending env var + deploy |
| #3 — Domain verified + AEM priorities | Manual step (Meta UI) | Documented above (Steps 3 + 4) |
| #4 — Hard budget cap | Awaiting Emilien | — |

## Note on the campaign brief naming

Earlier docs (00-brief.md, media-plan.md) referenced the event as `Signup`. Implementation fires both:
- **`CompleteRegistration`** (Meta standard event, what the algo optimizes against — preferred for the Sales objective in the campaign)
- **`Signup`** (custom event via `trackPixelCustom`, kept so the brief naming convention holds for reporting consistency)

Update the media plan's optimization event from `Signup` to `CompleteRegistration` (lower CPS — Meta optimizes better against standard events than custom ones).

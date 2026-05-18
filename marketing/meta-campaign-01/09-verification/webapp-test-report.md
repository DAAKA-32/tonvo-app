# Webapp Test Report — tonvo.co
_2026-05-03 · webapp-testing skill applied_

## Test environment
- Playwright (Python) version: **1.59.0**
- Browser: **Chromium headless** (1440x900 viewport, Chrome 124 UA)
- Test script: `09-verification/test-tonvo-landing.py`
- Inspection helper: `09-verification/inspect-tonvo.py`
- Methodology: `add_init_script` wraps `window.fbq` setter to intercept every call; console + network listeners capture errors and any request matching `facebook` / `fbq` / `pixel` / `fbevents`. Both `/` and `/login` are scrolled top-to-bottom to hydrate lazy sections before harvesting `document.body.innerText`.

## Launch blocker resolution

| Blocker | Status | Evidence |
| --- | --- | --- |
| Meta Pixel installed on tonvo.co | **FAIL** | `fbevents.js` occurrences in HTML: **0**. `fbq(` in HTML: **0**. `connect.facebook.net` in HTML: **0**. `window.fbq` after load: **undefined**. Network requests to `facebook.net`: **0**. No 15–16 digit numeric strings anywhere in the rendered HTML. Codebase grep for `fbq\|fbevents\|FacebookPixel\|MetaPixel\|FB_PIXEL` across `src/**/*.{ts,tsx,js,jsx,html}` returns zero real matches (the one hit in `src/app/dashboard/page.tsx:127` is the word `sub-pixel` in a CSS comment). |
| `Signup` event firing on /login | **UNTESTABLE-WITHOUT-ACCOUNT-CREATION** + **FAIL on prerequisites** | Cannot validate end-to-end without polluting user data. But the prerequisite is also failing: `window.fbq` is **undefined** on `/login`, so even if a `Signup` event were dispatched after form submit, there is no Pixel to receive it. |
| Page loads without critical errors | **PASS** | Landing console errors: **0** · Login console errors: **0** · Page errors: **0** on both routes. Only console output is one i18next info banner. HTTP status 200 on both. |
| Pricing display matches config (`pricing-config.ts` → `$0` / `$19` / `$49`) | **PASS** | All three prices and all three tier names found in rendered DOM body: `$0` at body index 4662 ("Starter"), `$19` at 4849 ("Closer", "/month"), `$49` at 5134 ("Sales Team", "/user/month"). Annual toggle `-30%` also present, matching `ANNUAL_DISCOUNT_PERCENT = 30`. |

## Detailed findings

### tonvo.co/ landing
- HTTP status: **200**
- Page load: domContentLoaded **202 ms**, load event **406 ms**, FCP **884 ms**, TTFB **24 ms** (very fast, edge-cached)
- Console errors: **0** (one info-level i18next banner from `_next/static/chunks/7f670ff8c1d2b329.js`)
- Page-level JS errors: **0**
- `fbq` calls captured: **[] (empty)**
- Network requests to `facebook.net` / `fbevents` / `pixel`: **[] (empty)**
- Pixel ID detected: **none**
- `window.fbq` typeof after `networkidle` + 1.5 s wait: **undefined**
- `<script src=...>` referencing facebook.com: **none** (the lone match in the inspection helper, `https://tonvo.co/_next/static/chunks/d2be314c3ece3fbe.js`, is a Next.js chunk hash that contains the substring `fbe` — false positive; substring search confirms zero `facebook` host references in any script src)
- Body text length: **6198 chars**, full landing copy intact including hero, pillars, testimonials, pricing, FAQ, footer
- Screenshot: `09-verification/screenshots/tonvo-landing.png` (full-page, 8796 px tall)
- Visual note: several scroll-triggered sections render mostly black in the headless screenshot because their reveal animations rely on intersection-observer + viewport visibility — this is a screenshot artifact, **not a rendering bug**: the DOM content is present (confirmed by `innerText` capture).

### tonvo.co/login
- HTTP status: **200**
- Page load: domContentLoaded **193 ms**, load event **426 ms**, FCP **456 ms**
- Console errors: **0** (same i18next info banner only)
- `fbq` calls captured: **[] (empty)**
- Form interactivity: **YES** — `input[type="email"]` is focusable + fillable (filled `test@example.com`, value round-tripped, then cleared without submit), `input[type="password"]` present, submit button "Sign In" visible. Google OAuth ("Continue with Google") present.
- Screenshot: `09-verification/screenshots/tonvo-login.png`

## What we could NOT verify (and why)
- **`Signup` event end-to-end firing** — would require creating an actual account, which would pollute user data and signup metrics. Recommend Emilien validates this manually with the Meta Pixel Helper Chrome extension after a real signup is performed.
- **CAPI (Conversions API) server-side firing** — server-to-server events do not appear in the browser. Verify in Meta Events Manager → Test Events panel (or check the backend webhook/edge-function logs).
- **Geo / consent-gated pixel loading** — if Pixel is intentionally gated behind a CMP cookie banner, the headless run did not consent. However: no CMP / cookie banner is present on `tonvo.co/` (no `OneTrust`, `Cookiebot`, `iubenda`, etc. detected), and no script tags with `data-consent` / `type="text/plain"` exist, so this is not the cause. Pixel is genuinely not deployed.

## Recommendations

1. **Pixel is not deployed at all.** This is a hard blocker for any Meta Ads spend that relies on Pixel-based attribution, lookalikes, or optimization. Highest priority.
2. **Add the base Meta Pixel snippet** to the root `layout.tsx` (or `_app.tsx`) so `PageView` fires on every route. Wrap it in a `<Script strategy="afterInteractive">` with `NEXT_PUBLIC_FB_PIXEL_ID`.
3. **Fire a `Signup` standard event** in the existing `/login` signup-success handler (`fbq('track', 'Signup')` or the more specific `'CompleteRegistration'`). Mirror server-side via CAPI for iOS 14.5+ resilience.
4. **Add `Lead` / `InitiateCheckout` / `Subscribe` events** at the corresponding funnel steps so the pixel can train on conversions, not just pageviews.
5. **Add a CMP** before launching paid traffic in the EU — currently no consent banner is shown. Without one, GDPR-compliant Pixel firing is at risk for the French / Belgian / German Meta audiences.
6. After deployment, re-run `09-verification/test-tonvo-landing.py` — the script will then show `pixel_installed: True` and capture the `PageView` call payload.

## Raw data
- `09-verification/test-results.json` (full structured output, every console message, every fbq call, every network request)
- `09-verification/landing-full.html` (136 KB rendered HTML snapshot for offline grep)
- `09-verification/landing-full-body.txt` (6.2 KB plain text snapshot)
- `09-verification/screenshots/tonvo-landing.png`
- `09-verification/screenshots/tonvo-login.png`
- `09-verification/test-tonvo-landing.py` (reproducible)
- `09-verification/inspect-tonvo.py` (reproducible deep-dive helper)

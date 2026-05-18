"""
Webapp test for tonvo.co — Meta Ads launch verification.

Verifies:
  1. Landing renders without console errors
  2. Pricing tiers match $0 / $19 / $49
  3. /login route loads + form is interactive
  4. Meta Pixel script loaded + fbq('init', ...) is called
  5. Captures every fbq('track', ...) / fbq('trackCustom', ...) during the session
  6. Console errors + network requests to facebook.net

Run: python test-tonvo-landing.py
Outputs: test-results.json + screenshots/tonvo-{landing,login}.png
"""

from __future__ import annotations

import json
import re
import sys
import time
from pathlib import Path
from typing import Any

from playwright.sync_api import (
    BrowserContext,
    ConsoleMessage,
    Page,
    Request,
    Response,
    sync_playwright,
)

HERE = Path(__file__).resolve().parent
SCREENSHOTS = HERE / "screenshots"
SCREENSHOTS.mkdir(parents=True, exist_ok=True)
RESULTS_PATH = HERE / "test-results.json"

LANDING_URL = "https://tonvo.co/"
LOGIN_URL = "https://tonvo.co/login"

# Inject BEFORE the page's own scripts so we can wrap fbq as soon as the
# Meta Pixel snippet creates it. Hooking a setter on `window.fbq` lets us
# capture the fbq function the snippet installs and wrap it transparently.
INIT_SCRIPT = r"""
(() => {
  window.__fbqCalls = [];
  window.__fbqInstalled = false;
  let _fbq;
  Object.defineProperty(window, 'fbq', {
    configurable: true,
    get() { return _fbq; },
    set(fn) {
      window.__fbqInstalled = true;
      const wrapped = function (...args) {
        try {
          window.__fbqCalls.push({
            args: JSON.parse(JSON.stringify(args, (k, v) =>
              typeof v === 'function' ? '[function]' : v)),
            time: Date.now(),
            url: location.href,
          });
        } catch (e) {
          window.__fbqCalls.push({args: ['<unserializable>'], time: Date.now(), url: location.href});
        }
        return typeof fn === 'function' ? fn.apply(this, args) : undefined;
      };
      // copy any properties Meta sets on fbq (e.g. queue, loaded, version)
      try {
        for (const k of Object.keys(fn || {})) wrapped[k] = fn[k];
      } catch (e) {}
      _fbq = wrapped;
      // also mirror to window._fbq (Meta's internal alias)
      try { window._fbq = wrapped; } catch (e) {}
    },
  });
})();
"""


def session_for_url(
    context: BrowserContext, url: str, label: str
) -> dict[str, Any]:
    """Open a single page, instrument it, navigate, screenshot, harvest."""
    console_messages: list[dict[str, Any]] = []
    page_errors: list[str] = []
    pixel_requests: list[dict[str, Any]] = []
    all_responses: list[dict[str, Any]] = []

    page: Page = context.new_page()

    def on_console(msg: ConsoleMessage) -> None:
        try:
            console_messages.append(
                {
                    "type": msg.type,
                    "text": msg.text,
                    "location": msg.location,
                }
            )
        except Exception as exc:
            console_messages.append({"type": "error", "text": f"<console capture failed: {exc}>"})

    def on_pageerror(err: Exception) -> None:
        page_errors.append(str(err))

    def on_request(req: Request) -> None:
        u = req.url
        if "facebook" in u or "fbq" in u or "pixel" in u or "fbevents" in u:
            pixel_requests.append(
                {
                    "url": u,
                    "method": req.method,
                    "resource_type": req.resource_type,
                }
            )

    def on_response(resp: Response) -> None:
        # capture only main document responses for status codes
        if resp.request.resource_type == "document":
            all_responses.append({"url": resp.url, "status": resp.status})

    page.on("console", on_console)
    page.on("pageerror", on_pageerror)
    page.on("request", on_request)
    page.on("response", on_response)

    t0 = time.time()
    nav_response = page.goto(url, wait_until="domcontentloaded", timeout=45_000)
    try:
        page.wait_for_load_state("networkidle", timeout=30_000)
    except Exception as exc:
        console_messages.append(
            {"type": "warning", "text": f"<networkidle timeout: {exc}>"}
        )
    elapsed_ms = int((time.time() - t0) * 1000)

    # give pixel a moment to fire deferred events
    page.wait_for_timeout(1500)

    # screenshot
    safe_label = re.sub(r"[^a-z0-9_-]", "-", label.lower())
    shot_path = SCREENSHOTS / f"tonvo-{safe_label}.png"
    page.screenshot(path=str(shot_path), full_page=True)

    # harvest fbq calls + page metrics
    fbq_calls = page.evaluate("window.__fbqCalls || []")
    fbq_installed = page.evaluate("!!window.__fbqInstalled")
    fbq_present = page.evaluate("typeof window.fbq === 'function'")
    fbq_version = page.evaluate("(window.fbq && window.fbq.version) || null")

    # detect pixel id from any init/trackSingle calls
    pixel_ids = set()
    for c in fbq_calls:
        args = c.get("args") or []
        if len(args) >= 2 and args[0] in ("init", "trackSingle", "trackSingleCustom"):
            pid = args[1]
            if isinstance(pid, str) and pid.isdigit():
                pixel_ids.add(pid)

    # also scan page HTML for fbevents.js script and pixel id literals
    html = page.content()
    has_fbevents_script = "connect.facebook.net" in html and "fbevents.js" in html
    pixel_id_in_html = re.findall(r"fbq\(\s*['\"]init['\"]\s*,\s*['\"](\d{6,})['\"]\)", html)
    pixel_ids.update(pixel_id_in_html)

    # performance timings via Performance API
    perf = page.evaluate(
        """() => {
          const nav = performance.getEntriesByType('navigation')[0];
          const paint = performance.getEntriesByType('paint');
          const fcp = paint.find(p => p.name === 'first-contentful-paint');
          return {
            ttfb_ms: nav ? Math.round(nav.responseStart - nav.requestStart) : null,
            domContentLoaded_ms: nav ? Math.round(nav.domContentLoadedEventEnd - nav.startTime) : null,
            loadEvent_ms: nav ? Math.round(nav.loadEventEnd - nav.startTime) : null,
            fcp_ms: fcp ? Math.round(fcp.startTime) : null,
          };
        }"""
    )

    # scroll all the way down so lazy-rendered sections (pricing) hydrate
    page.evaluate("""async () => {
        await new Promise(res => {
            let y = 0;
            const step = () => {
                window.scrollTo(0, y);
                y += 600;
                if (y >= document.body.scrollHeight) return res();
                setTimeout(step, 80);
            };
            step();
        });
    }""")
    page.wait_for_timeout(1500)
    page.evaluate("window.scrollTo(0, 0)")
    page.wait_for_timeout(500)

    # body text snapshot for downstream checks (pricing etc.)
    body_text_full = page.evaluate("document.body.innerText")
    body_text = body_text_full  # keep full body now (~6KB)

    # capture all <script src=...> for visibility
    script_srcs = page.eval_on_selector_all("script[src]", "els => els.map(e => e.src)")

    page.close()

    return {
        "url": url,
        "label": label,
        "http_status": nav_response.status if nav_response else None,
        "navigated_in_ms": elapsed_ms,
        "console_messages": console_messages,
        "console_error_count": sum(1 for m in console_messages if m["type"] == "error"),
        "page_errors": page_errors,
        "fbq_calls": fbq_calls,
        "fbq_installed": fbq_installed,
        "fbq_present_after_load": fbq_present,
        "fbq_version": fbq_version,
        "pixel_ids_detected": sorted(pixel_ids),
        "has_fbevents_script_in_html": has_fbevents_script,
        "pixel_requests": pixel_requests,
        "performance": perf,
        "screenshot": str(shot_path.relative_to(HERE)).replace("\\", "/"),
        "body_text_full_length": len(body_text),
        "body_text_excerpt": body_text[:8000],
        "script_srcs_with_fb": [s for s in script_srcs if "facebook" in s.lower()],
        "main_documents": all_responses,
    }


def check_pricing(landing_body: str) -> dict[str, Any]:
    """Check that $0, $19, $49 prices appear on landing."""
    found = {}
    for needle in ("$0", "$19", "$49"):
        found[needle] = needle in landing_body
    # Also check the names
    name_hits = {
        name: name.lower() in landing_body.lower()
        for name in ("Starter", "Closer", "Sales Team")
    }
    return {
        "prices_found": found,
        "all_prices_present": all(found.values()),
        "tier_names_found": name_hits,
        "all_names_present": all(name_hits.values()),
    }


def check_login_form(context: BrowserContext) -> dict[str, Any]:
    """Briefly re-open /login to verify form interactivity (no submission)."""
    page = context.new_page()
    page.goto(LOGIN_URL, wait_until="domcontentloaded", timeout=30_000)
    try:
        page.wait_for_load_state("networkidle", timeout=15_000)
    except Exception:
        pass

    info: dict[str, Any] = {"url": LOGIN_URL}
    try:
        # try common email-input selectors
        candidates = [
            'input[type="email"]',
            'input[name="email"]',
            'input[id*="email" i]',
            'input[placeholder*="email" i]',
        ]
        email_input = None
        for sel in candidates:
            loc = page.locator(sel).first
            if loc.count() > 0:
                email_input = loc
                info["email_selector"] = sel
                break

        if email_input is not None:
            email_input.scroll_into_view_if_needed(timeout=5_000)
            email_input.click(timeout=5_000)
            email_input.fill("test@example.com", timeout=5_000)
            value = email_input.input_value()
            info["email_focusable"] = True
            info["email_fillable"] = value == "test@example.com"
            email_input.fill("")  # clear so we don't pollute anything
        else:
            info["email_focusable"] = False
            info["email_fillable"] = False

        # password input present?
        pw = page.locator('input[type="password"]').first
        info["password_input_present"] = pw.count() > 0

        # submit/CTA button visible?
        btn = page.locator('button[type="submit"], button:has-text("Sign"), button:has-text("Log in"), button:has-text("Continue")').first
        info["submit_button_visible"] = btn.count() > 0 and btn.is_visible()
    except Exception as exc:
        info["error"] = str(exc)
    finally:
        page.close()
    return info


def main() -> int:
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={"width": 1440, "height": 900},
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
        )
        context.add_init_script(INIT_SCRIPT)

        landing = session_for_url(context, LANDING_URL, "landing")
        login = session_for_url(context, LOGIN_URL, "login")

        pricing = check_pricing(landing["body_text_excerpt"])
        login_form = check_login_form(context)

        results = {
            "tested_at_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "playwright_python_version": "1.59.0",
            "browser": "chromium-headless",
            "landing": landing,
            "login": login,
            "pricing_check": pricing,
            "login_form_check": login_form,
            "summary": {
                "pixel_installed": (
                    landing["has_fbevents_script_in_html"]
                    and landing["fbq_present_after_load"]
                    and len(landing["pixel_ids_detected"]) > 0
                ),
                "pageview_fired_on_landing": any(
                    (c.get("args") or [None])[0] == "track"
                    and (len(c.get("args") or []) > 1 and c["args"][1] == "PageView")
                    for c in landing["fbq_calls"]
                ),
                "any_track_on_login": any(
                    (c.get("args") or [None])[0] in ("track", "trackCustom")
                    for c in login["fbq_calls"]
                ),
                "landing_console_errors": landing["console_error_count"],
                "login_console_errors": login["console_error_count"],
                "pricing_match": pricing["all_prices_present"]
                and pricing["all_names_present"],
                "login_form_interactive": bool(
                    login_form.get("email_focusable")
                    and login_form.get("email_fillable")
                ),
            },
        }

        RESULTS_PATH.write_text(json.dumps(results, indent=2, default=str), encoding="utf-8")

        # quick summary to stdout
        s = results["summary"]
        print("=" * 60)
        print("TONVO.CO LAUNCH VERIFICATION")
        print("=" * 60)
        for k, v in s.items():
            print(f"  {k}: {v}")
        print(f"\nResults written to: {RESULTS_PATH}")
        print(f"Screenshots: {SCREENSHOTS}")

        context.close()
        browser.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())

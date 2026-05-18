"""Quick inspection: pull full rendered HTML + body text from tonvo.co
   so we can confirm pricing presence and pixel tags."""
import re
from pathlib import Path
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={"width": 1440, "height": 900})
    page = ctx.new_page()
    page.goto("https://tonvo.co/", wait_until="domcontentloaded", timeout=45_000)
    try:
        page.wait_for_load_state("networkidle", timeout=30_000)
    except Exception:
        pass
    page.wait_for_timeout(2000)

    # scroll to bottom to trigger lazy/intersection-observer rendering
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

    body = page.evaluate("document.body.innerText")
    html = page.content()

    (HERE / "landing-full-body.txt").write_text(body, encoding="utf-8")
    (HERE / "landing-full.html").write_text(html, encoding="utf-8")

    print("Body length:", len(body))
    print("HTML length:", len(html))

    print("\n--- Pricing-related body matches ---")
    for needle in ("$0", "$19", "$49", "Starter", "Closer", "Sales Team", "Pricing", "/month"):
        idx = body.find(needle)
        if idx >= 0:
            print(f"  '{needle}' found at body index {idx}: ...{body[max(0, idx-30):idx+50]!r}...")
        else:
            print(f"  '{needle}' NOT found in body")

    print("\n--- Pixel/fb traces in HTML ---")
    for needle in ("fbevents.js", "connect.facebook.net", "fbq(", "fbq ", "_fbq", "facebook-pixel", "fbpixel"):
        n = html.lower().count(needle.lower())
        print(f"  '{needle}' occurrences in HTML: {n}")

    # find any data-pixel-id or pixel id literals
    pid = re.findall(r"['\"](\d{15,16})['\"]", html)  # FB pixel IDs are typically 15-16 digits
    print(f"  15-16 digit numeric strings (possible pixel IDs): {set(pid)}")

    # Get all script src URLs
    srcs = page.eval_on_selector_all("script[src]", "els => els.map(e => e.src)")
    fb_srcs = [s for s in srcs if "facebook" in s.lower() or "fb" in s.lower()]
    print(f"\n  Scripts referencing facebook/fb ({len(fb_srcs)}):")
    for s in fb_srcs:
        print("   ", s)

    # Also check for any GTM/gtag/analytics
    print("\n--- Other analytics traces ---")
    for needle in ("googletagmanager", "gtag(", "google-analytics", "ga(", "plausible", "umami", "posthog", "segment", "rudder"):
        n = html.lower().count(needle.lower())
        if n > 0:
            print(f"  '{needle}' in HTML: {n}")

    browser.close()

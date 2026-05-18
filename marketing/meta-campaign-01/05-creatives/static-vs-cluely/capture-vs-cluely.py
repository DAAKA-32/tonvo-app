"""
Capture vs-cluely comparison static via Playwright.

Generates 4 PNGs in this folder:
  - static-vs-cluely-en-1x1.png   (1080x1080, EN)
  - static-vs-cluely-en-4x5.png   (1080x1350, EN)
  - static-vs-cluely-fr-1x1.png   (1080x1080, FR)
  - static-vs-cluely-fr-4x5.png   (1080x1350, FR)

Run from this directory:
  python capture-vs-cluely.py
"""
from pathlib import Path
from playwright.sync_api import sync_playwright

HERE = Path(__file__).parent.resolve()
HTML_FILE = (HERE / "static-vs-cluely.html").as_uri()

LANGS = ["en", "fr"]
ASPECTS = [
    ("1x1", 1080, 1080),
    ("4x5", 1080, 1350),
]


def main():
    outputs = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for lang in LANGS:
            for aspect_name, w, h in ASPECTS:
                page = browser.new_page(
                    viewport={"width": w, "height": h},
                    device_scale_factor=2,
                )
                page.goto(f"{HTML_FILE}?lang={lang}&aspect={aspect_name}")
                page.wait_for_load_state("networkidle")
                page.wait_for_function("document.fonts.ready", timeout=10_000)
                page.wait_for_timeout(400)

                out_path = HERE / f"static-vs-cluely-{lang}-{aspect_name}.png"
                page.screenshot(path=str(out_path), omit_background=False, full_page=False)
                outputs.append(out_path)
                print(f"  wrote {out_path.name}  ({w}x{h})")
                page.close()
        browser.close()
    print(f"\nDone. {len(outputs)} PNGs in {HERE}")


if __name__ == "__main__":
    main()

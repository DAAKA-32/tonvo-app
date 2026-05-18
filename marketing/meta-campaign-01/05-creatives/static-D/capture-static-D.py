"""
Capture Brief D statics via Playwright.

Generates 6 PNGs in this folder:
  - static-D-A-1x1.png   (Pattern 6 lead, 1080x1080)
  - static-D-A-4x5.png   (Pattern 6 lead, 1080x1350)
  - static-D-B-1x1.png   (Hook 1 alternate, 1080x1080)
  - static-D-B-4x5.png   (Hook 1 alternate, 1080x1350)
  - static-D-C-1x1.png   (Variant C — flagged for tone-check; ship only on Emilien sign-off)
  - static-D-C-4x5.png

Run from this directory:
  python capture-static-D.py
"""
from pathlib import Path
from playwright.sync_api import sync_playwright

HERE = Path(__file__).parent.resolve()
HTML_FILE = (HERE / "static-D.html").as_uri()

VARIANTS = ["A", "B", "C"]
ASPECTS = [
    ("1x1", 1080, 1080),
    ("4x5", 1080, 1350),
]


def main():
    outputs = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for variant in VARIANTS:
            for aspect_name, w, h in ASPECTS:
                page = browser.new_page(viewport={"width": w, "height": h}, device_scale_factor=2)
                page.goto(f"{HTML_FILE}?v={variant}&aspect={aspect_name}")
                # Wait for fonts + layout
                page.wait_for_load_state("networkidle")
                page.wait_for_function("document.fonts.ready", timeout=10_000)
                page.wait_for_timeout(400)  # let drop-shadows settle

                out_path = HERE / f"static-D-{variant}-{aspect_name}.png"
                page.screenshot(path=str(out_path), omit_background=False, full_page=False)
                outputs.append(out_path)
                print(f"  wrote {out_path.name}  ({w}x{h})")
                page.close()
        browser.close()
    print(f"\nDone. {len(outputs)} PNGs in {HERE}")


if __name__ == "__main__":
    main()

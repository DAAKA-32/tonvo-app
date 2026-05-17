import { describe, it, expect } from "vitest";
import { detectOSFromUA, downloadUrl, type OS } from "./detect-os";

describe("detectOSFromUA", () => {
  const cases: Array<[string, OS]> = [
    [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36",
      "windows",
    ],
    [
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 Version/17.5 Safari/605.1.15",
      "macos",
    ],
    [
      "Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0",
      "linux",
    ],
    [
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15",
      "unknown",
    ],
    ["", "unknown"],
  ];

  it.each(cases)("classifies %s as %s", (ua, expected) => {
    expect(detectOSFromUA(ua)).toBe(expected);
  });
});

describe("downloadUrl", () => {
  const REPO = "https://github.com/DAAKA-32/cue-desktop/releases/latest/download";

  it("windows → Cue-Setup.exe", () => {
    expect(downloadUrl("windows")).toBe(`${REPO}/Cue-Setup.exe`);
  });
  it("macos → Cue-aarch64.dmg", () => {
    expect(downloadUrl("macos")).toBe(`${REPO}/Cue-aarch64.dmg`);
  });
  it("linux → Cue.AppImage", () => {
    expect(downloadUrl("linux")).toBe(`${REPO}/Cue.AppImage`);
  });
  it("unknown → repo releases page", () => {
    expect(downloadUrl("unknown")).toBe(
      "https://github.com/DAAKA-32/cue-desktop/releases/latest",
    );
  });
});

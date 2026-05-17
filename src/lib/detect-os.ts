export type OS = "windows" | "macos" | "linux" | "unknown";

const REPO_BASE = "https://github.com/DAAKA-32/cue-desktop/releases";

export function detectOSFromUA(ua: string): OS {
  if (!ua) return "unknown";
  if (/iPhone|iPad|iPod|Android/i.test(ua)) return "unknown";
  if (/Windows/i.test(ua)) return "windows";
  if (/Mac OS X|Macintosh/i.test(ua)) return "macos";
  if (/Linux|X11/i.test(ua)) return "linux";
  return "unknown";
}

export function detectOS(): OS {
  if (typeof navigator === "undefined") return "unknown";
  return detectOSFromUA(navigator.userAgent ?? "");
}

export function downloadUrl(os: OS): string {
  switch (os) {
    case "windows":
      return `${REPO_BASE}/latest/download/Cue-Setup.exe`;
    case "macos":
      return `${REPO_BASE}/latest/download/Cue-aarch64.dmg`;
    case "linux":
      return `${REPO_BASE}/latest/download/Cue.AppImage`;
    case "unknown":
    default:
      return `${REPO_BASE}/latest`;
  }
}

export function osLabel(os: OS): string {
  switch (os) {
    case "windows":
      return "Windows";
    case "macos":
      return "macOS";
    case "linux":
      return "Linux";
    default:
      return "your device";
  }
}

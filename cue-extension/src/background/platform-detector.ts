import { PLATFORM_PATTERNS } from "../shared/constants";

export type Platform = "meet" | "zoom" | "teams" | null;

export function detectPlatform(url: string): Platform {
  for (const [platform, pattern] of Object.entries(PLATFORM_PATTERNS)) {
    if (pattern.test(url)) return platform as Platform;
  }
  return null;
}

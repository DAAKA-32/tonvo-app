import type { SpeakerSegment } from "@/types/analysis";

/** Helpers for the AssemblyAI pre-recorded fallback (/api/transcribe). */

// Languages AssemblyAI's universal models accept as `language_code`.
const SUPPORTED_LANG = new Set([
  "en", "fr", "es", "de", "it", "pt", "nl", "hi", "ja", "zh", "fi", "ko", "pl", "ru", "tr", "uk", "vi",
]);

/** Convert a locale or ISO code ("fr-FR", "fr") to a supported ISO-639-1 code. */
export function toLanguageCode(lang: string | null | undefined): string | null {
  if (!lang) return null;
  const short = lang.toLowerCase().trim().slice(0, 2);
  return SUPPORTED_LANG.has(short) ? short : null;
}

export interface AaiUtterance {
  speaker: string;
  text: string;
  start: number; // ms
  end: number; // ms
}

/** Map AssemblyAI utterances to our SpeakerSegment shape. */
export function toSpeakerSegments(utterances: AaiUtterance[] | null | undefined): SpeakerSegment[] {
  if (!Array.isArray(utterances)) return [];
  return utterances
    .filter((u) => u && typeof u.text === "string" && u.text.trim())
    .map((u) => ({
      speaker: `Speaker ${u.speaker}`,
      text: u.text.trim(),
      start: (u.start ?? 0) / 1000,
      end: (u.end ?? 0) / 1000,
    }));
}

/** AssemblyAI errors that just mean "nothing to transcribe". */
export function isEmptyAudioError(message: string | undefined): boolean {
  return !!message && /no spoken audio|too short|duration|does not appear to contain audio/i.test(message);
}

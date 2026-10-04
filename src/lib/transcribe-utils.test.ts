import { describe, it, expect } from "vitest";
import { isEmptyAudioError, toLanguageCode, toSpeakerSegments } from "./transcribe-utils";

describe("transcribe-utils", () => {
  it("maps utterances to speaker segments in seconds", () => {
    expect(
      toSpeakerSegments([
        { speaker: "A", text: " Hello. ", start: 1200, end: 2500 },
        { speaker: "B", text: "", start: 2600, end: 2700 },
        { speaker: "B", text: "Price?", start: 3000, end: 3900 },
      ]),
    ).toEqual([
      { speaker: "Speaker A", text: "Hello.", start: 1.2, end: 2.5 },
      { speaker: "Speaker B", text: "Price?", start: 3, end: 3.9 },
    ]);
    expect(toSpeakerSegments(null)).toEqual([]);
  });

  it("normalizes language hints", () => {
    expect(toLanguageCode("fr-FR")).toBe("fr");
    expect(toLanguageCode("ja")).toBe("ja");
    expect(toLanguageCode("sv-SE")).toBeNull();
    expect(toLanguageCode(null)).toBeNull();
  });

  it("treats silence errors as empty transcripts", () => {
    expect(isEmptyAudioError("Audio duration is too short.")).toBe(true);
    expect(isEmptyAudioError("No spoken audio found")).toBe(true);
    expect(isEmptyAudioError("Internal server error")).toBe(false);
  });
});

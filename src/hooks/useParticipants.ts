import { useState, useCallback, useRef } from "react";
import type { SpeakerSegment } from "@/types/analysis";

export interface Participant {
  id: string;        // "speaker_1", "speaker_2", etc.
  label: string;     // Translated: "You", "Participant 1", etc.
  isUser: boolean;
  lastActive: number; // timestamp of last speech
  totalSegments: number;
}

/**
 * Tracks participants detected from speaker-diarized transcript segments.
 *
 * "Speaker 1" is assumed to be the user (first to speak in most cases,
 * since the mic captures the user's audio first).
 *
 * @param labelYou - Translated label for the user (e.g. "You", "Toi")
 * @param labelParticipant - Translated template for others (e.g. "Participant {{n}}")
 */
export function useParticipants(labelYou = "You", labelParticipant = "Participant {{n}}") {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const seenSpeakers = useRef<Map<string, Participant>>(new Map());

  const updateFromSegments = useCallback((speakerSegments: SpeakerSegment[]) => {
    if (!speakerSegments || speakerSegments.length === 0) return;

    const now = Date.now();
    let changed = false;

    for (const seg of speakerSegments) {
      const key = seg.speaker; // "Speaker 1", "Speaker 2"
      const existing = seenSpeakers.current.get(key);

      if (existing) {
        existing.lastActive = now;
        existing.totalSegments += 1;
        changed = true;
      } else {
        // First speaker detected is assumed to be the user
        const isUser = seenSpeakers.current.size === 0;
        const participantIndex = seenSpeakers.current.size;
        const participant: Participant = {
          id: `speaker_${participantIndex + 1}`,
          label: isUser ? labelYou : labelParticipant.replace("{{n}}", String(participantIndex)),
          isUser,
          lastActive: now,
          totalSegments: 1,
        };
        seenSpeakers.current.set(key, participant);
        changed = true;
      }
    }

    if (changed) {
      setParticipants(Array.from(seenSpeakers.current.values()));
    }
  }, [labelYou, labelParticipant]);

  const reset = useCallback(() => {
    seenSpeakers.current.clear();
    setParticipants([]);
  }, []);

  return { participants, updateFromSegments, reset };
}

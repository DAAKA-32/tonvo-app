import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { verifyAuth } from "@/lib/auth-server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Simple pause-based speaker segmentation.
// Whisper returns word-level timestamps; gaps > PAUSE_THRESHOLD suggest a speaker change.
const PAUSE_THRESHOLD = 1.5; // seconds

interface WhisperWord {
  word: string;
  start: number;
  end: number;
}

interface WhisperVerboseResponse {
  text: string;
  language: string;
  segments?: Array<{ start: number; end: number; text: string }>;
  words?: WhisperWord[];
}

export interface SpeakerSegment {
  speaker: string; // "Speaker 1", "Speaker 2"
  text: string;
  start: number;
  end: number;
}

function segmentBySpeaker(words: WhisperWord[]): SpeakerSegment[] {
  if (!words || words.length === 0) return [];

  const segments: SpeakerSegment[] = [];
  let currentSpeaker = 0; // 0-indexed
  let currentWords: string[] = [words[0].word];
  let segStart = words[0].start;
  let prevEnd = words[0].end;

  for (let i = 1; i < words.length; i++) {
    const gap = words[i].start - prevEnd;

    if (gap >= PAUSE_THRESHOLD) {
      // Pause detected -> potential speaker switch
      segments.push({
        speaker: `Speaker ${currentSpeaker + 1}`,
        text: currentWords.join("").trim(),
        start: segStart,
        end: prevEnd,
      });
      currentSpeaker = (currentSpeaker + 1) % 2; // alternate between 2 speakers
      currentWords = [words[i].word];
      segStart = words[i].start;
    } else {
      currentWords.push(words[i].word);
    }
    prevEnd = words[i].end;
  }

  // Push final segment
  if (currentWords.length > 0) {
    segments.push({
      speaker: `Speaker ${currentSpeaker + 1}`,
      text: currentWords.join("").trim(),
      start: segStart,
      end: prevEnd,
    });
  }

  return segments;
}

export async function POST(req: NextRequest) {
  const authUser = await verifyAuth(req);
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!OPENAI_API_KEY) {
    return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
  }

  // Rate limit by IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "unknown";
  const rl = checkRateLimit(`transcribe:${ip}`, RATE_LIMITS.transcribe);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded", retryAfterMs: rl.retryAfterMs }, { status: 429 });
  }

  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;
    const language = (formData.get("language") as string | null) || undefined;

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    // Reject empty or too-small audio blobs (< 1KB is almost certainly silence/noise)
    if (audioFile.size < 1000) {
      return NextResponse.json({ text: "", language: null, speakerSegments: [] });
    }

    // Determine the correct file extension from the MIME type
    const mimeType = audioFile.type || "audio/webm";
    const extMap: Record<string, string> = {
      "audio/webm": "webm",
      "audio/webm;codecs=opus": "webm",
      "audio/ogg": "ogg",
      "audio/ogg;codecs=opus": "ogg",
      "audio/mp4": "mp4",
      "audio/mpeg": "mp3",
      "audio/wav": "wav",
      "audio/flac": "flac",
    };
    const ext = extMap[mimeType] || "webm";
    const filename = `audio.${ext}`;

    // Send the original File directly — do NOT re-wrap in a new Blob
    // (re-wrapping strips the internal audio container headers Whisper needs)
    const whisperForm = new FormData();
    whisperForm.append("file", audioFile, filename);
    whisperForm.append("model", "whisper-1");
    whisperForm.append("response_format", "verbose_json");
    whisperForm.append("timestamp_granularities[]", "word");

    // If language specified, use it. Otherwise let Whisper auto-detect.
    if (language) {
      whisperForm.append("language", language);
    }

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: whisperForm,
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("Whisper API error:", response.status, errBody);
      // Return empty transcript instead of 500 for transient Whisper errors
      if (response.status === 400) {
        // Bad audio format or too short -- return empty instead of crashing
        return NextResponse.json({ text: "", language: null, speakerSegments: [] });
      }
      return NextResponse.json(
        { error: `Whisper API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data: WhisperVerboseResponse = await response.json();

    // Build speaker segments from word-level timestamps
    const speakerSegments = data.words ? segmentBySpeaker(data.words) : [];

    return NextResponse.json({
      text: data.text,
      language: data.language || null,
      speakerSegments,
    });
  } catch (error) {
    console.error("Transcription error:", error instanceof Error ? error.message : error);
    // Return empty transcript on network/parsing errors to avoid crashing the session
    return NextResponse.json({ text: "", language: null, speakerSegments: [] });
  }
}

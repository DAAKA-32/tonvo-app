import { NextRequest, NextResponse } from "next/server";
import { RATE_LIMITS } from "@/lib/rate-limit";
import { verifyAuth } from "@/lib/auth-server";
import {
  AUDIO_BODY_LIMIT,
  getClientIp,
  rateLimitGuard,
} from "@/lib/security";
import type { SpeakerSegment } from "@/types/analysis";
import {
  isEmptyAudioError,
  toLanguageCode,
  toSpeakerSegments,
  type AaiUtterance,
} from "@/lib/transcribe-utils";

/**
 * POST /api/transcribe
 *
 * Batch transcription of one recorded chunk (~5 s). Used as the fallback when
 * live streaming is unavailable. Backed by AssemblyAI pre-recorded:
 * upload → create transcript → poll. Typical latency 2.5–5 s.
 *
 * Returns: { text, language, speakerSegments }
 */

export const maxDuration = 30;

const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;
const AAI_BASE = "https://api.assemblyai.com/v2";
const POLL_INTERVAL_MS = 400;
const DEADLINE_MS = 20_000;

// Allow-list of audio MIME types (compared without whitespace).
const ALLOWED_AUDIO_MIME = new Set([
  "audio/webm",
  "audio/webm;codecs=opus",
  "audio/ogg",
  "audio/ogg;codecs=opus",
  "audio/mp4",
  "audio/mpeg",
  "audio/wav",
  "audio/x-wav",
  "audio/flac",
]);

const EMPTY = { text: "", language: null, speakerSegments: [] as SpeakerSegment[] };

interface AaiTranscript {
  id: string;
  status: "queued" | "processing" | "completed" | "error";
  text?: string | null;
  language_code?: string | null;
  utterances?: AaiUtterance[] | null;
  error?: string;
}

export async function POST(req: NextRequest) {
  const authUser = await verifyAuth(req);
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!ASSEMBLYAI_API_KEY) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  // Reject oversized payloads before formData() buffers anything.
  const lenHeader = req.headers.get("content-length");
  if (lenHeader && Number(lenHeader) > AUDIO_BODY_LIMIT) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  const ip = getClientIp(req);
  const rateLimited = await rateLimitGuard(
    "transcribe",
    `${authUser.uid}:${ip}`,
    RATE_LIMITS.transcribe,
  );
  if (rateLimited) return rateLimited;

  let audioFile: File | null;
  let language: string | null;
  try {
    const formData = await req.formData();
    audioFile = formData.get("audio") as File | null;
    language = formData.get("language") as string | null;
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  if (!audioFile) {
    return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
  }
  if (audioFile.size > AUDIO_BODY_LIMIT) {
    return NextResponse.json({ error: "Audio file too large" }, { status: 413 });
  }
  // < 1 KB is almost certainly silence/noise
  if (audioFile.size < 1000) {
    return NextResponse.json(EMPTY);
  }

  const mimeType = (audioFile.type || "audio/webm").toLowerCase().replace(/\s+/g, "");
  if (!ALLOWED_AUDIO_MIME.has(mimeType)) {
    return NextResponse.json({ error: "Unsupported audio format" }, { status: 415 });
  }

  const deadline = Date.now() + DEADLINE_MS;
  const headers = { authorization: ASSEMBLYAI_API_KEY };

  try {
    // 1) Upload the raw bytes
    const uploadRes = await fetch(`${AAI_BASE}/upload`, {
      method: "POST",
      headers: { ...headers, "content-type": "application/octet-stream" },
      body: Buffer.from(await audioFile.arrayBuffer()),
      signal: AbortSignal.timeout(DEADLINE_MS),
    });
    if (!uploadRes.ok) {
      console.error("[transcribe] AssemblyAI upload error:", uploadRes.status);
      return NextResponse.json({ error: "Transcription provider error" }, { status: 502 });
    }
    const { upload_url } = (await uploadRes.json()) as { upload_url?: string };
    if (!upload_url) {
      return NextResponse.json({ error: "Transcription provider error" }, { status: 502 });
    }

    // 2) Create the transcript job
    const languageCode = toLanguageCode(language);
    const createRes = await fetch(`${AAI_BASE}/transcript`, {
      method: "POST",
      headers: { ...headers, "content-type": "application/json" },
      body: JSON.stringify({
        audio_url: upload_url,
        speech_models: ["universal-3-5-pro", "universal-2"],
        speaker_labels: true,
        ...(languageCode ? { language_code: languageCode } : { language_detection: true }),
      }),
      signal: AbortSignal.timeout(Math.max(1_000, deadline - Date.now())),
    });
    if (!createRes.ok) {
      const detail = await createRes.text().catch(() => "");
      console.error("[transcribe] AssemblyAI create error:", createRes.status, detail.slice(0, 200));
      return NextResponse.json({ error: "Transcription provider error" }, { status: 502 });
    }
    let transcript = (await createRes.json()) as AaiTranscript;

    // 3) Poll until done
    while (transcript.status !== "completed" && transcript.status !== "error") {
      if (Date.now() + POLL_INTERVAL_MS > deadline) {
        console.error("[transcribe] AssemblyAI poll timeout");
        return NextResponse.json({ error: "Transcription timeout" }, { status: 504 });
      }
      await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
      const pollRes = await fetch(`${AAI_BASE}/transcript/${transcript.id}`, {
        headers,
        signal: AbortSignal.timeout(Math.max(1_000, deadline - Date.now())),
      });
      if (!pollRes.ok) {
        console.error("[transcribe] AssemblyAI poll error:", pollRes.status);
        return NextResponse.json({ error: "Transcription provider error" }, { status: 502 });
      }
      transcript = (await pollRes.json()) as AaiTranscript;
    }

    if (transcript.status === "error") {
      if (isEmptyAudioError(transcript.error)) return NextResponse.json(EMPTY);
      console.error("[transcribe] AssemblyAI transcript error:", transcript.error?.slice(0, 200));
      return NextResponse.json({ error: "Transcription failed" }, { status: 502 });
    }

    return NextResponse.json({
      text: transcript.text ?? "",
      language: transcript.language_code ?? languageCode ?? null,
      speakerSegments: toSpeakerSegments(transcript.utterances),
    });
  } catch (error) {
    const isTimeout = error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
    console.error("[transcribe] error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: isTimeout ? "Transcription timeout" : "Transcription failed" },
      { status: isTimeout ? 504 : 502 },
    );
  }
}

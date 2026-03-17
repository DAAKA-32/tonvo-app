import { getSettings } from "../shared/storage";
import type { ToneResult } from "../shared/types";

async function getBaseUrl(): Promise<string> {
  const settings = await getSettings();
  return settings.apiBaseUrl;
}

export async function transcribeAudio(audioData: number[]): Promise<string> {
  const baseUrl = await getBaseUrl();
  const blob = new Blob([new Uint8Array(audioData)], { type: "audio/webm" });
  const formData = new FormData();
  formData.append("audio", blob, "audio.webm");

  const res = await fetch(`${baseUrl}/api/transcribe`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error(`Transcribe failed: ${res.status}`);
  const data = await res.json();
  return data.text || "";
}

export async function analyzeText(
  text: string,
  conversationSummary?: string,
  recentSegments?: Array<{ text: string; tone: string }>
): Promise<ToneResult> {
  const baseUrl = await getBaseUrl();

  const res = await fetch(`${baseUrl}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      conversationSummary: conversationSummary || undefined,
      recentSegments: recentSegments || [],
    }),
  });

  if (!res.ok) throw new Error(`Analyze failed: ${res.status}`);
  return res.json();
}

export async function updateConversationContext(
  previousSummary: string | null,
  newSegments: Array<{ text: string; tone: string; signal?: string; signalLabel?: string }>
): Promise<string> {
  const baseUrl = await getBaseUrl();

  const res = await fetch(`${baseUrl}/api/conversation-context`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ previousSummary, newSegments }),
  });

  if (!res.ok) throw new Error(`Context update failed: ${res.status}`);
  const data = await res.json();
  return data.summary || "";
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const baseUrl = await getBaseUrl();
    const res = await fetch(`${baseUrl}/api/transcribe`, {
      method: "OPTIONS",
    });
    return res.ok || res.status === 204 || res.status === 405;
  } catch {
    return false;
  }
}

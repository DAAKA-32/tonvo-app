import { authFetch } from "@/lib/api-client";

/**
 * Browser-side access to the user's sessions. Everything goes through the
 * authenticated /api/conversations routes: the browser never queries Supabase
 * directly (RLS denies the public anon key).
 */

const TONES = new Set(["positive", "neutral", "negative", "hesitant"]);

/** Clamp any tone-ish value to the four the database accepts. */
export function toDbTone(value: unknown): "positive" | "neutral" | "negative" | "hesitant" {
  return typeof value === "string" && TONES.has(value)
    ? (value as "positive" | "neutral" | "negative" | "hesitant")
    : "neutral";
}

/** AI output is loosely typed: keep only strings in list fields. */
export function toStringList(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((v) => (typeof v === "string" ? v : JSON.stringify(v))).filter(Boolean).slice(0, 20);
}

/** Keep only finite numbers in a score object. */
export function toScore(value: unknown): Record<string, number> | undefined {
  if (!value || typeof value !== "object") return undefined;
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    const n = typeof v === "number" ? v : Number(v);
    if (Number.isFinite(n)) out[k] = n;
  }
  return out;
}

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`${res.url} → ${res.status}`);
  return (await res.json()) as T;
}

export async function createConversation(title: string): Promise<string | null> {
  try {
    const res = await authFetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.slice(0, 200) }),
    });
    return (await json<{ id: string }>(res)).id;
  } catch (err) {
    console.error("[conversations] create failed:", err);
    return null;
  }
}

export async function updateConversation(id: string, fields: Record<string, unknown>): Promise<boolean> {
  // Drop undefined keys: the route rejects unknown or empty payloads.
  const body = Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined));
  try {
    const res = await authFetch(`/api/conversations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    await json(res);
    return true;
  } catch (err) {
    console.error("[conversations] update failed:", err);
    return false;
  }
}

export interface SegmentRow {
  timestamp: number;
  transcript: string;
  tone: string;
  confidence: number;
  suggestion?: string | null;
}

export async function saveSegments(id: string, rows: SegmentRow[]): Promise<boolean> {
  const segments = rows
    .filter((r) => r.transcript && r.transcript.trim())
    .map((r) => ({
      timestamp: Math.max(0, Math.round(r.timestamp)),
      transcript: r.transcript.slice(0, 4_000),
      tone: toDbTone(r.tone),
      confidence: Math.max(0, Math.min(1, Number.isFinite(r.confidence) ? r.confidence : 0.5)),
      suggestion: r.suggestion ? r.suggestion.slice(0, 2_000) : null,
    }));
  if (segments.length === 0) return true;
  try {
    const res = await authFetch(`/api/conversations/${id}/segments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ segments }),
    });
    await json(res);
    return true;
  } catch (err) {
    console.error("[conversations] save segments failed:", err);
    return false;
  }
}

export async function listConversations<T>(opts: { limit?: number; stats?: boolean } = {}): Promise<{
  conversations: T[];
  total: number;
  tones?: Array<{ tone: string; confidence: number }>;
}> {
  const params = new URLSearchParams();
  if (opts.limit) params.set("limit", String(opts.limit));
  if (opts.stats) params.set("stats", "1");
  const res = await authFetch(`/api/conversations${params.size ? `?${params}` : ""}`);
  return json(res);
}

export async function getConversation<C, S>(id: string): Promise<{ conversation: C; segments: S[] } | null> {
  const res = await authFetch(`/api/conversations/${id}`);
  if (res.status === 404) return null;
  return json(res);
}

export async function recordConsent(): Promise<void> {
  try {
    await json(await authFetch("/api/consent", { method: "POST" }));
  } catch (err) {
    console.error("[conversations] consent failed:", err);
  }
}

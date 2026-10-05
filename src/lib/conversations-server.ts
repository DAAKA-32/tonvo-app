import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyAuth } from "@/lib/auth-server";
import { RATE_LIMITS } from "@/lib/rate-limit";
import { assertJsonSize, getClientIp, rateLimitGuard } from "@/lib/security";

/**
 * Shared pieces for the conversation data routes. The browser never talks to
 * Supabase directly: these routes authenticate the Firebase user and scope
 * every query to their uid with the service role (RLS denies the anon key).
 */

export const TONES = ["positive", "neutral", "negative", "hesitant"] as const;

/** Columns the client may write on its own conversation. */
export const conversationPatchSchema = z
  .object({
    ended_at: z.string().datetime().optional(),
    overall_tone: z.enum(TONES).optional(),
    summary: z.string().max(8_000).nullable().optional(),
    insights: z.array(z.string().max(1_000)).max(20).nullable().optional(),
    classification: z.string().max(64).nullable().optional(),
    score: z.record(z.string(), z.number()).nullable().optional(),
    diagnosis: z.string().max(8_000).nullable().optional(),
    follow_up_actions: z.array(z.string().max(1_000)).max(20).nullable().optional(),
    social_score: z.number().int().min(0).max(100).nullable().optional(),
    strengths: z.array(z.string().max(1_000)).max(20).nullable().optional(),
    improvements: z.array(z.string().max(1_000)).max(20).nullable().optional(),
  })
  .strict();

export const segmentsSchema = z.object({
  segments: z
    .array(
      z.object({
        timestamp: z.number().int().nonnegative(),
        transcript: z.string().min(1).max(4_000),
        tone: z.enum(TONES),
        confidence: z.number().min(0).max(1),
        suggestion: z.string().max(2_000).nullable().optional(),
      }),
    )
    .min(1)
    .max(2_000),
});

/** Authenticate + rate-limit. Returns the user or the error response to send. */
export async function guard(
  req: NextRequest,
  opts: { jsonBody?: boolean } = {},
): Promise<{ uid: string; email: string | null } | NextResponse> {
  if (opts.jsonBody) {
    const sizeErr = assertJsonSize(req, 2 * 1024 * 1024);
    if (sizeErr) return sizeErr;
  }
  const user = await verifyAuth(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const limited = await rateLimitGuard("data", `${user.uid}:${getClientIp(req)}`, RATE_LIMITS.data);
  if (limited) return limited;
  return user;
}

export async function readJson(req: NextRequest): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return undefined;
  }
}

export function badRequest(error: z.ZodError | string): NextResponse {
  const message = typeof error === "string" ? error : error.issues[0]?.message ?? "Invalid body";
  return NextResponse.json({ error: message }, { status: 400 });
}

export function dbError(context: string, err: { message?: string } | null): NextResponse {
  console.error(`[conversations] ${context}:`, err?.message ?? "unknown");
  return NextResponse.json({ error: "Database error" }, { status: 503 });
}

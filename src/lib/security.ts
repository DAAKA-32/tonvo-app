/**
 * Shared security utilities for API routes.
 *
 * - getClientIp: single source of truth for IP extraction
 * - rateLimitGuard: async, denies on first overage (no optimistic burst)
 * - sanitizeForPrompt: strip prompt-injection vectors from user-controlled
 *   fields that get concatenated into the system prompt
 * - clampString / clampArray: defensive length caps
 * - assertJsonSize: reject oversized JSON bodies before parsing
 */
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimitAsync, type RateLimitConfig } from "./rate-limit";

export function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    // First IP in the list is the originating client; the rest are proxies
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return (
    req.headers.get("x-real-ip") ??
    req.headers.get("cf-connecting-ip") ??
    "unknown"
  );
}

/**
 * Async rate-limit guard keyed by `prefix:identifier`.
 * Returns null when allowed, or a ready-to-return 429 NextResponse.
 *
 * Always uses the async path so the FIRST request in a burst is correctly
 * counted by Redis — the sync helper in rate-limit.ts is fire-and-forget
 * and can be bypassed by a parallel burst.
 */
export async function rateLimitGuard(
  prefix: string,
  identifier: string,
  config: RateLimitConfig,
): Promise<NextResponse | null> {
  const key = `${prefix}:${identifier}`;
  const rl = await checkRateLimitAsync(key, config);
  if (rl.allowed) return null;
  const retryAfterSec = Math.max(
    1,
    Math.ceil((rl.retryAfterMs ?? config.windowMs) / 1000),
  );
  return NextResponse.json(
    { error: "Rate limit exceeded", retryAfter: retryAfterSec },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSec) },
    },
  );
}

/**
 * Strip prompt-injection markers from a user-controlled string before it
 * gets concatenated into a system prompt or context block.
 *
 * Real LLM injection defense is layered — this is one layer:
 * - Cap length so an attacker can't fill the context window
 * - Remove obvious role-marker mimicry ("system:", "assistant:", etc.)
 * - Strip backticks/triple-quotes that could close a fenced block
 * - Collapse runs of newlines that hide instructions in whitespace
 */
export function sanitizeForPrompt(
  raw: unknown,
  maxLen: number = 2000,
): string {
  if (typeof raw !== "string") return "";
  let s = raw;

  // Cap first to bound CPU on the regex passes
  if (s.length > maxLen) s = s.slice(0, maxLen);

  // Remove zero-width / bidi override chars that can hide payloads
  s = s.replace(/[​-‏‪-‮⁠-⁯﻿]/g, "");

  // Neutralise role markers and common jailbreak openers
  s = s.replace(
    /\b(system|assistant|user|developer|tool)\s*:/gi,
    "$1_",
  );
  s = s.replace(
    /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts|rules)/gi,
    "[redacted]",
  );
  s = s.replace(
    /disregard\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts|rules)/gi,
    "[redacted]",
  );

  // Strip code-fence terminators that could break out of a delimited context
  s = s.replace(/```+/g, "''''");

  // Collapse 3+ newlines so attackers can't bury instructions in whitespace
  s = s.replace(/\n{3,}/g, "\n\n");

  return s;
}

export function clampString(raw: unknown, maxLen: number, fallback = ""): string {
  if (typeof raw !== "string") return fallback;
  return raw.length > maxLen ? raw.slice(0, maxLen) : raw;
}

export function clampArray<T>(raw: unknown, maxLen: number): T[] {
  if (!Array.isArray(raw)) return [];
  return raw.slice(0, maxLen) as T[];
}

/**
 * Reject requests whose Content-Length exceeds the cap, before we ever
 * call req.json() or req.formData(). Returns null when allowed.
 *
 * Note: Content-Length can be absent on chunked uploads. For those we rely
 * on the framework's own ingress limit plus per-route checks (e.g. file.size).
 */
export function assertJsonSize(
  req: NextRequest,
  maxBytes: number,
): NextResponse | null {
  const lenHeader = req.headers.get("content-length");
  if (!lenHeader) return null;
  const len = Number(lenHeader);
  if (!Number.isFinite(len)) return null;
  if (len > maxBytes) {
    return NextResponse.json(
      { error: "Payload too large" },
      { status: 413 },
    );
  }
  return null;
}

/** Default body-size cap for JSON-only API routes (256 KiB). */
export const JSON_BODY_LIMIT = 256 * 1024;

/** Max audio file size for Whisper uploads (10 MiB). */
export const AUDIO_BODY_LIMIT = 10 * 1024 * 1024;

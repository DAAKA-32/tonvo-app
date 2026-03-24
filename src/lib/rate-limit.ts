/**
 * Rate limiter with dual-mode support:
 * - Production (Vercel): Uses Upstash Redis for distributed rate limiting across serverless instances
 * - Development: Falls back to in-memory sliding window
 *
 * To enable Redis mode, set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN env vars.
 */

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// ── Redis-backed rate limiters (production) ──────────────────────────────────

let redis: Redis | null = null;
const upstashLimiters = new Map<string, Ratelimit>();

function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  redis = new Redis({ url, token });
  return redis;
}

function getUpstashLimiter(prefix: string, config: RateLimitConfig): Ratelimit | null {
  const r = getRedis();
  if (!r) return null;
  const key = `${prefix}:${config.maxRequests}:${config.windowMs}`;
  let limiter = upstashLimiters.get(key);
  if (!limiter) {
    limiter = new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(config.maxRequests, `${Math.round(config.windowMs / 1000)}s`),
      prefix: `rl:${prefix}`,
    });
    upstashLimiters.set(key, limiter);
  }
  return limiter;
}

// ── In-memory fallback (development / single-instance) ──────────────────────

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically (every 5 min)
if (typeof globalThis !== "undefined") {
  const cleanup = () => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      entry.timestamps = entry.timestamps.filter((t) => now - t < 60_000);
      if (entry.timestamps.length === 0) store.delete(key);
    }
  };
  // Avoid duplicate intervals in HMR
  const g = globalThis as unknown as { _rlCleanup?: ReturnType<typeof setInterval> };
  if (!g._rlCleanup) {
    g._rlCleanup = setInterval(cleanup, 300_000);
  }
}

function checkInMemory(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }
  entry.timestamps = entry.timestamps.filter((t) => now - t < config.windowMs);
  if (entry.timestamps.length >= config.maxRequests) {
    const oldestInWindow = entry.timestamps[0];
    return { allowed: false, remaining: 0, retryAfterMs: config.windowMs - (now - oldestInWindow) };
  }
  entry.timestamps.push(now);
  return { allowed: true, remaining: config.maxRequests - entry.timestamps.length };
}

// ── Public API ───────────────────────────────────────────────────────────────

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs?: number;
}

/**
 * Check if a request is allowed under the rate limit.
 * Uses Upstash Redis if configured, otherwise falls back to in-memory.
 */
export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  // Extract prefix from key (e.g., "transcribe:1.2.3.4" → "transcribe")
  const prefix = key.split(":")[0] || "default";
  const limiter = getUpstashLimiter(prefix, config);

  if (limiter) {
    // Fire-and-forget async check — return optimistic result, enforce on next request
    // For true sync enforcement, use checkRateLimitAsync instead
    limiter.limit(key).then((result) => {
      if (!result.success) {
        // Store denial so next sync check can read it
        const entry = store.get(`deny:${key}`);
        if (!entry) {
          store.set(`deny:${key}`, { timestamps: [Date.now()] });
        }
      } else {
        store.delete(`deny:${key}`);
      }
    }).catch(() => {});

    // Check if previous async check denied this key
    const denied = store.get(`deny:${key}`);
    if (denied && denied.timestamps[0] && Date.now() - denied.timestamps[0] < config.windowMs) {
      return { allowed: false, remaining: 0, retryAfterMs: config.windowMs };
    }
    return { allowed: true, remaining: config.maxRequests };
  }

  return checkInMemory(key, config);
}

/**
 * Async version — fully enforces Redis rate limit (use in routes that can await).
 */
export async function checkRateLimitAsync(key: string, config: RateLimitConfig): Promise<RateLimitResult> {
  const prefix = key.split(":")[0] || "default";
  const limiter = getUpstashLimiter(prefix, config);

  if (limiter) {
    const result = await limiter.limit(key);
    return {
      allowed: result.success,
      remaining: result.remaining,
      retryAfterMs: result.success ? undefined : result.reset * 1000 - Date.now(),
    };
  }

  return checkInMemory(key, config);
}

// Preset configs for different endpoints
export const RATE_LIMITS = {
  /** Transcribe: 20 requests per minute */
  transcribe: { maxRequests: 20, windowMs: 60_000 } as RateLimitConfig,
  /** Analyze: 20 requests per minute */
  analyze: { maxRequests: 20, windowMs: 60_000 } as RateLimitConfig,
  /** Summarize: 5 per minute (only called at session end) */
  summarize: { maxRequests: 5, windowMs: 60_000 } as RateLimitConfig,
  /** Screen analysis: 10 per minute */
  screenAnalysis: { maxRequests: 10, windowMs: 60_000 } as RateLimitConfig,
  /** Context update: 10 per minute */
  contextUpdate: { maxRequests: 10, windowMs: 60_000 } as RateLimitConfig,
  /** Translate: 10 per minute */
  translate: { maxRequests: 10, windowMs: 60_000 } as RateLimitConfig,
  /** Screen summary: 5 per minute (expensive — uses Claude Deep) */
  screenSummary: { maxRequests: 5, windowMs: 60_000 } as RateLimitConfig,
  /** Analytics: 10 per minute */
  analytics: { maxRequests: 10, windowMs: 60_000 } as RateLimitConfig,
};

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

// Circuit breaker: when Redis is unreachable (deleted DB, DNS failure, outage)
// we fall back to the in-memory limiter instead of failing the request, and
// skip Redis entirely for a short window so callers don't pay the timeout on
// every request.
const REDIS_TIMEOUT_MS = 800;
const REDIS_COOLDOWN_MS = 60_000;
let redisDownUntil = 0;

function markRedisDown(err: unknown): void {
  const now = Date.now();
  if (now >= redisDownUntil) {
    console.warn(
      "[rate-limit] Redis unavailable, using in-memory limiter for 60s:",
      err instanceof Error ? err.message : String(err),
    );
  }
  redisDownUntil = now + REDIS_COOLDOWN_MS;
}

function getRedis(): Redis | null {
  if (redis) return redis;
  // Support multiple env var naming conventions (Vercel KV integration adds prefix)
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_KV_REST_API_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  // One quick retry only — the default backoff adds ~5s before throwing.
  redis = new Redis({ url, token, retry: { retries: 1, backoff: () => 100 } });
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
 * Check if a request is allowed under the rate limit (sync).
 *
 * Behaviour:
 * 1. Always evaluates the in-memory sliding window so a burst against a
 *    single serverless instance is denied immediately — no optimistic
 *    "allow first, enforce later" gap.
 * 2. When Upstash is configured, fires an async cross-instance check whose
 *    result feeds into a short-lived deny cache (`deny:{key}`). Subsequent
 *    sync calls honour that deny.
 * 3. If a previous async Redis check has flagged the key as denied within
 *    the window, deny immediately.
 *
 * For routes that can `await`, prefer `checkRateLimitAsync` — it gives the
 * authoritative cross-instance answer in a single round-trip.
 */
export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const prefix = key.split(":")[0] || "default";
  const limiter = getUpstashLimiter(prefix, config);

  // 1) In-memory sliding window is ALWAYS evaluated. This is the
  //    non-contournable per-instance backstop.
  const localResult = checkInMemory(key, config);

  if (!limiter || Date.now() < redisDownUntil) return localResult;

  // 2) Previous async Redis denial?
  const denied = store.get(`deny:${key}`);
  if (denied && denied.timestamps[0] && Date.now() - denied.timestamps[0] < config.windowMs) {
    return { allowed: false, remaining: 0, retryAfterMs: config.windowMs };
  }

  // 3) Fire async cross-instance check; result feeds the deny cache for
  //    the next sync call. Errors are swallowed — the in-memory result still
  //    holds.
  limiter.limit(key).then((result) => {
    if (!result.success) {
      if (!store.has(`deny:${key}`)) {
        store.set(`deny:${key}`, { timestamps: [Date.now()] });
      }
    } else {
      store.delete(`deny:${key}`);
    }
  }).catch(markRedisDown);

  // Local already counted this hit and decides allow/deny for this call.
  return localResult;
}

/**
 * Async version — enforces the Redis rate limit when Redis is reachable.
 * Never throws: if Redis errors or is slow, falls back to the in-memory
 * limiter so a dead cache can't take the API down.
 */
export async function checkRateLimitAsync(key: string, config: RateLimitConfig): Promise<RateLimitResult> {
  const prefix = key.split(":")[0] || "default";
  const limiter = Date.now() < redisDownUntil ? null : getUpstashLimiter(prefix, config);

  if (limiter) {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const timeout = new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`Redis timeout after ${REDIS_TIMEOUT_MS}ms`)), REDIS_TIMEOUT_MS);
      });
      const result = await Promise.race([limiter.limit(key), timeout]);
      return {
        allowed: result.success,
        remaining: result.remaining,
        retryAfterMs: result.success ? undefined : result.reset - Date.now(),
      };
    } catch (err) {
      markRedisDown(err);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  return checkInMemory(key, config);
}

/** Test-only: reset breaker + cached clients. */
export function __resetRateLimitForTests(): void {
  redis = null;
  upstashLimiters.clear();
  redisDownUntil = 0;
  store.clear();
}

// Preset configs for different endpoints
export const RATE_LIMITS = {
  /** Transcribe: 20 requests per minute */
  transcribe: { maxRequests: 20, windowMs: 60_000 } as RateLimitConfig,
  /** Analyze: 40 requests per minute (live turns are coalesced client-side) */
  analyze: { maxRequests: 40, windowMs: 60_000 } as RateLimitConfig,
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
  /** Session / history reads and writes (conversations, segments, consent): 60 per minute */
  data: { maxRequests: 60, windowMs: 60_000 } as RateLimitConfig,
};

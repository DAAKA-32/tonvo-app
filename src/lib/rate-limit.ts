/**
 * Simple in-memory rate limiter using a sliding window.
 * For production, replace with Redis-based solution.
 */

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically (every 5 min)
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < 60_000);
    if (entry.timestamps.length === 0) store.delete(key);
  }
}, 300_000);

export interface RateLimitConfig {
  /** Max requests allowed in the window */
  maxRequests: number;
  /** Window size in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs?: number;
}

/**
 * Check if a request is allowed under the rate limit.
 * @param key - Unique identifier (e.g., userId, IP)
 * @param config - Rate limit configuration
 */
export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  let entry = store.get(key);

  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter((t) => now - t < config.windowMs);

  if (entry.timestamps.length >= config.maxRequests) {
    const oldestInWindow = entry.timestamps[0];
    const retryAfterMs = config.windowMs - (now - oldestInWindow);
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs,
    };
  }

  entry.timestamps.push(now);
  return {
    allowed: true,
    remaining: config.maxRequests - entry.timestamps.length,
  };
}

// Preset configs for different endpoints
export const RATE_LIMITS = {
  /** Transcribe: 20 requests per minute per user (audio chunks every 5s = ~12/min normally) */
  transcribe: { maxRequests: 20, windowMs: 60_000 } as RateLimitConfig,
  /** Analyze: 20 requests per minute per user */
  analyze: { maxRequests: 20, windowMs: 60_000 } as RateLimitConfig,
  /** Summarize: 5 per minute (only called at session end) */
  summarize: { maxRequests: 5, windowMs: 60_000 } as RateLimitConfig,
  /** Screen analysis: 10 per minute (every 15s = ~4/min normally) */
  screenAnalysis: { maxRequests: 10, windowMs: 60_000 } as RateLimitConfig,
  /** Context update: 10 per minute */
  contextUpdate: { maxRequests: 10, windowMs: 60_000 } as RateLimitConfig,
};

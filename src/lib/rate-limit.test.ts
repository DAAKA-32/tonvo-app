import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const { limitMock } = vi.hoisted(() => ({ limitMock: vi.fn() }));

vi.mock("@upstash/redis", () => ({
  Redis: class {
    constructor(_opts: unknown) {}
  },
}));

vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: class {
    static slidingWindow() {
      return {};
    }
    limit = limitMock;
    constructor(_opts: unknown) {}
  },
}));

import { checkRateLimitAsync, __resetRateLimitForTests } from "./rate-limit";

const CONFIG = { maxRequests: 2, windowMs: 60_000 };

describe("checkRateLimitAsync", () => {
  beforeEach(() => {
    __resetRateLimitForTests();
    limitMock.mockReset();
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("uses the in-memory window when Redis is not configured", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_KV_REST_API_URL", "");
    vi.stubEnv("KV_REST_API_URL", "");
    expect((await checkRateLimitAsync("t:a", CONFIG)).allowed).toBe(true);
    expect((await checkRateLimitAsync("t:a", CONFIG)).allowed).toBe(true);
    expect((await checkRateLimitAsync("t:a", CONFIG)).allowed).toBe(false);
    expect(limitMock).not.toHaveBeenCalled();
  });

  describe("with Redis configured", () => {
    beforeEach(() => {
      vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://dead.upstash.io");
      vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "x");
    });

    it("honours a Redis deny", async () => {
      limitMock.mockResolvedValue({ success: false, remaining: 0, reset: Date.now() + 5_000 });
      const res = await checkRateLimitAsync("t:b", CONFIG);
      expect(res.allowed).toBe(false);
      expect(res.retryAfterMs).toBeGreaterThan(0);
      expect(res.retryAfterMs).toBeLessThanOrEqual(5_000);
    });

    it("falls back to in-memory when Redis throws, then skips Redis while the breaker is open", async () => {
      limitMock.mockRejectedValue(new Error("getaddrinfo ENOTFOUND dead.upstash.io"));
      expect((await checkRateLimitAsync("t:c", CONFIG)).allowed).toBe(true);
      expect(limitMock).toHaveBeenCalledTimes(1);
      expect((await checkRateLimitAsync("t:c", CONFIG)).allowed).toBe(true);
      expect((await checkRateLimitAsync("t:c", CONFIG)).allowed).toBe(false);
      expect(limitMock).toHaveBeenCalledTimes(1);
    });

    it("falls back to in-memory when Redis hangs", async () => {
      vi.useFakeTimers();
      limitMock.mockReturnValue(new Promise(() => {}));
      const pending = checkRateLimitAsync("t:d", CONFIG);
      await vi.advanceTimersByTimeAsync(800);
      expect((await pending).allowed).toBe(true);
    });
  });
});

/** Tuning for the landing's subscription notifications. */
export const SOCIAL_PROOF = {
  /** How long each notification stays before the next one replaces it. */
  rotateMs: 2000,
  /** Lets the hero land before the first notification appears. */
  initialDelayMs: 4000,
  /** Real events older than this are dropped. */
  maxAgeDays: 14,
  /** Below this many real events the widget stays hidden: one event on repeat reads worse than none. */
  minLiveEvents: 3,
  /** Events younger than this read "just joined", older ones "joined". */
  justNowMinutes: 15,
  /**
   * Query parameter overriding the data source: `demo` forces the badged demo
   * examples, `live` shows real events only (no demo fallback), `off` hides
   * the widget.
   */
  queryParam: "social-proof",
} as const;

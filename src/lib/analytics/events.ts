import { z } from "zod";

/**
 * First-party funnel analytics: the shared vocabulary of the browser, /api/track and the dashboard.
 *
 * Funnel: page_view (visit) -> cta_click (Start free / Get started) -> signup -> first_session (first LIVE
 * session) -> checkout_started -> checkout_completed (paid).
 */

/** Events the browser may send to /api/track. */
export const CLIENT_EVENTS = ["page_view", "cta_click", "signup", "upgrade_click", "vsl_sound", "vsl_fullscreen"] as const;
/** Events only the server records (session and Stripe routes). */
export const SERVER_EVENTS = ["session_started", "first_session", "checkout_started", "checkout_completed"] as const;

export type ClientEvent = (typeof CLIENT_EVENTS)[number];
export type ServerEvent = (typeof SERVER_EVENTS)[number];
export type AnalyticsEvent = ClientEvent | ServerEvent;

const short = (max: number) => z.string().trim().max(max).optional();

/** Where the visitor first came from, captured once on landing (first touch). */
export const attributionSchema = z
  .object({
    ref: short(120),
    utm_source: short(120),
    utm_medium: short(120),
    utm_campaign: short(120),
    utm_content: short(120),
    utm_term: short(120),
    referrer_host: short(200),
  })
  .strict();
export type Attribution = z.infer<typeof attributionSchema>;

/** Small, non-identifying properties: labels and flags only, never free text typed by the user. */
const propsSchema = z
  .record(z.string().max(40), z.union([z.string().max(120), z.number().finite(), z.boolean()]))
  .refine((p) => Object.keys(p).length <= 12, "Too many props");

export const trackBodySchema = z
  .object({
    event: z.enum(CLIENT_EVENTS),
    anonId: z.string().regex(/^[A-Za-z0-9_-]{8,64}$/),
    path: z.string().max(300).startsWith("/"),
    attribution: attributionSchema.optional(),
    props: propsSchema.optional(),
  })
  .strict();
export type TrackBody = z.infer<typeof trackBodySchema>;

/**
 * One readable channel per visitor: an explicit ?ref= wins, then utm_source, then the referring site, else direct.
 * Lower-cased so "LinkedIn" and "linkedin" count once.
 */
export function deriveSource(a: Attribution | undefined | null): string {
  const pick = a?.ref || a?.utm_source || a?.referrer_host;
  return (pick || "direct").toLowerCase().slice(0, 120);
}

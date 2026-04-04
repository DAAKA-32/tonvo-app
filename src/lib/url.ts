/**
 * Returns the canonical app URL for redirects, emails, and Stripe callbacks.
 * Uses NEXT_PUBLIC_APP_URL if set, otherwise infers from Vercel env vars.
 * Never trusts request headers.
 */
export function getAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  return "https://tonvo.co";
}

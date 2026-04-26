import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Priced on the Outcome",
  description:
    "Priced on your close rate, not per-seat software. Starter free with 3 closing sessions/month, Closer at $19/month unlocks unlimited closing, full objection library, and deal tracking. One extra deal pays the year. 7-day money-back guarantee.",
  openGraph: {
    title: "Tonvo Pricing — Priced on the Outcome, Not the Software",
    description:
      "Starter, Closer, and Sales Team plans. Unlock unlimited closing sessions, live closing lines, and close-rate tracking — starting at $19/month. One additional closed deal pays the whole year.",
    url: "https://tonvo.co/pricing",
  },
  alternates: {
    canonical: "https://tonvo.co/pricing",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}

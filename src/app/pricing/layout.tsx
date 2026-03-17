import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - Plans & Features",
  description:
    "Choose the perfect Tonvo plan for your needs. Free plan with 3 sessions/month, Pro at $19/month for unlimited sessions, AI coaching, and screen analysis. 7-day money-back guarantee.",
  openGraph: {
    title: "Tonvo Pricing - Conversation Intelligence Plans",
    description:
      "Free, Pro, and Team plans. Unlock unlimited real-time conversation analysis, AI coaching, and advanced insights starting at $19/month.",
    url: "https://tonvo.co/pricing",
  },
  alternates: {
    canonical: "https://tonvo.co/pricing",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}

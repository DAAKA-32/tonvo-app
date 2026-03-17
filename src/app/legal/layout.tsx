import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal Notice",
  description:
    "Tonvo Legal Notice. Company information, legal mentions, and regulatory disclosures for the Tonvo conversation intelligence platform.",
  openGraph: {
    title: "Legal Notice - Tonvo",
    description: "Legal mentions and company information for Tonvo.",
    url: "https://tonvo.co/legal",
  },
  alternates: {
    canonical: "https://tonvo.co/legal",
  },
};

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return children;
}

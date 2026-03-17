import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Tonvo Terms of Service. Read our terms and conditions for using the Tonvo conversation intelligence platform.",
  openGraph: {
    title: "Terms of Service - Tonvo",
    description:
      "Terms and conditions for using Tonvo conversation intelligence platform.",
    url: "https://tonvo.co/terms",
  },
  alternates: {
    canonical: "https://tonvo.co/terms",
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

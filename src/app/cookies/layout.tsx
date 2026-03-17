import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Tonvo Cookie Policy. Learn how we use cookies and similar technologies to improve your experience on our platform.",
  openGraph: {
    title: "Cookie Policy - Tonvo",
    description: "How Tonvo uses cookies and tracking technologies.",
    url: "https://tonvo.co/cookies",
  },
  alternates: {
    canonical: "https://tonvo.co/cookies",
  },
};

export default function CookiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}

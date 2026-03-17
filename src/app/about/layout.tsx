import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - Our Mission",
  description:
    "Tonvo is an AI conversation copilot built to help professionals communicate better during calls. Founded by Emilien Nepveu. Learn about our mission and values.",
  openGraph: {
    title: "About Tonvo - AI Conversation Copilot",
    description: "Learn about Tonvo's mission to improve conversations with real-time AI insights.",
    url: "https://tonvo.co/about",
  },
  alternates: { canonical: "https://tonvo.co/about" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}

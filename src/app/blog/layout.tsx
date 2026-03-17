import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Conversation Intelligence Insights",
  description:
    "Tips, guides, and insights on conversation intelligence, AI coaching, sales communication, and building better conversations. By the Tonvo team.",
  openGraph: {
    title: "Tonvo Blog - Conversation Intelligence Insights",
    description: "Expert tips on AI-powered conversation analysis, sales coaching, and communication skills.",
    url: "https://tonvo.co/blog",
  },
  alternates: { canonical: "https://tonvo.co/blog" },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}

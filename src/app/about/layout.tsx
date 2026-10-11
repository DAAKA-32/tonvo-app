import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Tonvo | Why I built it",
  description:
    "Emilien Nepveu, founder of Tonvo: why a live AI copilot for calls, and the promises behind it. No bot in your meetings, no fake numbers, free to start.",
  openGraph: {
    title: "About Tonvo | Why I built it",
    description: "The moment your mind goes blank on a call, and the live copilot built for it.",
    url: "https://tonvo.co/about",
  },
  alternates: { canonical: "https://tonvo.co/about" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}

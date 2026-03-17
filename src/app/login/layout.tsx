import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In or Create Account",
  description:
    "Sign in to Tonvo or create a free account to start analyzing your conversations in real time with AI-powered tone and emotion detection.",
  openGraph: {
    title: "Sign In to Tonvo",
    description:
      "Access your conversation intelligence dashboard. Sign in with email or Google.",
    url: "https://tonvo.co/login",
  },
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://tonvo.co/login",
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In or Create Account",
  description:
    "Sign in to Tonvo or create a free account and start raising your close rate. Live closing lines, objection counters, and price anchors — delivered the moment they matter.",
  openGraph: {
    title: "Sign In to Tonvo",
    description:
      "Access your close-rate dashboard. Sign in with email or Google.",
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

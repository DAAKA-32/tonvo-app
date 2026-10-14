import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Why I built Tonvo",
  description:
    "Tonvo founder Emilien Nepveu on the moment your mind goes blank on a call, and the live AI copilot he built for it. No bot in your meetings, free to start.",
  path: "/about",
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Legal Notice",
  description:
    "Company information and legal notices for Tonvo, the AI copilot for live calls.",
  path: "/legal",
});

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return children;
}

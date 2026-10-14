import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "The Tonvo blog",
  description:
    "Tips, guides and insights on live calls, sales conversations, AI coaching and better communication, by the Tonvo team.",
  path: "/blog",
});

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}

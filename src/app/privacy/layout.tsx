import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Tonvo Privacy Policy. Learn how we collect, use, and protect your conversation data. Your privacy and data security are our top priority.",
  openGraph: {
    title: "Privacy Policy - Tonvo",
    description:
      "How Tonvo handles your data. Encryption, data retention, and your privacy rights.",
    url: "https://tonvo.co/privacy",
  },
  alternates: {
    canonical: "https://tonvo.co/privacy",
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}

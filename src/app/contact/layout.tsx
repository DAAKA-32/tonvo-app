import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Tonvo team. Questions about pricing, features, partnerships, or support — we're here to help.",
  openGraph: {
    title: "Contact Tonvo",
    description: "Reach out to the Tonvo team for support, partnerships, or feedback.",
    url: "https://tonvo.co/contact",
  },
  alternates: { canonical: "https://tonvo.co/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

// The signed-in plan and billing page. The public pricing page is /pricing.
export const metadata: Metadata = {
  title: "Plans | Tonvo",
  robots: { index: false, follow: false },
};

export default function PlansLayout({ children }: { children: React.ReactNode }) {
  return children;
}

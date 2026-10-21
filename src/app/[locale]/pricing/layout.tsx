import { makeGenerateMetadata } from "@/lib/seo-server";

export const generateMetadata = makeGenerateMetadata("/pricing", "pricing");

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}

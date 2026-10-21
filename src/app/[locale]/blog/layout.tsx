import { notFound } from "next/navigation";
import { makeGenerateMetadata } from "@/lib/seo-server";

// The articles do not exist yet ("Coming soon"): the index is kept for visitors but not indexed, and it is
// English only, so /fr/blog and the other language versions are 404.
export const dynamicParams = false;
export const generateStaticParams = () => [{ locale: "en" }];
export const generateMetadata = makeGenerateMetadata("/blog", "blog", { noIndex: true });

export default async function BlogLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en") notFound();
  return children;
}

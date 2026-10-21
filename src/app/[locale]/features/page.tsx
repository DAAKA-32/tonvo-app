import SEOHubPage from "@/components/seo/SEOHubPage";
import { hubStaticParams, makeHubMetadata } from "@/lib/seo-server";

export const generateMetadata = makeHubMetadata("features");
export const generateStaticParams = hubStaticParams("features");

export default async function Hub({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <SEOHubPage type="features" locale={locale} />;
}

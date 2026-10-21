import SEOHubPage from "@/components/seo/SEOHubPage";
import { hubStaticParams, makeHubMetadata } from "@/lib/seo-server";

export const generateMetadata = makeHubMetadata("compare");
export const generateStaticParams = hubStaticParams("compare");

export default async function Hub({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <SEOHubPage type="compare" locale={locale} />;
}

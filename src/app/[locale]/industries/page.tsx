import SEOHubPage from "@/components/seo/SEOHubPage";
import { hubStaticParams, makeHubMetadata } from "@/lib/seo-server";

export const generateMetadata = makeHubMetadata("industries");
export const generateStaticParams = hubStaticParams("industries");

export default async function Hub({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <SEOHubPage type="industries" locale={locale} />;
}

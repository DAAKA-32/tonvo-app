import SEOHubPage from "@/components/seo/SEOHubPage";
import { hubStaticParams, makeHubMetadata } from "@/lib/seo-server";

export const generateMetadata = makeHubMetadata("guides");
export const generateStaticParams = hubStaticParams("guides");

export default async function Hub({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <SEOHubPage type="guides" locale={locale} />;
}

import SEOHubPage from "@/components/seo/SEOHubPage";
import { hubStaticParams, makeHubMetadata } from "@/lib/seo-server";

export const generateMetadata = makeHubMetadata("use-cases");
export const generateStaticParams = hubStaticParams("use-cases");

export default async function Hub({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <SEOHubPage type="use-cases" locale={locale} />;
}

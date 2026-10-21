import { notFound } from "next/navigation";
import ExtraMessages from "@/components/ExtraMessages";
import { PAGE_NAMESPACES, isLocale } from "@/i18n/locales-config";
import { getMessages, pickNamespaces } from "@/i18n/messages";
import { makeGenerateMetadata } from "@/lib/seo-server";

export const generateMetadata = makeGenerateMetadata("/cookies", "cookies");

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  // English is bundled in the client already: only other languages need the page's namespace sent.
  if (locale === "en") return children;
  const messages = pickNamespaces(await getMessages(locale), [PAGE_NAMESPACES["cookies"]]);
  return (
    <ExtraMessages locale={locale} messages={messages}>
      {children}
    </ExtraMessages>
  );
}

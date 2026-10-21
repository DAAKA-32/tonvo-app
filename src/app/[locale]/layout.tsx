import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PublicProviders from "@/components/PublicProviders";
import RootShell from "@/components/RootShell";
import { BASE_NAMESPACES, LOCALES, LOCALE_INFO, SITE_URL, isLocale } from "@/i18n/locales-config";
import { getMessages, getServerT, pickNamespaces } from "@/i18n/messages";
import { siteBaseMetadata, siteViewport } from "@/lib/site-metadata";
import { localizedMetadata } from "@/lib/seo";
import "../globals.css";

// Root layout of the public, localized pages. English is served at the root (/about) through a
// rewrite in the middleware, every other language under its code (/fr/about).
export const dynamicParams = false;
export const viewport = siteViewport;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

/** Default for any public page that does not define its own metadata. Pages override it. */
export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getServerT(locale);
  return {
    ...siteBaseMetadata,
    ...localizedMetadata({
      locale,
      path: "/",
      title: t("seo.home.title"),
      description: t("seo.home.description"),
    }),
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // Only the namespaces every public page needs go to the browser (a page adds its own in its layout).
  const [all, t] = await Promise.all([locale === "en" ? undefined : getMessages(locale), getServerT(locale)]);
  const messages = all && pickNamespaces(all, BASE_NAMESPACES);

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Tonvo",
    url: SITE_URL,
    logo: `${SITE_URL}/logo-tonvo.png`,
    description: t("seo.organization"),
    contactPoint: { "@type": "ContactPoint", email: "outreach@tonvo.co", contactType: "customer support" },
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Tonvo",
    url: SITE_URL,
    inLanguage: LOCALE_INFO[locale].hreflang,
    description: t("seo.home.description"),
  };

  return (
    <RootShell
      lang={LOCALE_INFO[locale].hreflang}
      dir={LOCALE_INFO[locale].dir}
      marketing
      head={
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
        </>
      }
    >
      <PublicProviders locale={locale} messages={messages}>
        {children}
      </PublicProviders>
    </RootShell>
  );
}

import Link from "next/link";
import { getServerT } from "@/i18n/messages";
import type { Locale } from "@/i18n/locales-config";

interface CTABannerProps {
  locale: Locale;
  heading?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
}

export default async function CTABanner({
  locale,
  heading,
  description,
  buttonText,
  buttonHref = "/login",
}: CTABannerProps) {
  const t = await getServerT(locale);
  return (
    <div
      className="text-center rounded-2xl border p-10"
      style={{ backgroundColor: "rgba(200, 200, 216, 0.04)", borderColor: "var(--color-border)" }}
    >
      <h2 className="text-xl font-bold mb-3" style={{ color: "var(--color-text)" }}>
        {heading ?? t("seoUi.ctaHeading")}
      </h2>
      <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
        {description ?? t("seoUi.ctaDescription")}
      </p>
      <Link
        href={buttonHref}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold no-underline transition-all hover:opacity-90"
        style={{
          background: "linear-gradient(135deg, #5c5c6e, #6e6e82)",
          color: "white",
          boxShadow: "0 4px 14px rgba(92,92,110,0.35)",
        }}
      >
        {buttonText ?? t("seoUi.ctaButton")}
      </Link>
    </div>
  );
}

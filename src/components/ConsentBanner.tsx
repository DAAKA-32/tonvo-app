"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useOptionalLocale } from "@/components/PublicProviders";
import { CONSENT_EVENT, readConsent, writeConsent } from "@/lib/consent";
import { isLocale, publicHref } from "@/i18n/locales-config";

/**
 * Cookie banner for the one optional tracker we use (the Meta Pixel). Shown only when there is something to
 * consent to (the pixel is configured), nothing was chosen yet, and the browser sends no privacy signal.
 * "Accept" and "Decline" are the same size and weight on purpose, and declining changes nothing in the product.
 */
export default function ConsentBanner() {
  const { t, i18n } = useTranslation();
  const pageLocale = useOptionalLocale();
  const [open, setOpen] = useState(false);
  const hasPixel = !!process.env.NEXT_PUBLIC_FB_PIXEL_ID;

  useEffect(() => {
    if (!hasPixel) return;
    const sync = () => setOpen(readConsent() === null);
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, [hasPixel]);

  if (!open) return null;

  const lang = pageLocale ?? (isLocale(i18n.language) ? i18n.language : "en");
  const button =
    "cursor-pointer rounded-full px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-accent-light)";

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t("consent.title")}
      className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-[60] rounded-2xl p-5"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        boxShadow: "0 24px 60px -20px rgba(0, 0, 0, 0.6)",
        color: "var(--color-text-silver)",
      }}
    >
      <p className="m-0 mb-1 text-sm font-semibold" style={{ color: "var(--color-text)" }}>
        {t("consent.title")}
      </p>
      <p className="m-0 mb-4 text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
        {t("consent.body")}{" "}
        <Link href={publicHref("/cookies", lang)} className="underline" style={{ color: "var(--color-text-silver)" }}>
          {t("consent.policy")}
        </Link>
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          className={button}
          style={{ background: "transparent", color: "var(--color-text)", border: "1px solid var(--color-border)" }}
          onClick={() => writeConsent("denied")}
        >
          {t("consent.decline")}
        </button>
        <button
          type="button"
          className={button}
          style={{ background: "transparent", color: "var(--color-text)", border: "1px solid var(--color-border)" }}
          onClick={() => writeConsent("granted")}
        >
          {t("consent.accept")}
        </button>
      </div>
    </div>
  );
}

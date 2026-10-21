"use client";

import { useTranslation } from "react-i18next";
import { privacySignalOn, writeConsent } from "@/lib/consent";

/** Lets a visitor change their cookie choice later: it clears the stored answer so the banner asks again. */
export default function CookiePreferences() {
  const { t } = useTranslation();
  // The pixel is not configured in dev and preview builds: nothing to choose there.
  if (!process.env.NEXT_PUBLIC_FB_PIXEL_ID) return null;
  return (
    <button
      type="button"
      onClick={() => writeConsent(null)}
      disabled={privacySignalOn()}
      className="mt-4 cursor-pointer rounded-full px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-default disabled:opacity-50"
      style={{ background: "transparent", color: "var(--color-text)", border: "1px solid var(--color-border)" }}
    >
      {t("cookiesPage.managePrefs")}
    </button>
  );
}

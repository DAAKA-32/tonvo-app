"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { TonvoLogoMark } from "@/components/Logo";

export default function CookiesPage() {
  const { t } = useTranslation();

  const cookies = [
    { typeKey: "cookie1Type", descKey: "cookie1Desc", examplesKey: "cookie1Examples", required: true },
    { typeKey: "cookie2Type", descKey: "cookie2Desc", examplesKey: "cookie2Examples", required: false },
    { typeKey: "cookie3Type", descKey: "cookie3Desc", examplesKey: "cookie3Examples", required: false },
    { typeKey: "cookie4Type", descKey: "cookie4Desc", examplesKey: "cookie4Examples", required: false },
  ];

  return (
    <div style={{ backgroundColor: "var(--color-bg)", minHeight: "100vh" }}>
      <header className="border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <TonvoLogoMark size="sm" />
            <span className="text-lg font-bold" style={{ color: "var(--color-text)" }}>Tonvo</span>
          </Link>
          <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>/</span>
          <span className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>{t("cookiesPage.breadcrumb")}</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "var(--color-text)" }}>
          {t("cookiesPage.title")}
        </h1>
        <p className="text-sm mb-10" style={{ color: "var(--color-text-muted)" }}>
          {t("cookiesPage.lastUpdated")}
        </p>

        <div className="space-y-8" style={{ color: "var(--color-text-silver)" }}>
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("cookiesPage.s1Title")}</h2>
            <p className="text-sm leading-relaxed m-0">{t("cookiesPage.s1Text")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("cookiesPage.s2Title")}</h2>
            <div className="space-y-3">
              {cookies.map((cookie) => (
                <div key={cookie.typeKey} className="rounded-xl p-4" style={{ backgroundColor: "var(--color-surface)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-sm font-semibold m-0" style={{ color: "var(--color-text)" }}>{t(`cookiesPage.${cookie.typeKey}`)}</p>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor: cookie.required ? "rgba(52, 211, 153, 0.1)" : "rgba(200, 200, 216, 0.08)",
                        color: cookie.required ? "var(--color-positive)" : "var(--color-text-muted)",
                      }}>
                      {cookie.required ? t("cookiesPage.required") : t("cookiesPage.optional")}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed m-0 mb-1" style={{ color: "var(--color-text-muted)" }}>{t(`cookiesPage.${cookie.descKey}`)}</p>
                  <p className="text-xs m-0" style={{ color: "var(--color-text-muted)", opacity: 0.7 }}>{t("cookiesPage.examples")} {t(`cookiesPage.${cookie.examplesKey}`)}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("cookiesPage.s3Title")}</h2>
            <p className="text-sm leading-relaxed m-0">{t("cookiesPage.s3Text")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("cookiesPage.s4Title")}</h2>
            <p className="text-sm leading-relaxed m-0">{t("cookiesPage.s4Text")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("cookiesPage.s5Title")}</h2>
            <p className="text-sm leading-relaxed m-0">
              {t("cookiesPage.s5Text")}<br /><br />
              Email: <strong>tonvoco.pro@gmail.com</strong>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t" style={{ borderColor: "var(--color-border)" }}>
          <Link href="/" className="text-sm no-underline font-medium" style={{ color: "var(--color-accent-light)" }}>
            &larr; {t("cookiesPage.backToHome")}
          </Link>
        </div>
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { TonvoLogoMark } from "@/components/Logo";

export default function LegalPage() {
  const { t } = useTranslation();

  return (
    <div style={{ backgroundColor: "var(--color-bg)", minHeight: "100vh" }}>
      <header className="border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <TonvoLogoMark size="sm" />
            <span className="text-lg font-bold" style={{ color: "var(--color-text)" }}>Tonvo</span>
          </Link>
          <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>/</span>
          <span className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>{t("legalPage.breadcrumb")}</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "var(--color-text)" }}>
          {t("legalPage.title")}
        </h1>
        <p className="text-sm mb-10" style={{ color: "var(--color-text-muted)" }}>
          {t("legalPage.subtitle")}
        </p>

        <div className="space-y-8" style={{ color: "var(--color-text-silver)" }}>
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("legalPage.publisherTitle")}</h2>
            <div className="rounded-xl p-5" style={{ backgroundColor: "var(--color-surface)" }}>
              <div className="space-y-2 text-sm">
                <p className="m-0"><strong style={{ color: "var(--color-text)" }}>{t("legalPage.companyLabel")}</strong> Tonvo</p>
                <p className="m-0"><strong style={{ color: "var(--color-text)" }}>{t("legalPage.legalFormLabel")}</strong> {t("legalPage.legalFormValue")}</p>
                <p className="m-0"><strong style={{ color: "var(--color-text)" }}>{t("legalPage.addressLabel")}</strong> 42170 Chambles, France</p>
                <p className="m-0"><strong style={{ color: "var(--color-text)" }}>{t("legalPage.registrationLabel")}</strong> SIREN 101 134 633</p>
                <p className="m-0"><strong style={{ color: "var(--color-text)" }}>{t("legalPage.vatLabel")}</strong> {t("legalPage.vatValue")}</p>
                <p className="m-0"><strong style={{ color: "var(--color-text)" }}>{t("legalPage.capitalLabel")}</strong> {t("legalPage.capitalValue")}</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("legalPage.directorTitle")}</h2>
            <div className="rounded-xl p-5" style={{ backgroundColor: "var(--color-surface)" }}>
              <p className="text-sm m-0">
                <strong style={{ color: "var(--color-text)" }}>{t("legalPage.nameLabel")}</strong> Emilien Nepveu<br />
                <strong style={{ color: "var(--color-text)" }}>{t("legalPage.emailLabel")}</strong> tonvoco.pro@gmail.com
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("legalPage.dpoTitle")}</h2>
            <div className="rounded-xl p-5" style={{ backgroundColor: "var(--color-surface)" }}>
              <p className="text-sm m-0">
                <strong style={{ color: "var(--color-text)" }}>DPO:</strong> {t("legalPage.dpoDesc")}<br />
                <strong style={{ color: "var(--color-text)" }}>{t("legalPage.contactLabel")}</strong> tonvoco.pro@gmail.com
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("legalPage.hostingTitle")}</h2>
            <div className="rounded-xl p-5" style={{ backgroundColor: "var(--color-surface)" }}>
              <div className="space-y-2 text-sm">
                <p className="m-0"><strong style={{ color: "var(--color-text)" }}>{t("legalPage.appHostingLabel")}</strong> Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA</p>
                <p className="m-0"><strong style={{ color: "var(--color-text)" }}>{t("legalPage.dbHostingLabel")}</strong> Supabase Inc., EU (europe-west1)</p>
                <p className="m-0"><strong style={{ color: "var(--color-text)" }}>{t("legalPage.authHostingLabel")}</strong> Firebase (Google Ireland Ltd), Gordon House, Barrow Street, Dublin 4, Ireland</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("legalPage.relatedTitle")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { href: "/privacy", labelKey: "privacyLabel", descKey: "privacyDesc" },
                { href: "/terms", labelKey: "termsLabel", descKey: "termsDesc" },
                { href: "/cookies", labelKey: "cookiesLabel", descKey: "cookiesDesc" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl p-4 no-underline transition-all"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                  }}>
                  <p className="text-sm font-semibold m-0 mb-1" style={{ color: "var(--color-accent-light)" }}>{t(`legalPage.${link.labelKey}`)}</p>
                  <p className="text-xs m-0" style={{ color: "var(--color-text-muted)" }}>{t(`legalPage.${link.descKey}`)}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t" style={{ borderColor: "var(--color-border)" }}>
          <Link href="/" className="text-sm no-underline font-medium" style={{ color: "var(--color-accent-light)" }}>
            &larr; {t("legalPage.backToHome")}
          </Link>
        </div>
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { TonvoLogoMark } from "@/components/Logo";

export default function TermsPage() {
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
          <span className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>{t("termsPage.breadcrumb")}</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "var(--color-text)" }}>
          {t("termsPage.title")}
        </h1>
        <p className="text-sm mb-10" style={{ color: "var(--color-text-muted)" }}>
          {t("termsPage.lastUpdated")}
        </p>

        <div className="space-y-8" style={{ color: "var(--color-text-silver)" }}>
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("termsPage.s1Title")}</h2>
            <p className="text-sm leading-relaxed m-0">{t("termsPage.s1Text")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("termsPage.s2Title")}</h2>
            <p className="text-sm leading-relaxed m-0">{t("termsPage.s2Text")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("termsPage.s3Title")}</h2>
            <p className="text-sm leading-relaxed m-0">{t("termsPage.s3Text")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("termsPage.s4Title")}</h2>
            <p className="text-sm leading-relaxed mb-3">{t("termsPage.s4Intro")}</p>
            <ul className="text-sm leading-relaxed space-y-2 pl-5 m-0" style={{ listStyleType: "disc" }}>
              <li>{t("termsPage.s4Item1")}</li>
              <li>{t("termsPage.s4Item2")}</li>
              <li>{t("termsPage.s4Item3")}</li>
              <li>{t("termsPage.s4Item4")}</li>
              <li>{t("termsPage.s4Item5")}</li>
              <li>{t("termsPage.s4Item6")}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("termsPage.s5Title")}</h2>
            <div className="rounded-xl p-4 mb-3" style={{ backgroundColor: "rgba(251, 191, 36, 0.06)", border: "1px solid rgba(251, 191, 36, 0.15)" }}>
              <p className="text-sm leading-relaxed m-0" style={{ color: "var(--color-neutral)" }}>
                <strong>{t("termsPage.s5Important")}</strong> {t("termsPage.s5Warning")}
              </p>
            </div>
            <p className="text-sm leading-relaxed m-0">{t("termsPage.s5Text")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("termsPage.s6Title")}</h2>
            <ul className="text-sm leading-relaxed space-y-2 pl-5 m-0" style={{ listStyleType: "disc" }}>
              <li><strong>{t("termsPage.s6Item1Label")}</strong> {t("termsPage.s6Item1Desc")}</li>
              <li><strong>{t("termsPage.s6Item2Label")}</strong> {t("termsPage.s6Item2Desc")}</li>
              <li><strong>{t("termsPage.s6Item3Label")}</strong> {t("termsPage.s6Item3Desc")}</li>
              <li>{t("termsPage.s6Item4")}</li>
              <li>{t("termsPage.s6Item5")}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("termsPage.s7Title")}</h2>
            <p className="text-sm leading-relaxed m-0">{t("termsPage.s7Text")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("termsPage.s8Title")}</h2>
            <p className="text-sm leading-relaxed m-0">{t("termsPage.s8Text")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("termsPage.s9Title")}</h2>
            <p className="text-sm leading-relaxed m-0">{t("termsPage.s9Text")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("termsPage.s10Title")}</h2>
            <p className="text-sm leading-relaxed m-0">
              {t("termsPage.s10Text").split("Privacy Policy")[0]}
              <Link href="/privacy" style={{ color: "var(--color-accent-light)" }}>{t("footer.privacyPolicy")}</Link>
              {t("termsPage.s10Text").split("Privacy Policy")[1]}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("termsPage.s11Title")}</h2>
            <p className="text-sm leading-relaxed m-0">{t("termsPage.s11Text")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("termsPage.s12Title")}</h2>
            <p className="text-sm leading-relaxed m-0">{t("termsPage.s12Text")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("termsPage.s13Title")}</h2>
            <p className="text-sm leading-relaxed m-0">
              {t("termsPage.s13Intro")}<br /><br />
              <strong>Tonvo</strong><br />
              42170 Chambles, France<br />
              Email: <strong>tonvo.sales@gmail.com</strong>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t" style={{ borderColor: "var(--color-border)" }}>
          <Link href="/" className="text-sm no-underline font-medium" style={{ color: "var(--color-accent-light)" }}>
            &larr; {t("termsPage.backToHome")}
          </Link>
        </div>
      </main>
    </div>
  );
}

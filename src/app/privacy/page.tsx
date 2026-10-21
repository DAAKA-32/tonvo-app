"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { isOptedOut, setOptOut } from "@/lib/analytics/client";
import { TonvoLogoMark } from "@/components/Logo";

/** Per-browser switch for the first-party audience measurement (lib/analytics/client). */
function AnalyticsOptOut() {
  const { t } = useTranslation();
  const [off, setOff] = useState<boolean | null>(null);
  useEffect(() => setOff(isOptedOut()), []);
  if (off === null) return null;
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <span className="text-sm" role="status">
        {off ? t("privacyPage.analyticsStatusOff") : t("privacyPage.analyticsStatusOn")}
      </span>
      <button
        type="button"
        onClick={() => {
          setOptOut(!off);
          setOff(!off);
        }}
        className="text-sm font-medium px-3 py-1.5 rounded-lg focus-visible:outline focus-visible:outline-2"
        style={{ border: "1px solid var(--color-border)", color: "var(--color-text)" }}
      >
        {off ? t("privacyPage.analyticsOptIn") : t("privacyPage.analyticsOptOut")}
      </button>
    </div>
  );
}

export default function PrivacyPage() {
  const { t } = useTranslation();

  const dataCategories = [
    { titleKey: "s2AccountTitle", descKey: "s2AccountDesc" },
    { titleKey: "s2SessionTitle", descKey: "s2SessionDesc" },
    { titleKey: "s2ScreenTitle", descKey: "s2ScreenDesc" },
    { titleKey: "s2AudioTitle", descKey: "s2AudioDesc" },
    { titleKey: "s2PaymentTitle", descKey: "s2PaymentDesc" },
    { titleKey: "s2TechnicalTitle", descKey: "s2TechnicalDesc" },
  ];

  const retentionRows = [
    { typeKey: "s5Row1Type", retKey: "s5Row1Retention" },
    { typeKey: "s5Row2Type", retKey: "s5Row2Retention" },
    { typeKey: "s5Row3Type", retKey: "s5Row3Retention" },
    { typeKey: "s5Row4Type", retKey: "s5Row4Retention" },
    { typeKey: "s5Row5Type", retKey: "s5Row5Retention" },
    { typeKey: "s5Row6Type", retKey: "s5Row6Retention" },
    { typeKey: "s5Row7Type", retKey: "s5Row7Retention" },
  ];

  const rights = [
    { titleKey: "s8Right1Title", descKey: "s8Right1Desc" },
    { titleKey: "s8Right2Title", descKey: "s8Right2Desc" },
    { titleKey: "s8Right3Title", descKey: "s8Right3Desc" },
    { titleKey: "s8Right4Title", descKey: "s8Right4Desc" },
    { titleKey: "s8Right5Title", descKey: "s8Right5Desc" },
    { titleKey: "s8Right6Title", descKey: "s8Right6Desc" },
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
          <span className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>{t("privacyPage.breadcrumb")}</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "var(--color-text)" }}>
          {t("privacyPage.title")}
        </h1>
        <p className="text-sm mb-10" style={{ color: "var(--color-text-muted)" }}>
          {t("privacyPage.lastUpdated")}
        </p>

        <div className="space-y-10" style={{ color: "var(--color-text-silver)" }}>
          {/* 1 */}
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("privacyPage.s1Title")}</h2>
            <p className="text-sm leading-relaxed m-0">
              {t("privacyPage.s1Intro")}<br />
              <strong>Tonvo</strong><br />
              42170 Chambles, France<br />
              SIREN 101 134 633<br />
              {t("privacyPage.s1Contact")} <strong>outreach@tonvo.co</strong>
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("privacyPage.s2Title")}</h2>
            <p className="text-sm leading-relaxed mb-4">{t("privacyPage.s2Intro")}</p>
            <div className="space-y-3">
              {dataCategories.map((item) => (
                <div key={item.titleKey} className="rounded-xl p-4" style={{ backgroundColor: "var(--color-surface)" }}>
                  <p className="text-sm font-semibold m-0 mb-1" style={{ color: "var(--color-text)" }}>{t(`privacyPage.${item.titleKey}`)}</p>
                  <p className="text-xs leading-relaxed m-0" style={{ color: "var(--color-text-muted)" }}>{t(`privacyPage.${item.descKey}`)}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("privacyPage.s3Title")}</h2>
            <ul className="text-sm leading-relaxed space-y-2 pl-5 m-0" style={{ listStyleType: "disc" }}>
              <li>{t("privacyPage.s3Item1")}</li>
              <li>{t("privacyPage.s3Item2")}</li>
              <li>{t("privacyPage.s3Item3")}</li>
              <li>{t("privacyPage.s3Item4")}</li>
              <li>{t("privacyPage.s3Item5")}</li>
              <li>{t("privacyPage.s3Item6")}</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("privacyPage.s4Title")}</h2>
            <ul className="text-sm leading-relaxed space-y-2 pl-5 m-0" style={{ listStyleType: "disc" }}>
              <li><strong>{t("privacyPage.s4Item1Label")}</strong> — {t("privacyPage.s4Item1Desc")}</li>
              <li><strong>{t("privacyPage.s4Item2Label")}</strong> — {t("privacyPage.s4Item2Desc")}</li>
              <li><strong>{t("privacyPage.s4Item3Label")}</strong> — {t("privacyPage.s4Item3Desc")}</li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("privacyPage.s5Title")}</h2>
            <div className="rounded-xl p-4" style={{ backgroundColor: "var(--color-surface)" }}>
              <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <th className="text-left py-2 font-medium" style={{ color: "var(--color-text-muted)" }}>{t("privacyPage.s5ColType")}</th>
                    <th className="text-left py-2 font-medium" style={{ color: "var(--color-text-muted)" }}>{t("privacyPage.s5ColRetention")}</th>
                  </tr>
                </thead>
                <tbody>
                  {retentionRows.map((row) => (
                    <tr key={row.typeKey} style={{ borderBottom: "1px solid rgba(39,39,42,0.3)" }}>
                      <td className="py-2" style={{ color: "var(--color-text)" }}>{t(`privacyPage.${row.typeKey}`)}</td>
                      <td className="py-2" style={{ color: "var(--color-text-muted)" }}>{t(`privacyPage.${row.retKey}`)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Audience measurement (first-party analytics) */}
          <section id="analytics">
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("privacyPage.analyticsTitle")}</h2>
            <p className="text-sm leading-relaxed m-0">{t("privacyPage.analyticsText")}</p>
            <AnalyticsOptOut />
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("privacyPage.s6Title")}</h2>
            <p className="text-sm leading-relaxed mb-3">{t("privacyPage.s6Intro")}</p>
            <ul className="text-sm leading-relaxed space-y-2 pl-5 m-0" style={{ listStyleType: "disc" }}>
              <li><strong>{t("privacyPage.s6Firebase")}</strong> <em>{t("privacyPage.s6FirebaseRegion")}</em></li>
              <li><strong>{t("privacyPage.s6Supabase")}</strong> <em>{t("privacyPage.s6SupabaseRegion")}</em></li>
              <li>{t("privacyPage.s6AssemblyAI")}</li>
              <li>{t("privacyPage.s6Anthropic")}</li>
              <li>{t("privacyPage.s6Upstash")}</li>
              <li>{t("privacyPage.s6Meta")}</li>
              <li>{t("privacyPage.s6Stripe")}</li>
              <li><strong>{t("privacyPage.s6Vercel")}</strong> <em>{t("privacyPage.s6VercelRegion")}</em></li>
            </ul>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("privacyPage.s7Title")}</h2>
            <p className="text-sm leading-relaxed m-0">{t("privacyPage.s7Text")}</p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("privacyPage.s8Title")}</h2>
            <p className="text-sm leading-relaxed mb-3">{t("privacyPage.s8Intro")}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rights.map((item) => (
                <div key={item.titleKey} className="rounded-xl p-3" style={{ backgroundColor: "var(--color-surface)" }}>
                  <p className="text-sm font-semibold m-0 mb-1" style={{ color: "var(--color-text)" }}>{t(`privacyPage.${item.titleKey}`)}</p>
                  <p className="text-xs m-0" style={{ color: "var(--color-text-muted)" }}>{t(`privacyPage.${item.descKey}`)}</p>
                </div>
              ))}
            </div>
            <p className="text-sm leading-relaxed mt-4 m-0">
              {t("privacyPage.s8Contact")} <strong>outreach@tonvo.co</strong>
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("privacyPage.s9Title")}</h2>
            <p className="text-sm leading-relaxed m-0">{t("privacyPage.s9Text")}</p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("privacyPage.s10Title")}</h2>
            <p className="text-sm leading-relaxed m-0">{t("privacyPage.s10Text")}</p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("privacyPage.s11Title")}</h2>
            <p className="text-sm leading-relaxed m-0">{t("privacyPage.s11Text")}</p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--color-text)" }}>{t("privacyPage.s12Title")}</h2>
            <p className="text-sm leading-relaxed m-0">
              {t("privacyPage.s12Intro")}<br /><br />
              <strong>Tonvo</strong><br />
              42170 Chambles, France<br />
              Email: <strong>outreach@tonvo.co</strong><br /><br />
              {t("privacyPage.s12Cnil")}
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t" style={{ borderColor: "var(--color-border)" }}>
          <Link href="/" className="text-sm no-underline font-medium" style={{ color: "var(--color-accent-light)" }}>
            &larr; {t("privacyPage.backToHome")}
          </Link>
        </div>
      </main>
    </div>
  );
}

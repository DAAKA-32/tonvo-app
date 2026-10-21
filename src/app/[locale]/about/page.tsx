"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useLocalePath } from "@/components/PublicProviders";
import LanguageSelector from "@/components/LanguageSelector";
import { TonvoLogoMark } from "@/components/Logo";

/**
 * /about: the founder story. One narrative column (observation -> cost -> the opposite -> promises -> CTA),
 * every claim verifiable: no invented numbers, no testimonials, the real product film as proof.
 */

const PROMISES = ["p1", "p2", "p3", "p4", "p5"] as const;

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0 mt-1">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function AboutPage() {
  const { t } = useTranslation();
  const lp = useLocalePath();
  const body = "text-[17px] leading-[1.75] mt-0 mb-5 last:mb-0";
  const h2 = "text-xl sm:text-2xl font-semibold tracking-tight mb-4";

  return (
    <div style={{ backgroundColor: "var(--color-bg)", minHeight: "100vh", color: "var(--color-text-silver)" }} data-cta-section="about">
      <header className="border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link href={lp("/")} className="flex items-center gap-2.5 no-underline">
              <TonvoLogoMark size="sm" />
              <span className="text-lg font-bold" style={{ color: "var(--color-text)" }}>Tonvo</span>
            </Link>
            <span className="text-sm hidden sm:inline" style={{ color: "var(--color-text-muted)" }}>/</span>
            <span className="text-sm font-medium truncate hidden sm:inline" style={{ color: "var(--color-text-muted)" }}>{t("aboutPage.breadcrumb")}</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <Link
              href="/login"
              data-cta="about_header"
              className="text-sm font-semibold no-underline px-4 py-2 rounded-full whitespace-nowrap focus-visible:outline focus-visible:outline-2"
              style={{ color: "var(--color-text)", border: "1px solid rgba(52, 211, 153, 0.45)", background: "rgba(52, 211, 153, 0.12)" }}
            >
              {t("aboutPage.ctaButton")}
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 pb-20">
        {/* Hook: name the moment */}
        <h1
          className="font-bold tracking-tight m-0"
          style={{
            fontSize: "clamp(2.1rem, 5.4vw, 3.4rem)",
            lineHeight: 1.08,
            backgroundImage: "linear-gradient(135deg, #ffffff 0%, #d4d4e0 45%, #b8b8cc 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {t("aboutPage.title")}
        </h1>
        <p className="mt-5 text-lg m-0" style={{ color: "var(--color-text-muted)" }}>{t("aboutPage.intro")}</p>

        {/* 1. The observation */}
        <section className="mt-14" aria-labelledby="about-s1">
          <h2 id="about-s1" className={h2} style={{ color: "var(--color-text)" }}>{t("aboutPage.s1Title")}</h2>
          <div>
            <p className={body}>{t("aboutPage.s1p1")}</p>
            <p className={body}>{t("aboutPage.s1p2")}</p>
          </div>
          <blockquote
            className="mt-8 mb-0 mx-0 pl-5 sm:pl-6 py-1 text-xl sm:text-2xl leading-snug italic"
            style={{ borderLeft: "3px solid rgba(248, 113, 113, 0.75)", color: "var(--color-text)" }}
          >
            {t("aboutPage.quote")}
          </blockquote>
        </section>

        {/* 2. What it costs */}
        <section className="mt-14" aria-labelledby="about-s2">
          <h2 id="about-s2" className={h2} style={{ color: "var(--color-text)" }}>{t("aboutPage.s2Title")}</h2>
          <div>
            <p className={body}>{t("aboutPage.s2p1")}</p>
            <p className={body}>{t("aboutPage.s2p2")}</p>
          </div>
        </section>

        {/* 3. The opposite, with the real product as proof */}
        <section className="mt-14" aria-labelledby="about-s3">
          <h2 id="about-s3" className={h2} style={{ color: "var(--color-text)" }}>{t("aboutPage.s3Title")}</h2>
          <div>
            <p className={body}>{t("aboutPage.s3p1")}</p>
            <p className={body}>{t("aboutPage.s3p2")}</p>
          </div>
          <figure className="mt-8 mb-0 mx-0">
            <video
              className="w-full rounded-2xl block"
              style={{ aspectRatio: "16 / 9", background: "#09090b", border: "1px solid var(--color-border)" }}
              src="/vsl/tonvo-vsl.mp4"
              poster="/vsl/tonvo-vsl-poster.jpg"
              controls
              playsInline
              preload="none"
              aria-label={t("aboutPage.videoLabel")}
            />
          </figure>
        </section>

        {/* 4. Promises (risk reversal, trust) */}
        <section className="mt-14" aria-labelledby="about-s4">
          <h2 id="about-s4" className={h2} style={{ color: "var(--color-text)" }}>{t("aboutPage.s4Title")}</h2>
          <ul className="list-none p-0 m-0 space-y-5">
            {PROMISES.map((p) => (
              <li key={p} className="flex gap-3">
                <Check />
                <p className={body}>
                  <strong style={{ color: "var(--color-text)" }}>{t(`aboutPage.${p}Title`)}</strong>{" "}
                  {t(`aboutPage.${p}Text`)}
                  {p === "p2" && (
                    <>
                      {" "}
                      <Link href={lp("/privacy")} className="underline" style={{ color: "var(--color-text-silver)" }}>
                        {t("aboutPage.p2Link")}
                      </Link>
                    </>
                  )}
                  {p === "p5" && (
                    <>
                      {" "}
                      <a href="mailto:outreach@tonvo.co" className="underline" style={{ color: "var(--color-text)" }}>
                        outreach@tonvo.co
                      </a>
                    </>
                  )}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-10 mb-0 text-[17px]" style={{ color: "var(--color-text)" }}>
            <span className="font-semibold">Emilien Nepveu</span>
            <span style={{ color: "var(--color-text-muted)" }}>, {t("aboutPage.signRole")}</span>
          </p>
        </section>

        {/* 5. Future pacing + one action */}
        <section
          className="mt-16 rounded-3xl px-6 sm:px-10 py-10 sm:py-12"
          style={{ border: "1px solid var(--color-border)", background: "radial-gradient(ellipse 80% 90% at 50% 0%, rgba(52,211,153,0.08), rgba(9,9,11,0) 70%)" }}
          aria-labelledby="about-cta"
        >
          <h2 id="about-cta" className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight m-0" style={{ color: "var(--color-text)" }}>
            {t("aboutPage.ctaTitle")}
          </h2>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/login"
              data-cta="about_bottom"
              className="inline-flex items-center gap-2 text-base font-semibold no-underline px-6 py-3 rounded-full focus-visible:outline focus-visible:outline-2"
              style={{
                color: "var(--color-text)",
                background: "linear-gradient(135deg, rgba(52, 211, 153, 0.25) 0%, rgba(52, 211, 153, 0.08) 100%)",
                border: "1px solid rgba(52, 211, 153, 0.45)",
              }}
            >
              {t("aboutPage.ctaButton")}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
            <Link href={lp("/") + "#demo"} className="text-base font-medium no-underline px-4 py-3" style={{ color: "var(--color-text-silver)" }}>
              {t("aboutPage.ctaSecondary")}
            </Link>
          </div>
          <p className="mt-4 mb-0 text-sm" style={{ color: "var(--color-text-muted)" }}>{t("aboutPage.ctaNote")}</p>
        </section>

        <p className="mt-12 mb-0 text-sm" style={{ color: "var(--color-text-muted)" }}>{t("aboutPage.company")}</p>
      </main>
    </div>
  );
}

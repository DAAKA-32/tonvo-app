"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { detectOS, downloadUrl, osLabel, type OS } from "@/lib/detect-os";

function IconDownload() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export default function DesktopDownloadHero() {
  const { t } = useTranslation();
  const [os, setOS] = useState<OS>("unknown");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setOS(detectOS());
    setMounted(true);
  }, []);

  const primaryOS: OS = os === "unknown" ? "windows" : os;
  const others = (["windows", "macos", "linux"] as OS[]).filter(
    (o) => o !== primaryOS,
  );

  return (
    <section
      className="relative py-24 px-6 flex justify-center overflow-hidden"
      aria-labelledby="desktop-dl-heading"
      style={{
        background:
          "linear-gradient(180deg, transparent 0%, rgba(92, 92, 110, 0.05) 50%, transparent 100%)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(200, 200, 216, 0.08) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-2xl text-center">
        <span
          className="inline-block text-[11px] font-semibold uppercase tracking-[0.18em] mb-4 px-3 py-1 rounded-full"
          style={{
            color: "var(--color-accent-light)",
            background: "rgba(200, 200, 216, 0.06)",
            border: "1px solid rgba(200, 200, 216, 0.1)",
          }}
        >
          {t("landing.desktopDownload.badge")}
        </span>

        <h2
          id="desktop-dl-heading"
          className="text-4xl md:text-5xl font-bold tracking-tight mb-3"
          style={{ color: "var(--color-text)" }}
        >
          {t("landing.desktopDownload.title")}
        </h2>

        <p
          className="text-base md:text-lg mb-8 max-w-md mx-auto"
          style={{ color: "var(--color-text-silver)" }}
        >
          {mounted
            ? t("landing.desktopDownload.subtitle", { os: osLabel(primaryOS) })
            : t("landing.desktopDownload.subtitleNoOS")}
        </p>

        <a
          href={downloadUrl(primaryOS)}
          data-os={primaryOS}
          rel="noopener"
          className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background:
              "linear-gradient(135deg, var(--color-accent-light) 0%, #fafafa 100%)",
            color: "#09090b",
            boxShadow: "0 8px 24px rgba(200, 200, 216, 0.15)",
          }}
        >
          <IconDownload />
          {mounted
            ? t("landing.desktopDownload.cta", { os: osLabel(primaryOS) })
            : t("landing.desktopDownload.ctaFallback")}
        </a>

        <p
          className="mt-6 text-sm"
          style={{ color: "var(--color-text-muted)" }}
        >
          {t("landing.desktopDownload.alsoOn")}{" "}
          {others.map((o, i) => (
            <span key={o}>
              <a
                href={downloadUrl(o)}
                rel="noopener"
                className="underline underline-offset-4 transition-colors hover:text-white"
                style={{ color: "var(--color-text-silver)" }}
              >
                {osLabel(o)}
              </a>
              {i < others.length - 1 ? " · " : ""}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

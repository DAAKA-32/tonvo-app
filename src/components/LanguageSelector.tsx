"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES, loadLanguage } from "@/i18n/config";

const FLAG_EMOJI: Record<string, string> = {
  GB: "🇬🇧", ES: "🇪🇸", FR: "🇫🇷", DE: "🇩🇪", PT: "🇵🇹",
  IT: "🇮🇹", NL: "🇳🇱", CN: "🇨🇳", JP: "🇯🇵", KR: "🇰🇷",
};

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  async function select(code: string) {
    await loadLanguage(code);
    i18n.changeLanguage(code);
    localStorage.setItem("tonvo-language", code);
    document.documentElement.lang = code;
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border-none cursor-pointer transition-colors"
        style={{ background: "rgba(255,255,255,0.04)", color: "var(--color-text-muted)" }}
        aria-label="Change language"
      >
        <span>{FLAG_EMOJI[current.flag] || "🌐"}</span>
        <span className="hidden sm:inline">{current.code.toUpperCase()}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1.5 py-1.5 rounded-xl z-50 min-w-[160px]"
          style={{
            background: "rgba(20, 20, 24, 0.98)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
          }}
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => select(lang.code)}
              className="flex items-center gap-2.5 w-full px-3.5 py-2 text-left text-sm border-none cursor-pointer transition-colors"
              style={{
                background: lang.code === i18n.language ? "rgba(255,255,255,0.06)" : "transparent",
                color: lang.code === i18n.language ? "var(--color-text)" : "var(--color-text-muted)",
                fontWeight: lang.code === i18n.language ? 600 : 400,
              }}
            >
              <span>{FLAG_EMOJI[lang.flag] || "🌐"}</span>
              <span>{lang.label}</span>
              {lang.code === i18n.language && (
                <svg className="ml-auto" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-positive)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

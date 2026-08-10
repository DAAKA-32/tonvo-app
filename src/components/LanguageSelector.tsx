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
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border-none cursor-pointer"
        style={{
          background: open ? "color-mix(in srgb, var(--color-text) 6%, transparent)" : "color-mix(in srgb, var(--color-text) 2.5%, transparent)",
          border: `1px solid color-mix(in srgb, var(--color-text) ${open ? 18 : 8}%, transparent)`,
          color: "var(--color-text-silver)",
          transition: "background 0.25s ease, border-color 0.25s ease, color 0.25s ease",
        }}
        onMouseEnter={(e) => {
          if (open) return;
          e.currentTarget.style.background = "color-mix(in srgb, var(--color-text) 6%, transparent)";
          e.currentTarget.style.borderColor = "color-mix(in srgb, var(--color-text) 18%, transparent)";
          e.currentTarget.style.color = "var(--color-text)";
        }}
        onMouseLeave={(e) => {
          if (open) return;
          e.currentTarget.style.background = "color-mix(in srgb, var(--color-text) 2.5%, transparent)";
          e.currentTarget.style.borderColor = "color-mix(in srgb, var(--color-text) 8%, transparent)";
          e.currentTarget.style.color = "var(--color-text-silver)";
        }}
        aria-label="Change language"
      >
        <span>{FLAG_EMOJI[current.flag] || "🌐"}</span>
        <span className="hidden sm:inline font-medium tracking-[0.06em]">
          {current.code.toUpperCase()}
        </span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            opacity: 0.6,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.25s ease",
          }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 py-1.5 rounded-2xl z-50 min-w-42.5 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--color-surface-2) 96%, transparent) 0%, color-mix(in srgb, var(--color-surface) 96%, transparent) 100%)",
            backdropFilter: "blur(20px) saturate(160%)",
            WebkitBackdropFilter: "blur(20px) saturate(160%)",
            border: "1px solid color-mix(in srgb, var(--color-text) 8%, transparent)",
            boxShadow:
              "0 24px 60px -20px rgba(0, 0, 0, 0.7), inset 0 1px 0 color-mix(in srgb, var(--color-text) 4%, transparent)",
          }}
        >
          {SUPPORTED_LANGUAGES.map((lang) => {
            const active = lang.code === i18n.language;
            return (
              <button
                key={lang.code}
                onClick={() => select(lang.code)}
                className="flex items-center gap-2.5 w-full px-3.5 py-2 text-left text-sm border-none cursor-pointer"
                style={{
                  background: active ? "color-mix(in srgb, var(--color-text) 6%, transparent)" : "transparent",
                  color: active ? "var(--color-text)" : "var(--color-text-silver)",
                  fontWeight: active ? 600 : 400,
                  transition: "background 0.2s ease, color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (active) return;
                  e.currentTarget.style.background = "color-mix(in srgb, var(--color-text) 4%, transparent)";
                  e.currentTarget.style.color = "var(--color-text)";
                }}
                onMouseLeave={(e) => {
                  if (active) return;
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--color-text-silver)";
                }}
              >
                <span>{FLAG_EMOJI[lang.flag] || "🌐"}</span>
                <span>{lang.label}</span>
                {active && (
                  <svg
                    className="ml-auto"
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-positive)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

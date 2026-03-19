"use client";

import { useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { authFetch } from "@/lib/api-client";

/**
 * Hook to translate AI-generated fields to the current UI language.
 * Caches results to avoid re-translating the same content.
 */
export function useTranslateFields() {
  const { i18n } = useTranslation();
  const [translating, setTranslating] = useState(false);
  const cache = useRef<Map<string, Record<string, unknown>>>(new Map());

  const translate = useCallback(
    async (fields: Record<string, string | string[]>): Promise<Record<string, string | string[]>> => {
      const lang = i18n.language;

      // No translation needed for English
      if (lang === "en") return fields;

      // Check cache
      const cacheKey = `${lang}:${JSON.stringify(fields)}`;
      if (cache.current.has(cacheKey)) {
        return cache.current.get(cacheKey) as Record<string, string | string[]>;
      }

      setTranslating(true);
      try {
        const res = await authFetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fields, targetLanguage: lang }),
        });

        if (!res.ok) return fields;

        const data = await res.json();
        const translated = data.translated || fields;

        // Cache result
        cache.current.set(cacheKey, translated);

        return translated as Record<string, string | string[]>;
      } catch {
        return fields;
      } finally {
        setTranslating(false);
      }
    },
    [i18n.language]
  );

  return { translate, translating };
}

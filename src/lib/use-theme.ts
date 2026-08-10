"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { authFetch } from "@/lib/api-client";

type Theme = "dark" | "light";

function getInitialTheme(): Theme {
  if (typeof document !== "undefined") {
    return document.documentElement.getAttribute("data-theme") === "light"
      ? "light"
      : "dark";
  }
  return "dark";
}

/** Keeps native browser chrome (color-scheme, mobile theme-color) in sync
 *  with the in-app theme — CSS alone reacts to the data-theme attribute,
 *  but the theme-color meta tag doesn't, so it needs a manual nudge. */
function applyThemeSideEffects(t: Theme) {
  document.documentElement.setAttribute("data-theme", t);
  document.documentElement.style.colorScheme = t;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", t === "light" ? "#fafafa" : "#09090b");
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const { user } = useAuth();
  const hasFetched = useRef(false);

  // On mount: apply localStorage theme immediately (prevents flash)
  useEffect(() => {
    const stored = localStorage.getItem("tonvo-theme") as Theme | null;
    if (stored && stored !== theme) {
      setThemeState(stored);
      applyThemeSideEffects(stored);
    }
  }, []);

  // When user logs in: fetch their server-side preference
  useEffect(() => {
    if (!user || hasFetched.current) return;
    hasFetched.current = true;

    authFetch("/api/user-preferences")
      .then((r) => r.json())
      .then((data) => {
        if (data.theme && (data.theme === "dark" || data.theme === "light")) {
          setThemeState(data.theme);
          localStorage.setItem("tonvo-theme", data.theme);
          applyThemeSideEffects(data.theme);
        }
      })
      .catch(() => {});
  }, [user]);

  // Reset fetch flag on logout so next login re-fetches
  useEffect(() => {
    if (!user) hasFetched.current = false;
  }, [user]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("tonvo-theme", t);
    applyThemeSideEffects(t);

    // Persist to server if logged in (fire-and-forget)
    if (user) {
      authFetch("/api/user-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: t }),
      }).catch(() => {});
    }
  };

  return { theme, setTheme };
}

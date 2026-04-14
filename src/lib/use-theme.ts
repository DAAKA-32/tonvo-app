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

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const { user } = useAuth();
  const hasFetched = useRef(false);

  // On mount: apply localStorage theme immediately (prevents flash)
  useEffect(() => {
    const stored = localStorage.getItem("tonvo-theme") as Theme | null;
    if (stored && stored !== theme) {
      setThemeState(stored);
      document.documentElement.setAttribute("data-theme", stored);
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
          document.documentElement.setAttribute("data-theme", data.theme);
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
    document.documentElement.setAttribute("data-theme", t);

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

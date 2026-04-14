"use client";

import { useState, useEffect } from "react";

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

  useEffect(() => {
    const stored = localStorage.getItem("tonvo-theme") as Theme | null;
    if (stored === "light" && theme !== "light") setThemeState("light");
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("tonvo-theme", t);
    document.documentElement.setAttribute("data-theme", t);
  };

  return { theme, setTheme };
}

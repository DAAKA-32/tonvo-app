"use client";

import { useState, useEffect } from "react";

type Theme = "dark" | "light";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem("tonvo-theme") as Theme | null;
    if (stored === "light") setThemeState("light");
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("tonvo-theme", t);
    document.documentElement.setAttribute("data-theme", t);
  };

  return { theme, setTheme };
}

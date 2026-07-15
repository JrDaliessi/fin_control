"use client";

import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DARK_THEME_QUERY,
  isThemePreference,
  THEME_STORAGE_KEY,
} from "./theme.constants";
import { resolveTheme } from "./resolveTheme";
import type {
  ThemeControllerValue,
  ThemePreference,
} from "./theme.types";

export const ThemeContext = createContext<ThemeControllerValue | null>(null);

type ThemeProviderProps = {
  children: ReactNode;
};

function readStoredPreference(): ThemePreference {
  if (typeof window === "undefined") {
    return "system";
  }

  try {
    const storedPreference = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemePreference(storedPreference) ? storedPreference : "system";
  } catch {
    return "system";
  }
}

function systemPrefersDark(): boolean {
  return typeof window !== "undefined" && window.matchMedia(DARK_THEME_QUERY).matches;
}

function applyResolvedTheme(resolvedTheme: "light" | "dark") {
  if (resolvedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    return;
  }

  document.documentElement.removeAttribute("data-theme");
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [preference, setPreference] = useState<ThemePreference>(readStoredPreference);
  const [prefersDark, setPrefersDark] = useState(systemPrefersDark);
  const resolvedTheme = resolveTheme(preference, prefersDark);

  useEffect(() => {
    applyResolvedTheme(resolvedTheme);

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, preference);
    } catch {
      // A preferência permanece válida durante a sessão quando storage está indisponível.
    }
  }, [preference, resolvedTheme]);

  useEffect(() => {
    if (preference !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia(DARK_THEME_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersDark(event.matches);
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [preference]);

  const value = useMemo<ThemeControllerValue>(
    () => ({ preference, resolvedTheme, setPreference }),
    [preference, resolvedTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

import type { ThemePreference } from "./theme.types";

export const THEME_STORAGE_KEY = "fincontrol.theme";
export const DARK_THEME_QUERY = "(prefers-color-scheme: dark)";

export const THEME_PREFERENCES: readonly ThemePreference[] = [
  "light",
  "dark",
  "system",
];

export function isThemePreference(value: unknown): value is ThemePreference {
  return THEME_PREFERENCES.includes(value as ThemePreference);
}

"use client";

import clsx from "clsx";
import { THEME_PREFERENCES } from "../../theme/theme.constants";
import type { ThemePreference } from "../../theme/theme.types";
import { useTheme } from "../../theme/useTheme";

const labels: Record<ThemePreference, string> = {
  dark: "Escuro",
  light: "Claro",
  system: "Sistema",
};

export function ThemeSwitcher() {
  const { preference, setPreference } = useTheme();

  return (
    <fieldset className="flex flex-wrap gap-2">
      <legend className="sr-only">Tema</legend>
      <div
        aria-label="Tema"
        className="flex flex-wrap gap-2"
        role="radiogroup"
      >
        {THEME_PREFERENCES.map((option) => (
          <label
            className={clsx(
              "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-border bg-surface px-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted focus-within:ring-2 focus-within:ring-focus-ring focus-within:ring-offset-2",
              preference === option && "border-primary bg-success-surface",
            )}
            key={option}
          >
            <input
              checked={preference === option}
              className="h-4 w-4 shrink-0 accent-primary"
              name="theme-preference"
              onChange={() => setPreference(option)}
              type="radio"
              value={option}
            />
            {labels[option]}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

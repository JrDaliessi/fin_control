import { describe, expect, it } from "@jest/globals";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

const expectedTokens = {
  light: {
    accent: "37 99 235",
    background: "246 248 252",
    border: "229 231 235",
    "danger-foreground": "185 28 28",
    expense: "220 38 38",
    "focus-ring": "37 99 235",
    foreground: "17 24 39",
    income: "21 128 61",
    "muted-foreground": "95 111 133",
    primary: "15 118 110",
    "primary-foreground": "255 255 255",
    "primary-hover": "17 94 89",
    surface: "255 255 255",
    "surface-elevated": "255 255 255",
    warning: "217 119 6",
  },
  dark: {
    accent: "96 165 250",
    background: "11 18 32",
    border: "51 65 85",
    "danger-foreground": "253 164 175",
    expense: "251 113 133",
    "focus-ring": "125 211 252",
    foreground: "248 250 252",
    income: "74 222 128",
    "muted-foreground": "148 163 184",
    primary: "45 212 191",
    "primary-foreground": "4 47 46",
    "primary-hover": "94 234 212",
    surface: "17 24 39",
    "surface-elevated": "30 41 59",
    warning: "251 191 36",
  },
} as const;

function readProjectFile(...segments: string[]) {
  return readFileSync(join(ROOT, ...segments), "utf-8");
}

function readToken(block: string, token: string) {
  return block.match(new RegExp(`--${token}:\\s*([0-9 ]+);`))?.[1]?.trim();
}

function selectorBlock(css: string, selector: "light" | "dark") {
  const expression =
    selector === "light"
      ? /:root\s*\{([^}]*)\}/
      : /\[data-theme=["']dark["']\]\s*\{([^}]*)\}/;

  return css.match(expression)?.[1] ?? "";
}

function rgb(value: string) {
  return value.split(/\s+/).map(Number) as [number, number, number];
}

function luminance(channelValues: [number, number, number]) {
  const [red, green, blue] = channelValues.map((value) => {
    const normalized = value / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return red * 0.2126 + green * 0.7152 + blue * 0.0722;
}

function contrast(first: string, second: string) {
  const firstLuminance = luminance(rgb(first));
  const secondLuminance = luminance(rgb(second));
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

function productionSourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);

    if (statSync(path).isDirectory()) {
      return productionSourceFiles(path);
    }

    if (!/\.(ts|tsx)$/.test(entry) || /\.(test|spec)\.(ts|tsx)$/.test(entry)) {
      return [];
    }

    return [path];
  });
}

describe("FinControl design-system contract", () => {
  it("defines the approved semantic tokens for light and dark themes", () => {
    const css = readProjectFile("src", "app", "globals.css");

    for (const theme of ["light", "dark"] as const) {
      const block = selectorBlock(css, theme);
      expect(block).not.toBe("");

      for (const [token, value] of Object.entries(expectedTokens[theme])) {
        expect(readToken(block, token)).toBe(value);
      }
    }
  });

  it("keeps essential text, action and focus combinations at WCAG AA contrast", () => {
    const css = readProjectFile("src", "app", "globals.css");

    for (const theme of ["light", "dark"] as const) {
      const block = selectorBlock(css, theme);
      const token = (name: keyof (typeof expectedTokens)[typeof theme]) =>
        readToken(block, name) ?? "0 0 0";

      expect(contrast(token("foreground"), token("background"))).toBeGreaterThanOrEqual(4.5);
      expect(contrast(token("muted-foreground"), token("background"))).toBeGreaterThanOrEqual(4.5);
      expect(contrast(token("primary-foreground"), token("primary"))).toBeGreaterThanOrEqual(4.5);
      expect(contrast(token("danger-foreground"), token("background"))).toBeGreaterThanOrEqual(4.5);
      expect(contrast(token("focus-ring"), token("background"))).toBeGreaterThanOrEqual(3);
    }
  });

  it("maps Tailwind colors to CSS variables and uses the approved dark selector", () => {
    const tailwind = readProjectFile("tailwind.config.ts");

    expect(tailwind).toMatch(
      /darkMode:\s*\[\s*["']selector["']\s*,\s*["']\[data-theme=[^\]]+\]["']\s*\]/,
    );

    for (const token of Object.keys(expectedTokens.light)) {
      expect(tailwind).toContain(`rgb(var(--${token}) / <alpha-value>)`);
    }
  });

  it("uses FinControl, Geist and the pre-hydration theme initializer in the root layout", () => {
    const layout = readProjectFile("src", "app", "layout.tsx");

    expect(layout).toContain('import { Geist } from "next/font/google"');
    expect(layout).toContain('variable: "--font-geist-sans"');
    expect(layout).toContain('title: "FinControl"');
    expect(layout).toContain('applicationName: "FinControl"');
    expect(layout).toContain('title: "FinControl"');
    expect(layout).toContain("suppressHydrationWarning");
    expect(layout).toContain('src="/theme-init.js"');
    expect(layout).toContain('strategy="beforeInteractive"');
  });

  it("uses the FinControl brand across current production surfaces and the PWA icon", () => {
    const legacyBrand = "Controle Financeiro IA";
    const sourceFindings = productionSourceFiles(join(ROOT, "src")).filter((file) =>
      readFileSync(file, "utf-8").includes(legacyBrand),
    );
    const icon = readProjectFile("public", "icon.svg");

    expect(sourceFindings).toEqual([]);
    expect(icon).toContain('aria-label="FinControl"');
    expect(icon).not.toContain(legacyBrand);
  });

  it("provides a local initializer with an allowlisted theme preference", () => {
    const initializerPath = join(ROOT, "public", "theme-init.js");

    expect(existsSync(initializerPath)).toBe(true);

    if (!existsSync(initializerPath)) {
      return;
    }

    const initializer = readFileSync(initializerPath, "utf-8");

    expect(initializer).toContain("fincontrol.theme");
    expect(initializer).toContain("prefers-color-scheme: dark");
    expect(initializer).toMatch(/light[\s\S]*dark[\s\S]*system/);
    expect(initializer).toContain("data-theme");
  });

  it("does not leave literal palette utilities in production components", () => {
    const literalPalette =
      /(?:bg|text|border|ring)-(?:slate|teal|red|blue|green|yellow|amber|rose)-\d+|(?:bg|text|border)-(?:white|black)/g;
    const findings = productionSourceFiles(join(ROOT, "src")).flatMap((file) => {
      const source = readFileSync(file, "utf-8");
      const matches = source.match(literalPalette) ?? [];
      return matches.map((match) => `${file.replace(`${ROOT}\\`, "")}: ${match}`);
    });

    expect(findings).toEqual([]);
  });

  it("adopts the approved primitives in current interactive flows", () => {
    const expectedImports = new Map<string, readonly string[]>([
      [
        "src/features/accounts/presentation/components/AccountForm.tsx",
        ["Button", "FeedbackMessage"],
      ],
      [
        "src/features/transactions/presentation/components/TransactionForm.tsx",
        ["Button", "FeedbackMessage"],
      ],
      [
        "src/features/auth/presentation/pages/LoginPage.tsx",
        ["Button", "FeedbackMessage"],
      ],
      [
        "src/features/auth/presentation/components/SignOutButton.tsx",
        ["Button", "FeedbackMessage"],
      ],
      [
        "src/features/transactions/presentation/components/MonthlySummaryPanel.tsx",
        ["FeedbackMessage"],
      ],
      [
        "src/features/dashboard/presentation/pages/DashboardPage.tsx",
        ["FeedbackMessage"],
      ],
      [
        "src/features/dashboard/presentation/components/DashboardEmptyState.tsx",
        ["Card"],
      ],
    ]);

    for (const [path, primitives] of expectedImports) {
      const source = readProjectFile(...path.split("/"));

      for (const primitive of primitives) {
        expect(source).toContain(`import { ${primitive} } from`);
      }
    }
  });

  it("provides a global reduced-motion fallback", () => {
    const css = readProjectFile("src", "app", "globals.css");

    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain("animation-duration: 0.01ms");
    expect(css).toContain("transition-duration: 0.01ms");
  });
});

import { describe, expect, it } from "@jest/globals";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const root = process.cwd();
const sourceRoot = join(root, "src");
const analyticsRoot = join(sourceRoot, "features", "financial-analytics");

function sourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory()
      ? sourceFiles(path)
      : /\.[jt]sx?$/.test(entry)
        ? [path]
        : [];
  });
}

describe("financial candles architecture", () => {
  it.each([
    "domain/services/aggregate-financial-candles.ts",
    "presentation/charts/financial-candlestick-chart.model.ts",
    "presentation/charts/to-financial-candlestick-chart-model.ts",
    "presentation/charts/echarts/build-financial-candlestick-option.ts",
    "presentation/components/FinancialCandlestickChart.client.tsx",
    "presentation/components/FinancialCandlesTable.tsx",
    "presentation/components/FinancialVisualizationSwitcher.client.tsx"
  ])("requires the approved SR-015 boundary: %s", (path) => {
    expect(existsSync(join(analyticsRoot, path))).toBe(true);
  });

  it("keeps ECharts imports confined to the presentation adapter", () => {
    const violations = sourceFiles(sourceRoot)
      .filter(
        (path) =>
          !path.includes(
            `${join("features", "financial-analytics", "tests")}${sep}`
          ) &&
          !path.includes(
            join(
              "features",
              "financial-analytics",
              "presentation",
              "charts",
              "echarts"
            )
          )
      )
      .filter((path) =>
        /from ["']echarts(?:\/|["'])/.test(readFileSync(path, "utf-8"))
      )
      .map((path) => relative(root, path));

    expect(violations).toEqual([]);
  });

  it("registers candlestick through the existing modular SVG adapter", () => {
    const adapter = readFileSync(
      join(
        analyticsRoot,
        "presentation",
        "charts",
        "echarts",
        "echarts-client.ts"
      ),
      "utf-8"
    );

    expect(adapter).toContain('from "echarts/charts"');
    expect(adapter).toContain("LineChart");
    expect(adapter).toContain("CandlestickChart");
    expect(adapter).toContain("SVGRenderer");
    expect(adapter).not.toMatch(/from ["']echarts["']/);
  });

  it("keeps the panel server-side and maps both serializable models there", () => {
    const panel = readFileSync(
      join(
        analyticsRoot,
        "presentation",
        "components",
        "FinancialEvolutionPanel.tsx"
      ),
      "utf-8"
    );

    expect(panel).not.toMatch(/^["']use client["'];?/m);
    expect(panel).toContain("toFinancialEvolutionChartModel");
    expect(panel).toContain("toFinancialCandlestickChartModel");
    expect(panel).toContain("FinancialVisualizationSwitcher");
    expect(panel).not.toMatch(/from ["']echarts(?:\/|["'])/);
  });

  it("limits the client switcher to presentation state and serializable props", () => {
    const switcherPath = join(
      analyticsRoot,
      "presentation",
      "components",
      "FinancialVisualizationSwitcher.client.tsx"
    );

    expect(existsSync(switcherPath)).toBe(true);

    if (!existsSync(switcherPath)) {
      return;
    }

    const switcher = readFileSync(switcherPath, "utf-8");

    expect(switcher).toMatch(/^["']use client["'];?/m);
    expect(switcher).toContain("Evolução do saldo");
    expect(switcher).toContain("Variação do saldo");
    expect(switcher).not.toMatch(
      /fetch\s*\(|supabase|localStorage|indexedDB|serviceWorker/i
    );
  });

  it("centralizes the shared chart lifecycle without creating a generic chart port", () => {
    const hookPath = join(
      analyticsRoot,
      "presentation",
      "hooks",
      "useFinancialChart.ts"
    );
    const evolutionChart = readFileSync(
      join(
        analyticsRoot,
        "presentation",
        "components",
        "FinancialEvolutionChart.client.tsx"
      ),
      "utf-8"
    );
    const candlestickChart = readFileSync(
      join(
        analyticsRoot,
        "presentation",
        "components",
        "FinancialCandlestickChart.client.tsx"
      ),
      "utf-8"
    );

    expect(existsSync(hookPath)).toBe(true);

    if (!existsSync(hookPath)) {
      return;
    }

    const hook = readFileSync(hookPath, "utf-8");

    expect(evolutionChart).toContain("useFinancialChart");
    expect(candlestickChart).toContain("useFinancialChart");
    expect(evolutionChart).not.toContain("ResizeObserver");
    expect(candlestickChart).not.toContain("ResizeObserver");
    expect(hook).toContain("ResizeObserver");
    expect(hook).not.toMatch(/ChartPort|supabase|fetch\s*\(/i);
  });
});

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

describe("financial evolution chart architecture", () => {
  it.each([
    "presentation/charts/financial-evolution-chart.model.ts",
    "presentation/charts/to-financial-evolution-chart-model.ts",
    "presentation/charts/echarts/build-financial-evolution-option.ts",
    "presentation/charts/echarts/echarts-client.ts",
    "presentation/components/FinancialEvolutionChart.client.tsx"
  ])("creates only the approved chart boundary: %s", (path) => {
    expect(existsSync(join(analyticsRoot, path))).toBe(true);
  });

  it("pins ECharts directly and does not add a React wrapper", () => {
    const packageJson = JSON.parse(
      readFileSync(join(root, "package.json"), "utf-8")
    ) as { dependencies?: Record<string, string> };

    expect(packageJson.dependencies?.echarts).toBe("6.1.0");
    expect(packageJson.dependencies?.["echarts-for-react"]).toBeUndefined();
  });

  it("keeps ECharts imports inside the approved presentation adapter", () => {
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
      .filter((path) => /from ["']echarts(?:\/|["'])/.test(readFileSync(path, "utf-8")))
      .map((path) => relative(root, path));

    expect(violations).toEqual([]);
  });

  it("requires modular imports and the SVG renderer in the ECharts adapter", () => {
    const adapterPath = join(
      analyticsRoot,
      "presentation",
      "charts",
      "echarts",
      "echarts-client.ts"
    );

    expect(existsSync(adapterPath)).toBe(true);

    if (!existsSync(adapterPath)) {
      return;
    }

    const adapter = readFileSync(adapterPath, "utf-8");

    expect(adapter).toContain('from "echarts/core"');
    expect(adapter).toContain("LineChart");
    expect(adapter).toContain("AriaComponent");
    expect(adapter).toContain("SVGRenderer");
    expect(adapter).not.toMatch(/from ["']echarts["']/);
  });

  it("preserves the server panel and its accessible table", () => {
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
    expect(panel).toContain("FinancialEvolutionTable");
  });

  it("requires the server panel to own the approved chart integration", () => {
    const panel = readFileSync(
      join(
        analyticsRoot,
        "presentation",
        "components",
        "FinancialEvolutionPanel.tsx"
      ),
      "utf-8"
    );

    expect(panel).toContain("toFinancialEvolutionChartModel");
    expect(panel).toContain("FinancialEvolutionChart");
    expect(panel).toContain("Evolução do saldo");
    expect(panel).not.toContain("next/dynamic");
    expect(panel).not.toMatch(/from ["']echarts(?:\/|["'])/);
  });

  it("requires chart islands to use the provider-neutral expandable frame", () => {
    const chartIsland = readFileSync(
      join(
        analyticsRoot,
        "presentation",
        "components",
        "FinancialEvolutionChart.client.tsx"
      ),
      "utf-8"
    );
    const expandableFrame = readFileSync(
      join(
        process.cwd(),
        "src",
        "shared",
        "components",
        "charts",
        "ExpandableChartFrame.client.tsx"
      ),
      "utf-8"
    );
    const globalStyles = readFileSync(
      join(process.cwd(), "src", "app", "globals.css"),
      "utf-8"
    );

    expect(chartIsland).toContain("ExpandableChartFrame");
    expect(expandableFrame).not.toMatch(/echarts|supabase/i);
    expect(expandableFrame).not.toContain("FinancialEvolution");
    expect(expandableFrame).toContain("group/chart-frame");
    expect(expandableFrame).toContain("chart-frame-expanded");
    expect(globalStyles).toContain(".chart-frame-expanded");
    ["top", "right", "bottom", "left"].forEach((edge) => {
      expect(globalStyles).toContain(`safe-area-inset-${edge}`);
    });
  });

  it("keeps the client island independent from data sources and offline claims", () => {
    const clientIsland = readFileSync(
      join(
        analyticsRoot,
        "presentation",
        "components",
        "FinancialEvolutionChart.client.tsx"
      ),
      "utf-8"
    );

    expect(clientIsland).not.toMatch(
      /fetch\s*\(|supabase|localStorage|indexedDB|serviceWorker/i
    );
    expect(clientIsland).toContain(
      'className="min-h-72 min-w-0 w-full group-data-[expanded=true]/chart-frame:min-h-0"'
    );
  });
});

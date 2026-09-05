import { describe, expect, it } from "@jest/globals";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const analyticsRoot = join(
  process.cwd(),
  "src",
  "features",
  "financial-analytics"
);

describe("financial interval statement architecture", () => {
  it.each([
    "domain/services/analyze-financial-interval.ts",
    "domain/services/validate-financial-interval.ts",
    "application/ports/financial-interval-statement-query.repository.ts",
    "application/use-cases/list-financial-interval-statement.use-case.ts",
    "infrastructure/repositories/supabase-financial-interval-statement-query.repository.ts",
    "presentation/components/FinancialIntervalStatementPanel.client.tsx"
  ])("requires the approved UX-CHART-002 boundary: %s", (path) => {
    expect(existsSync(join(analyticsRoot, path))).toBe(true);
  });

  it("keeps direct data access out of presentation", () => {
    const presentationFiles = [
      "presentation/components/FinancialCandlestickChart.client.tsx",
      "presentation/components/FinancialCandlesTable.tsx",
      "presentation/components/FinancialVisualizationSwitcher.client.tsx",
      "presentation/components/FinancialIntervalStatementPanel.client.tsx"
    ];

    for (const path of presentationFiles) {
      const source = readFileSync(join(analyticsRoot, path), "utf-8");
      expect(source).not.toMatch(/createSupabase|\.from\s*\(|service_role/i);
    }
  });

  it("does not introduce a generic chart port for candle selection", () => {
    const hook = readFileSync(
      join(analyticsRoot, "presentation/hooks/useFinancialChart.ts"),
      "utf-8"
    );

    expect(hook).not.toMatch(/ChartPort/);
  });
});

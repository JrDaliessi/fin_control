import { describe, expect, it } from "@jest/globals";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

function readSource(...segments: string[]) {
  return readFileSync(join(process.cwd(), "src", ...segments), "utf-8");
}

describe("financial analytics presentation boundaries", () => {
  it("does not retain the deprecated client dashboard summary slice", () => {
    const deprecatedFiles = [
      ["features", "dashboard", "application", "use-cases", "get-dashboard-summary.use-case.ts"],
      ["features", "dashboard", "presentation", "components", "DashboardEmptyState.tsx"],
      ["features", "dashboard", "presentation", "components", "DashboardSummaryPanel.tsx"],
      ["features", "dashboard", "presentation", "components", "RecentTransactionsList.tsx"],
      ["features", "dashboard", "presentation", "hooks", "useDashboardSummary.ts"],
      ["features", "transactions", "presentation", "providers", "TransactionSessionProvider.tsx"]
    ];

    for (const segments of deprecatedFiles) {
      expect(existsSync(join(process.cwd(), "src", ...segments))).toBe(false);
    }
  });

  it("keeps the private layout free from the deprecated transaction session", () => {
    const privateLayout = readSource("app", "(private)", "layout.tsx");

    expect(privateLayout).not.toContain("TransactionSessionProvider");
  });

  it("keeps the dashboard page server-compatible and presentation-only", () => {
    const dashboardPage = readSource(
      "features",
      "dashboard",
      "presentation",
      "pages",
      "DashboardPage.tsx"
    );

    expect(dashboardPage).not.toMatch(/["']use client["']/);
    expect(dashboardPage).not.toContain("financial-analytics");
    expect(dashboardPage).not.toContain("useAuthSession");
    expect(dashboardPage).not.toContain("useTransactionSession");
    expect(dashboardPage).not.toContain("useDashboardSummary");
    expect(dashboardPage).not.toContain("DashboardSummaryPanel");
    expect(dashboardPage).not.toContain("RecentTransactionsList");
  });

  it("centralizes the server composition shared by both dashboard routes", () => {
    const homeRoute = readSource("app", "(private)", "page.tsx");
    const dashboardRoute = readSource(
      "app",
      "(private)",
      "dashboard",
      "page.tsx"
    );

    for (const route of [homeRoute, dashboardRoute]) {
      expect(route).toContain("composeDashboardRoute");
      expect(route).not.toContain("loadFinancialEvolution");
      expect(route).not.toContain("normalizeFinancialPeriodKind");
    }
  });

  it("keeps the period selector progressive and outside client and data boundaries", () => {
    const selector = readSource(
      "features",
      "financial-analytics",
      "presentation",
      "components",
      "FinancialPeriodSelector.tsx"
    );

    expect(selector).not.toMatch(/^["']use client["'];?/m);
    expect(selector).not.toMatch(/fetch\s*\(|supabase|useRouter|useSearchParams/i);
    expect(selector).toContain('method="get"');
  });
});

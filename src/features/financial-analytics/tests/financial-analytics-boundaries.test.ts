import { describe, expect, it } from "@jest/globals";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function readSource(...segments: string[]) {
  return readFileSync(join(process.cwd(), "src", ...segments), "utf-8");
}

describe("financial analytics presentation boundaries", () => {
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
});

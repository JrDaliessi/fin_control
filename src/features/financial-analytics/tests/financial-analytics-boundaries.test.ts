import { describe, expect, it } from "@jest/globals";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function readSource(...segments: string[]) {
  return readFileSync(join(process.cwd(), "src", ...segments), "utf-8");
}

describe("financial analytics presentation boundaries", () => {
  it("keeps analytics modules outside the client dashboard bundle", () => {
    const dashboardPage = readSource(
      "features",
      "dashboard",
      "presentation",
      "pages",
      "DashboardPage.tsx"
    );

    expect(dashboardPage).toContain('"use client"');
    expect(dashboardPage).not.toContain("financial-analytics");
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

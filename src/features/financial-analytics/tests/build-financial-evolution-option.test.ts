import { describe, expect, it } from "@jest/globals";
import { buildFinancialEvolutionOption } from "../presentation/charts/echarts/build-financial-evolution-option";
import type { FinancialEvolutionChartModel } from "../presentation/charts/financial-evolution-chart.model";

const model: FinancialEvolutionChartModel = {
  startOnInclusive: "2026-03-01",
  endOnExclusive: "2026-03-03",
  points: [
    { civilDate: "2026-03-01", closingBalanceInCents: 10_000 },
    { civilDate: "2026-03-02", closingBalanceInCents: -2_500 }
  ]
};

type Formatter = (value: number | string) => string;

type FinancialEvolutionOptionContract = Readonly<{
  animation: boolean;
  aria: Readonly<{
    enabled: boolean;
    decal: Readonly<{ show: boolean }>;
  }>;
  tooltip: Readonly<{ valueFormatter: Formatter }>;
  xAxis: Readonly<{
    type: string;
    boundaryGap: boolean;
    data: readonly string[];
    axisLabel: Readonly<{ formatter: Formatter }>;
  }>;
  yAxis: Readonly<{
    type: string;
    axisLabel: Readonly<{ formatter: Formatter }>;
  }>;
  series: readonly Readonly<{
    name: string;
    type: string;
    showSymbol: boolean;
    data: readonly number[];
  }>[];
}>;

function build(reducedMotion: boolean) {
  return buildFinancialEvolutionOption({
    model,
    reducedMotion,
    theme: {
      foreground: "#111827",
      mutedForeground: "#4b5563",
      primary: "#2563eb",
      surface: "#ffffff",
      border: "#d1d5db"
    }
  }) as unknown as FinancialEvolutionOptionContract;
}

describe("buildFinancialEvolutionOption", () => {
  it("builds a line from civil dates and integer closing balances", () => {
    const option = build(false);

    expect(option.xAxis).toEqual(
      expect.objectContaining({
        type: "category",
        boundaryGap: false,
        data: ["2026-03-01", "2026-03-02"]
      })
    );
    expect(option.yAxis.type).toBe("value");
    expect(option.series).toEqual([
      expect.objectContaining({
        name: "Saldo",
        type: "line",
        showSymbol: false,
        data: [10_000, -2_500]
      })
    ]);
  });

  it("formats labels at the visual edge without changing the model", () => {
    const before = JSON.parse(JSON.stringify(model));
    const option = build(false);

    expect(option.xAxis.axisLabel.formatter("2026-03-01")).toBe("01/03");
    expect(option.yAxis.axisLabel.formatter(-2_500)).toMatch(/-.*25,00/);
    expect(option.tooltip.valueFormatter(10_000)).toMatch(/100,00/);
    expect(model).toEqual(before);
  });

  it("enables the accessibility complement and honors reduced motion", () => {
    const option = build(true);

    expect(option.animation).toBe(false);
    expect(option.aria).toEqual({
      enabled: true,
      decal: { show: true }
    });
  });
});

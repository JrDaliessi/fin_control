import { describe, expect, it } from "@jest/globals";
import { buildFinancialCandlestickOption } from "../presentation/charts/echarts/build-financial-candlestick-option";
import type { FinancialCandlestickChartModel } from "../presentation/charts/financial-candlestick-chart.model";

const model: FinancialCandlestickChartModel = {
  startOnInclusive: "2026-03-01",
  endOnExclusive: "2026-03-03",
  points: [
    {
      civilDate: "2026-03-01",
      openInCents: 10_000,
      highInCents: 15_000,
      lowInCents: 9_000,
      closeInCents: 13_000,
      incomeInCents: 5_000,
      expenseInCents: 2_000,
      volumeInCents: 7_000,
      transactionCount: 2
    },
    {
      civilDate: "2026-03-02",
      openInCents: 13_000,
      highInCents: 13_000,
      lowInCents: 8_000,
      closeInCents: 8_000,
      incomeInCents: 0,
      expenseInCents: 5_000,
      volumeInCents: 5_000,
      transactionCount: 1
    }
  ]
};

type FinancialCandlestickOptionContract = Readonly<{
  animation: boolean;
  aria: Readonly<{
    enabled: boolean;
    decal: Readonly<{ show: boolean }>;
  }>;
  tooltip: Readonly<{
    trigger: string;
    formatter: (
      parameters: readonly Readonly<{ dataIndex: number }>[]
    ) => string;
  }>;
  xAxis: Readonly<{
    type: string;
    boundaryGap: boolean;
    data: readonly string[];
    axisLabel: Readonly<{ formatter: (value: string) => string }>;
  }>;
  yAxis: Readonly<{
    type: string;
    axisLabel: Readonly<{ formatter: (value: number) => string }>;
  }>;
  series: readonly Readonly<{
    name: string;
    type: string;
    data: readonly (readonly number[])[];
    itemStyle: Readonly<{
      color: string;
      color0: string;
      borderColor: string;
      borderColor0: string;
    }>;
  }>[];
}>;

function build(reducedMotion: boolean) {
  return buildFinancialCandlestickOption({
    model,
    reducedMotion,
    theme: {
      border: "#d1d5db",
      expense: "#dc2626",
      foreground: "#111827",
      income: "#059669",
      mutedForeground: "#4b5563",
      surface: "#ffffff"
    }
  }) as unknown as FinancialCandlestickOptionContract;
}

describe("buildFinancialCandlestickOption", () => {
  it("uses the ECharts OHLC tuple order without converting cents", () => {
    const option = build(false);

    expect(option.xAxis).toEqual(
      expect.objectContaining({
        type: "category",
        boundaryGap: true,
        data: ["2026-03-01", "2026-03-02"]
      })
    );
    expect(option.yAxis.type).toBe("value");
    expect(option.series).toEqual([
      expect.objectContaining({
        name: "Variação do saldo",
        type: "candlestick",
        data: [
          [10_000, 13_000, 9_000, 15_000],
          [13_000, 8_000, 8_000, 13_000]
        ]
      })
    ]);
  });

  it("assigns distinct rise and fall styles without making color the only signal", () => {
    const [series] = build(false).series;

    expect(series?.itemStyle).toEqual({
      color: "#059669",
      color0: "#dc2626",
      borderColor: "#059669",
      borderColor0: "#dc2626"
    });
  });

  it("formats only at the visual edge and preserves the input model", () => {
    const before = structuredClone(model);
    const option = build(false);

    expect(option.xAxis.axisLabel.formatter("2026-03-01")).toBe("01/03");
    expect(option.yAxis.axisLabel.formatter(-2_500)).toMatch(/-.*25,00/);
    expect(option.tooltip.trigger).toBe("axis");
    expect(model).toEqual(before);
  });

  it("explains the active candle with financial labels and textual direction", () => {
    const formatter = build(false).tooltip.formatter;

    expect(formatter([{ dataIndex: 0 }])).toMatch(
      /01\/03\/2026.*Abertura:.*100,00.*Máxima:.*150,00.*Mínima:.*90,00.*Fechamento:.*130,00.*Variação: Alta.*Volume:.*70,00.*2 movimentos/
    );
    expect(formatter([{ dataIndex: 1 }])).toMatch(
      /02\/03\/2026.*Variação: Queda.*1 movimento/
    );
    expect(formatter([])).toBe("Dados indisponíveis.");
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

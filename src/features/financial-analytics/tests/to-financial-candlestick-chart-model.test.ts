import { describe, expect, it } from "@jest/globals";
import { toFinancialCandlestickChartModel } from "../presentation/charts/to-financial-candlestick-chart-model";

const evolution = {
  status: "success" as const,
  accountCount: 1,
  period: {
    kind: "rolling_7_days" as const,
    referenceOn: "2026-03-02",
    startOnInclusive: "2026-03-01",
    endOnExclusive: "2026-03-03"
  },
  summary: {
    openingBalanceInCents: 10_000,
    incomeInCents: 5_000,
    expenseInCents: 17_500,
    netInCents: -12_500,
    closingBalanceInCents: -2_500,
    transactionCount: 2
  },
  points: [],
  candles: [
    {
      startOnInclusive: "2026-03-01",
      endOnExclusive: "2026-03-02",
      openInCents: 10_000,
      highInCents: 15_000,
      lowInCents: 10_000,
      closeInCents: 15_000,
      incomeInCents: 5_000,
      expenseInCents: 0,
      volumeInCents: 5_000,
      transactionCount: 1
    },
    {
      startOnInclusive: "2026-03-02",
      endOnExclusive: "2026-03-03",
      openInCents: 15_000,
      highInCents: 15_000,
      lowInCents: -2_500,
      closeInCents: -2_500,
      incomeInCents: 0,
      expenseInCents: 17_500,
      volumeInCents: 17_500,
      transactionCount: 1
    }
  ]
};

describe("toFinancialCandlestickChartModel", () => {
  it("maps civil dates and integer OHLC values without losing tooltip data", () => {
    expect(toFinancialCandlestickChartModel(evolution)).toEqual({
      startOnInclusive: "2026-03-01",
      endOnExclusive: "2026-03-03",
      points: [
        {
          civilDate: "2026-03-01",
          endOnExclusive: "2026-03-02",
          openInCents: 10_000,
          highInCents: 15_000,
          lowInCents: 10_000,
          closeInCents: 15_000,
          incomeInCents: 5_000,
          expenseInCents: 0,
          volumeInCents: 5_000,
          transactionCount: 1
        },
        {
          civilDate: "2026-03-02",
          endOnExclusive: "2026-03-03",
          openInCents: 15_000,
          highInCents: 15_000,
          lowInCents: -2_500,
          closeInCents: -2_500,
          incomeInCents: 0,
          expenseInCents: 17_500,
          volumeInCents: 17_500,
          transactionCount: 1
        }
      ]
    });
  });

  it("does not mutate the application DTO", () => {
    const before = structuredClone(evolution);

    toFinancialCandlestickChartModel(evolution);

    expect(evolution).toEqual(before);
  });

  it("keeps a missing-account series empty", () => {
    expect(
      toFinancialCandlestickChartModel({
        ...evolution,
        status: "missing_accounts",
        accountCount: 0,
        candles: []
      })
    ).toEqual({
      startOnInclusive: "2026-03-01",
      endOnExclusive: "2026-03-03",
      points: []
    });
  });
});

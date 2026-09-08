import { describe, expect, it } from "@jest/globals";
import type { FinancialEvolutionDto } from "../application/use-cases/list-financial-evolution.use-case";
import { toFinancialEvolutionChartModel } from "../presentation/charts/to-financial-evolution-chart-model";

const evolution: FinancialEvolutionDto = {
  status: "success",
  accountCount: 1,
  period: {
    kind: "rolling_7_days",
    bucketGranularity: "day",
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
  points: [
    {
      startOnInclusive: "2026-03-01",
      endOnExclusive: "2026-03-02",
      incomeInCents: 5_000,
      expenseInCents: 0,
      netInCents: 5_000,
      closingBalanceInCents: 15_000,
      transactionCount: 1
    },
    {
      startOnInclusive: "2026-03-02",
      endOnExclusive: "2026-03-03",
      incomeInCents: 0,
      expenseInCents: 17_500,
      netInCents: -17_500,
      closingBalanceInCents: -2_500,
      transactionCount: 1
    }
  ],
  candles: []
};

describe("toFinancialEvolutionChartModel", () => {
  it("maps the ordered civil dates and closing balances without converting cents", () => {
    expect(toFinancialEvolutionChartModel(evolution)).toEqual({
      startOnInclusive: "2026-03-01",
      endOnExclusive: "2026-03-03",
      points: [
        {
          civilDate: "2026-03-01",
          closingBalanceInCents: 15_000
        },
        {
          civilDate: "2026-03-02",
          closingBalanceInCents: -2_500
        }
      ]
    });
  });

  it("does not mutate the application DTO", () => {
    const before = JSON.parse(JSON.stringify(evolution)) as FinancialEvolutionDto;

    toFinancialEvolutionChartModel(evolution);

    expect(evolution).toEqual(before);
  });

  it("keeps an empty series explicit instead of manufacturing chart points", () => {
    expect(
      toFinancialEvolutionChartModel({
        ...evolution,
        status: "missing_accounts",
        accountCount: 0,
        points: []
      })
    ).toEqual({
      startOnInclusive: "2026-03-01",
      endOnExclusive: "2026-03-03",
      points: []
    });
  });
});

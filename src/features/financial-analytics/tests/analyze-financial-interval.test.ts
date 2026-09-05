import { describe, expect, it } from "@jest/globals";
import { analyzeFinancialInterval } from "../domain/services/analyze-financial-interval";

const interval = {
  startOnInclusive: "2026-03-01",
  endOnExclusive: "2026-03-02",
  incomeInCents: 5_000,
  expenseInCents: 2_000,
  volumeInCents: 7_000,
  transactionCount: 2
} as const;

describe("analyzeFinancialInterval", () => {
  it("derives a consistent summary and at most two semantic insights", () => {
    const before = structuredClone(interval);

    const result = analyzeFinancialInterval(interval);

    expect(result).toEqual({
      summary: {
        incomeInCents: 5_000,
        expenseInCents: 2_000,
        volumeInCents: 7_000,
        netInCents: 3_000,
        incomePercentage: 71,
        expensePercentage: 29,
        transactionCount: 2
      },
      insights: [
        {
          kind: "composition",
          dominantType: "income",
          incomePercentage: 71,
          expensePercentage: 29
        },
        {
          kind: "net",
          direction: "positive",
          amountInCents: 3_000
        }
      ]
    });
    expect(result.insights).toHaveLength(2);
    expect(interval).toEqual(before);
  });

  it("represents an interval without movements without invalid percentages", () => {
    expect(
      analyzeFinancialInterval({
        ...interval,
        incomeInCents: 0,
        expenseInCents: 0,
        volumeInCents: 0,
        transactionCount: 0
      })
    ).toEqual({
      summary: {
        incomeInCents: 0,
        expenseInCents: 0,
        volumeInCents: 0,
        netInCents: 0,
        incomePercentage: null,
        expensePercentage: null,
        transactionCount: 0
      },
      insights: [{ kind: "empty" }]
    });
  });

  it.each([
    [
      "only income",
      { incomeInCents: 8_000, expenseInCents: 0, volumeInCents: 8_000 },
      { incomePercentage: 100, expensePercentage: 0 },
      { dominantType: "income", direction: "positive", netInCents: 8_000 }
    ],
    [
      "only expense",
      { incomeInCents: 0, expenseInCents: 8_000, volumeInCents: 8_000 },
      { incomePercentage: 0, expensePercentage: 100 },
      { dominantType: "expense", direction: "negative", netInCents: -8_000 }
    ],
    [
      "balanced volume",
      { incomeInCents: 4_000, expenseInCents: 4_000, volumeInCents: 8_000 },
      { incomePercentage: 50, expensePercentage: 50 },
      { dominantType: "balanced", direction: "neutral", netInCents: 0 }
    ]
  ])(
    "handles %s",
    (_scenario, amounts, percentages, expected) => {
      const result = analyzeFinancialInterval({
        ...interval,
        ...amounts,
        transactionCount: 1
      });

      expect(result.summary).toEqual(
        expect.objectContaining({
          ...percentages,
          netInCents: expected.netInCents
        })
      );
      expect(result.insights[0]).toEqual(
        expect.objectContaining({
          kind: "composition",
          dominantType: expected.dominantType
        })
      );
      expect(result.insights[1]).toEqual(
        expect.objectContaining({
          kind: "net",
          direction: expected.direction
        })
      );
    }
  );

  it.each([
    ["negative income", { incomeInCents: -1 }],
    ["fractional expense", { expenseInCents: 1.5 }],
    ["unsafe volume", { volumeInCents: Number.MAX_SAFE_INTEGER + 1 }],
    ["negative count", { transactionCount: -1 }],
    ["fractional count", { transactionCount: 1.5 }],
    ["mismatched volume", { volumeInCents: 6_999 }],
    [
      "unsafe component sum",
      {
        incomeInCents: Number.MAX_SAFE_INTEGER,
        expenseInCents: 1,
        volumeInCents: Number.MAX_SAFE_INTEGER
      }
    ],
    ["invalid interval", { endOnExclusive: "2026-03-01" }]
  ])("rejects %s", (_scenario, override) => {
    expect(() =>
      analyzeFinancialInterval({ ...interval, ...override })
    ).toThrow(/financial interval analysis/i);
  });
});

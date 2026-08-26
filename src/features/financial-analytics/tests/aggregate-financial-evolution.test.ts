import { describe, expect, it } from "@jest/globals";
import { aggregateFinancialEvolution } from "../domain/services/aggregate-financial-evolution";
import { resolveFinancialPeriod } from "../domain/services/resolve-financial-period";
import type { FinancialMovementProjection } from "../domain/types/financial-evolution.types";
import {
  expenseMovement,
  incomeMovement,
  laterExpenseMovement
} from "./fixtures/financial-evolution.fixtures";

const period = resolveFinancialPeriod({
  kind: "rolling_7_days",
  referenceOn: "2026-03-07"
});

type DailyPoint = {
  startOnInclusive: string;
  closingBalanceInCents: number;
};

describe("aggregateFinancialEvolution", () => {
  it("creates continuous daily buckets and carries the closing balance over empty days", () => {
    expect(
      aggregateFinancialEvolution({
        period,
        openingBalanceInCents: 10_000,
        movements: [laterExpenseMovement, expenseMovement, incomeMovement]
      })
    ).toEqual([
      {
        startOnInclusive: "2026-03-01",
        endOnExclusive: "2026-03-02",
        incomeInCents: 5_000,
        expenseInCents: 2_000,
        netInCents: 3_000,
        closingBalanceInCents: 13_000,
        transactionCount: 2
      },
      {
        startOnInclusive: "2026-03-02",
        endOnExclusive: "2026-03-03",
        incomeInCents: 0,
        expenseInCents: 0,
        netInCents: 0,
        closingBalanceInCents: 13_000,
        transactionCount: 0
      },
      {
        startOnInclusive: "2026-03-03",
        endOnExclusive: "2026-03-04",
        incomeInCents: 0,
        expenseInCents: 4_000,
        netInCents: -4_000,
        closingBalanceInCents: 9_000,
        transactionCount: 1
      },
      ...["04", "05", "06", "07"].map((day) => ({
        startOnInclusive: `2026-03-${day}`,
        endOnExclusive: `2026-03-${String(Number(day) + 1).padStart(2, "0")}`,
        incomeInCents: 0,
        expenseInCents: 0,
        netInCents: 0,
        closingBalanceInCents: 9_000,
        transactionCount: 0
      }))
    ]);
  });

  it("creates every day across a leap-month boundary when there are no movements", () => {
    const crossingPeriod = resolveFinancialPeriod({
      kind: "rolling_7_days",
      referenceOn: "2024-03-01"
    });

    const points = aggregateFinancialEvolution({
      period: crossingPeriod,
      openingBalanceInCents: -500,
      movements: []
    });

    expect(points).toHaveLength(7);
    expect(
      points.map((point: DailyPoint) => point.startOnInclusive)
    ).toEqual([
      "2024-02-24",
      "2024-02-25",
      "2024-02-26",
      "2024-02-27",
      "2024-02-28",
      "2024-02-29",
      "2024-03-01"
    ]);
    expect(
      points.every(
        (point: DailyPoint) => point.closingBalanceInCents === -500
      )
    ).toBe(true);
  });

  it("allows a closing balance to become negative", () => {
    const points = aggregateFinancialEvolution({
      period,
      openingBalanceInCents: 1_000,
      movements: [{ ...expenseMovement, amountInCents: 1_500 }]
    });

    expect(points[0]?.closingBalanceInCents).toBe(-500);
  });

  it.each([
    ["before the period", { ...incomeMovement, occurredOn: "2026-02-28" }],
    ["at the exclusive end", { ...incomeMovement, occurredOn: "2026-03-08" }],
    ["with an invalid date", { ...incomeMovement, occurredOn: "2026-02-30" }],
    ["with zero amount", { ...incomeMovement, amountInCents: 0 }],
    ["with a fractional amount", { ...incomeMovement, amountInCents: 10.5 }],
    [
      "with an unsafe amount",
      { ...incomeMovement, amountInCents: Number.MAX_SAFE_INTEGER + 1 }
    ],
    [
      "with an unknown type",
      { ...incomeMovement, type: "transfer" as "income" }
    ]
  ])("rejects a movement %s", (_scenario, movement) => {
    expect(() =>
      aggregateFinancialEvolution({
        period,
        openingBalanceInCents: 0,
        movements: [movement]
      })
    ).toThrow("movement");
  });

  it.each([10.5, Number.MAX_SAFE_INTEGER + 1])(
    "rejects the invalid opening balance %s",
    (openingBalanceInCents) => {
      expect(() =>
        aggregateFinancialEvolution({
          period,
          openingBalanceInCents,
          movements: []
        })
      ).toThrow("opening balance");
    }
  );

  it("rejects overflow while accumulating a closing balance", () => {
    const movement: FinancialMovementProjection = {
      ...incomeMovement,
      amountInCents: 1
    };

    expect(() =>
      aggregateFinancialEvolution({
        period,
        openingBalanceInCents: Number.MAX_SAFE_INTEGER,
        movements: [movement]
      })
    ).toThrow("safe integer");
  });
});

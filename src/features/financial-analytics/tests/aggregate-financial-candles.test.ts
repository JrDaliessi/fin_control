import { describe, expect, it } from "@jest/globals";
import { aggregateFinancialCandles } from "../domain/services/aggregate-financial-candles";
import { resolveFinancialPeriod } from "../domain/services/resolve-financial-period";
import type { FinancialMovementProjection } from "../domain/types/financial-evolution.types";
import {
  expenseMovement,
  incomeMovement,
  laterExpenseMovement,
  laterIncomeMovement,
  tiedExpenseMovement,
  tiedIncomeMovement
} from "./fixtures/financial-evolution.fixtures";

const period = resolveFinancialPeriod({
  kind: "rolling_7_days",
  referenceOn: "2026-03-07"
});

type FinancialCandleContract = Readonly<{
  startOnInclusive: string;
  endOnExclusive: string;
  openInCents: number;
  highInCents: number;
  lowInCents: number;
  closeInCents: number;
  incomeInCents: number;
  expenseInCents: number;
  volumeInCents: number;
  transactionCount: number;
}>;

describe("aggregateFinancialCandles", () => {
  it("calculates daily OHLC, volume and continuity from shuffled movements", () => {
    const movements = [
      laterExpenseMovement,
      laterIncomeMovement,
      expenseMovement,
      incomeMovement
    ];
    const before = structuredClone(movements);

    const candles = aggregateFinancialCandles({
      period,
      openingBalanceInCents: 10_000,
      movements
    }) as readonly FinancialCandleContract[];

    expect(candles).toHaveLength(7);
    expect(candles.slice(0, 3)).toEqual([
      {
        startOnInclusive: "2026-03-01",
        endOnExclusive: "2026-03-02",
        openInCents: 10_000,
        highInCents: 16_000,
        lowInCents: 10_000,
        closeInCents: 16_000,
        incomeInCents: 8_000,
        expenseInCents: 2_000,
        volumeInCents: 10_000,
        transactionCount: 3
      },
      {
        startOnInclusive: "2026-03-02",
        endOnExclusive: "2026-03-03",
        openInCents: 16_000,
        highInCents: 16_000,
        lowInCents: 16_000,
        closeInCents: 16_000,
        incomeInCents: 0,
        expenseInCents: 0,
        volumeInCents: 0,
        transactionCount: 0
      },
      {
        startOnInclusive: "2026-03-03",
        endOnExclusive: "2026-03-04",
        openInCents: 16_000,
        highInCents: 16_000,
        lowInCents: 12_000,
        closeInCents: 12_000,
        incomeInCents: 0,
        expenseInCents: 4_000,
        volumeInCents: 4_000,
        transactionCount: 1
      }
    ]);
    expect(movements).toEqual(before);
  });

  it("uses id as a stable tie-breaker when registration instants match", () => {
    const [firstCandle] = aggregateFinancialCandles({
      period,
      openingBalanceInCents: 10_000,
      movements: [tiedIncomeMovement, tiedExpenseMovement]
    });

    expect(firstCandle).toEqual(
      expect.objectContaining({
        openInCents: 10_000,
        highInCents: 12_000,
        lowInCents: 7_000,
        closeInCents: 12_000
      })
    );
  });

  it("supports negative balances and crossings through zero", () => {
    const [firstCandle] = aggregateFinancialCandles({
      period,
      openingBalanceInCents: 1_000,
      movements: [
        { ...expenseMovement, amountInCents: 1_500 },
        {
          ...laterIncomeMovement,
          amountInCents: 250
        }
      ]
    });

    expect(firstCandle).toEqual(
      expect.objectContaining({
        openInCents: 1_000,
        highInCents: 1_000,
        lowInCents: -500,
        closeInCents: -250
      })
    );
  });

  it("creates every civil day across a leap-month boundary", () => {
    const crossingPeriod = resolveFinancialPeriod({
      kind: "rolling_7_days",
      referenceOn: "2024-03-01"
    });

    const candles = aggregateFinancialCandles({
      period: crossingPeriod,
      openingBalanceInCents: -500,
      movements: []
    }) as readonly FinancialCandleContract[];

    expect(candles.map((candle) => candle.startOnInclusive)).toEqual([
      "2024-02-24",
      "2024-02-25",
      "2024-02-26",
      "2024-02-27",
      "2024-02-28",
      "2024-02-29",
      "2024-03-01"
    ]);
    expect(
      candles.every(
        (candle) =>
          candle.openInCents === -500 &&
          candle.highInCents === -500 &&
          candle.lowInCents === -500 &&
          candle.closeInCents === -500 &&
          candle.volumeInCents === 0
      )
    ).toBe(true);
  });

  it.each([
    ["outside the period", { ...incomeMovement, occurredOn: "2026-02-28" }],
    ["with an invalid civil date", { ...incomeMovement, occurredOn: "2026-02-30" }],
    ["with an invalid registration instant", { ...incomeMovement, createdAt: "invalid" }],
    ["without an id", { ...incomeMovement, id: "   " }],
    ["with zero amount", { ...incomeMovement, amountInCents: 0 }],
    ["with a fractional amount", { ...incomeMovement, amountInCents: 10.5 }],
    ["with an unknown type", { ...incomeMovement, type: "transfer" as "income" }]
  ])("rejects a movement %s", (_scenario, movement) => {
    expect(() =>
      aggregateFinancialCandles({
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
        aggregateFinancialCandles({
          period,
          openingBalanceInCents,
          movements: []
        })
      ).toThrow("opening balance");
    }
  );

  it("rejects overflow while accumulating the balance", () => {
    const movement: FinancialMovementProjection = {
      ...incomeMovement,
      amountInCents: 1
    };

    expect(() =>
      aggregateFinancialCandles({
        period,
        openingBalanceInCents: Number.MAX_SAFE_INTEGER,
        movements: [movement]
      })
    ).toThrow("safe integer");
  });

  it("rejects overflow while accumulating absolute volume", () => {
    expect(() =>
      aggregateFinancialCandles({
        period,
        openingBalanceInCents: 0,
        movements: [
          { ...incomeMovement, amountInCents: Number.MAX_SAFE_INTEGER },
          {
            ...expenseMovement,
            amountInCents: Number.MAX_SAFE_INTEGER
          }
        ]
      })
    ).toThrow("safe integer");
  });
});

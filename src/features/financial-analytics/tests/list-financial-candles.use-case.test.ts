import { describe, expect, it, jest } from "@jest/globals";
import type {
  FinancialAnalyticsQueryRepository,
  LoadEvolutionBucketsInput,
  LoadEvolutionSnapshotInput
} from "../application/ports/financial-analytics-query.repository";
import {
  type FinancialEvolutionDto,
  ListFinancialEvolutionUseCase
} from "../application/use-cases/list-financial-evolution.use-case";
import {
  analyticsUserId,
  expenseMovement,
  incomeMovement
} from "./fixtures/financial-evolution.fixtures";

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

type FinancialEvolutionWithCandles = FinancialEvolutionDto &
  Readonly<{ candles?: readonly FinancialCandleContract[] }>;

function createRepository(
  snapshot: Awaited<
    ReturnType<FinancialAnalyticsQueryRepository["loadEvolutionSnapshot"]>
  >
) {
  return {
    loadEvolutionSnapshot: jest.fn(
      async (input: LoadEvolutionSnapshotInput) => {
        void input;
        return snapshot;
      }
    ),
    loadEvolutionBuckets: jest.fn(
      async (input: LoadEvolutionBucketsInput) => {
        void input;
        throw new Error("aggregate buckets are not used by daily periods");
      }
    )
  } satisfies FinancialAnalyticsQueryRepository;
}

const request = {
  userId: `  ${analyticsUserId}  `,
  kind: "rolling_7_days" as const,
  referenceInstant: "2026-03-07T15:00:00.000Z",
  timeZone: "America/Sao_Paulo"
};

describe("ListFinancialEvolutionUseCase candle contract", () => {
  it("derives points and candles from exactly one financial snapshot", async () => {
    const repository = createRepository({
      accountCount: 2,
      openingBalanceInCents: 10_000,
      movements: [expenseMovement, incomeMovement]
    });
    const useCase = new ListFinancialEvolutionUseCase({
      financialAnalyticsQueryRepository: repository
    });

    const result = (await useCase.execute(
      request
    )) as FinancialEvolutionWithCandles;

    expect(repository.loadEvolutionSnapshot).toHaveBeenCalledTimes(1);
    expect(result.points).toHaveLength(7);
    expect(result.candles).toHaveLength(7);
    expect(result.candles?.[0]).toEqual({
      startOnInclusive: "2026-03-01",
      endOnExclusive: "2026-03-02",
      openInCents: 10_000,
      highInCents: 15_000,
      lowInCents: 10_000,
      closeInCents: 13_000,
      incomeInCents: 5_000,
      expenseInCents: 2_000,
      volumeInCents: 7_000,
      transactionCount: 2
    });
    expect(JSON.parse(JSON.stringify(result))).toEqual(result);
  });

  it("returns no candles when the user has no financial accounts", async () => {
    const repository = createRepository({
      accountCount: 0,
      openingBalanceInCents: 0,
      movements: []
    });
    const useCase = new ListFinancialEvolutionUseCase({
      financialAnalyticsQueryRepository: repository
    });

    const result = (await useCase.execute(
      request
    )) as FinancialEvolutionWithCandles;

    expect(result.status).toBe("missing_accounts");
    expect(result.candles).toEqual([]);
    expect(repository.loadEvolutionSnapshot).toHaveBeenCalledTimes(1);
  });

  it("returns flat daily candles for accounts without movements", async () => {
    const repository = createRepository({
      accountCount: 1,
      openingBalanceInCents: 2_500,
      movements: []
    });
    const useCase = new ListFinancialEvolutionUseCase({
      financialAnalyticsQueryRepository: repository
    });

    const result = (await useCase.execute(
      request
    )) as FinancialEvolutionWithCandles;

    expect(result.status).toBe("empty");
    expect(result.candles).toHaveLength(7);
    expect(
      result.candles?.every(
        (candle) =>
          candle.openInCents === 2_500 &&
          candle.highInCents === 2_500 &&
          candle.lowInCents === 2_500 &&
          candle.closeInCents === 2_500 &&
          candle.volumeInCents === 0 &&
          candle.transactionCount === 0
      )
    ).toBe(true);
  });
});

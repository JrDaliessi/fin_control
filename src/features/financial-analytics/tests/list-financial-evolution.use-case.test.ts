import { describe, expect, it, jest } from "@jest/globals";
import type {
  FinancialAnalyticsQueryRepository,
  LoadEvolutionSnapshotInput
} from "../application/ports/financial-analytics-query.repository";
import { ListFinancialEvolutionUseCase } from "../application/use-cases/list-financial-evolution.use-case";
import type { FinancialPeriodKind } from "../domain/types/financial-period.types";
import type { FinancialEvolutionBucketSnapshot } from "../domain/types/financial-evolution.types";
import {
  analyticsUserId,
  expenseMovement,
  incomeMovement
} from "./fixtures/financial-evolution.fixtures";

type LoadEvolutionBucketsInput = Readonly<{
  userId: string;
  startOnInclusive: string;
  endOnExclusive: string;
  bucketGranularity: "week" | "month";
}>;

const bucketSnapshot = {
  accountCount: 1,
  buckets: [
    {
      startOnInclusive: "2026-07-01",
      endOnExclusive: "2026-07-06",
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
      startOnInclusive: "2026-07-06",
      endOnExclusive: "2026-07-13",
      openInCents: 15_000,
      highInCents: 15_000,
      lowInCents: 13_000,
      closeInCents: 13_000,
      incomeInCents: 0,
      expenseInCents: 2_000,
      volumeInCents: 2_000,
      transactionCount: 1
    }
  ]
} as const;

function createCoveredBucketSnapshot(
  startOnInclusive: string,
  endOnExclusive: string,
  transactionCount = 2
) {
  return {
    accountCount: 1,
    buckets: [
      {
        startOnInclusive,
        endOnExclusive,
        openInCents: 10_000,
        highInCents: 15_000,
        lowInCents: 10_000,
        closeInCents: transactionCount === 0 ? 10_000 : 13_000,
        incomeInCents: transactionCount === 0 ? 0 : 5_000,
        expenseInCents: transactionCount === 0 ? 0 : 2_000,
        volumeInCents: transactionCount === 0 ? 0 : 7_000,
        transactionCount
      }
    ]
  } as const;
}

function createRepository(
  snapshot: Awaited<
    ReturnType<FinancialAnalyticsQueryRepository["loadEvolutionSnapshot"]>
  >,
  aggregatedSnapshot: FinancialEvolutionBucketSnapshot = bucketSnapshot
) {
  const repository = {
    loadEvolutionSnapshot: jest.fn(
      async (input: LoadEvolutionSnapshotInput) => {
        void input;
        return snapshot;
      }
    ),
    loadEvolutionBuckets: jest.fn(
      async (input: LoadEvolutionBucketsInput) => {
        void input;
        return aggregatedSnapshot;
      }
    )
  };

  return repository as typeof repository & FinancialAnalyticsQueryRepository;
}

const request = {
  userId: `  ${analyticsUserId}  `,
  kind: "rolling_7_days" as const,
  referenceInstant: "2026-03-07T15:00:00.000Z",
  timeZone: "America/Sao_Paulo"
};

describe("ListFinancialEvolutionUseCase", () => {
  it("returns a serializable success DTO and one snapshot query", async () => {
    const repository = createRepository({
      accountCount: 2,
      openingBalanceInCents: 10_000,
      movements: [incomeMovement, expenseMovement]
    });
    const useCase = new ListFinancialEvolutionUseCase({
      financialAnalyticsQueryRepository: repository
    });

    const result = await useCase.execute(request);

    expect(repository.loadEvolutionSnapshot).toHaveBeenCalledTimes(1);
    expect(repository.loadEvolutionSnapshot).toHaveBeenCalledWith({
      userId: analyticsUserId,
      startOnInclusive: "2026-03-01",
      endOnExclusive: "2026-03-08"
    });
    expect(result).toEqual(
      expect.objectContaining({
        status: "success",
        accountCount: 2,
        period: {
          kind: "rolling_7_days",
          bucketGranularity: "day",
          referenceOn: "2026-03-07",
          startOnInclusive: "2026-03-01",
          endOnExclusive: "2026-03-08"
        },
        summary: {
          openingBalanceInCents: 10_000,
          incomeInCents: 5_000,
          expenseInCents: 2_000,
          netInCents: 3_000,
          closingBalanceInCents: 13_000,
          transactionCount: 2
        }
      })
    );
    expect(result.points).toHaveLength(7);
    expect(JSON.parse(JSON.stringify(result))).toEqual(result);
  });

  it.each([
    [
      "three_months" as FinancialPeriodKind,
      "week" as const,
      "2026-09-06T15:00:00.000Z",
      "2026-07-01",
      "2026-10-01"
    ],
    [
      "year" as FinancialPeriodKind,
      "month" as const,
      "2026-03-07T15:00:00.000Z",
      "2026-01-01",
      "2027-01-01"
    ]
  ])(
    "loads pre-aggregated %s buckets without requesting raw movements",
    async (
      kind,
      bucketGranularity,
      referenceInstant,
      startOnInclusive,
      endOnExclusive
    ) => {
      const repository = createRepository({
        accountCount: 1,
        openingBalanceInCents: 0,
        movements: []
      }, createCoveredBucketSnapshot(startOnInclusive, endOnExclusive));
      const useCase = new ListFinancialEvolutionUseCase({
        financialAnalyticsQueryRepository: repository
      });

      const result = await useCase.execute({
        ...request,
        kind,
        referenceInstant
      });

      expect(repository.loadEvolutionSnapshot).not.toHaveBeenCalled();
      expect(repository.loadEvolutionBuckets).toHaveBeenCalledTimes(1);
      expect(repository.loadEvolutionBuckets).toHaveBeenCalledWith({
        userId: analyticsUserId,
        startOnInclusive,
        endOnExclusive,
        bucketGranularity
      });
      expect(result).toEqual(
        expect.objectContaining({
          status: "success",
          accountCount: 1,
          period: expect.objectContaining({ kind, bucketGranularity }),
          summary: {
            openingBalanceInCents: 10_000,
            incomeInCents: 5_000,
            expenseInCents: 2_000,
            netInCents: 3_000,
            closingBalanceInCents: 13_000,
            transactionCount: 2
          },
          candles: createCoveredBucketSnapshot(
            startOnInclusive,
            endOnExclusive
          ).buckets
        })
      );
      expect(result.points).toEqual([
        {
          startOnInclusive,
          endOnExclusive,
          incomeInCents: 5_000,
          expenseInCents: 2_000,
          netInCents: 3_000,
          closingBalanceInCents: 13_000,
          transactionCount: 2
        }
      ]);
    }
  );

  it("keeps a long period visible when aggregated buckets have no movements", async () => {
    const repository = createRepository(
      { accountCount: 1, openingBalanceInCents: 0, movements: [] },
      createCoveredBucketSnapshot("2026-01-01", "2027-01-01", 0)
    );
    const useCase = new ListFinancialEvolutionUseCase({
      financialAnalyticsQueryRepository: repository
    });

    const result = await useCase.execute({
      ...request,
      kind: "year"
    });

    expect(result.status).toBe("empty");
    expect(result.summary).toEqual({
      openingBalanceInCents: 10_000,
      incomeInCents: 0,
      expenseInCents: 0,
      netInCents: 0,
      closingBalanceInCents: 10_000,
      transactionCount: 0
    });
    expect(result.points).toHaveLength(1);
    expect(result.candles).toHaveLength(1);
  });

  it.each([
    ["start", "2026-07-02", "2026-10-01"],
    ["end", "2026-07-01", "2026-09-30"]
  ])(
    "rejects an aggregate response that does not cover the requested %s boundary",
    async (_boundary, startOnInclusive, endOnExclusive) => {
      const repository = createRepository(
        { accountCount: 1, openingBalanceInCents: 0, movements: [] },
        createCoveredBucketSnapshot(startOnInclusive, endOnExclusive)
      );
      const useCase = new ListFinancialEvolutionUseCase({
        financialAnalyticsQueryRepository: repository
      });

      await expect(
        useCase.execute({
          ...request,
          kind: "three_months",
          referenceInstant: "2026-09-06T15:00:00.000Z"
        })
      ).rejects.toThrow("financial evolution unavailable");
    }
  );

  it("returns missing_accounts without manufacturing daily points", async () => {
    const repository = createRepository({
      accountCount: 0,
      openingBalanceInCents: 0,
      movements: []
    });
    const useCase = new ListFinancialEvolutionUseCase({
      financialAnalyticsQueryRepository: repository
    });

    await expect(useCase.execute(request)).resolves.toEqual(
      expect.objectContaining({
        status: "missing_accounts",
        accountCount: 0,
        points: []
      })
    );
  });

  it("returns empty with daily balances when accounts exist without movements", async () => {
    const repository = createRepository({
      accountCount: 1,
      openingBalanceInCents: 2_500,
      movements: []
    });
    const useCase = new ListFinancialEvolutionUseCase({
      financialAnalyticsQueryRepository: repository
    });

    const result = await useCase.execute(request);

    expect(result.status).toBe("empty");
    expect(result.summary).toEqual({
      openingBalanceInCents: 2_500,
      incomeInCents: 0,
      expenseInCents: 0,
      netInCents: 0,
      closingBalanceInCents: 2_500,
      transactionCount: 0
    });
    expect(result.points).toHaveLength(7);
  });

  it.each([
    ["user", { ...request, userId: "   " }],
    ["period kind", { ...request, kind: "custom" as "month" }],
    ["referenceInstant", { ...request, referenceInstant: "invalid" }],
    ["timeZone", { ...request, timeZone: "Invalid/Zone" }]
  ])("rejects invalid %s before querying", async (field, invalidRequest) => {
    const repository = createRepository({
      accountCount: 1,
      openingBalanceInCents: 0,
      movements: []
    });
    const useCase = new ListFinancialEvolutionUseCase({
      financialAnalyticsQueryRepository: repository
    });

    await expect(useCase.execute(invalidRequest)).rejects.toThrow(field);
    expect(repository.loadEvolutionSnapshot).not.toHaveBeenCalled();
    expect(repository.loadEvolutionBuckets).not.toHaveBeenCalled();
  });

  it("sanitizes a repository failure", async () => {
    const repository = createRepository({
      accountCount: 1,
      openingBalanceInCents: 0,
      movements: []
    });
    repository.loadEvolutionSnapshot.mockRejectedValue(
      new Error("sensitive relation public.transactions")
    );
    const useCase = new ListFinancialEvolutionUseCase({
      financialAnalyticsQueryRepository: repository
    });

    await expect(useCase.execute(request)).rejects.toThrow(
      "financial evolution unavailable"
    );
    await useCase.execute(request).catch((error: unknown) => {
      expect((error as Error).message).not.toContain("transactions");
    });
  });
});

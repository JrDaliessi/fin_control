import { describe, expect, it, jest } from "@jest/globals";
import type {
  FinancialAnalyticsQueryRepository,
  LoadEvolutionSnapshotInput
} from "../application/ports/financial-analytics-query.repository";
import { ListFinancialEvolutionUseCase } from "../application/use-cases/list-financial-evolution.use-case";
import {
  analyticsUserId,
  expenseMovement,
  incomeMovement
} from "./fixtures/financial-evolution.fixtures";

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
    )
  } satisfies FinancialAnalyticsQueryRepository;
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
  });

  it("sanitizes a repository failure", async () => {
    const repository: FinancialAnalyticsQueryRepository = {
      loadEvolutionSnapshot: jest.fn(async () => {
        throw new Error("sensitive relation public.transactions");
      })
    };
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

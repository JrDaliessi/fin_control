import { describe, expect, it, jest } from "@jest/globals";
import { SupabaseFinancialAnalyticsQueryRepository } from "../infrastructure/repositories/supabase-financial-analytics-query.repository";
import {
  analyticsUserId,
  incomeMovement,
  rpcMovementRow
} from "./fixtures/financial-evolution.fixtures";

describe("SupabaseFinancialAnalyticsQueryRepository", () => {
  it("loads one snapshot RPC without forwarding userId", async () => {
    const rpc = jest.fn(
      async (
        functionName: string,
        parameters: { p_start_on: string; p_end_on: string }
      ) => {
        void functionName;
        void parameters;
        return { data: [rpcMovementRow], error: null };
      }
    );
    const repository = new SupabaseFinancialAnalyticsQueryRepository({
      supabaseClient: { rpc }
    });

    const result = await repository.loadEvolutionSnapshot({
      userId: analyticsUserId,
      startOnInclusive: "2026-03-01",
      endOnExclusive: "2026-03-08"
    });

    expect(rpc).toHaveBeenCalledTimes(1);
    expect(rpc).toHaveBeenCalledWith("load_financial_evolution_snapshot", {
      p_start_on: "2026-03-01",
      p_end_on: "2026-03-08"
    });
    expect(rpc.mock.calls[0]?.[1]).not.toHaveProperty("userId");
    expect(rpc.mock.calls[0]?.[1]).not.toHaveProperty("user_id");
    expect(result).toEqual({
      accountCount: 2,
      openingBalanceInCents: 10_000,
      movements: [incomeMovement]
    });
  });

  it("loads aggregated buckets without forwarding userId or raw movements", async () => {
    const bucketRow = {
      account_count: "1",
      start_on_inclusive: "2026-07-01",
      end_on_exclusive: "2026-07-06",
      open_in_cents: "10000",
      high_in_cents: "15000",
      low_in_cents: "10000",
      close_in_cents: "13000",
      income_in_cents: "5000",
      expense_in_cents: "2000",
      volume_in_cents: "7000",
      transaction_count: "2"
    };
    const rpc = jest.fn(
      async (functionName: string, parameters: Record<string, string>) => {
        void functionName;
        void parameters;
        return { data: [bucketRow], error: null };
      }
    );
    const repository = new SupabaseFinancialAnalyticsQueryRepository({
      supabaseClient: { rpc } as never
    });
    const aggregatedRepository = repository as unknown as {
      loadEvolutionBuckets(input: {
        userId: string;
        startOnInclusive: string;
        endOnExclusive: string;
        bucketGranularity: "week" | "month";
      }): Promise<unknown>;
    };

    await expect(
      aggregatedRepository.loadEvolutionBuckets({
        userId: analyticsUserId,
        startOnInclusive: "2026-07-01",
        endOnExclusive: "2026-10-01",
        bucketGranularity: "week"
      })
    ).resolves.toEqual({
      accountCount: 1,
      buckets: [
        {
          startOnInclusive: "2026-07-01",
          endOnExclusive: "2026-07-06",
          openInCents: 10_000,
          highInCents: 15_000,
          lowInCents: 10_000,
          closeInCents: 13_000,
          incomeInCents: 5_000,
          expenseInCents: 2_000,
          volumeInCents: 7_000,
          transactionCount: 2
        }
      ]
    });
    expect(rpc).toHaveBeenCalledWith("load_financial_evolution_buckets", {
      p_start_on: "2026-07-01",
      p_end_on: "2026-10-01",
      p_bucket: "week"
    });
    expect(rpc.mock.calls[0]?.[0]).not.toContain("snapshot");
    expect(rpc.mock.calls[0]?.[1]).not.toHaveProperty("userId");
    expect(rpc.mock.calls[0]?.[1]).not.toHaveProperty("user_id");
  });

  it("rejects quarter and year before the matching migration is available", async () => {
    const rpc = jest.fn();
    const repository = new SupabaseFinancialAnalyticsQueryRepository({
      supabaseClient: { rpc } as never
    });

    await expect(
      repository.loadEvolutionBuckets({
        userId: analyticsUserId,
        startOnInclusive: "2024-01-01",
        endOnExclusive: "2027-01-01",
        bucketGranularity: "quarter"
      })
    ).rejects.toThrow("financial analytics repository unavailable");
    expect(rpc).not.toHaveBeenCalled();
  });

  it("sanitizes RPC failures and provider details", async () => {
    const providerError = {
      code: "42501",
      details: "sensitive policy details",
      hint: "internal relation",
      message: "permission denied for public.transactions"
    };
    const rpc = jest.fn(async () => ({ data: null, error: providerError }));
    const repository = new SupabaseFinancialAnalyticsQueryRepository({
      supabaseClient: { rpc }
    });

    const promise = repository.loadEvolutionSnapshot({
      userId: analyticsUserId,
      startOnInclusive: "2026-03-01",
      endOnExclusive: "2026-03-08"
    });

    await expect(promise).rejects.toThrow(
      "financial analytics repository unavailable"
    );
    await promise.catch((error: unknown) => {
      const message = (error as Error).message;
      expect(message).not.toContain(providerError.code);
      expect(message).not.toContain(providerError.details);
      expect(message).not.toContain(providerError.hint);
      expect(message).not.toContain(providerError.message);
    });
  });

  it("rejects a null RPC payload with a stable error", async () => {
    const rpc = jest.fn(async () => ({ data: null, error: null }));
    const repository = new SupabaseFinancialAnalyticsQueryRepository({
      supabaseClient: { rpc }
    });

    await expect(
      repository.loadEvolutionSnapshot({
        userId: analyticsUserId,
        startOnInclusive: "2026-03-01",
        endOnExclusive: "2026-03-08"
      })
    ).rejects.toThrow("financial analytics repository unavailable");
  });
});

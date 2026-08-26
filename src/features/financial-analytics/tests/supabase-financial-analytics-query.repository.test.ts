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

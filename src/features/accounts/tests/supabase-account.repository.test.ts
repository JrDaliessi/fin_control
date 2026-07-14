import { describe, expect, it, jest } from "@jest/globals";
import { FinancialAccount } from "../domain/entities/financial-account.entity";
import { SupabaseAccountRepository } from "../infrastructure/repositories/supabase-account.repository";

const userId = "09aabfb8-e06e-41e7-b364-12a5dbf27a20";
const persistedRow = {
  id: "6ca6c81f-11a4-4a34-8090-2185bb0e63a8",
  user_id: userId,
  name: "Conta principal",
  type: "checking",
  initial_balance_in_cents: 150000,
  currency: "BRL",
  created_at: "2026-07-14T10:00:00.000Z",
  updated_at: "2026-07-14T10:00:00.000Z"
} as const;

const account = FinancialAccount.create({
  userId,
  name: "Conta principal",
  type: "checking",
  initialBalanceInCents: 150000
});

describe("SupabaseAccountRepository", () => {
  it("creates in financial_accounts and returns the persisted row", async () => {
    const single = jest.fn(async () => ({ data: persistedRow, error: null }));
    const select = jest.fn<(columns: string) => { single: typeof single }>(
      (columns) => {
        void columns;
        return { single };
      }
    );
    const insert = jest.fn<
      (payload: Record<string, unknown>) => { select: typeof select }
    >((payload) => {
      void payload;
      return { select };
    });
    const from = jest.fn<(table: string) => { insert: typeof insert }>(
      (table) => {
        void table;
        return { insert };
      }
    );
    const repository = new SupabaseAccountRepository({
      supabaseClient: { from }
    });

    const result = await repository.create(account);

    expect(from).toHaveBeenCalledWith("financial_accounts");
    expect(insert).toHaveBeenCalledWith({
      user_id: userId,
      name: "Conta principal",
      type: "checking",
      initial_balance_in_cents: 150000,
      currency: "BRL"
    });
    expect(select).toHaveBeenCalledWith("*");
    expect(single).toHaveBeenCalledTimes(1);
    expect(result).toEqual(
      expect.objectContaining({ id: persistedRow.id, userId })
    );
  });

  it("lists only the requested owner in deterministic order", async () => {
    const orderById = jest.fn<
      (
        column: string,
        options: { ascending: boolean }
      ) => Promise<{ data: readonly [typeof persistedRow]; error: null }>
    >(async (column, options) => {
      void column;
      void options;
      return { data: [persistedRow], error: null };
    });
    const orderByCreatedAt = jest.fn<
      (
        column: string,
        options: { ascending: boolean }
      ) => { order: typeof orderById }
    >((column, options) => {
      void column;
      void options;
      return { order: orderById };
    });
    const eq = jest.fn<
      (column: string, value: string) => { order: typeof orderByCreatedAt }
    >((column, value) => {
      void column;
      void value;
      return { order: orderByCreatedAt };
    });
    const select = jest.fn<(columns: string) => { eq: typeof eq }>(
      (columns) => {
        void columns;
        return { eq };
      }
    );
    const from = jest.fn<(table: string) => { select: typeof select }>(
      (table) => {
        void table;
        return { select };
      }
    );
    const repository = new SupabaseAccountRepository({
      supabaseClient: { from }
    });

    const result = await repository.listByUser({ userId });

    expect(from).toHaveBeenCalledWith("financial_accounts");
    expect(select).toHaveBeenCalledWith("*");
    expect(eq).toHaveBeenCalledWith("user_id", userId);
    expect(orderByCreatedAt).toHaveBeenCalledWith("created_at", {
      ascending: false
    });
    expect(orderById).toHaveBeenCalledWith("id", { ascending: false });
    expect(result).toEqual([
      expect.objectContaining({ id: persistedRow.id, userId })
    ]);
  });

  it.each(["create", "list"] as const)(
    "normalizes a Supabase %s failure without leaking provider details",
    async (operation) => {
      const providerError = {
        code: "42501",
        details: "sensitive row and balance",
        hint: "internal database policy",
        message: "permission denied for table financial_accounts"
      };
      const single = jest.fn(async () => ({ data: null, error: providerError }));
      const insertSelect = jest.fn<
        (columns: string) => { single: typeof single }
      >((columns) => {
        void columns;
        return { single };
      });
      const insert = jest.fn<
        (payload: Record<string, unknown>) => { select: typeof insertSelect }
      >((payload) => {
        void payload;
        return { select: insertSelect };
      });
      const orderById = jest.fn<
        (
          column: string,
          options: { ascending: boolean }
        ) => Promise<{ data: null; error: typeof providerError }>
      >(async (column, options) => {
        void column;
        void options;
        return { data: null, error: providerError };
      });
      const orderByCreatedAt = jest.fn<
        (
          column: string,
          options: { ascending: boolean }
        ) => { order: typeof orderById }
      >((column, options) => {
        void column;
        void options;
        return { order: orderById };
      });
      const eq = jest.fn<
        (column: string, value: string) => { order: typeof orderByCreatedAt }
      >((column, value) => {
        void column;
        void value;
        return { order: orderByCreatedAt };
      });
      const listSelect = jest.fn<(columns: string) => { eq: typeof eq }>(
        (columns) => {
          void columns;
          return { eq };
        }
      );
      const from = jest.fn<
        (table: string) => { insert: typeof insert; select: typeof listSelect }
      >((table) => {
        void table;
        return { insert, select: listSelect };
      });
      const repository = new SupabaseAccountRepository({
        supabaseClient: { from }
      });

      const promise =
        operation === "create"
          ? repository.create(account)
          : repository.listByUser({ userId });

      await expect(promise).rejects.toThrow("account repository unavailable");
      await promise.catch((error: unknown) => {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).not.toContain(providerError.code);
        expect((error as Error).message).not.toContain(providerError.details);
        expect((error as Error).message).not.toContain(providerError.hint);
        expect((error as Error).message).not.toContain(providerError.message);
      });
    }
  );
});

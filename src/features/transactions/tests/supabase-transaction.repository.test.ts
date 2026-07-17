import { describe, expect, it, jest } from "@jest/globals";
import { Transaction } from "../domain/entities/transaction.entity";
import { SupabaseTransactionRepository } from "../infrastructure/repositories/supabase-transaction.repository";
import {
  persistedTransactionRow,
  transactionUserId,
  validTransactionInput
} from "./fixtures/transaction.fixtures";

const transaction = Transaction.create(validTransactionInput);
const transactionColumns =
  "id,user_id,account_id,category_id,description,amount_in_cents,type,payment_method,occurred_on,notes,created_at,updated_at";

describe("SupabaseTransactionRepository", () => {
  it("creates in transactions and returns the persisted row", async () => {
    const single = jest.fn(async () => ({
      data: persistedTransactionRow,
      error: null
    }));
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
    const repository = new SupabaseTransactionRepository({
      supabaseClient: { from }
    });

    const result = await repository.create(transaction);

    expect(from).toHaveBeenCalledWith("transactions");
    expect(insert).toHaveBeenCalledWith({
      user_id: validTransactionInput.userId,
      account_id: validTransactionInput.accountId,
      category_id: validTransactionInput.categoryId,
      description: validTransactionInput.description,
      amount_in_cents: validTransactionInput.amountInCents,
      type: validTransactionInput.type,
      payment_method: validTransactionInput.paymentMethod,
      occurred_on: "2026-07-08",
      notes: validTransactionInput.notes
    });
    expect(select).toHaveBeenCalledWith(transactionColumns);
    expect(single).toHaveBeenCalledTimes(1);
    expect(result).toEqual(
      expect.objectContaining({ id: persistedTransactionRow.id, userId: transactionUserId })
    );
  });

  it("lists one owner and month using a half-open date range and stable order", async () => {
    const orderById = jest.fn<
      (
        column: string,
        options: { ascending: boolean }
      ) => Promise<{ data: readonly [typeof persistedTransactionRow]; error: null }>
    >(async (column, options) => {
      void column;
      void options;
      return { data: [persistedTransactionRow], error: null };
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
    const orderByOccurredOn = jest.fn<
      (
        column: string,
        options: { ascending: boolean }
      ) => { order: typeof orderByCreatedAt }
    >((column, options) => {
      void column;
      void options;
      return { order: orderByCreatedAt };
    });
    const lt = jest.fn<
      (column: string, value: string) => { order: typeof orderByOccurredOn }
    >((column, value) => {
      void column;
      void value;
      return { order: orderByOccurredOn };
    });
    const gte = jest.fn<
      (column: string, value: string) => { lt: typeof lt }
    >((column, value) => {
      void column;
      void value;
      return { lt };
    });
    const eq = jest.fn<
      (column: string, value: string) => { gte: typeof gte }
    >((column, value) => {
      void column;
      void value;
      return { gte };
    });
    const select = jest.fn<(columns: string) => { eq: typeof eq }>((columns) => {
      void columns;
      return { eq };
    });
    const from = jest.fn<(table: string) => { select: typeof select }>((table) => {
      void table;
      return { select };
    });
    const repository = new SupabaseTransactionRepository({
      supabaseClient: { from }
    });

    const result = await repository.findByMonth({
      userId: transactionUserId,
      year: 2026,
      month: 7
    });

    expect(from).toHaveBeenCalledWith("transactions");
    expect(select).toHaveBeenCalledWith(transactionColumns);
    expect(eq).toHaveBeenCalledWith("user_id", transactionUserId);
    expect(gte).toHaveBeenCalledWith("occurred_on", "2026-07-01");
    expect(lt).toHaveBeenCalledWith("occurred_on", "2026-08-01");
    expect(orderByOccurredOn).toHaveBeenCalledWith("occurred_on", {
      ascending: false
    });
    expect(orderByCreatedAt).toHaveBeenCalledWith("created_at", {
      ascending: false
    });
    expect(orderById).toHaveBeenCalledWith("id", { ascending: false });
    expect(result).toEqual([
      expect.objectContaining({ id: persistedTransactionRow.id })
    ]);
  });

  it.each(["create", "findByMonth"] as const)(
    "sanitizes a Supabase %s failure",
    async (operation) => {
      const providerError = {
        code: "23503",
        details: "sensitive transaction relation",
        hint: "internal foreign key",
        message: "insert or update violates foreign key"
      };
      const single = jest.fn(async () => ({ data: null, error: providerError }));
      const insertSelect = jest.fn(() => ({ single }));
      const insert = jest.fn(() => ({ select: insertSelect }));
      const orderById = jest.fn(async () => ({ data: null, error: providerError }));
      const orderByCreatedAt = jest.fn(() => ({ order: orderById }));
      const orderByOccurredOn = jest.fn(() => ({ order: orderByCreatedAt }));
      const lt = jest.fn(() => ({ order: orderByOccurredOn }));
      const gte = jest.fn(() => ({ lt }));
      const eq = jest.fn(() => ({ gte }));
      const listSelect = jest.fn(() => ({ eq }));
      const from = jest.fn(() => ({ insert, select: listSelect }));
      const repository = new SupabaseTransactionRepository({
        supabaseClient: { from }
      });

      const promise =
        operation === "create"
          ? repository.create(transaction)
          : repository.findByMonth({
              userId: transactionUserId,
              year: 2026,
              month: 7
            });

      await expect(promise).rejects.toThrow("transaction repository unavailable");
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

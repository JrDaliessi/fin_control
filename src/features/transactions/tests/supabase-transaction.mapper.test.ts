import { describe, expect, it } from "@jest/globals";
import { Transaction } from "../domain/entities/transaction.entity";
import {
  mapTransactionRowToDomain,
  mapTransactionToInsert
} from "../infrastructure/supabase/transaction.mapper";
import {
  persistedTransactionRow,
  validTransactionInput
} from "./fixtures/transaction.fixtures";

describe("transaction mapper", () => {
  it("maps a database date row to a rehydrated transaction at UTC midnight", () => {
    expect(mapTransactionRowToDomain(persistedTransactionRow)).toEqual(
      expect.objectContaining({
        id: persistedTransactionRow.id,
        userId: persistedTransactionRow.user_id,
        accountId: persistedTransactionRow.account_id,
        categoryId: persistedTransactionRow.category_id,
        description: persistedTransactionRow.description,
        amountInCents: persistedTransactionRow.amount_in_cents,
        type: persistedTransactionRow.type,
        paymentMethod: persistedTransactionRow.payment_method,
        occurredAt: new Date("2026-07-08T00:00:00.000Z"),
        notes: persistedTransactionRow.notes,
        createdAt: new Date(persistedTransactionRow.created_at),
        updatedAt: new Date(persistedTransactionRow.updated_at)
      })
    );
  });

  it("maps only approved fields to the insert payload", () => {
    const transaction = Transaction.create(validTransactionInput);

    expect(mapTransactionToInsert(transaction)).toEqual({
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
  });

  it("rejects an unsafe bigint returned by the provider", () => {
    expect(() =>
      mapTransactionRowToDomain({
        ...persistedTransactionRow,
        amount_in_cents: Number.MAX_SAFE_INTEGER + 1
      })
    ).toThrow("amount");
  });
});

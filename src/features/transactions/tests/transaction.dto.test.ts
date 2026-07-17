import { describe, expect, it } from "@jest/globals";
import { Transaction } from "../domain/entities/transaction.entity";
import {
  toTransactionAccountOptionDto,
  toTransactionCategoryOptionDto,
  toTransactionDto
} from "../application/dtos/transaction.dto";
import { persistedTransactionRow, validTransactionInput } from "./fixtures/transaction.fixtures";

describe("transaction DTO", () => {
  it("serializes persisted metadata without exposing the owner", () => {
    const transaction = Transaction.restore({
      ...validTransactionInput,
      id: persistedTransactionRow.id,
      createdAt: new Date(persistedTransactionRow.created_at),
      updatedAt: new Date(persistedTransactionRow.updated_at)
    });

    expect(toTransactionDto(transaction)).toEqual({
      id: persistedTransactionRow.id,
      accountId: validTransactionInput.accountId,
      categoryId: validTransactionInput.categoryId,
      description: validTransactionInput.description,
      amountInCents: validTransactionInput.amountInCents,
      type: validTransactionInput.type,
      paymentMethod: validTransactionInput.paymentMethod,
      occurredOn: "2026-07-08",
      notes: validTransactionInput.notes,
      createdAt: persistedTransactionRow.created_at,
      updatedAt: persistedTransactionRow.updated_at
    });
    expect(toTransactionDto(transaction)).not.toHaveProperty("userId");
  });

  it("maps persisted account and category options without type assertions", () => {
    expect(
      toTransactionAccountOptionDto({ id: " account-1 ", name: "Conta" })
    ).toEqual({ id: "account-1", name: "Conta" });
    expect(
      toTransactionCategoryOptionDto({
        id: " category-1 ",
        name: "Mercado",
        kind: "expense"
      })
    ).toEqual({ id: "category-1", name: "Mercado", kind: "expense" });
  });

  it("rejects non-persisted account and category options", () => {
    expect(() =>
      toTransactionAccountOptionDto({ name: "Conta" })
    ).toThrow("persisted account");
    expect(() =>
      toTransactionCategoryOptionDto({ name: "Mercado", kind: "expense" })
    ).toThrow("persisted category");
  });
});

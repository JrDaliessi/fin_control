import { describe, expect, it } from "@jest/globals";
import { Transaction } from "../domain/entities/transaction.entity";
import { persistedTransactionRow } from "./fixtures/transaction.fixtures";

const baseInput = {
  userId: "user-1",
  accountId: "account-1",
  categoryId: "category-1",
  description: "Mercado",
  amountInCents: 12550,
  type: "expense" as const,
  occurredAt: new Date("2026-07-08T12:00:00.000Z")
};

type TransactionInputPatch = Partial<typeof baseInput>;

const invalidCases: Array<[string, TransactionInputPatch, string]> = [
  ["empty description", { description: "" }, "description"],
  ["zero amount", { amountInCents: 0 }, "amount"],
  ["negative amount", { amountInCents: -1 }, "amount"],
  ["decimal amount", { amountInCents: 125.5 }, "amount"],
  ["missing user", { userId: "" }, "user"],
  ["missing account", { accountId: "" }, "account"],
  ["missing category", { categoryId: "" }, "category"]
];

describe("Transaction", () => {
  it("creates a valid expense transaction with amount in cents", () => {
    const transaction = Transaction.create(baseInput);

    expect(transaction.userId).toBe("user-1");
    expect(transaction.accountId).toBe("account-1");
    expect(transaction.categoryId).toBe("category-1");
    expect(transaction.description).toBe("Mercado");
    expect(transaction.amountInCents).toBe(12550);
    expect(transaction.type).toBe("expense");
  });

  it("creates a valid income transaction", () => {
    const transaction = Transaction.create({
      ...baseInput,
      description: "Salario",
      amountInCents: 310000,
      type: "income"
    });

    expect(transaction.description).toBe("Salario");
    expect(transaction.amountInCents).toBe(310000);
    expect(transaction.type).toBe("income");
  });

  it.each(invalidCases)("rejects %s", (_caseName, patch, expectedMessage) => {
    expect(() => Transaction.create({ ...baseInput, ...patch })).toThrow(
      expectedMessage
    );
  });

  it("normalizes identifiers and description", () => {
    const transaction = Transaction.create({
      ...baseInput,
      userId: " user-1 ",
      accountId: " account-1 ",
      categoryId: " category-1 ",
      description: " Mercado "
    });

    expect(transaction.userId).toBe("user-1");
    expect(transaction.accountId).toBe("account-1");
    expect(transaction.categoryId).toBe("category-1");
    expect(transaction.description).toBe("Mercado");
  });

  it("rejects invalid payment method", () => {
    expect(() =>
      Transaction.create({
        ...baseInput,
        paymentMethod: "credit-card" as never
      })
    ).toThrow("payment method");
  });

  it("normalizes optional notes", () => {
    const transaction = Transaction.create({
      ...baseInput,
      notes: "  Compra do mês  "
    });

    expect(transaction.notes).toBe("Compra do mês");
  });

  it.each([
    ["description longer than 160 characters", { description: "a".repeat(161) }, "description"],
    ["notes longer than 1000 characters", { notes: "a".repeat(1001) }, "notes"]
  ])("rejects %s", (_caseName, patch, expectedMessage) => {
    expect(() => Transaction.create({ ...baseInput, ...patch })).toThrow(
      expectedMessage
    );
  });
});

describe("Transaction.restore", () => {
  const persistedTransaction = {
    id: persistedTransactionRow.id,
    userId: persistedTransactionRow.user_id,
    accountId: persistedTransactionRow.account_id,
    categoryId: persistedTransactionRow.category_id,
    description: persistedTransactionRow.description,
    amountInCents: persistedTransactionRow.amount_in_cents,
    type: persistedTransactionRow.type,
    paymentMethod: persistedTransactionRow.payment_method,
    occurredAt: new Date(`${persistedTransactionRow.occurred_on}T00:00:00.000Z`),
    notes: persistedTransactionRow.notes,
    createdAt: new Date(persistedTransactionRow.created_at),
    updatedAt: new Date(persistedTransactionRow.updated_at)
  };

  it("rehydrates persisted metadata while preserving invariants", () => {
    expect(Transaction.restore(persistedTransaction)).toEqual(
      expect.objectContaining(persistedTransaction)
    );
  });

  it.each([
    ["missing id", { id: " " }, "id"],
    ["invalid occurrence date", { occurredAt: new Date("invalid") }, "occurredAt"],
    ["invalid creation date", { createdAt: new Date("invalid") }, "created"],
    ["invalid update date", { updatedAt: new Date("invalid") }, "updated"]
  ])("rejects %s", (_caseName, patch, expectedMessage) => {
    expect(() => Transaction.restore({ ...persistedTransaction, ...patch })).toThrow(
      expectedMessage
    );
  });

  it("protects persisted dates from external mutation", () => {
    const occurredAt = new Date(persistedTransaction.occurredAt);
    const createdAt = new Date(persistedTransaction.createdAt);
    const updatedAt = new Date(persistedTransaction.updatedAt);
    const transaction = Transaction.restore({
      ...persistedTransaction,
      occurredAt,
      createdAt,
      updatedAt
    });
    const expectedOccurredAt = occurredAt.toISOString();
    const expectedCreatedAt = createdAt.toISOString();
    const expectedUpdatedAt = updatedAt.toISOString();

    occurredAt.setUTCFullYear(2000);
    createdAt.setUTCFullYear(2000);
    updatedAt.setUTCFullYear(2000);
    transaction.occurredAt.setUTCFullYear(1999);
    transaction.createdAt?.setUTCFullYear(1999);
    transaction.updatedAt?.setUTCFullYear(1999);

    expect(transaction.occurredAt.toISOString()).toBe(expectedOccurredAt);
    expect(transaction.createdAt?.toISOString()).toBe(expectedCreatedAt);
    expect(transaction.updatedAt?.toISOString()).toBe(expectedUpdatedAt);
  });
});

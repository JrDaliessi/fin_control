import { describe, expect, it } from "@jest/globals";
import { Transaction } from "../domain/entities/transaction.entity";

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
});

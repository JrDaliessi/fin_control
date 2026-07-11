import { describe, expect, it } from "@jest/globals";
import type { CreateTransactionInput } from "../domain/entities/transaction.entity";
import { resolveSessionMonthRef } from "../application/utils/resolve-session-month-ref";

function makeTransaction(occurredAt: Date): CreateTransactionInput {
  return {
    userId: "user-1",
    accountId: "account-1",
    categoryId: "category-1",
    description: "Transação teste",
    amountInCents: 1000,
    type: "expense",
    occurredAt
  };
}

describe("resolveSessionMonthRef", () => {
  it("should use the most recent transaction regardless of input order", () => {
    const transactions = [
      makeTransaction(new Date("2026-06-20T12:00:00Z")),
      makeTransaction(new Date("2026-08-01T12:00:00Z")),
      makeTransaction(new Date("2026-07-15T12:00:00Z"))
    ];

    expect(resolveSessionMonthRef(transactions)).toBe("2026-08");
  });

  it("should use the fallback date when the session is empty", () => {
    expect(resolveSessionMonthRef([], new Date("2026-09-10T12:00:00Z"))).toBe(
      "2026-09"
    );
  });
});

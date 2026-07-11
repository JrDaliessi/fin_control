import { describe, expect, it } from "@jest/globals";
import { FinancialAccount } from "../domain/entities/financial-account.entity";

const baseInput = {
  userId: "user-1",
  name: "Conta principal",
  type: "checking" as const,
  initialBalanceInCents: 150000,
  currency: "BRL" as const
};

describe("FinancialAccount", () => {
  it.each([150000, 0, -25000])(
    "creates an account with an initial balance of %i cents",
    (initialBalanceInCents) => {
      const account = FinancialAccount.create({
        ...baseInput,
        initialBalanceInCents
      });

      expect(account.initialBalanceInCents).toBe(initialBalanceInCents);
      expect(account.currency).toBe("BRL");
    }
  );

  it.each(["checking", "savings", "cash", "payment", "investment"] as const)(
    "accepts the %s account type",
    (type) => {
      expect(FinancialAccount.create({ ...baseInput, type }).type).toBe(type);
    }
  );

  it("normalizes the user, name and default currency", () => {
    const account = FinancialAccount.create({
      ...baseInput,
      userId: " user-1 ",
      name: "  Conta   do   dia a dia  ",
      currency: undefined
    });

    expect(account.userId).toBe("user-1");
    expect(account.name).toBe("Conta do dia a dia");
    expect(account.currency).toBe("BRL");
  });

  it.each([
    ["missing user", { userId: " " }, "user"],
    ["missing name", { name: "   " }, "name"],
    ["name longer than 80 characters", { name: "a".repeat(81) }, "name"],
    ["fractional balance", { initialBalanceInCents: 10.5 }, "balance"],
    ["NaN balance", { initialBalanceInCents: Number.NaN }, "balance"],
    ["infinite balance", { initialBalanceInCents: Number.POSITIVE_INFINITY }, "balance"],
    [
      "unsafe balance",
      { initialBalanceInCents: Number.MAX_SAFE_INTEGER + 1 },
      "balance"
    ],
    ["unsupported type", { type: "salary" as never }, "type"],
    ["unsupported currency", { currency: "USD" as never }, "currency"]
  ])("rejects %s", (_caseName, patch, expectedMessage) => {
    expect(() => FinancialAccount.create({ ...baseInput, ...patch })).toThrow(
      expectedMessage
    );
  });
});

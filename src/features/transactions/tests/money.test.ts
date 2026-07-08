import { describe, expect, it } from "@jest/globals";
import { Money } from "../domain/value-objects/money";

describe("Money", () => {
  it("creates a positive money value from cents", () => {
    const money = Money.fromPositiveCents(12550);

    expect(money.amountInCents).toBe(12550);
  });

  it.each([
    ["zero", 0],
    ["negative", -1],
    ["decimal", 125.5]
  ])("rejects %s amount in cents", (_caseName, amountInCents) => {
    expect(() => Money.fromPositiveCents(amountInCents)).toThrow(
      "amount must be a positive integer in cents"
    );
  });
});

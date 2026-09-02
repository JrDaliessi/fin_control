import { describe, expect, it } from "@jest/globals";
import { validateFinancialInterval } from "../domain/services/validate-financial-interval";
import { statementInterval } from "./fixtures/financial-interval-statement.fixtures";

describe("validateFinancialInterval", () => {
  it("accepts and preserves a semi-open civil interval of at most 31 days", () => {
    expect(validateFinancialInterval(statementInterval)).toEqual(
      statementInterval
    );
    expect(
      validateFinancialInterval({
        startOnInclusive: "2026-03-01",
        endOnExclusive: "2026-04-01"
      })
    ).toEqual({
      startOnInclusive: "2026-03-01",
      endOnExclusive: "2026-04-01"
    });
  });

  it.each([
    ["impossible start", "2026-02-30", "2026-03-02"],
    ["impossible end", "2026-03-01", "2026-02-30"],
    ["equal limits", "2026-03-01", "2026-03-01"],
    ["reversed limits", "2026-03-02", "2026-03-01"],
    ["more than 31 days", "2026-03-01", "2026-04-02"]
  ])("rejects %s", (_name, startOnInclusive, endOnExclusive) => {
    expect(() =>
      validateFinancialInterval({ startOnInclusive, endOnExclusive })
    ).toThrow("financial interval is invalid");
  });
});

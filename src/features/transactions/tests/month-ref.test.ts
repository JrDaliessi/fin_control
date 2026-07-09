import { describe, expect, it } from "@jest/globals";
import { MonthRef } from "../domain/value-objects/month-ref";

describe("MonthRef", () => {
  it("creates a valid month reference from YYYY-MM", () => {
    const monthRef = MonthRef.fromString("2026-07");

    expect(monthRef.value).toBe("2026-07");
    expect(monthRef.year).toBe(2026);
    expect(monthRef.month).toBe(7);
  });

  it("normalizes surrounding spaces", () => {
    const monthRef = MonthRef.fromString(" 2026-07 ");

    expect(monthRef.value).toBe("2026-07");
  });

  it.each([
    ["empty value", ""],
    ["missing leading zero", "2026-7"],
    ["invalid month zero", "2026-00"],
    ["invalid month thirteen", "2026-13"],
    ["invalid separator", "2026/07"],
    ["non numeric value", "julho-2026"]
  ])("rejects %s", (_caseName, value) => {
    expect(() => MonthRef.fromString(value)).toThrow("monthRef");
  });
});

import { describe, expect, it } from "@jest/globals";
import { parseCurrencyToCents } from "../src/shared/utils/parseCurrencyToCents";

describe("parseCurrencyToCents", () => {
  it.each([
    ["1250.50", 125050],
    ["1.250,50", 125050],
    ["0", 0]
  ])("parses %s to integer cents", (input, expected) => {
    expect(parseCurrencyToCents(input)).toBe(expected);
  });

  it("accepts a negative amount only when explicitly enabled", () => {
    expect(parseCurrencyToCents("-250,00")).toBeNull();
    expect(parseCurrencyToCents("-250,00", { allowNegative: true })).toBe(
      -25000
    );
  });

  it.each(["", "10,999", "1.2.3", "Infinity"])(
    "rejects invalid input %s",
    (input) => {
      expect(parseCurrencyToCents(input)).toBeNull();
    }
  );
});

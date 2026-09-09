import { describe, expect, it } from "@jest/globals";
import * as financialPeriodResolver from "../domain/services/resolve-financial-period";

type CustomPeriod = Readonly<{
  kind: "custom";
  bucketGranularity: "day" | "week" | "month" | "quarter" | "year";
  referenceOn: string;
  startOnInclusive: string;
  endOnExclusive: string;
}>;

type CustomPeriodResolver = (input: {
  from: string;
  to: string;
}) => CustomPeriod;

function getCustomPeriodResolver(): CustomPeriodResolver {
  const resolver = (
    financialPeriodResolver as typeof financialPeriodResolver & {
      resolveCustomFinancialPeriod?: CustomPeriodResolver;
    }
  ).resolveCustomFinancialPeriod;

  expect(resolver).toEqual(expect.any(Function));

  return resolver as CustomPeriodResolver;
}

describe("resolveCustomFinancialPeriod contract", () => {
  it("turns inclusive leap-day input into a half-open civil interval", () => {
    expect(
      getCustomPeriodResolver()({
        from: "2024-02-01",
        to: "2024-02-29"
      })
    ).toEqual({
      kind: "custom",
      bucketGranularity: "day",
      referenceOn: "2024-02-29",
      startOnInclusive: "2024-02-01",
      endOnExclusive: "2024-03-01"
    });
  });

  it.each([
    ["31 days", "2026-01-01", "2026-01-31", "day"],
    ["32 days", "2026-01-01", "2026-02-01", "week"],
    ["six months", "2026-01-01", "2026-06-30", "week"],
    ["more than six months", "2026-01-01", "2026-07-01", "month"],
    ["two years", "2024-01-01", "2025-12-31", "month"],
    ["more than two years", "2024-01-01", "2026-01-01", "quarter"],
    ["fifteen years", "2011-01-01", "2025-12-31", "quarter"],
    ["more than fifteen years", "2010-01-01", "2025-12-31", "year"],
    ["sixty aligned annual buckets", "1967-01-01", "2026-12-31", "year"]
  ] as const)(
    "selects %s as %s through %s with %s buckets",
    (_label, from, to, bucketGranularity) => {
      expect(getCustomPeriodResolver()({ from, to })).toEqual(
        expect.objectContaining({
          kind: "custom",
          bucketGranularity,
          referenceOn: to,
          startOnInclusive: from
        })
      );
    }
  );

  it.each([
    ["invalid from", "2026-02-30", "2026-03-01", "dates are invalid"],
    ["invalid to", "2026-02-01", "2026-02-30", "dates are invalid"],
    ["reversed interval", "2026-03-01", "2026-02-01", "boundaries are invalid"],
    [
      "more than sixty years",
      "1966-12-31",
      "2026-12-31",
      "interval exceeds 60 years"
    ],
    [
      "sixty-one civil buckets",
      "1966-07-01",
      "2026-06-30",
      "bucket count exceeds 60"
    ]
  ] as const)("rejects %s", (_label, from, to, expectedMessage) => {
    expect(() => getCustomPeriodResolver()({ from, to })).toThrow(
      expectedMessage
    );
  });
});

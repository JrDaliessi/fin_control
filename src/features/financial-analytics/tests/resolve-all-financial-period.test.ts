import { describe, expect, it } from "@jest/globals";
import * as financialPeriodModule from "../domain/services/resolve-financial-period";
import type { FinancialPeriod } from "../domain/types/financial-period.types";

type ResolveAllFinancialPeriod = (input: {
  historyStartOn: string | null;
  referenceOn: string;
}) => FinancialPeriod;

function getResolver(): ResolveAllFinancialPeriod {
  const resolver = Reflect.get(
    financialPeriodModule,
    "resolveAllFinancialPeriod"
  ) as unknown;

  expect(resolver).toEqual(expect.any(Function));

  return resolver as ResolveAllFinancialPeriod;
}

describe("resolveAllFinancialPeriod", () => {
  it("exposes a dedicated resolver for the all period", () => {
    expect(
      Reflect.get(financialPeriodModule, "resolveAllFinancialPeriod")
    ).toEqual(expect.any(Function));
  });

  it("covers valid history through the inclusive reference date", () => {
    expect(
      getResolver()({
        historyStartOn: "2020-04-03",
        referenceOn: "2026-09-12"
      })
    ).toEqual({
      kind: "all",
      bucketGranularity: "quarter",
      referenceOn: "2026-09-12",
      startOnInclusive: "2020-04-03",
      endOnExclusive: "2026-09-13"
    });
  });

  it("uses one daily bucket when history begins on the reference date", () => {
    expect(
      getResolver()({
        historyStartOn: "2026-09-12",
        referenceOn: "2026-09-12"
      })
    ).toEqual({
      kind: "all",
      bucketGranularity: "day",
      referenceOn: "2026-09-12",
      startOnInclusive: "2026-09-12",
      endOnExclusive: "2026-09-13"
    });
  });

  it.each([
    ["without movements", null],
    ["with future-only movements", "2026-10-01"]
  ])("uses the reference civil month %s", (_scenario, historyStartOn) => {
    expect(
      getResolver()({
        historyStartOn,
        referenceOn: "2026-09-12"
      })
    ).toEqual({
      kind: "all",
      bucketGranularity: "day",
      referenceOn: "2026-09-12",
      startOnInclusive: "2026-09-01",
      endOnExclusive: "2026-10-01"
    });
  });

  it("uses annual buckets for history longer than fifteen years", () => {
    expect(
      getResolver()({
        historyStartOn: "2000-01-01",
        referenceOn: "2026-09-12"
      })
    ).toEqual(
      expect.objectContaining({
        kind: "all",
        bucketGranularity: "year",
        startOnInclusive: "2000-01-01",
        endOnExclusive: "2026-09-13"
      })
    );
  });
});

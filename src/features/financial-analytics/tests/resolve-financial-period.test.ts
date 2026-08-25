import { describe, expect, it } from "@jest/globals";
import { containsCivilDate } from "../domain/services/contains-civil-date";
import { resolveFinancialPeriod } from "../domain/services/resolve-financial-period";
import type { FinancialPeriodKind } from "../domain/types/financial-period.types";

type PeriodCase = {
  kind: FinancialPeriodKind;
  referenceOn: string;
  startOnInclusive: string;
  endOnExclusive: string;
};

const periodCases: readonly PeriodCase[] = [
  {
    kind: "week",
    referenceOn: "2026-08-19",
    startOnInclusive: "2026-08-17",
    endOnExclusive: "2026-08-24"
  },
  {
    kind: "week",
    referenceOn: "2026-01-01",
    startOnInclusive: "2025-12-29",
    endOnExclusive: "2026-01-05"
  },
  {
    kind: "rolling_7_days",
    referenceOn: "2026-03-02",
    startOnInclusive: "2026-02-24",
    endOnExclusive: "2026-03-03"
  },
  {
    kind: "rolling_7_days",
    referenceOn: "2024-03-01",
    startOnInclusive: "2024-02-24",
    endOnExclusive: "2024-03-02"
  },
  {
    kind: "fortnight",
    referenceOn: "2026-02-15",
    startOnInclusive: "2026-02-01",
    endOnExclusive: "2026-02-16"
  },
  {
    kind: "fortnight",
    referenceOn: "2026-02-16",
    startOnInclusive: "2026-02-16",
    endOnExclusive: "2026-03-01"
  },
  {
    kind: "fortnight",
    referenceOn: "2024-02-29",
    startOnInclusive: "2024-02-16",
    endOnExclusive: "2024-03-01"
  },
  {
    kind: "rolling_15_days",
    referenceOn: "2026-01-05",
    startOnInclusive: "2025-12-22",
    endOnExclusive: "2026-01-06"
  },
  {
    kind: "month",
    referenceOn: "2026-02-10",
    startOnInclusive: "2026-02-01",
    endOnExclusive: "2026-03-01"
  },
  {
    kind: "month",
    referenceOn: "2026-12-31",
    startOnInclusive: "2026-12-01",
    endOnExclusive: "2027-01-01"
  }
];

describe("resolveFinancialPeriod", () => {
  it.each(periodCases)(
    "resolves $kind from $referenceOn with civil half-open boundaries",
    (periodCase) => {
      expect(
        resolveFinancialPeriod({
          kind: periodCase.kind,
          referenceOn: periodCase.referenceOn
        })
      ).toEqual(periodCase);
    }
  );

  it("rejects an unsupported period kind", () => {
    expect(() =>
      resolveFinancialPeriod({
        kind: "custom" as FinancialPeriodKind,
        referenceOn: "2026-08-25"
      })
    ).toThrow("period kind");
  });

  it.each(["2026-02-29", "2026-08-25T00:00:00Z"])(
    "rejects the invalid reference date %s",
    (referenceOn) => {
      expect(() =>
        resolveFinancialPeriod({ kind: "month", referenceOn })
      ).toThrow("referenceOn");
    }
  );
});

describe("containsCivilDate", () => {
  const period = {
    kind: "week" as const,
    referenceOn: "2026-08-19",
    startOnInclusive: "2026-08-17",
    endOnExclusive: "2026-08-24"
  };

  it.each([
    ["inclusive start", "2026-08-17", true],
    ["reference date", "2026-08-19", true],
    ["last included date", "2026-08-23", true],
    ["exclusive end", "2026-08-24", false],
    ["date before start", "2026-08-16", false]
  ])("handles %s", (_caseName, candidateOn, expected) => {
    expect(containsCivilDate(period, candidateOn)).toBe(expected);
  });

  it("rejects an invalid candidate date", () => {
    expect(() => containsCivilDate(period, "2026-02-30")).toThrow(
      "candidateOn"
    );
  });
});

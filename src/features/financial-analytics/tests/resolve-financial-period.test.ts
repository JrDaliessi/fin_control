import { describe, expect, it } from "@jest/globals";
import { containsCivilDate } from "../domain/services/contains-civil-date";
import { resolveFinancialPeriod } from "../domain/services/resolve-financial-period";
import type { FinancialPeriodKind } from "../domain/types/financial-period.types";

type PeriodCase = {
  kind: FinancialPeriodKind;
  bucketGranularity: "day" | "week" | "month";
  referenceOn: string;
  startOnInclusive: string;
  endOnExclusive: string;
};

const periodCases: readonly PeriodCase[] = [
  {
    kind: "week",
    bucketGranularity: "day",
    referenceOn: "2026-08-19",
    startOnInclusive: "2026-08-17",
    endOnExclusive: "2026-08-24"
  },
  {
    kind: "week",
    bucketGranularity: "day",
    referenceOn: "2026-01-01",
    startOnInclusive: "2025-12-29",
    endOnExclusive: "2026-01-05"
  },
  {
    kind: "week",
    bucketGranularity: "day",
    referenceOn: "0001-01-01",
    startOnInclusive: "0001-01-01",
    endOnExclusive: "0001-01-08"
  },
  {
    kind: "rolling_7_days",
    bucketGranularity: "day",
    referenceOn: "2026-03-02",
    startOnInclusive: "2026-02-24",
    endOnExclusive: "2026-03-03"
  },
  {
    kind: "rolling_7_days",
    bucketGranularity: "day",
    referenceOn: "2024-03-01",
    startOnInclusive: "2024-02-24",
    endOnExclusive: "2024-03-02"
  },
  {
    kind: "fortnight",
    bucketGranularity: "day",
    referenceOn: "2026-02-15",
    startOnInclusive: "2026-02-01",
    endOnExclusive: "2026-02-16"
  },
  {
    kind: "fortnight",
    bucketGranularity: "day",
    referenceOn: "2026-02-16",
    startOnInclusive: "2026-02-16",
    endOnExclusive: "2026-03-01"
  },
  {
    kind: "fortnight",
    bucketGranularity: "day",
    referenceOn: "2024-02-29",
    startOnInclusive: "2024-02-16",
    endOnExclusive: "2024-03-01"
  },
  {
    kind: "rolling_15_days",
    bucketGranularity: "day",
    referenceOn: "2026-01-05",
    startOnInclusive: "2025-12-22",
    endOnExclusive: "2026-01-06"
  },
  {
    kind: "month",
    bucketGranularity: "day",
    referenceOn: "2026-02-10",
    startOnInclusive: "2026-02-01",
    endOnExclusive: "2026-03-01"
  },
  {
    kind: "month",
    bucketGranularity: "day",
    referenceOn: "2026-12-31",
    startOnInclusive: "2026-12-01",
    endOnExclusive: "2027-01-01"
  },
  {
    kind: "three_months" as FinancialPeriodKind,
    bucketGranularity: "week",
    referenceOn: "2026-09-06",
    startOnInclusive: "2026-07-01",
    endOnExclusive: "2026-10-01"
  },
  {
    kind: "three_months" as FinancialPeriodKind,
    bucketGranularity: "week",
    referenceOn: "2026-01-15",
    startOnInclusive: "2025-11-01",
    endOnExclusive: "2026-02-01"
  },
  {
    kind: "year" as FinancialPeriodKind,
    bucketGranularity: "month",
    referenceOn: "2024-02-29",
    startOnInclusive: "2024-01-01",
    endOnExclusive: "2025-01-01"
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

  it.each([
    ["month", "9999-12-31"],
    ["fortnight", "9999-12-31"],
    ["year" as FinancialPeriodKind, "9999-12-31"]
  ] as const)(
    "rejects a %s period whose exclusive end exceeds the civil range",
    (kind, referenceOn) => {
      expect(() => resolveFinancialPeriod({ kind, referenceOn })).toThrow(
        "civil date is out of range"
      );
    }
  );
});

describe("containsCivilDate", () => {
  const period = {
    kind: "week" as const,
    bucketGranularity: "day" as const,
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

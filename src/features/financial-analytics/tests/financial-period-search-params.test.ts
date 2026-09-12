import { describe, expect, it } from "@jest/globals";
import * as periodOptions from "../presentation/config/financial-period-options";

type PeriodSearchParams = Readonly<{
  period?: string | readonly string[];
  from?: string | readonly string[];
  to?: string | readonly string[];
}>;

type FinancialPeriodSelection =
  | Readonly<{ status: "valid"; kind: string; from?: string; to?: string }>
  | Readonly<{ status: "invalid_custom"; kind: "custom"; reason: string }>;

type PeriodSearchParamsResolver = (
  input: PeriodSearchParams
) => FinancialPeriodSelection;

function getSearchParamsResolver(): PeriodSearchParamsResolver {
  const resolver = (
    periodOptions as typeof periodOptions & {
      resolveFinancialPeriodSearchParams?: PeriodSearchParamsResolver;
    }
  ).resolveFinancialPeriodSearchParams;

  expect(resolver).toEqual(expect.any(Function));

  return resolver as PeriodSearchParamsResolver;
}

describe("resolveFinancialPeriodSearchParams contract", () => {
  it.each([
    "week",
    "rolling_7_days",
    "fortnight",
    "rolling_15_days",
    "month",
    "three_months",
    "year",
    "all"
  ])("preserves the valid %s preset", (kind) => {
    expect(getSearchParamsResolver()({ period: kind })).toEqual({
      status: "valid",
      kind
    });
  });

  it("keeps both custom inclusive dates as canonical scalars", () => {
    expect(
      getSearchParamsResolver()({
        period: "custom",
        from: "2024-02-01",
        to: "2024-02-29"
      })
    ).toEqual({
      status: "valid",
      kind: "custom",
      from: "2024-02-01",
      to: "2024-02-29"
    });
  });

  it.each([
    [{ period: "custom", to: "2026-09-08" }, "CUSTOM_DATES_REQUIRED"],
    [{ period: "custom", from: "2026-09-01" }, "CUSTOM_DATES_REQUIRED"],
    [
      { period: "custom", from: ["2026-09-01"], to: "2026-09-08" },
      "CUSTOM_DATES_INVALID"
    ],
    [
      { period: "custom", from: "2026-09-01", to: ["2026-09-08"] },
      "CUSTOM_DATES_INVALID"
    ],
    [
      { period: "custom", from: "2026-02-30", to: "2026-03-01" },
      "CUSTOM_DATES_INVALID"
    ]
  ] as const)("rejects an invalid custom URL", (searchParams, reason) => {
    expect(getSearchParamsResolver()(searchParams)).toEqual({
      status: "invalid_custom",
      kind: "custom",
      reason
    });
  });

  it("does not turn unrelated parameters into financial authority", () => {
    expect(
      getSearchParamsResolver()({
        period: "all",
        from: "1900-01-01",
        to: "9999-12-31"
      })
    ).toEqual({ status: "valid", kind: "all" });
  });
});

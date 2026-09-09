export type FinancialPeriodKind =
  | "week"
  | "rolling_7_days"
  | "fortnight"
  | "rolling_15_days"
  | "month"
  | "three_months"
  | "year"
  | "all"
  | "custom";

export type FinancialBucketGranularity =
  | "day"
  | "week"
  | "month"
  | "quarter"
  | "year";

export type FinancialPeriod = Readonly<{
  kind: FinancialPeriodKind;
  bucketGranularity: FinancialBucketGranularity;
  referenceOn: string;
  startOnInclusive: string;
  endOnExclusive: string;
}>;

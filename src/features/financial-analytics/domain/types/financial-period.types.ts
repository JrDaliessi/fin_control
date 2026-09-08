export type FinancialPeriodKind =
  | "week"
  | "rolling_7_days"
  | "fortnight"
  | "rolling_15_days"
  | "month"
  | "three_months"
  | "year";

export type FinancialBucketGranularity = "day" | "week" | "month";

export type FinancialPeriod = Readonly<{
  kind: FinancialPeriodKind;
  bucketGranularity: FinancialBucketGranularity;
  referenceOn: string;
  startOnInclusive: string;
  endOnExclusive: string;
}>;

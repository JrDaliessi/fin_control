export type CustomFinancialPeriodValidationCode =
  | "INVALID_DATE"
  | "INVALID_ORDER"
  | "RANGE_TOO_LONG"
  | "TOO_MANY_BUCKETS";

const validationMessages: Record<
  CustomFinancialPeriodValidationCode,
  string
> = {
  INVALID_DATE: "dates are invalid",
  INVALID_ORDER: "boundaries are invalid",
  RANGE_TOO_LONG: "interval exceeds 60 years",
  TOO_MANY_BUCKETS: "bucket count exceeds 60"
};

export class CustomFinancialPeriodValidationError extends Error {
  readonly code: CustomFinancialPeriodValidationCode;

  constructor(code: CustomFinancialPeriodValidationCode) {
    super(validationMessages[code]);
    this.name = "CustomFinancialPeriodValidationError";
    this.code = code;
  }
}

import type { FinancialBucketGranularity } from "../../domain/types/financial-period.types";

type FinancialBucketCopy = Readonly<{
  singular: "dia" | "semana" | "mês";
  columnHeading: "Dia" | "Semana" | "Mês";
}>;

const COPY_BY_GRANULARITY: Record<
  FinancialBucketGranularity,
  FinancialBucketCopy
> = {
  day: {
    singular: "dia",
    columnHeading: "Dia"
  },
  week: {
    singular: "semana",
    columnHeading: "Semana"
  },
  month: {
    singular: "mês",
    columnHeading: "Mês"
  }
};

export function getFinancialBucketCopy(
  bucketGranularity: FinancialBucketGranularity
) {
  return COPY_BY_GRANULARITY[bucketGranularity];
}

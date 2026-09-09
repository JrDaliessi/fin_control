import type { FinancialBucketGranularity } from "../../domain/types/financial-period.types";

type FinancialBucketCopy = Readonly<{
  singular: "dia" | "semana" | "mês" | "trimestre" | "ano";
  columnHeading: "Dia" | "Semana" | "Mês" | "Trimestre" | "Ano";
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
  },
  quarter: {
    singular: "trimestre",
    columnHeading: "Trimestre"
  },
  year: {
    singular: "ano",
    columnHeading: "Ano"
  }
};

export function getFinancialBucketCopy(
  bucketGranularity: FinancialBucketGranularity
) {
  return COPY_BY_GRANULARITY[bucketGranularity];
}

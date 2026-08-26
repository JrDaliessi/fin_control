import type { FinancialPeriodKind } from "../../domain/types/financial-period.types";

export const financialPeriodOptions: readonly Readonly<{
  value: FinancialPeriodKind;
  label: string;
}>[] = [
  { value: "week", label: "Semana" },
  { value: "rolling_7_days", label: "Últimos 7 dias" },
  { value: "fortnight", label: "Quinzena" },
  { value: "rolling_15_days", label: "Últimos 15 dias" },
  { value: "month", label: "Mês" }
];

export function normalizeFinancialPeriodKind(
  value: string | readonly string[] | undefined
): FinancialPeriodKind {
  const candidate = Array.isArray(value) ? value[0] : value;

  return financialPeriodOptions.some((option) => option.value === candidate)
    ? (candidate as FinancialPeriodKind)
    : "month";
}

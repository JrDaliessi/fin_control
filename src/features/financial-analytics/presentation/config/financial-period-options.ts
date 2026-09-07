import type { FinancialPeriodKind } from "../../domain/types/financial-period.types";

export const financialPeriodOptions: readonly Readonly<{
  value: FinancialPeriodKind;
  label: string;
  compactLabel: string;
  accessibleLabel: string;
}>[] = [
  {
    value: "week",
    label: "Semana",
    compactLabel: "Sem.",
    accessibleLabel: "Semana atual"
  },
  {
    value: "rolling_7_days",
    label: "7D",
    compactLabel: "7D",
    accessibleLabel: "Últimos 7 dias"
  },
  {
    value: "fortnight",
    label: "Quinzena",
    compactLabel: "Quinz.",
    accessibleLabel: "Quinzena atual"
  },
  {
    value: "rolling_15_days",
    label: "15D",
    compactLabel: "15D",
    accessibleLabel: "Últimos 15 dias"
  },
  {
    value: "month",
    label: "Mês",
    compactLabel: "Mês",
    accessibleLabel: "Mês atual"
  },
  {
    value: "three_months",
    label: "3M",
    compactLabel: "3M",
    accessibleLabel: "Três meses civis"
  },
  {
    value: "year",
    label: "Ano",
    compactLabel: "Ano",
    accessibleLabel: "Ano atual"
  }
];

export function normalizeFinancialPeriodKind(
  value: string | readonly string[] | undefined
): FinancialPeriodKind {
  const candidate = typeof value === "string" ? value : undefined;

  return financialPeriodOptions.some((option) => option.value === candidate)
    ? (candidate as FinancialPeriodKind)
    : "month";
}

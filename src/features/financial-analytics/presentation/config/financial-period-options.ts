import type { FinancialPeriodKind } from "../../domain/types/financial-period.types";
import { resolveCustomFinancialPeriod } from "../../domain/services/resolve-financial-period";

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
  },
  {
    value: "all",
    label: "Tudo",
    compactLabel: "Tudo",
    accessibleLabel: "Todo o histórico"
  },
  {
    value: "custom",
    label: "Personalizado",
    compactLabel: "Datas",
    accessibleLabel: "Escolher período personalizado"
  }
];

type FinancialPeriodSearchParams = Readonly<{
  period?: string | readonly string[];
  from?: string | readonly string[];
  to?: string | readonly string[];
}>;

export type FinancialPeriodSelection =
  | Readonly<{
      status: "valid";
      kind: Exclude<FinancialPeriodKind, "custom">;
    }>
  | Readonly<{
      status: "valid";
      kind: "custom";
      from: string;
      to: string;
    }>
  | Readonly<{
      status: "invalid_custom";
      kind: "custom";
      reason: "CUSTOM_DATES_REQUIRED" | "CUSTOM_DATES_INVALID";
    }>;

export function resolveFinancialPeriodSearchParams({
  period,
  from,
  to
}: FinancialPeriodSearchParams): FinancialPeriodSelection {
  const kind = normalizeFinancialPeriodKind(period);

  if (kind !== "custom") {
    return { status: "valid", kind };
  }

  if (from === undefined || to === undefined) {
    return {
      status: "invalid_custom",
      kind: "custom",
      reason: "CUSTOM_DATES_REQUIRED"
    };
  }

  if (typeof from !== "string" || typeof to !== "string") {
    return {
      status: "invalid_custom",
      kind: "custom",
      reason: "CUSTOM_DATES_INVALID"
    };
  }

  try {
    resolveCustomFinancialPeriod({ from, to });
  } catch {
    return {
      status: "invalid_custom",
      kind: "custom",
      reason: "CUSTOM_DATES_INVALID"
    };
  }

  return { status: "valid", kind, from, to };
}

export function normalizeFinancialPeriodKind(
  value: string | readonly string[] | undefined
): FinancialPeriodKind {
  const candidate = typeof value === "string" ? value : undefined;

  return financialPeriodOptions.some((option) => option.value === candidate)
    ? (candidate as FinancialPeriodKind)
    : "month";
}

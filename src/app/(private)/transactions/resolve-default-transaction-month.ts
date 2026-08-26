import { DEFAULT_FINANCIAL_TIME_ZONE } from "@/features/financial-analytics/application/config/financial-time-zone";
import { resolveReferenceCivilDate } from "@/features/financial-analytics/application/services/resolve-reference-civil-date";

export function resolveDefaultTransactionMonthRef(referenceInstant: string) {
  return resolveReferenceCivilDate({
    referenceInstant,
    timeZone: DEFAULT_FINANCIAL_TIME_ZONE
  }).slice(0, 7);
}

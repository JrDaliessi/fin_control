import { parseCurrencyToCents } from "../../../../shared/utils/parseCurrencyToCents";

export function parseAccountBalanceToCents(value: string): number | null {
  return parseCurrencyToCents(value, { allowNegative: true });
}

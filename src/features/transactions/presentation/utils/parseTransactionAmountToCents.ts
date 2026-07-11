import { parseCurrencyToCents } from "../../../../shared/utils/parseCurrencyToCents";

export function parseTransactionAmountToCents(value: string): number | null {
  return parseCurrencyToCents(value);
}

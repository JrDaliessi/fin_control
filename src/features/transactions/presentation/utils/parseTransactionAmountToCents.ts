const centsMultiplier = 100;

export function parseTransactionAmountToCents(value: string): number | null {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const normalizedValue = normalizeAmountInput(trimmedValue);

  if (!normalizedValue) {
    return null;
  }

  const [wholePart, decimalPart = ""] = normalizedValue.split(".");
  const amountInCents =
    Number(wholePart) * centsMultiplier + Number(decimalPart.padEnd(2, "0"));

  if (!Number.isSafeInteger(amountInCents)) {
    return null;
  }

  return amountInCents;
}

function normalizeAmountInput(value: string): string | null {
  if (value.includes(",")) {
    return normalizeBrazilianAmountInput(value);
  }

  if (!/^\d+(\.\d{1,2})?$/.test(value)) {
    return null;
  }

  return value;
}

function normalizeBrazilianAmountInput(value: string): string | null {
  const acceptsBrazilianCurrencyFormat =
    /^\d{1,3}(\.\d{3})*(,\d{1,2})?$/.test(value) ||
    /^\d+(,\d{1,2})?$/.test(value);

  if (!acceptsBrazilianCurrencyFormat) {
    return null;
  }

  return value.replace(/\./g, "").replace(",", ".");
}

const centsMultiplier = 100;

type ParseCurrencyToCentsOptions = {
  allowNegative?: boolean;
};

export function parseCurrencyToCents(
  value: string,
  { allowNegative = false }: ParseCurrencyToCentsOptions = {}
): number | null {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const isNegative = trimmedValue.startsWith("-");

  if (isNegative && !allowNegative) {
    return null;
  }

  const unsignedValue = isNegative ? trimmedValue.slice(1) : trimmedValue;
  const normalizedValue = normalizeAmountInput(unsignedValue);

  if (!normalizedValue) {
    return null;
  }

  const [wholePart, decimalPart = ""] = normalizedValue.split(".");
  const unsignedAmountInCents =
    Number(wholePart) * centsMultiplier + Number(decimalPart.padEnd(2, "0"));
  const amountInCents = isNegative
    ? -unsignedAmountInCents
    : unsignedAmountInCents;

  return Number.isSafeInteger(amountInCents) ? amountInCents : null;
}

function normalizeAmountInput(value: string): string | null {
  if (value.includes(",")) {
    const isBrazilianFormat =
      /^\d{1,3}(\.\d{3})*(,\d{1,2})?$/.test(value) ||
      /^\d+(,\d{1,2})?$/.test(value);

    return isBrazilianFormat
      ? value.replace(/\./g, "").replace(",", ".")
      : null;
  }

  return /^\d+(\.\d{1,2})?$/.test(value) ? value : null;
}

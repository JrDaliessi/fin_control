const centsMultiplier = 100;

export function parseAccountBalanceToCents(value: string): number | null {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const sign = trimmedValue.startsWith("-") ? -1 : 1;
  const unsignedValue = trimmedValue.replace(/^[+-]/, "");
  const normalizedValue = normalizeAmountInput(unsignedValue);

  if (!normalizedValue) {
    return null;
  }

  const [wholePart, decimalPart = ""] = normalizedValue.split(".");
  const amountInCents =
    sign *
    (Number(wholePart) * centsMultiplier + Number(decimalPart.padEnd(2, "0")));

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

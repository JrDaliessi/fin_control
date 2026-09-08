import type { FinancialEvolutionBucketSnapshot } from "../../domain/types/financial-evolution.types";
import { CivilDate } from "../../domain/value-objects/civil-date";

type NumericInteger = number | string;

export type FinancialEvolutionBucketRow = Readonly<{
  account_count: NumericInteger;
  start_on_inclusive: string;
  end_on_exclusive: string;
  open_in_cents: NumericInteger;
  high_in_cents: NumericInteger;
  low_in_cents: NumericInteger;
  close_in_cents: NumericInteger;
  income_in_cents: NumericInteger;
  expense_in_cents: NumericInteger;
  volume_in_cents: NumericInteger;
  transaction_count: NumericInteger;
}>;

function parseSafeInteger(value: NumericInteger, field: string): number {
  if (
    (typeof value === "string" && !/^-?\d+$/.test(value)) ||
    (typeof value !== "string" && typeof value !== "number")
  ) {
    throw new Error(`${field} is invalid`);
  }

  const parsedValue = typeof value === "number" ? value : Number(value);

  if (!Number.isSafeInteger(parsedValue)) {
    throw new Error(`${field} must be a safe integer`);
  }

  return parsedValue;
}

function parseCivilDate(value: string, field: string): string {
  try {
    return CivilDate.fromString(value).value;
  } catch {
    throw new Error(`${field} is invalid`);
  }
}

export function mapFinancialEvolutionBucketRows(
  rows: readonly FinancialEvolutionBucketRow[]
): FinancialEvolutionBucketSnapshot {
  if (rows.length === 0) {
    throw new Error("financial evolution bucket response is absent");
  }

  const accountCount = parseSafeInteger(rows[0].account_count, "account count");

  if (accountCount < 0) {
    throw new Error("financial evolution bucket account count is invalid");
  }

  let previousEndOnExclusive: string | undefined;
  let previousCloseInCents: number | undefined;

  const buckets = rows.map((row) => {
    if (parseSafeInteger(row.account_count, "account count") !== accountCount) {
      throw new Error("financial evolution bucket response is inconsistent");
    }

    const startOnInclusive = parseCivilDate(
      row.start_on_inclusive,
      "bucket start"
    );
    const endOnExclusive = parseCivilDate(
      row.end_on_exclusive,
      "bucket end"
    );
    const openInCents = parseSafeInteger(row.open_in_cents, "bucket open");
    const highInCents = parseSafeInteger(row.high_in_cents, "bucket high");
    const lowInCents = parseSafeInteger(row.low_in_cents, "bucket low");
    const closeInCents = parseSafeInteger(row.close_in_cents, "bucket close");
    const incomeInCents = parseSafeInteger(row.income_in_cents, "bucket income");
    const expenseInCents = parseSafeInteger(
      row.expense_in_cents,
      "bucket expense"
    );
    const volumeInCents = parseSafeInteger(row.volume_in_cents, "bucket volume");
    const transactionCount = parseSafeInteger(
      row.transaction_count,
      "bucket transaction count"
    );

    if (startOnInclusive >= endOnExclusive) {
      throw new Error("financial evolution bucket interval is invalid");
    }

    if (
      incomeInCents < 0 ||
      expenseInCents < 0 ||
      volumeInCents < 0 ||
      transactionCount < 0 ||
      volumeInCents !== incomeInCents + expenseInCents ||
      !Number.isSafeInteger(incomeInCents + expenseInCents)
    ) {
      throw new Error("financial evolution bucket totals are invalid");
    }

    if (
      highInCents < Math.max(openInCents, closeInCents) ||
      lowInCents > Math.min(openInCents, closeInCents) ||
      lowInCents > highInCents ||
      closeInCents !== openInCents + incomeInCents - expenseInCents ||
      !Number.isSafeInteger(openInCents + incomeInCents - expenseInCents)
    ) {
      throw new Error("financial evolution bucket OHLC is invalid");
    }

    if (
      (previousEndOnExclusive !== undefined &&
        startOnInclusive !== previousEndOnExclusive) ||
      (previousCloseInCents !== undefined &&
        openInCents !== previousCloseInCents)
    ) {
      throw new Error("financial evolution buckets are not continuous");
    }

    if (
      accountCount === 0 &&
      (openInCents !== 0 ||
        highInCents !== 0 ||
        lowInCents !== 0 ||
        closeInCents !== 0 ||
        volumeInCents !== 0 ||
        transactionCount !== 0)
    ) {
      throw new Error("financial evolution bucket ownership is inconsistent");
    }

    previousEndOnExclusive = endOnExclusive;
    previousCloseInCents = closeInCents;

    return {
      startOnInclusive,
      endOnExclusive,
      openInCents,
      highInCents,
      lowInCents,
      closeInCents,
      incomeInCents,
      expenseInCents,
      volumeInCents,
      transactionCount
    };
  });

  return { accountCount, buckets };
}

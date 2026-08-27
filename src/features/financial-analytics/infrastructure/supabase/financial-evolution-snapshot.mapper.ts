import type {
  FinancialEvolutionSnapshot,
  FinancialMovementProjection
} from "../../domain/types/financial-evolution.types";
import { CivilDate } from "../../domain/value-objects/civil-date";

type NumericInteger = number | string;

export type FinancialEvolutionSnapshotRow = Readonly<{
  account_count: NumericInteger;
  opening_balance_in_cents: NumericInteger;
  movement_id: string | null;
  occurred_on: string | null;
  created_at: string | null;
  movement_type: string | null;
  amount_in_cents: NumericInteger | null;
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

function isValidInstant(value: string): boolean {
  return !Number.isNaN(new Date(value).getTime());
}

export function mapFinancialEvolutionSnapshotRows(
  rows: readonly FinancialEvolutionSnapshotRow[]
): FinancialEvolutionSnapshot {
  const firstRow = rows[0];

  if (!firstRow) {
    throw new Error("financial evolution snapshot is absent");
  }

  const accountCount = parseSafeInteger(firstRow.account_count, "account count");
  const openingBalanceInCents = parseSafeInteger(
    firstRow.opening_balance_in_cents,
    "opening balance"
  );

  if (accountCount < 0) {
    throw new Error("account count is invalid");
  }

  const movements = rows.map<FinancialMovementProjection | null>((row) => {
    if (
      parseSafeInteger(row.account_count, "account count") !== accountCount ||
      parseSafeInteger(row.opening_balance_in_cents, "opening balance") !==
        openingBalanceInCents
    ) {
      throw new Error("financial evolution snapshot is inconsistent");
    }

    const movementValues = [
      row.movement_id,
      row.occurred_on,
      row.created_at,
      row.movement_type,
      row.amount_in_cents
    ];
    const nullCount = movementValues.filter((value) => value === null).length;

    if (nullCount === movementValues.length) {
      return null;
    }

    if (nullCount > 0) {
      throw new Error("financial movement row is incomplete");
    }

    const movementId = row.movement_id as string;
    const occurredOn = row.occurred_on as string;
    const createdAt = row.created_at as string;
    const movementType = row.movement_type;
    const amountInCents = parseSafeInteger(
      row.amount_in_cents as NumericInteger,
      "movement amount"
    );

    if (!movementId || !isValidInstant(createdAt)) {
      throw new Error("financial movement row is invalid");
    }

    try {
      CivilDate.fromString(occurredOn);
    } catch {
      throw new Error("financial movement civil date is invalid");
    }

    if (movementType !== "income" && movementType !== "expense") {
      throw new Error("financial movement type is invalid");
    }

    if (amountInCents <= 0) {
      throw new Error("financial movement amount is invalid");
    }

    return {
      id: movementId,
      occurredOn,
      createdAt,
      type: movementType,
      amountInCents
    };
  });

  if (movements.some((movement) => movement === null) && rows.length > 1) {
    throw new Error("financial evolution snapshot is inconsistent");
  }

  return {
    accountCount,
    openingBalanceInCents,
    movements: movements.filter((movement) => movement !== null)
  };
}

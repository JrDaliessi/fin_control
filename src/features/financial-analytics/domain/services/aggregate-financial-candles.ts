import type { FinancialPeriod } from "../types/financial-period.types";
import type {
  FinancialCandle,
  FinancialMovementProjection
} from "../types/financial-evolution.types";
import { CivilDate } from "../value-objects/civil-date";
import { daysInGregorianMonth } from "./gregorian-calendar";

export type AggregateFinancialCandlesInput = Readonly<{
  period: FinancialPeriod;
  openingBalanceInCents: number;
  movements: readonly FinancialMovementProjection[];
}>;

function assertSafeInteger(value: number, field: string): void {
  if (!Number.isSafeInteger(value)) {
    throw new Error(`${field} must be a safe integer`);
  }
}

function safeAdd(left: number, right: number): number {
  const result = left + right;

  if (!Number.isSafeInteger(result)) {
    throw new Error("financial candles must remain a safe integer");
  }

  return result;
}

function nextCivilDate(value: string): string {
  const canonicalValue = CivilDate.fromString(value).value;
  let [year, month, day] = canonicalValue.split("-").map(Number);

  day += 1;

  if (day > daysInGregorianMonth(year, month)) {
    day = 1;
    month += 1;

    if (month > 12) {
      month = 1;
      year += 1;
    }
  }

  if (year > 9999) {
    throw new Error("financial candles period is out of range");
  }

  return `${year.toString().padStart(4, "0")}-${month
    .toString()
    .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}

function validateMovement(
  movement: FinancialMovementProjection,
  period: FinancialPeriod
): void {
  let occurredOn: string;

  try {
    occurredOn = CivilDate.fromString(movement.occurredOn).value;
  } catch {
    throw new Error("movement occurredOn is invalid");
  }

  if (
    occurredOn < period.startOnInclusive ||
    occurredOn >= period.endOnExclusive
  ) {
    throw new Error("movement is outside the financial period");
  }

  if (!movement.id.trim()) {
    throw new Error("movement id is invalid");
  }

  const registrationInstant = Date.parse(movement.createdAt);

  if (
    !Number.isFinite(registrationInstant) ||
    new Date(registrationInstant).toISOString() !== movement.createdAt
  ) {
    throw new Error("movement createdAt is invalid");
  }

  if (movement.type !== "income" && movement.type !== "expense") {
    throw new Error("movement type is invalid");
  }

  if (
    !Number.isSafeInteger(movement.amountInCents) ||
    movement.amountInCents <= 0
  ) {
    throw new Error("movement amount must be a positive safe integer");
  }
}

function compareMovements(
  left: FinancialMovementProjection,
  right: FinancialMovementProjection
) {
  return (
    left.occurredOn.localeCompare(right.occurredOn) ||
    left.createdAt.localeCompare(right.createdAt) ||
    left.id.localeCompare(right.id)
  );
}

export function aggregateFinancialCandles(
  input: AggregateFinancialCandlesInput
): FinancialCandle[] {
  assertSafeInteger(input.openingBalanceInCents, "opening balance");

  const movementsByDay = new Map<string, FinancialMovementProjection[]>();

  for (const movement of input.movements) {
    validateMovement(movement, input.period);
    const dailyMovements = movementsByDay.get(movement.occurredOn) ?? [];
    dailyMovements.push(movement);
    movementsByDay.set(movement.occurredOn, dailyMovements);
  }

  const candles: FinancialCandle[] = [];
  let balanceInCents = input.openingBalanceInCents;
  let startOnInclusive = input.period.startOnInclusive;

  while (startOnInclusive < input.period.endOnExclusive) {
    const endOnExclusive = nextCivilDate(startOnInclusive);
    const dailyMovements = [
      ...(movementsByDay.get(startOnInclusive) ?? [])
    ].sort(compareMovements);
    const openInCents = balanceInCents;
    let highInCents = openInCents;
    let lowInCents = openInCents;
    let incomeInCents = 0;
    let expenseInCents = 0;
    let volumeInCents = 0;

    for (const movement of dailyMovements) {
      volumeInCents = safeAdd(volumeInCents, movement.amountInCents);

      if (movement.type === "income") {
        incomeInCents = safeAdd(incomeInCents, movement.amountInCents);
        balanceInCents = safeAdd(balanceInCents, movement.amountInCents);
      } else {
        expenseInCents = safeAdd(expenseInCents, movement.amountInCents);
        balanceInCents = safeAdd(balanceInCents, -movement.amountInCents);
      }

      highInCents = Math.max(highInCents, balanceInCents);
      lowInCents = Math.min(lowInCents, balanceInCents);
    }

    candles.push({
      startOnInclusive,
      endOnExclusive,
      openInCents,
      highInCents,
      lowInCents,
      closeInCents: balanceInCents,
      incomeInCents,
      expenseInCents,
      volumeInCents,
      transactionCount: dailyMovements.length
    });
    startOnInclusive = endOnExclusive;
  }

  return candles;
}

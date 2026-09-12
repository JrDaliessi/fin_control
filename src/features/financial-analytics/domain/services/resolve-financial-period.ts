import { CivilDate } from "../value-objects/civil-date";
import { daysInGregorianMonth } from "./gregorian-calendar";
import type {
  FinancialBucketGranularity,
  FinancialPeriod,
  FinancialPeriodKind
} from "../types/financial-period.types";
import { CustomFinancialPeriodValidationError } from "../errors/custom-financial-period-validation.error";

type CivilDateParts = {
  year: number;
  month: number;
  day: number;
};

type PresetFinancialPeriodKind = Exclude<
  FinancialPeriodKind,
  "all" | "custom"
>;

const supportedKinds: readonly PresetFinancialPeriodKind[] = [
  "week",
  "rolling_7_days",
  "fortnight",
  "rolling_15_days",
  "month",
  "three_months",
  "year"
];

function isPresetFinancialPeriodKind(
  value: unknown
): value is PresetFinancialPeriodKind {
  return supportedKinds.includes(value as PresetFinancialPeriodKind);
}

function parseCivilDate(value: string): CivilDateParts {
  const canonicalValue = CivilDate.fromString(value).value;
  const [year, month, day] = canonicalValue.split("-").map(Number);

  return { year, month, day };
}

function formatCivilDate(parts: CivilDateParts): string {
  if (parts.year < 1 || parts.year > 9999) {
    throw new Error("civil date is out of range");
  }

  return `${parts.year.toString().padStart(4, "0")}-${parts.month
    .toString()
    .padStart(2, "0")}-${parts.day.toString().padStart(2, "0")}`;
}

function addCivilDays(value: string, amount: number): string {
  const parts = parseCivilDate(value);
  const direction = Math.sign(amount);

  for (let remaining = Math.abs(amount); remaining > 0; remaining -= 1) {
    parts.day += direction;

    if (
      direction > 0 &&
      parts.day > daysInGregorianMonth(parts.year, parts.month)
    ) {
      parts.day = 1;
      parts.month += 1;

      if (parts.month > 12) {
        parts.month = 1;
        parts.year += 1;
      }
    }

    if (direction < 0 && parts.day < 1) {
      parts.month -= 1;

      if (parts.month < 1) {
        parts.month = 12;
        parts.year -= 1;
      }

      if (parts.year < 1 || parts.year > 9999) {
        throw new Error("civil date is out of range");
      }

      parts.day = daysInGregorianMonth(parts.year, parts.month);
    }

    if (parts.year < 1 || parts.year > 9999) {
      throw new Error("civil date is out of range");
    }
  }

  return formatCivilDate(parts);
}

function compareCivilDates(left: string, right: string): number {
  return left.localeCompare(right);
}

function civilDayOrdinal(value: string): number {
  const { year, month, day } = parseCivilDate(value);
  const previousYears = year - 1;
  let ordinal =
    previousYears * 365 +
    Math.floor(previousYears / 4) -
    Math.floor(previousYears / 100) +
    Math.floor(previousYears / 400);

  for (let currentMonth = 1; currentMonth < month; currentMonth += 1) {
    ordinal += daysInGregorianMonth(year, currentMonth);
  }

  return ordinal + day - 1;
}

function addCivilYearsClamped(value: string, amount: number): string {
  const { year, month, day } = parseCivilDate(value);
  const shiftedYear = year + amount;

  return formatCivilDate({
    year: shiftedYear,
    month,
    day: Math.min(day, daysInGregorianMonth(shiftedYear, month))
  });
}

function addCivilMonthsClamped(value: string, amount: number): string {
  const { year, month, day } = parseCivilDate(value);
  const shiftedMonthIndex = (year - 1) * 12 + month - 1 + amount;

  if (shiftedMonthIndex < 0 || shiftedMonthIndex >= 9999 * 12) {
    throw new Error("civil date is out of range");
  }

  const shiftedYear = Math.floor(shiftedMonthIndex / 12) + 1;
  const shiftedMonth = (shiftedMonthIndex % 12) + 1;

  return formatCivilDate({
    year: shiftedYear,
    month: shiftedMonth,
    day: Math.min(day, daysInGregorianMonth(shiftedYear, shiftedMonth))
  });
}

function endsWithinCivilMonths(
  startOnInclusive: string,
  endOnExclusive: string,
  amount: number
): boolean {
  const { year, month } = parseCivilDate(startOnInclusive);
  const shiftedMonthIndex = (year - 1) * 12 + month - 1 + amount;

  return (
    shiftedMonthIndex >= 9999 * 12 ||
    compareCivilDates(
      endOnExclusive,
      addCivilMonthsClamped(startOnInclusive, amount)
    ) <= 0
  );
}

function endsWithinCivilYears(
  startOnInclusive: string,
  endOnExclusive: string,
  amount: number
): boolean {
  const { year } = parseCivilDate(startOnInclusive);

  return (
    year + amount > 9999 ||
    compareCivilDates(
      endOnExclusive,
      addCivilYearsClamped(startOnInclusive, amount)
    ) <= 0
  );
}

function resolveFinancialBucketGranularity(
  startOnInclusive: string,
  endOnExclusive: string
): FinancialBucketGranularity {
  const dayCount =
    civilDayOrdinal(endOnExclusive) - civilDayOrdinal(startOnInclusive);

  if (dayCount <= 31) {
    return "day";
  }

  if (endsWithinCivilMonths(startOnInclusive, endOnExclusive, 6)) {
    return "week";
  }

  if (endsWithinCivilYears(startOnInclusive, endOnExclusive, 2)) {
    return "month";
  }

  if (endsWithinCivilYears(startOnInclusive, endOnExclusive, 15)) {
    return "quarter";
  }

  return "year";
}

export type ResolveCustomFinancialPeriodInput = Readonly<{
  from: string;
  to: string;
}>;

export function resolveCustomFinancialPeriod({
  from,
  to
}: ResolveCustomFinancialPeriodInput): FinancialPeriod {
  let startOnInclusive: string;
  let toInclusive: string;

  try {
    startOnInclusive = CivilDate.fromString(from).value;
    toInclusive = CivilDate.fromString(to).value;
  } catch {
    throw new CustomFinancialPeriodValidationError("INVALID_DATE");
  }

  if (compareCivilDates(startOnInclusive, toInclusive) > 0) {
    throw new CustomFinancialPeriodValidationError("INVALID_ORDER");
  }

  let endOnExclusive: string;

  try {
    endOnExclusive = addCivilDays(toInclusive, 1);
  } catch {
    throw new CustomFinancialPeriodValidationError("INVALID_DATE");
  }

  if (!endsWithinCivilYears(startOnInclusive, endOnExclusive, 60)) {
    throw new CustomFinancialPeriodValidationError("RANGE_TOO_LONG");
  }

  const bucketGranularity = resolveFinancialBucketGranularity(
    startOnInclusive,
    endOnExclusive
  );
  const bucketCount = countIntersectingCivilBuckets(
    startOnInclusive,
    endOnExclusive,
    bucketGranularity
  );

  if (bucketCount > 60) {
    throw new CustomFinancialPeriodValidationError("TOO_MANY_BUCKETS");
  }

  return {
    kind: "custom",
    bucketGranularity,
    referenceOn: toInclusive,
    startOnInclusive,
    endOnExclusive
  };
}

function countIntersectingCivilBuckets(
  startOnInclusive: string,
  endOnExclusive: string,
  bucketGranularity: FinancialBucketGranularity
): number {
  const first = parseCivilDate(startOnInclusive);
  const lastOnInclusive = addCivilDays(endOnExclusive, -1);
  const last = parseCivilDate(lastOnInclusive);

  switch (bucketGranularity) {
    case "day":
      return civilDayOrdinal(endOnExclusive) - civilDayOrdinal(startOnInclusive);
    case "week":
      return (
        Math.floor(civilDayOrdinal(lastOnInclusive) / 7) -
        Math.floor(civilDayOrdinal(startOnInclusive) / 7) +
        1
      );
    case "month":
      return (last.year - first.year) * 12 + last.month - first.month + 1;
    case "quarter":
      return (
        (last.year - first.year) * 4 +
        Math.floor((last.month - 1) / 3) -
        Math.floor((first.month - 1) / 3) +
        1
      );
    case "year":
      return last.year - first.year + 1;
  }
}

function mondayBasedWeekday(value: string): number {
  const { year, month, day } = parseCivilDate(value);
  const previousYears = year - 1;
  const daysBeforeYear =
    previousYears * 365 +
    Math.floor(previousYears / 4) -
    Math.floor(previousYears / 100) +
    Math.floor(previousYears / 400);
  let daysBeforeMonth = 0;

  for (let currentMonth = 1; currentMonth < month; currentMonth += 1) {
    daysBeforeMonth += daysInGregorianMonth(year, currentMonth);
  }

  return (daysBeforeYear + daysBeforeMonth + day - 1) % 7;
}

function firstDayOfMonth(value: string): string {
  const { year, month } = parseCivilDate(value);

  return formatCivilDate({ year, month, day: 1 });
}

function firstDayOfShiftedMonth(value: string, offset: number): string {
  const { year, month } = parseCivilDate(value);
  const shiftedMonthIndex = (year - 1) * 12 + month - 1 + offset;

  if (shiftedMonthIndex < 0 || shiftedMonthIndex >= 9999 * 12) {
    throw new Error("civil date is out of range");
  }

  const shiftedYear = Math.floor(shiftedMonthIndex / 12) + 1;
  const shiftedMonth = (shiftedMonthIndex % 12) + 1;

  return formatCivilDate({ year: shiftedYear, month: shiftedMonth, day: 1 });
}

function firstDayOfNextMonth(value: string): string {
  return firstDayOfShiftedMonth(value, 1);
}

export type ResolveFinancialPeriodInput = {
  kind: FinancialPeriodKind;
  referenceOn: string;
};

export function resolveFinancialPeriod(
  input: ResolveFinancialPeriodInput
): FinancialPeriod {
  if (!isPresetFinancialPeriodKind(input.kind)) {
    throw new Error("period kind is invalid");
  }

  let referenceOn: string;

  try {
    referenceOn = CivilDate.fromString(input.referenceOn).value;
  } catch {
    throw new Error("referenceOn is invalid");
  }

  let startOnInclusive: string;
  let endOnExclusive: string;
  let bucketGranularity: FinancialBucketGranularity = "day";

  switch (input.kind) {
    case "week":
      startOnInclusive = addCivilDays(
        referenceOn,
        -mondayBasedWeekday(referenceOn)
      );
      endOnExclusive = addCivilDays(startOnInclusive, 7);
      break;
    case "rolling_7_days":
      startOnInclusive = addCivilDays(referenceOn, -6);
      endOnExclusive = addCivilDays(referenceOn, 1);
      break;
    case "fortnight": {
      const { year, month, day } = parseCivilDate(referenceOn);
      startOnInclusive = formatCivilDate({
        year,
        month,
        day: day <= 15 ? 1 : 16
      });
      endOnExclusive =
        day <= 15
          ? formatCivilDate({ year, month, day: 16 })
          : firstDayOfNextMonth(referenceOn);
      break;
    }
    case "rolling_15_days":
      startOnInclusive = addCivilDays(referenceOn, -14);
      endOnExclusive = addCivilDays(referenceOn, 1);
      break;
    case "month":
      startOnInclusive = firstDayOfMonth(referenceOn);
      endOnExclusive = firstDayOfNextMonth(referenceOn);
      break;
    case "three_months":
      startOnInclusive = firstDayOfShiftedMonth(referenceOn, -2);
      endOnExclusive = firstDayOfNextMonth(referenceOn);
      bucketGranularity = "week";
      break;
    case "year": {
      const { year } = parseCivilDate(referenceOn);
      startOnInclusive = formatCivilDate({ year, month: 1, day: 1 });
      endOnExclusive = formatCivilDate({ year: year + 1, month: 1, day: 1 });
      bucketGranularity = "month";
      break;
    }
  }

  return {
    kind: input.kind,
    bucketGranularity,
    referenceOn,
    startOnInclusive,
    endOnExclusive
  };
}

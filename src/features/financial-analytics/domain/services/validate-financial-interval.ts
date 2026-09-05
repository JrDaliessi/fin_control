export type FinancialInterval = Readonly<{
  startOnInclusive: string;
  endOnExclusive: string;
}>;

const CIVIL_DATE_PATTERN = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const MAX_INTERVAL_DAYS = 31;
const MILLISECONDS_PER_DAY = 86_400_000;
const invalidIntervalMessage = "financial interval is invalid";

function parseCivilDate(value: string) {
  if (!CIVIL_DATE_PATTERN.test(value)) {
    throw new Error(invalidIntervalMessage);
  }

  const instant = new Date(`${value}T00:00:00.000Z`);

  if (
    Number.isNaN(instant.getTime()) ||
    instant.toISOString().slice(0, 10) !== value
  ) {
    throw new Error(invalidIntervalMessage);
  }

  return instant.getTime();
}

export function validateFinancialInterval(
  interval: FinancialInterval
): FinancialInterval {
  const startTime = parseCivilDate(interval.startOnInclusive);
  const endTime = parseCivilDate(interval.endOnExclusive);
  const durationInDays = (endTime - startTime) / MILLISECONDS_PER_DAY;

  if (durationInDays <= 0 || durationInDays > MAX_INTERVAL_DAYS) {
    throw new Error(invalidIntervalMessage);
  }

  return {
    startOnInclusive: interval.startOnInclusive,
    endOnExclusive: interval.endOnExclusive
  };
}

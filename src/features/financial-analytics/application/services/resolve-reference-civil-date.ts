import { CivilDate } from "../../domain/value-objects/civil-date";

export type ResolveReferenceCivilDateInput = Readonly<{
  referenceInstant: string;
  timeZone: string;
}>;

export function resolveReferenceCivilDate(
  input: ResolveReferenceCivilDateInput
): string {
  const instant = new Date(input.referenceInstant);

  if (Number.isNaN(instant.getTime())) {
    throw new Error("referenceInstant is invalid");
  }

  let formatter: Intl.DateTimeFormat;

  try {
    formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: input.timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  } catch {
    throw new Error("timeZone is invalid");
  }

  const parts = formatter.formatToParts(instant);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    throw new Error("referenceInstant is invalid");
  }

  return CivilDate.fromString(`${year}-${month}-${day}`).value;
}

export class MonthRef {
  readonly value: string;
  readonly year: number;
  readonly month: number;

  private constructor(value: string, year: number, month: number) {
    this.value = value;
    this.year = year;
    this.month = month;
  }

  static fromString(value: string): MonthRef {
    const normalizedValue = value.trim();
    const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(normalizedValue);

    if (!match) {
      throw new Error("monthRef is invalid");
    }

    return new MonthRef(
      normalizedValue,
      Number(match[1]),
      Number(match[2])
    );
  }
}

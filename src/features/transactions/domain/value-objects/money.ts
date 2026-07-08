export class Money {
  readonly amountInCents: number;

  private constructor(amountInCents: number) {
    this.amountInCents = amountInCents;
  }

  static fromPositiveCents(amountInCents: number): Money {
    if (!Number.isInteger(amountInCents) || amountInCents <= 0) {
      throw new Error("amount must be a positive integer in cents");
    }

    return new Money(amountInCents);
  }
}

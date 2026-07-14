export type FinancialAccountType =
  | "checking"
  | "savings"
  | "cash"
  | "payment"
  | "investment";

export type CreateFinancialAccountInput = {
  userId: string;
  name: string;
  type: FinancialAccountType;
  initialBalanceInCents: number;
  currency?: "BRL";
};

export type FinancialAccountProps = CreateFinancialAccountInput & {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type RestoreFinancialAccountInput = CreateFinancialAccountInput & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

const validAccountTypes: readonly FinancialAccountType[] = [
  "checking",
  "savings",
  "cash",
  "payment",
  "investment"
];

export class FinancialAccount {
  readonly id?: string;
  readonly userId: string;
  readonly name: string;
  readonly type: FinancialAccountType;
  readonly initialBalanceInCents: number;
  readonly currency: "BRL";
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  private constructor(props: FinancialAccountProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.name = props.name;
    this.type = props.type;
    this.initialBalanceInCents = props.initialBalanceInCents;
    this.currency = props.currency ?? "BRL";
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(input: CreateFinancialAccountInput): FinancialAccount {
    const userId = input.userId.trim();
    const name = input.name.trim().replace(/\s+/g, " ");
    const currency = input.currency ?? "BRL";

    if (!userId) {
      throw new Error("user is required");
    }

    if (!name) {
      throw new Error("name is required");
    }

    if (name.length > 80) {
      throw new Error("name must have at most 80 characters");
    }

    if (!validAccountTypes.includes(input.type)) {
      throw new Error("account type is invalid");
    }

    if (!Number.isSafeInteger(input.initialBalanceInCents)) {
      throw new Error("initial balance must be a safe integer in cents");
    }

    if (currency !== "BRL") {
      throw new Error("currency must be BRL");
    }

    return new FinancialAccount({
      ...input,
      userId,
      name,
      currency
    });
  }

  static restore(input: RestoreFinancialAccountInput): FinancialAccount {
    const validatedAccount = FinancialAccount.create(input);

    return new FinancialAccount({
      id: input.id,
      userId: validatedAccount.userId,
      name: validatedAccount.name,
      type: validatedAccount.type,
      initialBalanceInCents: validatedAccount.initialBalanceInCents,
      currency: validatedAccount.currency,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt
    });
  }
}

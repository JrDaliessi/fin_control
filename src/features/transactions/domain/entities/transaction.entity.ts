export type TransactionType = "income" | "expense";

export type PaymentMethod = "manual" | "pix" | "cash" | "debit";

export type CreateTransactionInput = {
  userId: string;
  accountId: string;
  categoryId: string;
  description: string;
  amountInCents: number;
  type: TransactionType;
  occurredAt: Date;
  paymentMethod?: PaymentMethod;
  notes?: string;
};

export type TransactionProps = CreateTransactionInput & {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Transaction {
  readonly id?: string;
  readonly userId: string;
  readonly accountId: string;
  readonly categoryId: string;
  readonly description: string;
  readonly amountInCents: number;
  readonly type: TransactionType;
  readonly occurredAt: Date;
  readonly paymentMethod: PaymentMethod;
  readonly notes?: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  private constructor(props: TransactionProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.accountId = props.accountId;
    this.categoryId = props.categoryId;
    this.description = props.description;
    this.amountInCents = props.amountInCents;
    this.type = props.type;
    this.occurredAt = props.occurredAt;
    this.paymentMethod = props.paymentMethod ?? "manual";
    this.notes = props.notes;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(input: CreateTransactionInput): Transaction {
    const description = input.description.trim();

    if (!input.userId.trim()) {
      throw new Error("user is required");
    }

    if (!input.accountId.trim()) {
      throw new Error("account is required");
    }

    if (!input.categoryId.trim()) {
      throw new Error("category is required");
    }

    if (!description) {
      throw new Error("description is required");
    }

    if (!Number.isInteger(input.amountInCents) || input.amountInCents <= 0) {
      throw new Error("amount must be a positive integer in cents");
    }

    if (input.type !== "income" && input.type !== "expense") {
      throw new Error("transaction type is invalid");
    }

    if (!(input.occurredAt instanceof Date) || Number.isNaN(input.occurredAt.getTime())) {
      throw new Error("occurredAt date is invalid");
    }

    return new Transaction({
      ...input,
      description
    });
  }
}


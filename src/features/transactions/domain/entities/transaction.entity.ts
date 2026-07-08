import { Money } from "../value-objects/money";

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

const validPaymentMethods = ["manual", "pix", "cash", "debit"];

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
    const userId = input.userId.trim();
    const accountId = input.accountId.trim();
    const categoryId = input.categoryId.trim();
    const description = input.description.trim();
    const paymentMethod = input.paymentMethod ?? "manual";

    if (!userId) {
      throw new Error("user is required");
    }

    if (!accountId) {
      throw new Error("account is required");
    }

    if (!categoryId) {
      throw new Error("category is required");
    }

    if (!description) {
      throw new Error("description is required");
    }

    const amount = Money.fromPositiveCents(input.amountInCents);

    if (input.type !== "income" && input.type !== "expense") {
      throw new Error("transaction type is invalid");
    }

    if (!validPaymentMethods.includes(paymentMethod)) {
      throw new Error("payment method is invalid");
    }

    if (!(input.occurredAt instanceof Date) || Number.isNaN(input.occurredAt.getTime())) {
      throw new Error("occurredAt date is invalid");
    }

    return new Transaction({
      ...input,
      userId,
      accountId,
      categoryId,
      description,
      amountInCents: amount.amountInCents,
      paymentMethod
    });
  }
}

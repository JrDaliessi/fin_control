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

export type RestoreTransactionInput = CreateTransactionInput & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

const validPaymentMethods: readonly PaymentMethod[] = [
  "manual",
  "pix",
  "cash",
  "debit"
];

function copyValidDate(value: Date, field: string): Date {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    throw new Error(`${field} date is invalid`);
  }

  return new Date(value);
}

const occurredAtByTransaction = new WeakMap<Transaction, Date>();
const createdAtByTransaction = new WeakMap<Transaction, Date>();
const updatedAtByTransaction = new WeakMap<Transaction, Date>();

export class Transaction {
  readonly id?: string;
  readonly userId: string;
  readonly accountId: string;
  readonly categoryId: string;
  readonly description: string;
  readonly amountInCents: number;
  readonly type: TransactionType;
  readonly occurredAt!: Date;
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
    this.paymentMethod = props.paymentMethod ?? "manual";
    this.notes = props.notes;
    occurredAtByTransaction.set(this, new Date(props.occurredAt));

    if (props.createdAt) {
      createdAtByTransaction.set(this, new Date(props.createdAt));
    }

    if (props.updatedAt) {
      updatedAtByTransaction.set(this, new Date(props.updatedAt));
    }

    Object.defineProperties(this, {
      occurredAt: {
        enumerable: true,
        get: () => new Date(occurredAtByTransaction.get(this) as Date)
      },
      createdAt: {
        enumerable: true,
        get: () => {
          const value = createdAtByTransaction.get(this);
          return value ? new Date(value) : undefined;
        }
      },
      updatedAt: {
        enumerable: true,
        get: () => {
          const value = updatedAtByTransaction.get(this);
          return value ? new Date(value) : undefined;
        }
      }
    });
  }

  static create(input: CreateTransactionInput): Transaction {
    const userId = input.userId.trim();
    const accountId = input.accountId.trim();
    const categoryId = input.categoryId.trim();
    const description = input.description.trim();
    const notes = input.notes?.trim() || undefined;
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

    if (description.length > 160) {
      throw new Error("description is too long");
    }

    if (notes && notes.length > 1000) {
      throw new Error("notes are too long");
    }

    const amount = Money.fromPositiveCents(input.amountInCents);

    if (input.type !== "income" && input.type !== "expense") {
      throw new Error("transaction type is invalid");
    }

    if (!validPaymentMethods.includes(paymentMethod as PaymentMethod)) {
      throw new Error("payment method is invalid");
    }

    const occurredAt = copyValidDate(input.occurredAt, "occurredAt");

    return new Transaction({
      ...input,
      userId,
      accountId,
      categoryId,
      description,
      amountInCents: amount.amountInCents,
      paymentMethod,
      occurredAt,
      notes
    });
  }

  static restore(input: RestoreTransactionInput): Transaction {
    const id = input.id.trim();

    if (!id) {
      throw new Error("transaction id is required");
    }

    const createdAt = copyValidDate(input.createdAt, "createdAt");
    const updatedAt = copyValidDate(input.updatedAt, "updatedAt");
    const transaction = Transaction.create(input);

    return new Transaction({
      id,
      userId: transaction.userId,
      accountId: transaction.accountId,
      categoryId: transaction.categoryId,
      description: transaction.description,
      amountInCents: transaction.amountInCents,
      type: transaction.type,
      occurredAt: transaction.occurredAt,
      paymentMethod: transaction.paymentMethod,
      notes: transaction.notes,
      createdAt,
      updatedAt
    });
  }
}

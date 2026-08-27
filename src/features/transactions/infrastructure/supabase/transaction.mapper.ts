import {
  Transaction,
  type PaymentMethod,
  type TransactionType
} from "../../domain/entities/transaction.entity";

export type TransactionRow = {
  id: string;
  user_id: string;
  account_id: string;
  category_id: string;
  description: string;
  amount_in_cents: number;
  type: TransactionType;
  payment_method: PaymentMethod;
  occurred_on: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type TransactionInsert = Pick<
  TransactionRow,
  | "user_id"
  | "account_id"
  | "category_id"
  | "description"
  | "amount_in_cents"
  | "type"
  | "payment_method"
  | "occurred_on"
> & {
  notes?: string;
};

function mapDateToCivilDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export function mapTransactionRowToDomain(row: TransactionRow): Transaction {
  if (!Number.isSafeInteger(row.amount_in_cents)) {
    throw new Error("transaction amount is unsafe");
  }

  return Transaction.restore({
    id: row.id,
    userId: row.user_id,
    accountId: row.account_id,
    categoryId: row.category_id,
    description: row.description,
    amountInCents: row.amount_in_cents,
    type: row.type,
    paymentMethod: row.payment_method,
    occurredAt: new Date(`${row.occurred_on}T00:00:00.000Z`),
    notes: row.notes ?? undefined,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at)
  });
}

export function mapTransactionToInsert(
  transaction: Transaction
): TransactionInsert {
  return {
    user_id: transaction.userId,
    account_id: transaction.accountId,
    category_id: transaction.categoryId,
    description: transaction.description,
    amount_in_cents: transaction.amountInCents,
    type: transaction.type,
    payment_method: transaction.paymentMethod,
    occurred_on: mapDateToCivilDate(transaction.occurredAt),
    notes: transaction.notes
  };
}

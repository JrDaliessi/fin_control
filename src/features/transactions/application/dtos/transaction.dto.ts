import type {
  CreateTransactionInput,
  Transaction
} from "../../domain/entities/transaction.entity";
import type { MonthlySummary } from "../use-cases/list-monthly-summary.use-case";

export type CreateTransactionRequest = Omit<
  CreateTransactionInput,
  "occurredAt" | "userId"
> & {
  occurredOn: string;
};

export type TransactionDto = {
  id: string;
  accountId: string;
  categoryId: string;
  description: string;
  amountInCents: number;
  type: Transaction["type"];
  paymentMethod: Transaction["paymentMethod"];
  occurredOn: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type TransactionAccountOptionDto = {
  id: string;
  name: string;
};

export type TransactionCategoryOptionDto = {
  id: string;
  name: string;
  kind: Transaction["type"];
};

export type TransactionsPageDataDto = {
  monthRef: string;
  accounts: readonly TransactionAccountOptionDto[];
  categories: readonly TransactionCategoryOptionDto[];
  transactions: readonly TransactionDto[];
  summary: MonthlySummary;
};

export function toTransactionDto(transaction: Transaction): TransactionDto {
  if (!transaction.id || !transaction.createdAt || !transaction.updatedAt) {
    throw new Error("persisted transaction metadata is required");
  }

  return {
    id: transaction.id,
    accountId: transaction.accountId,
    categoryId: transaction.categoryId,
    description: transaction.description,
    amountInCents: transaction.amountInCents,
    type: transaction.type,
    paymentMethod: transaction.paymentMethod,
    occurredOn: transaction.occurredAt.toISOString().slice(0, 10),
    notes: transaction.notes,
    createdAt: transaction.createdAt.toISOString(),
    updatedAt: transaction.updatedAt.toISOString()
  };
}

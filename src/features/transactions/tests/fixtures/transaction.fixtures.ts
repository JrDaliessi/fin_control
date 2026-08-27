import type { CreateTransactionInput } from "../../domain/entities/transaction.entity";

export const transactionUserId = "11111111-1111-4111-8111-111111111111";
export const transactionAccountId = "22222222-2222-4222-8222-222222222222";
export const transactionCategoryId = "33333333-3333-4333-8333-333333333333";
export const transactionId = "44444444-4444-4444-8444-444444444444";

export const validTransactionInput: CreateTransactionInput = {
  userId: transactionUserId,
  accountId: transactionAccountId,
  categoryId: transactionCategoryId,
  description: "Mercado",
  amountInCents: 12550,
  type: "expense",
  paymentMethod: "pix",
  occurredAt: new Date("2026-07-08T00:00:00.000Z"),
  notes: "Compra do mês"
};

export const persistedTransactionRow = {
  id: transactionId,
  user_id: transactionUserId,
  account_id: transactionAccountId,
  category_id: transactionCategoryId,
  description: "Mercado",
  amount_in_cents: 12550,
  type: "expense" as const,
  payment_method: "pix" as const,
  occurred_on: "2026-07-08",
  notes: "Compra do mês",
  created_at: "2026-07-08T12:01:00.000Z",
  updated_at: "2026-07-08T12:01:00.000Z"
};

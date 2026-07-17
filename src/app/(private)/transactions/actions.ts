"use server";

import { ListAccountsUseCase } from "@/features/accounts/application/use-cases/list-accounts.use-case";
import { SupabaseAccountRepository } from "@/features/accounts/infrastructure/repositories/supabase-account.repository";
import { ListCategoriesUseCase } from "@/features/categories/application/use-cases/list-categories.use-case";
import { SupabaseCategoryRepository } from "@/features/categories/infrastructure/repositories/supabase-category.repository";
import {
  toTransactionAccountOptionDto,
  toTransactionCategoryOptionDto,
  toTransactionDto,
  type CreateTransactionRequest,
  type TransactionDto,
  type TransactionsPageDataDto
} from "@/features/transactions/application/dtos/transaction.dto";
import { CreateTransactionUseCase } from "@/features/transactions/application/use-cases/create-transaction.use-case";
import { calculateMonthlySummary } from "@/features/transactions/application/use-cases/list-monthly-summary.use-case";
import { ListTransactionsByMonthUseCase } from "@/features/transactions/application/use-cases/list-transactions-by-month.use-case";
import { SupabaseTransactionRepository } from "@/features/transactions/infrastructure/repositories/supabase-transaction.repository";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CreateTransactionActionInput = CreateTransactionRequest;

export async function createTransactionAction(
  input: CreateTransactionActionInput
): Promise<TransactionDto> {
  const { supabaseClient, userId } = await createVerifiedTransactionContext();
  const transactionRepository = new SupabaseTransactionRepository({
    supabaseClient
  });
  const createTransaction = new CreateTransactionUseCase({
    transactionRepository
  });
  const occurredAt = parseCivilDate(input.occurredOn);
  const { occurredOn: _occurredOn, ...request } = input;
  void _occurredOn;
  const transaction = await createTransaction.execute({
    ...request,
    occurredAt,
    userId
  });

  const { revalidatePath } = await import("next/cache");
  revalidatePath("/transactions");

  return toTransactionDto(transaction);
}

export async function loadTransactionsPageAction(input: {
  monthRef: string;
}): Promise<TransactionsPageDataDto> {
  const { supabaseClient, userId } = await createVerifiedTransactionContext();
  const accountRepository = new SupabaseAccountRepository({ supabaseClient });
  const categoryRepository = new SupabaseCategoryRepository({ supabaseClient });
  const transactionRepository = new SupabaseTransactionRepository({
    supabaseClient
  });
  const listAccounts = new ListAccountsUseCase({ accountRepository });
  const listCategories = new ListCategoriesUseCase({ categoryRepository });
  const listTransactions = new ListTransactionsByMonthUseCase({
    transactionRepository
  });

  const [accounts, categories, transactions] = await Promise.all([
    listAccounts.execute({ userId }),
    listCategories.execute({ userId }),
    listTransactions.execute({ userId, monthRef: input.monthRef })
  ]);
  const summary = calculateMonthlySummary({
    monthRef: input.monthRef,
    transactions
  });

  return {
    monthRef: summary.monthRef,
    accounts: accounts.map(toTransactionAccountOptionDto),
    categories: categories.map(toTransactionCategoryOptionDto),
    transactions: transactions.map(toTransactionDto),
    summary
  };
}

async function createVerifiedTransactionContext() {
  const supabaseClient = await createSupabaseServerClient();
  const { data, error } = await supabaseClient.auth.getClaims();
  const claims = data?.claims;

  if (
    error ||
    typeof claims?.sub !== "string" ||
    !claims.sub.trim() ||
    claims.is_anonymous === true
  ) {
    throw new Error("authentication required");
  }

  return {
    supabaseClient,
    userId: claims.sub.trim()
  };
}

function parseCivilDate(value: string): Date {
  if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(value)) {
    throw new Error("transaction date is invalid");
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error("transaction date is invalid");
  }

  return date;
}

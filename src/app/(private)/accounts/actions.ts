"use server";

import { CreateAccountUseCase } from "@/features/accounts/application/use-cases/create-account.use-case";
import {
  toFinancialAccountDto,
  type CreateAccountRequest,
  type FinancialAccountDto
} from "@/features/accounts/application/dtos/financial-account.dto";
import { ListAccountsUseCase } from "@/features/accounts/application/use-cases/list-accounts.use-case";
import { SupabaseAccountRepository } from "@/features/accounts/infrastructure/repositories/supabase-account.repository";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CreateAccountActionInput = CreateAccountRequest;

export async function createAccountAction(
  input: CreateAccountActionInput
): Promise<FinancialAccountDto> {
  const { supabaseClient, userId } = await createVerifiedAccountContext();
  const accountRepository = new SupabaseAccountRepository({
    supabaseClient
  });
  const createAccount = new CreateAccountUseCase({ accountRepository });
  const account = await createAccount.execute({
    ...input,
    userId
  });

  const { revalidatePath } = await import("next/cache");
  revalidatePath("/accounts");

  return toFinancialAccountDto(account);
}

export async function listAccountsAction(): Promise<
  readonly FinancialAccountDto[]
> {
  const { supabaseClient, userId } = await createVerifiedAccountContext();
  const accountRepository = new SupabaseAccountRepository({
    supabaseClient
  });
  const listAccounts = new ListAccountsUseCase({ accountRepository });
  const accounts = await listAccounts.execute({ userId });

  return accounts.map(toFinancialAccountDto);
}

async function createVerifiedAccountContext() {
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

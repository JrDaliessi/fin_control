"use server";

import { CreateAccountUseCase } from "@/features/accounts/application/use-cases/create-account.use-case";
import type { CreateFinancialAccountInput } from "@/features/accounts/domain/entities/financial-account.entity";
import { SupabaseAccountRepository } from "@/features/accounts/infrastructure/repositories/supabase-account.repository";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CreateAccountActionInput = Omit<
  CreateFinancialAccountInput,
  "userId"
>;

export async function createAccountAction(
  input: CreateAccountActionInput
): Promise<void> {
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

  const accountRepository = new SupabaseAccountRepository({
    supabaseClient
  });
  const createAccount = new CreateAccountUseCase({ accountRepository });

  await createAccount.execute({
    ...input,
    userId: claims.sub
  });

  const { revalidatePath } = await import("next/cache");
  revalidatePath("/accounts");
}

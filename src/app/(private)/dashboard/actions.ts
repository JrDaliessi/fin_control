"use server";

import type { FinancialInterval } from "@/features/financial-analytics/domain/services/validate-financial-interval";
import { ListFinancialIntervalStatementUseCase } from "@/features/financial-analytics/application/use-cases/list-financial-interval-statement.use-case";
import {
  SupabaseFinancialIntervalStatementQueryRepository,
  type FinancialIntervalStatementSupabaseClient
} from "@/features/financial-analytics/infrastructure/repositories/supabase-financial-interval-statement-query.repository";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function loadFinancialIntervalStatementAction(
  input: FinancialInterval
) {
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

  const statementRepository =
    new SupabaseFinancialIntervalStatementQueryRepository({
      supabaseClient:
        supabaseClient as unknown as FinancialIntervalStatementSupabaseClient
    });
  const listStatement = new ListFinancialIntervalStatementUseCase({
    statementRepository
  });

  return listStatement.execute({
    ...input,
    userId: claims.sub.trim()
  });
}

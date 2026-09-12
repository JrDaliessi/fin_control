import { ListFinancialEvolutionUseCase } from "@/features/financial-analytics/application/use-cases/list-financial-evolution.use-case";
import { DEFAULT_FINANCIAL_TIME_ZONE } from "@/features/financial-analytics/application/config/financial-time-zone";
import type { FinancialPeriodKind } from "@/features/financial-analytics/domain/types/financial-period.types";
import { SupabaseFinancialAnalyticsQueryRepository } from "@/features/financial-analytics/infrastructure/repositories/supabase-financial-analytics-query.repository";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type LoadFinancialEvolutionInput = Readonly<{
  kind: FinancialPeriodKind;
  from?: string;
  to?: string;
  referenceInstant?: string;
}>;

export async function loadFinancialEvolution({
  kind,
  from,
  to,
  referenceInstant = new Date().toISOString()
}: LoadFinancialEvolutionInput) {
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

  const repository = new SupabaseFinancialAnalyticsQueryRepository({
    supabaseClient
  });
  const listFinancialEvolution = new ListFinancialEvolutionUseCase({
    financialAnalyticsQueryRepository: repository
  });

  return listFinancialEvolution.execute({
    userId: claims.sub.trim(),
    kind,
    from,
    to,
    referenceInstant,
    timeZone: DEFAULT_FINANCIAL_TIME_ZONE
  });
}

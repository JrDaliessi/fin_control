import type {
  FinancialAnalyticsQueryRepository,
  LoadEvolutionSnapshotInput
} from "../../application/ports/financial-analytics-query.repository";
import type { FinancialEvolutionSnapshot } from "../../domain/types/financial-evolution.types";
import {
  mapFinancialEvolutionSnapshotRows,
  type FinancialEvolutionSnapshotRow
} from "../supabase/financial-evolution-snapshot.mapper";

type SupabaseRpcResult = Readonly<{
  data: readonly FinancialEvolutionSnapshotRow[] | null;
  error: unknown;
}>;

type FinancialAnalyticsSupabaseClient = Readonly<{
  rpc(
    functionName: string,
    parameters: Readonly<{ p_start_on: string; p_end_on: string }>
  ): Promise<SupabaseRpcResult>;
}>;

type SupabaseFinancialAnalyticsQueryRepositoryDependencies = Readonly<{
  supabaseClient: FinancialAnalyticsSupabaseClient;
}>;

const repositoryErrorMessage = "financial analytics repository unavailable";

export class SupabaseFinancialAnalyticsQueryRepository
  implements FinancialAnalyticsQueryRepository
{
  private readonly supabaseClient: FinancialAnalyticsSupabaseClient;

  constructor({
    supabaseClient
  }: SupabaseFinancialAnalyticsQueryRepositoryDependencies) {
    this.supabaseClient = supabaseClient;
  }

  async loadEvolutionSnapshot(
    input: LoadEvolutionSnapshotInput
  ): Promise<FinancialEvolutionSnapshot> {
    try {
      const { data, error } = await this.supabaseClient.rpc(
        "load_financial_evolution_snapshot",
        {
          p_start_on: input.startOnInclusive,
          p_end_on: input.endOnExclusive
        }
      );

      if (error || !data) {
        throw new Error(repositoryErrorMessage);
      }

      return mapFinancialEvolutionSnapshotRows(data);
    } catch {
      throw new Error(repositoryErrorMessage);
    }
  }
}

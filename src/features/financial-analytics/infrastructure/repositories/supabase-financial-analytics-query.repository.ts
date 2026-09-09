import type {
  FinancialAnalyticsQueryRepository,
  LoadEvolutionBucketsInput,
  LoadEvolutionSnapshotInput
} from "../../application/ports/financial-analytics-query.repository";
import type {
  FinancialEvolutionBucketSnapshot,
  FinancialEvolutionSnapshot
} from "../../domain/types/financial-evolution.types";
import {
  mapFinancialEvolutionBucketRows,
  type FinancialEvolutionBucketRow
} from "../supabase/financial-evolution-buckets.mapper";
import {
  mapFinancialEvolutionSnapshotRows,
  type FinancialEvolutionSnapshotRow
} from "../supabase/financial-evolution-snapshot.mapper";

type SupabaseRpcResult = Readonly<{
  data:
    | readonly FinancialEvolutionSnapshotRow[]
    | readonly FinancialEvolutionBucketRow[]
    | null;
  error: unknown;
}>;

type FinancialAnalyticsSupabaseClient = Readonly<{
  rpc(
    functionName: string,
    parameters: Readonly<{
      p_start_on: string;
      p_end_on: string;
      p_bucket?: "week" | "month";
    }>
  ): PromiseLike<SupabaseRpcResult>;
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

      return mapFinancialEvolutionSnapshotRows(
        data as readonly FinancialEvolutionSnapshotRow[]
      );
    } catch {
      throw new Error(repositoryErrorMessage);
    }
  }

  async loadEvolutionBuckets(
    input: LoadEvolutionBucketsInput
  ): Promise<FinancialEvolutionBucketSnapshot> {
    try {
      if (
        input.bucketGranularity !== "week" &&
        input.bucketGranularity !== "month"
      ) {
        throw new Error(repositoryErrorMessage);
      }

      const { data, error } = await this.supabaseClient.rpc(
        "load_financial_evolution_buckets",
        {
          p_start_on: input.startOnInclusive,
          p_end_on: input.endOnExclusive,
          p_bucket: input.bucketGranularity
        }
      );

      if (error || !data) {
        throw new Error(repositoryErrorMessage);
      }

      return mapFinancialEvolutionBucketRows(
        data as readonly FinancialEvolutionBucketRow[]
      );
    } catch {
      throw new Error(repositoryErrorMessage);
    }
  }
}

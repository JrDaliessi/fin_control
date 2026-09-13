import type {
  FinancialAnalyticsQueryRepository,
  FinancialHistoryStartQueryRepository,
  LoadFinancialHistoryStartInput,
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
    | string
    | null;
  error: unknown;
}>;

type FinancialAnalyticsRpc = {
  bivarianceHack(
    functionName: string,
    parameters?: Readonly<{
      p_start_on: string;
      p_end_on: string;
      p_bucket?: "week" | "month" | "quarter" | "year";
    }>
  ): PromiseLike<SupabaseRpcResult>;
}["bivarianceHack"];

type FinancialAnalyticsSupabaseClient = Readonly<{
  rpc: FinancialAnalyticsRpc;
}>;

type SupabaseFinancialAnalyticsQueryRepositoryDependencies = Readonly<{
  supabaseClient: FinancialAnalyticsSupabaseClient;
}>;

const repositoryErrorMessage = "financial analytics repository unavailable";

export class SupabaseFinancialAnalyticsQueryRepository
  implements
    FinancialAnalyticsQueryRepository,
    FinancialHistoryStartQueryRepository
{
  private readonly supabaseClient: FinancialAnalyticsSupabaseClient;

  constructor({
    supabaseClient
  }: SupabaseFinancialAnalyticsQueryRepositoryDependencies) {
    this.supabaseClient = supabaseClient;
  }

  async loadFinancialHistoryStart(
    input: LoadFinancialHistoryStartInput
  ): Promise<string | null> {
    void input.userId;

    try {
      const { data, error } = await this.supabaseClient.rpc(
        "load_financial_history_start"
      );

      if (
        error ||
        (data !== null &&
          (typeof data !== "string" ||
            !/^\d{4}-\d{2}-\d{2}$/.test(data)))
      ) {
        throw new Error(repositoryErrorMessage);
      }

      return data;
    } catch {
      throw new Error(repositoryErrorMessage);
    }
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
        input.bucketGranularity !== "month" &&
        input.bucketGranularity !== "quarter" &&
        input.bucketGranularity !== "year"
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

import type {
  FinancialEvolutionBucketSnapshot,
  FinancialEvolutionSnapshot
} from "../../domain/types/financial-evolution.types";
import type { FinancialBucketGranularity } from "../../domain/types/financial-period.types";

export type LoadEvolutionSnapshotInput = Readonly<{
  userId: string;
  startOnInclusive: string;
  endOnExclusive: string;
}>;

export type LoadEvolutionBucketsInput = Readonly<{
  userId: string;
  startOnInclusive: string;
  endOnExclusive: string;
  bucketGranularity: Exclude<FinancialBucketGranularity, "day">;
}>;

export type LoadFinancialHistoryStartInput = Readonly<{
  userId: string;
}>;

export interface FinancialHistoryStartQueryRepository {
  loadFinancialHistoryStart(
    input: LoadFinancialHistoryStartInput
  ): Promise<string | null>;
}

export interface FinancialAnalyticsQueryRepository {
  loadEvolutionSnapshot(
    input: LoadEvolutionSnapshotInput
  ): Promise<FinancialEvolutionSnapshot>;

  loadEvolutionBuckets(
    input: LoadEvolutionBucketsInput
  ): Promise<FinancialEvolutionBucketSnapshot>;
}

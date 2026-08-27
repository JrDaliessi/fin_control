import type { FinancialEvolutionSnapshot } from "../../domain/types/financial-evolution.types";

export type LoadEvolutionSnapshotInput = Readonly<{
  userId: string;
  startOnInclusive: string;
  endOnExclusive: string;
}>;

export interface FinancialAnalyticsQueryRepository {
  loadEvolutionSnapshot(
    input: LoadEvolutionSnapshotInput
  ): Promise<FinancialEvolutionSnapshot>;
}

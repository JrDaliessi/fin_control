import type { FinancialMovementType } from "../../domain/types/financial-evolution.types";

export type FinancialIntervalStatementQueryInput = Readonly<{
  userId: string;
  startOnInclusive: string;
  endOnExclusive: string;
}>;

export type FinancialIntervalStatementItem = Readonly<{
  id: string;
  description: string;
  amountInCents: number;
  type: FinancialMovementType;
  occurredOn: string;
  createdAt: string;
}>;

export interface FinancialIntervalStatementQueryRepository {
  listByInterval(
    input: FinancialIntervalStatementQueryInput
  ): Promise<readonly FinancialIntervalStatementItem[]>;
}

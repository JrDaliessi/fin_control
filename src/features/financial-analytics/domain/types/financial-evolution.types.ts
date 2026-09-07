export type FinancialMovementType = "income" | "expense";

export type FinancialMovementProjection = Readonly<{
  id: string;
  occurredOn: string;
  createdAt: string;
  type: FinancialMovementType;
  amountInCents: number;
}>;

export type FinancialEvolutionPoint = Readonly<{
  startOnInclusive: string;
  endOnExclusive: string;
  incomeInCents: number;
  expenseInCents: number;
  netInCents: number;
  closingBalanceInCents: number;
  transactionCount: number;
}>;

export type FinancialCandle = Readonly<{
  startOnInclusive: string;
  endOnExclusive: string;
  openInCents: number;
  highInCents: number;
  lowInCents: number;
  closeInCents: number;
  incomeInCents: number;
  expenseInCents: number;
  volumeInCents: number;
  transactionCount: number;
}>;

export type FinancialEvolutionSnapshot = Readonly<{
  accountCount: number;
  openingBalanceInCents: number;
  movements: readonly FinancialMovementProjection[];
}>;

export type FinancialEvolutionBucketSnapshot = Readonly<{
  accountCount: number;
  buckets: readonly FinancialCandle[];
}>;

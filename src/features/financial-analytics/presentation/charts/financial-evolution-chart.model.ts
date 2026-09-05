export type FinancialEvolutionChartPoint = Readonly<{
  civilDate: string;
  closingBalanceInCents: number;
}>;

export type FinancialEvolutionChartModel = Readonly<{
  startOnInclusive: string;
  endOnExclusive: string;
  points: readonly FinancialEvolutionChartPoint[];
}>;

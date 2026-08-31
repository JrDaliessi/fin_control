export type FinancialCandlestickChartPoint = Readonly<{
  civilDate: string;
  openInCents: number;
  highInCents: number;
  lowInCents: number;
  closeInCents: number;
  incomeInCents: number;
  expenseInCents: number;
  volumeInCents: number;
  transactionCount: number;
}>;

export type FinancialCandlestickChartModel = Readonly<{
  startOnInclusive: string;
  endOnExclusive: string;
  points: readonly FinancialCandlestickChartPoint[];
}>;

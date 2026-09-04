import type { FinancialEvolutionDto } from "../../application/use-cases/list-financial-evolution.use-case";
import type { FinancialCandlestickChartModel } from "./financial-candlestick-chart.model";

export function toFinancialCandlestickChartModel(
  evolution: FinancialEvolutionDto
): FinancialCandlestickChartModel {
  return {
    startOnInclusive: evolution.period.startOnInclusive,
    endOnExclusive: evolution.period.endOnExclusive,
    points: evolution.candles.map((candle) => ({
      civilDate: candle.startOnInclusive,
      endOnExclusive: candle.endOnExclusive,
      openInCents: candle.openInCents,
      highInCents: candle.highInCents,
      lowInCents: candle.lowInCents,
      closeInCents: candle.closeInCents,
      incomeInCents: candle.incomeInCents,
      expenseInCents: candle.expenseInCents,
      volumeInCents: candle.volumeInCents,
      transactionCount: candle.transactionCount
    }))
  };
}

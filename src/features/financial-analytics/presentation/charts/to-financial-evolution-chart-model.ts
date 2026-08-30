import type { FinancialEvolutionDto } from "../../application/use-cases/list-financial-evolution.use-case";
import type { FinancialEvolutionChartModel } from "./financial-evolution-chart.model";

export function toFinancialEvolutionChartModel(
  evolution: FinancialEvolutionDto
): FinancialEvolutionChartModel {
  return {
    startOnInclusive: evolution.period.startOnInclusive,
    endOnExclusive: evolution.period.endOnExclusive,
    points: evolution.points.map((point) => ({
      civilDate: point.startOnInclusive,
      closingBalanceInCents: point.closingBalanceInCents
    }))
  };
}

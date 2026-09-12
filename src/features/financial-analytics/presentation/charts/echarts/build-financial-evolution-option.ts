import type { LineSeriesOption } from "echarts/charts";
import type {
  AriaComponentOption,
  GridComponentOption,
  TooltipComponentOption
} from "echarts/components";
import type { ComposeOption } from "echarts/core";
import { formatCents } from "@/shared/utils/formatCents";
import { formatFinancialCivilDayMonth } from "../../formatters/format-financial-civil-date";
import type { FinancialEvolutionChartModel } from "../financial-evolution-chart.model";

export type FinancialEvolutionChartTheme = Readonly<{
  foreground: string;
  mutedForeground: string;
  primary: string;
  surface: string;
  border: string;
}>;

export type FinancialEvolutionChartOption = ComposeOption<
  | AriaComponentOption
  | GridComponentOption
  | LineSeriesOption
  | TooltipComponentOption
>;

type BuildFinancialEvolutionOptionInput = Readonly<{
  model: FinancialEvolutionChartModel;
  reducedMotion: boolean;
  theme: FinancialEvolutionChartTheme;
}>;

export function buildFinancialEvolutionOption({
  model,
  reducedMotion,
  theme
}: BuildFinancialEvolutionOptionInput): FinancialEvolutionChartOption {
  return {
    animation: !reducedMotion,
    aria: {
      enabled: true,
      decal: { show: true }
    },
    grid: {
      bottom: 16,
      containLabel: true,
      left: 8,
      right: 16,
      top: 16
    },
    tooltip: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      textStyle: { color: theme.foreground },
      trigger: "axis",
      valueFormatter: (value) => formatCents(Number(value))
    },
    xAxis: {
      axisLabel: {
        color: theme.mutedForeground,
        formatter: (value: string) => formatFinancialCivilDayMonth(value)
      },
      axisLine: { lineStyle: { color: theme.border } },
      boundaryGap: false,
      data: model.points.map((point) => point.civilDate),
      type: "category"
    },
    yAxis: {
      axisLabel: {
        color: theme.mutedForeground,
        formatter: (value: number) => formatCents(value)
      },
      axisLine: { lineStyle: { color: theme.border } },
      splitLine: { lineStyle: { color: theme.border } },
      type: "value"
    },
    series: [
      {
        data: model.points.map((point) => point.closingBalanceInCents),
        itemStyle: { color: theme.primary },
        lineStyle: { color: theme.primary, width: 3 },
        name: "Saldo",
        showSymbol: false,
        type: "line"
      }
    ]
  };
}

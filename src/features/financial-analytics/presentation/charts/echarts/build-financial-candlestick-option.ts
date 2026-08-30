import type { CandlestickSeriesOption } from "echarts/charts";
import type {
  AriaComponentOption,
  GridComponentOption,
  TooltipComponentOption
} from "echarts/components";
import type { ComposeOption } from "echarts/core";
import { formatCents } from "@/shared/utils/formatCents";
import type { FinancialCandlestickChartModel } from "../financial-candlestick-chart.model";

export type FinancialCandlestickChartTheme = Readonly<{
  border: string;
  expense: string;
  foreground: string;
  income: string;
  mutedForeground: string;
  surface: string;
}>;

export type FinancialCandlestickChartOption = ComposeOption<
  | AriaComponentOption
  | CandlestickSeriesOption
  | GridComponentOption
  | TooltipComponentOption
>;

type BuildFinancialCandlestickOptionInput = Readonly<{
  model: FinancialCandlestickChartModel;
  reducedMotion: boolean;
  theme: FinancialCandlestickChartTheme;
}>;

function formatCivilDate(civilDate: string) {
  const [, month, day] = civilDate.split("-");
  return `${day}/${month}`;
}

export function buildFinancialCandlestickOption({
  model,
  reducedMotion,
  theme
}: BuildFinancialCandlestickOptionInput): FinancialCandlestickChartOption {
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
      trigger: "axis"
    },
    xAxis: {
      axisLabel: {
        color: theme.mutedForeground,
        formatter: (value: string) => formatCivilDate(value)
      },
      axisLine: { lineStyle: { color: theme.border } },
      boundaryGap: true,
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
        data: model.points.map((point) => [
          point.openInCents,
          point.closeInCents,
          point.lowInCents,
          point.highInCents
        ]),
        itemStyle: {
          color: theme.income,
          color0: theme.expense,
          borderColor: theme.income,
          borderColor0: theme.expense
        },
        name: "Variação do saldo",
        type: "candlestick"
      }
    ]
  };
}

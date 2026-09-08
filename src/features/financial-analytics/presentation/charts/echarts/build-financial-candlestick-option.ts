import type { CandlestickSeriesOption } from "echarts/charts";
import type {
  AriaComponentOption,
  GridComponentOption,
  TooltipComponentOption
} from "echarts/components";
import type { ComposeOption } from "echarts/core";
import { formatCents } from "@/shared/utils/formatCents";
import {
  formatFinancialCivilDate,
  formatFinancialCivilDayMonth
} from "../../formatters/format-financial-civil-date";
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

function describeVariation(
  openInCents: number,
  closeInCents: number
) {
  if (closeInCents > openInCents) {
    return "Alta";
  }

  if (closeInCents < openInCents) {
    return "Queda";
  }

  return "Estável";
}

function movementLabel(count: number) {
  return `${count} ${count === 1 ? "movimento" : "movimentos"}`;
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
      formatter: (parameters) => {
        const parameter = Array.isArray(parameters)
          ? parameters[0]
          : parameters;
        const point = model.points[parameter?.dataIndex ?? -1];

        if (!point) {
          return "Dados indisponíveis.";
        }

        return [
          `<strong>${formatFinancialCivilDate(point.civilDate)}</strong>`,
          `Abertura: ${formatCents(point.openInCents)}`,
          `Máxima: ${formatCents(point.highInCents)}`,
          `Mínima: ${formatCents(point.lowInCents)}`,
          `Fechamento: ${formatCents(point.closeInCents)}`,
          `Variação: ${describeVariation(
            point.openInCents,
            point.closeInCents
          )}`,
          `Volume: ${formatCents(point.volumeInCents)}`,
          movementLabel(point.transactionCount)
        ].join("<br />");
      },
      textStyle: { color: theme.foreground },
      trigger: "axis"
    },
    xAxis: {
      axisLabel: {
        color: theme.mutedForeground,
        formatter: (value: string) => formatFinancialCivilDayMonth(value)
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

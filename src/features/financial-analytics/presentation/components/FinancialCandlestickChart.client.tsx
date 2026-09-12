"use client";

import { useCallback, useId } from "react";
import { ExpandableChartFrame } from "@/shared/components/charts/ExpandableChartFrame.client";
import type { FinancialBucketGranularity } from "../../domain/types/financial-period.types";
import type { FinancialCandlestickChartModel } from "../charts/financial-candlestick-chart.model";
import { getFinancialBucketCopy } from "../config/financial-bucket-copy";
import {
  buildFinancialCandlestickOption,
  type FinancialCandlestickChartTheme
} from "../charts/echarts/build-financial-candlestick-option";
import {
  useFinancialChart,
  type FinancialChartVisualPreferences
} from "../hooks/useFinancialChart";

type FinancialCandlestickChartProps = Readonly<{
  bucketGranularity?: FinancialBucketGranularity;
  model: FinancialCandlestickChartModel;
  onSelectInterval?: (interval: Readonly<{
    startOnInclusive: string;
    endOnExclusive: string;
  }>) => void;
}>;

const FORCED_COLORS_THEME: FinancialCandlestickChartTheme = {
  border: "CanvasText",
  expense: "CanvasText",
  foreground: "CanvasText",
  income: "Highlight",
  mutedForeground: "CanvasText",
  surface: "Canvas"
};

function resolveCssColor(name: string, fallback: string) {
  const channels = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();

  return channels ? `rgb(${channels})` : fallback;
}

function resolveChartTheme(
  forcedColors: boolean
): FinancialCandlestickChartTheme {
  if (forcedColors) {
    return FORCED_COLORS_THEME;
  }

  return {
    border: resolveCssColor("--border", "#e5e7eb"),
    expense: resolveCssColor("--expense", "#dc2626"),
    foreground: resolveCssColor("--foreground", "#111827"),
    income: resolveCssColor("--income", "#059669"),
    mutedForeground: resolveCssColor("--muted-foreground", "#4b5563"),
    surface: resolveCssColor("--surface", "#ffffff")
  };
}

export function FinancialCandlestickChart({
  bucketGranularity = "day",
  model,
  onSelectInterval
}: FinancialCandlestickChartProps) {
  const bucketCopy = getFinancialBucketCopy(bucketGranularity);
  const descriptionId = useId();
  const hasPoints = model.points.length > 0;
  const buildOption = useCallback(
    ({ forcedColors, reducedMotion }: FinancialChartVisualPreferences) => {
      return buildFinancialCandlestickOption({
        model,
        reducedMotion,
        theme: resolveChartTheme(forcedColors)
      });
    },
    [model]
  );
  const { attachChart, initializationFailed } = useFinancialChart({
    buildOption,
    enabled: hasPoints,
    onDataPointSelect: onSelectInterval
      ? (dataIndex) => {
          const point = model.points[dataIndex];

          if (point?.endOnExclusive) {
            onSelectInterval({
              startOnInclusive: point.civilDate,
              endOnExclusive: point.endOnExclusive
            });
          }
        }
      : undefined
  });

  if (!hasPoints) {
    return (
      <p className="text-sm text-muted-foreground" role="status">
        Não há dados para exibir no gráfico neste período.
      </p>
    );
  }

  if (initializationFailed) {
    return (
      <p className="text-sm text-muted-foreground" role="status">
        Não foi possível carregar o gráfico. Consulte a tabela de variação
        financeira.
      </p>
    );
  }

  return (
    <ExpandableChartFrame title="Variação do saldo">
      <div className="grid h-full min-h-0 min-w-0 gap-2">
        <p className="sr-only" id={descriptionId}>
          {onSelectInterval
            ? "Selecione um candle para abrir o extrato. Pelo teclado, use Ver extrato na tabela de variação financeira."
            : "Visualização complementar. Os mesmos valores permanecem disponíveis na tabela de variação financeira."}
        </p>
        <div
          aria-describedby={descriptionId}
          aria-label={`Variação do saldo por ${bucketCopy.singular}`}
          className="min-h-72 min-w-0 w-full group-data-[expanded=true]/chart-frame:min-h-0"
          role="img"
          style={{ height: "100%" }}
        >
          <div
            aria-hidden="true"
            className="h-full min-h-72 w-full group-data-[expanded=true]/chart-frame:min-h-0"
            ref={attachChart}
            style={{ height: "100%" }}
          />
        </div>
      </div>
    </ExpandableChartFrame>
  );
}

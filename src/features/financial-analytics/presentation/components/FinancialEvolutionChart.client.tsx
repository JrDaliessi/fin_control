"use client";

import { useCallback, useId } from "react";
import { ExpandableChartFrame } from "@/shared/components/charts/ExpandableChartFrame.client";
import type { FinancialBucketGranularity } from "../../domain/types/financial-period.types";
import type { FinancialEvolutionChartModel } from "../charts/financial-evolution-chart.model";
import { getFinancialBucketCopy } from "../config/financial-bucket-copy";
import {
  buildFinancialEvolutionOption,
  type FinancialEvolutionChartTheme
} from "../charts/echarts/build-financial-evolution-option";
import {
  useFinancialChart,
  type FinancialChartVisualPreferences
} from "../hooks/useFinancialChart";

type FinancialEvolutionChartProps = Readonly<{
  bucketGranularity?: FinancialBucketGranularity;
  model: FinancialEvolutionChartModel;
}>;

const FORCED_COLORS_THEME: FinancialEvolutionChartTheme = {
  border: "CanvasText",
  foreground: "CanvasText",
  mutedForeground: "CanvasText",
  primary: "Highlight",
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
): FinancialEvolutionChartTheme {
  if (forcedColors) {
    return FORCED_COLORS_THEME;
  }

  return {
    foreground: resolveCssColor("--foreground", "#111827"),
    mutedForeground: resolveCssColor("--muted-foreground", "#4b5563"),
    primary: resolveCssColor("--primary", "#0f766e"),
    surface: resolveCssColor("--surface", "#ffffff"),
    border: resolveCssColor("--border", "#e5e7eb")
  };
}

export function FinancialEvolutionChart({
  bucketGranularity = "day",
  model
}: FinancialEvolutionChartProps) {
  const bucketCopy = getFinancialBucketCopy(bucketGranularity);
  const descriptionId = useId();
  const hasPoints = model.points.length > 0;
  const buildOption = useCallback(
    ({ forcedColors, reducedMotion }: FinancialChartVisualPreferences) => {
      return buildFinancialEvolutionOption({
        model,
        reducedMotion,
        theme: resolveChartTheme(forcedColors)
      });
    },
    [model]
  );
  const { attachChart, initializationFailed } = useFinancialChart({
    buildOption,
    enabled: hasPoints
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
        Não foi possível carregar o gráfico. Consulte a tabela de evolução
        financeira.
      </p>
    );
  }

  return (
    <ExpandableChartFrame title="Evolução do saldo">
      <div className="grid h-full min-h-0 min-w-0 gap-2">
        <p className="sr-only" id={descriptionId}>
          Visualização complementar. Os mesmos valores permanecem disponíveis na
          tabela de evolução financeira.
        </p>
        <div
          aria-describedby={descriptionId}
          aria-label={`Evolução do saldo por ${bucketCopy.singular}`}
          className="min-h-72 min-w-0 w-full group-data-[expanded=true]/chart-frame:min-h-0"
          ref={attachChart}
          role="img"
          style={{ height: "100%" }}
        />
      </div>
    </ExpandableChartFrame>
  );
}

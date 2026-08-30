"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ExpandableChartFrame } from "@/shared/components/charts/ExpandableChartFrame.client";
import type { FinancialCandlestickChartModel } from "../charts/financial-candlestick-chart.model";
import {
  buildFinancialCandlestickOption,
  type FinancialCandlestickChartTheme
} from "../charts/echarts/build-financial-candlestick-option";
import {
  initializeFinancialEvolutionChart,
  type FinancialEvolutionChartInstance
} from "../charts/echarts/echarts-client";

type FinancialCandlestickChartProps = Readonly<{
  model: FinancialCandlestickChartModel;
}>;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const FORCED_COLORS_QUERY = "(forced-colors: active)";
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

function resolveChartTheme(): FinancialCandlestickChartTheme {
  if (window.matchMedia(FORCED_COLORS_QUERY).matches) {
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
  model
}: FinancialCandlestickChartProps) {
  const chartRef = useRef<FinancialEvolutionChartInstance | null>(null);
  const [initializationFailed, setInitializationFailed] = useState(false);
  const descriptionId = useId();
  const hasPoints = model.points.length > 0;

  const attachChart = useCallback((container: HTMLDivElement | null) => {
    if (!container) {
      return;
    }

    let chart: FinancialEvolutionChartInstance | undefined;
    let resizeObserver: ResizeObserver | undefined;

    try {
      chart = initializeFinancialEvolutionChart(container, { renderer: "svg" });
      chartRef.current = chart;
      resizeObserver = new ResizeObserver(() => chart?.resize());
      resizeObserver.observe(container);
    } catch {
      resizeObserver?.disconnect();
      chart?.dispose();

      if (chartRef.current === chart) {
        chartRef.current = null;
      }

      setInitializationFailed(true);
      return;
    }

    const initializedChart = chart;
    const initializedResizeObserver = resizeObserver;

    return () => {
      initializedResizeObserver.disconnect();
      initializedChart.dispose();

      if (chartRef.current === initializedChart) {
        chartRef.current = null;
      }
    };
  }, []);

  const applyCurrentOption = useCallback(() => {
    const chart = chartRef.current;

    if (!chart) {
      return;
    }

    chart.setOption(
      buildFinancialCandlestickOption({
        model,
        reducedMotion: window.matchMedia(REDUCED_MOTION_QUERY).matches,
        theme: resolveChartTheme()
      })
    );
  }, [model]);

  useEffect(() => {
    applyCurrentOption();
  }, [applyCurrentOption]);

  useEffect(() => {
    if (!hasPoints) {
      return;
    }

    const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const forcedColorsQuery = window.matchMedia(FORCED_COLORS_QUERY);
    const handleVisualPreferenceChange = () => applyCurrentOption();
    const themeObserver = new MutationObserver(applyCurrentOption);
    themeObserver.observe(document.documentElement, {
      attributeFilter: ["data-theme"],
      attributes: true
    });

    reducedMotionQuery.addEventListener("change", handleVisualPreferenceChange);
    forcedColorsQuery.addEventListener("change", handleVisualPreferenceChange);

    return () => {
      themeObserver.disconnect();
      reducedMotionQuery.removeEventListener(
        "change",
        handleVisualPreferenceChange
      );
      forcedColorsQuery.removeEventListener(
        "change",
        handleVisualPreferenceChange
      );
    };
  }, [applyCurrentOption, hasPoints]);

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
          Visualização complementar. Os mesmos valores permanecem disponíveis na
          tabela de variação financeira.
        </p>
        <div
          aria-describedby={descriptionId}
          aria-label="Variação do saldo por dia"
          className="min-h-72 min-w-0 w-full group-data-[expanded=true]/chart-frame:min-h-0"
          ref={attachChart}
          role="img"
          style={{ height: "100%" }}
        />
      </div>
    </ExpandableChartFrame>
  );
}

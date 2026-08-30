"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ExpandableChartFrame } from "@/shared/components/charts/ExpandableChartFrame.client";
import type { FinancialEvolutionChartModel } from "../charts/financial-evolution-chart.model";
import {
  buildFinancialEvolutionOption,
  type FinancialEvolutionChartTheme
} from "../charts/echarts/build-financial-evolution-option";
import {
  initializeFinancialEvolutionChart,
  type FinancialEvolutionChartInstance
} from "../charts/echarts/echarts-client";

type FinancialEvolutionChartProps = Readonly<{
  model: FinancialEvolutionChartModel;
}>;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const FORCED_COLORS_QUERY = "(forced-colors: active)";
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

function resolveChartTheme(): FinancialEvolutionChartTheme {
  if (window.matchMedia(FORCED_COLORS_QUERY).matches) {
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
  model
}: FinancialEvolutionChartProps) {
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
      chart = initializeFinancialEvolutionChart(container, {
        renderer: "svg"
      });
      chartRef.current = chart;

      resizeObserver = new ResizeObserver(() => {
        chart?.resize();
      });
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
      buildFinancialEvolutionOption({
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
    const handleVisualPreferenceChange = () => {
      applyCurrentOption();
    };
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
        Não foi possível carregar o gráfico. Consulte a tabela de evolução
        financeira.
      </p>
    );
  }

  return (
    <ExpandableChartFrame title="Evolução do saldo">
      <div className="grid h-full min-h-0 gap-2">
        <p className="sr-only" id={descriptionId}>
          Visualização complementar. Os mesmos valores permanecem disponíveis na
          tabela de evolução financeira.
        </p>
        <div
          aria-describedby={descriptionId}
          aria-label="Evolução do saldo por dia"
          className="min-h-72 w-full"
          ref={attachChart}
          role="img"
          style={{ height: "100%" }}
        />
      </div>
    </ExpandableChartFrame>
  );
}

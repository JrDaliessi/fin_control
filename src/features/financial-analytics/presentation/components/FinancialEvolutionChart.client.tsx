"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
const DESCRIPTION_ID = "financial-evolution-chart-description";

function resolveCssColor(name: string, fallback: string) {
  const channels = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();

  return channels ? `rgb(${channels})` : fallback;
}

function resolveChartTheme(): FinancialEvolutionChartTheme {
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

  const attachChart = useCallback((container: HTMLDivElement | null) => {
    if (!container) {
      return;
    }

    let chart: FinancialEvolutionChartInstance;

    try {
      chart = initializeFinancialEvolutionChart(container, {
        renderer: "svg"
      });
    } catch {
      setInitializationFailed(true);
      return;
    }

    chartRef.current = chart;

    const resizeObserver = new ResizeObserver(() => {
      chartRef.current?.resize();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
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

  return (
    <div className="grid gap-2">
      <p className="sr-only" id={DESCRIPTION_ID}>
        Visualização complementar. Os mesmos valores permanecem disponíveis na
        tabela de evolução financeira.
      </p>
      {initializationFailed ? (
        <p className="text-sm text-muted-foreground" role="status">
          Não foi possível carregar o gráfico. Consulte a tabela de evolução
          financeira.
        </p>
      ) : (
        <div
          aria-describedby={DESCRIPTION_ID}
          aria-label="Evolução do saldo por dia"
          className="min-h-72 w-full"
          ref={attachChart}
          role="img"
        />
      )}
    </div>
  );
}

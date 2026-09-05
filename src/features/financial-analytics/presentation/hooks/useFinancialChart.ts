"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FinancialCandlestickChartOption } from "../charts/echarts/build-financial-candlestick-option";
import type { FinancialEvolutionChartOption } from "../charts/echarts/build-financial-evolution-option";
import {
  initializeFinancialEvolutionChart,
  type FinancialChartClickHandler,
  type FinancialEvolutionChartInstance
} from "../charts/echarts/echarts-client";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const FORCED_COLORS_QUERY = "(forced-colors: active)";

export type FinancialChartVisualPreferences = Readonly<{
  forcedColors: boolean;
  reducedMotion: boolean;
}>;

type FinancialChartOption =
  | FinancialEvolutionChartOption
  | FinancialCandlestickChartOption;

type UseFinancialChartInput = Readonly<{
  buildOption: (
    preferences: FinancialChartVisualPreferences
  ) => FinancialChartOption;
  enabled: boolean;
  onDataPointSelect?: (dataIndex: number) => void;
}>;

export function useFinancialChart({
  buildOption,
  enabled,
  onDataPointSelect
}: UseFinancialChartInput) {
  const chartRef = useRef<FinancialEvolutionChartInstance | null>(null);
  const onDataPointSelectRef = useRef(onDataPointSelect);
  const [initializationFailed, setInitializationFailed] = useState(false);
  const selectionEnabled = typeof onDataPointSelect === "function";

  useEffect(() => {
    onDataPointSelectRef.current = onDataPointSelect;
  }, [onDataPointSelect]);

  const attachChart = useCallback(
    (container: HTMLDivElement | null) => {
      if (!container) {
        return;
      }

      let chart: FinancialEvolutionChartInstance | undefined;
      let resizeObserver: ResizeObserver | undefined;
      let handleClick: FinancialChartClickHandler | undefined;

      try {
        chart = initializeFinancialEvolutionChart(container, {
          renderer: "svg"
        });
        chartRef.current = chart;

        if (selectionEnabled) {
          handleClick = ({ dataIndex }) => {
            if (Number.isInteger(dataIndex) && dataIndex >= 0) {
              onDataPointSelectRef.current?.(dataIndex);
            }
          };
          chart.on("click", handleClick);
        }

        resizeObserver = new ResizeObserver(() => {
          chart?.resize();
        });
        resizeObserver.observe(container);
      } catch {
        resizeObserver?.disconnect();
        if (handleClick) {
          chart?.off("click", handleClick);
        }
        chart?.dispose();

        if (chartRef.current === chart) {
          chartRef.current = null;
        }

        setInitializationFailed(true);
        return;
      }

      const initializedChart = chart;
      const initializedResizeObserver = resizeObserver;
      const initializedClickHandler = handleClick;

      return () => {
        initializedResizeObserver.disconnect();
        if (initializedClickHandler) {
          initializedChart.off("click", initializedClickHandler);
        }
        initializedChart.dispose();

        if (chartRef.current === initializedChart) {
          chartRef.current = null;
        }
      };
    },
    [selectionEnabled]
  );

  const applyCurrentOption = useCallback(() => {
    const chart = chartRef.current;

    if (!chart) {
      return;
    }

    chart.setOption(
      buildOption({
        forcedColors: window.matchMedia(FORCED_COLORS_QUERY).matches,
        reducedMotion: window.matchMedia(REDUCED_MOTION_QUERY).matches
      })
    );
  }, [buildOption]);

  useEffect(() => {
    applyCurrentOption();
  }, [applyCurrentOption]);

  useEffect(() => {
    if (!enabled) {
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
  }, [applyCurrentOption, enabled]);

  return {
    attachChart,
    initializationFailed
  };
}

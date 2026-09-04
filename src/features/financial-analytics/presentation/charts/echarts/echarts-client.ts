import { CandlestickChart, LineChart } from "echarts/charts";
import {
  AriaComponent,
  GridComponent,
  TooltipComponent
} from "echarts/components";
import { init, use as registerEChartsModules } from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
import type { FinancialEvolutionChartOption } from "./build-financial-evolution-option";
import type { FinancialCandlestickChartOption } from "./build-financial-candlestick-option";

registerEChartsModules([
  LineChart,
  CandlestickChart,
  AriaComponent,
  GridComponent,
  TooltipComponent,
  SVGRenderer
]);

export type FinancialEvolutionChartInstance = Readonly<{
  setOption: (
    option: FinancialEvolutionChartOption | FinancialCandlestickChartOption
  ) => void;
  resize: () => void;
  dispose: () => void;
  on: (eventName: "click", handler: FinancialChartClickHandler) => void;
  off: (eventName: "click", handler: FinancialChartClickHandler) => void;
}>;

export type FinancialChartClickHandler = (
  event: Readonly<{ dataIndex: number }>
) => void;

type InitializeFinancialEvolutionChartOptions = Readonly<{
  renderer: "svg";
}>;

export function initializeFinancialEvolutionChart(
  container: HTMLElement,
  options: InitializeFinancialEvolutionChartOptions
): FinancialEvolutionChartInstance {
  const chart = init(container, undefined, options);

  return {
    setOption: (option) => chart.setOption(option),
    resize: () => chart.resize(),
    dispose: () => chart.dispose(),
    on: (eventName, handler) => chart.on(eventName, handler as never),
    off: (eventName, handler) => chart.off(eventName, handler as never)
  };
}

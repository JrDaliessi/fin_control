"use client";

import { useState } from "react";
import type { FinancialCandle, FinancialEvolutionPoint } from "../../domain/types/financial-evolution.types";
import { Card } from "@/shared/components/ui/Card";
import type { FinancialCandlestickChartModel } from "../charts/financial-candlestick-chart.model";
import type { FinancialEvolutionChartModel } from "../charts/financial-evolution-chart.model";
import { FinancialCandlesTable } from "./FinancialCandlesTable";
import { FinancialCandlestickChart } from "./FinancialCandlestickChart.client";
import { FinancialEvolutionChart } from "./FinancialEvolutionChart.client";
import { FinancialEvolutionTable } from "./FinancialEvolutionTable";

type FinancialVisualizationSwitcherProps = Readonly<{
  evolutionModel: FinancialEvolutionChartModel;
  candlestickModel: FinancialCandlestickChartModel;
  evolutionPoints: readonly FinancialEvolutionPoint[];
  candles: readonly FinancialCandle[];
}>;

type VisualizationMode = "evolution" | "candlestick";

export function FinancialVisualizationSwitcher({
  evolutionModel,
  candlestickModel,
  evolutionPoints,
  candles
}: FinancialVisualizationSwitcherProps) {
  const [mode, setMode] = useState<VisualizationMode>("evolution");
  const showsEvolution = mode === "evolution";

  return (
    <div className="grid gap-4">
      <div
        aria-label="Visualização financeira"
        className="flex w-full flex-col gap-2 rounded-xl bg-surface-muted p-1 sm:w-fit sm:flex-row"
        role="group"
      >
        <button
          aria-pressed={showsEvolution}
          className="min-h-11 rounded-lg px-4 py-2 text-sm font-semibold text-foreground transition-colors aria-pressed:bg-surface aria-pressed:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          onClick={() => setMode("evolution")}
          type="button"
        >
          Evolução do saldo
        </button>
        <button
          aria-pressed={!showsEvolution}
          className="min-h-11 rounded-lg px-4 py-2 text-sm font-semibold text-foreground transition-colors aria-pressed:bg-surface aria-pressed:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          onClick={() => setMode("candlestick")}
          type="button"
        >
          Variação do saldo
        </button>
      </div>

      {showsEvolution ? (
        <>
          <Card className="grid gap-3">
            <div className="grid gap-1">
              <h3 className="text-lg font-semibold text-foreground">
                Evolução do saldo
              </h3>
              <p className="text-sm text-muted-foreground">
                Saldo ao fim de cada dia do período selecionado.
              </p>
            </div>
            <FinancialEvolutionChart model={evolutionModel} />
          </Card>
          <FinancialEvolutionTable points={evolutionPoints} />
        </>
      ) : (
        <>
          <Card className="grid gap-3">
            <div className="grid gap-1">
              <h3 className="text-lg font-semibold text-foreground">
                Variação do saldo
              </h3>
              <p className="text-sm text-muted-foreground">
                Abertura, extremos e fechamento do saldo em cada dia.
              </p>
            </div>
            <FinancialCandlestickChart model={candlestickModel} />
          </Card>
          <FinancialCandlesTable candles={candles} />
        </>
      )}
    </div>
  );
}

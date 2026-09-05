"use client";

import { useId, useState } from "react";
import type {
  FinancialCandle,
  FinancialEvolutionPoint
} from "../../domain/types/financial-evolution.types";
import { Card } from "@/shared/components/ui/Card";
import type { FinancialCandlestickChartModel } from "../charts/financial-candlestick-chart.model";
import type { FinancialEvolutionChartModel } from "../charts/financial-evolution-chart.model";
import { FinancialCandlesTable } from "./FinancialCandlesTable";
import { FinancialCandlestickChart } from "./FinancialCandlestickChart.client";
import { FinancialEvolutionChart } from "./FinancialEvolutionChart.client";
import { FinancialEvolutionTable } from "./FinancialEvolutionTable";
import {
  FinancialIntervalStatementPanel,
  type FinancialIntervalStatementLoader
} from "./FinancialIntervalStatementPanel.client";

type FinancialVisualizationSwitcherProps = Readonly<{
  evolutionModel: FinancialEvolutionChartModel;
  candlestickModel: FinancialCandlestickChartModel;
  evolutionPoints: readonly FinancialEvolutionPoint[];
  candles: readonly FinancialCandle[];
  loadStatement?: FinancialIntervalStatementLoader;
}>;

type VisualizationMode = "evolution" | "candlestick";

export function FinancialVisualizationSwitcher({
  evolutionModel,
  candlestickModel,
  evolutionPoints,
  candles,
  loadStatement
}: FinancialVisualizationSwitcherProps) {
  const [mode, setMode] = useState<VisualizationMode>("evolution");
  const [selectedCandle, setSelectedCandle] = useState<FinancialCandle | null>(
    null
  );
  const showsEvolution = mode === "evolution";
  const evolutionButtonId = useId();
  const candlestickButtonId = useId();
  const contentId = useId();
  const activeButtonId = showsEvolution
    ? evolutionButtonId
    : candlestickButtonId;

  return (
    <div className="grid gap-4">
      <div
        aria-label="Visualização financeira"
        className="flex w-full flex-col gap-2 rounded-xl bg-surface-muted p-1 sm:w-fit sm:flex-row"
        role="group"
      >
        <button
          aria-controls={contentId}
          aria-pressed={showsEvolution}
          className="min-h-11 rounded-lg px-4 py-2 text-sm font-semibold text-foreground transition-colors aria-pressed:bg-surface aria-pressed:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          id={evolutionButtonId}
          onClick={() => {
            setMode("evolution");
            setSelectedCandle(null);
          }}
          type="button"
        >
          Evolução do saldo
        </button>
        <button
          aria-controls={contentId}
          aria-pressed={!showsEvolution}
          className="min-h-11 rounded-lg px-4 py-2 text-sm font-semibold text-foreground transition-colors aria-pressed:bg-surface aria-pressed:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          id={candlestickButtonId}
          onClick={() => setMode("candlestick")}
          type="button"
        >
          Variação do saldo
        </button>
      </div>

      <div
        aria-labelledby={activeButtonId}
        className="grid gap-4"
        id={contentId}
        role="region"
      >
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
              {loadStatement ? (
                <p className="text-xs text-muted-foreground">
                  Selecione um candle no gráfico ou use Ver extrato na tabela.
                </p>
              ) : null}
            </div>
            <FinancialCandlestickChart
              model={candlestickModel}
              onSelectInterval={
                loadStatement
                  ? (interval) => {
                      const candle = candles.find(
                        (item) =>
                          item.startOnInclusive === interval.startOnInclusive &&
                          item.endOnExclusive === interval.endOnExclusive
                      );

                      if (candle) {
                        setSelectedCandle(candle);
                      }
                    }
                  : undefined
              }
            />
          </Card>
          <FinancialCandlesTable
            candles={candles}
            onSelectInterval={loadStatement ? setSelectedCandle : undefined}
          />
          </>
        )}
      </div>

      {loadStatement ? (
        <FinancialIntervalStatementPanel
          loadStatement={loadStatement}
          onClose={() => setSelectedCandle(null)}
          selectedCandle={selectedCandle}
        />
      ) : null}
    </div>
  );
}

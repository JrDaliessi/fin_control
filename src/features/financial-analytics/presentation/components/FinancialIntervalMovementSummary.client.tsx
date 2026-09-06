"use client";

import { useId, useState } from "react";
import type {
  FinancialIntervalAnalysis,
  FinancialIntervalInsight
} from "../../domain/services/analyze-financial-interval";
import { formatCents } from "@/shared/utils/formatCents";

type FinancialIntervalMovementSummaryProps = Readonly<{
  analysis: FinancialIntervalAnalysis;
}>;

function movementLabel(count: number) {
  return `${count} ${count === 1 ? "movimento" : "movimentos"}`;
}

function insightLabel(insight: FinancialIntervalInsight): string {
  if (insight.kind === "empty") {
    return "Nenhuma movimentação foi registrada neste intervalo.";
  }

  if (insight.kind === "composition") {
    if (insight.dominantType === "balanced") {
      return `O volume ficou equilibrado: ${insight.incomePercentage}% em receitas e ${insight.expensePercentage}% em despesas.`;
    }

    const percentage =
      insight.dominantType === "income"
        ? insight.incomePercentage
        : insight.expensePercentage;
    const movementType =
      insight.dominantType === "income" ? "receitas" : "despesas";

    return `${percentage}% do volume correspondeu a ${movementType}.`;
  }

  if (insight.direction === "neutral") {
    return "O intervalo terminou com resultado líquido neutro.";
  }

  return `O intervalo terminou com resultado ${insight.direction === "positive" ? "positivo" : "negativo"} de ${formatCents(Math.abs(insight.amountInCents))}.`;
}

function resultLabel(analysis: FinancialIntervalAnalysis): string {
  const netInsight = analysis.insights.find(
    (insight) => insight.kind === "net"
  );

  if (!netInsight) {
    return "Sem movimentação";
  }

  if (netInsight.direction === "neutral") {
    return "Neutro";
  }

  return netInsight.direction === "positive" ? "Positivo" : "Negativo";
}

export function FinancialIntervalMovementSummary({
  analysis
}: FinancialIntervalMovementSummaryProps) {
  const [isAnalysisExpanded, setIsAnalysisExpanded] = useState(false);
  const titleId = useId();
  const analysisId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className="grid gap-4 rounded-xl border border-border bg-surface-muted p-4"
    >
      <div>
        <h3 className="font-semibold text-foreground" id={titleId}>
          Movimentação no intervalo
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          O volume soma receitas e despesas e não representa o resultado líquido.
        </p>
        <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{movementLabel(analysis.summary.transactionCount)}</span>
          <span aria-hidden="true">·</span>
          <span className="rounded-full border border-border bg-surface px-2 py-1 font-medium text-foreground">
            {resultLabel(analysis)}
          </span>
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        {[
          ["Volume movimentado", analysis.summary.volumeInCents],
          ["Resultado líquido", analysis.summary.netInCents],
          ["Receitas", analysis.summary.incomeInCents],
          ["Despesas", analysis.summary.expenseInCents]
        ].map(([label, value]) => (
          <div className="min-w-0" key={label}>
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="mt-1 break-words font-semibold tabular-nums text-foreground">
              {formatCents(Number(value))}
            </dd>
          </div>
        ))}
      </dl>

      <button
        aria-controls={analysisId}
        aria-expanded={isAnalysisExpanded}
        className="min-h-11 w-full rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        onClick={() => setIsAnalysisExpanded((current) => !current)}
        type="button"
      >
        {isAnalysisExpanded ? "Ocultar análise" : "Ver análise do intervalo"}
      </button>

      {isAnalysisExpanded ? (
        <div className="rounded-lg bg-surface p-3" id={analysisId}>
          <ul className="grid gap-2 text-sm text-foreground">
            {analysis.insights.map((insight) => (
              <li key={insight.kind}>{insightLabel(insight)}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

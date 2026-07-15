import type { MonthlySummary } from "../../application/use-cases/list-monthly-summary.use-case";
import { formatCents } from "@/shared/utils/formatCents";
import { formatMonthRef } from "@/shared/utils/formatMonthRef";

export type MonthlySummaryPanelStatus = "loading" | "success" | "error";

type MonthlySummaryPanelProps = {
  errorMessage?: string;
  status: MonthlySummaryPanelStatus;
  summary: MonthlySummary | null;
};

export function MonthlySummaryPanel({
  errorMessage,
  status,
  summary
}: MonthlySummaryPanelProps) {
  return (
    <section
      aria-busy={status === "loading"}
      aria-labelledby="monthly-summary-title"
      aria-live="polite"
      className="grid gap-3 rounded-md border border-border bg-surface p-4 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-semibold text-foreground" id="monthly-summary-title">
          Resumo mensal
        </h2>
        {summary ? (
          <p className="text-sm text-muted-foreground">
            Competência {formatMonthRef(summary.monthRef)}
          </p>
        ) : null}
      </div>

      {status === "loading" ? (
        <p className="text-sm text-muted-foreground" role="status">
          Calculando resumo mensal.
        </p>
      ) : null}

      {status === "error" ? (
        <p className="rounded-md bg-danger-surface px-3 py-2 text-sm text-danger-foreground" role="alert">
          {errorMessage ?? "Não foi possível calcular o resumo mensal."}
        </p>
      ) : null}

      {status === "success" && summary?.transactionCount === 0 ? (
        <p
          className="rounded-md border border-dashed border-border bg-surface-muted p-3 text-sm text-muted-foreground"
          role="status"
        >
          Nenhuma transação no mês selecionado.
        </p>
      ) : null}

      {status === "success" && summary && summary.transactionCount > 0 ? (
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SummaryMetric
            label="Receitas"
            value={formatCents(summary.incomeTotalInCents)}
          />
          <SummaryMetric
            label="Despesas"
            value={formatCents(summary.expenseTotalInCents)}
          />
          <SummaryMetric
            label="Saldo líquido"
            value={formatCents(summary.netBalanceInCents)}
          />
          <SummaryMetric
            label="Transações"
            value={summary.transactionCount.toString()}
          />
        </dl>
      ) : null}
    </section>
  );
}

type SummaryMetricProps = {
  label: string;
  value: string;
};

function SummaryMetric({ label, value }: SummaryMetricProps) {
  return (
    <div
      aria-label={`${label}: ${value}`}
      className="grid min-h-20 content-between rounded-md border border-border bg-surface-muted p-3"
      role="group"
    >
      <dt className="text-xs font-medium uppercase text-muted-foreground">{label}</dt>
      <dd className="text-base font-semibold text-foreground">{value}</dd>
    </div>
  );
}

import type { MonthlySummary } from "../../../transactions/application/use-cases/list-monthly-summary.use-case";
import { formatCents } from "@/shared/utils/formatCents";
import { formatMonthRef } from "@/shared/utils/formatMonthRef";

type DashboardSummaryPanelProps = {
  summary: MonthlySummary;
};

export function DashboardSummaryPanel({
  summary
}: DashboardSummaryPanelProps) {
  return (
    <section
      aria-labelledby="dashboard-summary-title"
      className="grid gap-4 rounded-md border border-border bg-surface p-4 shadow-sm"
    >
      <div>
        <h2
          className="text-lg font-semibold text-foreground"
          id="dashboard-summary-title"
        >
          Resumo financeiro do mês
        </h2>
        <p className="text-sm text-muted-foreground">
          Competência {formatMonthRef(summary.monthRef)}
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
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
      className="grid min-h-20 content-between border-l-2 border-primary bg-surface-muted p-3"
      role="group"
    >
      <dt className="text-xs font-medium uppercase text-muted-foreground">{label}</dt>
      <dd className="text-base font-semibold text-foreground">{value}</dd>
    </div>
  );
}

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
      className="grid gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div>
        <h2
          className="text-lg font-semibold text-slate-950"
          id="dashboard-summary-title"
        >
          Resumo financeiro do mês
        </h2>
        <p className="text-sm text-slate-600">
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
      className="grid min-h-20 content-between border-l-2 border-primary bg-slate-50 p-3"
      role="group"
    >
      <dt className="text-xs font-medium uppercase text-slate-600">{label}</dt>
      <dd className="text-base font-semibold text-slate-950">{value}</dd>
    </div>
  );
}

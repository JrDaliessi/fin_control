import Link from "next/link";
import type { FinancialEvolutionDto } from "../../application/use-cases/list-financial-evolution.use-case";
import type { FinancialPeriodKind } from "../../domain/types/financial-period.types";
import { Card } from "@/shared/components/ui/Card";
import { FeedbackMessage } from "@/shared/components/ui/FeedbackMessage";
import { formatCents } from "@/shared/utils/formatCents";
import { toFinancialEvolutionChartModel } from "../charts/to-financial-evolution-chart-model";
import { FinancialEvolutionChart } from "./FinancialEvolutionChart.client";
import { FinancialEvolutionTable } from "./FinancialEvolutionTable";
import { FinancialPeriodSelector } from "./FinancialPeriodSelector";

type FinancialEvolutionPanelProps = Readonly<{
  result: FinancialEvolutionDto;
  selectedPeriodKind: FinancialPeriodKind;
}>;

function movementLabel(count: number) {
  return `${count} ${count === 1 ? "movimento" : "movimentos"}`;
}

export function FinancialEvolutionPanel({
  result,
  selectedPeriodKind
}: FinancialEvolutionPanelProps) {
  const summaryItems = [
    {
      label: "Saldo ao fim do período",
      value: formatCents(result.summary.closingBalanceInCents),
      className: "col-span-12 p-5 sm:p-6 lg:col-span-6",
      valueClassName: "text-2xl sm:text-3xl"
    },
    {
      label: "Receitas",
      value: formatCents(result.summary.incomeInCents),
      className: "col-span-12 p-4 sm:col-span-6 lg:col-span-3",
      valueClassName: "text-lg"
    },
    {
      label: "Despesas",
      value: formatCents(result.summary.expenseInCents),
      className: "col-span-12 p-4 sm:col-span-6 lg:col-span-3",
      valueClassName: "text-lg"
    },
    {
      label: "Líquido",
      value: formatCents(result.summary.netInCents),
      className: "col-span-12 p-4 sm:col-span-6 lg:col-span-6",
      valueClassName: "text-lg"
    },
    {
      label: "Saldo inicial",
      value: formatCents(result.summary.openingBalanceInCents),
      className: "col-span-12 p-4 sm:col-span-6 lg:col-span-6",
      valueClassName: "text-lg"
    }
  ] as const;

  return (
    <section aria-labelledby="financial-evolution-title" className="mb-8 grid gap-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2
            className="text-xl font-semibold text-foreground sm:text-2xl"
            id="financial-evolution-title"
          >
            Como seu dinheiro evoluiu
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Acompanhe entradas, saídas e saldo consolidado por dia.
          </p>
        </div>
        <FinancialPeriodSelector selectedPeriodKind={selectedPeriodKind} />
      </div>

      {result.status === "missing_accounts" ? (
        <Card className="grid gap-4">
          <p className="text-sm text-muted-foreground" role="status">
            Cadastre uma conta para acompanhar sua evolução financeira.
          </p>
          <Link
            className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 sm:w-fit"
            href="/accounts"
          >
            Cadastrar conta
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4">
          {result.status === "empty" ? (
            <FeedbackMessage variant="status">
              Nenhuma movimentação neste período. Seus saldos continuam visíveis.
            </FeedbackMessage>
          ) : null}

          <dl className="grid grid-cols-12 gap-3">
            {summaryItems.map(({ className, label, value, valueClassName }) => (
              <Card
                aria-label={`${label}: ${value}`}
                className={`min-w-0 ${className}`}
                key={label}
                role="group"
              >
                <dt className="text-xs font-semibold uppercase text-muted-foreground">
                  {label}
                </dt>
                <dd
                  className={`mt-2 break-words font-semibold tabular-nums text-foreground ${valueClassName}`}
                >
                  {value}
                </dd>
              </Card>
            ))}
          </dl>

          <p className="text-sm text-muted-foreground">
            {movementLabel(result.summary.transactionCount)}
          </p>

          <Card className="grid gap-3">
            <div className="grid gap-1">
              <h3 className="text-lg font-semibold text-foreground">
                Evolução do saldo
              </h3>
              <p className="text-sm text-muted-foreground">
                Saldo ao fim de cada dia do período selecionado.
              </p>
            </div>
            <FinancialEvolutionChart
              model={toFinancialEvolutionChartModel(result)}
            />
          </Card>

          <FinancialEvolutionTable points={result.points} />
        </div>
      )}
    </section>
  );
}

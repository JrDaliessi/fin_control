import Link from "next/link";
import type { FinancialEvolutionDto } from "../../application/use-cases/list-financial-evolution.use-case";
import type { FinancialPeriodKind } from "../../domain/types/financial-period.types";
import { Card } from "@/shared/components/ui/Card";
import { FeedbackMessage } from "@/shared/components/ui/FeedbackMessage";
import { formatCents } from "@/shared/utils/formatCents";
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
    ["Saldo inicial", formatCents(result.summary.openingBalanceInCents)],
    ["Receitas", formatCents(result.summary.incomeInCents)],
    ["Despesas", formatCents(result.summary.expenseInCents)],
    ["Líquido", formatCents(result.summary.netInCents)],
    ["Saldo final", formatCents(result.summary.closingBalanceInCents)]
  ] as const;

  return (
    <section aria-labelledby="financial-evolution-title" className="mb-8 grid gap-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2
            className="text-xl font-semibold text-foreground sm:text-2xl"
            id="financial-evolution-title"
          >
            Evolução financeira
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
            className="inline-flex min-h-11 w-fit items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2"
            href="/accounts"
          >
            Cadastrar conta
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4">
          {result.status === "empty" ? (
            <FeedbackMessage variant="status">
              Nenhuma movimentação neste período. Os saldos diários continuam visíveis.
            </FeedbackMessage>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {summaryItems.map(([label, value]) => (
              <Card className="p-4" key={label}>
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  {label}
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground">{value}</p>
              </Card>
            ))}
          </div>

          <p className="text-sm text-muted-foreground">
            {movementLabel(result.summary.transactionCount)}
          </p>
          <FinancialEvolutionTable points={result.points} />
        </div>
      )}
    </section>
  );
}

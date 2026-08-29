import type { FinancialEvolutionPoint } from "../../domain/types/financial-evolution.types";
import { formatCents } from "@/shared/utils/formatCents";

type FinancialEvolutionTableProps = Readonly<{
  points: readonly FinancialEvolutionPoint[];
}>;

function formatCivilDate(civilDate: string) {
  const [year, month, day] = civilDate.split("-");
  return `${day}/${month}/${year}`;
}

export function FinancialEvolutionTable({
  points
}: FinancialEvolutionTableProps) {
  return (
    <div className="grid gap-2">
      <p
        className="text-xs text-muted-foreground sm:sr-only"
        id="financial-evolution-table-hint"
      >
        Deslize horizontalmente ou use as setas do teclado para consultar todas
        as colunas.
      </p>
      <div
        aria-describedby="financial-evolution-table-hint"
        aria-label="Evolução financeira por dia"
        className="touch-pan-x overflow-x-auto overscroll-x-contain rounded-xl border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2"
        role="region"
        tabIndex={0}
      >
        <table className="w-full min-w-[48rem] border-collapse text-sm">
          <caption className="sr-only">Evolução financeira por dia</caption>
          <thead className="bg-surface-muted text-left text-muted-foreground">
            <tr>
              {[
                "Dia",
                "Receitas",
                "Despesas",
                "Líquido",
                "Saldo",
                "Movimentos"
              ].map((heading) => (
                <th className="px-4 py-3 font-semibold" key={heading} scope="col">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {points.map((point) => (
              <tr key={point.startOnInclusive}>
                <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">
                  {formatCivilDate(point.startOnInclusive)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 tabular-nums text-income">
                  {formatCents(point.incomeInCents)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 tabular-nums text-expense">
                  {formatCents(point.expenseInCents)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 tabular-nums text-foreground">
                  {formatCents(point.netInCents)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-medium tabular-nums text-foreground">
                  {formatCents(point.closingBalanceInCents)}
                </td>
                <td className="px-4 py-3 tabular-nums text-foreground">
                  {point.transactionCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

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
    <div className="overflow-x-auto rounded-xl border border-border">
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
              <td className="whitespace-nowrap px-4 py-3 text-income">
                {formatCents(point.incomeInCents)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-expense">
                {formatCents(point.expenseInCents)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-foreground">
                {formatCents(point.netInCents)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">
                {formatCents(point.closingBalanceInCents)}
              </td>
              <td className="px-4 py-3 text-foreground">
                {point.transactionCount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

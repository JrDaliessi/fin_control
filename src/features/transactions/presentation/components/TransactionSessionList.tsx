import type { TransactionDto } from "../../application/dtos/transaction.dto";
import { formatCents } from "@/shared/utils/formatCents";

type TransactionListProps = {
  monthRef: string;
  transactions: readonly TransactionDto[];
};

function formatMonthRef(monthRef: string): string {
  const [year, month] = monthRef.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

export function TransactionList({
  monthRef,
  transactions
}: TransactionListProps) {
  const periodLabel = formatMonthRef(monthRef);

  return (
    <section
      aria-labelledby="transactions-title"
      aria-live="polite"
      aria-relevant="additions text"
      className="grid content-start gap-3"
    >
      <h2
        className="text-lg font-semibold text-foreground"
        id="transactions-title"
      >
        Transações de {periodLabel}
      </h2>

      {transactions.length === 0 ? (
        <div
          className="rounded-md border border-dashed border-border bg-surface p-4 text-sm text-muted-foreground"
          role="status"
        >
          Nenhuma transação encontrada neste mês.
        </div>
      ) : (
        <ul className="grid gap-3">
          {transactions.map((transaction) => (
            <li
              aria-label={`${transaction.type === "income" ? "Receita" : "Despesa"}: ${transaction.description}, ${formatCents(transaction.amountInCents)}`}
              className="rounded-md border border-border bg-surface p-4 shadow-sm"
              key={transaction.id}
            >
              <div className="grid gap-2 sm:flex sm:items-start sm:justify-between sm:gap-4">
                <div className="min-w-0">
                  <p className="break-words font-medium text-foreground">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.type === "income" ? "Receita" : "Despesa"}
                  </p>
                </div>
                <p className="text-sm font-semibold text-foreground sm:text-right">
                  {formatCents(transaction.amountInCents)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

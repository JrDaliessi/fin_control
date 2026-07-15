import type { CreateTransactionInput } from "../../domain/entities/transaction.entity";
import { formatCents } from "@/shared/utils/formatCents";

type TransactionSessionListProps = {
  transactions: readonly CreateTransactionInput[];
};

export function TransactionSessionList({
  transactions
}: TransactionSessionListProps) {
  return (
    <section
      aria-labelledby="session-transactions-title"
      aria-live="polite"
      aria-relevant="additions text"
      className="grid content-start gap-3"
    >
      <h2
        className="text-lg font-semibold text-foreground"
        id="session-transactions-title"
      >
        Lançamentos desta sessão
      </h2>

      {transactions.length === 0 ? (
        <div
          className="rounded-md border border-dashed border-border bg-surface p-4 text-sm text-muted-foreground"
          role="status"
        >
          Nenhuma transação registrada nesta sessão.
        </div>
      ) : (
        <ul className="grid gap-3">
          {transactions.map((transaction, index) => (
            <li
              aria-label={`${transaction.type === "income" ? "Receita" : "Despesa"}: ${transaction.description}, ${formatCents(transaction.amountInCents)}`}
              className="rounded-md border border-border bg-surface p-4 shadow-sm"
              key={`${transaction.description}-${transaction.occurredAt.toISOString()}-${index}`}
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

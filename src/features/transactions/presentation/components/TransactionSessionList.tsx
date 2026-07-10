import type { CreateTransactionInput } from "../../domain/entities/transaction.entity";
import { formatCents } from "../utils/formatCents";

type TransactionSessionListProps = {
  transactions: CreateTransactionInput[];
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
        className="text-lg font-semibold text-slate-950"
        id="session-transactions-title"
      >
        Lançamentos desta sessão
      </h2>

      {transactions.length === 0 ? (
        <div
          className="rounded-md border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600"
          role="status"
        >
          Nenhuma transação registrada nesta sessão.
        </div>
      ) : (
        <ul className="grid gap-3">
          {transactions.map((transaction, index) => (
            <li
              aria-label={`${transaction.type === "income" ? "Receita" : "Despesa"}: ${transaction.description}, ${formatCents(transaction.amountInCents)}`}
              className="rounded-md border border-slate-200 bg-white p-4 shadow-sm"
              key={`${transaction.description}-${transaction.occurredAt.toISOString()}-${index}`}
            >
              <div className="grid gap-2 sm:flex sm:items-start sm:justify-between sm:gap-4">
                <div className="min-w-0">
                  <p className="break-words font-medium text-slate-950">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-slate-600">
                    {transaction.type === "income" ? "Receita" : "Despesa"}
                  </p>
                </div>
                <p className="text-sm font-semibold text-slate-950 sm:text-right">
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

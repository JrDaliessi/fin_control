import type { CreateTransactionInput } from "../../../transactions/domain/entities/transaction.entity";
import { formatCents } from "@/shared/utils/formatCents";

type RecentTransactionsListProps = {
  transactions: readonly CreateTransactionInput[];
};

const transactionDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  timeZone: "UTC"
});

export function RecentTransactionsList({
  transactions
}: RecentTransactionsListProps) {
  return (
    <section
      aria-labelledby="recent-transactions-title"
      className="grid content-start gap-3"
    >
      <div className="flex items-center justify-between gap-4">
        <h2
          className="text-lg font-semibold text-foreground"
          id="recent-transactions-title"
        >
          Últimas transações
        </h2>
        <span className="text-sm text-muted-foreground">
          {transactions.length} de 5
        </span>
      </div>

      <ul className="divide-y divide-border border-y border-border bg-surface">
        {transactions.map((transaction, index) => (
          <li
            className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 px-3 py-4"
            key={`${transaction.description}-${transaction.occurredAt.toISOString()}-${index}`}
          >
            <div className="min-w-0">
              <p className="break-words font-medium text-foreground">
                {transaction.description}
              </p>
              <p className="text-sm text-muted-foreground">
                {transaction.type === "income" ? "Receita" : "Despesa"}
                {" · "}
                {formatTransactionDate(transaction.occurredAt)}
              </p>
            </div>
            <p
              className={`text-sm font-semibold ${
                transaction.type === "income"
                  ? "text-primary"
                  : "text-foreground"
              }`}
            >
              {transaction.type === "expense" ? "-" : "+"}
              {formatCents(transaction.amountInCents)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function formatTransactionDate(date: Date) {
  return transactionDateFormatter.format(date);
}

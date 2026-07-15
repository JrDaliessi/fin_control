import type { FinancialAccountDto } from "../../application/dtos/financial-account.dto";
import type { FinancialAccountType } from "../../domain/entities/financial-account.entity";
import { formatCents } from "../../../../shared/utils/formatCents";

type AccountListProps = {
  accounts: readonly FinancialAccountDto[];
};

const accountTypeLabels: Record<FinancialAccountType, string> = {
  checking: "Conta corrente",
  savings: "Poupança",
  cash: "Dinheiro",
  payment: "Conta de pagamento",
  investment: "Investimento"
};

export function AccountList({ accounts }: AccountListProps) {
  return (
    <section
      aria-label="Suas contas"
      aria-live="polite"
      aria-relevant="additions text"
      className="rounded-md border border-border bg-surface p-4 shadow-sm sm:p-5"
    >
      <h2 className="text-lg font-semibold text-foreground">Suas contas</h2>

      {accounts.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground" role="status">
          Nenhuma conta cadastrada.
        </p>
      ) : (
        <ul className="mt-4 grid gap-3">
          {accounts.map((account) => (
            <li
              className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border p-3"
              key={account.id}
            >
              <div className="min-w-0 flex-1">
                <p className="break-words font-medium text-foreground">
                  {account.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {accountTypeLabels[account.type]}
                </p>
              </div>
              <p className="shrink-0 font-semibold text-foreground">
                {formatCents(account.initialBalanceInCents)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

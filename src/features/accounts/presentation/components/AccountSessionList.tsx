import type {
  FinancialAccount,
  FinancialAccountType
} from "../../domain/entities/financial-account.entity";
import { formatCents } from "../../../../shared/utils/formatCents";

type AccountSessionListProps = {
  accounts: readonly FinancialAccount[];
};

const accountTypeLabels: Record<FinancialAccountType, string> = {
  checking: "Conta corrente",
  savings: "Poupança",
  cash: "Dinheiro",
  payment: "Conta de pagamento",
  investment: "Investimento"
};

export function AccountSessionList({ accounts }: AccountSessionListProps) {
  return (
    <section
      aria-label="Contas desta sessão"
      aria-live="polite"
      className="rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <h2 className="text-lg font-semibold text-slate-950">
        Contas desta sessão
      </h2>

      {accounts.length === 0 ? (
        <p className="mt-3 text-sm text-slate-600" role="status">
          Nenhuma conta cadastrada nesta sessão.
        </p>
      ) : (
        <ul className="mt-4 grid gap-3">
          {accounts.map((account, index) => (
            <li
              className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-slate-200 p-3"
              key={`${account.userId}-${account.name}-${index}`}
            >
              <div>
                <p className="font-medium text-slate-950">{account.name}</p>
                <p className="text-sm text-slate-600">
                  {accountTypeLabels[account.type]}
                </p>
              </div>
              <p className="font-semibold text-slate-950">
                {formatCents(account.initialBalanceInCents)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

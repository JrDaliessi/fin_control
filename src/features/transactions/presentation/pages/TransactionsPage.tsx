"use client";

import { useState } from "react";
import type { CreateTransactionInput } from "../../domain/entities/transaction.entity";
import { MonthlySummaryPanel } from "../components/MonthlySummaryPanel";
import { TransactionForm } from "../components/TransactionForm";
import { TransactionSessionList } from "../components/TransactionSessionList";
import { useSessionMonthlySummary } from "../hooks/useSessionMonthlySummary";

const demoAccounts = [
  {
    id: "account-1",
    name: "Conta corrente"
  }
];

const demoCategories = [
  {
    id: "category-1",
    name: "Mercado"
  },
  {
    id: "category-2",
    name: "Salário"
  }
];

const demoUserId = "user-1";

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<CreateTransactionInput[]>([]);
  const monthlySummaryState = useSessionMonthlySummary({
    transactions,
    userId: demoUserId
  });

  async function handleCreateTransaction(input: CreateTransactionInput) {
    setTransactions((currentTransactions) => [input, ...currentTransactions]);
  }

  return (
    <main className="min-h-screen bg-background px-4 py-5 text-foreground sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-[minmax(0,430px)_1fr] lg:gap-8">
        <section className="grid content-start gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-primary sm:text-sm">
              Controle Financeiro IA
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-950 sm:text-3xl">
              Registrar transação manual
            </h1>
          </div>

          <TransactionForm
            accounts={demoAccounts}
            categories={demoCategories}
            onCreateTransaction={handleCreateTransaction}
            userId={demoUserId}
          />
        </section>

        <div className="grid content-start gap-4">
          <MonthlySummaryPanel
            errorMessage={monthlySummaryState.errorMessage}
            status={monthlySummaryState.status}
            summary={monthlySummaryState.summary}
          />

          <TransactionSessionList transactions={transactions} />
        </div>
      </div>
    </main>
  );
}

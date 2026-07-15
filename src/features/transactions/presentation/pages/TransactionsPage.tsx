"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAuthSession } from "@/features/auth/presentation/providers/AuthSessionProvider";
import type { CreateTransactionInput } from "../../domain/entities/transaction.entity";
import { MonthlySummaryPanel } from "../components/MonthlySummaryPanel";
import { TransactionForm } from "../components/TransactionForm";
import { TransactionSessionList } from "../components/TransactionSessionList";
import { useSessionMonthlySummary } from "../hooks/useSessionMonthlySummary";
import { useTransactionSession } from "../providers/TransactionSessionProvider";

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

export function TransactionsPage() {
  const { user } = useAuthSession();
  const { addTransaction, transactions } = useTransactionSession();
  const monthlySummaryState = useSessionMonthlySummary({
    transactions,
    userId: user.id
  });

  async function handleCreateTransaction(input: CreateTransactionInput) {
    await addTransaction(input);
  }

  return (
    <main className="min-h-screen bg-background px-4 py-5 text-foreground sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-[minmax(0,430px)_1fr] lg:gap-8">
        <section className="grid content-start gap-4">
          <div>
            <Link
              className="mb-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2"
              href="/"
            >
              <ArrowLeft aria-hidden="true" size={18} />
              Voltar ao dashboard
            </Link>
            <p className="text-xs font-semibold uppercase text-primary sm:text-sm">
              FinControl
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
              Registrar transação manual
            </h1>
          </div>

          <TransactionForm
            accounts={demoAccounts}
            categories={demoCategories}
            onCreateTransaction={handleCreateTransaction}
            userId={user.id}
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

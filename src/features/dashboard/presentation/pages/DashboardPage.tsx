"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useTransactionSession } from "../../../transactions/presentation/providers/TransactionSessionProvider";
import { DashboardSummaryPanel } from "../components/DashboardSummaryPanel";
import { DashboardEmptyState } from "../components/DashboardEmptyState";
import { RecentTransactionsList } from "../components/RecentTransactionsList";
import { useDashboardSummary } from "../hooks/useDashboardSummary";

const demoUserId = "user-1";

type DashboardPageProps = {
  userId?: string;
};

export function DashboardPage({ userId = demoUserId }: DashboardPageProps) {
  const { transactions } = useTransactionSession();
  const dashboardState = useDashboardSummary({ transactions, userId });
  const hasTransactions = Boolean(
    dashboardState.summary?.recentTransactions.length
  );

  return (
    <main className="min-h-screen bg-background px-4 py-5 text-foreground sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase text-primary sm:text-sm">
              Controle Financeiro IA
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-950 sm:text-3xl">
              Dashboard
            </h1>
          </div>

          {dashboardState.status === "success" && hasTransactions ? (
            <Link
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              href="/transactions"
            >
              <Plus aria-hidden="true" size={18} />
              Nova transação
            </Link>
          ) : null}
        </header>

        {dashboardState.status === "loading" ? (
          <p className="text-sm text-slate-600" role="status">
            Carregando dashboard.
          </p>
        ) : null}

        {dashboardState.status === "error" ? (
          <p
            className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-danger"
            role="alert"
          >
            {dashboardState.errorMessage}
          </p>
        ) : null}

        {dashboardState.status === "success" && !hasTransactions ? (
          <DashboardEmptyState />
        ) : null}

        {dashboardState.status === "success" && dashboardState.summary && hasTransactions ? (
          <div className="grid gap-6">
            <DashboardSummaryPanel
              summary={dashboardState.summary.monthlySummary}
            />
            <RecentTransactionsList
              transactions={dashboardState.summary.recentTransactions}
            />
          </div>
        ) : null}
      </div>
    </main>
  );
}

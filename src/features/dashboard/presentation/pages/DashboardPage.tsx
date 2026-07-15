"use client";

import Link from "next/link";
import { Plus, WalletCards } from "lucide-react";
import { useAuthSession } from "@/features/auth/presentation/providers/AuthSessionProvider";
import { useTransactionSession } from "../../../transactions/presentation/providers/TransactionSessionProvider";
import { DashboardSummaryPanel } from "../components/DashboardSummaryPanel";
import { DashboardEmptyState } from "../components/DashboardEmptyState";
import { RecentTransactionsList } from "../components/RecentTransactionsList";
import { useDashboardSummary } from "../hooks/useDashboardSummary";

export function DashboardPage() {
  const { user } = useAuthSession();
  const { transactions } = useTransactionSession();
  const dashboardState = useDashboardSummary({
    transactions,
    userId: user.id
  });
  const hasTransactions = Boolean(
    dashboardState.summary?.recentTransactions.length
  );

  return (
    <main className="min-h-screen bg-background px-4 py-5 text-foreground sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
          <div>
            <p className="text-xs font-semibold uppercase text-primary sm:text-sm">
              FinControl
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
              Dashboard
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2"
              href="/accounts"
            >
              <WalletCards aria-hidden="true" size={18} />
              Contas
            </Link>

            {dashboardState.status === "success" && hasTransactions ? (
              <Link
                className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2"
                href="/transactions"
              >
                <Plus aria-hidden="true" size={18} />
                Nova transação
              </Link>
            ) : null}
          </div>
        </header>

        {dashboardState.status === "loading" ? (
          <p className="text-sm text-muted-foreground" role="status">
            Carregando dashboard.
          </p>
        ) : null}

        {dashboardState.status === "error" ? (
          <p
            className="rounded-md border border-danger bg-danger-surface p-4 text-sm text-danger-foreground"
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

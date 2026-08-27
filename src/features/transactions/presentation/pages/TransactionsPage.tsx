"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type {
  CreateTransactionRequest,
  TransactionDto,
  TransactionsPageDataDto
} from "../../application/dtos/transaction.dto";
import { MonthlySummaryPanel } from "../components/MonthlySummaryPanel";
import { TransactionForm } from "../components/TransactionForm";
import { TransactionList } from "../components/TransactionSessionList";

type TransactionsPageProps = {
  initialData: TransactionsPageDataDto;
  onCreateTransaction: (
    input: CreateTransactionRequest
  ) => Promise<TransactionDto>;
};

export function TransactionsPage({
  initialData,
  onCreateTransaction
}: TransactionsPageProps) {
  const router = useRouter();

  async function handleCreateTransaction(input: CreateTransactionRequest) {
    await onCreateTransaction(input);
    router.refresh();
  }

  const missingSetup = initialData.accounts.length === 0
    ? {
        message: "Cadastre uma conta antes de registrar transações.",
        href: "/accounts",
        label: "Cadastrar conta"
      }
    : initialData.categories.length === 0
      ? {
          message: "Cadastre uma categoria antes de registrar transações.",
          href: "/categories",
          label: "Cadastrar categoria"
        }
      : null;

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
            <Link
              className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2"
              href="/categories"
            >
              Gerenciar categorias
            </Link>
          </div>

          {missingSetup ? (
            <div className="grid gap-3 rounded-md border border-dashed border-border bg-surface p-4">
              <p className="text-sm text-muted-foreground" role="status">
                {missingSetup.message}
              </p>
              <Link
                className="inline-flex min-h-11 items-center text-sm font-semibold text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2"
                href={missingSetup.href}
              >
                {missingSetup.label}
              </Link>
            </div>
          ) : (
            <TransactionForm
              accounts={initialData.accounts}
              categories={initialData.categories}
              onCreateTransaction={handleCreateTransaction}
            />
          )}
        </section>

        <div className="grid content-start gap-4">
          <MonthlySummaryPanel
            errorMessage={undefined}
            status="success"
            summary={initialData.summary}
          />

          <TransactionList
            monthRef={initialData.monthRef}
            transactions={initialData.transactions}
          />
        </div>
      </div>
    </main>
  );
}

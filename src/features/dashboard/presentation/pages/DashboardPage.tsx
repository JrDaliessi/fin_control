import Link from "next/link";
import { Plus, WalletCards } from "lucide-react";
import type { ReactNode } from "react";

type DashboardPageProps = Readonly<{
  children?: ReactNode;
}>;

export function DashboardPage({ children }: DashboardPageProps = {}) {
  return (
    <main className="min-h-screen bg-background px-4 py-5 text-foreground sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-12 gap-6">
        <header className="col-span-12 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
          <div>
            <p className="text-xs font-semibold uppercase text-primary sm:text-sm">
              FinControl
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
              Visão geral
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Aqui está o que aconteceu com seu dinheiro no período selecionado.
            </p>
          </div>

          <nav
            aria-label="Ações rápidas"
            className="flex w-full flex-wrap gap-2 sm:w-auto"
          >
            <Link
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 sm:flex-none"
              href="/accounts"
            >
              <WalletCards aria-hidden="true" size={18} />
              Contas
            </Link>

            <Link
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 sm:flex-none"
              href="/transactions"
            >
              <Plus aria-hidden="true" size={18} />
              Transações
            </Link>
          </nav>
        </header>

        <div className="col-span-12 min-w-0">{children}</div>
      </div>
    </main>
  );
}

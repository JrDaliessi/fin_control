"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AccountForm } from "../components/AccountForm";
import { AccountSessionList } from "../components/AccountSessionList";
import { useAccountSession } from "../providers/AccountSessionProvider";

const demoUserId = "user-1";

export function AccountsPage() {
  const { accounts, createAccount } = useAccountSession();

  return (
    <main className="min-h-screen bg-background px-4 py-5 text-foreground sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-[minmax(0,430px)_1fr] lg:gap-8">
        <section className="grid content-start gap-4">
          <div>
            <Link
              className="mb-4 inline-flex min-h-10 items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              href="/"
            >
              <ArrowLeft aria-hidden="true" size={18} />
              Voltar ao dashboard
            </Link>
            <p className="text-xs font-semibold uppercase text-primary sm:text-sm">
              Controle Financeiro IA
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-950 sm:text-3xl">
              Cadastrar conta financeira
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Os dados permanecem somente nesta sessão e serão perdidos ao recarregar.
            </p>
          </div>

          <AccountForm
            onCreateAccount={createAccount}
            userId={demoUserId}
          />
        </section>

        <div className="grid content-start gap-4">
          <AccountSessionList accounts={accounts} />
        </div>
      </div>
    </main>
  );
}

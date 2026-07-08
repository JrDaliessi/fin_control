"use client";

import { useState } from "react";
import type { CreateTransactionInput } from "../../domain/entities/transaction.entity";
import { TransactionForm } from "../components/TransactionForm";

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
    name: "Salario"
  }
];

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<CreateTransactionInput[]>([]);

  async function handleCreateTransaction(input: CreateTransactionInput) {
    setTransactions((currentTransactions) => [input, ...currentTransactions]);
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
        <section className="grid content-start gap-4">
          <div>
            <p className="text-sm font-medium uppercase text-primary">
              Controle Financeiro IA
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-950">
              Registrar transacao manual
            </h1>
          </div>

          <TransactionForm
            accounts={demoAccounts}
            categories={demoCategories}
            onCreateTransaction={handleCreateTransaction}
            userId="user-1"
          />
        </section>

        <section className="grid content-start gap-3">
          <h2 className="text-lg font-semibold text-slate-950">
            Lancamentos desta sessao
          </h2>

          {transactions.length === 0 ? (
            <div className="rounded border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
              Nenhuma transacao registrada nesta sessao.
            </div>
          ) : (
            <ul className="grid gap-3">
              {transactions.map((transaction, index) => (
                <li
                  className="rounded border border-slate-200 bg-white p-4"
                  key={`${transaction.description}-${transaction.occurredAt.toISOString()}-${index}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-slate-950">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-slate-600">
                        {transaction.type === "income" ? "Receita" : "Despesa"}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-slate-950">
                      {formatCents(transaction.amountInCents)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

function formatCents(amountInCents: number) {
  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency"
  }).format(amountInCents / 100);
}


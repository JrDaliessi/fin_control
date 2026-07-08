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
    name: "Salário"
  }
];

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<CreateTransactionInput[]>([]);

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
            userId="user-1"
          />
        </section>

        <section
          aria-labelledby="session-transactions-title"
          className="grid content-start gap-3"
        >
          <h2
            className="text-lg font-semibold text-slate-950"
            id="session-transactions-title"
          >
            Lançamentos desta sessão
          </h2>

          {transactions.length === 0 ? (
            <div
              className="rounded-md border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600"
              role="status"
            >
              Nenhuma transação registrada nesta sessão.
            </div>
          ) : (
            <ul className="grid gap-3">
              {transactions.map((transaction, index) => (
                <li
                  className="rounded-md border border-slate-200 bg-white p-4 shadow-sm"
                  key={`${transaction.description}-${transaction.occurredAt.toISOString()}-${index}`}
                >
                  <div className="grid gap-2 sm:flex sm:items-start sm:justify-between sm:gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-slate-950">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-slate-600">
                        {transaction.type === "income" ? "Receita" : "Despesa"}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-slate-950 sm:text-right">
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

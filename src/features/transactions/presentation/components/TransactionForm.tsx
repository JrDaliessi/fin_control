"use client";

import { FormEvent, useState } from "react";
import type { CreateTransactionInput } from "../../domain/entities/transaction.entity";
import {
  type TransactionFormValues,
  useTransactionForm
} from "../hooks/useTransactionForm";

type TransactionOption = {
  id: string;
  name: string;
};

type TransactionFormProps = {
  userId: string;
  accounts: TransactionOption[];
  categories: TransactionOption[];
  onCreateTransaction: (input: CreateTransactionInput) => Promise<void>;
};

export function TransactionForm({
  userId,
  accounts,
  categories,
  onCreateTransaction
}: TransactionFormProps) {
  const [values, setValues] = useState<TransactionFormValues>({
    accountId: accounts[0]?.id ?? "",
    categoryId: categories[0]?.id ?? "",
    description: "",
    amount: "",
    type: "expense",
    occurredAt: ""
  });
  const { isSubmitting, message, status, submit } = useTransactionForm({
    userId,
    onCreateTransaction
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submit(values);
  }

  function updateValue<Key extends keyof TransactionFormValues>(
    key: Key,
    value: TransactionFormValues[Key]
  ) {
    setValues((currentValues) => ({
      ...currentValues,
      [key]: value
    }));
  }

  return (
    <form
      className="grid gap-4 rounded border border-slate-200 bg-white p-4"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-1">
        <label className="text-sm font-medium text-slate-800" htmlFor="transaction-description">
          Descricao
        </label>
        <input
          className="rounded border border-slate-300 px-3 py-2 text-sm"
          id="transaction-description"
          name="description"
          onChange={(event) => updateValue("description", event.target.value)}
          type="text"
          value={values.description}
        />
      </div>

      <div className="grid gap-1">
        <label className="text-sm font-medium text-slate-800" htmlFor="transaction-amount">
          Valor
        </label>
        <input
          className="rounded border border-slate-300 px-3 py-2 text-sm"
          id="transaction-amount"
          inputMode="decimal"
          name="amount"
          onChange={(event) => updateValue("amount", event.target.value)}
          type="text"
          value={values.amount}
        />
      </div>

      <div className="grid gap-1">
        <label className="text-sm font-medium text-slate-800" htmlFor="transaction-type">
          Tipo
        </label>
        <select
          className="rounded border border-slate-300 px-3 py-2 text-sm"
          id="transaction-type"
          name="type"
          onChange={(event) =>
            updateValue("type", event.target.value === "income" ? "income" : "expense")
          }
          value={values.type}
        >
          <option value="expense">Despesa</option>
          <option value="income">Receita</option>
        </select>
      </div>

      <div className="grid gap-1">
        <label className="text-sm font-medium text-slate-800" htmlFor="transaction-account">
          Conta
        </label>
        <select
          className="rounded border border-slate-300 px-3 py-2 text-sm"
          id="transaction-account"
          name="accountId"
          onChange={(event) => updateValue("accountId", event.target.value)}
          value={values.accountId}
        >
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-1">
        <label className="text-sm font-medium text-slate-800" htmlFor="transaction-category">
          Categoria
        </label>
        <select
          className="rounded border border-slate-300 px-3 py-2 text-sm"
          id="transaction-category"
          name="categoryId"
          onChange={(event) => updateValue("categoryId", event.target.value)}
          value={values.categoryId}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-1">
        <label className="text-sm font-medium text-slate-800" htmlFor="transaction-date">
          Data
        </label>
        <input
          className="rounded border border-slate-300 px-3 py-2 text-sm"
          id="transaction-date"
          name="occurredAt"
          onChange={(event) => updateValue("occurredAt", event.target.value)}
          type="date"
          value={values.occurredAt}
        />
      </div>

      <button
        className="rounded bg-primary px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Salvando..." : "Registrar transacao"}
      </button>

      {message ? (
        <p
          className={status === "error" ? "text-sm text-danger" : "text-sm text-primary"}
          role={status === "error" ? "alert" : "status"}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}


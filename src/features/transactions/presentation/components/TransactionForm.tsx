"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/shared/components/ui/Button";
import { FeedbackMessage } from "@/shared/components/ui/FeedbackMessage";
import type {
  CreateTransactionRequest,
  TransactionAccountOptionDto,
  TransactionCategoryOptionDto
} from "../../application/dtos/transaction.dto";
import {
  type TransactionFormField,
  type TransactionFormValues,
  useTransactionForm
} from "../hooks/useTransactionForm";

type TransactionFormProps = {
  accounts: readonly TransactionAccountOptionDto[];
  categories: readonly TransactionCategoryOptionDto[];
  onCreateTransaction: (input: CreateTransactionRequest) => Promise<unknown>;
};

const fieldClassName =
  "min-h-11 rounded border border-border bg-surface px-3 py-2 text-base text-foreground outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-focus-ring/30 disabled:bg-surface-muted sm:text-sm";

const fieldErrorClassName =
  "border-danger focus-visible:border-danger focus-visible:ring-danger/30";

const typeOptionClassName =
  "grid min-h-11 cursor-pointer place-items-center rounded px-3 py-2 text-sm font-semibold transition peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring peer-focus-visible:ring-offset-2";

const messageId = "transaction-form-message";

export function TransactionForm({
  accounts,
  categories,
  onCreateTransaction
}: TransactionFormProps) {
  const [values, setValues] = useState<TransactionFormValues>({
    accountId: accounts[0]?.id ?? "",
    categoryId:
      categories.find((category) => category.kind === "expense")?.id ?? "",
    description: "",
    amount: "",
    type: "expense",
    occurredAt: ""
  });
  const { fieldError, isSubmitting, message, status, submit } =
    useTransactionForm({ onCreateTransaction });
  const compatibleCategories = categories.filter(
    (category) => category.kind === values.type
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await submit(values);

    if (result.ok) {
      setValues((currentValues) => ({
        ...currentValues,
        description: "",
        amount: "",
        occurredAt: ""
      }));
    }
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

  function updateType(type: TransactionFormValues["type"]) {
    setValues((currentValues) => ({
      ...currentValues,
      type,
      categoryId:
        categories.find((category) => category.kind === type)?.id ?? ""
    }));
  }

  function getFieldClassName(field: TransactionFormField) {
    return fieldError === field
      ? `${fieldClassName} ${fieldErrorClassName}`
      : fieldClassName;
  }

  function getDescribedBy(field: TransactionFormField, helpId?: string) {
    return [helpId, fieldError === field && message ? messageId : null]
      .filter(Boolean)
      .join(" ");
  }

  return (
    <form
      aria-busy={isSubmitting}
      aria-label="Registro manual de transação"
      className="grid gap-4 rounded-md border border-border bg-surface p-4 shadow-sm sm:p-5"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-1.5">
        <label className="text-sm font-medium text-foreground" htmlFor="transaction-description">
          Descrição
        </label>
        <input
          aria-describedby={getDescribedBy("description") || undefined}
          aria-invalid={fieldError === "description"}
          className={getFieldClassName("description")}
          id="transaction-description"
          name="description"
          onChange={(event) => updateValue("description", event.target.value)}
          required
          type="text"
          value={values.description}
        />
      </div>

      <div className="grid gap-1.5">
        <label className="text-sm font-medium text-foreground" htmlFor="transaction-amount">
          Valor
        </label>
        <input
          aria-describedby={getDescribedBy("amount", "transaction-amount-help")}
          aria-invalid={fieldError === "amount"}
          className={getFieldClassName("amount")}
          id="transaction-amount"
          inputMode="decimal"
          name="amount"
          onChange={(event) => updateValue("amount", event.target.value)}
          required
          type="text"
          value={values.amount}
        />
        <p className="text-xs text-muted-foreground" id="transaction-amount-help">
          Use reais com vírgula ou ponto, por exemplo 125,50.
        </p>
      </div>

      <fieldset
        aria-labelledby="transaction-type-legend"
        className="grid gap-1.5"
        role="radiogroup"
      >
        <legend
          className="text-sm font-medium text-foreground"
          id="transaction-type-legend"
        >
          Tipo
        </legend>
        <div className="grid grid-cols-2 rounded-md border border-border bg-surface-muted p-1">
          <label>
            <input
              checked={values.type === "expense"}
              className="peer sr-only"
              name="type"
              onChange={() => updateType("expense")}
              type="radio"
              value="expense"
            />
            <span className={typeOptionClassName}>Despesa</span>
          </label>
          <label>
            <input
              checked={values.type === "income"}
              className="peer sr-only"
              name="type"
              onChange={() => updateType("income")}
              type="radio"
              value="income"
            />
            <span className={typeOptionClassName}>Receita</span>
          </label>
        </div>
      </fieldset>

      <div className="grid gap-1.5">
        <label className="text-sm font-medium text-foreground" htmlFor="transaction-account">
          Conta
        </label>
        <select
          aria-describedby={getDescribedBy("accountId") || undefined}
          aria-invalid={fieldError === "accountId"}
          className={getFieldClassName("accountId")}
          id="transaction-account"
          name="accountId"
          onChange={(event) => updateValue("accountId", event.target.value)}
          required
          value={values.accountId}
        >
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-1.5">
        <label className="text-sm font-medium text-foreground" htmlFor="transaction-category">
          Categoria
        </label>
        <select
          aria-describedby={getDescribedBy("categoryId") || undefined}
          aria-invalid={fieldError === "categoryId"}
          className={getFieldClassName("categoryId")}
          id="transaction-category"
          name="categoryId"
          onChange={(event) => updateValue("categoryId", event.target.value)}
          required
          value={values.categoryId}
        >
          {compatibleCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-1.5">
        <label className="text-sm font-medium text-foreground" htmlFor="transaction-date">
          Data
        </label>
        <input
          aria-describedby={getDescribedBy("occurredAt") || undefined}
          aria-invalid={fieldError === "occurredAt"}
          className={getFieldClassName("occurredAt")}
          id="transaction-date"
          name="occurredAt"
          onChange={(event) => updateValue("occurredAt", event.target.value)}
          required
          type="date"
          value={values.occurredAt}
        />
      </div>

      <Button disabled={isSubmitting} type="submit">
        {isSubmitting ? "Salvando..." : "Registrar transação"}
      </Button>

      {message ? (
        <FeedbackMessage
          id={messageId}
          variant={status === "error" ? "error" : "status"}
        >
          {message}
        </FeedbackMessage>
      ) : null}
    </form>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import type {
  CreateAccountRequest,
  FinancialAccountDto
} from "../../application/dtos/financial-account.dto";
import type { FinancialAccountType } from "../../domain/entities/financial-account.entity";
import {
  type AccountFormField,
  type AccountFormValues,
  useAccountForm
} from "../hooks/useAccountForm";

type AccountFormProps = {
  onCreateAccount: (
    input: CreateAccountRequest
  ) => Promise<FinancialAccountDto>;
};

const fieldClassName =
  "min-h-11 rounded border border-slate-300 px-3 py-2 text-base text-slate-950 outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 disabled:bg-slate-100 sm:text-sm";
const fieldErrorClassName =
  "border-danger focus-visible:border-danger focus-visible:ring-danger/30";
const messageId = "account-form-message";

const accountTypeOptions: Array<{
  label: string;
  value: FinancialAccountType;
}> = [
  { label: "Conta corrente", value: "checking" },
  { label: "Poupança", value: "savings" },
  { label: "Dinheiro", value: "cash" },
  { label: "Conta de pagamento", value: "payment" },
  { label: "Investimento", value: "investment" }
];

export function AccountForm({ onCreateAccount }: AccountFormProps) {
  const [values, setValues] = useState<AccountFormValues>({
    name: "",
    type: "checking",
    initialBalance: ""
  });
  const { fieldError, isSubmitting, message, status, submit } = useAccountForm({
    onCreateAccount
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await submit(values);

    if (result.ok) {
      setValues((currentValues) => ({
        ...currentValues,
        name: "",
        initialBalance: ""
      }));
    }
  }

  function updateValue<Key extends keyof AccountFormValues>(
    key: Key,
    value: AccountFormValues[Key]
  ) {
    setValues((currentValues) => ({ ...currentValues, [key]: value }));
  }

  function getFieldClassName(field: AccountFormField) {
    return fieldError === field
      ? `${fieldClassName} ${fieldErrorClassName}`
      : fieldClassName;
  }

  function getDescribedBy(field: AccountFormField, helpId?: string) {
    return [helpId, fieldError === field && message ? messageId : null]
      .filter(Boolean)
      .join(" ");
  }

  return (
    <form
      aria-busy={isSubmitting}
      aria-label="Cadastro de conta financeira"
      className="grid gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-1.5">
        <label className="text-sm font-medium text-slate-800" htmlFor="account-name">
          Nome da conta
        </label>
        <input
          aria-describedby={getDescribedBy("name") || undefined}
          aria-invalid={fieldError === "name"}
          className={getFieldClassName("name")}
          id="account-name"
          maxLength={80}
          name="name"
          onChange={(event) => updateValue("name", event.target.value)}
          required
          type="text"
          value={values.name}
        />
      </div>

      <div className="grid gap-1.5">
        <label className="text-sm font-medium text-slate-800" htmlFor="account-type">
          Tipo de conta
        </label>
        <select
          className={fieldClassName}
          id="account-type"
          name="type"
          onChange={(event) =>
            updateValue("type", event.target.value as FinancialAccountType)
          }
          value={values.type}
        >
          {accountTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-1.5">
        <label className="text-sm font-medium text-slate-800" htmlFor="account-balance">
          Saldo inicial
        </label>
        <input
          aria-describedby={getDescribedBy(
            "initialBalance",
            "account-balance-help"
          )}
          aria-invalid={fieldError === "initialBalance"}
          className={getFieldClassName("initialBalance")}
          id="account-balance"
          inputMode="decimal"
          name="initialBalance"
          onChange={(event) =>
            updateValue("initialBalance", event.target.value)
          }
          required
          type="text"
          value={values.initialBalance}
        />
        <p className="text-xs text-slate-600" id="account-balance-help">
          Use reais, por exemplo 1.250,50. Valor negativo representa o saldo informado, não um limite de crédito.
        </p>
      </div>

      <button
        className="min-h-11 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Salvando..." : "Cadastrar conta"}
      </button>

      {message ? (
        <p
          className={
            status === "error"
              ? "rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
              : "rounded-md bg-teal-50 px-3 py-2 text-sm text-primary"
          }
          id={messageId}
          role={status === "error" ? "alert" : "status"}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}

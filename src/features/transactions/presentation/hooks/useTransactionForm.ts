"use client";

import { useState } from "react";
import type { CreateTransactionRequest } from "../../application/dtos/transaction.dto";
import type { TransactionType } from "../../domain/entities/transaction.entity";
import { parseTransactionAmountToCents } from "../utils/parseTransactionAmountToCents";

export type TransactionFormStatus = "idle" | "loading" | "success" | "error";

export type TransactionFormField =
  | "accountId"
  | "amount"
  | "categoryId"
  | "description"
  | "occurredAt";

export type TransactionFormValues = {
  accountId: string;
  categoryId: string;
  description: string;
  amount: string;
  type: TransactionType;
  occurredAt: string;
};

type UseTransactionFormParams = {
  onCreateTransaction: (input: CreateTransactionRequest) => Promise<unknown>;
};

type SubmitResult = {
  ok: boolean;
};

export function useTransactionForm({
  onCreateTransaction
}: UseTransactionFormParams) {
  const [status, setStatus] = useState<TransactionFormStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<TransactionFormField | null>(null);

  async function submit(values: TransactionFormValues): Promise<SubmitResult> {
    const amountInCents = parseTransactionAmountToCents(values.amount);

    if (!amountInCents || amountInCents <= 0) {
      setStatus("error");
      setFieldError("amount");
      setMessage("Informe um valor maior que zero.");
      return { ok: false };
    }

    if (!values.description.trim()) {
      setStatus("error");
      setFieldError("description");
      setMessage("Informe uma descrição.");
      return { ok: false };
    }

    if (!values.accountId) {
      setStatus("error");
      setFieldError("accountId");
      setMessage("Selecione uma conta.");
      return { ok: false };
    }

    if (!values.categoryId) {
      setStatus("error");
      setFieldError("categoryId");
      setMessage("Selecione uma categoria.");
      return { ok: false };
    }

    if (!isValidCivilDate(values.occurredAt)) {
      setStatus("error");
      setFieldError("occurredAt");
      setMessage("Informe uma data válida.");
      return { ok: false };
    }

    setStatus("loading");
    setFieldError(null);
    setMessage(null);

    try {
      await onCreateTransaction({
        accountId: values.accountId,
        categoryId: values.categoryId,
        description: values.description.trim(),
        amountInCents,
        type: values.type,
        occurredOn: values.occurredAt
      });

      setStatus("success");
      setFieldError(null);
      setMessage("Transação registrada com sucesso.");
      return { ok: true };
    } catch (error) {
      setStatus("error");
      setFieldError(null);
      setMessage(
        error instanceof Error ? error.message : "Falha ao registrar transação"
      );
      return { ok: false };
    }
  }

  return {
    fieldError,
    isSubmitting: status === "loading",
    message,
    status,
    submit
  };
}

function isValidCivilDate(value: string): boolean {
  if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

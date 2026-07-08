"use client";

import { useState } from "react";
import type {
  CreateTransactionInput,
  TransactionType
} from "../../domain/entities/transaction.entity";
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
  userId: string;
  onCreateTransaction: (input: CreateTransactionInput) => Promise<void>;
};

type SubmitResult = {
  ok: boolean;
};

export function useTransactionForm({
  userId,
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

    const occurredAt = new Date(`${values.occurredAt}T00:00:00.000Z`);

    if (Number.isNaN(occurredAt.getTime())) {
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
        userId,
        accountId: values.accountId,
        categoryId: values.categoryId,
        description: values.description.trim(),
        amountInCents,
        type: values.type,
        occurredAt
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

"use client";

import { useState } from "react";
import type {
  CreateTransactionInput,
  TransactionType
} from "../../domain/entities/transaction.entity";

export type TransactionFormStatus = "idle" | "loading" | "success" | "error";

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

export function parseMoneyToCents(value: string): number | null {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const normalizedValue = trimmedValue.includes(",")
    ? trimmedValue.replace(/\./g, "").replace(",", ".")
    : trimmedValue;
  const parsedValue = Number(normalizedValue);

  if (!Number.isFinite(parsedValue)) {
    return null;
  }

  return Math.round(parsedValue * 100);
}

export function useTransactionForm({
  userId,
  onCreateTransaction
}: UseTransactionFormParams) {
  const [status, setStatus] = useState<TransactionFormStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function submit(values: TransactionFormValues): Promise<SubmitResult> {
    const amountInCents = parseMoneyToCents(values.amount);

    if (!amountInCents || amountInCents <= 0) {
      setStatus("error");
      setMessage("Informe um valor maior que zero.");
      return { ok: false };
    }

    if (!values.description.trim()) {
      setStatus("error");
      setMessage("Informe uma descricao.");
      return { ok: false };
    }

    if (!values.accountId) {
      setStatus("error");
      setMessage("Selecione uma conta.");
      return { ok: false };
    }

    if (!values.categoryId) {
      setStatus("error");
      setMessage("Selecione uma categoria.");
      return { ok: false };
    }

    const occurredAt = new Date(`${values.occurredAt}T00:00:00.000Z`);

    if (Number.isNaN(occurredAt.getTime())) {
      setStatus("error");
      setMessage("Informe uma data valida.");
      return { ok: false };
    }

    setStatus("loading");
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
      setMessage("Transacao registrada com sucesso.");
      return { ok: true };
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Falha ao registrar transacao"
      );
      return { ok: false };
    }
  }

  return {
    isSubmitting: status === "loading",
    message,
    status,
    submit
  };
}


"use client";

import { useState } from "react";
import type {
  CreateFinancialAccountInput,
  FinancialAccount,
  FinancialAccountType
} from "../../domain/entities/financial-account.entity";
import { parseAccountBalanceToCents } from "../utils/parseAccountBalanceToCents";

export type AccountFormValues = {
  name: string;
  type: FinancialAccountType;
  initialBalance: string;
};

export type AccountFormField = keyof AccountFormValues;

type UseAccountFormInput = {
  userId: string;
  onCreateAccount: (
    input: CreateFinancialAccountInput
  ) => Promise<FinancialAccount>;
};

type AccountFormState = {
  fieldError?: AccountFormField;
  message?: string;
  status: "idle" | "submitting" | "success" | "error";
};

const initialState: AccountFormState = { status: "idle" };

export function useAccountForm({ userId, onCreateAccount }: UseAccountFormInput) {
  const [state, setState] = useState<AccountFormState>(initialState);

  async function submit(values: AccountFormValues): Promise<{ ok: boolean }> {
    const name = values.name.trim();

    if (!name) {
      setState({
        fieldError: "name",
        message: "Informe o nome da conta.",
        status: "error"
      });
      return { ok: false };
    }

    const initialBalanceInCents = parseAccountBalanceToCents(
      values.initialBalance
    );

    if (initialBalanceInCents === null) {
      setState({
        fieldError: "initialBalance",
        message: "Informe um saldo inicial válido.",
        status: "error"
      });
      return { ok: false };
    }

    setState({ status: "submitting" });

    try {
      await onCreateAccount({
        userId,
        name,
        type: values.type,
        initialBalanceInCents,
        currency: "BRL"
      });
      setState({
        message: "Conta cadastrada nesta sessão.",
        status: "success"
      });
      return { ok: true };
    } catch {
      setState({
        message: "Não foi possível cadastrar a conta.",
        status: "error"
      });
      return { ok: false };
    }
  }

  return {
    fieldError: state.fieldError,
    isSubmitting: state.status === "submitting",
    message: state.message,
    status: state.status,
    submit
  };
}

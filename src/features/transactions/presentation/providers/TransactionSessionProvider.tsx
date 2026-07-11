"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from "react";
import type { CreateTransactionInput } from "../../domain/entities/transaction.entity";

type TransactionSessionContextValue = {
  addTransaction: (input: CreateTransactionInput) => Promise<void>;
  transactions: readonly CreateTransactionInput[];
};

const TransactionSessionContext =
  createContext<TransactionSessionContextValue | null>(null);

type TransactionSessionProviderProps = {
  children: ReactNode;
  initialTransactions?: readonly CreateTransactionInput[];
};

export function TransactionSessionProvider({
  children,
  initialTransactions = []
}: TransactionSessionProviderProps) {
  const [transactions, setTransactions] =
    useState<CreateTransactionInput[]>(() =>
      initialTransactions.map(cloneTransactionInput)
    );
  const addTransaction = useCallback(async (input: CreateTransactionInput) => {
    setTransactions((currentTransactions) => [
      cloneTransactionInput(input),
      ...currentTransactions
    ]);
  }, []);
  const value = useMemo(
    () => ({ addTransaction, transactions }),
    [addTransaction, transactions]
  );

  return (
    <TransactionSessionContext.Provider value={value}>
      {children}
    </TransactionSessionContext.Provider>
  );
}

export function useTransactionSession() {
  const context = useContext(TransactionSessionContext);

  if (!context) {
    throw new Error(
      "useTransactionSession must be used within TransactionSessionProvider"
    );
  }

  return context;
}

function cloneTransactionInput(
  input: CreateTransactionInput
): CreateTransactionInput {
  return {
    ...input,
    occurredAt: new Date(input.occurredAt.getTime())
  };
}

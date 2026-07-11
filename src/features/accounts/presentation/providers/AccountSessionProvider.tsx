"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { CreateAccountUseCase } from "../../application/use-cases/create-account.use-case";
import type {
  CreateFinancialAccountInput,
  FinancialAccount
} from "../../domain/entities/financial-account.entity";
import type { AccountRepository } from "../../domain/interfaces/account.repository";

type AccountSessionContextValue = {
  accounts: readonly FinancialAccount[];
  createAccount: (
    input: CreateFinancialAccountInput
  ) => Promise<FinancialAccount>;
};

const AccountSessionContext =
  createContext<AccountSessionContextValue | null>(null);

type AccountSessionProviderProps = {
  children: ReactNode;
  initialAccounts?: readonly FinancialAccount[];
};

export function AccountSessionProvider({
  children,
  initialAccounts = []
}: AccountSessionProviderProps) {
  const [accounts, setAccounts] = useState<FinancialAccount[]>(() => [
    ...initialAccounts
  ]);
  const createAccount = useCallback(
    async (input: CreateFinancialAccountInput) => {
      const accountRepository: AccountRepository = {
        create: async (account) => {
          setAccounts((currentAccounts) => [account, ...currentAccounts]);
          return account;
        }
      };
      const useCase = new CreateAccountUseCase({ accountRepository });

      return useCase.execute(input);
    },
    []
  );
  const value = useMemo(
    () => ({ accounts, createAccount }),
    [accounts, createAccount]
  );

  return (
    <AccountSessionContext.Provider value={value}>
      {children}
    </AccountSessionContext.Provider>
  );
}

export function useAccountSession() {
  const context = useContext(AccountSessionContext);

  if (!context) {
    throw new Error(
      "useAccountSession must be used within AccountSessionProvider"
    );
  }

  return context;
}

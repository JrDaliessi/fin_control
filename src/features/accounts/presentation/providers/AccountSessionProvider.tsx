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
import {
  FinancialAccount,
  type CreateFinancialAccountInput
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
  const [accounts, setAccounts] = useState<FinancialAccount[]>(() =>
    initialAccounts.map(cloneAccount)
  );
  const createAccount = useCallback(
    async (input: CreateFinancialAccountInput) => {
      const accountRepository: AccountRepository = {
        create: async (account) => {
          setAccounts((currentAccounts) => [
            cloneAccount(account),
            ...currentAccounts
          ]);
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

function cloneAccount(account: FinancialAccount): FinancialAccount {
  return Object.freeze(
    FinancialAccount.create({
      userId: account.userId,
      name: account.name,
      type: account.type,
      initialBalanceInCents: account.initialBalanceInCents,
      currency: account.currency
    })
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

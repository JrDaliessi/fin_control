import type { FinancialAccount } from "../entities/financial-account.entity";

export type FindAccountByIdInput = {
  userId: string;
  accountId: string;
};

export type ListAccountsByUserInput = {
  userId: string;
};

export interface AccountRepository {
  create(input: FinancialAccount): Promise<FinancialAccount>;
  findById?: (input: FindAccountByIdInput) => Promise<FinancialAccount | null>;
}

export interface AccountListingRepository {
  listByUser(
    input: ListAccountsByUserInput
  ): Promise<readonly FinancialAccount[]>;
}

import type { FinancialAccount } from "../entities/financial-account.entity";

export type FindAccountByIdInput = {
  userId: string;
  accountId: string;
};

export interface AccountRepository {
  create(input: FinancialAccount): Promise<FinancialAccount>;
  findById?: (input: FindAccountByIdInput) => Promise<FinancialAccount | null>;
}

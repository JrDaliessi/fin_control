import type {
  CreateFinancialAccountInput,
  FinancialAccount
} from "../../domain/entities/financial-account.entity";

export type CreateAccountRequest = Omit<
  CreateFinancialAccountInput,
  "userId"
>;

export type FinancialAccountDto = {
  id: string;
  name: string;
  type: FinancialAccount["type"];
  initialBalanceInCents: number;
  currency: FinancialAccount["currency"];
  createdAt: string;
  updatedAt: string;
};

export function toFinancialAccountDto(
  account: FinancialAccount
): FinancialAccountDto {
  if (!account.id || !account.createdAt || !account.updatedAt) {
    throw new Error("persisted account metadata is required");
  }

  return {
    id: account.id,
    name: account.name,
    type: account.type,
    initialBalanceInCents: account.initialBalanceInCents,
    currency: account.currency,
    createdAt: account.createdAt.toISOString(),
    updatedAt: account.updatedAt.toISOString()
  };
}

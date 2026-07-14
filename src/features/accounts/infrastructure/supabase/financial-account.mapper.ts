import {
  FinancialAccount,
  type FinancialAccountType
} from "../../domain/entities/financial-account.entity";

export type FinancialAccountRow = {
  id: string;
  user_id: string;
  name: string;
  type: FinancialAccountType;
  initial_balance_in_cents: number;
  currency: "BRL";
  created_at: string;
  updated_at: string;
};

export type FinancialAccountInsert = Pick<
  FinancialAccountRow,
  | "user_id"
  | "name"
  | "type"
  | "initial_balance_in_cents"
  | "currency"
>;

export function mapFinancialAccountRowToDomain(
  row: FinancialAccountRow
): FinancialAccount {
  return FinancialAccount.restore({
    id: row.id,
    userId: row.user_id,
    name: row.name,
    type: row.type,
    initialBalanceInCents: row.initial_balance_in_cents,
    currency: row.currency,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at)
  });
}

export function mapFinancialAccountToInsert(
  account: FinancialAccount
): FinancialAccountInsert {
  return {
    user_id: account.userId,
    name: account.name,
    type: account.type,
    initial_balance_in_cents: account.initialBalanceInCents,
    currency: account.currency
  };
}

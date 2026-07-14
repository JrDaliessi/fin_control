import { describe, expect, it } from "@jest/globals";
import { FinancialAccount } from "../domain/entities/financial-account.entity";
import {
  mapFinancialAccountRowToDomain,
  mapFinancialAccountToInsert
} from "../infrastructure/supabase/financial-account.mapper";

const persistedRow = {
  id: "6ca6c81f-11a4-4a34-8090-2185bb0e63a8",
  user_id: "09aabfb8-e06e-41e7-b364-12a5dbf27a20",
  name: "Conta principal",
  type: "checking",
  initial_balance_in_cents: -25000,
  currency: "BRL",
  created_at: "2026-07-14T10:00:00.000Z",
  updated_at: "2026-07-14T10:00:00.000Z"
} as const;

describe("financial account mapper", () => {
  it("maps a database row to a rehydrated domain account", () => {
    const account = mapFinancialAccountRowToDomain(persistedRow);

    expect(account).toEqual(
      expect.objectContaining({
        id: persistedRow.id,
        userId: persistedRow.user_id,
        name: persistedRow.name,
        type: persistedRow.type,
        initialBalanceInCents: -25000,
        currency: "BRL",
        createdAt: new Date(persistedRow.created_at),
        updatedAt: new Date(persistedRow.updated_at)
      })
    );
  });

  it("maps a new account to the exact insert payload", () => {
    const account = FinancialAccount.create({
      userId: persistedRow.user_id,
      name: "Conta principal",
      type: "checking",
      initialBalanceInCents: -25000
    });

    expect(mapFinancialAccountToInsert(account)).toEqual({
      user_id: persistedRow.user_id,
      name: "Conta principal",
      type: "checking",
      initial_balance_in_cents: -25000,
      currency: "BRL"
    });
  });
});

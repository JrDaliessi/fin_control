import { describe, expect, it } from "@jest/globals";
import { mapFinancialEvolutionSnapshotRows } from "../infrastructure/supabase/financial-evolution-snapshot.mapper";
import {
  emptyRpcSnapshotRow,
  incomeMovement,
  rpcMovementRow
} from "./fixtures/financial-evolution.fixtures";

describe("mapFinancialEvolutionSnapshotRows", () => {
  it("maps repeated RPC snapshot columns and numeric strings to one projection", () => {
    expect(mapFinancialEvolutionSnapshotRows([rpcMovementRow])).toEqual({
      accountCount: 2,
      openingBalanceInCents: 10_000,
      movements: [incomeMovement]
    });
  });

  it("maps the nullable sentinel row to an empty snapshot", () => {
    expect(mapFinancialEvolutionSnapshotRows([emptyRpcSnapshotRow])).toEqual({
      accountCount: 1,
      openingBalanceInCents: 2_500,
      movements: []
    });
  });

  it("rejects an absent snapshot row", () => {
    expect(() => mapFinancialEvolutionSnapshotRows([])).toThrow("snapshot");
  });

  it.each([
    ["negative account count", { ...rpcMovementRow, account_count: -1 }],
    [
      "unsafe opening balance",
      {
        ...rpcMovementRow,
        opening_balance_in_cents: "9007199254740992"
      }
    ],
    [
      "unsafe movement amount",
      { ...rpcMovementRow, amount_in_cents: "9007199254740992" }
    ],
    ["unknown movement type", { ...rpcMovementRow, movement_type: "transfer" }],
    ["invalid civil date", { ...rpcMovementRow, occurred_on: "2026-02-30" }],
    ["partial null movement", { ...rpcMovementRow, movement_id: null }]
  ])("rejects a malformed row with %s", (_scenario, row) => {
    expect(() => mapFinancialEvolutionSnapshotRows([row])).toThrow();
  });

  it("rejects inconsistent repeated snapshot values", () => {
    expect(() =>
      mapFinancialEvolutionSnapshotRows([
        rpcMovementRow,
        { ...rpcMovementRow, account_count: 3 }
      ])
    ).toThrow("snapshot");
  });
});

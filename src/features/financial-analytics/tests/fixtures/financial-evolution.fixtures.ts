export const analyticsUserId = "9d0e46f5-3b1a-4f30-96c3-9279982d58bf";

export const incomeMovement = {
  id: "f60d89cc-9cb5-4cc0-b9df-8ad1f692871a",
  occurredOn: "2026-03-01",
  createdAt: "2026-03-01T10:00:00.000Z",
  type: "income" as const,
  amountInCents: 5_000
};

export const expenseMovement = {
  id: "e690aa8f-13ed-49eb-8e19-b0fba38ae0b6",
  occurredOn: "2026-03-01",
  createdAt: "2026-03-01T11:00:00.000Z",
  type: "expense" as const,
  amountInCents: 2_000
};

export const laterExpenseMovement = {
  id: "5cfdcf2a-cea6-431b-bfca-6d9ea8ea7d9e",
  occurredOn: "2026-03-03",
  createdAt: "2026-03-03T08:00:00.000Z",
  type: "expense" as const,
  amountInCents: 4_000
};

export const rpcMovementRow = {
  account_count: 2,
  opening_balance_in_cents: "10000",
  movement_id: incomeMovement.id,
  occurred_on: incomeMovement.occurredOn,
  created_at: incomeMovement.createdAt,
  movement_type: incomeMovement.type,
  amount_in_cents: "5000"
};

export const emptyRpcSnapshotRow = {
  account_count: 1,
  opening_balance_in_cents: "2500",
  movement_id: null,
  occurred_on: null,
  created_at: null,
  movement_type: null,
  amount_in_cents: null
};

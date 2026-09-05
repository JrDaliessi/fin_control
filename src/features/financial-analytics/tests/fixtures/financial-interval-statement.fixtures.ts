export const statementUserId = "9d0e46f5-3b1a-4f30-96c3-9279982d58bf";
export const forgedStatementUserId = "cb9d9227-301b-449f-8ee7-ae2646bdf7ec";

export const statementInterval = {
  startOnInclusive: "2026-03-01",
  endOnExclusive: "2026-03-02"
} as const;

export const statementCandle = {
  ...statementInterval,
  openInCents: 10_000,
  highInCents: 15_000,
  lowInCents: 9_000,
  closeInCents: 13_000,
  incomeInCents: 5_000,
  expenseInCents: 2_000,
  volumeInCents: 7_000,
  transactionCount: 2
} as const;

export const nextStatementCandle = {
  startOnInclusive: "2026-03-02",
  endOnExclusive: "2026-03-03",
  openInCents: 13_000,
  highInCents: 13_000,
  lowInCents: 8_000,
  closeInCents: 8_000,
  incomeInCents: 0,
  expenseInCents: 5_000,
  volumeInCents: 5_000,
  transactionCount: 1
} as const;

export const statementRow = {
  id: "f60d89cc-9cb5-4cc0-b9df-8ad1f692871a",
  description: "Salário",
  amount_in_cents: 5_000,
  type: "income" as const,
  occurred_on: "2026-03-01",
  created_at: "2026-03-01T10:00:00.000Z"
};

export const statementItem = {
  id: statementRow.id,
  description: statementRow.description,
  amountInCents: statementRow.amount_in_cents,
  type: statementRow.type,
  occurredOn: statementRow.occurred_on,
  createdAt: statementRow.created_at
} as const;

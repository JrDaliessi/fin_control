import type { CreateTransactionInput } from "../../domain/entities/transaction.entity";

export function resolveSessionMonthRef(
  transactions: readonly CreateTransactionInput[],
  fallbackDate = new Date()
) {
  const visibleDate = transactions.length
    ? transactions.reduce(
        (latestDate, transaction) =>
          transaction.occurredAt.getTime() > latestDate.getTime()
            ? transaction.occurredAt
            : latestDate,
        transactions[0].occurredAt
      )
    : fallbackDate;
  const year = visibleDate.getUTCFullYear();
  const month = String(visibleDate.getUTCMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}

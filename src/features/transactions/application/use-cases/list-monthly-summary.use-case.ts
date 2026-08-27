import { MonthRef } from "../../domain/value-objects/month-ref";
import type { Transaction } from "../../domain/entities/transaction.entity";
import type { TransactionRepository } from "../../domain/interfaces/transaction.repository";

export type ListMonthlySummaryInput = {
  userId: string;
  monthRef: string;
};

export type MonthlySummary = {
  monthRef: string;
  incomeTotalInCents: number;
  expenseTotalInCents: number;
  netBalanceInCents: number;
  transactionCount: number;
};

type ListMonthlySummaryUseCaseDependencies = {
  transactionRepository: TransactionRepository;
};

export type CalculateMonthlySummaryInput = {
  monthRef: string;
  transactions: readonly Transaction[];
};

export function calculateMonthlySummary({
  monthRef: monthRefValue,
  transactions
}: CalculateMonthlySummaryInput): MonthlySummary {
  const monthRef = MonthRef.fromString(monthRefValue);

  return calculateMonthlySummaryForMonth(transactions, monthRef);
}

function calculateMonthlySummaryForMonth(
  transactions: readonly Transaction[],
  monthRef: MonthRef
): MonthlySummary {
  const monthlyTransactions = transactions.filter(
    (transaction) =>
      transaction.occurredAt.getUTCFullYear() === monthRef.year &&
      transaction.occurredAt.getUTCMonth() + 1 === monthRef.month
  );
  const sumByType = (type: Transaction["type"]) =>
    monthlyTransactions
      .filter((transaction) => transaction.type === type)
      .reduce((total, transaction) => total + transaction.amountInCents, 0);
  const incomeTotalInCents = sumByType("income");
  const expenseTotalInCents = sumByType("expense");

  return {
    monthRef: monthRef.value,
    incomeTotalInCents,
    expenseTotalInCents,
    netBalanceInCents: incomeTotalInCents - expenseTotalInCents,
    transactionCount: monthlyTransactions.length
  };
}

export class ListMonthlySummaryUseCase {
  private readonly transactionRepository: TransactionRepository;

  constructor({ transactionRepository }: ListMonthlySummaryUseCaseDependencies) {
    this.transactionRepository = transactionRepository;
  }

  async execute(input: ListMonthlySummaryInput): Promise<MonthlySummary> {
    const userId = input.userId.trim();

    if (!userId) {
      throw new Error("user is required");
    }

    const monthRef = MonthRef.fromString(input.monthRef);
    const transactions = await this.transactionRepository.findByMonth({
      userId,
      year: monthRef.year,
      month: monthRef.month
    });
    return calculateMonthlySummaryForMonth(transactions, monthRef);
  }
}

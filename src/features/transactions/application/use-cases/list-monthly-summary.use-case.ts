import { MonthRef } from "../../domain/value-objects/month-ref";
import type { Transaction } from "../../domain/entities/transaction.entity";
import type {
  FindTransactionsByMonthInput,
  TransactionRepository
} from "../../domain/interfaces/transaction.repository";

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

type MonthlySummaryTransactionRepository = TransactionRepository & {
  findByMonth(input: FindTransactionsByMonthInput): Promise<Transaction[]>;
};

type ListMonthlySummaryUseCaseDependencies = {
  transactionRepository: MonthlySummaryTransactionRepository;
};

export class ListMonthlySummaryUseCase {
  private readonly transactionRepository: MonthlySummaryTransactionRepository;

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
    const monthlyTransactions = transactions.filter((transaction) =>
      this.isTransactionInMonth(transaction, monthRef)
    );

    const incomeTotalInCents = this.sumTransactionsByType(
      monthlyTransactions,
      "income"
    );
    const expenseTotalInCents = this.sumTransactionsByType(
      monthlyTransactions,
      "expense"
    );

    return {
      monthRef: monthRef.value,
      incomeTotalInCents,
      expenseTotalInCents,
      netBalanceInCents: incomeTotalInCents - expenseTotalInCents,
      transactionCount: monthlyTransactions.length
    };
  }

  private isTransactionInMonth(
    transaction: Transaction,
    monthRef: MonthRef
  ): boolean {
    return (
      transaction.occurredAt.getUTCFullYear() === monthRef.year &&
      transaction.occurredAt.getUTCMonth() + 1 === monthRef.month
    );
  }

  private sumTransactionsByType(
    transactions: Transaction[],
    type: Transaction["type"]
  ): number {
    return transactions
      .filter((transaction) => transaction.type === type)
      .reduce((total, transaction) => total + transaction.amountInCents, 0);
  }
}

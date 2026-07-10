import type { CreateTransactionInput } from "../../../transactions/domain/entities/transaction.entity";
import {
  ListMonthlySummaryUseCase,
  type MonthlySummary
} from "../../../transactions/application/use-cases/list-monthly-summary.use-case";
import type { TransactionRepository } from "../../../transactions/domain/interfaces/transaction.repository";
import { Transaction } from "../../../transactions/domain/entities/transaction.entity";
import type { FindTransactionsByMonthInput } from "../../../transactions/domain/interfaces/transaction.repository";

const MAX_RECENT_TRANSACTIONS = 5;

export type DashboardSummaryInput = {
  userId: string;
  monthRef: string;
  transactions: CreateTransactionInput[];
};

export type DashboardSummary = {
  monthlySummary: MonthlySummary;
  recentTransactions: CreateTransactionInput[];
};

class SessionTransactionRepository implements TransactionRepository {
  constructor(private readonly transactions: CreateTransactionInput[]) {}

  async create(input: Transaction): Promise<Transaction> {
    return input;
  }

  async findByMonth(input: FindTransactionsByMonthInput): Promise<Transaction[]> {
    return this.transactions
      .filter((transaction) => {
        const occurredAt = transaction.occurredAt;

        return (
          transaction.userId.trim() === input.userId &&
          occurredAt.getUTCFullYear() === input.year &&
          occurredAt.getUTCMonth() + 1 === input.month
        );
      })
      .map((transaction) => Transaction.create(transaction));
  }
}

export class GetDashboardSummaryUseCase {
  async execute(input: DashboardSummaryInput): Promise<DashboardSummary> {
    const userId = input.userId.trim();

    if (!userId) {
      throw new Error("user is required");
    }

    const repository = new SessionTransactionRepository(input.transactions);
    const summaryUseCase = new ListMonthlySummaryUseCase({
      transactionRepository: repository
    });

    const monthlySummary = await summaryUseCase.execute({
      userId,
      monthRef: input.monthRef
    });

    const recentTransactions = [...input.transactions]
      .sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime())
      .slice(0, MAX_RECENT_TRANSACTIONS);

    return {
      monthlySummary,
      recentTransactions
    };
  }
}

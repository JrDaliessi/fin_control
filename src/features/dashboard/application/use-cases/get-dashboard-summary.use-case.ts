import type { CreateTransactionInput } from "../../../transactions/domain/entities/transaction.entity";
import type { MonthlySummary } from "../../../transactions/application/use-cases/list-monthly-summary.use-case";
import { listSessionMonthlySummary } from "../../../transactions/application/use-cases/list-session-monthly-summary.use-case";

const MAX_RECENT_TRANSACTIONS = 5;

export type DashboardSummaryInput = {
  userId: string;
  monthRef: string;
  transactions: readonly CreateTransactionInput[];
};

export type DashboardSummary = {
  monthlySummary: MonthlySummary;
  recentTransactions: readonly CreateTransactionInput[];
};

export class GetDashboardSummaryUseCase {
  async execute(input: DashboardSummaryInput): Promise<DashboardSummary> {
    const userId = input.userId.trim();

    if (!userId) {
      throw new Error("user is required");
    }

    const monthlySummary = await listSessionMonthlySummary({
      userId,
      monthRef: input.monthRef,
      transactions: input.transactions
    });

    const recentTransactions = input.transactions
      .filter((transaction) => transaction.userId.trim() === userId)
      .sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime())
      .slice(0, MAX_RECENT_TRANSACTIONS);

    return {
      monthlySummary,
      recentTransactions
    };
  }
}

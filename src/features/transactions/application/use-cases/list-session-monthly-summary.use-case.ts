import {
  Transaction,
  type CreateTransactionInput
} from "../../domain/entities/transaction.entity";
import type {
  FindTransactionsByMonthInput,
  TransactionRepository
} from "../../domain/interfaces/transaction.repository";
import {
  ListMonthlySummaryUseCase,
  type MonthlySummary
} from "./list-monthly-summary.use-case";

export type ListSessionMonthlySummaryInput = {
  userId: string;
  monthRef: string;
  transactions: readonly CreateTransactionInput[];
};

class SessionTransactionRepository implements TransactionRepository {
  constructor(
    private readonly transactions: readonly CreateTransactionInput[]
  ) {}

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

export async function listSessionMonthlySummary({
  monthRef,
  transactions,
  userId
}: ListSessionMonthlySummaryInput): Promise<MonthlySummary> {
  const useCase = new ListMonthlySummaryUseCase({
    transactionRepository: new SessionTransactionRepository(transactions)
  });

  return useCase.execute({
    monthRef,
    userId
  });
}

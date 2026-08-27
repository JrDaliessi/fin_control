import type { Transaction } from "../../domain/entities/transaction.entity";
import type { TransactionRepository } from "../../domain/interfaces/transaction.repository";
import { MonthRef } from "../../domain/value-objects/month-ref";

export type ListTransactionsByMonthInput = {
  userId: string;
  monthRef: string;
};

type ListTransactionsByMonthUseCaseDependencies = {
  transactionRepository: TransactionRepository;
};

export class ListTransactionsByMonthUseCase {
  private readonly transactionRepository: TransactionRepository;

  constructor({
    transactionRepository
  }: ListTransactionsByMonthUseCaseDependencies) {
    this.transactionRepository = transactionRepository;
  }

  async execute(input: ListTransactionsByMonthInput): Promise<Transaction[]> {
    const userId = input.userId.trim();

    if (!userId) {
      throw new Error("user is required");
    }

    const monthRef = MonthRef.fromString(input.monthRef);

    return this.transactionRepository.findByMonth({
      userId,
      year: monthRef.year,
      month: monthRef.month
    });
  }
}

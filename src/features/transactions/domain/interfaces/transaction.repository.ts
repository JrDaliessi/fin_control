import type { Transaction } from "../entities/transaction.entity";

export type FindTransactionsByMonthInput = {
  userId: string;
  year: number;
  month: number;
};

export interface TransactionRepository {
  create(input: Transaction): Promise<Transaction>;
  findByMonth?: (input: FindTransactionsByMonthInput) => Promise<Transaction[]>;
}


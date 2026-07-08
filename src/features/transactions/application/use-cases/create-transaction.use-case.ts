import {
  Transaction,
  type CreateTransactionInput
} from "../../domain/entities/transaction.entity";
import type { TransactionRepository } from "../../domain/interfaces/transaction.repository";

type CreateTransactionUseCaseDependencies = {
  transactionRepository: TransactionRepository;
};

export class CreateTransactionUseCase {
  private readonly transactionRepository: TransactionRepository;

  constructor({ transactionRepository }: CreateTransactionUseCaseDependencies) {
    this.transactionRepository = transactionRepository;
  }

  async execute(input: CreateTransactionInput): Promise<Transaction> {
    const transaction = Transaction.create(input);

    return this.transactionRepository.create(transaction);
  }
}


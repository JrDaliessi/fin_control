import { describe, expect, it, jest } from "@jest/globals";
import type { Transaction } from "../domain/entities/transaction.entity";
import type {
  FindTransactionsByMonthInput,
  TransactionRepository
} from "../domain/interfaces/transaction.repository";
import { ListTransactionsByMonthUseCase } from "../application/use-cases/list-transactions-by-month.use-case";
import { persistedTransactionRow, validTransactionInput } from "./fixtures/transaction.fixtures";
import { Transaction as TransactionEntity } from "../domain/entities/transaction.entity";

class TransactionRepositoryStub implements TransactionRepository {
  create = jest.fn(async (transaction: Transaction) => transaction);
  findByMonth = jest.fn(async (input: FindTransactionsByMonthInput) => {
    void input;
    return [
      TransactionEntity.restore({
        ...validTransactionInput,
        id: persistedTransactionRow.id,
        createdAt: new Date(persistedTransactionRow.created_at),
        updatedAt: new Date(persistedTransactionRow.updated_at)
      })
    ];
  });
}

describe("ListTransactionsByMonthUseCase", () => {
  it("normalizes the actor and lists the selected month", async () => {
    const repository = new TransactionRepositoryStub();
    const useCase = new ListTransactionsByMonthUseCase({
      transactionRepository: repository
    });

    const result = await useCase.execute({
      userId: ` ${validTransactionInput.userId} `,
      monthRef: " 2026-07 "
    });

    expect(repository.findByMonth).toHaveBeenCalledWith({
      userId: validTransactionInput.userId,
      year: 2026,
      month: 7
    });
    expect(result).toHaveLength(1);
  });

  it.each([
    ["missing actor", { userId: " ", monthRef: "2026-07" }, "user"],
    ["invalid month", { userId: "user-1", monthRef: "2026-13" }, "monthRef"]
  ])("rejects %s before persistence", async (_name, input, message) => {
    const repository = new TransactionRepositoryStub();
    const useCase = new ListTransactionsByMonthUseCase({
      transactionRepository: repository
    });

    await expect(useCase.execute(input)).rejects.toThrow(message);
    expect(repository.findByMonth).not.toHaveBeenCalled();
  });
});

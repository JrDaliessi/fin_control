import { describe, expect, it, jest } from "@jest/globals";
import { CreateTransactionUseCase } from "../application/use-cases/create-transaction.use-case";
import type { TransactionRepository } from "../domain/interfaces/transaction.repository";
import type { Transaction } from "../domain/entities/transaction.entity";

const validInput = {
  userId: "user-1",
  accountId: "account-1",
  categoryId: "category-1",
  description: "Mercado",
  amountInCents: 12550,
  type: "expense" as const,
  occurredAt: new Date("2026-07-08T12:00:00.000Z")
};

class TransactionRepositoryStub implements TransactionRepository {
  create = jest.fn(async (transaction: Transaction) => ({
    ...transaction,
    id: "transaction-1",
    createdAt: new Date("2026-07-08T12:01:00.000Z"),
    updatedAt: new Date("2026-07-08T12:01:00.000Z")
  }));

  findByMonth = jest.fn(async (): Promise<Transaction[]> => []);
}

describe("CreateTransactionUseCase", () => {
  it("validates and persists a manual transaction through the repository contract", async () => {
    const transactionRepository = new TransactionRepositoryStub();
    const useCase = new CreateTransactionUseCase({ transactionRepository });

    const output = await useCase.execute(validInput);

    expect(transactionRepository.create).toHaveBeenCalledTimes(1);
    expect(transactionRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        accountId: "account-1",
        categoryId: "category-1",
        amountInCents: 12550,
        type: "expense"
      })
    );
    expect(output.id).toBe("transaction-1");
  });

  it("does not persist invalid input", async () => {
    const transactionRepository = new TransactionRepositoryStub();
    const useCase = new CreateTransactionUseCase({ transactionRepository });

    await expect(
      useCase.execute({ ...validInput, amountInCents: 0 })
    ).rejects.toThrow("amount");

    expect(transactionRepository.create).not.toHaveBeenCalled();
  });

  it("propagates repository errors without hiding the failure", async () => {
    const transactionRepository = new TransactionRepositoryStub();
    transactionRepository.create.mockRejectedValueOnce(
      new Error("repository unavailable")
    );
    const useCase = new CreateTransactionUseCase({ transactionRepository });

    await expect(useCase.execute(validInput)).rejects.toThrow(
      "repository unavailable"
    );
  });
});

import { describe, expect, it, jest } from "@jest/globals";
import {
  calculateMonthlySummary,
  ListMonthlySummaryUseCase
} from "../application/use-cases/list-monthly-summary.use-case";
import {
  Transaction,
  type CreateTransactionInput
} from "../domain/entities/transaction.entity";
import type {
  FindTransactionsByMonthInput,
  TransactionRepository
} from "../domain/interfaces/transaction.repository";

const baseTransactionInput: CreateTransactionInput = {
  userId: "user-1",
  accountId: "account-1",
  categoryId: "category-1",
  description: "Mercado",
  amountInCents: 12550,
  type: "expense",
  occurredAt: new Date("2026-07-08T12:00:00.000Z")
};

const makeTransaction = (
  patch: Partial<CreateTransactionInput> = {}
): Transaction => Transaction.create({ ...baseTransactionInput, ...patch });

class TransactionRepositoryStub implements TransactionRepository {
  create = jest.fn(async (transaction: Transaction): Promise<Transaction> => ({
    ...transaction
  }));

  findByMonth = jest.fn(
    async (input: FindTransactionsByMonthInput): Promise<Transaction[]> => {
      void input;

      return [];
    }
  );
}

describe("ListMonthlySummaryUseCase", () => {
  it("calculates a summary from transactions already loaded by the composition root", () => {
    const output = calculateMonthlySummary({
      monthRef: "2026-07",
      transactions: [
        makeTransaction({
          description: "Salario",
          amountInCents: 500000,
          type: "income",
          occurredAt: new Date("2026-07-05T12:00:00.000Z")
        }),
        makeTransaction({
          description: "Mercado",
          amountInCents: 12550,
          type: "expense",
          occurredAt: new Date("2026-07-08T12:00:00.000Z")
        }),
        makeTransaction({
          description: "Conta futura",
          amountInCents: 9000,
          type: "expense",
          occurredAt: new Date("2026-08-01T12:00:00.000Z")
        })
      ]
    });

    expect(output).toEqual({
      monthRef: "2026-07",
      incomeTotalInCents: 500000,
      expenseTotalInCents: 12550,
      netBalanceInCents: 487450,
      transactionCount: 2
    });
  });

  it("calculates income, expenses, net balance and count for the selected month", async () => {
    const transactionRepository = new TransactionRepositoryStub();
    transactionRepository.findByMonth.mockResolvedValueOnce([
      makeTransaction({
        description: "Salario",
        amountInCents: 500000,
        type: "income",
        occurredAt: new Date("2026-07-05T12:00:00.000Z")
      }),
      makeTransaction({
        description: "Mercado",
        amountInCents: 12550,
        type: "expense",
        occurredAt: new Date("2026-07-08T12:00:00.000Z")
      }),
      makeTransaction({
        description: "Conta futura",
        amountInCents: 9000,
        type: "expense",
        occurredAt: new Date("2026-08-01T12:00:00.000Z")
      })
    ]);
    const useCase = new ListMonthlySummaryUseCase({ transactionRepository });

    const output = await useCase.execute({
      userId: " user-1 ",
      monthRef: "2026-07"
    });

    expect(transactionRepository.findByMonth).toHaveBeenCalledTimes(1);
    expect(transactionRepository.findByMonth).toHaveBeenCalledWith({
      userId: "user-1",
      year: 2026,
      month: 7
    });
    expect(output).toEqual({
      monthRef: "2026-07",
      incomeTotalInCents: 500000,
      expenseTotalInCents: 12550,
      netBalanceInCents: 487450,
      transactionCount: 2
    });
  });

  it("returns a zeroed summary when the selected month has no transactions", async () => {
    const transactionRepository = new TransactionRepositoryStub();
    const useCase = new ListMonthlySummaryUseCase({ transactionRepository });

    const output = await useCase.execute({
      userId: "user-1",
      monthRef: "2026-07"
    });

    expect(output).toEqual({
      monthRef: "2026-07",
      incomeTotalInCents: 0,
      expenseTotalInCents: 0,
      netBalanceInCents: 0,
      transactionCount: 0
    });
  });

  it("rejects an invalid month reference before calling the repository", async () => {
    const transactionRepository = new TransactionRepositoryStub();
    const useCase = new ListMonthlySummaryUseCase({ transactionRepository });

    await expect(
      useCase.execute({ userId: "user-1", monthRef: "2026-13" })
    ).rejects.toThrow("monthRef");

    expect(transactionRepository.findByMonth).not.toHaveBeenCalled();
  });

  it("rejects an empty user before calling the repository", async () => {
    const transactionRepository = new TransactionRepositoryStub();
    const useCase = new ListMonthlySummaryUseCase({ transactionRepository });

    await expect(
      useCase.execute({ userId: " ", monthRef: "2026-07" })
    ).rejects.toThrow("user");

    expect(transactionRepository.findByMonth).not.toHaveBeenCalled();
  });
});

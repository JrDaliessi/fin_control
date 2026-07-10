import type { CreateTransactionInput } from "../../transactions/domain/entities/transaction.entity";
import {
  GetDashboardSummaryUseCase,
  type DashboardSummary,
  type DashboardSummaryInput
} from "../application/use-cases/get-dashboard-summary.use-case";

function makeTransaction(
  overrides: Partial<CreateTransactionInput> = {}
): CreateTransactionInput {
  return {
    userId: "user-1",
    accountId: "account-1",
    categoryId: "category-1",
    description: "Compra teste",
    amountInCents: 1000,
    type: "expense",
    occurredAt: new Date("2026-07-15T12:00:00Z"),
    ...overrides
  };
}

describe("GetDashboardSummaryUseCase", () => {
  it("should return monthly summary and recent transactions for a valid month", async () => {
    const transactions: CreateTransactionInput[] = [
      makeTransaction({ description: "Salário", amountInCents: 500000, type: "income" }),
      makeTransaction({ description: "Mercado", amountInCents: 15000, type: "expense" }),
      makeTransaction({ description: "Farmácia", amountInCents: 8000, type: "expense" })
    ];

    const useCase = new GetDashboardSummaryUseCase();
    const result: DashboardSummary = await useCase.execute({
      userId: "user-1",
      monthRef: "2026-07",
      transactions
    });

    expect(result.monthlySummary.incomeTotalInCents).toBe(500000);
    expect(result.monthlySummary.expenseTotalInCents).toBe(23000);
    expect(result.monthlySummary.netBalanceInCents).toBe(477000);
    expect(result.monthlySummary.transactionCount).toBe(3);
    expect(result.recentTransactions).toHaveLength(3);
  });

  it("should limit recent transactions to the configured maximum", async () => {
    const transactions: CreateTransactionInput[] = Array.from(
      { length: 8 },
      (_, i) =>
        makeTransaction({
          description: `Transação ${i + 1}`,
          amountInCents: 1000 * (i + 1),
          occurredAt: new Date(`2026-07-${String(i + 1).padStart(2, "0")}T12:00:00Z`)
        })
    );

    const useCase = new GetDashboardSummaryUseCase();
    const result = await useCase.execute({
      userId: "user-1",
      monthRef: "2026-07",
      transactions
    });

    expect(result.recentTransactions.length).toBeLessThanOrEqual(5);
  });

  it("should return the most recent transactions first", async () => {
    const transactions: CreateTransactionInput[] = [
      makeTransaction({ description: "Antiga", occurredAt: new Date("2026-07-01T12:00:00Z") }),
      makeTransaction({ description: "Recente", occurredAt: new Date("2026-07-20T12:00:00Z") }),
      makeTransaction({ description: "Meio", occurredAt: new Date("2026-07-10T12:00:00Z") })
    ];

    const useCase = new GetDashboardSummaryUseCase();
    const result = await useCase.execute({
      userId: "user-1",
      monthRef: "2026-07",
      transactions
    });

    expect(result.recentTransactions[0].description).toBe("Recente");
    expect(result.recentTransactions[1].description).toBe("Meio");
    expect(result.recentTransactions[2].description).toBe("Antiga");
  });

  it("should return empty summary and empty list when there are no transactions", async () => {
    const useCase = new GetDashboardSummaryUseCase();
    const result = await useCase.execute({
      userId: "user-1",
      monthRef: "2026-07",
      transactions: []
    });

    expect(result.monthlySummary.incomeTotalInCents).toBe(0);
    expect(result.monthlySummary.expenseTotalInCents).toBe(0);
    expect(result.monthlySummary.netBalanceInCents).toBe(0);
    expect(result.monthlySummary.transactionCount).toBe(0);
    expect(result.recentTransactions).toHaveLength(0);
  });

  it("should reject empty userId", async () => {
    const useCase = new GetDashboardSummaryUseCase();

    await expect(
      useCase.execute({
        userId: "  ",
        monthRef: "2026-07",
        transactions: []
      })
    ).rejects.toThrow("user is required");
  });

  it("should reject invalid monthRef", async () => {
    const useCase = new GetDashboardSummaryUseCase();

    await expect(
      useCase.execute({
        userId: "user-1",
        monthRef: "invalid",
        transactions: []
      })
    ).rejects.toThrow("monthRef is invalid");
  });

  it("should only include transactions from the selected month in the summary", async () => {
    const transactions: CreateTransactionInput[] = [
      makeTransaction({
        description: "Dentro do mês",
        amountInCents: 5000,
        type: "expense",
        occurredAt: new Date("2026-07-15T12:00:00Z")
      }),
      makeTransaction({
        description: "Fora do mês",
        amountInCents: 3000,
        type: "expense",
        occurredAt: new Date("2026-06-15T12:00:00Z")
      })
    ];

    const useCase = new GetDashboardSummaryUseCase();
    const result = await useCase.execute({
      userId: "user-1",
      monthRef: "2026-07",
      transactions
    });

    expect(result.monthlySummary.expenseTotalInCents).toBe(5000);
    expect(result.monthlySummary.transactionCount).toBe(1);
  });

  it("should include all session transactions in recentTransactions regardless of month", async () => {
    const transactions: CreateTransactionInput[] = [
      makeTransaction({
        description: "Julho",
        occurredAt: new Date("2026-07-15T12:00:00Z")
      }),
      makeTransaction({
        description: "Junho",
        occurredAt: new Date("2026-06-10T12:00:00Z")
      })
    ];

    const useCase = new GetDashboardSummaryUseCase();
    const result = await useCase.execute({
      userId: "user-1",
      monthRef: "2026-07",
      transactions
    });

    expect(result.recentTransactions).toHaveLength(2);
  });
});

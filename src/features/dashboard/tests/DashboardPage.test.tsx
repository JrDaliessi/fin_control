import { describe, expect, it } from "@jest/globals";
import { render, screen, within } from "@testing-library/react";
import type { CreateTransactionInput } from "../../transactions/domain/entities/transaction.entity";
import { TransactionSessionProvider } from "../../transactions/presentation/providers/TransactionSessionProvider";
import { DashboardPage } from "../presentation/pages/DashboardPage";

function makeTransaction(
  overrides: Partial<CreateTransactionInput> = {}
): CreateTransactionInput {
  return {
    userId: "user-1",
    accountId: "account-1",
    categoryId: "category-1",
    description: "Mercado",
    amountInCents: 12550,
    type: "expense",
    occurredAt: new Date("2026-07-08T12:00:00Z"),
    ...overrides
  };
}

function renderDashboard(
  transactions: CreateTransactionInput[] = [],
  userId?: string
) {
  render(
    <TransactionSessionProvider initialTransactions={transactions}>
      <DashboardPage userId={userId} />
    </TransactionSessionProvider>
  );
}

describe("DashboardPage", () => {
  it("should render the dashboard heading", async () => {
    renderDashboard();

    expect(
      screen.getByRole("heading", { name: /dashboard/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(
      await screen.findByText(/nenhuma transação registrada/i)
    ).toBeInTheDocument();
  });

  it("should render loading and empty states when there are no transactions", async () => {
    renderDashboard();

    expect(screen.getByRole("status")).toHaveTextContent(
      "Carregando dashboard"
    );

    expect(
      await screen.findByText(/nenhuma transação registrada/i)
    ).toHaveAttribute("role", "status");
  });

  it("should render a call-to-action link to register a transaction", async () => {
    renderDashboard();

    const ctaLink = await screen.findByRole("link", {
      name: /registrar.*transação/i
    });

    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute("href", "/transactions");
    expect(ctaLink).toHaveClass("min-h-11", "focus-visible:ring-2");
  });

  it("should provide navigation to financial accounts", async () => {
    renderDashboard();

    expect(
      screen.getByRole("link", { name: "Contas" })
    ).toHaveAttribute("href", "/accounts");

    await screen.findByText(/nenhuma transação registrada/i);
  });

  it("should render the monthly summary and recent transactions", async () => {
    renderDashboard([
      makeTransaction({
        description: "Salário",
        amountInCents: 500000,
        type: "income",
        occurredAt: new Date("2026-07-10T12:00:00Z")
      }),
      makeTransaction()
    ]);

    const summaryRegion = await screen.findByRole("region", {
      name: "Resumo financeiro do mês"
    });
    const recentRegion = screen.getByRole("region", {
      name: "Últimas transações"
    });

    expect(
      within(summaryRegion).getByRole("group", {
        name: /Receitas: R\$\s*5\.000,00/
      })
    ).toBeInTheDocument();
    expect(
      within(summaryRegion).getByRole("group", {
        name: /Despesas: R\$\s*125,50/
      })
    ).toBeInTheDocument();
    expect(within(recentRegion).getByText("Salário")).toBeInTheDocument();
    expect(within(recentRegion).getByText("Mercado")).toBeInTheDocument();
  });

  it("should render an error state when the dashboard cannot be calculated", async () => {
    renderDashboard([], " ");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível carregar o dashboard."
    );
  });
});

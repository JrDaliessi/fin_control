import { describe, expect, it, jest } from "@jest/globals";
import { render, screen, within } from "@testing-library/react";
import type {
  CreateTransactionRequest,
  TransactionsPageDataDto
} from "../application/dtos/transaction.dto";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: jest.fn() })
}));

const { TransactionsPage } = jest.requireActual<
  typeof import("../presentation/pages/TransactionsPage")
>("../presentation/pages/TransactionsPage");

const initialData = {
  monthRef: "2026-07",
  accounts: [{ id: "account-1", name: "Conta corrente" }],
  categories: [
    { id: "expense-1", name: "Mercado", kind: "expense" },
    { id: "income-1", name: "Salário", kind: "income" }
  ],
  transactions: [],
  summary: {
    monthRef: "2026-07",
    incomeTotalInCents: 0,
    expenseTotalInCents: 0,
    netBalanceInCents: 0,
    transactionCount: 0
  }
} satisfies TransactionsPageDataDto;

function renderTransactionsPage(data: TransactionsPageDataDto = initialData) {
  const onCreateTransaction = jest.fn(
    async (input: CreateTransactionRequest) => {
      void input;
      return {
        id: "transaction-1",
        accountId: "account-1",
        categoryId: "expense-1",
        description: "Mercado",
        amountInCents: 12550,
        type: "expense" as const,
        paymentMethod: "manual" as const,
        occurredOn: "2026-07-08",
        createdAt: "2026-07-08T12:00:00.000Z",
        updatedAt: "2026-07-08T12:00:00.000Z"
      };
    }
  );

  render(
    <TransactionsPage
      initialData={data}
      onCreateTransaction={onCreateTransaction}
    />
  );

  return { onCreateTransaction };
}

describe("TransactionsPage", () => {
  it("renders the persistent manual transaction flow with accessible landmarks", () => {
    renderTransactionsPage();

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Registrar transação manual" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Transações de julho de 2026" })
    ).toHaveAttribute("aria-live", "polite");
    expect(
      screen.getByRole("region", { name: "Resumo mensal" })
    ).toHaveAttribute("aria-live", "polite");
    expect(
      screen.getByText("Nenhuma transação encontrada neste mês.")
    ).toHaveAttribute("role", "status");
    expect(
      screen.getByRole("link", { name: "Voltar ao dashboard" })
    ).toHaveAttribute("href", "/");
    expect(
      screen.getByRole("link", { name: "Gerenciar categorias" })
    ).toHaveAttribute("href", "/categories");
  });

  it("shows the persisted monthly income, expenses and net balance", () => {
    renderTransactionsPage({
      ...initialData,
      summary: {
        monthRef: "2026-07",
        incomeTotalInCents: 500000,
        expenseTotalInCents: 12550,
        netBalanceInCents: 487450,
        transactionCount: 2
      }
    });

    const summaryRegion = screen.getByRole("region", { name: "Resumo mensal" });

    expect(within(summaryRegion).getByText(/R\$\s*5\.000,00/)).toBeInTheDocument();
    expect(within(summaryRegion).getByText(/R\$\s*125,50/)).toBeInTheDocument();
    expect(within(summaryRegion).getByText(/R\$\s*4\.874,50/)).toBeInTheDocument();
    expect(within(summaryRegion).getByText("2")).toBeInTheDocument();
    expect(
      within(summaryRegion).getByRole("group", {
        name: /Receitas: R\$\s*5\.000,00/
      })
    ).toBeInTheDocument();
  });
});

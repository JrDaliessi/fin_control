import { describe, expect, it, jest } from "@jest/globals";
import { render, screen, within } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: jest.fn() })
}));

const { TransactionsPage } = jest.requireActual<
  typeof import("../presentation/pages/TransactionsPage")
>("../presentation/pages/TransactionsPage");

const initialData = {
  monthRef: "2026-07",
  accounts: [{ id: "account-1", name: "Conta principal" }],
  categories: [
    { id: "category-1", name: "Mercado", kind: "expense" as const }
  ],
  transactions: [
    {
      id: "transaction-1",
      accountId: "account-1",
      categoryId: "category-1",
      description: "Mercado",
      amountInCents: 12550,
      type: "expense" as const,
      paymentMethod: "manual" as const,
      occurredOn: "2026-07-08",
      createdAt: "2026-07-08T12:00:00.000Z",
      updatedAt: "2026-07-08T12:00:00.000Z"
    }
  ],
  summary: {
    monthRef: "2026-07",
    incomeTotalInCents: 0,
    expenseTotalInCents: 12550,
    netBalanceInCents: -12550,
    transactionCount: 1
  }
};

describe("persistent TransactionsPage", () => {
  it("renders persisted monthly data without session language", () => {
    render(
      <TransactionsPage
        initialData={initialData}
        onCreateTransaction={async () => initialData.transactions[0]}
      />
    );

    const transactionRegion = screen.getByRole("region", {
      name: "Transações de julho de 2026"
    });

    expect(within(transactionRegion).getByText("Mercado")).toBeInTheDocument();
    expect(screen.queryByText(/sessão/i)).not.toBeInTheDocument();
  });

  it("shows the persisted empty state when the month has no transactions", () => {
    render(
      <TransactionsPage
        initialData={{
          ...initialData,
          transactions: [],
          summary: {
            ...initialData.summary,
            expenseTotalInCents: 0,
            netBalanceInCents: 0,
            transactionCount: 0
          }
        }}
        onCreateTransaction={async () => initialData.transactions[0]}
      />
    );

    expect(
      screen.getByText("Nenhuma transação encontrada neste mês.")
    ).toHaveAttribute("role", "status");
  });

  it("blocks creation when there is no persisted account", () => {
    render(
      <TransactionsPage
        initialData={{ ...initialData, accounts: [] }}
        onCreateTransaction={async () => initialData.transactions[0]}
      />
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Cadastre uma conta antes de registrar transações."
    );
    expect(screen.getByRole("link", { name: "Cadastrar conta" })).toHaveAttribute(
      "href",
      "/accounts"
    );
    expect(screen.queryByRole("button", { name: "Registrar transação" })).not.toBeInTheDocument();
  });
});

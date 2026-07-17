import { describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: jest.fn() })
}));

jest.mock("@/app/(private)/transactions/actions", () => ({
  createTransactionAction: jest.fn(),
  loadTransactionsPageAction: jest.fn()
}));

import DashboardRoutePage from "../../../app/(private)/dashboard/page";
import HomePage from "../../../app/(private)/page";
import { AuthSessionProvider } from "../../auth/presentation/providers/AuthSessionProvider";
import { TransactionSessionProvider } from "../../transactions/presentation/providers/TransactionSessionProvider";

const { loadTransactionsPageAction } = jest.requireMock<
  typeof import("@/app/(private)/transactions/actions")
>("@/app/(private)/transactions/actions");
const { default: TransactionsRoutePage } = jest.requireActual<
  typeof import("@/app/(private)/transactions/page")
>("@/app/(private)/transactions/page");

function renderRoute(route: React.ReactNode) {
  render(
    <AuthSessionProvider
      user={{ id: "user-1", email: "usuario@example.com" }}
    >
      <TransactionSessionProvider>{route}</TransactionSessionProvider>
    </AuthSessionProvider>
  );
}

describe("dashboard routes", () => {
  it("should render the dashboard on the root route", () => {
    renderRoute(<HomePage />);

    expect(
      screen.getByRole("heading", { name: "Dashboard" })
    ).toBeInTheDocument();
  });

  it("should render the dashboard on /dashboard", () => {
    renderRoute(<DashboardRoutePage />);

    expect(
      screen.getByRole("heading", { name: "Dashboard" })
    ).toBeInTheDocument();
  });

  it("should render the manual transaction flow on /transactions", async () => {
    jest.mocked(loadTransactionsPageAction).mockResolvedValue({
      monthRef: "2026-07",
      accounts: [{ id: "account-1", name: "Conta corrente" }],
      categories: [
        { id: "category-1", name: "Mercado", kind: "expense" }
      ],
      transactions: [],
      summary: {
        monthRef: "2026-07",
        incomeTotalInCents: 0,
        expenseTotalInCents: 0,
        netBalanceInCents: 0,
        transactionCount: 0
      }
    });

    renderRoute(await TransactionsRoutePage());

    expect(
      screen.getByRole("heading", { name: "Registrar transação manual" })
    ).toBeInTheDocument();
  });
});

import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: jest.fn() })
}));

jest.mock("@/app/(private)/transactions/actions", () => ({
  createTransactionAction: jest.fn(),
  loadTransactionsPageAction: jest.fn()
}));

jest.mock("@/app/(private)/dashboard/load-financial-evolution", () => ({
  loadFinancialEvolution: jest.fn()
}));

jest.mock(
  "../../financial-analytics/presentation/components/FinancialEvolutionChart.client",
  () => ({
    FinancialEvolutionChart: () => null
  })
);

import { AuthSessionProvider } from "../../auth/presentation/providers/AuthSessionProvider";

const { loadTransactionsPageAction } = jest.requireMock<
  typeof import("@/app/(private)/transactions/actions")
>("@/app/(private)/transactions/actions");
const { loadFinancialEvolution } = jest.requireMock<
  typeof import("@/app/(private)/dashboard/load-financial-evolution")
>("@/app/(private)/dashboard/load-financial-evolution");
const { default: DashboardRoutePage } = jest.requireActual<
  typeof import("@/app/(private)/dashboard/page")
>("@/app/(private)/dashboard/page");
const { default: HomePage } = jest.requireActual<
  typeof import("@/app/(private)/page")
>("@/app/(private)/page");
const { default: TransactionsRoutePage } = jest.requireActual<
  typeof import("@/app/(private)/transactions/page")
>("@/app/(private)/transactions/page");

function renderRoute(route: React.ReactNode) {
  render(
    <AuthSessionProvider
      user={{ id: "user-1", email: "usuario@example.com" }}
    >
      {route}
    </AuthSessionProvider>
  );
}

const financialEvolutionResult = {
  status: "empty" as const,
  accountCount: 1,
  period: {
    kind: "month" as const,
    referenceOn: "2026-03-07",
    startOnInclusive: "2026-03-01",
    endOnExclusive: "2026-04-01"
  },
  summary: {
    openingBalanceInCents: 2_500,
    incomeInCents: 0,
    expenseInCents: 0,
    netInCents: 0,
    closingBalanceInCents: 2_500,
    transactionCount: 0
  },
  points: []
};

describe("dashboard routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(loadFinancialEvolution).mockResolvedValue(
      financialEvolutionResult
    );
  });

  it("should render the dashboard on the root route with month as default", async () => {
    renderRoute(
      await HomePage({ searchParams: Promise.resolve({}) })
    );

    expect(
      screen.getByRole("heading", { name: "Visão geral" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Como seu dinheiro evoluiu" })
    ).toBeInTheDocument();
    expect(loadFinancialEvolution).toHaveBeenCalledWith({ kind: "month" });
  });

  it("should render the dashboard on /dashboard with a supported period", async () => {
    renderRoute(
      await DashboardRoutePage({
        searchParams: Promise.resolve({ period: "rolling_15_days" })
      })
    );

    expect(
      screen.getByRole("heading", { name: "Visão geral" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Como seu dinheiro evoluiu" })
    ).toBeInTheDocument();
    expect(loadFinancialEvolution).toHaveBeenCalledWith({
      kind: "rolling_15_days"
    });
  });

  it("falls back to month for an unsupported URL period", async () => {
    renderRoute(
      await DashboardRoutePage({
        searchParams: Promise.resolve({ period: "custom" })
      })
    );

    expect(loadFinancialEvolution).toHaveBeenCalledWith({ kind: "month" });
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

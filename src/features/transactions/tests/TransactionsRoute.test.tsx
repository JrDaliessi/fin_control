import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: jest.fn() })
}));

jest.mock("@/app/(private)/transactions/actions", () => ({
  createTransactionAction: jest.fn(),
  loadTransactionsPageAction: jest.fn()
}));

const { loadTransactionsPageAction } = jest.requireMock<
  typeof import("@/app/(private)/transactions/actions")
>("@/app/(private)/transactions/actions");
const { default: TransactionsRoutePage } = jest.requireActual<
  typeof import("@/app/(private)/transactions/page")
>("@/app/(private)/transactions/page");
const { default: TransactionsLoading } = jest.requireActual<
  typeof import("@/app/(private)/transactions/loading")
>("@/app/(private)/transactions/loading");
const { default: TransactionsError } = jest.requireActual<
  typeof import("@/app/(private)/transactions/error")
>("@/app/(private)/transactions/error");
const { resolveDefaultTransactionMonthRef } = jest.requireActual<
  typeof import("@/app/(private)/transactions/resolve-default-transaction-month")
>("@/app/(private)/transactions/resolve-default-transaction-month");

const pageData = {
  monthRef: "2026-07",
  accounts: [{ id: "account-1", name: "Conta principal" }],
  categories: [{ id: "category-1", name: "Mercado", kind: "expense" as const }],
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

describe("transactions route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads persistent page data on the server", async () => {
    jest.mocked(loadTransactionsPageAction).mockResolvedValue(pageData);

    render(await TransactionsRoutePage());

    expect(screen.getAllByText("Mercado")).not.toHaveLength(0);
    expect(loadTransactionsPageAction).toHaveBeenCalledWith({
      monthRef: expect.stringMatching(/^\d{4}-(0[1-9]|1[0-2])$/)
    });
  });

  it("anchors the default month to the configured civil timezone", () => {
    expect(
      resolveDefaultTransactionMonthRef("2026-04-01T02:30:00.000Z")
    ).toBe("2026-03");
    expect(
      resolveDefaultTransactionMonthRef("2026-04-01T03:30:00.000Z")
    ).toBe("2026-04");
  });

  it("renders an accessible loading state", () => {
    render(<TransactionsLoading />);

    expect(screen.getByRole("main")).toHaveClass("min-h-dvh");
    expect(screen.getByRole("status")).toHaveTextContent(
      "Carregando suas transações..."
    );
  });

  it("renders a sanitized recoverable error state", async () => {
    const reset = jest.fn();
    const user = userEvent.setup();
    render(
      <TransactionsError
        error={new Error("sensitive provider detail")}
        reset={reset}
      />
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Não foi possível carregar suas transações."
    );
    expect(screen.queryByText("sensitive provider detail")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(reset).toHaveBeenCalledTimes(1);
  });
});

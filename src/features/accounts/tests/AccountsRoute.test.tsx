import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("@/app/(private)/accounts/actions", () => ({
  createAccountAction: jest.fn(),
  listAccountsAction: jest.fn()
}));

const { listAccountsAction } = jest.requireMock<
  typeof import("@/app/(private)/accounts/actions")
>("@/app/(private)/accounts/actions");
const { default: AccountsRoutePage } = jest.requireActual<
  typeof import("@/app/(private)/accounts/page")
>("@/app/(private)/accounts/page");
const { default: AccountsLoading } = jest.requireActual<
  typeof import("@/app/(private)/accounts/loading")
>("@/app/(private)/accounts/loading");
const { default: AccountsError } = jest.requireActual<
  typeof import("@/app/(private)/accounts/error")
>("@/app/(private)/accounts/error");

const persistedAccount = {
  id: "6ca6c81f-11a4-4a34-8090-2185bb0e63a8",
  name: "Conta persistida",
  type: "checking" as const,
  initialBalanceInCents: 150000,
  currency: "BRL" as const,
  createdAt: "2026-07-14T10:00:00.000Z",
  updatedAt: "2026-07-14T10:00:00.000Z"
};

describe("accounts route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads owned accounts on the server and composes the persistent flow", async () => {
    jest.mocked(listAccountsAction).mockResolvedValue([persistedAccount]);

    render(await AccountsRoutePage());

    expect(
      screen.getByRole("heading", { name: "Cadastrar conta financeira" })
    ).toBeInTheDocument();
    expect(screen.getByText("Conta persistida")).toBeInTheDocument();
    expect(listAccountsAction).toHaveBeenCalledTimes(1);
  });

  it("renders an accessible loading state", () => {
    render(<AccountsLoading />);

    expect(screen.getByRole("main")).toHaveClass("min-h-dvh");
    expect(screen.getByRole("status")).toHaveTextContent(
      "Carregando suas contas..."
    );
  });

  it("renders a sanitized recoverable error state", async () => {
    const reset = jest.fn();
    const user = userEvent.setup();

    render(<AccountsError error={new Error("sensitive provider detail")} reset={reset} />);

    expect(screen.getByRole("main")).toHaveClass("min-h-dvh");
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Não foi possível carregar suas contas."
    );
    expect(screen.queryByText("sensitive provider detail")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(reset).toHaveBeenCalledTimes(1);
  });
});

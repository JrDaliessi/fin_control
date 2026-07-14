import { describe, expect, it, jest } from "@jest/globals";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type {
  CreateAccountRequest,
  FinancialAccountDto
} from "../application/dtos/financial-account.dto";
import { AccountsPage } from "../presentation/pages/AccountsPage";

const persistedAccount: FinancialAccountDto = {
  id: "6ca6c81f-11a4-4a34-8090-2185bb0e63a8",
  name: "Conta do dia a dia",
  type: "payment",
  initialBalanceInCents: -25000,
  currency: "BRL",
  createdAt: "2026-07-14T10:00:00.000Z",
  updatedAt: "2026-07-14T10:00:00.000Z"
};

type CreateAccountHandler = (
  input: CreateAccountRequest
) => Promise<FinancialAccountDto>;

function renderAccountsPage(
  initialAccounts: readonly FinancialAccountDto[] = [],
  onCreateAccount: CreateAccountHandler = jest.fn<CreateAccountHandler>(
    async () => persistedAccount
  )
) {
  render(
    <AccountsPage
      initialAccounts={initialAccounts}
      onCreateAccount={onCreateAccount}
    />
  );

  return { onCreateAccount };
}

describe("AccountsPage", () => {
  it("renders the persistent account flow and its empty state", () => {
    renderAccountsPage();

    expect(screen.getByRole("main")).toHaveClass("min-h-dvh");
    expect(
      screen.getByRole("heading", { name: "Cadastrar conta financeira" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Suas contas" })
    ).toHaveAttribute("aria-live", "polite");
    expect(
      screen.getByRole("region", { name: "Suas contas" })
    ).toHaveAttribute("aria-relevant", "additions text");
    expect(
      screen.getByText("Nenhuma conta cadastrada.")
    ).toHaveAttribute("role", "status");
    expect(
      screen.queryByText(/dados permanecem somente nesta sessão/i)
    ).not.toBeInTheDocument();
    const backLink = screen.getByRole("link", { name: "Voltar ao dashboard" });

    expect(backLink).toHaveAttribute("href", "/");
    expect(backLink).toHaveClass("min-h-11");
  });

  it("creates through the injected server flow and lists its persisted result", async () => {
    const user = userEvent.setup();
    const { onCreateAccount } = renderAccountsPage();

    await user.type(screen.getByLabelText("Nome da conta"), "Conta do dia a dia");
    await user.selectOptions(screen.getByLabelText("Tipo de conta"), "payment");
    await user.type(screen.getByLabelText("Saldo inicial"), "-250,00");
    await user.click(screen.getByRole("button", { name: "Cadastrar conta" }));

    expect(onCreateAccount).toHaveBeenCalledWith({
      name: "Conta do dia a dia",
      type: "payment",
      initialBalanceInCents: -25000,
      currency: "BRL"
    });
    const region = screen.getByRole("region", { name: "Suas contas" });

    expect(await within(region).findByText("Conta do dia a dia")).toBeInTheDocument();
    expect(within(region).getByText("Conta de pagamento")).toBeInTheDocument();
    expect(within(region).getByText(/-R\$\s*250,00/)).toBeInTheDocument();
  });

  it("keeps a long account name breakable on narrow screens", async () => {
    const user = userEvent.setup();
    const longName = "ContaComNomeMuitoLongoSemEspacosParaValidarQuebraResponsiva";
    renderAccountsPage([], async () => ({ ...persistedAccount, name: longName }));

    await user.type(screen.getByLabelText("Nome da conta"), longName);
    await user.type(screen.getByLabelText("Saldo inicial"), "0,00");
    await user.click(screen.getByRole("button", { name: "Cadastrar conta" }));

    expect(await screen.findByText(longName)).toHaveClass("break-words");
  });

  it("renders accounts loaded by the server before client interaction", () => {
    renderAccountsPage([persistedAccount]);

    const region = screen.getByRole("region", { name: "Suas contas" });

    expect(within(region).getByText("Conta do dia a dia")).toBeInTheDocument();
    expect(within(region).getByText(/-R\$\s*250,00/)).toBeInTheDocument();
  });
});

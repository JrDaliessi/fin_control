import { describe, expect, it } from "@jest/globals";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AccountsPage } from "../presentation/pages/AccountsPage";
import { AccountSessionProvider } from "../presentation/providers/AccountSessionProvider";

function renderAccountsPage() {
  render(
    <AccountSessionProvider>
      <AccountsPage />
    </AccountSessionProvider>
  );
}

describe("AccountsPage", () => {
  it("renders the local account flow and its empty state", () => {
    renderAccountsPage();

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Cadastrar conta financeira" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Contas desta sessão" })
    ).toHaveAttribute("aria-live", "polite");
    expect(
      screen.getByText("Nenhuma conta cadastrada nesta sessão.")
    ).toHaveAttribute("role", "status");
    expect(
      screen.getByRole("link", { name: "Voltar ao dashboard" })
    ).toHaveAttribute("href", "/");
  });

  it("creates and lists an account with a negative informed balance", async () => {
    const user = userEvent.setup();
    renderAccountsPage();

    await user.type(screen.getByLabelText("Nome da conta"), "Conta do dia a dia");
    await user.selectOptions(screen.getByLabelText("Tipo de conta"), "payment");
    await user.type(screen.getByLabelText("Saldo inicial"), "-250,00");
    await user.click(screen.getByRole("button", { name: "Cadastrar conta" }));

    const region = screen.getByRole("region", { name: "Contas desta sessão" });

    expect(await within(region).findByText("Conta do dia a dia")).toBeInTheDocument();
    expect(within(region).getByText("Conta de pagamento")).toBeInTheDocument();
    expect(within(region).getByText(/-R\$\s*250,00/)).toBeInTheDocument();
  });
});

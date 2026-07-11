import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  FinancialAccount,
  type CreateFinancialAccountInput
} from "../domain/entities/financial-account.entity";
import {
  AccountSessionProvider,
  useAccountSession
} from "../presentation/providers/AccountSessionProvider";

const input: CreateFinancialAccountInput = {
  userId: "user-1",
  name: "Conta principal",
  type: "checking",
  initialBalanceInCents: 150000,
  currency: "BRL"
};

function SessionConsumer() {
  const { accounts, createAccount } = useAccountSession();

  return (
    <div>
      <output aria-label="Quantidade de contas">{accounts.length}</output>
      <output aria-label="Primeira conta">
        {accounts[0]?.name ?? "Sem conta"}
      </output>
      <button onClick={() => void createAccount(input)} type="button">
        Adicionar conta
      </button>
      <button
        onClick={() =>
          void createAccount(input).then((createdAccount) => {
            (createdAccount as { name: string }).name = "Retorno alterado";
          })
        }
        type="button"
      >
        Adicionar e alterar retorno
      </button>
    </div>
  );
}

describe("AccountSessionProvider", () => {
  it("exposes initial accounts", () => {
    render(
      <AccountSessionProvider initialAccounts={[FinancialAccount.create(input)]}>
        <SessionConsumer />
      </AccountSessionProvider>
    );

    expect(screen.getByLabelText("Quantidade de contas")).toHaveTextContent("1");
    expect(screen.getByLabelText("Primeira conta")).toHaveTextContent(
      "Conta principal"
    );
  });

  it("creates a validated account in the in-memory session", async () => {
    const user = userEvent.setup();
    render(
      <AccountSessionProvider>
        <SessionConsumer />
      </AccountSessionProvider>
    );

    await user.click(screen.getByRole("button", { name: "Adicionar conta" }));

    expect(screen.getByLabelText("Quantidade de contas")).toHaveTextContent("1");
    expect(screen.getByLabelText("Primeira conta")).toHaveTextContent(
      "Conta principal"
    );
  });

  it("isolates initial session state from external mutations", () => {
    const initialAccount = FinancialAccount.create(input);
    const { rerender } = render(
      <AccountSessionProvider initialAccounts={[initialAccount]}>
        <SessionConsumer />
      </AccountSessionProvider>
    );

    (initialAccount as { name: string }).name = "Conta alterada externamente";
    rerender(
      <AccountSessionProvider initialAccounts={[initialAccount]}>
        <SessionConsumer />
      </AccountSessionProvider>
    );

    expect(screen.getByLabelText("Primeira conta")).toHaveTextContent(
      "Conta principal"
    );
  });

  it("isolates stored session state from mutations to the returned account", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <AccountSessionProvider>
        <SessionConsumer />
      </AccountSessionProvider>
    );

    await user.click(
      screen.getByRole("button", { name: "Adicionar e alterar retorno" })
    );
    rerender(
      <AccountSessionProvider>
        <SessionConsumer />
      </AccountSessionProvider>
    );

    expect(screen.getByLabelText("Primeira conta")).toHaveTextContent(
      "Conta principal"
    );
  });
});

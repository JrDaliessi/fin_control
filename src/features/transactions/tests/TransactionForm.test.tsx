import { describe, expect, it } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { CreateTransactionInput } from "../domain/entities/transaction.entity";
import { TransactionForm } from "../presentation/components/TransactionForm";

const accountOptions = [
  {
    id: "account-1",
    name: "Conta corrente"
  }
];

const categoryOptions = [
  {
    id: "category-1",
    name: "Mercado"
  }
];

type OnCreateTransaction = (input: CreateTransactionInput) => Promise<void>;

function renderTransactionForm(onSubmit: OnCreateTransaction = async () => undefined) {
  render(
    <TransactionForm
      userId="user-1"
      accounts={accountOptions}
      categories={categoryOptions}
      onCreateTransaction={onSubmit}
    />
  );

  return {
    onSubmit,
    user: userEvent.setup()
  };
}

describe("TransactionForm", () => {
  it("submits a valid manual expense transaction", async () => {
    let submittedInput: CreateTransactionInput | null = null;
    const { user } = renderTransactionForm(async (input) => {
      submittedInput = input;
    });

    await user.type(screen.getByLabelText("Descricao"), "Mercado");
    await user.type(screen.getByLabelText("Valor"), "125,50");
    await user.selectOptions(screen.getByLabelText("Tipo"), "expense");
    await user.selectOptions(screen.getByLabelText("Conta"), "account-1");
    await user.selectOptions(screen.getByLabelText("Categoria"), "category-1");
    await user.type(screen.getByLabelText("Data"), "2026-07-08");
    await user.click(screen.getByRole("button", { name: "Registrar transacao" }));

    await waitFor(() => {
      expect(submittedInput).toEqual({
        userId: "user-1",
        accountId: "account-1",
        categoryId: "category-1",
        description: "Mercado",
        amountInCents: 12550,
        type: "expense",
        occurredAt: new Date("2026-07-08T00:00:00.000Z")
      });
    });
  });

  it("shows loading and success states", async () => {
    let resolveSubmit: () => void = () => undefined;
    const onSubmit = async () =>
      new Promise<void>((resolve) => {
        resolveSubmit = resolve;
      });
    const { user } = renderTransactionForm(onSubmit);

    await user.type(screen.getByLabelText("Descricao"), "Salario");
    await user.type(screen.getByLabelText("Valor"), "3100");
    await user.selectOptions(screen.getByLabelText("Tipo"), "income");
    await user.type(screen.getByLabelText("Data"), "2026-07-08");
    await user.click(screen.getByRole("button", { name: "Registrar transacao" }));

    const submitButton = screen.getByRole("button", { name: "Salvando..." });
    expect((submitButton as HTMLButtonElement).disabled).toBe(true);

    resolveSubmit();

    expect(
      await screen.findByText("Transacao registrada com sucesso.")
    ).not.toBeNull();
  });

  it("shows an error state when creation fails", async () => {
    const { user } = renderTransactionForm(
      async () => {
        throw new Error("Falha ao registrar transacao");
      }
    );

    await user.type(screen.getByLabelText("Descricao"), "Mercado");
    await user.type(screen.getByLabelText("Valor"), "125,50");
    await user.type(screen.getByLabelText("Data"), "2026-07-08");
    await user.click(screen.getByRole("button", { name: "Registrar transacao" }));

    expect(await screen.findByText("Falha ao registrar transacao")).not.toBeNull();
  });

  it("keeps invalid form data in the presentation layer and does not submit", async () => {
    let submitCount = 0;
    const { user } = renderTransactionForm(async () => {
      submitCount += 1;
    });

    await user.type(screen.getByLabelText("Descricao"), "Mercado");
    await user.type(screen.getByLabelText("Valor"), "0");
    await user.type(screen.getByLabelText("Data"), "2026-07-08");
    await user.click(screen.getByRole("button", { name: "Registrar transacao" }));

    expect(await screen.findByText("Informe um valor maior que zero.")).not.toBeNull();
    expect(submitCount).toBe(0);
  });
});

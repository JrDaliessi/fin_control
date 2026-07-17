import { describe, expect, it, jest } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { CreateTransactionRequest } from "../application/dtos/transaction.dto";
import { TransactionForm } from "../presentation/components/TransactionForm";

const accounts = [{ id: "account-1", name: "Conta principal" }];
const categories = [
  { id: "expense-1", name: "Mercado", kind: "expense" as const },
  { id: "income-1", name: "Salário", kind: "income" as const }
];

describe("persistent TransactionForm", () => {
  it("submits a civil-date request without user authority", async () => {
    const onCreateTransaction = jest.fn(
      async (input: CreateTransactionRequest) => {
        void input;
      }
    );
    const user = userEvent.setup();

    render(
      <TransactionForm
        accounts={accounts}
        categories={categories}
        onCreateTransaction={onCreateTransaction}
      />
    );

    await user.type(screen.getByLabelText("Descrição"), "Mercado");
    await user.type(screen.getByLabelText("Valor"), "125,50");
    await user.type(screen.getByLabelText("Data"), "2026-07-08");
    await user.click(screen.getByRole("button", { name: "Registrar transação" }));

    await waitFor(() => {
      expect(onCreateTransaction).toHaveBeenCalledWith({
        accountId: "account-1",
        categoryId: "expense-1",
        description: "Mercado",
        amountInCents: 12550,
        type: "expense",
        occurredOn: "2026-07-08"
      });
    });
    expect(onCreateTransaction.mock.calls[0]?.[0]).not.toHaveProperty("userId");
  });

  it("shows only categories compatible with the selected type", async () => {
    const user = userEvent.setup();
    render(
      <TransactionForm
        accounts={accounts}
        categories={categories}
        onCreateTransaction={async () => undefined}
      />
    );

    expect(screen.getByRole("option", { name: "Mercado" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Salário" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "Receita" }));

    expect(screen.getByRole("option", { name: "Salário" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Mercado" })).not.toBeInTheDocument();
  });
});

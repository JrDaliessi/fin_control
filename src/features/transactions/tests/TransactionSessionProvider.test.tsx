import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { CreateTransactionInput } from "../domain/entities/transaction.entity";
import {
  TransactionSessionProvider,
  useTransactionSession
} from "../presentation/providers/TransactionSessionProvider";

const transaction: CreateTransactionInput = {
  userId: "user-1",
  accountId: "account-1",
  categoryId: "category-1",
  description: "Mercado",
  amountInCents: 12550,
  type: "expense",
  occurredAt: new Date("2026-07-08T12:00:00Z")
};

function SessionConsumer() {
  const { addTransaction, transactions } = useTransactionSession();

  return (
    <div>
      <output aria-label="Quantidade de transações">
        {transactions.length}
      </output>
      <button onClick={() => void addTransaction(transaction)} type="button">
        Adicionar transação
      </button>
    </div>
  );
}

describe("TransactionSessionProvider", () => {
  it("should expose initial transactions", () => {
    render(
      <TransactionSessionProvider initialTransactions={[transaction]}>
        <SessionConsumer />
      </TransactionSessionProvider>
    );

    expect(screen.getByLabelText("Quantidade de transações")).toHaveTextContent(
      "1"
    );
  });

  it("should add a transaction to the shared in-memory session", async () => {
    const user = userEvent.setup();

    render(
      <TransactionSessionProvider>
        <SessionConsumer />
      </TransactionSessionProvider>
    );

    await user.click(screen.getByRole("button", { name: "Adicionar transação" }));

    expect(screen.getByLabelText("Quantidade de transações")).toHaveTextContent(
      "1"
    );
  });
});

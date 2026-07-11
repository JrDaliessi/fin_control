import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { CreateTransactionInput } from "../domain/entities/transaction.entity";
import {
  TransactionSessionProvider,
  useTransactionSession
} from "../presentation/providers/TransactionSessionProvider";

function makeTransaction(): CreateTransactionInput {
  return {
    userId: "user-1",
    accountId: "account-1",
    categoryId: "category-1",
    description: "Mercado",
    amountInCents: 12550,
    type: "expense",
    occurredAt: new Date("2026-07-08T12:00:00Z")
  };
}

type SessionConsumerProps = {
  transactionToAdd: CreateTransactionInput;
};

function SessionConsumer({ transactionToAdd }: SessionConsumerProps) {
  const { addTransaction, transactions } = useTransactionSession();

  return (
    <div>
      <output aria-label="Quantidade de transações">
        {transactions.length}
      </output>
      <output aria-label="Primeira descrição">
        {transactions[0]?.description ?? "Sem transação"}
      </output>
      <button
        onClick={() => void addTransaction(transactionToAdd)}
        type="button"
      >
        Adicionar transação
      </button>
    </div>
  );
}

describe("TransactionSessionProvider", () => {
  it("should expose initial transactions", () => {
    const transaction = makeTransaction();

    render(
      <TransactionSessionProvider initialTransactions={[transaction]}>
        <SessionConsumer transactionToAdd={makeTransaction()} />
      </TransactionSessionProvider>
    );

    expect(screen.getByLabelText("Quantidade de transações")).toHaveTextContent(
      "1"
    );
  });

  it("should add a transaction to the shared in-memory session", async () => {
    const user = userEvent.setup();
    const transaction = makeTransaction();

    render(
      <TransactionSessionProvider>
        <SessionConsumer transactionToAdd={transaction} />
      </TransactionSessionProvider>
    );

    await user.click(screen.getByRole("button", { name: "Adicionar transação" }));

    expect(screen.getByLabelText("Quantidade de transações")).toHaveTextContent(
      "1"
    );
  });

  it("should isolate session state from mutations to the submitted input", async () => {
    const user = userEvent.setup();
    const transaction = makeTransaction();
    const { rerender } = render(
      <TransactionSessionProvider>
        <SessionConsumer transactionToAdd={transaction} />
      </TransactionSessionProvider>
    );

    await user.click(screen.getByRole("button", { name: "Adicionar transação" }));

    transaction.description = "Descrição alterada externamente";
    transaction.occurredAt.setUTCMonth(11);
    rerender(
      <TransactionSessionProvider>
        <SessionConsumer transactionToAdd={transaction} />
      </TransactionSessionProvider>
    );

    expect(screen.getByLabelText("Primeira descrição")).toHaveTextContent(
      "Mercado"
    );
  });
});

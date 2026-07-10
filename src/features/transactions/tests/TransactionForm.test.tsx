import { describe, expect, it } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { CreateTransactionInput } from "../domain/entities/transaction.entity";
import { TransactionForm } from "../presentation/components/TransactionForm";
import { parseTransactionAmountToCents } from "../presentation/utils/parseTransactionAmountToCents";

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

async function selectTransactionType(
  user: ReturnType<typeof userEvent.setup>,
  type: "Despesa" | "Receita"
) {
  await user.click(screen.getByRole("radio", { name: type }));
}

describe("TransactionForm", () => {
  describe("parseTransactionAmountToCents", () => {
    it.each([
      ["125,50", 12550],
      ["125.50", 12550],
      ["1.234,56", 123456],
      ["3100", 310000]
    ])("parses %s to cents", (input, expectedAmountInCents) => {
      expect(parseTransactionAmountToCents(input)).toBe(expectedAmountInCents);
    });

    it.each(["", "abc", "12,345", "1.2.3"])(
      "rejects invalid amount input %s",
      (input) => {
        expect(parseTransactionAmountToCents(input)).toBeNull();
      }
    );
  });

  it("submits a valid manual expense transaction", async () => {
    let submittedInput: CreateTransactionInput | null = null;
    const { user } = renderTransactionForm(async (input) => {
      submittedInput = input;
    });

    await user.type(screen.getByLabelText("Descrição"), "Mercado");
    await user.type(screen.getByLabelText("Valor"), "125,50");
    await selectTransactionType(user, "Despesa");
    await user.selectOptions(screen.getByLabelText("Conta"), "account-1");
    await user.selectOptions(screen.getByLabelText("Categoria"), "category-1");
    await user.type(screen.getByLabelText("Data"), "2026-07-08");
    await user.click(screen.getByRole("button", { name: "Registrar transação" }));

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

    await user.type(screen.getByLabelText("Descrição"), "Salario");
    await user.type(screen.getByLabelText("Valor"), "3100");
    await selectTransactionType(user, "Receita");
    await user.type(screen.getByLabelText("Data"), "2026-07-08");
    await user.click(screen.getByRole("button", { name: "Registrar transação" }));

    const submitButton = screen.getByRole("button", { name: "Salvando..." });
    expect((submitButton as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByRole("form", { name: "Registro manual de transação" })).toHaveAttribute(
      "aria-busy",
      "true"
    );

    resolveSubmit();

    expect(
      await screen.findByText("Transação registrada com sucesso.")
    ).not.toBeNull();
  });

  it("shows an error state when creation fails", async () => {
    const { user } = renderTransactionForm(
      async () => {
        throw new Error("Falha ao registrar transação");
      }
    );

    await user.type(screen.getByLabelText("Descrição"), "Mercado");
    await user.type(screen.getByLabelText("Valor"), "125,50");
    await user.type(screen.getByLabelText("Data"), "2026-07-08");
    await user.click(screen.getByRole("button", { name: "Registrar transação" }));

    expect(await screen.findByText("Falha ao registrar transação")).not.toBeNull();
  });

  it("keeps invalid form data in the presentation layer and does not submit", async () => {
    let submitCount = 0;
    const { user } = renderTransactionForm(async () => {
      submitCount += 1;
    });

    const amountInput = screen.getByLabelText("Valor");

    await user.type(screen.getByLabelText("Descrição"), "Mercado");
    await user.type(amountInput, "0");
    await user.type(screen.getByLabelText("Data"), "2026-07-08");
    await user.click(screen.getByRole("button", { name: "Registrar transação" }));

    expect(await screen.findByText("Informe um valor maior que zero.")).not.toBeNull();
    expect(amountInput).toHaveAttribute("aria-invalid", "true");
    expect(submitCount).toBe(0);
  });

  it("exposes required fields and helper text to assistive technology", () => {
    renderTransactionForm();

    expect(screen.getByRole("form", { name: "Registro manual de transação" })).toBeInTheDocument();
    expect(screen.getByRole("radiogroup", { name: "Tipo" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Despesa" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Receita" })).not.toBeChecked();
    expect(screen.getByLabelText("Descrição")).toBeRequired();
    expect(screen.getByLabelText("Valor")).toHaveAccessibleDescription(
      "Use reais com vírgula ou ponto, por exemplo 125,50."
    );
    expect(screen.getByLabelText("Data")).toBeRequired();
  });
});

import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { within } from "@testing-library/react";
import { TransactionsPage } from "../presentation/pages/TransactionsPage";

describe("TransactionsPage", () => {
  it("renders the manual transaction flow with accessible landmarks", async () => {
    render(<TransactionsPage />);

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Registrar transação manual" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Lançamentos desta sessão" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Resumo mensal" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Lançamentos desta sessão" })
    ).toHaveAttribute("aria-live", "polite");
    expect(
      screen.getByRole("region", { name: "Resumo mensal" })
    ).toHaveAttribute("aria-live", "polite");
    expect(
      screen.getByText("Nenhuma transação registrada nesta sessão.")
    ).toHaveAttribute("role", "status");
    expect(
      await within(
        screen.getByRole("region", { name: "Resumo mensal" })
      ).findByText("Nenhuma transação no mês selecionado.")
    ).toHaveAttribute("role", "status");
  });

  it("shows monthly income, expenses and net balance from session transactions", async () => {
    const user = userEvent.setup();
    render(<TransactionsPage />);

    await user.type(screen.getByLabelText("Descrição"), "Salario");
    await user.type(screen.getByLabelText("Valor"), "5000");
    await user.click(screen.getByRole("radio", { name: "Receita" }));
    await user.type(screen.getByLabelText("Data"), "2026-07-05");
    await user.click(screen.getByRole("button", { name: "Registrar transação" }));

    await user.type(screen.getByLabelText("Descrição"), "Mercado");
    await user.type(screen.getByLabelText("Valor"), "125,50");
    await user.click(screen.getByRole("radio", { name: "Despesa" }));
    await user.type(screen.getByLabelText("Data"), "2026-07-08");
    await user.click(screen.getByRole("button", { name: "Registrar transação" }));

    const summaryRegion = screen.getByRole("region", { name: "Resumo mensal" });

    expect(await within(summaryRegion).findByText(/R\$\s*5\.000,00/)).toBeInTheDocument();
    expect(within(summaryRegion).getByText(/R\$\s*125,50/)).toBeInTheDocument();
    expect(within(summaryRegion).getByText(/R\$\s*4\.874,50/)).toBeInTheDocument();
    expect(within(summaryRegion).getByText("2")).toBeInTheDocument();
    expect(
      within(summaryRegion).getByRole("group", { name: /Receitas: R\$\s*5\.000,00/ })
    ).toBeInTheDocument();
  });
});

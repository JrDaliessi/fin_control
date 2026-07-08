import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { TransactionsPage } from "../presentation/pages/TransactionsPage";

describe("TransactionsPage", () => {
  it("renders the manual transaction flow with accessible landmarks", () => {
    render(<TransactionsPage />);

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Registrar transação manual" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Lançamentos desta sessão" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Nenhuma transação registrada nesta sessão.")
    ).toHaveAttribute("role", "status");
  });
});

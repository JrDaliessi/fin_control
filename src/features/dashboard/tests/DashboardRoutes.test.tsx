import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import DashboardRoutePage from "../../../app/dashboard/page";
import HomePage from "../../../app/page";
import TransactionsRoutePage from "../../../app/transactions/page";
import { TransactionSessionProvider } from "../../transactions/presentation/providers/TransactionSessionProvider";

function renderRoute(route: React.ReactNode) {
  render(
    <TransactionSessionProvider>{route}</TransactionSessionProvider>
  );
}

describe("dashboard routes", () => {
  it("should render the dashboard on the root route", () => {
    renderRoute(<HomePage />);

    expect(
      screen.getByRole("heading", { name: "Dashboard" })
    ).toBeInTheDocument();
  });

  it("should render the dashboard on /dashboard", () => {
    renderRoute(<DashboardRoutePage />);

    expect(
      screen.getByRole("heading", { name: "Dashboard" })
    ).toBeInTheDocument();
  });

  it("should render the manual transaction flow on /transactions", () => {
    renderRoute(<TransactionsRoutePage />);

    expect(
      screen.getByRole("heading", { name: "Registrar transação manual" })
    ).toBeInTheDocument();
  });
});

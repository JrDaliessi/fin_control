import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import DashboardRoutePage from "../../../app/(private)/dashboard/page";
import HomePage from "../../../app/(private)/page";
import TransactionsRoutePage from "../../../app/(private)/transactions/page";
import { AuthSessionProvider } from "../../auth/presentation/providers/AuthSessionProvider";
import { TransactionSessionProvider } from "../../transactions/presentation/providers/TransactionSessionProvider";

function renderRoute(route: React.ReactNode) {
  render(
    <AuthSessionProvider
      user={{ id: "user-1", email: "usuario@example.com" }}
    >
      <TransactionSessionProvider>{route}</TransactionSessionProvider>
    </AuthSessionProvider>
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

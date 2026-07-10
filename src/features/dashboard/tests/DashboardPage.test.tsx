import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { DashboardPage } from "../presentation/pages/DashboardPage";

describe("DashboardPage", () => {
  it("should render the dashboard heading", () => {
    render(<DashboardPage />);

    expect(
      screen.getByRole("heading", { name: /dashboard/i })
    ).toBeInTheDocument();
  });

  it("should render the empty state when there are no transactions", () => {
    render(<DashboardPage />);

    expect(
      screen.getByText(/nenhuma transação registrada/i)
    ).toBeInTheDocument();
  });

  it("should render a call-to-action link to register a transaction", () => {
    render(<DashboardPage />);

    const ctaLink = screen.getByRole("link", {
      name: /registrar.*transação/i
    });

    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute("href", "/transactions");
  });

  it("should have a main landmark", () => {
    render(<DashboardPage />);

    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});

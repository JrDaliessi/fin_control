import { describe, expect, it } from "@jest/globals";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FinancialPeriodSelector } from "../presentation/components/FinancialPeriodSelector";

describe("FinancialPeriodSelector", () => {
  it("offers the five supported periods as an immediate accessible bar", () => {
    render(<FinancialPeriodSelector selectedPeriodKind="rolling_7_days" />);

    const periodBar = screen.getByRole("group", {
      name: "Período da evolução financeira"
    });
    const periodButtons = within(periodBar).getAllByRole("button");

    expect(periodButtons.map((button) => button.textContent)).toEqual([
      "Semana",
      "7D",
      "Quinzena",
      "15D",
      "Mês"
    ]);
    expect(periodBar).toHaveClass("max-w-full", "overflow-x-auto");
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Atualizar período" })
    ).not.toBeInTheDocument();
  });

  it("submits each existing URL value through a progressive GET form", () => {
    render(<FinancialPeriodSelector selectedPeriodKind="rolling_7_days" />);

    const expectedPeriods = [
      ["Semana atual", "week"],
      ["Últimos 7 dias", "rolling_7_days"],
      ["Quinzena atual", "fortnight"],
      ["Últimos 15 dias", "rolling_15_days"],
      ["Mês atual", "month"]
    ] as const;

    for (const [accessibleName, value] of expectedPeriods) {
      const button = screen.getByRole("button", { name: accessibleName });

      expect(button).toHaveAttribute("type", "submit");
      expect(button).toHaveAttribute("name", "period");
      expect(button).toHaveAttribute("value", value);
      expect(button).toHaveClass("min-h-11", "shrink-0");
      expect(button.closest("form")).toHaveAttribute("method", "get");
    }
  });

  it("identifies the selected period semantically and without relying only on color", () => {
    render(<FinancialPeriodSelector selectedPeriodKind="rolling_7_days" />);

    const selected = screen.getByRole("button", { name: "Últimos 7 dias" });
    const unselected = screen.getByRole("button", { name: "Semana atual" });

    expect(selected).toHaveAttribute("aria-pressed", "true");
    expect(selected).toHaveClass("ring-2");
    expect(unselected).toHaveAttribute("aria-pressed", "false");
    expect(unselected).not.toHaveClass("ring-2");
  });

  it.each([
    ["week", "Semana atual"],
    ["rolling_7_days", "Últimos 7 dias"],
    ["fortnight", "Quinzena atual"],
    ["rolling_15_days", "Últimos 15 dias"],
    ["month", "Mês atual"]
  ] as const)(
    "keeps only %s selected when rendering the period bar",
    (selectedPeriodKind, selectedAccessibleName) => {
      render(
        <FinancialPeriodSelector selectedPeriodKind={selectedPeriodKind} />
      );

      const periodButtons = within(
        screen.getByRole("group", {
          name: "Período da evolução financeira"
        })
      ).getAllByRole("button");

      expect(
        periodButtons.filter(
          (button) => button.getAttribute("aria-pressed") === "true"
        )
      ).toEqual([
        screen.getByRole("button", { name: selectedAccessibleName })
      ]);
    }
  );

  it("briefly explains the difference between calendar and rolling periods", () => {
    render(<FinancialPeriodSelector selectedPeriodKind="rolling_7_days" />);

    const periodBar = screen.getByRole("group", {
      name: "Período da evolução financeira"
    });
    const guidance = screen.getByText(
      "Semana e Quinzena seguem o calendário; 7D e 15D contam até hoje."
    );

    expect(guidance).toHaveAttribute("id", "financial-period-guidance");
    expect(periodBar).toHaveAttribute(
      "aria-describedby",
      "financial-period-guidance"
    );
  });

  it("keeps a predictable keyboard order and respects reduced motion", async () => {
    const user = userEvent.setup();

    render(<FinancialPeriodSelector selectedPeriodKind="rolling_7_days" />);

    const expectedOrder = [
      "Semana atual",
      "Últimos 7 dias",
      "Quinzena atual",
      "Últimos 15 dias",
      "Mês atual"
    ] as const;

    for (const accessibleName of expectedOrder) {
      await user.tab();
      expect(
        screen.getByRole("button", { name: accessibleName })
      ).toHaveFocus();
    }

    expect(screen.getByRole("button", { name: "Últimos 7 dias" })).toHaveClass(
      "motion-reduce:transition-none"
    );
  });
});

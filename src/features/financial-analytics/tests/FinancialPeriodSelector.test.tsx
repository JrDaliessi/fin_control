import { describe, expect, it, jest } from "@jest/globals";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { FinancialPeriodKind } from "../domain/types/financial-period.types";
import { FinancialPeriodSelector } from "../presentation/components/FinancialPeriodSelector";

describe("FinancialPeriodSelector", () => {
  it("brings the selected period into view on narrow scrollable bars", () => {
    const scrollTo = jest.fn();
    Object.defineProperty(HTMLElement.prototype, "scrollTo", {
      configurable: true,
      value: scrollTo
    });

    render(<FinancialPeriodSelector selectedPeriodKind="three_months" />);

    expect(scrollTo).toHaveBeenCalledWith({
      behavior: "auto",
      left: 0
    });
    Reflect.deleteProperty(HTMLElement.prototype, "scrollTo");
  });

  it("offers the seven supported periods as an immediate accessible bar", () => {
    render(<FinancialPeriodSelector selectedPeriodKind="rolling_7_days" />);

    const periodBar = screen.getByRole("group", {
      name: "Período da evolução financeira"
    });
    const periodButtons = within(periodBar).getAllByRole("button");

    expect(periodButtons.map((button) => button.getAttribute("aria-label"))).toEqual([
      "Semana atual",
      "Últimos 7 dias",
      "Quinzena atual",
      "Últimos 15 dias",
      "Mês atual",
      "Três meses civis",
      "Ano atual"
    ]);
    expect(periodBar).toHaveClass(
      "max-w-full",
      "overflow-x-auto",
      "touch-pan-x"
    );
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Atualizar período" })
    ).not.toBeInTheDocument();
  });

  it("keeps every period discoverable on narrow screens with compact labels", () => {
    render(<FinancialPeriodSelector selectedPeriodKind="month" />);

    const periodBar = screen.getByRole("group", {
      name: "Período da evolução financeira"
    });
    const weekButton = screen.getByRole("button", { name: "Semana atual" });
    const fortnightButton = screen.getByRole("button", {
      name: "Quinzena atual"
    });

    expect(periodBar).toHaveClass("gap-1", "p-1", "sm:gap-2");
    expect(weekButton).toHaveTextContent("Sem.");
    expect(fortnightButton).toHaveTextContent("Quinz.");
    expect(within(weekButton).getByText("Sem.")).toHaveClass("sm:hidden");
    expect(within(weekButton).getByText("Semana")).toHaveClass(
      "hidden",
      "sm:inline"
    );
    expect(weekButton).toHaveClass("!px-2", "sm:!px-4");
  });

  it("submits each existing URL value through a progressive GET form", () => {
    render(<FinancialPeriodSelector selectedPeriodKind="rolling_7_days" />);

    const expectedPeriods = [
      ["Semana atual", "week"],
      ["Últimos 7 dias", "rolling_7_days"],
      ["Quinzena atual", "fortnight"],
      ["Últimos 15 dias", "rolling_15_days"],
      ["Mês atual", "month"],
      ["Três meses civis", "three_months"],
      ["Ano atual", "year"]
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
    ["month", "Mês atual"],
    ["three_months" as FinancialPeriodKind, "Três meses civis"],
    ["year" as FinancialPeriodKind, "Ano atual"]
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
      "Semana, Quinzena, 3M e Ano seguem o calendário; 7D e 15D contam até hoje."
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
      "Mês atual",
      "Três meses civis",
      "Ano atual"
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

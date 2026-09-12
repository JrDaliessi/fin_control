import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen, within } from "@testing-library/react";
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

  it("offers the nine supported period choices as an accessible bar", () => {
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
      "Ano atual",
      "Todo o histórico",
      "Escolher período personalizado"
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

  it("submits each preset URL value through a progressive GET form", () => {
    render(<FinancialPeriodSelector selectedPeriodKind="rolling_7_days" />);

    const expectedPeriods = [
      ["Semana atual", "week"],
      ["Últimos 7 dias", "rolling_7_days"],
      ["Quinzena atual", "fortnight"],
      ["Últimos 15 dias", "rolling_15_days"],
      ["Mês atual", "month"],
      ["Três meses civis", "three_months"],
      ["Ano atual", "year"],
      ["Todo o histórico", "all"]
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

  it("keeps the custom choice as a date-dialog trigger instead of an incomplete GET", () => {
    render(<FinancialPeriodSelector selectedPeriodKind="month" />);

    const customTrigger = screen.getByRole("button", {
      name: "Escolher período personalizado"
    });

    expect(customTrigger).toHaveAttribute("type", "button");
    expect(customTrigger).not.toHaveAttribute("name", "period");
    expect(customTrigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(customTrigger).toHaveAttribute("aria-expanded", "false");
  });

  it("opens an accessible responsive dialog and focuses the initial date", async () => {
    const user = userEvent.setup();

    render(<FinancialPeriodSelector selectedPeriodKind="month" />);

    const trigger = screen.getByRole("button", {
      name: "Escolher período personalizado"
    });
    await user.click(trigger);

    const dialog = screen.getByRole("dialog", {
      name: "Escolher período personalizado"
    });
    const fromInput = screen.getByLabelText("Data inicial");

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveClass("bottom-0", "sm:rounded-2xl");
    expect(fromInput).toHaveAttribute("type", "date");
    expect(fromInput).toHaveFocus();
    expect(document.body).toHaveStyle({ overflow: "hidden" });
  });

  it("keeps the custom dialog usable across narrow and wide viewports", async () => {
    const user = userEvent.setup();

    render(<FinancialPeriodSelector selectedPeriodKind="month" />);
    await user.click(
      screen.getByRole("button", {
        name: "Escolher período personalizado"
      })
    );

    const dialog = screen.getByRole("dialog", {
      name: "Escolher período personalizado"
    });
    const positioningLayer = dialog.parentElement;

    expect(positioningLayer).toHaveClass(
      "items-end",
      "sm:items-center",
      "sm:p-4"
    );
    expect(dialog).toHaveClass(
      "max-h-[85dvh]",
      "w-full",
      "min-w-0",
      "overflow-y-auto",
      "overscroll-contain",
      "rounded-t-2xl",
      "pl-[max(1rem,env(safe-area-inset-left))]",
      "pr-[max(1rem,env(safe-area-inset-right))]",
      "pb-[max(1rem,env(safe-area-inset-bottom))]",
      "sm:static",
      "sm:max-w-lg",
      "sm:rounded-2xl",
      "sm:p-6",
      "motion-reduce:transition-none"
    );
    expect(screen.getByLabelText("Data inicial")).toHaveClass(
      "min-h-11",
      "min-w-0",
      "w-full"
    );
    expect(screen.getByLabelText("Data final")).toHaveClass(
      "min-h-11",
      "min-w-0",
      "w-full"
    );
    expect(screen.getByRole("button", { name: "Cancelar" })).toHaveClass(
      "min-h-11",
      "w-full",
      "sm:w-auto"
    );
    expect(screen.getByRole("button", { name: "Aplicar período" })).toHaveClass(
      "min-h-11",
      "w-full",
      "sm:w-auto"
    );
  });

  it("contains keyboard focus and isolates the page while the dialog is open", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <FinancialPeriodSelector selectedPeriodKind="month" />
    );

    await user.click(
      screen.getByRole("button", {
        name: "Escolher período personalizado"
      })
    );

    const fromInput = screen.getByLabelText("Data inicial");
    const closeButton = screen.getByRole("button", {
      name: "Fechar período personalizado"
    });
    const applyButton = screen.getByRole("button", {
      name: "Aplicar período"
    });

    expect(container).toHaveAttribute("aria-hidden", "true");
    expect(container).toHaveAttribute("inert");

    closeButton.focus();
    await user.keyboard("{Shift>}{Tab}{/Shift}");
    expect(applyButton).toHaveFocus();

    applyButton.focus();
    await user.tab();
    expect(closeButton).toHaveFocus();

    await user.tab();
    expect(fromInput).toHaveFocus();
  });

  it("moves focus to a missing final date after validation", async () => {
    const user = userEvent.setup();

    render(<FinancialPeriodSelector selectedPeriodKind="month" />);
    await user.click(
      screen.getByRole("button", {
        name: "Escolher período personalizado"
      })
    );

    const fromInput = screen.getByLabelText("Data inicial");
    const toInput = screen.getByLabelText("Data final");
    fireEvent.change(fromInput, { target: { value: "2026-09-01" } });

    await user.click(screen.getByRole("button", { name: "Aplicar período" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Informe as datas inicial e final."
    );
    expect(toInput).toHaveFocus();
  });

  it("builds a shareable GET query and restores selected custom dates", async () => {
    const user = userEvent.setup();

    render(
      <FinancialPeriodSelector
        selectedCustomPeriod={{ from: "2026-08-01", to: "2026-09-08" }}
        selectedPeriodKind="custom"
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: "Escolher período personalizado"
      })
    );

    const fromInput = screen.getByLabelText("Data inicial");
    const toInput = screen.getByLabelText("Data final");
    const form = screen.getByRole("button", { name: "Aplicar período" }).closest(
      "form"
    );

    expect(fromInput).toHaveValue("2026-08-01");
    expect(toInput).toHaveValue("2026-09-08");
    expect(form).toHaveAttribute("method", "get");

    const data = new FormData(form as HTMLFormElement);
    expect(Object.fromEntries(data.entries())).toEqual({
      period: "custom",
      from: "2026-08-01",
      to: "2026-09-08"
    });

    const submitEvent = new Event("submit", {
      bubbles: true,
      cancelable: true
    });
    fireEvent(form as HTMLFormElement, submitEvent);

    expect(submitEvent.defaultPrevented).toBe(false);
  });

  it.each([
    {
      from: "",
      to: "",
      message: "Informe as datas inicial e final."
    },
    {
      from: "2026-09-09",
      to: "2026-09-08",
      message: "A data inicial deve ser anterior ou igual à data final."
    },
    {
      from: "1960-01-01",
      to: "2026-01-01",
      message: "O período personalizado pode ter no máximo 60 anos."
    },
    {
      from: "2010-02-01",
      to: "2025-01-31",
      message: "Reduza o intervalo para exibir no máximo 60 candles."
    }
  ])(
    "keeps invalid custom dates in the dialog: $message",
    async ({ from, to, message }) => {
      const user = userEvent.setup();

      render(<FinancialPeriodSelector selectedPeriodKind="month" />);
      await user.click(
        screen.getByRole("button", {
          name: "Escolher período personalizado"
        })
      );

      const fromInput = screen.getByLabelText("Data inicial");
      const toInput = screen.getByLabelText("Data final");

      if (from) {
        await user.type(fromInput, from);
      }
      if (to) {
        await user.type(toInput, to);
      }

      const form = screen
        .getByRole("button", { name: "Aplicar período" })
        .closest("form");
      const submitEvent = new Event("submit", {
        bubbles: true,
        cancelable: true
      });

      fireEvent(form as HTMLFormElement, submitEvent);

      expect(submitEvent.defaultPrevented).toBe(true);
      expect(screen.getByRole("alert")).toHaveTextContent(message);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(fromInput).toHaveAttribute("aria-invalid", "true");
      expect(toInput).toHaveAttribute("aria-invalid", "true");
    }
  );

  it("closes through cancel and Escape and restores focus to the trigger", async () => {
    const user = userEvent.setup();

    render(<FinancialPeriodSelector selectedPeriodKind="month" />);

    const trigger = screen.getByRole("button", {
      name: "Escolher período personalizado"
    });
    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();

    await user.click(trigger);
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(document.body).not.toHaveStyle({ overflow: "hidden" });
  });

  it("discards draft dates on cancel and restores the applied URL values", async () => {
    const user = userEvent.setup();

    render(
      <FinancialPeriodSelector
        selectedCustomPeriod={{ from: "2026-08-01", to: "2026-09-08" }}
        selectedPeriodKind="custom"
      />
    );

    const trigger = screen.getByRole("button", {
      name: "Escolher período personalizado"
    });
    await user.click(trigger);
    await user.clear(screen.getByLabelText("Data inicial"));
    await user.type(screen.getByLabelText("Data inicial"), "2026-09-01");
    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    await user.click(trigger);

    expect(screen.getByLabelText("Data inicial")).toHaveValue("2026-08-01");
    expect(screen.getByLabelText("Data final")).toHaveValue("2026-09-08");
  });

  it("closes through the backdrop without exposing it to keyboard navigation", async () => {
    const user = userEvent.setup();

    render(<FinancialPeriodSelector selectedPeriodKind="month" />);
    await user.click(
      screen.getByRole("button", {
        name: "Escolher período personalizado"
      })
    );

    const backdrop = screen.getByTestId("custom-period-backdrop");
    expect(backdrop).toHaveAttribute("tabindex", "-1");

    await user.click(backdrop);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
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
    ["year" as FinancialPeriodKind, "Ano atual"],
    ["all" as FinancialPeriodKind, "Todo o histórico"],
    ["custom" as FinancialPeriodKind, "Escolher período personalizado"]
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
      "Ano atual",
      "Todo o histórico",
      "Escolher período personalizado"
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

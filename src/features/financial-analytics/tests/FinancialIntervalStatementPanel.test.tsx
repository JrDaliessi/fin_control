import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { FinancialIntervalStatementPanel } from "../presentation/components/FinancialIntervalStatementPanel.client";
import {
  nextStatementCandle,
  statementCandle,
  statementInterval,
  statementItem
} from "./fixtures/financial-interval-statement.fixtures";

type StatementResult = Readonly<{
  startOnInclusive: string;
  endOnExclusive: string;
  items: readonly typeof statementItem[];
}>;
type StatementIntervalInput = Readonly<{
  startOnInclusive: string;
  endOnExclusive: string;
}>;

function deferred<T>() {
  let resolvePromise!: (value: T) => void;
  const promise = new Promise<T>((resolve) => {
    resolvePromise = resolve;
  });

  return { promise, resolve: resolvePromise };
}

function InteractivePanelHarness({
  loadStatement
}: Readonly<{
  loadStatement: (input: StatementIntervalInput) => Promise<StatementResult>;
}>) {
  const [selectedCandle, setSelectedCandle] =
    useState<typeof statementCandle | null>(null);

  return (
    <>
      <button onClick={() => setSelectedCandle(statementCandle)} type="button">
        Consultar candle
      </button>
      <FinancialIntervalStatementPanel
        loadStatement={loadStatement}
        onClose={() => setSelectedCandle(null)}
        selectedCandle={selectedCandle}
      />
    </>
  );
}

describe("FinancialIntervalStatementPanel", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
  });

  it("does not load anything while no candle is selected", () => {
    const loadStatement = jest.fn<
      (input: StatementIntervalInput) => Promise<StatementResult>
    >();

    render(
      <FinancialIntervalStatementPanel
        loadStatement={loadStatement}
        onClose={jest.fn()}
        selectedCandle={null}
      />
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(loadStatement).not.toHaveBeenCalled();
  });

  it("loads on selection and exposes summary, interval and transactions", async () => {
    const loadStatement = jest.fn(
      async (input: StatementIntervalInput): Promise<StatementResult> => {
        void input;
        return { ...statementInterval, items: [statementItem] };
      }
    );

    render(
      <FinancialIntervalStatementPanel
        loadStatement={loadStatement}
        onClose={jest.fn()}
        selectedCandle={statementCandle}
      />
    );

    const dialog = screen.getByRole("dialog", {
      name: /extrato de 01\/03\/2026/i
    });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(within(dialog).getByRole("status")).toHaveTextContent(
      "Carregando extrato"
    );
    expect(loadStatement).toHaveBeenCalledWith(statementInterval);
    expect(await screen.findByText("Salário")).toBeInTheDocument();
    expect(screen.getByText(/R\$\s*50,00/)).toBeInTheDocument();
    expect(screen.getByText(/Abertura.*R\$\s*100,00/i)).toBeInTheDocument();
  });

  it("shows an honest empty state and closes through a named control", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(
      <FinancialIntervalStatementPanel
        loadStatement={jest.fn(
          async (input: StatementIntervalInput): Promise<StatementResult> => {
            void input;
            return { ...statementInterval, items: [] };
          }
        )}
        onClose={onClose}
        selectedCandle={{ ...statementCandle, transactionCount: 0 }}
      />
    );

    expect(
      await screen.findByText("Nenhum lançamento neste intervalo.")
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Fechar extrato" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not let an obsolete response replace the latest selection", async () => {
    const first = deferred<StatementResult>();
    const second = deferred<StatementResult>();
    const loadStatement = jest
      .fn<(input: StatementIntervalInput) => Promise<StatementResult>>()
      .mockImplementationOnce(() => first.promise)
      .mockImplementationOnce(() => second.promise);
    const view = render(
      <FinancialIntervalStatementPanel
        loadStatement={loadStatement}
        onClose={jest.fn()}
        selectedCandle={statementCandle}
      />
    );

    view.rerender(
      <FinancialIntervalStatementPanel
        loadStatement={loadStatement}
        onClose={jest.fn()}
        selectedCandle={nextStatementCandle}
      />
    );
    await act(async () => {
      second.resolve({
        startOnInclusive: "2026-03-02",
        endOnExclusive: "2026-03-03",
        items: [{ ...statementItem, id: "latest", description: "Mercado" }]
      });
    });
    expect(await screen.findByText("Mercado")).toBeInTheDocument();

    await act(async () => {
      first.resolve({ ...statementInterval, items: [statementItem] });
    });
    await waitFor(() => {
      expect(screen.queryByText("Salário")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Mercado")).toBeInTheDocument();
  });

  it("contains focus, isolates the background and restores focus and scroll", async () => {
    const user = userEvent.setup();
    document.body.style.overflow = "auto";
    const { container } = render(
      <InteractivePanelHarness
        loadStatement={jest.fn(async () => ({
          ...statementInterval,
          items: []
        }))}
      />
    );
    const opener = screen.getByRole("button", { name: "Consultar candle" });

    await user.click(opener);

    const dialog = screen.getByRole("dialog", {
      name: /extrato de 01\/03\/2026/i
    });
    const closeButton = within(dialog).getByRole("button", {
      name: "Fechar extrato"
    });
    expect(closeButton).toHaveFocus();
    expect(document.body).toHaveStyle({ overflow: "hidden" });
    expect(container).toHaveAttribute("aria-hidden", "true");
    expect(container).toHaveAttribute("inert");
    expect(dialog).toHaveClass(
      "overscroll-contain",
      "pl-[max(1rem,env(safe-area-inset-left))]",
      "pr-[max(1rem,env(safe-area-inset-right))]",
      "pb-[max(1rem,env(safe-area-inset-bottom))]"
    );

    await user.tab();
    expect(closeButton).toHaveFocus();
    await user.tab({ shift: true });
    expect(closeButton).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.body).toHaveStyle({ overflow: "auto" });
    expect(container).not.toHaveAttribute("aria-hidden");
    expect(container).not.toHaveAttribute("inert");
    expect(opener).toHaveFocus();
  });

  it("closes through the backdrop and restores the opener", async () => {
    const user = userEvent.setup();
    render(
      <InteractivePanelHarness
        loadStatement={jest.fn(async () => ({
          ...statementInterval,
          items: []
        }))}
      />
    );
    const opener = screen.getByRole("button", { name: "Consultar candle" });

    await user.click(opener);
    await user.click(screen.getByTestId("financial-statement-backdrop"));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });

  it("retries an unavailable statement without closing the selected interval", async () => {
    const user = userEvent.setup();
    const loadStatement = jest
      .fn<(input: StatementIntervalInput) => Promise<StatementResult>>()
      .mockRejectedValueOnce(new Error("provider unavailable"))
      .mockResolvedValueOnce({ ...statementInterval, items: [statementItem] });

    render(
      <FinancialIntervalStatementPanel
        loadStatement={loadStatement}
        onClose={jest.fn()}
        selectedCandle={statementCandle}
      />
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível carregar o extrato deste intervalo."
    );
    await user.click(screen.getByRole("button", { name: "Tentar novamente" }));

    expect(await screen.findByText("Salário")).toBeInTheDocument();
    expect(loadStatement).toHaveBeenCalledTimes(2);
    expect(
      screen.getByRole("dialog", { name: /extrato de 01\/03\/2026/i })
    ).toBeInTheDocument();
  });
});

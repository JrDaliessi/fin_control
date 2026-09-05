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

  it("shows the movement summary while the statement is still loading", () => {
    const pendingStatement = deferred<StatementResult>();
    const loadStatement = jest.fn(() => pendingStatement.promise);

    render(
      <FinancialIntervalStatementPanel
        loadStatement={loadStatement}
        onClose={jest.fn()}
        selectedCandle={statementCandle}
      />
    );

    const movementSummary = screen.getByRole("region", {
      name: "Movimentação no intervalo"
    });
    expect(within(movementSummary).getByText("Volume movimentado")).toBeInTheDocument();
    expect(within(movementSummary).getByText(/R\$\s*70,00/)).toBeInTheDocument();
    expect(within(movementSummary).getByText("Receitas")).toBeInTheDocument();
    expect(within(movementSummary).getByText(/R\$\s*50,00/)).toBeInTheDocument();
    expect(within(movementSummary).getByText("Despesas")).toBeInTheDocument();
    expect(within(movementSummary).getByText(/R\$\s*20,00/)).toBeInTheDocument();
    expect(within(movementSummary).getByText("Resultado líquido")).toBeInTheDocument();
    expect(within(movementSummary).getByText(/R\$\s*30,00/)).toBeInTheDocument();
    expect(within(movementSummary).getByText(/não representa o resultado líquido/i)).toBeInTheDocument();
    expect(loadStatement).toHaveBeenCalledTimes(1);
  });

  it("reveals and hides at most two contextual insights without another load", async () => {
    const user = userEvent.setup();
    const loadStatement = jest.fn(async () => ({
      ...statementInterval,
      items: [statementItem]
    }));

    render(
      <FinancialIntervalStatementPanel
        loadStatement={loadStatement}
        onClose={jest.fn()}
        selectedCandle={statementCandle}
      />
    );

    await screen.findByText("Salário");
    const showAnalysis = screen.getByRole("button", {
      name: "Ver análise do intervalo"
    });
    expect(showAnalysis).toHaveAttribute("aria-expanded", "false");
    expect(showAnalysis).toHaveClass("min-h-11");
    const analysisId = showAnalysis.getAttribute("aria-controls");
    expect(analysisId).toBeTruthy();

    await user.click(showAnalysis);

    const analysis = document.getElementById(analysisId ?? "");
    expect(analysis).not.toBeNull();
    expect(screen.getByRole("button", { name: "Ocultar análise" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(within(analysis as HTMLElement).getAllByRole("listitem")).toHaveLength(2);
    expect(within(analysis as HTMLElement).getByText(/71% do volume correspondeu a receitas/i)).toBeInTheDocument();
    expect(within(analysis as HTMLElement).getByText(/resultado positivo de R\$\s*30,00/i)).toBeInTheDocument();
    expect(screen.getAllByRole("dialog")).toHaveLength(1);
    expect(loadStatement).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Ocultar análise" }));

    expect(screen.getByRole("button", { name: "Ver análise do intervalo" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(document.getElementById(analysisId ?? "")).toBeNull();
    expect(loadStatement).toHaveBeenCalledTimes(1);
  });

  it("collapses the analysis when the selected candle changes", async () => {
    const user = userEvent.setup();
    const loadStatement = jest.fn(async (input: StatementIntervalInput) => ({
      ...input,
      items: []
    }));
    const view = render(
      <FinancialIntervalStatementPanel
        loadStatement={loadStatement}
        onClose={jest.fn()}
        selectedCandle={statementCandle}
      />
    );

    await screen.findByText("Nenhum lançamento neste intervalo.");
    await user.click(
      screen.getByRole("button", { name: "Ver análise do intervalo" })
    );
    expect(screen.getByText(/71% do volume correspondeu a receitas/i)).toBeInTheDocument();

    view.rerender(
      <FinancialIntervalStatementPanel
        loadStatement={loadStatement}
        onClose={jest.fn()}
        selectedCandle={nextStatementCandle}
      />
    );

    expect(screen.getByRole("button", { name: "Ver análise do intervalo" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(screen.queryByText(/71% do volume correspondeu a receitas/i)).not.toBeInTheDocument();
    await waitFor(() => expect(loadStatement).toHaveBeenCalledTimes(2));
  });

  it("keeps the movement summary available when the statement load fails", async () => {
    render(
      <FinancialIntervalStatementPanel
        loadStatement={jest.fn(async () => {
          throw new Error("provider unavailable");
        })}
        onClose={jest.fn()}
        selectedCandle={statementCandle}
      />
    );

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    const movementSummary = screen.getByRole("region", {
      name: "Movimentação no intervalo"
    });
    expect(within(movementSummary).getByText(/R\$\s*70,00/)).toBeInTheDocument();
    expect(
      within(movementSummary).getByRole("button", {
        name: "Ver análise do intervalo"
      })
    ).toBeInTheDocument();
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

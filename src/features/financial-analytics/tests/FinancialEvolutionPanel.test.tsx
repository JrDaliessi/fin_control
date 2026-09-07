import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import type { FinancialEvolutionDto } from "../application/use-cases/list-financial-evolution.use-case";
import type {
  FinancialCandle,
  FinancialEvolutionPoint
} from "../domain/types/financial-evolution.types";
import type { FinancialCandlestickChartModel } from "../presentation/charts/financial-candlestick-chart.model";
import type { FinancialEvolutionChartModel } from "../presentation/charts/financial-evolution-chart.model";

jest.mock(
  "../presentation/components/FinancialVisualizationSwitcher.client",
  () => ({
    FinancialVisualizationSwitcher: jest.fn(() => null)
  })
);

type FinancialVisualizationSwitcherStub = (props: {
  evolutionModel: FinancialEvolutionChartModel;
  candlestickModel: FinancialCandlestickChartModel;
  evolutionPoints: readonly FinancialEvolutionPoint[];
  candles: readonly FinancialCandle[];
}) => ReactNode;

const { FinancialVisualizationSwitcher: mockFinancialVisualizationSwitcher } =
  jest.requireMock(
    "../presentation/components/FinancialVisualizationSwitcher.client"
  ) as {
    FinancialVisualizationSwitcher: jest.MockedFunction<FinancialVisualizationSwitcherStub>;
  };

const { FinancialEvolutionTable } = jest.requireActual<
  typeof import("../presentation/components/FinancialEvolutionTable")
>("../presentation/components/FinancialEvolutionTable");

const { FinancialEvolutionPanel } = jest.requireActual<
  typeof import("../presentation/components/FinancialEvolutionPanel")
>("../presentation/components/FinancialEvolutionPanel");

const successResult: FinancialEvolutionDto = {
  status: "success",
  accountCount: 2,
  period: {
    kind: "rolling_7_days",
    referenceOn: "2026-03-07",
    startOnInclusive: "2026-03-01",
    endOnExclusive: "2026-03-08"
  },
  summary: {
    openingBalanceInCents: 10_000,
    incomeInCents: 5_000,
    expenseInCents: 2_000,
    netInCents: 3_000,
    closingBalanceInCents: 13_000,
    transactionCount: 2
  },
  points: [
    {
      startOnInclusive: "2026-03-01",
      endOnExclusive: "2026-03-02",
      incomeInCents: 5_000,
      expenseInCents: 2_000,
      netInCents: 3_000,
      closingBalanceInCents: 13_000,
      transactionCount: 2
    }
  ],
  candles: [
    {
      startOnInclusive: "2026-03-01",
      endOnExclusive: "2026-03-02",
      openInCents: 10_000,
      highInCents: 15_000,
      lowInCents: 10_000,
      closeInCents: 13_000,
      incomeInCents: 5_000,
      expenseInCents: 2_000,
      volumeInCents: 7_000,
      transactionCount: 2
    }
  ]
};

function makeResult(
  overrides: Partial<FinancialEvolutionDto>
): FinancialEvolutionDto {
  return { ...successResult, ...overrides };
}

describe("FinancialEvolutionPanel", () => {
  beforeEach(() => {
    mockFinancialVisualizationSwitcher.mockReset();
    mockFinancialVisualizationSwitcher.mockImplementation(
      ({ evolutionPoints }) => (
        <>
          <h3>Evolução do saldo</h3>
          <FinancialEvolutionTable points={evolutionPoints} />
        </>
      )
    );
  });

  it("guides users without accounts before rendering financial data", () => {
    render(
      <FinancialEvolutionPanel
        result={makeResult({
          status: "missing_accounts",
          accountCount: 0,
          points: [],
          candles: []
        })}
        selectedPeriodKind="month"
      />
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Cadastre uma conta para acompanhar sua evolução financeira."
    );
    expect(
      screen.getByRole("link", { name: "Cadastrar conta" })
    ).toHaveClass("w-full", "sm:w-fit");
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("group", { name: /Saldo ao fim do período:/ })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "Período da evolução financeira" })
    ).toBeInTheDocument();
    expect(mockFinancialVisualizationSwitcher).not.toHaveBeenCalled();
  });

  it("distinguishes a period without movements and keeps daily balances visible", () => {
    render(
      <FinancialEvolutionPanel
        result={makeResult({
          status: "empty",
          summary: {
            openingBalanceInCents: 2_500,
            incomeInCents: 0,
            expenseInCents: 0,
            netInCents: 0,
            closingBalanceInCents: 2_500,
            transactionCount: 0
          },
          points: [
            {
              startOnInclusive: "2026-03-01",
              endOnExclusive: "2026-03-02",
              incomeInCents: 0,
              expenseInCents: 0,
              netInCents: 0,
              closingBalanceInCents: 2_500,
              transactionCount: 0
            }
          ]
        })}
        selectedPeriodKind="rolling_7_days"
      />
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Nenhuma movimentação neste período. Seus saldos continuam visíveis."
    );
    expect(
      screen.getByRole("table", { name: "Evolução financeira por dia" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "Período da evolução financeira" })
    ).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: /R\$\s*25,00/ })).toBeInTheDocument();
  });

  it("renders a semantic daily evolution table and the period summary", () => {
    render(
      <FinancialEvolutionPanel
        result={successResult}
        selectedPeriodKind="rolling_7_days"
      />
    );

    const table = screen.getByRole("table", {
      name: "Evolução financeira por dia"
    });

    for (const heading of [
      "Dia",
      "Receitas",
      "Despesas",
      "Líquido",
      "Saldo",
      "Movimentos"
    ]) {
      expect(within(table).getByRole("columnheader", { name: heading })).toBeInTheDocument();
    }

    expect(within(table).getByRole("cell", { name: "01/03/2026" })).toBeInTheDocument();
    expect(within(table).getByRole("cell", { name: /R\$\s*50,00/ })).toBeInTheDocument();
    expect(
      screen.getByText("Saldo ao fim do período").parentElement
    ).toHaveTextContent(/R\$\s*130,00/);
    expect(screen.getByText("2 movimentos")).toBeInTheDocument();
  });

  it("associates each summary value with its financial metric", () => {
    render(
      <FinancialEvolutionPanel
        result={successResult}
        selectedPeriodKind="rolling_7_days"
      />
    );

    expect(
      screen.getByRole("group", { name: /Saldo inicial: R\$\s*100,00/ })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", {
        name: /Saldo ao fim do período: R\$\s*130,00/
      })
    ).toBeInTheDocument();
  });

  it("uses the approved section copy and a mobile-first 12-column summary", () => {
    render(
      <FinancialEvolutionPanel
        result={successResult}
        selectedPeriodKind="rolling_7_days"
      />
    );

    expect(
      screen.getByRole("heading", { name: "Como seu dinheiro evoluiu" })
    ).toBeInTheDocument();

    const closingBalance = screen.getByRole("group", {
      name: /Saldo ao fim do período: R\$\s*130,00/
    });
    expect(closingBalance.closest("dl")).toHaveClass("grid-cols-12");
    expect(closingBalance).toHaveClass("min-w-0");
    expect(closingBalance.querySelector("dd")).toHaveClass("break-words");
    expect(screen.queryByText(/disponível de verdade/i)).not.toBeInTheDocument();
  });

  it("makes the wide daily table discoverable and keyboard scrollable", () => {
    render(
      <FinancialEvolutionPanel
        result={successResult}
        selectedPeriodKind="rolling_7_days"
      />
    );

    const scrollRegion = screen.getByRole("region", {
      name: "Evolução financeira por dia"
    });

    expect(scrollRegion).toHaveAttribute("tabindex", "0");
    expect(scrollRegion).toHaveClass("touch-pan-x");
    expect(scrollRegion).toHaveAttribute(
      "aria-describedby",
      "financial-evolution-table-hint"
    );
    expect(
      screen.getByText(
        "Deslize horizontalmente ou use as setas do teclado para consultar todas as colunas."
      )
    ).toHaveClass("sm:sr-only");

    fireEvent.keyDown(scrollRegion, { key: "ArrowRight" });
    expect(scrollRegion.scrollLeft).toBeGreaterThan(0);

    fireEvent.keyDown(scrollRegion, { key: "ArrowLeft" });
    expect(scrollRegion.scrollLeft).toBe(0);
  });

  it("renders the balance chart and table from the same success result", () => {
    render(
      <FinancialEvolutionPanel
        result={successResult}
        selectedPeriodKind="rolling_7_days"
      />
    );

    expect(
      screen.getByRole("heading", { level: 3, name: "Evolução do saldo" })
    ).toBeInTheDocument();
    expect(mockFinancialVisualizationSwitcher).toHaveBeenCalledTimes(1);
    expect(
      mockFinancialVisualizationSwitcher.mock.calls[0]?.[0].evolutionModel
    ).toEqual({
      startOnInclusive: "2026-03-01",
      endOnExclusive: "2026-03-08",
      points: [
        {
          civilDate: "2026-03-01",
          closingBalanceInCents: 13_000
        }
      ]
    });
    expect(
      mockFinancialVisualizationSwitcher.mock.calls[0]?.[0].candlestickModel
    ).toEqual({
      startOnInclusive: "2026-03-01",
      endOnExclusive: "2026-03-08",
      points: [
        {
          civilDate: "2026-03-01",
          endOnExclusive: "2026-03-02",
          openInCents: 10_000,
          highInCents: 15_000,
          lowInCents: 10_000,
          closeInCents: 13_000,
          incomeInCents: 5_000,
          expenseInCents: 2_000,
          volumeInCents: 7_000,
          transactionCount: 2
        }
      ]
    });
    expect(
      screen.getByRole("table", { name: "Evolução financeira por dia" })
    ).toBeInTheDocument();
  });

  it("keeps a flat balance chart and the table for a period without movements", () => {
    const emptyResult = makeResult({
      status: "empty",
      summary: {
        openingBalanceInCents: 2_500,
        incomeInCents: 0,
        expenseInCents: 0,
        netInCents: 0,
        closingBalanceInCents: 2_500,
        transactionCount: 0
      },
      points: [
        {
          startOnInclusive: "2026-03-01",
          endOnExclusive: "2026-03-02",
          incomeInCents: 0,
          expenseInCents: 0,
          netInCents: 0,
          closingBalanceInCents: 2_500,
          transactionCount: 0
        },
        {
          startOnInclusive: "2026-03-02",
          endOnExclusive: "2026-03-03",
          incomeInCents: 0,
          expenseInCents: 0,
          netInCents: 0,
          closingBalanceInCents: 2_500,
          transactionCount: 0
        }
      ]
    });

    render(
      <FinancialEvolutionPanel
        result={emptyResult}
        selectedPeriodKind="rolling_7_days"
      />
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Nenhuma movimentação neste período. Seus saldos continuam visíveis."
    );
    expect(
      mockFinancialVisualizationSwitcher.mock.calls[0]?.[0].evolutionModel.points
    ).toEqual([
        { civilDate: "2026-03-01", closingBalanceInCents: 2_500 },
        { civilDate: "2026-03-02", closingBalanceInCents: 2_500 }
      ]);
    expect(
      screen.getByRole("table", { name: "Evolução financeira por dia" })
    ).toBeInTheDocument();
  });

  it("keeps the table available when the chart reports a local failure", () => {
    mockFinancialVisualizationSwitcher.mockImplementationOnce(
      ({ evolutionPoints }) => (
        <>
          <p role="status">
            Não foi possível carregar o gráfico. Consulte a tabela de evolução
            financeira.
          </p>
          <FinancialEvolutionTable points={evolutionPoints} />
        </>
      )
    );

    render(
      <FinancialEvolutionPanel
        result={successResult}
        selectedPeriodKind="rolling_7_days"
      />
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Não foi possível carregar o gráfico. Consulte a tabela de evolução financeira."
    );
    expect(
      screen.getByRole("table", { name: "Evolução financeira por dia" })
    ).toBeInTheDocument();
  });
});

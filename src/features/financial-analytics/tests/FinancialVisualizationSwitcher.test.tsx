import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";

jest.mock(
  "../presentation/components/FinancialEvolutionChart.client",
  () => ({
    FinancialEvolutionChart: jest.fn(() => (
      <div data-testid="financial-line-chart" />
    ))
  })
);
jest.mock(
  "../presentation/components/FinancialCandlestickChart.client",
  () => ({
    FinancialCandlestickChart: jest.fn(
      (props: {
        onSelectInterval?: (interval: {
          startOnInclusive: string;
          endOnExclusive: string;
        }) => void;
      }) => (
        <div data-testid="financial-candlestick-chart">
          <button
            onClick={() =>
              props.onSelectInterval?.({
                startOnInclusive: "2026-03-01",
                endOnExclusive: "2026-03-02"
              })
            }
            type="button"
          >
            Selecionar candle no gráfico
          </button>
        </div>
      )
    )
  }),
  { virtual: true }
);
jest.mock("../presentation/components/FinancialEvolutionTable", () => ({
  FinancialEvolutionTable: jest.fn(() => (
    <div data-testid="financial-evolution-table" />
  ))
}));
jest.mock(
  "../presentation/components/FinancialCandlesTable",
  () => ({
    FinancialCandlesTable: jest.fn(
      (props: {
        candles: SwitcherProps["candles"];
        onSelectInterval?: (candle: SwitcherProps["candles"][number]) => void;
      }) => (
        <div data-testid="financial-candles-table">
          <button
            onClick={() => props.onSelectInterval?.(props.candles[0])}
            type="button"
          >
            Selecionar candle na tabela
          </button>
        </div>
      )
    )
  }),
  { virtual: true }
);

type SwitcherProps = Readonly<{
  bucketGranularity: "day" | "week" | "month";
  evolutionModel: Readonly<{
    startOnInclusive: string;
    endOnExclusive: string;
    points: readonly Readonly<{
      civilDate: string;
      closingBalanceInCents: number;
    }>[];
  }>;
  candlestickModel: Readonly<{
    startOnInclusive: string;
    endOnExclusive: string;
    points: readonly Readonly<{
      civilDate: string;
      openInCents: number;
      highInCents: number;
      lowInCents: number;
      closeInCents: number;
      incomeInCents: number;
      expenseInCents: number;
      volumeInCents: number;
      transactionCount: number;
    }>[];
  }>;
  evolutionPoints: readonly Readonly<{
    startOnInclusive: string;
    endOnExclusive: string;
    incomeInCents: number;
    expenseInCents: number;
    netInCents: number;
    closingBalanceInCents: number;
    transactionCount: number;
  }>[];
  candles: readonly Readonly<{
    startOnInclusive: string;
    endOnExclusive: string;
    openInCents: number;
    highInCents: number;
    lowInCents: number;
    closeInCents: number;
    incomeInCents: number;
    expenseInCents: number;
    volumeInCents: number;
    transactionCount: number;
  }>[];
  loadStatement?: (input: Readonly<{
    startOnInclusive: string;
    endOnExclusive: string;
  }>) => Promise<Readonly<{
    startOnInclusive: string;
    endOnExclusive: string;
    items: readonly Readonly<{
      id: string;
      description: string;
      amountInCents: number;
      type: "income" | "expense";
      occurredOn: string;
      createdAt: string;
    }>[];
  }>>;
}>;

type FinancialCandlestickChartStub = (props: Readonly<{
  model: SwitcherProps["candlestickModel"];
  onSelectInterval?: (interval: Readonly<{
    startOnInclusive: string;
    endOnExclusive: string;
  }>) => void;
}>) => ReactNode;

const { FinancialCandlestickChart: mockFinancialCandlestickChart } =
  jest.requireMock(
    "../presentation/components/FinancialCandlestickChart.client"
  ) as {
    FinancialCandlestickChart: jest.MockedFunction<FinancialCandlestickChartStub>;
  };

const { FinancialVisualizationSwitcher } = jest.requireActual<{
  FinancialVisualizationSwitcher: (props: SwitcherProps) => ReactNode;
}>("../presentation/components/FinancialVisualizationSwitcher.client");

const evolutionPoints = [
  {
    startOnInclusive: "2026-03-01",
    endOnExclusive: "2026-03-02",
    incomeInCents: 5_000,
    expenseInCents: 2_000,
    netInCents: 3_000,
    closingBalanceInCents: 13_000,
    transactionCount: 2
  }
];
const candles = [
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
];
const props: SwitcherProps = {
  bucketGranularity: "day",
  evolutionModel: {
    startOnInclusive: "2026-03-01",
    endOnExclusive: "2026-03-02",
    points: [{ civilDate: "2026-03-01", closingBalanceInCents: 13_000 }]
  },
  candlestickModel: {
    startOnInclusive: "2026-03-01",
    endOnExclusive: "2026-03-02",
    points: [{ civilDate: "2026-03-01", ...candles[0] }]
  },
  evolutionPoints,
  candles
};

describe("FinancialVisualizationSwitcher", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("uses the line and its equivalent table as the default mode", () => {
    render(<FinancialVisualizationSwitcher {...props} />);

    expect(
      screen.getByRole("button", { name: "Evolução do saldo" })
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "Variação do saldo" })
    ).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByTestId("financial-line-chart")).toBeInTheDocument();
    expect(screen.getByTestId("financial-evolution-table")).toBeInTheDocument();
    expect(
      screen.queryByTestId("financial-candlestick-chart")
    ).not.toBeInTheDocument();
  });

  it("uses the civil bucket in the visible descriptions", async () => {
    const user = userEvent.setup();

    render(
      <FinancialVisualizationSwitcher
        {...props}
        bucketGranularity="week"
      />
    );

    expect(
      screen.getByText("Saldo ao fim de cada semana do período selecionado.")
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Variação do saldo" })
    );
    expect(
      screen.getByText(
        "Abertura, extremos e fechamento do saldo em cada semana."
      )
    ).toBeInTheDocument();
  });

  it("switches to one candlestick renderer and its OHLC table without network", async () => {
    const user = userEvent.setup();
    const fetchSpy = jest.spyOn(globalThis, "fetch");

    render(<FinancialVisualizationSwitcher {...props} />);
    await user.click(
      screen.getByRole("button", { name: "Variação do saldo" })
    );

    expect(
      screen.getByRole("button", { name: "Variação do saldo" })
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.queryByTestId("financial-line-chart")
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId("financial-candlestick-chart")
    ).toBeInTheDocument();
    expect(screen.getByTestId("financial-candles-table")).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("associates both controls with one clearly named active region", async () => {
    const user = userEvent.setup();
    render(<FinancialVisualizationSwitcher {...props} />);
    const evolutionButton = screen.getByRole("button", {
      name: "Evolução do saldo"
    });
    const candlestickButton = screen.getByRole("button", {
      name: "Variação do saldo"
    });
    const contentId = evolutionButton.getAttribute("aria-controls");

    expect(contentId).toBeTruthy();
    expect(candlestickButton).toHaveAttribute("aria-controls", contentId);
    expect(
      screen.getByRole("region", { name: "Evolução do saldo" })
    ).toHaveAttribute("id", contentId);

    await user.click(candlestickButton);

    expect(
      screen.getByRole("region", { name: "Variação do saldo" })
    ).toHaveAttribute("id", contentId);
  });

  it("keeps the OHLC table available when the active renderer fails", async () => {
    const user = userEvent.setup();
    mockFinancialCandlestickChart.mockImplementationOnce(() => (
      <p role="status">
        Não foi possível carregar o gráfico. Consulte a tabela de variação
        financeira.
      </p>
    ));

    render(<FinancialVisualizationSwitcher {...props} />);
    await user.click(
      screen.getByRole("button", { name: "Variação do saldo" })
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Não foi possível carregar o gráfico. Consulte a tabela de variação financeira."
    );
    expect(screen.getByTestId("financial-candles-table")).toBeInTheDocument();
  });

  it("explains how pointer and keyboard users open a contextual statement", async () => {
    const user = userEvent.setup();

    render(
      <FinancialVisualizationSwitcher
        {...props}
        loadStatement={jest.fn(
          async (input: {
            startOnInclusive: string;
            endOnExclusive: string;
          }) => ({
            startOnInclusive: input.startOnInclusive,
            endOnExclusive: input.endOnExclusive,
            items: []
          })
        )}
      />
    );
    await user.click(
      screen.getByRole("button", { name: "Variação do saldo" })
    );

    expect(
      screen.getByText(
        "Selecione um candle no gráfico ou use Ver extrato na tabela."
      )
    ).toBeInTheDocument();
  });

  it("routes chart and table selection to the same contextual statement", async () => {
    const user = userEvent.setup();
    const loadStatement = jest.fn(async (input: {
      startOnInclusive: string;
      endOnExclusive: string;
    }) => ({
      ...input,
      items: [
        {
          id: "statement-item",
          description: "Salário",
          amountInCents: 5_000,
          type: "income" as const,
          occurredOn: "2026-03-01",
          createdAt: "2026-03-01T10:00:00.000Z"
        }
      ]
    }));

    render(
      <FinancialVisualizationSwitcher
        {...props}
        loadStatement={loadStatement}
      />
    );
    await user.click(
      screen.getByRole("button", { name: "Variação do saldo" })
    );
    await user.click(
      screen.getByRole("button", { name: "Selecionar candle no gráfico" })
    );

    expect(await screen.findByText("Salário")).toBeInTheDocument();
    expect(loadStatement).toHaveBeenLastCalledWith({
      startOnInclusive: "2026-03-01",
      endOnExclusive: "2026-03-02"
    });
    await user.click(screen.getByRole("button", { name: "Fechar extrato" }));
    await user.click(
      screen.getByRole("button", { name: "Selecionar candle na tabela" })
    );

    expect(await screen.findByText("Salário")).toBeInTheDocument();
    expect(loadStatement).toHaveBeenCalledTimes(2);
  });

  it("closes a selected statement when the financial period changes", async () => {
    const user = userEvent.setup();
    const loadStatement = jest.fn(async (input: {
      startOnInclusive: string;
      endOnExclusive: string;
    }) => ({
      ...input,
      items: [
        {
          id: "statement-item",
          description: "Salário",
          amountInCents: 5_000,
          type: "income" as const,
          occurredOn: "2026-03-01",
          createdAt: "2026-03-01T10:00:00.000Z"
        }
      ]
    }));
    const view = render(
      <FinancialVisualizationSwitcher
        {...props}
        loadStatement={loadStatement}
      />
    );

    await user.click(
      screen.getByRole("button", { name: "Variação do saldo" })
    );
    await user.click(
      screen.getByRole("button", { name: "Selecionar candle no gráfico" })
    );
    expect(await screen.findByText("Salário")).toBeInTheDocument();

    view.rerender(
      <FinancialVisualizationSwitcher
        {...props}
        candles={[]}
        candlestickModel={{
          startOnInclusive: "2026-04-01",
          endOnExclusive: "2026-05-01",
          points: []
        }}
        evolutionModel={{
          startOnInclusive: "2026-04-01",
          endOnExclusive: "2026-05-01",
          points: []
        }}
        evolutionPoints={[]}
        loadStatement={loadStatement}
      />
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByText("Salário")).not.toBeInTheDocument();
  });
});

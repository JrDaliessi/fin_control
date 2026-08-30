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
    FinancialCandlestickChart: jest.fn(() => (
      <div data-testid="financial-candlestick-chart" />
    ))
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
    FinancialCandlesTable: jest.fn(() => (
      <div data-testid="financial-candles-table" />
    ))
  }),
  { virtual: true }
);

type SwitcherProps = Readonly<{
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
}>;

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
});

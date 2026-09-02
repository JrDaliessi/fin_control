import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { FinancialCandlesTable } from "../presentation/components/FinancialCandlesTable";

const candles = [
  {
    startOnInclusive: "2026-03-01",
    endOnExclusive: "2026-03-02",
    openInCents: 10_000,
    highInCents: 15_000,
    lowInCents: 9_000,
    closeInCents: 13_000,
    incomeInCents: 5_000,
    expenseInCents: 2_000,
    volumeInCents: 7_000,
    transactionCount: 2
  },
  {
    startOnInclusive: "2026-03-02",
    endOnExclusive: "2026-03-03",
    openInCents: 13_000,
    highInCents: 13_000,
    lowInCents: 8_000,
    closeInCents: 8_000,
    incomeInCents: 0,
    expenseInCents: 5_000,
    volumeInCents: 5_000,
    transactionCount: 1
  },
  {
    startOnInclusive: "2026-03-03",
    endOnExclusive: "2026-03-04",
    openInCents: 8_000,
    highInCents: 8_000,
    lowInCents: 8_000,
    closeInCents: 8_000,
    incomeInCents: 0,
    expenseInCents: 0,
    volumeInCents: 0,
    transactionCount: 0
  }
];

const SelectableFinancialCandlesTable = FinancialCandlesTable as unknown as (
  props: Readonly<{
    candles: typeof candles;
    onSelectInterval: (candle: (typeof candles)[number]) => void;
  }>
) => ReactNode;

describe("FinancialCandlesTable", () => {
  it("provides a keyboard-scrollable OHLC equivalent to the chart tooltip", () => {
    render(<FinancialCandlesTable candles={candles} />);

    const region = screen.getByRole("region", {
      name: "Variação financeira por dia"
    });
    const table = within(region).getByRole("table", {
      name: "Variação financeira por dia"
    });

    expect(region).toHaveAttribute("tabindex", "0");
    expect(region).toHaveClass("touch-pan-x", "overflow-x-auto");
    for (const heading of [
      "Dia",
      "Abertura",
      "Máxima",
      "Mínima",
      "Fechamento",
      "Variação",
      "Volume",
      "Movimentos"
    ]) {
      expect(
        within(table).getByRole("columnheader", { name: heading })
      ).toBeInTheDocument();
    }
  });

  it("moves the wide table horizontally with the arrow keys", () => {
    render(<FinancialCandlesTable candles={candles} />);

    const region = screen.getByRole("region", {
      name: "Variação financeira por dia"
    });

    fireEvent.keyDown(region, { key: "ArrowRight" });
    expect(region.scrollLeft).toBeGreaterThan(0);

    fireEvent.keyDown(region, { key: "ArrowLeft" });
    expect(region.scrollLeft).toBe(0);
  });

  it("expresses rise, fall and stability with text instead of color alone", () => {
    render(<FinancialCandlesTable candles={candles} />);

    expect(screen.getByRole("cell", { name: "Alta" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Queda" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Estável" })).toBeInTheDocument();
  });

  it("explains that intraday extrema follow registration order", () => {
    render(<FinancialCandlesTable candles={candles} />);

    expect(screen.getByText(/máximas e mínimas.*ordem de registro/i)).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: /R\$\s*150,00/ })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "2" })).toBeInTheDocument();
  });

  it("offers a keyboard action that selects the exact candle interval", async () => {
    const user = userEvent.setup();
    const onSelectInterval = jest.fn<(candle: (typeof candles)[number]) => void>();

    render(
      <SelectableFinancialCandlesTable
        candles={candles}
        onSelectInterval={onSelectInterval}
      />
    );
    await user.click(
      screen.getByRole("button", { name: "Ver extrato de 01/03/2026" })
    );

    expect(onSelectInterval).toHaveBeenCalledWith(candles[0]);
  });
});

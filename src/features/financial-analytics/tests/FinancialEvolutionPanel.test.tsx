import { describe, expect, it } from "@jest/globals";
import { render, screen, within } from "@testing-library/react";
import type { FinancialEvolutionDto } from "../application/use-cases/list-financial-evolution.use-case";
import { FinancialEvolutionPanel } from "../presentation/components/FinancialEvolutionPanel";

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
  ]
};

function makeResult(
  overrides: Partial<FinancialEvolutionDto>
): FinancialEvolutionDto {
  return { ...successResult, ...overrides };
}

describe("FinancialEvolutionPanel", () => {
  it("offers the five supported periods and preserves the selected period", () => {
    render(
      <FinancialEvolutionPanel
        result={successResult}
        selectedPeriodKind="rolling_7_days"
      />
    );

    const selector = screen.getByRole("combobox", {
      name: "Período da evolução financeira"
    });

    expect(selector).toHaveValue("rolling_7_days");
    expect(within(selector).getAllByRole("option")).toHaveLength(5);
    expect(within(selector).getByRole("option", { name: "Mês" })).toHaveValue(
      "month"
    );
    expect(
      screen.getByRole("button", { name: "Atualizar período" })
    ).toHaveClass("min-h-11", "w-full", "sm:w-auto");
    expect(selector).toHaveClass("w-full");
  });

  it("guides users without accounts before rendering financial data", () => {
    render(
      <FinancialEvolutionPanel
        result={makeResult({
          status: "missing_accounts",
          accountCount: 0,
          points: []
        })}
        selectedPeriodKind="month"
      />
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Cadastre uma conta para acompanhar sua evolução financeira."
    );
    expect(
      screen.getByRole("link", { name: "Cadastrar conta" })
    ).toHaveAttribute("href", "/accounts");
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("group", { name: /Saldo ao fim do período:/ })
    ).not.toBeInTheDocument();
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
    expect(scrollRegion).toHaveAttribute(
      "aria-describedby",
      "financial-evolution-table-hint"
    );
    expect(
      screen.getByText("Deslize horizontalmente para consultar todas as colunas.")
    ).toHaveClass("sm:hidden");
  });
});

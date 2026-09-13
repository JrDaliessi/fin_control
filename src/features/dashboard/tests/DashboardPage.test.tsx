import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { DashboardPage } from "../presentation/pages/DashboardPage";

describe("DashboardPage", () => {
  it("omits the redundant visual dashboard introduction", () => {
    render(<DashboardPage />);

    expect(screen.getByRole("main")).toHaveClass("min-h-dvh");
    expect(
      screen.getByRole("heading", { name: "Visão geral", level: 1 })
    ).toHaveClass("sr-only");
    expect(
      screen.queryByText(
        "Aqui está o que aconteceu com seu dinheiro no período selecionado."
      )
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/usuario@example\.com/i)).not.toBeInTheDocument();
  });

  it("omits quick actions already available in the global navigation", () => {
    render(<DashboardPage />);

    expect(
      screen.queryByRole("navigation", { name: "Ações rápidas" })
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Contas" })).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Transações" })
    ).not.toBeInTheDocument();
  });

  it("composes server-rendered financial content through its React slot", () => {
    render(
      <DashboardPage>
        <section aria-label="Conteúdo financeiro do servidor">
          Evolução serializada
        </section>
      </DashboardPage>
    );

    expect(
      screen.getByRole("region", { name: "Conteúdo financeiro do servidor" })
    ).toHaveTextContent("Evolução serializada");
  });

  it("does not expose unsupported or legacy financial promises", () => {
    render(<DashboardPage />);

    for (const unsupportedCopy of [
      /disponível de verdade/i,
      /resumo financeiro do mês/i,
      /últimas transações/i,
      /previsão/i,
      /tendência/i
    ]) {
      expect(screen.queryByText(unsupportedCopy)).not.toBeInTheDocument();
    }
  });
});

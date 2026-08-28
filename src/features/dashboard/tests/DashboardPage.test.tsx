import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { DashboardPage } from "../presentation/pages/DashboardPage";

describe("DashboardPage", () => {
  it("presents the approved dashboard hierarchy and neutral supporting copy", () => {
    render(<DashboardPage />);

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Visão geral", level: 1 })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Aqui está o que aconteceu com seu dinheiro no período selecionado."
      )
    ).toBeInTheDocument();
    expect(screen.queryByText(/usuario@example\.com/i)).not.toBeInTheDocument();
  });

  it("offers only actions backed by existing account and transaction flows", () => {
    render(<DashboardPage />);

    const actions = screen.getByRole("navigation", { name: "Ações rápidas" });
    const actionLinks = screen.getAllByRole("link");
    const actionHrefs = actionLinks
      .map((link) => link.getAttribute("href"));
    expect(actions).toHaveClass("w-full", "sm:w-auto");
    expect(actionHrefs).toHaveLength(2);
    expect(actionHrefs).toEqual(
      expect.arrayContaining(["/accounts", "/transactions"])
    );
    expect(screen.getByRole("link", { name: "Contas" })).toHaveAttribute(
      "href",
      "/accounts"
    );
    expect(screen.getByRole("link", { name: "Transações" })).toHaveAttribute(
      "href",
      "/transactions"
    );
    for (const link of actionLinks) {
      expect(link).toHaveClass("min-h-11", "focus-visible:ring-2");
    }
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

import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/shared/theme/ThemeProvider";

const mockRefresh = jest.fn();
const mockReplace = jest.fn();
let mockPathname = "/dashboard";

jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({
    refresh: mockRefresh,
    replace: mockReplace,
  }),
}));

const { PrivateAppShell } = jest.requireActual<
  typeof import("../PrivateAppShell")
>("../PrivateAppShell");

function renderShell(children: ReactNode = <main>Conteúdo financeiro</main>) {
  return render(
    <ThemeProvider>
      <PrivateAppShell email="usuario@example.com">{children}</PrivateAppShell>
    </ThemeProvider>,
  );
}

describe("PrivateAppShell", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPathname = "/dashboard";
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: jest.fn(() => ({
        addEventListener: jest.fn(),
        addListener: jest.fn(),
        dispatchEvent: jest.fn(() => true),
        matches: false,
        media: "(prefers-color-scheme: dark)",
        onchange: null,
        removeEventListener: jest.fn(),
        removeListener: jest.fn(),
      })),
    });
  });

  it("renders accessible desktop and mobile navigation with only available routes", () => {
    renderShell();

    const primaryNavigation = screen.getByRole("navigation", {
      name: "Navegação principal",
    });
    const mobileNavigation = screen.getByRole("navigation", {
      name: "Navegação móvel",
    });

    expect(
      within(primaryNavigation)
        .getAllByRole("link")
        .map((link) => link.textContent?.trim()),
    ).toEqual(["Visão geral", "Transações", "Contas"]);
    expect(
      within(mobileNavigation)
        .getAllByRole("link")
        .map((link) => link.textContent?.trim()),
    ).toEqual(["Início", "Transações", "Contas"]);

    expect(primaryNavigation.closest("aside")).toHaveClass("hidden", "md:flex");
    expect(mobileNavigation).toHaveClass("fixed", "bottom-0", "md:hidden");

    for (const link of [
      ...within(primaryNavigation).getAllByRole("link"),
      ...within(mobileNavigation).getAllByRole("link"),
    ]) {
      expect(link).toHaveClass("min-h-11", "min-w-11");
    }

    for (const unavailableLabel of [
      "Adicionar",
      "Ajuda",
      "Cartões",
      "Configurações",
      "FinControl IA",
      "Importações",
      "Mais",
      "Metas",
      "Notificações",
      "Orçamentos",
      "Planejamento",
      "Relatórios",
    ]) {
      expect(
        screen.queryByRole("link", { name: unavailableLabel }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: unavailableLabel }),
      ).not.toBeInTheDocument();
    }
  });

  it("marks only the current canonical destination in both navigation variants", () => {
    mockPathname = "/accounts";
    renderShell();

    const primaryNavigation = screen.getByRole("navigation", {
      name: "Navegação principal",
    });
    const mobileNavigation = screen.getByRole("navigation", {
      name: "Navegação móvel",
    });

    expect(
      within(primaryNavigation).getByRole("link", { name: "Contas" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      within(mobileNavigation).getByRole("link", { name: "Contas" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      within(primaryNavigation).getByRole("link", { name: "Visão geral" }),
    ).not.toHaveAttribute("aria-current");
    expect(
      within(primaryNavigation).getByRole("link", { name: "Transações" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("preserves global session actions and leaves the main landmark to the page", () => {
    renderShell();

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText("usuario@example.com")).toBeInTheDocument();
    expect(screen.getByRole("radiogroup", { name: "Tema" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sair" })).toBeInTheDocument();
    expect(screen.getAllByRole("main")).toHaveLength(1);
    expect(screen.getByRole("main")).toHaveTextContent("Conteúdo financeiro");
  });

  it("reserves mobile bottom space without introducing a second main landmark", () => {
    renderShell(<main className="min-h-dvh">Página atual</main>);

    expect(screen.getByTestId("private-shell-content")).toHaveClass(
      "min-w-0",
      "pb-20",
      "md:pb-0",
    );
    expect(screen.getAllByRole("main")).toHaveLength(1);
  });
});

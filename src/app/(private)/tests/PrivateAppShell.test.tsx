import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/shared/theme/ThemeProvider";

const mockRefresh = jest.fn();
const mockReplace = jest.fn();
const mockProviderSignOut = jest.fn(
  async (options: { scope: "local" }) => {
    void options;
    return { error: null };
  },
);
let mockPathname = "/dashboard";

jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({
    refresh: mockRefresh,
    replace: mockReplace,
  }),
}));

jest.mock("@/lib/supabase/client", () => ({
  createSupabaseBrowserClient: () => ({
    auth: {
      signOut: mockProviderSignOut,
    },
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
      within(mobileNavigation).getByRole("link", { name: "Contas" }),
    ).toHaveClass("bg-surface-muted", "font-semibold", "text-primary");
    expect(
      within(primaryNavigation).getByRole("link", { name: "Visão geral" }),
    ).not.toHaveAttribute("aria-current");
    expect(
      within(primaryNavigation).getByRole("link", { name: "Transações" }),
    ).not.toHaveAttribute("aria-current");
    expect(
      within(mobileNavigation).getByRole("link", { name: "Transações" }),
    ).not.toHaveClass("bg-surface-muted", "font-semibold");
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

  it("lets keyboard users bypass the persistent shell and keeps the topbar available", () => {
    renderShell();

    const skipLink = screen.getByRole("link", {
      name: "Pular para o conteúdo",
    });
    const content = screen.getByTestId("private-shell-content");

    expect(skipLink).toHaveAttribute("href", "#conteudo-principal");
    expect(skipLink).toHaveClass("sr-only", "focus:not-sr-only");
    expect(content).toHaveAttribute("id", "conteudo-principal");
    expect(content).toHaveAttribute("tabindex", "-1");
    expect(screen.getByRole("banner")).toHaveClass("sticky", "top-0", "z-20");
  });

  it("keeps the existing sign-out flow connected from the topbar", async () => {
    const user = userEvent.setup();
    renderShell();

    await user.click(screen.getByRole("button", { name: "Sair" }));

    await waitFor(() => {
      expect(mockProviderSignOut).toHaveBeenCalledWith({ scope: "local" });
      expect(mockReplace).toHaveBeenCalledWith("/login");
      expect(mockRefresh).toHaveBeenCalledTimes(1);
    });
  });

  it("uses a neutral title and no active item for an unknown private path", () => {
    mockPathname = "/unknown";
    renderShell();

    expect(
      within(screen.getByRole("banner")).getByText("Área financeira"),
    ).toBeInTheDocument();
    expect(
      screen
        .getAllByRole("link")
        .filter((link) => link.getAttribute("aria-current") === "page"),
    ).toHaveLength(0);
  });
});

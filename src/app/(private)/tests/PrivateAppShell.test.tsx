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
    document.body.style.overflow = "";
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
      expect(link).toHaveClass("motion-reduce:transition-none");
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

  it("renders a compact topbar and keeps account actions hidden by default", () => {
    renderShell();

    const banner = screen.getByRole("banner");
    const accountTrigger = within(banner).getByRole("button", {
      name: "Abrir painel da conta",
    });

    expect(banner).toHaveClass(
      "min-h-16",
      "pt-[env(safe-area-inset-top)]",
    );
    expect(within(banner).getByText("FinControl")).toBeInTheDocument();
    expect(within(banner).getByText("Visão geral")).toHaveClass(
      "hidden",
      "md:block",
    );
    expect(accountTrigger).toHaveAttribute("aria-expanded", "false");
    expect(accountTrigger).toHaveClass("min-h-11", "min-w-11");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByText("usuario@example.com")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("radiogroup", { name: "Tema" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Sair" })).not.toBeInTheDocument();
    expect(screen.getAllByRole("main")).toHaveLength(1);
    expect(screen.getByRole("main")).toHaveTextContent("Conteúdo financeiro");
  });

  it("opens a named responsive account dialog with session, theme and logout", async () => {
    const user = userEvent.setup();
    const { container } = renderShell();

    const accountTrigger = screen.getByRole("button", {
      name: "Abrir painel da conta",
    });
    await user.click(accountTrigger);

    const dialog = screen.getByRole("dialog", { name: "Conta e aparência" });
    const closeButton = within(dialog).getByRole("button", {
      name: "Fechar painel da conta",
    });

    expect(accountTrigger).toHaveAttribute("aria-expanded", "true");
    expect(accountTrigger).toHaveAttribute("aria-controls", dialog.id);
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleDescription(
      "Sessão atual usuario@example.com",
    );
    expect(dialog).toHaveClass(
      "fixed",
      "inset-x-0",
      "bottom-0",
      "rounded-t-2xl",
      "overscroll-contain",
      "pl-[max(1rem,env(safe-area-inset-left))]",
      "pr-[max(1rem,env(safe-area-inset-right))]",
      "pb-[max(1rem,env(safe-area-inset-bottom))]",
      "md:absolute",
      "md:inset-x-auto",
      "md:right-4",
      "md:top-[calc(4rem+env(safe-area-inset-top))]",
      "md:rounded-xl",
    );
    expect(container).toHaveAttribute("aria-hidden", "true");
    expect(container).toHaveAttribute("inert");
    expect(within(dialog).getByText("usuario@example.com")).toBeInTheDocument();
    expect(
      within(dialog).getByRole("radiogroup", { name: "Tema" }),
    ).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Sair" })).toBeInTheDocument();
    expect(closeButton).toHaveFocus();
    expect(document.body).toHaveStyle({ overflow: "hidden" });
  });

  it("closes with Escape and restores focus and document scroll", async () => {
    const user = userEvent.setup();
    const { container } = renderShell();

    const accountTrigger = screen.getByRole("button", {
      name: "Abrir painel da conta",
    });
    await user.click(accountTrigger);
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(accountTrigger).toHaveAttribute("aria-expanded", "false");
    expect(accountTrigger).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
    expect(container).not.toHaveAttribute("aria-hidden");
    expect(container).not.toHaveAttribute("inert");
  });

  it("keeps horizontal safe areas in the compact topbar", () => {
    renderShell();

    expect(screen.getByRole("banner").firstElementChild).toHaveClass(
      "pl-[max(1rem,env(safe-area-inset-left))]",
      "pr-[max(1rem,env(safe-area-inset-right))]",
      "sm:px-6",
      "lg:px-8",
    );
  });

  it("closes through the explicit action and backdrop", async () => {
    const user = userEvent.setup();
    renderShell();

    const accountTrigger = screen.getByRole("button", {
      name: "Abrir painel da conta",
    });
    await user.click(accountTrigger);
    await user.click(
      screen.getByRole("button", { name: "Fechar painel da conta" }),
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(accountTrigger).toHaveFocus();

    await user.click(accountTrigger);
    await user.click(screen.getByTestId("account-panel-backdrop"));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(accountTrigger).toHaveFocus();
  });

  it("contains forward and backward keyboard focus inside the dialog", async () => {
    const user = userEvent.setup();
    renderShell();

    await user.click(
      screen.getByRole("button", { name: "Abrir painel da conta" }),
    );

    const dialog = screen.getByRole("dialog", { name: "Conta e aparência" });
    const closeButton = within(dialog).getByRole("button", {
      name: "Fechar painel da conta",
    });
    const signOutButton = within(dialog).getByRole("button", { name: "Sair" });

    signOutButton.focus();
    await user.tab();
    expect(closeButton).toHaveFocus();

    await user.tab({ shift: true });
    expect(signOutButton).toHaveFocus();
  });

  it("changes theme without dismissing the account dialog", async () => {
    const user = userEvent.setup();
    renderShell();

    await user.click(
      screen.getByRole("button", { name: "Abrir painel da conta" }),
    );
    await user.click(screen.getByRole("radio", { name: "Escuro" }));

    expect(screen.getByRole("radio", { name: "Escuro" })).toBeChecked();
    expect(
      screen.getByRole("dialog", { name: "Conta e aparência" }),
    ).toBeInTheDocument();
  });

  it("reserves mobile bottom space without introducing a second main landmark", () => {
    renderShell(<main className="min-h-dvh">Página atual</main>);

    expect(screen.getByTestId("private-shell-content")).toHaveClass(
      "min-w-0",
      "pb-[calc(5rem+env(safe-area-inset-bottom))]",
      "md:pb-0",
    );
    expect(screen.getAllByRole("main")).toHaveLength(1);
  });

  it("lets keyboard users bypass the persistent shell and keeps the topbar available", async () => {
    const user = userEvent.setup();
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

    await user.tab();
    expect(skipLink).toHaveFocus();
  });

  it("keeps the existing sign-out flow connected from the topbar", async () => {
    const user = userEvent.setup();
    renderShell();

    await user.click(
      screen.getByRole("button", { name: "Abrir painel da conta" }),
    );
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
    ).toHaveClass("hidden", "md:block");
    expect(
      screen
        .getAllByRole("link")
        .filter((link) => link.getAttribute("aria-current") === "page"),
    ).toHaveLength(0);
  });
});

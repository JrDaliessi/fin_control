import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "../../../shared/theme/ThemeProvider";
import type { SignInWithPasswordInput } from "../domain/interfaces/auth.gateway";
import { LoginPage } from "../presentation/pages/LoginPage";

function createDeferred() {
  let resolve!: () => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<void>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });

  return { promise, reject, resolve };
}

async function fillCredentials() {
  const user = userEvent.setup();

  await user.type(screen.getByLabelText("E-mail"), "usuario@example.com");
  await user.type(screen.getByLabelText("Senha"), "senha-segura");

  return user;
}

function renderLoginPage(onSignIn: (input: SignInWithPasswordInput) => Promise<void>) {
  render(
    <ThemeProvider>
      <LoginPage onSignIn={onSignIn} />
    </ThemeProvider>,
  );
}

describe("LoginPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
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

  it("renders an accessible password login form", () => {
    renderLoginPage(jest.fn(async () => undefined));

    expect(
      screen.getByRole("heading", { name: "Entrar na sua conta" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("E-mail")).toHaveAttribute("type", "email");
    expect(screen.getByLabelText("Senha")).toHaveAttribute("type", "password");
    expect(
      screen.getByRole("form", { name: "Entrar na sua conta" })
    ).toHaveAttribute("aria-busy", "false");
    expect(
      screen.queryByRole("heading", {
        level: 2,
        name: "Clareza para decidir antes que o dinheiro vire preocupação."
      })
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("Use seu e-mail e sua senha para acessar sua conta.")
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/Supabase Auth/i)
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeEnabled();
    expect(screen.getByRole("radiogroup", { name: "Tema" })).toBeInTheDocument();
  });

  it("shows a loading state and prevents duplicate submissions", async () => {
    const deferred = createDeferred();
    const onSignIn = jest.fn<
      (input: SignInWithPasswordInput) => Promise<void>
    >(() => deferred.promise);
    renderLoginPage(onSignIn);
    const user = await fillCredentials();

    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(onSignIn).toHaveBeenCalledWith({
      email: "usuario@example.com",
      password: "senha-segura"
    });
    expect(screen.getByRole("button", { name: "Entrando..." })).toBeDisabled();
    expect(screen.getByLabelText("E-mail")).toBeDisabled();
    expect(screen.getByLabelText("Senha")).toBeDisabled();
    expect(
      screen.getByRole("form", { name: "Entrar na sua conta" })
    ).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("status")).toHaveTextContent("Entrando...");

    deferred.resolve();
    expect(
      await screen.findByText("Login realizado. Redirecionando...")
    ).toBeInTheDocument();
  });

  it("shows a generic error without exposing provider details", async () => {
    const onSignIn = jest.fn(async () => {
      throw new Error("user does not exist");
    });
    renderLoginPage(onSignIn);
    const user = await fillCredentials();

    await user.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível entrar. Verifique suas credenciais e tente novamente."
    );
    expect(screen.queryByText("user does not exist")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeEnabled();
    expect(
      screen.getByRole("form", { name: "Entrar na sua conta" })
    ).toHaveAttribute("aria-busy", "false");
  });
});

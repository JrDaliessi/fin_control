"use client";

import { useState, type FormEvent } from "react";
import { LogIn, ShieldCheck } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { FeedbackMessage } from "@/shared/components/ui/FeedbackMessage";
import { ThemeSwitcher } from "@/shared/components/ui/ThemeSwitcher";
import type { SignInWithPasswordInput } from "../../domain/interfaces/auth.gateway";

type LoginPageProps = {
  initialCredentials?: SignInWithPasswordInput;
  onSignIn(input: SignInWithPasswordInput): Promise<void>;
};

type SubmissionStatus = "idle" | "loading" | "success" | "error";

const genericErrorMessage =
  "Não foi possível entrar. Verifique suas credenciais e tente novamente.";

export function LoginPage({ initialCredentials, onSignIn }: LoginPageProps) {
  const [email, setEmail] = useState(initialCredentials?.email ?? "");
  const [password, setPassword] = useState(initialCredentials?.password ?? "");
  const [status, setStatus] = useState<SubmissionStatus>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (status === "loading") {
      return;
    }

    setStatus("loading");

    try {
      await onSignIn({ email, password });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const isLoading = status === "loading";

  return (
    <main className="grid min-h-screen min-h-dvh place-items-center bg-background px-4 py-8 text-foreground sm:px-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-surface shadow-sm lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden bg-navigation p-10 text-navigation-foreground lg:grid lg:content-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-navigation-accent">
              FinControl
            </p>
            <p className="mt-5 max-w-md text-4xl font-semibold leading-tight">
              Clareza para decidir antes que o dinheiro vire preocupação.
            </p>
            <p className="mt-5 max-w-md text-base leading-7 text-navigation-muted">
              Acompanhe contas, lançamentos e seu resumo financeiro em uma experiência simples e segura.
            </p>
          </div>

          <div className="flex items-center gap-3 text-sm text-navigation-muted">
            <ShieldCheck aria-hidden="true" className="text-navigation-accent" size={22} />
            Sua sessão é verificada antes de acessar dados financeiros.
          </div>
        </section>

        <section className="p-6 sm:p-10 lg:p-12">
          <div className="mb-6 flex justify-end">
            <ThemeSwitcher />
          </div>
          <p className="text-xs font-semibold uppercase text-primary sm:text-sm">
            Acesso seguro
          </p>
          <h1
            className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl"
            id="login-heading"
          >
            Entrar na sua conta
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {initialCredentials
              ? "Acesso de demonstração preparado. Selecione Entrar para explorar o app."
              : "Use seu e-mail e sua senha para acessar sua conta."}
          </p>

          <form
            aria-busy={isLoading}
            aria-labelledby="login-heading"
            className="mt-8 grid gap-5"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground" htmlFor="email">
                E-mail
              </label>
              <input
                autoComplete="username"
                className="min-h-11 rounded-md border border-border bg-surface px-3 py-2 text-base text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-focus-ring/30 disabled:bg-surface-muted"
                disabled={isLoading}
                id="email"
                name="email"
                onChange={(event) => setEmail(event.target.value)}
                required
                type="email"
                value={email}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground" htmlFor="password">
                Senha
              </label>
              <input
                autoComplete="current-password"
                className="min-h-11 rounded-md border border-border bg-surface px-3 py-2 text-base text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-focus-ring/30 disabled:bg-surface-muted"
                disabled={isLoading}
                id="password"
                name="password"
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
            </div>

            {status === "error" ? (
              <FeedbackMessage className="border border-danger p-3" variant="error">
                {genericErrorMessage}
              </FeedbackMessage>
            ) : null}

            {isLoading ? (
              <p className="sr-only" role="status">
                Entrando...
              </p>
            ) : null}

            {status === "success" ? (
              <FeedbackMessage className="font-medium" variant="status">
                Login realizado. Redirecionando...
              </FeedbackMessage>
            ) : null}

            <Button disabled={isLoading} type="submit">
              <LogIn aria-hidden="true" size={18} />
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}

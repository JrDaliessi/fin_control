"use client";

import { Button } from "@/shared/components/ui/Button";

type DashboardErrorProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

export default function DashboardError({ reset }: DashboardErrorProps) {
  return (
    <main className="min-h-screen min-h-dvh bg-background px-4 py-5 text-foreground sm:px-6 sm:py-8 lg:px-8">
      <section
        aria-describedby="dashboard-error-description"
        aria-labelledby="dashboard-error-title"
        className="mx-auto grid w-full max-w-6xl gap-4 rounded-md border border-danger bg-danger-surface p-5"
        role="alert"
      >
        <div>
          <h1
            className="text-xl font-semibold text-foreground"
            id="dashboard-error-title"
          >
            Não foi possível carregar sua evolução financeira.
          </h1>
          <p
            className="mt-2 text-sm text-muted-foreground"
            id="dashboard-error-description"
          >
            Verifique sua conexão e tente novamente.
          </p>
        </div>
        <Button
          className="w-fit"
          onClick={reset}
        >
          Tentar novamente
        </Button>
      </section>
    </main>
  );
}

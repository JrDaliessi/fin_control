"use client";

type DashboardErrorProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

export default function DashboardError({ reset }: DashboardErrorProps) {
  return (
    <main className="min-h-screen min-h-dvh bg-background px-4 py-5 text-foreground sm:px-6 sm:py-8 lg:px-8">
      <section
        className="mx-auto grid w-full max-w-6xl gap-4 rounded-md border border-danger bg-danger-surface p-5"
        role="alert"
      >
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Não foi possível carregar sua evolução financeira.
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Verifique sua conexão e tente novamente.
          </p>
        </div>
        <button
          className="min-h-11 w-fit rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2"
          onClick={reset}
          type="button"
        >
          Tentar novamente
        </button>
      </section>
    </main>
  );
}

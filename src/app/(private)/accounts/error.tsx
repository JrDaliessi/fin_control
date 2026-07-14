"use client";

type AccountsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AccountsError({ reset }: AccountsErrorProps) {
  return (
    <main className="min-h-screen bg-background px-4 py-5 text-foreground sm:px-6 sm:py-8 lg:px-8">
      <section
        className="mx-auto grid w-full max-w-6xl gap-4 rounded-md border border-red-200 bg-red-50 p-5"
        role="alert"
      >
        <div>
          <h1 className="text-xl font-semibold text-slate-950">
            Não foi possível carregar suas contas.
          </h1>
          <p className="mt-2 text-sm text-slate-700">
            Verifique sua conexão e tente novamente.
          </p>
        </div>
        <button
          className="min-h-11 w-fit rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
          onClick={reset}
          type="button"
        >
          Tentar novamente
        </button>
      </section>
    </main>
  );
}

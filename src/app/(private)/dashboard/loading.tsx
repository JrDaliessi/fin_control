export default function DashboardLoading() {
  return (
    <main className="min-h-screen min-h-dvh bg-background px-4 py-5 text-foreground sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-12 gap-6">
        <header className="col-span-12 border-b border-border pb-5">
          <p className="text-xs font-semibold uppercase text-primary sm:text-sm">
            FinControl
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
            Visão geral
          </h1>
        </header>
        <div
          aria-busy="true"
          aria-live="polite"
          className="col-span-12 rounded-md border border-border bg-surface p-5 text-sm text-muted-foreground shadow-sm"
          role="status"
        >
          Carregando evolução financeira...
        </div>
      </div>
    </main>
  );
}

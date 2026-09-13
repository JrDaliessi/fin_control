export default function DashboardLoading() {
  return (
    <main className="min-h-screen min-h-dvh bg-background px-4 py-5 text-foreground sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-12 gap-6">
        <h1 className="sr-only">Visão geral</h1>
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

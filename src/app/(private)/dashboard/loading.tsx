export default function DashboardLoading() {
  return (
    <main className="min-h-screen min-h-dvh bg-background px-4 py-5 text-foreground sm:px-6 sm:py-8 lg:px-8">
      <div
        aria-live="polite"
        className="mx-auto w-full max-w-6xl rounded-md border border-border bg-surface p-5 text-sm text-muted-foreground shadow-sm"
        role="status"
      >
        Carregando evolução financeira...
      </div>
    </main>
  );
}

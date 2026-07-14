export default function AccountsLoading() {
  return (
    <main className="min-h-screen min-h-dvh bg-background px-4 py-5 text-foreground sm:px-6 sm:py-8 lg:px-8">
      <div
        aria-live="polite"
        className="mx-auto w-full max-w-6xl rounded-md border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm"
        role="status"
      >
        Carregando suas contas...
      </div>
    </main>
  );
}

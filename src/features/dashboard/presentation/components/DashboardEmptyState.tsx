import Link from "next/link";

export function DashboardEmptyState() {
  return (
    <div className="grid gap-3 rounded-md border border-dashed border-border bg-surface-muted p-6 text-center">
      <p className="text-sm text-muted-foreground" role="status">
        Nenhuma transação registrada ainda.
      </p>
      <Link
        className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2"
        href="/transactions"
      >
        Registrar primeira transação
      </Link>
    </div>
  );
}

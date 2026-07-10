import Link from "next/link";

export function DashboardEmptyState() {
  return (
    <div className="grid gap-3 rounded-md border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
      <p className="text-sm text-slate-600">
        Nenhuma transação registrada ainda.
      </p>
      <Link
        className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
        href="/transactions"
      >
        Registrar primeira transação
      </Link>
    </div>
  );
}

import Link from "next/link";
import { Card } from "@/shared/components/ui/Card";

export function DashboardEmptyState() {
  return (
    <Card className="grid gap-3 border-dashed bg-surface-muted p-6 text-center">
      <p className="text-sm text-muted-foreground" role="status">
        Nenhuma transação registrada ainda.
      </p>
      <Link
        className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2"
        href="/transactions"
      >
        Registrar primeira transação
      </Link>
    </Card>
  );
}

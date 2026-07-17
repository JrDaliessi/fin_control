"use client";

import { Button } from "@/shared/components/ui/Button";

type TransactionsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function TransactionsError({ reset }: TransactionsErrorProps) {
  return (
    <main className="min-h-dvh bg-background px-4 py-5 text-foreground sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-4 rounded-md border border-danger/30 bg-danger-surface p-5 shadow-sm">
        <p className="text-sm text-danger" role="alert">
          Não foi possível carregar suas transações.
        </p>
        <div>
          <Button onClick={reset} type="button">
            Tentar novamente
          </Button>
        </div>
      </div>
    </main>
  );
}

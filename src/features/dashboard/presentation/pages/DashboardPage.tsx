import type { ReactNode } from "react";

type DashboardPageProps = Readonly<{
  children?: ReactNode;
}>;

export function DashboardPage({ children }: DashboardPageProps = {}) {
  return (
    <main className="min-h-screen min-h-dvh bg-background px-4 py-5 text-foreground sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-12 gap-6">
        <h1 className="sr-only">Visão geral</h1>
        <div className="col-span-12 min-w-0">{children}</div>
      </div>
    </main>
  );
}

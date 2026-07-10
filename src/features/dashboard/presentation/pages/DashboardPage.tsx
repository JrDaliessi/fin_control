"use client";

import { DashboardEmptyState } from "../components/DashboardEmptyState";

export function DashboardPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-5 text-foreground sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase text-primary sm:text-sm">
            Controle Financeiro IA
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-950 sm:text-3xl">
            Dashboard
          </h1>
        </div>

        <DashboardEmptyState />
      </div>
    </main>
  );
}

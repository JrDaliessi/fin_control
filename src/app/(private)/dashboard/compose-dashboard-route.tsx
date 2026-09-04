import { DashboardPage } from "@/features/dashboard/presentation/pages/DashboardPage";
import { FinancialEvolutionPanel } from "@/features/financial-analytics/presentation/components/FinancialEvolutionPanel";
import { normalizeFinancialPeriodKind } from "@/features/financial-analytics/presentation/config/financial-period-options";
import { loadFinancialEvolution } from "@/app/(private)/dashboard/load-financial-evolution";
import { loadFinancialIntervalStatementAction } from "@/app/(private)/dashboard/actions";

export type DashboardRouteProps = Readonly<{
  searchParams: Promise<Readonly<{ period?: string | readonly string[] }>>;
}>;

export async function composeDashboardRoute({
  searchParams
}: DashboardRouteProps) {
  const { period } = await searchParams;
  const selectedPeriodKind = normalizeFinancialPeriodKind(period);
  const financialEvolution = await loadFinancialEvolution({
    kind: selectedPeriodKind
  });

  return (
    <DashboardPage>
      <FinancialEvolutionPanel
        loadStatement={loadFinancialIntervalStatementAction}
        result={financialEvolution}
        selectedPeriodKind={selectedPeriodKind}
      />
    </DashboardPage>
  );
}

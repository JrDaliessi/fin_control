import { DashboardPage } from "@/features/dashboard/presentation/pages/DashboardPage";
import { FinancialEvolutionPanel } from "@/features/financial-analytics/presentation/components/FinancialEvolutionPanel";
import { FinancialPeriodSelectionError } from "@/features/financial-analytics/presentation/components/FinancialPeriodSelectionError";
import { resolveFinancialPeriodSearchParams } from "@/features/financial-analytics/presentation/config/financial-period-options";
import { loadFinancialEvolution } from "@/app/(private)/dashboard/load-financial-evolution";
import { loadFinancialIntervalStatementAction } from "@/app/(private)/dashboard/actions";

export type DashboardRouteProps = Readonly<{
  searchParams: Promise<
    Readonly<{
      period?: string | readonly string[];
      from?: string | readonly string[];
      to?: string | readonly string[];
    }>
  >;
}>;

export async function composeDashboardRoute({
  searchParams
}: DashboardRouteProps) {
  const selection = resolveFinancialPeriodSearchParams(await searchParams);

  if (selection.status === "invalid_custom") {
    return (
      <DashboardPage>
        <FinancialPeriodSelectionError reason={selection.reason} />
      </DashboardPage>
    );
  }

  const financialEvolution = await loadFinancialEvolution(
    selection.kind === "custom"
      ? {
          kind: selection.kind,
          from: selection.from,
          to: selection.to
        }
      : { kind: selection.kind }
  );

  return (
    <DashboardPage>
      <FinancialEvolutionPanel
        loadStatement={loadFinancialIntervalStatementAction}
        result={financialEvolution}
        selectedCustomPeriod={
          selection.kind === "custom"
            ? { from: selection.from, to: selection.to }
            : undefined
        }
        selectedPeriodKind={selection.kind}
      />
    </DashboardPage>
  );
}

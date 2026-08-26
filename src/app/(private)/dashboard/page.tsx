import { DashboardPage } from "@/features/dashboard/presentation/pages/DashboardPage";
import { normalizeFinancialPeriodKind } from "@/features/financial-analytics/presentation/config/financial-period-options";
import { loadFinancialEvolution } from "@/app/(private)/dashboard/load-financial-evolution";

type DashboardRoutePageProps = Readonly<{
  searchParams: Promise<Readonly<{ period?: string | readonly string[] }>>;
}>;

export default async function DashboardRoutePage({
  searchParams
}: DashboardRoutePageProps) {
  const { period } = await searchParams;
  const selectedPeriodKind = normalizeFinancialPeriodKind(period);
  const financialEvolution = await loadFinancialEvolution({
    kind: selectedPeriodKind
  });

  return (
    <DashboardPage
      financialEvolution={financialEvolution}
      selectedPeriodKind={selectedPeriodKind}
    />
  );
}

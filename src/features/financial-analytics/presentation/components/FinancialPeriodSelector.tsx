import type { FinancialPeriodKind } from "../../domain/types/financial-period.types";
import { Button } from "@/shared/components/ui/Button";
import { financialPeriodOptions } from "../config/financial-period-options";

type FinancialPeriodSelectorProps = Readonly<{
  selectedPeriodKind: FinancialPeriodKind;
}>;

export function FinancialPeriodSelector({
  selectedPeriodKind
}: FinancialPeriodSelectorProps) {
  return (
    <form className="flex w-full flex-wrap items-end gap-3 sm:w-auto" method="get">
      <div className="grid w-full gap-2 sm:w-auto">
        <label className="text-sm font-medium text-foreground" htmlFor="period">
          Período da evolução financeira
        </label>
        <select
          className="min-h-11 w-full rounded-md border border-border bg-surface px-3 py-2 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 sm:text-sm"
          defaultValue={selectedPeriodKind}
          id="period"
          name="period"
        >
          {financialPeriodOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <Button className="w-full sm:w-auto" type="submit">
        Atualizar período
      </Button>
    </form>
  );
}

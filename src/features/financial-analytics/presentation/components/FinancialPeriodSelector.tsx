import type { FinancialPeriodKind } from "../../domain/types/financial-period.types";
import { financialPeriodOptions } from "../config/financial-period-options";

type FinancialPeriodSelectorProps = Readonly<{
  selectedPeriodKind: FinancialPeriodKind;
}>;

export function FinancialPeriodSelector({
  selectedPeriodKind
}: FinancialPeriodSelectorProps) {
  return (
    <form className="flex flex-wrap items-end gap-3" method="get">
      <div className="grid gap-2">
        <label className="text-sm font-medium text-foreground" htmlFor="period">
          Período da evolução financeira
        </label>
        <select
          className="min-h-11 rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2"
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
      <button
        className="min-h-11 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2"
        type="submit"
      >
        Atualizar período
      </button>
    </form>
  );
}

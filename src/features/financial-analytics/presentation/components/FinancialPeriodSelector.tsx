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
    <form className="min-w-0 w-full sm:w-auto" method="get">
      <div
        aria-label="Período da evolução financeira"
        className="flex max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-1"
        role="group"
      >
        {financialPeriodOptions.map((option) => {
          const isSelected = option.value === selectedPeriodKind;

          return (
            <Button
              aria-label={option.accessibleLabel}
              aria-pressed={isSelected}
              className={`shrink-0 ${
                isSelected
                  ? "ring-2 ring-focus-ring ring-offset-2 ring-offset-background"
                  : ""
              }`}
              key={option.value}
              name="period"
              type="submit"
              value={option.value}
              variant={isSelected ? "primary" : "secondary"}
            >
              {option.label}
            </Button>
          );
        })}
      </div>
    </form>
  );
}

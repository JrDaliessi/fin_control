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
    <form className="grid min-w-0 w-full gap-1 sm:w-auto" method="get">
      <div
        aria-describedby="financial-period-guidance"
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
              className={`shrink-0 motion-reduce:transition-none ${
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
      <p
        className="text-xs text-muted-foreground"
        id="financial-period-guidance"
      >
        Semana e Quinzena seguem o calendário; 7D e 15D contam até hoje.
      </p>
    </form>
  );
}

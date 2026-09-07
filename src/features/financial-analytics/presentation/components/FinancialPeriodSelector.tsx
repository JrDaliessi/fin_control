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
        className="flex max-w-full gap-1 overflow-x-auto overscroll-x-contain p-1 sm:gap-2"
        role="group"
      >
        {financialPeriodOptions.map((option) => {
          const isSelected = option.value === selectedPeriodKind;

          return (
            <Button
              aria-label={option.accessibleLabel}
              aria-pressed={isSelected}
              className={`shrink-0 !px-2 motion-reduce:transition-none sm:!px-4 ${
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
              <span className="sm:hidden">{option.compactLabel}</span>
              <span className="hidden sm:inline">{option.label}</span>
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

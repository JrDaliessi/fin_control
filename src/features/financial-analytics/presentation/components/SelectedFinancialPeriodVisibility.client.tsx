"use client";

import { useEffect } from "react";
import type { FinancialPeriodKind } from "../../domain/types/financial-period.types";

type SelectedFinancialPeriodVisibilityProps = Readonly<{
  selectedPeriodKind: FinancialPeriodKind;
}>;

export function SelectedFinancialPeriodVisibility({
  selectedPeriodKind
}: SelectedFinancialPeriodVisibilityProps) {
  useEffect(() => {
    const periodBar = document.getElementById("financial-period-selector");
    const selectedPeriod = periodBar?.querySelector<HTMLButtonElement>(
      'button[aria-pressed="true"]'
    );

    if (selectedPeriod && typeof periodBar?.scrollTo === "function") {
      const centeredLeft =
        selectedPeriod.offsetLeft -
        (periodBar.clientWidth - selectedPeriod.offsetWidth) / 2;

      periodBar.scrollTo({
        behavior: "auto",
        left: Math.max(0, centeredLeft)
      });
    }
  }, [selectedPeriodKind]);

  return null;
}

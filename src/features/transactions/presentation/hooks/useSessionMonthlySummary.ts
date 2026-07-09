"use client";

import { useEffect, useMemo, useState } from "react";
import {
  listSessionMonthlySummary
} from "../../application/use-cases/list-session-monthly-summary.use-case";
import type { MonthlySummary } from "../../application/use-cases/list-monthly-summary.use-case";
import type { CreateTransactionInput } from "../../domain/entities/transaction.entity";
import type { MonthlySummaryPanelStatus } from "../components/MonthlySummaryPanel";

type MonthlySummaryState = {
  errorMessage?: string;
  status: MonthlySummaryPanelStatus;
  summary: MonthlySummary | null;
};

type UseSessionMonthlySummaryParams = {
  transactions: CreateTransactionInput[];
  userId: string;
};

export function useSessionMonthlySummary({
  transactions,
  userId
}: UseSessionMonthlySummaryParams): MonthlySummaryState {
  const [monthlySummaryState, setMonthlySummaryState] =
    useState<MonthlySummaryState>({
      status: "loading",
      summary: null
    });
  const monthRef = useMemo(
    () => getVisibleMonthRef(transactions),
    [transactions]
  );

  useEffect(() => {
    let shouldUpdate = true;

    listSessionMonthlySummary({
      monthRef,
      transactions,
      userId
    })
      .then((summary) => {
        if (!shouldUpdate) {
          return;
        }

        setMonthlySummaryState({
          status: "success",
          summary
        });
      })
      .catch((error) => {
        if (!shouldUpdate) {
          return;
        }

        setMonthlySummaryState({
          errorMessage:
            error instanceof Error
              ? error.message
              : "Não foi possível calcular o resumo mensal.",
          status: "error",
          summary: null
        });
      });

    return () => {
      shouldUpdate = false;
    };
  }, [monthRef, transactions, userId]);

  return monthlySummaryState;
}

function getVisibleMonthRef(transactions: CreateTransactionInput[]) {
  const visibleDate = transactions[0]?.occurredAt ?? new Date();
  const year = visibleDate.getUTCFullYear();
  const month = String(visibleDate.getUTCMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  GetDashboardSummaryUseCase,
  type DashboardSummary
} from "../../application/use-cases/get-dashboard-summary.use-case";
import type { CreateTransactionInput } from "../../../transactions/domain/entities/transaction.entity";
import { resolveSessionMonthRef } from "../../../transactions/application/utils/resolve-session-month-ref";

export type DashboardSummaryStatus = "loading" | "success" | "error";

type DashboardSummaryState = {
  errorMessage?: string;
  status: DashboardSummaryStatus;
  summary: DashboardSummary | null;
};

type DashboardSummaryRequest = {
  monthRef: string;
  transactions: readonly CreateTransactionInput[];
  userId: string;
};

type DashboardSummaryResult = DashboardSummaryState & {
  request: DashboardSummaryRequest | null;
};

type UseDashboardSummaryParams = {
  transactions: readonly CreateTransactionInput[];
  userId: string;
};

export function useDashboardSummary({
  transactions,
  userId
}: UseDashboardSummaryParams): DashboardSummaryState {
  const [result, setResult] = useState<DashboardSummaryResult>({
    request: null,
    status: "loading",
    summary: null
  });
  const monthRef = useMemo(
    () => resolveSessionMonthRef(transactions),
    [transactions]
  );
  const request = useMemo<DashboardSummaryRequest>(
    () => ({ monthRef, transactions, userId }),
    [monthRef, transactions, userId]
  );

  useEffect(() => {
    let shouldUpdate = true;
    const useCase = new GetDashboardSummaryUseCase();

    useCase
      .execute(request)
      .then((summary) => {
        if (shouldUpdate) {
          setResult({ request, status: "success", summary });
        }
      })
      .catch(() => {
        if (shouldUpdate) {
          setResult({
            errorMessage: "Não foi possível carregar o dashboard.",
            request,
            status: "error",
            summary: null
          });
        }
      });

    return () => {
      shouldUpdate = false;
    };
  }, [request]);

  if (result.request !== request) {
    return { status: "loading", summary: null };
  }

  return result;
}

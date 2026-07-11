"use client";

import { useEffect, useMemo, useState } from "react";
import {
  GetDashboardSummaryUseCase,
  type DashboardSummary
} from "../../application/use-cases/get-dashboard-summary.use-case";
import type { CreateTransactionInput } from "../../../transactions/domain/entities/transaction.entity";

export type DashboardSummaryStatus = "loading" | "success" | "error";

type DashboardSummaryState = {
  errorMessage?: string;
  status: DashboardSummaryStatus;
  summary: DashboardSummary | null;
};

type DashboardSummaryRequest = {
  monthRef: string;
  transactions: CreateTransactionInput[];
  userId: string;
};

type DashboardSummaryResult = DashboardSummaryState & {
  request: DashboardSummaryRequest | null;
};

type UseDashboardSummaryParams = {
  transactions: CreateTransactionInput[];
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
    () => getVisibleMonthRef(transactions),
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

function getVisibleMonthRef(transactions: CreateTransactionInput[]) {
  const visibleDate = transactions.reduce<Date>(
    (latestDate, transaction) =>
      transaction.occurredAt.getTime() > latestDate.getTime()
        ? transaction.occurredAt
        : latestDate,
    transactions[0]?.occurredAt ?? new Date()
  );
  const year = visibleDate.getUTCFullYear();
  const month = String(visibleDate.getUTCMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}

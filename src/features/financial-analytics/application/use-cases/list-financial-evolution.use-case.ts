import type {
  FinancialAnalyticsQueryRepository,
  FinancialHistoryStartQueryRepository
} from "../ports/financial-analytics-query.repository";
import { resolveReferenceCivilDate } from "../services/resolve-reference-civil-date";
import { aggregateFinancialEvolution } from "../../domain/services/aggregate-financial-evolution";
import { aggregateFinancialCandles } from "../../domain/services/aggregate-financial-candles";
import {
  resolveAllFinancialPeriod,
  resolveCustomFinancialPeriod,
  resolveFinancialPeriod
} from "../../domain/services/resolve-financial-period";
import type {
  FinancialCandle,
  FinancialEvolutionPoint
} from "../../domain/types/financial-evolution.types";
import type {
  FinancialPeriod,
  FinancialPeriodKind
} from "../../domain/types/financial-period.types";

export type ListFinancialEvolutionRequest = Readonly<{
  userId: string;
  kind: FinancialPeriodKind;
  from?: string;
  to?: string;
  referenceInstant: string;
  timeZone: string;
}>;

export type FinancialEvolutionSummaryDto = Readonly<{
  openingBalanceInCents: number;
  incomeInCents: number;
  expenseInCents: number;
  netInCents: number;
  closingBalanceInCents: number;
  transactionCount: number;
}>;

export type FinancialEvolutionDto = Readonly<{
  status: "missing_accounts" | "empty" | "success";
  accountCount: number;
  period: FinancialPeriod;
  summary: FinancialEvolutionSummaryDto;
  points: readonly FinancialEvolutionPoint[];
  candles: readonly FinancialCandle[];
}>;

type ListFinancialEvolutionDependencies = Readonly<{
  financialAnalyticsQueryRepository: FinancialAnalyticsQueryRepository &
    FinancialHistoryStartQueryRepository;
}>;

function summarize(
  openingBalanceInCents: number,
  points: readonly FinancialEvolutionPoint[]
): FinancialEvolutionSummaryDto {
  let incomeInCents = 0;
  let expenseInCents = 0;
  let transactionCount = 0;

  for (const point of points) {
    incomeInCents += point.incomeInCents;
    expenseInCents += point.expenseInCents;
    transactionCount += point.transactionCount;

    if (
      !Number.isSafeInteger(incomeInCents) ||
      !Number.isSafeInteger(expenseInCents) ||
      !Number.isSafeInteger(transactionCount)
    ) {
      throw new Error("financial evolution summary must remain a safe integer");
    }
  }

  const netInCents = incomeInCents - expenseInCents;
  const closingBalanceInCents =
    points.at(-1)?.closingBalanceInCents ?? openingBalanceInCents;

  if (!Number.isSafeInteger(netInCents)) {
    throw new Error("financial evolution summary must remain a safe integer");
  }

  return {
    openingBalanceInCents,
    incomeInCents,
    expenseInCents,
    netInCents,
    closingBalanceInCents,
    transactionCount
  };
}

export class ListFinancialEvolutionUseCase {
  private readonly repository: FinancialAnalyticsQueryRepository &
    FinancialHistoryStartQueryRepository;

  constructor({
    financialAnalyticsQueryRepository
  }: ListFinancialEvolutionDependencies) {
    this.repository = financialAnalyticsQueryRepository;
  }

  async execute(
    request: ListFinancialEvolutionRequest
  ): Promise<FinancialEvolutionDto> {
    const userId = request.userId.trim();

    if (!userId) {
      throw new Error("user is required");
    }

    const referenceOn = resolveReferenceCivilDate({
      referenceInstant: request.referenceInstant,
      timeZone: request.timeZone
    });
    let period: FinancialPeriod;

    if (request.kind === "custom") {
      if (typeof request.from !== "string" || typeof request.to !== "string") {
        throw new Error("period kind custom requires dates");
      }

      period = resolveCustomFinancialPeriod({
        from: request.from,
        to: request.to
      });
    } else if (request.kind === "all") {
      let historyStartOn: string | null;

      try {
        historyStartOn = await this.repository.loadFinancialHistoryStart({
          userId
        });
      } catch {
        throw new Error("financial evolution unavailable");
      }

      period = resolveAllFinancialPeriod({ historyStartOn, referenceOn });
    } else {
      period = resolveFinancialPeriod({
        kind: request.kind,
        referenceOn
      });
    }

    if (period.bucketGranularity !== "day") {
      let bucketSnapshot: Awaited<
        ReturnType<FinancialAnalyticsQueryRepository["loadEvolutionBuckets"]>
      >;

      try {
        bucketSnapshot = await this.repository.loadEvolutionBuckets({
          userId,
          startOnInclusive: period.startOnInclusive,
          endOnExclusive: period.endOnExclusive,
          bucketGranularity: period.bucketGranularity
        });

        const firstBucket = bucketSnapshot.buckets[0];
        const lastBucket = bucketSnapshot.buckets.at(-1);

        if (
          firstBucket?.startOnInclusive !== period.startOnInclusive ||
          lastBucket?.endOnExclusive !== period.endOnExclusive
        ) {
          throw new Error("financial evolution bucket interval mismatch");
        }
      } catch {
        throw new Error("financial evolution unavailable");
      }

      const openingBalanceInCents =
        bucketSnapshot.buckets[0]?.openInCents ?? 0;

      if (bucketSnapshot.accountCount === 0) {
        return {
          status: "missing_accounts",
          accountCount: 0,
          period,
          summary: summarize(openingBalanceInCents, []),
          points: [],
          candles: []
        };
      }

      const points = bucketSnapshot.buckets.map((bucket) => ({
        startOnInclusive: bucket.startOnInclusive,
        endOnExclusive: bucket.endOnExclusive,
        incomeInCents: bucket.incomeInCents,
        expenseInCents: bucket.expenseInCents,
        netInCents: bucket.incomeInCents - bucket.expenseInCents,
        closingBalanceInCents: bucket.closeInCents,
        transactionCount: bucket.transactionCount
      }));

      return {
        status:
          points.some((point) => point.transactionCount > 0)
            ? "success"
            : "empty",
        accountCount: bucketSnapshot.accountCount,
        period,
        summary: summarize(openingBalanceInCents, points),
        points,
        candles: bucketSnapshot.buckets
      };
    }

    let snapshot: Awaited<
      ReturnType<FinancialAnalyticsQueryRepository["loadEvolutionSnapshot"]>
    >;

    try {
      snapshot = await this.repository.loadEvolutionSnapshot({
        userId,
        startOnInclusive: period.startOnInclusive,
        endOnExclusive: period.endOnExclusive
      });
    } catch {
      throw new Error("financial evolution unavailable");
    }

    if (snapshot.accountCount === 0) {
      return {
        status: "missing_accounts",
        accountCount: 0,
        period,
        summary: summarize(snapshot.openingBalanceInCents, []),
        points: [],
        candles: []
      };
    }

    const points = aggregateFinancialEvolution({
      period,
      openingBalanceInCents: snapshot.openingBalanceInCents,
      movements: snapshot.movements
    });
    const candles = aggregateFinancialCandles({
      period,
      openingBalanceInCents: snapshot.openingBalanceInCents,
      movements: snapshot.movements
    });

    return {
      status: snapshot.movements.length === 0 ? "empty" : "success",
      accountCount: snapshot.accountCount,
      period,
      summary: summarize(snapshot.openingBalanceInCents, points),
      points,
      candles
    };
  }
}

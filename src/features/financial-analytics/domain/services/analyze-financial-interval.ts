import { validateFinancialInterval } from "./validate-financial-interval";

export type FinancialIntervalAnalysisInput = Readonly<{
  startOnInclusive: string;
  endOnExclusive: string;
  incomeInCents: number;
  expenseInCents: number;
  volumeInCents: number;
  transactionCount: number;
}>;

export type FinancialIntervalAnalysisSummary = Readonly<{
  incomeInCents: number;
  expenseInCents: number;
  volumeInCents: number;
  netInCents: number;
  incomePercentage: number | null;
  expensePercentage: number | null;
  transactionCount: number;
}>;

export type FinancialIntervalInsight =
  | Readonly<{ kind: "empty" }>
  | Readonly<{
      kind: "composition";
      dominantType: "income" | "expense" | "balanced";
      incomePercentage: number;
      expensePercentage: number;
    }>
  | Readonly<{
      kind: "net";
      direction: "positive" | "negative" | "neutral";
      amountInCents: number;
    }>;

export type FinancialIntervalAnalysis = Readonly<{
  summary: FinancialIntervalAnalysisSummary;
  insights: readonly FinancialIntervalInsight[];
}>;

const invalidAnalysisMessage = "financial interval analysis is invalid";

function assertNonNegativeSafeInteger(value: number): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(invalidAnalysisMessage);
  }
}

export function analyzeFinancialInterval(
  input: FinancialIntervalAnalysisInput
): FinancialIntervalAnalysis {
  try {
    validateFinancialInterval(input);
  } catch {
    throw new Error(invalidAnalysisMessage);
  }

  assertNonNegativeSafeInteger(input.incomeInCents);
  assertNonNegativeSafeInteger(input.expenseInCents);
  assertNonNegativeSafeInteger(input.volumeInCents);
  assertNonNegativeSafeInteger(input.transactionCount);

  const expectedVolumeInCents =
    input.incomeInCents + input.expenseInCents;

  if (
    !Number.isSafeInteger(expectedVolumeInCents) ||
    expectedVolumeInCents !== input.volumeInCents
  ) {
    throw new Error(invalidAnalysisMessage);
  }

  const netInCents = input.incomeInCents - input.expenseInCents;

  if (input.volumeInCents === 0) {
    return {
      summary: {
        incomeInCents: input.incomeInCents,
        expenseInCents: input.expenseInCents,
        volumeInCents: input.volumeInCents,
        netInCents,
        incomePercentage: null,
        expensePercentage: null,
        transactionCount: input.transactionCount
      },
      insights: [{ kind: "empty" }]
    };
  }

  const incomePercentage = Math.round(
    (input.incomeInCents / input.volumeInCents) * 100
  );
  const expensePercentage = 100 - incomePercentage;
  const dominantType =
    input.incomeInCents === input.expenseInCents
      ? "balanced"
      : input.incomeInCents > input.expenseInCents
        ? "income"
        : "expense";
  const direction =
    netInCents === 0 ? "neutral" : netInCents > 0 ? "positive" : "negative";

  return {
    summary: {
      incomeInCents: input.incomeInCents,
      expenseInCents: input.expenseInCents,
      volumeInCents: input.volumeInCents,
      netInCents,
      incomePercentage,
      expensePercentage,
      transactionCount: input.transactionCount
    },
    insights: [
      {
        kind: "composition",
        dominantType,
        incomePercentage,
        expensePercentage
      },
      { kind: "net", direction, amountInCents: netInCents }
    ]
  };
}

import { describe, expect, it } from "@jest/globals";
import { mapFinancialEvolutionBucketRows } from "../infrastructure/supabase/financial-evolution-buckets.mapper";

const bucketRow = {
  account_count: "1",
  start_on_inclusive: "2026-07-01",
  end_on_exclusive: "2026-07-06",
  open_in_cents: "10000",
  high_in_cents: "15000",
  low_in_cents: "10000",
  close_in_cents: "13000",
  income_in_cents: "5000",
  expense_in_cents: "2000",
  volume_in_cents: "7000",
  transaction_count: "2"
};

describe("mapFinancialEvolutionBucketRows", () => {
  it("maps numeric strings into the minimal serializable bucket projection", () => {
    expect(mapFinancialEvolutionBucketRows([bucketRow])).toEqual({
      accountCount: 1,
      buckets: [
        {
          startOnInclusive: "2026-07-01",
          endOnExclusive: "2026-07-06",
          openInCents: 10_000,
          highInCents: 15_000,
          lowInCents: 10_000,
          closeInCents: 13_000,
          incomeInCents: 5_000,
          expenseInCents: 2_000,
          volumeInCents: 7_000,
          transactionCount: 2
        }
      ]
    });
  });

  it("accepts consecutive empty buckets carrying the previous close", () => {
    expect(
      mapFinancialEvolutionBucketRows([
        bucketRow,
        {
          ...bucketRow,
          start_on_inclusive: "2026-07-06",
          end_on_exclusive: "2026-07-13",
          open_in_cents: "13000",
          high_in_cents: "13000",
          low_in_cents: "13000",
          close_in_cents: "13000",
          income_in_cents: "0",
          expense_in_cents: "0",
          volume_in_cents: "0",
          transaction_count: "0"
        }
      ]).buckets
    ).toHaveLength(2);
  });

  it("accepts a zero-account response without manufacturing ownership", () => {
    expect(
      mapFinancialEvolutionBucketRows([
        {
          ...bucketRow,
          account_count: "0",
          open_in_cents: "0",
          high_in_cents: "0",
          low_in_cents: "0",
          close_in_cents: "0",
          income_in_cents: "0",
          expense_in_cents: "0",
          volume_in_cents: "0",
          transaction_count: "0"
        }
      ])
    ).toEqual(
      expect.objectContaining({
        accountCount: 0
      })
    );
  });

  it("rejects an absent aggregate response", () => {
    expect(() => mapFinancialEvolutionBucketRows([])).toThrow("bucket");
  });

  it.each([
    ["negative account count", { ...bucketRow, account_count: "-1" }],
    ["invalid start", { ...bucketRow, start_on_inclusive: "2026-02-30" }],
    [
      "inverted interval",
      {
        ...bucketRow,
        start_on_inclusive: "2026-07-06",
        end_on_exclusive: "2026-07-01"
      }
    ],
    ["unsafe money", { ...bucketRow, high_in_cents: "9007199254740992" }],
    ["negative income", { ...bucketRow, income_in_cents: "-1" }],
    ["negative expense", { ...bucketRow, expense_in_cents: "-1" }],
    ["negative volume", { ...bucketRow, volume_in_cents: "-1" }],
    ["negative count", { ...bucketRow, transaction_count: "-1" }],
    ["wrong volume", { ...bucketRow, volume_in_cents: "6999" }],
    ["high below open", { ...bucketRow, high_in_cents: "9999" }],
    ["low above close", { ...bucketRow, low_in_cents: "13001" }]
  ])("rejects a malformed bucket with %s", (_scenario, row) => {
    expect(() => mapFinancialEvolutionBucketRows([row])).toThrow();
  });

  it("rejects inconsistent account counts", () => {
    expect(() =>
      mapFinancialEvolutionBucketRows([
        bucketRow,
        {
          ...bucketRow,
          account_count: "2",
          start_on_inclusive: "2026-07-06",
          end_on_exclusive: "2026-07-13",
          open_in_cents: "13000"
        }
      ])
    ).toThrow("bucket");
  });

  it("rejects gaps, overlaps and non-ascending buckets", () => {
    expect(() =>
      mapFinancialEvolutionBucketRows([
        bucketRow,
        {
          ...bucketRow,
          start_on_inclusive: "2026-07-07",
          end_on_exclusive: "2026-07-14",
          open_in_cents: "13000"
        }
      ])
    ).toThrow("bucket");
  });

  it("rejects a discontinuous carried balance between buckets", () => {
    expect(() =>
      mapFinancialEvolutionBucketRows([
        bucketRow,
        {
          ...bucketRow,
          start_on_inclusive: "2026-07-06",
          end_on_exclusive: "2026-07-13",
          open_in_cents: "13001"
        }
      ])
    ).toThrow("bucket");
  });
});

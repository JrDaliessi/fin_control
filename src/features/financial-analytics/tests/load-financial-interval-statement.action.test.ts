import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import {
  forgedStatementUserId,
  statementInterval,
  statementRow,
  statementUserId
} from "./fixtures/financial-interval-statement.fixtures";

jest.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: jest.fn()
}));

const { createSupabaseServerClient } = jest.requireMock<
  typeof import("@/lib/supabase/server")
>("@/lib/supabase/server");
const { loadFinancialIntervalStatementAction } = jest.requireActual<
  typeof import("@/app/(private)/dashboard/actions")
>("@/app/(private)/dashboard/actions");

function createSupabaseClientStub(
  claims: { sub?: string; is_anonymous?: boolean } | null = {
    sub: statementUserId,
    is_anonymous: false
  },
  claimsError: Error | null = null
) {
  const getClaims = jest.fn(async () => ({
    data: claims ? { claims } : { claims: null },
    error: claimsError
  }));
  type OrderOptions = Readonly<{ ascending: boolean }>;
  const orderById = jest.fn(
    async (column: string, options: OrderOptions) => {
      void column;
      void options;
      return { data: [statementRow], error: null };
    }
  );
  const orderByCreatedAt = jest.fn(
    (column: string, options: OrderOptions) => {
      void column;
      void options;
      return { order: orderById };
    }
  );
  const orderByOccurredOn = jest.fn(
    (column: string, options: OrderOptions) => {
      void column;
      void options;
      return { order: orderByCreatedAt };
    }
  );
  const lessThan = jest.fn((column: string, value: string) => {
    void column;
    void value;
    return { order: orderByOccurredOn };
  });
  const greaterThanOrEqual = jest.fn((column: string, value: string) => {
    void column;
    void value;
    return { lt: lessThan };
  });
  const equals = jest.fn((column: string, value: string) => {
    void column;
    void value;
    return { gte: greaterThanOrEqual };
  });
  const select = jest.fn((columns: string) => {
    void columns;
    return { eq: equals };
  });
  const from = jest.fn((table: string) => {
    void table;
    return { select };
  });

  return {
    client: { auth: { getClaims }, from },
    equals,
    from,
    getClaims
  };
}

describe("loadFinancialIntervalStatementAction", () => {
  const createServerClientMock = jest.mocked(createSupabaseServerClient);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("derives the owner from permanent claims and ignores forged input", async () => {
    const supabase = createSupabaseClientStub();
    createServerClientMock.mockResolvedValue(supabase.client as never);

    const result = await loadFinancialIntervalStatementAction({
      ...statementInterval,
      userId: forgedStatementUserId
    } as never);

    expect(supabase.getClaims).toHaveBeenCalledTimes(1);
    expect(supabase.equals).toHaveBeenCalledWith("user_id", statementUserId);
    expect(supabase.equals).not.toHaveBeenCalledWith(
      "user_id",
      forgedStatementUserId
    );
    expect(result).not.toHaveProperty("userId");
    expect(result).toEqual(
      expect.objectContaining({
        ...statementInterval,
        items: [expect.objectContaining({ description: "Salário" })]
      })
    );
  });

  it.each([
    ["missing claims", null, null],
    ["invalid claims", null, new Error("expired jwt")],
    ["anonymous Auth user", { sub: statementUserId, is_anonymous: true }, null]
  ])("fails closed before querying for %s", async (_name, claims, error) => {
    const supabase = createSupabaseClientStub(claims, error);
    createServerClientMock.mockResolvedValue(supabase.client as never);

    await expect(
      loadFinancialIntervalStatementAction(statementInterval)
    ).rejects.toThrow("authentication required");
    expect(supabase.from).not.toHaveBeenCalled();
  });
});

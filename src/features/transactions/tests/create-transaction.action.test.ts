import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: jest.fn()
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn()
}));

const { createSupabaseServerClient } = jest.requireMock<
  typeof import("@/lib/supabase/server")
>("@/lib/supabase/server");
const { revalidatePath } = jest.requireMock<typeof import("next/cache")>(
  "next/cache"
);
const { createTransactionAction, loadTransactionsPageAction } =
  jest.requireActual<
    typeof import("@/app/(private)/transactions/actions")
  >("@/app/(private)/transactions/actions");

const permanentUserId = "09aabfb8-e06e-41e7-b364-12a5dbf27a20";
const forgedUserId = "b35d36d3-2366-46fa-a0c8-00f037098a87";
const actionInput = {
  accountId: "6ca6c81f-11a4-4a34-8090-2185bb0e63a8",
  categoryId: "07c1dad0-d669-41d3-b0c2-8ca9d7ca6e29",
  description: "Mercado",
  amountInCents: 12550,
  type: "expense" as const,
  occurredOn: "2026-07-08"
};

function createSupabaseClientStub(
  claims: { sub?: string; is_anonymous?: boolean } | null = {
    sub: permanentUserId,
    is_anonymous: false
  },
  claimsError: Error | null = null
) {
  const transactionRow = {
    id: "f04a89a8-4440-45e6-9f0b-c4cfb66d9950",
    user_id: permanentUserId,
    account_id: actionInput.accountId,
    category_id: actionInput.categoryId,
    description: actionInput.description,
    amount_in_cents: actionInput.amountInCents,
    type: actionInput.type,
    payment_method: "manual" as const,
    occurred_on: actionInput.occurredOn,
    notes: null,
    created_at: "2026-07-08T12:00:00.000Z",
    updated_at: "2026-07-08T12:00:00.000Z"
  };
  const accountRow = {
    id: actionInput.accountId,
    user_id: permanentUserId,
    name: "Conta principal",
    type: "checking" as const,
    initial_balance_in_cents: 0,
    currency: "BRL" as const,
    created_at: "2026-07-01T10:00:00.000Z",
    updated_at: "2026-07-01T10:00:00.000Z"
  };
  const categoryRow = {
    id: actionInput.categoryId,
    user_id: permanentUserId,
    name: "Mercado",
    kind: "expense" as const,
    created_at: "2026-07-01T10:00:00.000Z",
    updated_at: "2026-07-01T10:00:00.000Z"
  };
  const getClaims = jest.fn(async () => ({
    data: claims ? { claims } : { claims: null },
    error: claimsError
  }));

  const transactionSingle = jest.fn(async () => ({ data: transactionRow, error: null }));
  const transactionInsertSelect = jest.fn(() => ({ single: transactionSingle }));
  const transactionInsert = jest.fn((payload: unknown) => {
    void payload;
    return { select: transactionInsertSelect };
  });
  const transactionOrderId = jest.fn(async () => ({ data: [transactionRow], error: null }));
  const transactionOrderCreated = jest.fn(() => ({ order: transactionOrderId }));
  const transactionOrderOccurred = jest.fn(() => ({ order: transactionOrderCreated }));
  const transactionLt = jest.fn(() => ({ order: transactionOrderOccurred }));
  const transactionGte = jest.fn((column: string, value: string) => {
    void column;
    void value;
    return { lt: transactionLt };
  });
  const transactionEq = jest.fn((column: string, value: string) => {
    void column;
    void value;
    return { gte: transactionGte };
  });
  const transactionSelect = jest.fn(() => ({ eq: transactionEq }));

  const accountOrderId = jest.fn(async () => ({ data: [accountRow], error: null }));
  const accountOrderCreated = jest.fn(() => ({ order: accountOrderId }));
  const accountEq = jest.fn(() => ({ order: accountOrderCreated }));
  const accountSelect = jest.fn(() => ({ eq: accountEq }));

  const categoryOrderId = jest.fn(async () => ({ data: [categoryRow], error: null }));
  const categoryOrderName = jest.fn(() => ({ order: categoryOrderId }));
  const categoryOrderKind = jest.fn(() => ({ order: categoryOrderName }));
  const categoryEq = jest.fn(() => ({ order: categoryOrderKind }));
  const categorySelect = jest.fn(() => ({ eq: categoryEq }));

  const from = jest.fn((table: string) => {
    if (table === "transactions") {
      return { insert: transactionInsert, select: transactionSelect };
    }
    if (table === "financial_accounts") {
      return { select: accountSelect };
    }
    return { select: categorySelect };
  });

  return {
    client: { auth: { getClaims }, from },
    from,
    getClaims,
    transactionEq,
    transactionGte,
    transactionInsert
  };
}

describe("transaction actions", () => {
  const createServerClientMock = jest.mocked(createSupabaseServerClient);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("injects the verified actor and returns a serializable transaction", async () => {
    const { client, getClaims, transactionInsert } = createSupabaseClientStub();
    createServerClientMock.mockResolvedValue(client as never);

    const result = await createTransactionAction({
      ...actionInput,
      userId: forgedUserId
    } as never);

    expect(getClaims).toHaveBeenCalledTimes(1);
    expect(transactionInsert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: permanentUserId })
    );
    expect(transactionInsert).not.toHaveBeenCalledWith(
      expect.objectContaining({ user_id: forgedUserId })
    );
    expect(result).not.toHaveProperty("userId");
    expect(result.occurredOn).toBe("2026-07-08");
    expect(revalidatePath).toHaveBeenCalledWith("/transactions");
  });

  it.each([
    ["missing claims", null, null],
    ["invalid claims", null, new Error("expired jwt")],
    ["anonymous Auth user", { sub: permanentUserId, is_anonymous: true }, null]
  ])("fails closed before persistence for %s", async (_name, claims, error) => {
    const { client, from } = createSupabaseClientStub(claims, error);
    createServerClientMock.mockResolvedValue(client as never);

    await expect(createTransactionAction(actionInput)).rejects.toThrow(
      "authentication required"
    );
    expect(from).not.toHaveBeenCalled();
  });

  it("rejects an impossible civil date before persistence", async () => {
    const { client, from } = createSupabaseClientStub();
    createServerClientMock.mockResolvedValue(client as never);

    await expect(
      createTransactionAction({ ...actionInput, occurredOn: "2026-02-31" })
    ).rejects.toThrow("date");
    expect(from).not.toHaveBeenCalled();
  });

  it("loads only the verified actor and selected month", async () => {
    const { client, getClaims, transactionEq, transactionGte } =
      createSupabaseClientStub();
    createServerClientMock.mockResolvedValue(client as never);

    const result = await loadTransactionsPageAction({ monthRef: "2026-07" });

    expect(getClaims).toHaveBeenCalledTimes(1);
    expect(transactionEq).toHaveBeenCalledWith("user_id", permanentUserId);
    expect(transactionGte).toHaveBeenCalledWith("occurred_on", "2026-07-01");
    expect(result.accounts).toEqual([
      expect.objectContaining({ id: actionInput.accountId, name: "Conta principal" })
    ]);
    expect(result.categories).toEqual([
      expect.objectContaining({ id: actionInput.categoryId, kind: "expense" })
    ]);
    expect(result.transactions).toEqual([
      expect.objectContaining({ description: "Mercado" })
    ]);
    expect(result.summary).toEqual(
      expect.objectContaining({ expenseTotalInCents: 12550, transactionCount: 1 })
    );
  });
});

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
const { createAccountAction, listAccountsAction } = jest.requireActual<
  typeof import("@/app/(private)/accounts/actions")
>("@/app/(private)/accounts/actions");

const permanentUserId = "09aabfb8-e06e-41e7-b364-12a5dbf27a20";
const forgedUserId = "b35d36d3-2366-46fa-a0c8-00f037098a87";
const actionInput = {
  name: "Conta principal",
  type: "checking" as const,
  initialBalanceInCents: 150000,
  currency: "BRL" as const
};

function createSupabaseClientStub(
  claims: {
    sub?: string;
    is_anonymous?: boolean;
  } | null = { sub: permanentUserId, is_anonymous: false },
  claimsError: Error | null = null
) {
  const persistedRow = {
    id: "6ca6c81f-11a4-4a34-8090-2185bb0e63a8",
    user_id: permanentUserId,
    name: actionInput.name,
    type: actionInput.type,
    initial_balance_in_cents: actionInput.initialBalanceInCents,
    currency: actionInput.currency,
    created_at: "2026-07-14T10:00:00.000Z",
    updated_at: "2026-07-14T10:00:00.000Z"
  };
  const getClaims = jest.fn(async () => ({
    data: claims ? { claims } : { claims: null },
    error: claimsError
  }));
  const single = jest.fn(async () => ({ data: persistedRow, error: null }));
  const select = jest.fn<(columns: string) => { single: typeof single }>(
    (columns) => {
      void columns;
      return { single };
    }
  );
  const insert = jest.fn<
    (payload: Record<string, unknown>) => { select: typeof select }
  >((payload) => {
    void payload;
    return { select };
  });
  const orderById = jest.fn(async () => ({ data: [persistedRow], error: null }));
  const orderByCreatedAt = jest.fn(() => ({ order: orderById }));
  const eq = jest.fn<
    (column: string, value: string) => { order: typeof orderByCreatedAt }
  >((column, value) => {
    void column;
    void value;
    return { order: orderByCreatedAt };
  });
  const listSelect = jest.fn(() => ({ eq }));
  const from = jest.fn<
    (table: string) => {
      insert: typeof insert;
      select: typeof listSelect;
    }
  >(
    (table) => {
      void table;
      return { insert, select: listSelect };
    }
  );

  return {
    client: { auth: { getClaims }, from },
    from,
    getClaims,
    insert,
    eq
  };
}

describe("createAccountAction", () => {
  const createServerClientMock = jest.mocked(createSupabaseServerClient);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("revalidates claims and ignores a forged owner from the payload", async () => {
    const { client, getClaims, insert } = createSupabaseClientStub();
    createServerClientMock.mockResolvedValue(client as never);

    const result = await createAccountAction({
      ...actionInput,
      userId: forgedUserId
    } as never);

    expect(getClaims).toHaveBeenCalledTimes(1);
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: permanentUserId })
    );
    expect(insert).not.toHaveBeenCalledWith(
      expect.objectContaining({ user_id: forgedUserId })
    );
    expect(result).toEqual({
      id: "6ca6c81f-11a4-4a34-8090-2185bb0e63a8",
      name: "Conta principal",
      type: "checking",
      initialBalanceInCents: 150000,
      currency: "BRL",
      createdAt: "2026-07-14T10:00:00.000Z",
      updatedAt: "2026-07-14T10:00:00.000Z"
    });
  });

  it.each([
    ["missing claims", null, null],
    ["invalid claims", null, new Error("expired jwt")],
    ["anonymous Auth user", { sub: permanentUserId, is_anonymous: true }, null]
  ])(
    "fails closed before persistence for %s",
    async (_caseName, claims, claimsError) => {
      const { client, from } = createSupabaseClientStub(claims, claimsError);
      createServerClientMock.mockResolvedValue(client as never);

      await expect(createAccountAction(actionInput)).rejects.toThrow(
        "authentication required"
      );
      expect(from).not.toHaveBeenCalled();
    }
  );

  it("revalidates claims on every invocation", async () => {
    const first = createSupabaseClientStub();
    const second = createSupabaseClientStub();
    createServerClientMock
      .mockResolvedValueOnce(first.client as never)
      .mockResolvedValueOnce(second.client as never);

    await createAccountAction(actionInput);
    await createAccountAction(actionInput);

    expect(createServerClientMock).toHaveBeenCalledTimes(2);
    expect(first.getClaims).toHaveBeenCalledTimes(1);
    expect(second.getClaims).toHaveBeenCalledTimes(1);
  });

  it("lists only through the verified actor and returns serializable accounts", async () => {
    const { client, eq, getClaims } = createSupabaseClientStub();
    createServerClientMock.mockResolvedValue(client as never);

    await expect(listAccountsAction()).resolves.toEqual([
      expect.objectContaining({
        id: "6ca6c81f-11a4-4a34-8090-2185bb0e63a8",
        name: "Conta principal",
        createdAt: "2026-07-14T10:00:00.000Z"
      })
    ]);
    expect(getClaims).toHaveBeenCalledTimes(1);
    expect(eq).toHaveBeenCalledWith("user_id", permanentUserId);
  });
});

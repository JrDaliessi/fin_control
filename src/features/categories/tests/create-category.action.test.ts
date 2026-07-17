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
const { createCategoryAction, listCategoriesAction } = jest.requireActual<
  typeof import("@/app/(private)/categories/actions")
>("@/app/(private)/categories/actions");

const permanentUserId = "09aabfb8-e06e-41e7-b364-12a5dbf27a20";
const forgedUserId = "b35d36d3-2366-46fa-a0c8-00f037098a87";
const actionInput = {
  name: "Alimentação",
  kind: "expense" as const
};

function createSupabaseClientStub(
  claims: { sub?: string; is_anonymous?: boolean } | null = {
    sub: permanentUserId,
    is_anonymous: false
  },
  claimsError: Error | null = null
) {
  const persistedRow = {
    id: "07c1dad0-d669-41d3-b0c2-8ca9d7ca6e29",
    user_id: permanentUserId,
    name: actionInput.name,
    kind: actionInput.kind,
    created_at: "2026-07-16T12:00:00.000Z",
    updated_at: "2026-07-16T12:00:00.000Z"
  };
  const getClaims = jest.fn(async () => ({
    data: claims ? { claims } : { claims: null },
    error: claimsError
  }));
  const single = jest.fn(async () => ({ data: persistedRow, error: null }));
  const insertSelect = jest.fn<
    (columns: string) => { single: typeof single }
  >((columns) => {
    void columns;
    return { single };
  });
  const insert = jest.fn<
    (payload: Record<string, unknown>) => { select: typeof insertSelect }
  >((payload) => {
    void payload;
    return { select: insertSelect };
  });
  const orderById = jest.fn(
    async (column: string, options: { ascending: boolean }) => {
      void column;
      void options;
      return { data: [persistedRow], error: null };
    }
  );
  const orderByName = jest.fn(
    (column: string, options: { ascending: boolean }) => {
      void column;
      void options;
      return { order: orderById };
    }
  );
  const orderByKind = jest.fn(
    (column: string, options: { ascending: boolean }) => {
      void column;
      void options;
      return { order: orderByName };
    }
  );
  const eq = jest.fn((column: string, value: string) => {
    void column;
    void value;
    return { order: orderByKind };
  });
  const listSelect = jest.fn((columns: string) => {
    void columns;
    return { eq };
  });
  const from = jest.fn((table: string) => {
    void table;
    return { insert, select: listSelect };
  });

  return {
    client: { auth: { getClaims }, from },
    eq,
    from,
    getClaims,
    insert
  };
}

describe("category actions", () => {
  const createServerClientMock = jest.mocked(createSupabaseServerClient);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("revalidates claims, ignores a forged owner and revalidates the route", async () => {
    const { client, getClaims, insert } = createSupabaseClientStub();
    createServerClientMock.mockResolvedValue(client as never);

    const result = await createCategoryAction({
      ...actionInput,
      userId: forgedUserId
    } as never);

    expect(getClaims).toHaveBeenCalledTimes(1);
    expect(insert).toHaveBeenCalledWith({
      user_id: permanentUserId,
      name: "Alimentação",
      kind: "expense"
    });
    expect(insert).not.toHaveBeenCalledWith(
      expect.objectContaining({ user_id: forgedUserId })
    );
    expect(revalidatePath).toHaveBeenCalledWith("/categories");
    expect(result).toEqual({
      id: "07c1dad0-d669-41d3-b0c2-8ca9d7ca6e29",
      name: "Alimentação",
      kind: "expense",
      createdAt: "2026-07-16T12:00:00.000Z",
      updatedAt: "2026-07-16T12:00:00.000Z"
    });
  });

  it.each([
    ["missing claims", null, null],
    ["invalid claims", null, new Error("expired jwt")],
    ["anonymous Auth user", { sub: permanentUserId, is_anonymous: true }, null]
  ])("fails closed before persistence for %s", async (_name, claims, error) => {
    const { client, from } = createSupabaseClientStub(claims, error);
    createServerClientMock.mockResolvedValue(client as never);

    await expect(createCategoryAction(actionInput)).rejects.toThrow(
      "authentication required"
    );
    expect(from).not.toHaveBeenCalled();
  });

  it("lists only through the verified actor", async () => {
    const { client, eq, getClaims } = createSupabaseClientStub();
    createServerClientMock.mockResolvedValue(client as never);

    await expect(listCategoriesAction()).resolves.toEqual([
      expect.objectContaining({
        id: "07c1dad0-d669-41d3-b0c2-8ca9d7ca6e29",
        name: "Alimentação"
      })
    ]);
    expect(getClaims).toHaveBeenCalledTimes(1);
    expect(eq).toHaveBeenCalledWith("user_id", permanentUserId);
  });
});

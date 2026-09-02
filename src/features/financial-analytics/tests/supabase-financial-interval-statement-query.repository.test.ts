import { describe, expect, it, jest } from "@jest/globals";
import { SupabaseFinancialIntervalStatementQueryRepository } from "../infrastructure/repositories/supabase-financial-interval-statement-query.repository";
import {
  statementInterval,
  statementItem,
  statementRow,
  statementUserId
} from "./fixtures/financial-interval-statement.fixtures";

const statementColumns =
  "id,description,amount_in_cents,type,occurred_on,created_at";

function createQueryStub(result: Readonly<{
  data: readonly typeof statementRow[] | null;
  error: unknown;
}> = { data: [statementRow], error: null }) {
  type OrderOptions = Readonly<{ ascending: boolean }>;
  const orderById = jest.fn(
    async (column: string, options: OrderOptions) => {
      void column;
      void options;
      return result;
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
    client: { from },
    equals,
    from,
    greaterThanOrEqual,
    lessThan,
    orderByCreatedAt,
    orderById,
    orderByOccurredOn,
    select
  };
}

describe("SupabaseFinancialIntervalStatementQueryRepository", () => {
  it("selects the minimum projection for one owner and semi-open interval", async () => {
    const query = createQueryStub();
    const repository = new SupabaseFinancialIntervalStatementQueryRepository({
      supabaseClient: query.client
    });

    const result = await repository.listByInterval({
      userId: statementUserId,
      ...statementInterval
    });

    expect(query.from).toHaveBeenCalledWith("transactions");
    expect(query.select).toHaveBeenCalledWith(statementColumns);
    expect(query.equals).toHaveBeenCalledWith("user_id", statementUserId);
    expect(query.greaterThanOrEqual).toHaveBeenCalledWith(
      "occurred_on",
      statementInterval.startOnInclusive
    );
    expect(query.lessThan).toHaveBeenCalledWith(
      "occurred_on",
      statementInterval.endOnExclusive
    );
    expect(query.orderByOccurredOn).toHaveBeenCalledWith("occurred_on", {
      ascending: false
    });
    expect(query.orderByCreatedAt).toHaveBeenCalledWith("created_at", {
      ascending: false
    });
    expect(query.orderById).toHaveBeenCalledWith("id", { ascending: false });
    expect(result).toEqual([statementItem]);
  });

  it("sanitizes provider failures and rejects null payloads", async () => {
    const providerError = {
      code: "42501",
      details: "sensitive policy details",
      hint: "internal relation",
      message: "permission denied for public.transactions"
    };
    const query = createQueryStub({ data: null, error: providerError });
    const repository = new SupabaseFinancialIntervalStatementQueryRepository({
      supabaseClient: query.client
    });
    const promise = repository.listByInterval({
      userId: statementUserId,
      ...statementInterval
    });

    await expect(promise).rejects.toThrow(
      "financial interval statement repository unavailable"
    );
    await promise.catch((error: unknown) => {
      const message = (error as Error).message;
      expect(message).not.toContain(providerError.code);
      expect(message).not.toContain(providerError.details);
      expect(message).not.toContain(providerError.hint);
      expect(message).not.toContain(providerError.message);
    });
  });
});

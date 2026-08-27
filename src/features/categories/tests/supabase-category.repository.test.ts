import { describe, expect, it, jest } from "@jest/globals";
import { Category } from "../domain/entities/category.entity";
import { SupabaseCategoryRepository } from "../infrastructure/repositories/supabase-category.repository";
import {
  categoryUserId,
  persistedCategoryRow,
  validCategoryInput
} from "./fixtures/category.fixtures";

const category = Category.create(validCategoryInput);
const categoryColumns = "id,user_id,name,kind,created_at,updated_at";

describe("SupabaseCategoryRepository", () => {
  it("creates in categories and returns the persisted row", async () => {
    const single = jest.fn(async () => ({
      data: persistedCategoryRow,
      error: null
    }));
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
    const from = jest.fn<(table: string) => { insert: typeof insert }>(
      (table) => {
        void table;
        return { insert };
      }
    );
    const repository = new SupabaseCategoryRepository({
      supabaseClient: { from }
    });

    const result = await repository.create(category);

    expect(from).toHaveBeenCalledWith("categories");
    expect(insert).toHaveBeenCalledWith({
      user_id: categoryUserId,
      name: "Alimentação",
      kind: "expense"
    });
    expect(select).toHaveBeenCalledWith(categoryColumns);
    expect(single).toHaveBeenCalledTimes(1);
    expect(result).toEqual(
      expect.objectContaining({ id: persistedCategoryRow.id, userId: categoryUserId })
    );
  });

  it("lists only the requested owner in deterministic order", async () => {
    const orderById = jest.fn<
      (
        column: string,
        options: { ascending: boolean }
      ) => Promise<{ data: readonly [typeof persistedCategoryRow]; error: null }>
    >(async (column, options) => {
      void column;
      void options;
      return { data: [persistedCategoryRow], error: null };
    });
    const orderByName = jest.fn<
      (
        column: string,
        options: { ascending: boolean }
      ) => { order: typeof orderById }
    >((column, options) => {
      void column;
      void options;
      return { order: orderById };
    });
    const orderByKind = jest.fn<
      (
        column: string,
        options: { ascending: boolean }
      ) => { order: typeof orderByName }
    >((column, options) => {
      void column;
      void options;
      return { order: orderByName };
    });
    const eq = jest.fn<
      (column: string, value: string) => { order: typeof orderByKind }
    >((column, value) => {
      void column;
      void value;
      return { order: orderByKind };
    });
    const select = jest.fn<(columns: string) => { eq: typeof eq }>(
      (columns) => {
        void columns;
        return { eq };
      }
    );
    const from = jest.fn<(table: string) => { select: typeof select }>(
      (table) => {
        void table;
        return { select };
      }
    );
    const repository = new SupabaseCategoryRepository({
      supabaseClient: { from }
    });

    const result = await repository.listByUser({ userId: categoryUserId });

    expect(from).toHaveBeenCalledWith("categories");
    expect(select).toHaveBeenCalledWith(categoryColumns);
    expect(eq).toHaveBeenCalledWith("user_id", categoryUserId);
    expect(orderByKind).toHaveBeenCalledWith("kind", { ascending: true });
    expect(orderByName).toHaveBeenCalledWith("name", { ascending: true });
    expect(orderById).toHaveBeenCalledWith("id", { ascending: true });
    expect(result).toEqual([
      expect.objectContaining({ id: persistedCategoryRow.id, userId: categoryUserId })
    ]);
  });

  it.each(["create", "list"] as const)(
    "sanitizes a Supabase %s failure",
    async (operation) => {
      const providerError = {
        code: "42501",
        details: "sensitive category row",
        hint: "internal database policy",
        message: "permission denied for table categories"
      };
      const single = jest.fn(async () => ({ data: null, error: providerError }));
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
      const orderById = jest.fn(async () => ({
        data: null,
        error: providerError
      }));
      const orderByName = jest.fn(() => ({ order: orderById }));
      const orderByKind = jest.fn(() => ({ order: orderByName }));
      const eq = jest.fn(() => ({ order: orderByKind }));
      const listSelect = jest.fn(() => ({ eq }));
      const from = jest.fn(() => ({ insert, select: listSelect }));
      const repository = new SupabaseCategoryRepository({
        supabaseClient: { from }
      });

      const promise =
        operation === "create"
          ? repository.create(category)
          : repository.listByUser({ userId: categoryUserId });

      await expect(promise).rejects.toThrow("category repository unavailable");
      await promise.catch((error: unknown) => {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).not.toContain(providerError.code);
        expect((error as Error).message).not.toContain(providerError.details);
        expect((error as Error).message).not.toContain(providerError.hint);
        expect((error as Error).message).not.toContain(providerError.message);
      });
    }
  );
});

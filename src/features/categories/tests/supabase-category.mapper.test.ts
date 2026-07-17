import { describe, expect, it } from "@jest/globals";
import { Category } from "../domain/entities/category.entity";
import {
  mapCategoryRowToDomain,
  mapCategoryToInsert
} from "../infrastructure/supabase/category.mapper";
import {
  persistedCategoryRow,
  validCategoryInput
} from "./fixtures/category.fixtures";

describe("category mapper", () => {
  it("maps a database row to a rehydrated category", () => {
    expect(mapCategoryRowToDomain(persistedCategoryRow)).toEqual(
      expect.objectContaining({
        id: persistedCategoryRow.id,
        userId: persistedCategoryRow.user_id,
        name: persistedCategoryRow.name,
        kind: persistedCategoryRow.kind,
        createdAt: new Date(persistedCategoryRow.created_at),
        updatedAt: new Date(persistedCategoryRow.updated_at)
      })
    );
  });

  it("maps only approved fields to the insert payload", () => {
    const category = Category.create(validCategoryInput);

    expect(mapCategoryToInsert(category)).toEqual({
      user_id: validCategoryInput.userId,
      name: "Alimentação",
      kind: "expense"
    });
  });
});

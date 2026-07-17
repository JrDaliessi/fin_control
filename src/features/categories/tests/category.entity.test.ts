import { describe, expect, it } from "@jest/globals";
import { Category } from "../domain/entities/category.entity";
import {
  persistedCategoryRow,
  validCategoryInput
} from "./fixtures/category.fixtures";

describe("Category", () => {
  it.each(["income", "expense"] as const)(
    "creates a %s category",
    (kind) => {
      const category = Category.create({ ...validCategoryInput, kind });

      expect(category.kind).toBe(kind);
    }
  );

  it("normalizes the user and category name", () => {
    const category = Category.create({
      ...validCategoryInput,
      userId: ` ${validCategoryInput.userId} `,
      name: "  Alimentação   do   mês  "
    });

    expect(category.userId).toBe(validCategoryInput.userId);
    expect(category.name).toBe("Alimentação do mês");
  });

  it.each([
    ["missing user", { userId: " " }, "user"],
    ["missing name", { name: "   " }, "name"],
    ["name longer than 80 characters", { name: "a".repeat(81) }, "name"],
    ["unsupported kind", { kind: "both" as never }, "kind"]
  ])("rejects %s", (_caseName, patch, expectedMessage) => {
    expect(() => Category.create({ ...validCategoryInput, ...patch })).toThrow(
      expectedMessage
    );
  });
});

describe("Category.restore", () => {
  const persistedCategory = {
    id: persistedCategoryRow.id,
    userId: persistedCategoryRow.user_id,
    name: persistedCategoryRow.name,
    kind: persistedCategoryRow.kind,
    createdAt: new Date(persistedCategoryRow.created_at),
    updatedAt: new Date(persistedCategoryRow.updated_at)
  };

  it("rehydrates database metadata while preserving invariants", () => {
    expect(Category.restore(persistedCategory)).toEqual(
      expect.objectContaining(persistedCategory)
    );
  });

  it("rejects invalid persisted data", () => {
    expect(() =>
      Category.restore({ ...persistedCategory, name: " ", kind: "both" as never })
    ).toThrow();
  });
});

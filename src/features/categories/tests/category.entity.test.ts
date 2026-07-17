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

  it.each([
    ["missing id", { id: " " }, "id"],
    ["invalid creation date", { createdAt: new Date("invalid") }, "created"],
    ["invalid update date", { updatedAt: new Date("invalid") }, "updated"]
  ])("rejects %s", (_caseName, patch, expectedMessage) => {
    expect(() => Category.restore({ ...persistedCategory, ...patch })).toThrow(
      expectedMessage
    );
  });

  it("protects persisted dates from external mutation", () => {
    const createdAt = new Date(persistedCategory.createdAt);
    const updatedAt = new Date(persistedCategory.updatedAt);
    const category = Category.restore({ ...persistedCategory, createdAt, updatedAt });
    const expectedCreatedAt = createdAt.toISOString();
    const expectedUpdatedAt = updatedAt.toISOString();

    createdAt.setUTCFullYear(2000);
    updatedAt.setUTCFullYear(2000);
    category.createdAt?.setUTCFullYear(1999);
    category.updatedAt?.setUTCFullYear(1999);

    expect(category.createdAt?.toISOString()).toBe(expectedCreatedAt);
    expect(category.updatedAt?.toISOString()).toBe(expectedUpdatedAt);
  });
});

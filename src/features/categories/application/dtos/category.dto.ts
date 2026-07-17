import type {
  Category,
  CreateCategoryInput
} from "../../domain/entities/category.entity";

export type CreateCategoryRequest = Omit<CreateCategoryInput, "userId">;

export type CategoryDto = {
  id: string;
  name: string;
  kind: Category["kind"];
  createdAt: string;
  updatedAt: string;
};

export function toCategoryDto(category: Category): CategoryDto {
  if (!category.id || !category.createdAt || !category.updatedAt) {
    throw new Error("persisted category metadata is required");
  }

  return {
    id: category.id,
    name: category.name,
    kind: category.kind,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString()
  };
}

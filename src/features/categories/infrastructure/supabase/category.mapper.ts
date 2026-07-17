import {
  Category,
  type CategoryKind
} from "../../domain/entities/category.entity";

export type CategoryRow = {
  id: string;
  user_id: string;
  name: string;
  kind: CategoryKind;
  created_at: string;
  updated_at: string;
};

export type CategoryInsert = Pick<
  CategoryRow,
  "user_id" | "name" | "kind"
>;

export function mapCategoryRowToDomain(row: CategoryRow): Category {
  return Category.restore({
    id: row.id,
    userId: row.user_id,
    name: row.name,
    kind: row.kind,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at)
  });
}

export function mapCategoryToInsert(category: Category): CategoryInsert {
  return {
    user_id: category.userId,
    name: category.name,
    kind: category.kind
  };
}

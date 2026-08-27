import type { Category } from "../entities/category.entity";

export type ListCategoriesByUserInput = {
  userId: string;
};

export interface CategoryRepository {
  create(category: Category): Promise<Category>;
  listByUser(
    input: ListCategoriesByUserInput
  ): Promise<readonly Category[]>;
}

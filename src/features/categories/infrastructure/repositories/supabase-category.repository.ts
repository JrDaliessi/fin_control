import type { Category } from "../../domain/entities/category.entity";
import type {
  CategoryRepository,
  ListCategoriesByUserInput
} from "../../domain/interfaces/category.repository";
import {
  mapCategoryRowToDomain,
  mapCategoryToInsert,
  type CategoryInsert,
  type CategoryRow
} from "../supabase/category.mapper";

type SupabaseResult<T> = {
  data: T | null;
  error: unknown;
};

const categoryColumns = "id,user_id,name,kind,created_at,updated_at";

type CreateQueryBuilder = {
  insert(input: CategoryInsert): {
    select(columns: typeof categoryColumns): {
      single(): Promise<SupabaseResult<CategoryRow>>;
    };
  };
};

type ListQueryBuilder = {
  select(columns: typeof categoryColumns): {
    eq(column: "user_id", value: string): {
      order(column: "kind", options: { ascending: true }): {
        order(column: "name", options: { ascending: true }): {
          order(
            column: "id",
            options: { ascending: true }
          ): Promise<SupabaseResult<readonly CategoryRow[]>>;
        };
      };
    };
  };
};

type SupabaseCategoryClient = {
  from(table: string): unknown;
};

type SupabaseCategoryRepositoryDependencies = {
  supabaseClient: SupabaseCategoryClient;
};

const repositoryErrorMessage = "category repository unavailable";

export class SupabaseCategoryRepository implements CategoryRepository {
  private readonly supabaseClient: SupabaseCategoryClient;

  constructor({ supabaseClient }: SupabaseCategoryRepositoryDependencies) {
    this.supabaseClient = supabaseClient;
  }

  async create(category: Category): Promise<Category> {
    try {
      const table = this.supabaseClient.from("categories") as CreateQueryBuilder;
      const { data, error } = await table
        .insert(mapCategoryToInsert(category))
        .select(categoryColumns)
        .single();

      if (error || !data) {
        throw new Error(repositoryErrorMessage);
      }

      return mapCategoryRowToDomain(data);
    } catch {
      throw new Error(repositoryErrorMessage);
    }
  }

  async listByUser(
    input: ListCategoriesByUserInput
  ): Promise<readonly Category[]> {
    try {
      const table = this.supabaseClient.from("categories") as ListQueryBuilder;
      const { data, error } = await table
        .select(categoryColumns)
        .eq("user_id", input.userId)
        .order("kind", { ascending: true })
        .order("name", { ascending: true })
        .order("id", { ascending: true });

      if (error || !data) {
        throw new Error(repositoryErrorMessage);
      }

      return data.map(mapCategoryRowToDomain);
    } catch {
      throw new Error(repositoryErrorMessage);
    }
  }
}

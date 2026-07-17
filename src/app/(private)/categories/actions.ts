"use server";

import {
  toCategoryDto,
  type CategoryDto,
  type CreateCategoryRequest
} from "@/features/categories/application/dtos/category.dto";
import { CreateCategoryUseCase } from "@/features/categories/application/use-cases/create-category.use-case";
import { ListCategoriesUseCase } from "@/features/categories/application/use-cases/list-categories.use-case";
import { SupabaseCategoryRepository } from "@/features/categories/infrastructure/repositories/supabase-category.repository";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CreateCategoryActionInput = CreateCategoryRequest;

export async function createCategoryAction(
  input: CreateCategoryActionInput
): Promise<CategoryDto> {
  const { categoryRepository, userId } = await createVerifiedCategoryContext();
  const createCategory = new CreateCategoryUseCase({ categoryRepository });
  const category = await createCategory.execute({ ...input, userId });

  const { revalidatePath } = await import("next/cache");
  revalidatePath("/categories");

  return toCategoryDto(category);
}

export async function listCategoriesAction(): Promise<readonly CategoryDto[]> {
  const { categoryRepository, userId } = await createVerifiedCategoryContext();
  const listCategories = new ListCategoriesUseCase({ categoryRepository });
  const categories = await listCategories.execute({ userId });

  return categories.map(toCategoryDto);
}

async function createVerifiedCategoryContext() {
  const supabaseClient = await createSupabaseServerClient();
  const { data, error } = await supabaseClient.auth.getClaims();
  const claims = data?.claims;

  if (
    error ||
    typeof claims?.sub !== "string" ||
    !claims.sub.trim() ||
    claims.is_anonymous === true
  ) {
    throw new Error("authentication required");
  }

  return {
    categoryRepository: new SupabaseCategoryRepository({ supabaseClient }),
    userId: claims.sub.trim()
  };
}

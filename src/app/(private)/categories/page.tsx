import { CategoriesPage } from "@/features/categories/presentation/pages/CategoriesPage";
import { createCategoryAction, listCategoriesAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function CategoriesRoutePage() {
  const categories = await listCategoriesAction();

  return (
    <CategoriesPage
      initialCategories={categories}
      onCreateCategory={createCategoryAction}
    />
  );
}

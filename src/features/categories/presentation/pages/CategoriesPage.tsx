"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCallback, useState } from "react";
import type {
  CategoryDto,
  CreateCategoryRequest
} from "../../application/dtos/category.dto";
import { CategoryForm } from "../components/CategoryForm";
import { CategoryList } from "../components/CategoryList";

type CategoriesPageProps = {
  initialCategories: readonly CategoryDto[];
  onCreateCategory: (input: CreateCategoryRequest) => Promise<CategoryDto>;
};

function compareCategories(left: CategoryDto, right: CategoryDto) {
  return (
    left.kind.localeCompare(right.kind) ||
    left.name.localeCompare(right.name, "pt-BR", { sensitivity: "base" }) ||
    left.id.localeCompare(right.id)
  );
}

export function CategoriesPage({
  initialCategories,
  onCreateCategory
}: CategoriesPageProps) {
  const [categories, setCategories] = useState<CategoryDto[]>(() => [
    ...initialCategories
  ]);
  const createCategory = useCallback(
    async (input: CreateCategoryRequest) => {
      const category = await onCreateCategory(input);

      setCategories((currentCategories) =>
        [...currentCategories, category].sort(compareCategories)
      );
      return category;
    },
    [onCreateCategory]
  );

  return (
    <main className="min-h-screen min-h-dvh bg-background px-4 py-5 text-foreground sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-[minmax(0,430px)_1fr] lg:gap-8">
        <section className="grid content-start gap-4">
          <div>
            <Link
              className="mb-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2"
              href="/transactions"
            >
              <ArrowLeft aria-hidden="true" size={18} />
              Voltar às transações
            </Link>
            <p className="text-xs font-semibold uppercase text-primary sm:text-sm">
              FinControl
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
              Cadastrar categoria
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Separe receitas e despesas para preparar seus lançamentos financeiros.
            </p>
          </div>

          <CategoryForm onCreateCategory={createCategory} />
        </section>

        <div className="grid content-start gap-4">
          <CategoryList categories={categories} />
        </div>
      </div>
    </main>
  );
}

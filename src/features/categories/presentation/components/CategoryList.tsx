import type { CategoryDto } from "../../application/dtos/category.dto";
import type { CategoryKind } from "../../domain/entities/category.entity";

type CategoryListProps = {
  categories: readonly CategoryDto[];
};

const categoryKindLabels: Record<CategoryKind, string> = {
  expense: "Despesa",
  income: "Receita"
};

export function CategoryList({ categories }: CategoryListProps) {
  return (
    <section
      aria-label="Suas categorias"
      aria-live="polite"
      aria-relevant="additions text"
      className="rounded-md border border-border bg-surface p-4 shadow-sm sm:p-5"
    >
      <h2 className="text-lg font-semibold text-foreground">Suas categorias</h2>

      {categories.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground" role="status">
          Nenhuma categoria cadastrada.
        </p>
      ) : (
        <ul className="mt-4 grid gap-3">
          {categories.map((category) => (
            <li
              className="flex min-w-0 items-center justify-between gap-3 rounded-md border border-border p-3"
              key={category.id}
            >
              <p className="min-w-0 break-words font-medium text-foreground">
                {category.name}
              </p>
              <span className="shrink-0 rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                {categoryKindLabels[category.kind]}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

import { describe, expect, it, jest } from "@jest/globals";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type {
  CategoryDto,
  CreateCategoryRequest
} from "../application/dtos/category.dto";
import { CategoriesPage } from "../presentation/pages/CategoriesPage";

const persistedCategory: CategoryDto = {
  id: "07c1dad0-d669-41d3-b0c2-8ca9d7ca6e29",
  name: "Alimentação",
  kind: "expense",
  createdAt: "2026-07-16T12:00:00.000Z",
  updatedAt: "2026-07-16T12:00:00.000Z"
};

type CreateCategoryHandler = (
  input: CreateCategoryRequest
) => Promise<CategoryDto>;

function renderCategoriesPage(
  initialCategories: readonly CategoryDto[] = [],
  onCreateCategory: CreateCategoryHandler = jest.fn<CreateCategoryHandler>(
    async () => persistedCategory
  )
) {
  render(
    <CategoriesPage
      initialCategories={initialCategories}
      onCreateCategory={onCreateCategory}
    />
  );

  return { onCreateCategory };
}

describe("CategoriesPage", () => {
  it("renders an accessible persistent flow and empty state", () => {
    renderCategoriesPage();

    expect(screen.getByRole("main")).toHaveClass("min-h-dvh");
    expect(
      screen.getByRole("heading", { name: "Cadastrar categoria" })
    ).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Suas categorias" })).toHaveAttribute(
      "aria-live",
      "polite"
    );
    expect(screen.getByText("Nenhuma categoria cadastrada.")).toHaveAttribute(
      "role",
      "status"
    );
    expect(screen.getByRole("link", { name: "Voltar às transações" })).toHaveAttribute(
      "href",
      "/transactions"
    );
  });

  it("creates through the injected server flow and lists the result", async () => {
    const user = userEvent.setup();
    const { onCreateCategory } = renderCategoriesPage();

    await user.type(screen.getByLabelText("Nome da categoria"), "Alimentação");
    await user.selectOptions(screen.getByLabelText("Tipo da categoria"), "expense");
    await user.click(screen.getByRole("button", { name: "Cadastrar categoria" }));

    expect(onCreateCategory).toHaveBeenCalledWith({
      name: "Alimentação",
      kind: "expense"
    });
    const region = screen.getByRole("region", { name: "Suas categorias" });
    expect(await within(region).findByText("Alimentação")).toBeInTheDocument();
    expect(within(region).getByText("Despesa")).toBeInTheDocument();
  });

  it("renders categories loaded by the server before client interaction", () => {
    renderCategoriesPage([persistedCategory]);

    const region = screen.getByRole("region", { name: "Suas categorias" });
    expect(within(region).getByText("Alimentação")).toBeInTheDocument();
  });
});

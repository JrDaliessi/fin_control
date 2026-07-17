import { describe, expect, it, jest } from "@jest/globals";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type {
  CategoryDto,
  CreateCategoryRequest
} from "../application/dtos/category.dto";
import { CategoryForm } from "../presentation/components/CategoryForm";

const persistedCategory: CategoryDto = {
  id: "07c1dad0-d669-41d3-b0c2-8ca9d7ca6e29",
  name: "Alimentação",
  kind: "expense",
  createdAt: "2026-07-16T12:00:00.000Z",
  updatedAt: "2026-07-16T12:00:00.000Z"
};

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });

  return { promise, resolve };
}

describe("CategoryForm", () => {
  it("submits normalized data and announces submitting and success states", async () => {
    const deferred = createDeferred<CategoryDto>();
    const onCreateCategory = jest.fn<
      (input: CreateCategoryRequest) => Promise<CategoryDto>
    >(() => deferred.promise);
    const user = userEvent.setup();
    render(<CategoryForm onCreateCategory={onCreateCategory} />);

    await user.type(screen.getByLabelText("Nome da categoria"), "  Alimentação  ");
    await user.selectOptions(screen.getByLabelText("Tipo da categoria"), "expense");
    await user.click(screen.getByRole("button", { name: "Cadastrar categoria" }));

    expect(screen.getByRole("button", { name: "Salvando..." })).toBeDisabled();
    expect(onCreateCategory).toHaveBeenCalledWith({
      name: "Alimentação",
      kind: "expense"
    });

    await act(async () => deferred.resolve(persistedCategory));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Categoria cadastrada."
    );
    expect(screen.getByLabelText("Nome da categoria")).toHaveValue("");
  });

  it("shows an accessible validation error without submitting an empty name", async () => {
    const onCreateCategory = jest.fn<
      (input: CreateCategoryRequest) => Promise<CategoryDto>
    >();
    const user = userEvent.setup();
    render(<CategoryForm onCreateCategory={onCreateCategory} />);

    await user.type(screen.getByLabelText("Nome da categoria"), "   ");
    await user.click(screen.getByRole("button", { name: "Cadastrar categoria" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Informe o nome da categoria."
    );
    expect(screen.getByLabelText("Nome da categoria")).toHaveAttribute(
      "aria-invalid",
      "true"
    );
    expect(onCreateCategory).not.toHaveBeenCalled();
  });

  it("sanitizes errors returned by the persistent flow", async () => {
    const onCreateCategory = jest.fn(async () => {
      throw new Error("duplicate sensitive provider detail");
    });
    const user = userEvent.setup();
    render(<CategoryForm onCreateCategory={onCreateCategory} />);

    await user.type(screen.getByLabelText("Nome da categoria"), "Alimentação");
    await user.click(screen.getByRole("button", { name: "Cadastrar categoria" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível cadastrar a categoria."
    );
    expect(screen.queryByText("duplicate sensitive provider detail")).not.toBeInTheDocument();
  });
});

import { describe, expect, it, jest } from "@jest/globals";
import { ListCategoriesUseCase } from "../application/use-cases/list-categories.use-case";
import type { Category } from "../domain/entities/category.entity";
import type { CategoryRepository } from "../domain/interfaces/category.repository";
import { categoryUserId } from "./fixtures/category.fixtures";

const categories = [
  { name: "Salário", kind: "income" },
  { name: "Alimentação", kind: "expense" }
] as unknown as readonly Category[];

class CategoryRepositoryStub implements CategoryRepository {
  create = jest.fn(async (category: Category) => category);
  listByUser = jest.fn<
    (input: { userId: string }) => Promise<readonly Category[]>
  >(async (input) => {
    void input;
    return categories;
  });
}

describe("ListCategoriesUseCase", () => {
  it("normalizes the verified actor and lists through the repository", async () => {
    const categoryRepository = new CategoryRepositoryStub();
    const useCase = new ListCategoriesUseCase({ categoryRepository });

    await expect(
      useCase.execute({ userId: ` ${categoryUserId} ` })
    ).resolves.toBe(categories);
    expect(categoryRepository.listByUser).toHaveBeenCalledTimes(1);
    expect(categoryRepository.listByUser).toHaveBeenCalledWith({
      userId: categoryUserId
    });
  });

  it("returns an empty list without inventing categories", async () => {
    const categoryRepository = new CategoryRepositoryStub();
    categoryRepository.listByUser.mockResolvedValueOnce([]);
    const useCase = new ListCategoriesUseCase({ categoryRepository });

    await expect(useCase.execute({ userId: categoryUserId })).resolves.toEqual(
      []
    );
  });

  it("rejects a missing actor before consulting the repository", async () => {
    const categoryRepository = new CategoryRepositoryStub();
    const useCase = new ListCategoriesUseCase({ categoryRepository });

    await expect(useCase.execute({ userId: " " })).rejects.toThrow("user");
    expect(categoryRepository.listByUser).not.toHaveBeenCalled();
  });

  it("propagates repository failures", async () => {
    const categoryRepository = new CategoryRepositoryStub();
    categoryRepository.listByUser.mockRejectedValueOnce(
      new Error("category repository unavailable")
    );
    const useCase = new ListCategoriesUseCase({ categoryRepository });

    await expect(useCase.execute({ userId: categoryUserId })).rejects.toThrow(
      "category repository unavailable"
    );
  });
});

import { describe, expect, it, jest } from "@jest/globals";
import { CreateCategoryUseCase } from "../application/use-cases/create-category.use-case";
import type { Category } from "../domain/entities/category.entity";
import type { CategoryRepository } from "../domain/interfaces/category.repository";
import { validCategoryInput } from "./fixtures/category.fixtures";

class CategoryRepositoryStub implements CategoryRepository {
  create = jest.fn(async (category: Category) => category);
  listByUser = jest.fn<
    (input: { userId: string }) => Promise<readonly Category[]>
  >(async (input) => {
    void input;
    return [];
  });
}

describe("CreateCategoryUseCase", () => {
  it("validates and sends a normalized category through the repository", async () => {
    const categoryRepository = new CategoryRepositoryStub();
    const useCase = new CreateCategoryUseCase({ categoryRepository });

    const result = await useCase.execute({
      ...validCategoryInput,
      userId: ` ${validCategoryInput.userId} `,
      name: "  Alimentação   do   mês  "
    });

    expect(categoryRepository.create).toHaveBeenCalledTimes(1);
    expect(categoryRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: validCategoryInput.userId,
        name: "Alimentação do mês",
        kind: "expense"
      })
    );
    expect(result).toBe(categoryRepository.create.mock.calls[0][0]);
  });

  it("does not call the repository when input is invalid", async () => {
    const categoryRepository = new CategoryRepositoryStub();
    const useCase = new CreateCategoryUseCase({ categoryRepository });

    await expect(
      useCase.execute({ ...validCategoryInput, name: " " })
    ).rejects.toThrow("name");

    expect(categoryRepository.create).not.toHaveBeenCalled();
  });

  it("propagates repository failures", async () => {
    const categoryRepository = new CategoryRepositoryStub();
    categoryRepository.create.mockRejectedValueOnce(
      new Error("category repository unavailable")
    );
    const useCase = new CreateCategoryUseCase({ categoryRepository });

    await expect(useCase.execute(validCategoryInput)).rejects.toThrow(
      "category repository unavailable"
    );
  });
});

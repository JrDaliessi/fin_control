import {
  Category,
  type CreateCategoryInput
} from "../../domain/entities/category.entity";
import type { CategoryRepository } from "../../domain/interfaces/category.repository";

type CreateCategoryUseCaseDependencies = {
  categoryRepository: CategoryRepository;
};

export class CreateCategoryUseCase {
  private readonly categoryRepository: CategoryRepository;

  constructor({ categoryRepository }: CreateCategoryUseCaseDependencies) {
    this.categoryRepository = categoryRepository;
  }

  async execute(input: CreateCategoryInput): Promise<Category> {
    const category = Category.create(input);

    return this.categoryRepository.create(category);
  }
}

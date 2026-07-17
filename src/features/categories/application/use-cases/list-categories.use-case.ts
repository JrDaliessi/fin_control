import type { Category } from "../../domain/entities/category.entity";
import type {
  CategoryRepository,
  ListCategoriesByUserInput
} from "../../domain/interfaces/category.repository";

type ListCategoriesUseCaseDependencies = {
  categoryRepository: CategoryRepository;
};

export class ListCategoriesUseCase {
  private readonly categoryRepository: CategoryRepository;

  constructor({ categoryRepository }: ListCategoriesUseCaseDependencies) {
    this.categoryRepository = categoryRepository;
  }

  async execute(
    input: ListCategoriesByUserInput
  ): Promise<readonly Category[]> {
    const userId = input.userId.trim();

    if (!userId) {
      throw new Error("user is required");
    }

    return this.categoryRepository.listByUser({ userId });
  }
}

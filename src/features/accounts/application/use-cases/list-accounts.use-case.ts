import type {
  AccountListingRepository,
  ListAccountsByUserInput
} from "../../domain/interfaces/account.repository";
import type { FinancialAccount } from "../../domain/entities/financial-account.entity";

type ListAccountsUseCaseDependencies = {
  accountRepository: AccountListingRepository;
};

export class ListAccountsUseCase {
  private readonly accountRepository: AccountListingRepository;

  constructor({ accountRepository }: ListAccountsUseCaseDependencies) {
    this.accountRepository = accountRepository;
  }

  async execute(
    input: ListAccountsByUserInput
  ): Promise<readonly FinancialAccount[]> {
    const userId = input.userId.trim();

    if (!userId) {
      throw new Error("user is required");
    }

    return this.accountRepository.listByUser({ userId });
  }
}

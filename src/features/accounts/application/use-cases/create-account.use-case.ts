import {
  FinancialAccount,
  type CreateFinancialAccountInput
} from "../../domain/entities/financial-account.entity";
import type { AccountRepository } from "../../domain/interfaces/account.repository";

type CreateAccountUseCaseDependencies = {
  accountRepository: AccountRepository;
};

export class CreateAccountUseCase {
  private readonly accountRepository: AccountRepository;

  constructor({ accountRepository }: CreateAccountUseCaseDependencies) {
    this.accountRepository = accountRepository;
  }

  async execute(input: CreateFinancialAccountInput): Promise<FinancialAccount> {
    const account = FinancialAccount.create(input);

    return this.accountRepository.create(account);
  }
}

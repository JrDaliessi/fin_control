import { describe, expect, it, jest } from "@jest/globals";
import { CreateAccountUseCase } from "../application/use-cases/create-account.use-case";
import type { FinancialAccount } from "../domain/entities/financial-account.entity";
import type { AccountRepository } from "../domain/interfaces/account.repository";

const validInput = {
  userId: "user-1",
  name: "Conta principal",
  type: "checking" as const,
  initialBalanceInCents: 150000,
  currency: "BRL" as const
};

class AccountRepositoryStub implements AccountRepository {
  create = jest.fn(async (account: FinancialAccount) => account);
}

describe("CreateAccountUseCase", () => {
  it("validates and sends the account through the repository contract", async () => {
    const accountRepository = new AccountRepositoryStub();
    const useCase = new CreateAccountUseCase({ accountRepository });

    const output = await useCase.execute({
      ...validInput,
      userId: " user-1 ",
      name: "  Conta   principal  "
    });

    expect(accountRepository.create).toHaveBeenCalledTimes(1);
    expect(accountRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        name: "Conta principal",
        type: "checking",
        initialBalanceInCents: 150000,
        currency: "BRL"
      })
    );
    expect(output).toBe(accountRepository.create.mock.calls[0][0]);
  });

  it("does not call the repository when input is invalid", async () => {
    const accountRepository = new AccountRepositoryStub();
    const useCase = new CreateAccountUseCase({ accountRepository });

    await expect(useCase.execute({ ...validInput, name: " " })).rejects.toThrow(
      "name"
    );

    expect(accountRepository.create).not.toHaveBeenCalled();
  });

  it("propagates repository errors", async () => {
    const accountRepository = new AccountRepositoryStub();
    accountRepository.create.mockRejectedValueOnce(
      new Error("repository unavailable")
    );
    const useCase = new CreateAccountUseCase({ accountRepository });

    await expect(useCase.execute(validInput)).rejects.toThrow(
      "repository unavailable"
    );
  });
});

import { describe, expect, it, jest } from "@jest/globals";
import { ListAccountsUseCase } from "../application/use-cases/list-accounts.use-case";
import { FinancialAccount } from "../domain/entities/financial-account.entity";
import type { AccountRepository } from "../domain/interfaces/account.repository";

const account = FinancialAccount.create({
  userId: "user-1",
  name: "Conta principal",
  type: "checking",
  initialBalanceInCents: 150000
});

class AccountRepositoryStub implements AccountRepository {
  create = jest.fn(async (input: FinancialAccount) => input);
  listByUser = jest.fn<
    (input: { userId: string }) => Promise<readonly FinancialAccount[]>
  >(async (input) => {
    void input;
    return [account];
  });
}

describe("ListAccountsUseCase", () => {
  it("normalizes the verified actor and lists through the repository contract", async () => {
    const accountRepository = new AccountRepositoryStub();
    const useCase = new ListAccountsUseCase({ accountRepository });

    await expect(useCase.execute({ userId: " user-1 " })).resolves.toEqual([
      account
    ]);
    expect(accountRepository.listByUser).toHaveBeenCalledTimes(1);
    expect(accountRepository.listByUser).toHaveBeenCalledWith({
      userId: "user-1"
    });
  });

  it("returns an empty list without inventing accounts", async () => {
    const accountRepository = new AccountRepositoryStub();
    accountRepository.listByUser.mockResolvedValueOnce([]);
    const useCase = new ListAccountsUseCase({ accountRepository });

    await expect(useCase.execute({ userId: "user-1" })).resolves.toEqual([]);
  });

  it("rejects a missing actor before consulting the repository", async () => {
    const accountRepository = new AccountRepositoryStub();
    const useCase = new ListAccountsUseCase({ accountRepository });

    await expect(useCase.execute({ userId: " " })).rejects.toThrow("user");
    expect(accountRepository.listByUser).not.toHaveBeenCalled();
  });

  it("preserves repository failures for the application boundary", async () => {
    const accountRepository = new AccountRepositoryStub();
    accountRepository.listByUser.mockRejectedValueOnce(
      new Error("account repository unavailable")
    );
    const useCase = new ListAccountsUseCase({ accountRepository });

    await expect(useCase.execute({ userId: "user-1" })).rejects.toThrow(
      "account repository unavailable"
    );
  });
});

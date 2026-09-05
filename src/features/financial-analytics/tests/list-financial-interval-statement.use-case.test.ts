import { describe, expect, it, jest } from "@jest/globals";
import { ListFinancialIntervalStatementUseCase } from "../application/use-cases/list-financial-interval-statement.use-case";
import {
  statementInterval,
  statementItem,
  statementUserId
} from "./fixtures/financial-interval-statement.fixtures";

type RepositoryInput = Readonly<{
  userId: string;
  startOnInclusive: string;
  endOnExclusive: string;
}>;

function createRepositoryStub() {
  return {
    listByInterval: jest.fn(async (input: RepositoryInput) => {
      void input;
      return [statementItem];
    })
  };
}

describe("ListFinancialIntervalStatementUseCase", () => {
  it("loads one verified interval and returns a serializable statement", async () => {
    const statementRepository = createRepositoryStub();
    const useCase = new ListFinancialIntervalStatementUseCase({
      statementRepository
    });

    const result = await useCase.execute({
      userId: statementUserId,
      ...statementInterval
    });

    expect(statementRepository.listByInterval).toHaveBeenCalledTimes(1);
    expect(statementRepository.listByInterval).toHaveBeenCalledWith({
      userId: statementUserId,
      ...statementInterval
    });
    expect(result).toEqual({
      ...statementInterval,
      items: [statementItem]
    });
    expect(JSON.parse(JSON.stringify(result))).toEqual(result);
  });

  it("rejects an invalid interval before calling the repository", async () => {
    const statementRepository = createRepositoryStub();
    const useCase = new ListFinancialIntervalStatementUseCase({
      statementRepository
    });

    await expect(
      useCase.execute({
        userId: statementUserId,
        startOnInclusive: "2026-03-02",
        endOnExclusive: "2026-03-01"
      })
    ).rejects.toThrow("financial interval is invalid");
    expect(statementRepository.listByInterval).not.toHaveBeenCalled();
  });
});

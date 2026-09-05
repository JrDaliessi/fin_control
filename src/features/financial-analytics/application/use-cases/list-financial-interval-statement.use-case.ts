import { validateFinancialInterval } from "../../domain/services/validate-financial-interval";
import type {
  FinancialIntervalStatementItem,
  FinancialIntervalStatementQueryRepository
} from "../ports/financial-interval-statement-query.repository";

type ListFinancialIntervalStatementDependencies = Readonly<{
  statementRepository: FinancialIntervalStatementQueryRepository;
}>;

export type ListFinancialIntervalStatementInput = Readonly<{
  userId: string;
  startOnInclusive: string;
  endOnExclusive: string;
}>;

export type FinancialIntervalStatementDto = Readonly<{
  startOnInclusive: string;
  endOnExclusive: string;
  items: readonly FinancialIntervalStatementItem[];
}>;

export class ListFinancialIntervalStatementUseCase {
  private readonly statementRepository: FinancialIntervalStatementQueryRepository;

  constructor({
    statementRepository
  }: ListFinancialIntervalStatementDependencies) {
    this.statementRepository = statementRepository;
  }

  async execute(
    input: ListFinancialIntervalStatementInput
  ): Promise<FinancialIntervalStatementDto> {
    const interval = validateFinancialInterval(input);
    const items = await this.statementRepository.listByInterval({
      userId: input.userId,
      ...interval
    });

    return { ...interval, items };
  }
}

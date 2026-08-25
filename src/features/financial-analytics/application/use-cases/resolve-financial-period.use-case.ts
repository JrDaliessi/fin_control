import {
  resolveFinancialPeriod,
  type ResolveFinancialPeriodInput
} from "../../domain/services/resolve-financial-period";
import type {
  FinancialPeriod,
  FinancialPeriodKind
} from "../../domain/types/financial-period.types";

export type FinancialPeriodDto = {
  kind: FinancialPeriodKind;
  referenceOn: string;
  startOnInclusive: string;
  endOnExclusive: string;
};

function toFinancialPeriodDto(period: FinancialPeriod): FinancialPeriodDto {
  return {
    kind: period.kind,
    referenceOn: period.referenceOn,
    startOnInclusive: period.startOnInclusive,
    endOnExclusive: period.endOnExclusive
  };
}

export class ResolveFinancialPeriodUseCase {
  execute(input: ResolveFinancialPeriodInput): FinancialPeriodDto {
    return toFinancialPeriodDto(resolveFinancialPeriod(input));
  }
}

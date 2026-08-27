import { describe, expect, it } from "@jest/globals";
import { ResolveFinancialPeriodUseCase } from "../application/use-cases/resolve-financial-period.use-case";
import type { FinancialPeriodKind } from "../domain/types/financial-period.types";

describe("ResolveFinancialPeriodUseCase", () => {
  it("returns a plain serializable DTO with civil boundaries", () => {
    const useCase = new ResolveFinancialPeriodUseCase();

    const output = useCase.execute({
      kind: "rolling_7_days",
      referenceOn: "2026-08-25"
    });

    expect(output).toEqual({
      kind: "rolling_7_days",
      referenceOn: "2026-08-25",
      startOnInclusive: "2026-08-19",
      endOnExclusive: "2026-08-26"
    });
    expect(JSON.parse(JSON.stringify(output))).toEqual(output);
    expect(Object.values(output).every((value) => typeof value === "string")).toBe(
      true
    );
  });

  it("rejects an unsupported kind", () => {
    const useCase = new ResolveFinancialPeriodUseCase();

    expect(() =>
      useCase.execute({
        kind: "custom" as FinancialPeriodKind,
        referenceOn: "2026-08-25"
      })
    ).toThrow("period kind");
  });

  it("rejects an invalid reference date", () => {
    const useCase = new ResolveFinancialPeriodUseCase();

    expect(() =>
      useCase.execute({ kind: "month", referenceOn: "2026-02-29" })
    ).toThrow("referenceOn");
  });
});

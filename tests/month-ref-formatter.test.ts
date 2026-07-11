import { describe, expect, it } from "@jest/globals";
import { formatMonthRef } from "@/shared/utils/formatMonthRef";

describe("formatMonthRef", () => {
  it("should format a validated month reference for pt-BR display", () => {
    expect(formatMonthRef("2026-07")).toBe("07/2026");
  });
});

import { describe, expect, it } from "@jest/globals";
import { resolveReferenceCivilDate } from "../application/services/resolve-reference-civil-date";

describe("resolveReferenceCivilDate", () => {
  it.each([
    ["2026-08-01T02:30:00.000Z", "2026-07-31"],
    ["2026-08-01T03:30:00.000Z", "2026-08-01"]
  ])(
    "resolves %s in America/Sao_Paulo as %s",
    (referenceInstant, expected) => {
      expect(
        resolveReferenceCivilDate({
          referenceInstant,
          timeZone: "America/Sao_Paulo"
        })
      ).toBe(expected);
    }
  );

  it("keeps timezone explicit instead of using the host locale", () => {
    const referenceInstant = "2026-08-01T02:30:00.000Z";

    expect(
      resolveReferenceCivilDate({ referenceInstant, timeZone: "UTC" })
    ).toBe("2026-08-01");
    expect(
      resolveReferenceCivilDate({
        referenceInstant,
        timeZone: "America/Sao_Paulo"
      })
    ).toBe("2026-07-31");
  });

  it.each([
    ["referenceInstant", "not-an-instant", "America/Sao_Paulo"],
    ["timeZone", "2026-08-01T02:30:00.000Z", "Invalid/Zone"]
  ])("rejects an invalid %s", (field, referenceInstant, timeZone) => {
    expect(() =>
      resolveReferenceCivilDate({ referenceInstant, timeZone })
    ).toThrow(field);
  });
});

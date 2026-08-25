import { describe, expect, it } from "@jest/globals";
import { CivilDate } from "../domain/value-objects/civil-date";

describe("CivilDate", () => {
  it.each(["2026-08-25", "2024-02-29", "2000-02-29"])(
    "accepts the real canonical date %s",
    (value) => {
      expect(CivilDate.fromString(value).value).toBe(value);
    }
  );

  it.each([
    ["empty value", ""],
    ["surrounding spaces", " 2026-08-25 "],
    ["missing leading zero", "2026-8-05"],
    ["invalid separator", "2026/08/05"],
    ["timestamp", "2026-08-05T00:00:00Z"],
    ["year zero", "0000-01-01"],
    ["month zero", "2026-00-10"],
    ["month thirteen", "2026-13-01"],
    ["day zero", "2026-01-00"],
    ["non leap day", "2023-02-29"],
    ["non leap century", "2100-02-29"],
    ["day outside month", "2026-04-31"]
  ])("rejects %s", (_caseName, value) => {
    expect(() => CivilDate.fromString(value)).toThrow("civil date");
  });
});

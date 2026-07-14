import { describe, expect, it } from "@jest/globals";
import { resolveTheme } from "../resolveTheme";

describe("resolveTheme", () => {
  it("keeps an explicit light preference when the system is dark", () => {
    expect(resolveTheme("light", true)).toBe("light");
  });

  it("keeps an explicit dark preference when the system is light", () => {
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("resolves the system preference to light", () => {
    expect(resolveTheme("system", false)).toBe("light");
  });

  it("resolves the system preference to dark", () => {
    expect(resolveTheme("system", true)).toBe("dark");
  });
});

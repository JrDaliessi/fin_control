import { describe, expect, it } from "@jest/globals";
import { resolveAuthRoute } from "../application/policies/auth-route-policy";

describe("resolveAuthRoute", () => {
  it("allows an anonymous user to open the public login route", () => {
    expect(
      resolveAuthRoute({ isAuthenticated: false, pathname: "/login" })
    ).toEqual({ action: "allow" });
  });

  it("redirects an authenticated user away from login", () => {
    expect(
      resolveAuthRoute({ isAuthenticated: true, pathname: "/login" })
    ).toEqual({ action: "redirect", destination: "/dashboard" });
  });

  it.each(["/", "/dashboard", "/accounts", "/transactions"])(
    "redirects an anonymous user away from %s",
    (pathname) => {
      expect(resolveAuthRoute({ isAuthenticated: false, pathname })).toEqual({
        action: "redirect",
        destination: "/login"
      });
    }
  );

  it("allows an authenticated user to open a private route", () => {
    expect(
      resolveAuthRoute({ isAuthenticated: true, pathname: "/accounts" })
    ).toEqual({ action: "allow" });
  });
});

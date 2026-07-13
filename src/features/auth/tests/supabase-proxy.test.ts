/** @jest-environment node */

import { describe, expect, it, jest } from "@jest/globals";
import { NextRequest } from "next/server";
import { updateSupabaseSession } from "../../../lib/supabase/proxy";

type CookieToSet = {
  name: string;
  value: string;
  options?: { path?: string };
};

type ClientOptions = {
  cookies: {
    getAll(): Array<{ name: string; value: string }>;
    setAll(
      cookies: CookieToSet[],
      responseHeaders?: Record<string, string>
    ): void;
  };
};

type ClaimsResult = {
  data: { claims: { email?: string; sub?: string } | null } | null;
  error: Error | null;
};

function createServerClientFactory(
  claimsResult: ClaimsResult = {
    data: { claims: { email: "usuario@example.com", sub: "user-1" } },
    error: null
  },
  cookiesToSet: CookieToSet[] = [],
  responseHeaders?: Record<string, string>
) {
  const getClaims = jest.fn(async () => claimsResult);
  const factory = jest.fn(
    (_url: string, _key: string, options: ClientOptions) => ({
      auth: {
        getClaims: async () => {
          options.cookies.setAll(cookiesToSet, responseHeaders);
          return getClaims();
        }
      }
    })
  );

  return { factory, getClaims };
}

const config = {
  supabaseKey: "publishable-test-key",
  supabaseUrl: "https://example.supabase.co"
};

describe("updateSupabaseSession", () => {
  it("allows a verified user and propagates refreshed cookies", async () => {
    const { factory, getClaims } = createServerClientFactory(undefined, [
      { name: "sb-token", value: "refreshed", options: { path: "/" } }
    ], { "Cache-Control": "private, no-store" });
    const request = new NextRequest("https://app.example.com/accounts");

    const response = await updateSupabaseSession(request, {
      ...config,
      createServerClient: factory
    });

    expect(getClaims).toHaveBeenCalledTimes(1);
    expect(response.headers.get("location")).toBeNull();
    expect(response.cookies.get("sb-token")?.value).toBe("refreshed");
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });

  it.each([
    ["missing claims", { data: { claims: null }, error: null }],
    ["expired claims", { data: null, error: new Error("expired jwt") }]
  ])("redirects %s from a private route", async (_caseName, claimsResult) => {
    const { factory } = createServerClientFactory(claimsResult);
    const request = new NextRequest("https://app.example.com/dashboard");

    const response = await updateSupabaseSession(request, {
      ...config,
      createServerClient: factory
    });

    expect(response.headers.get("location")).toBe(
      "https://app.example.com/login"
    );
  });

  it.each([
    ["private route", "/dashboard", "https://app.example.com/login"],
    ["public login", "/login", null]
  ])(
    "fails closed when Supabase initialization fails on a %s",
    async (_caseName, pathname, expectedLocation) => {
      const factory = jest.fn(() => {
        throw new Error(
          "Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL."
        );
      });
      const request = new NextRequest(`https://app.example.com${pathname}`);

      const response = await updateSupabaseSession(request, {
        ...config,
        createServerClient: factory
      });

      expect(factory).toHaveBeenCalledTimes(1);
      expect(response.headers.get("location")).toBe(expectedLocation);
    }
  );

  it("redirects a verified user away from login", async () => {
    const { factory } = createServerClientFactory(undefined, [
      { name: "sb-token", value: "refreshed", options: { path: "/" } }
    ], { "Cache-Control": "private, no-store" });
    const request = new NextRequest("https://app.example.com/login");

    const response = await updateSupabaseSession(request, {
      ...config,
      createServerClient: factory
    });

    expect(response.headers.get("location")).toBe(
      "https://app.example.com/dashboard"
    );
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(response.headers.get("x-middleware-next")).toBeNull();
    expect(response.cookies.get("sb-token")?.value).toBe("refreshed");
  });
});

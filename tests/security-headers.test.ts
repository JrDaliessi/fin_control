/** @jest-environment node */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "@jest/globals";
import { unstable_getResponseFromNextConfig } from "next/experimental/testing/server";
import nextConfig from "../next.config.mjs";

const VALID_SUPABASE_URL = "https://project.supabase.co/";

type MutableEnvironment = Record<string, string | undefined>;

const environment = process.env as MutableEnvironment;
const originalSupabaseUrl = environment.NEXT_PUBLIC_SUPABASE_URL;
const originalVercelEnvironment = environment.VERCEL_ENV;

function restoreEnvironmentValue(key: string, value: string | undefined) {
  if (value === undefined) {
    delete environment[key];
    return;
  }

  environment[key] = value;
}

async function getConfiguredResponse(
  pathname: string,
  vercelEnvironment: "development" | "preview" | "production" = "preview"
) {
  environment.NEXT_PUBLIC_SUPABASE_URL = VALID_SUPABASE_URL;
  environment.VERCEL_ENV = vercelEnvironment;

  return unstable_getResponseFromNextConfig({
    nextConfig,
    url: `https://fincontrol.example${pathname}`
  });
}

async function resolveConfiguredHeaders() {
  if (!nextConfig.headers) {
    throw new Error("next.config.mjs must define headers()");
  }

  return nextConfig.headers();
}

function parseContentSecurityPolicy(value: string | null) {
  if (!value) {
    return new Map<string, string[]>();
  }

  return new Map(
    value
      .split(";")
      .map((directive) => directive.trim())
      .filter(Boolean)
      .map((directive) => {
        const [name, ...sources] = directive.split(/\s+/);
        return [name, sources];
      })
  );
}

afterEach(() => {
  restoreEnvironmentValue("NEXT_PUBLIC_SUPABASE_URL", originalSupabaseUrl);
  restoreEnvironmentValue("VERCEL_ENV", originalVercelEnvironment);
});

describe("Next.js security headers", () => {
  it("does not advertise the framework", () => {
    expect(nextConfig.poweredByHeader).toBe(false);
  });

  it.each(["/login", "/dashboard", "/manifest.webmanifest"])(
    "applies the common baseline to %s",
    async (pathname) => {
      const response = await getConfiguredResponse(pathname);

      expect(response.headers.get("x-frame-options")).toBe("DENY");
      expect(response.headers.get("x-content-type-options")).toBe("nosniff");
      expect(response.headers.get("referrer-policy")).toBe(
        "strict-origin-when-cross-origin"
      );
      expect(response.headers.get("permissions-policy")).toBe(
        "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()"
      );
    }
  );

  it("enforces a restrictive CSP compatible with the current Next.js runtime", async () => {
    const response = await getConfiguredResponse("/login");
    const policy = parseContentSecurityPolicy(
      response.headers.get("content-security-policy")
    );

    expect(policy.get("default-src")).toEqual(["'self'"]);
    expect(policy.get("base-uri")).toEqual(["'self'"]);
    expect(policy.get("form-action")).toEqual(["'self'"]);
    expect(policy.get("frame-ancestors")).toEqual(["'none'"]);
    expect(policy.get("frame-src")).toEqual(["'none'"]);
    expect(policy.get("object-src")).toEqual(["'none'"]);
    expect(policy.get("manifest-src")).toEqual(["'self'"]);
    expect(policy.get("font-src")).toEqual(["'self'"]);
    expect(policy.get("img-src")).toEqual(["'self'", "data:", "blob:"]);
    expect(policy.get("worker-src")).toEqual(["'self'", "blob:"]);
    expect(policy.get("script-src")).toEqual(["'self'", "'unsafe-inline'"]);
    expect(policy.get("script-src")).not.toContain("'unsafe-eval'");
    expect(policy.get("style-src")).toEqual(["'self'", "'unsafe-inline'"]);
  });

  it("allows only self and the exact normalized Supabase origin in connect-src", async () => {
    environment.NEXT_PUBLIC_SUPABASE_URL =
      "  https://project.supabase.co/some/path?ignored=true  ";
    environment.VERCEL_ENV = "preview";

    const response = await unstable_getResponseFromNextConfig({
      nextConfig,
      url: "https://fincontrol.example/login"
    });
    const policy = parseContentSecurityPolicy(
      response.headers.get("content-security-policy")
    );

    expect(policy.get("connect-src")).toEqual([
      "'self'",
      "https://project.supabase.co"
    ]);
    expect(policy.get("connect-src")).not.toContain("https://*.supabase.co");
    expect(policy.get("connect-src")).not.toContain("wss://*.supabase.co");
  });

  it("fails closed when the Supabase URL is missing", async () => {
    delete environment.NEXT_PUBLIC_SUPABASE_URL;

    await expect(resolveConfiguredHeaders()).rejects.toThrow(
      "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL"
    );
  });

  it.each([
    "not-a-url",
    "http://project.supabase.co",
    "ftp://project.supabase.co"
  ])("rejects an unsafe Supabase URL: %s", async (url) => {
    environment.NEXT_PUBLIC_SUPABASE_URL = url;

    await expect(resolveConfiguredHeaders()).rejects.toThrow(
      "NEXT_PUBLIC_SUPABASE_URL must be a valid HTTPS URL"
    );
  });

  it("adds HSTS and upgrade-insecure-requests only to production", async () => {
    const previewResponse = await getConfiguredResponse("/login", "preview");
    const productionResponse = await getConfiguredResponse(
      "/login",
      "production"
    );
    const previewPolicy = parseContentSecurityPolicy(
      previewResponse.headers.get("content-security-policy")
    );
    const productionPolicy = parseContentSecurityPolicy(
      productionResponse.headers.get("content-security-policy")
    );

    expect(previewResponse.headers.get("strict-transport-security")).toBeNull();
    expect(previewPolicy.has("upgrade-insecure-requests")).toBe(false);
    expect(productionResponse.headers.get("strict-transport-security")).toBe(
      "max-age=63072000; includeSubDomains; preload"
    );
    expect(productionPolicy.get("upgrade-insecure-requests")).toEqual([]);
  });

  it("keeps static security policy out of the session Proxy", () => {
    const proxySource = readFileSync(join(process.cwd(), "src/proxy.ts"), "utf8");

    expect(proxySource).not.toMatch(/Content-Security-Policy/i);
    expect(proxySource).not.toMatch(/X-Frame-Options/i);
    expect(proxySource).not.toMatch(/Strict-Transport-Security/i);
  });
});

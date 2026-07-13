/** @jest-environment node */

import { describe, expect, it } from "@jest/globals";
import { resolveSupabasePublicConfig } from "../../../lib/supabase/config";

describe("resolveSupabasePublicConfig", () => {
  it("normalizes the URL and prefers the publishable key", () => {
    expect(
      resolveSupabasePublicConfig({
        anonKey: "legacy-anon-key",
        publishableKey: "  sb_publishable_test  ",
        url: "  https://project.supabase.co/  "
      })
    ).toEqual({
      key: "sb_publishable_test",
      url: "https://project.supabase.co/"
    });
  });

  it("keeps the legacy anon key as a temporary fallback", () => {
    expect(
      resolveSupabasePublicConfig({
        anonKey: "  legacy-anon-key  ",
        url: "http://127.0.0.1:54321"
      })
    ).toEqual({
      key: "legacy-anon-key",
      url: "http://127.0.0.1:54321/"
    });
  });

  it("rejects a malformed URL without exposing its value", () => {
    const malformedUrl = "project-ref-without-protocol";

    expect(() =>
      resolveSupabasePublicConfig({
        publishableKey: "sb_publishable_test",
        url: malformedUrl
      })
    ).toThrow(
      "Invalid environment variable: NEXT_PUBLIC_SUPABASE_URL must be a valid HTTP or HTTPS URL"
    );

    try {
      resolveSupabasePublicConfig({
        publishableKey: "sb_publishable_test",
        url: malformedUrl
      });
    } catch (error) {
      expect(String(error)).not.toContain(malformedUrl);
    }
  });

  it("requires a public key without accepting an empty value", () => {
    expect(() =>
      resolveSupabasePublicConfig({
        anonKey: "  ",
        publishableKey: "",
        url: "https://project.supabase.co"
      })
    ).toThrow(
      "Missing environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  });
});

import { describe, expect, it } from "@jest/globals";
import { readFileSync } from "node:fs";
import { join } from "node:path";

type WebAppManifest = {
  background_color?: string;
  display?: string;
  name?: string;
  orientation?: string;
  scope?: string;
  shortcuts?: Array<{
    name?: string;
    short_name?: string;
    url?: string;
  }>;
  short_name?: string;
  start_url?: string;
  theme_color?: string;
};

function readManifest(): WebAppManifest {
  const manifestPath = join(process.cwd(), "public", "manifest.webmanifest");
  return JSON.parse(readFileSync(manifestPath, "utf-8")) as WebAppManifest;
}

describe("PWA manifest", () => {
  it("defines installable app metadata and the primary manual transaction shortcut", () => {
    const manifest = readManifest();

    expect(manifest.name).toBe("Controle Financeiro IA");
    expect(manifest.short_name).toBe("Financas IA");
    expect(manifest.start_url).toBe("/");
    expect(manifest.scope).toBe("/");
    expect(manifest.display).toBe("standalone");
    expect(manifest.theme_color).toBe("#0f766e");
    expect(manifest.background_color).toBe("#f8fafc");
    expect(manifest.shortcuts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Registrar transação",
          short_name: "Registrar",
          url: "/transactions"
        })
      ])
    );
    expect(manifest.orientation).toBeUndefined();
  });
});

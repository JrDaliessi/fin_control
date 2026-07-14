import { describe, expect, it } from "@jest/globals";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

type WebAppManifest = {
  background_color?: string;
  display?: string;
  display_override?: string[];
  icons?: Array<{
    purpose?: string;
    sizes?: string;
    src?: string;
    type?: string;
  }>;
  id?: string;
  lang?: string;
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

function readPngDimensions(fileName: string) {
  const content = readFileSync(join(process.cwd(), "public", fileName));

  expect(content.subarray(1, 4).toString("ascii")).toBe("PNG");

  return {
    height: content.readUInt32BE(20),
    width: content.readUInt32BE(16)
  };
}

describe("PWA manifest", () => {
  it("defines installable app metadata and shortcuts for primary flows", () => {
    const manifest = readManifest();

    expect(manifest.name).toBe("Controle Financeiro IA");
    expect(manifest.short_name).toBe("Financas IA");
    expect(manifest.start_url).toBe("/");
    expect(manifest.scope).toBe("/");
    expect(manifest.id).toBe("/");
    expect(manifest.lang).toBe("pt-BR");
    expect(manifest.display).toBe("standalone");
    expect(manifest.display_override).toEqual(["standalone", "browser"]);
    expect(manifest.theme_color).toBe("#0f766e");
    expect(manifest.background_color).toBe("#f8fafc");
    expect(manifest.shortcuts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Registrar transação",
          short_name: "Registrar",
          url: "/transactions"
        }),
        expect.objectContaining({
          name: "Cadastrar conta",
          short_name: "Contas",
          url: "/accounts"
        })
      ])
    );
    expect(manifest.orientation).toBeUndefined();
  });

  it("provides raster and maskable icons for installable surfaces", () => {
    const manifest = readManifest();

    expect(manifest.icons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          purpose: "any",
          sizes: "192x192",
          src: "/icon-192.png",
          type: "image/png"
        }),
        expect.objectContaining({
          purpose: "any",
          sizes: "512x512",
          src: "/icon-512.png",
          type: "image/png"
        }),
        expect.objectContaining({
          purpose: "maskable",
          sizes: "512x512",
          src: "/icon-maskable-512.png",
          type: "image/png"
        })
      ])
    );

    for (const fileName of [
      "icon-192.png",
      "icon-512.png",
      "icon-maskable-512.png",
      "apple-touch-icon.png"
    ]) {
      expect(existsSync(join(process.cwd(), "public", fileName))).toBe(true);
    }

    expect(readPngDimensions("icon-192.png")).toEqual({
      height: 192,
      width: 192
    });
    expect(readPngDimensions("icon-512.png")).toEqual({
      height: 512,
      width: 512
    });
    expect(readPngDimensions("icon-maskable-512.png")).toEqual({
      height: 512,
      width: 512
    });
    expect(readPngDimensions("apple-touch-icon.png")).toEqual({
      height: 180,
      width: 180
    });
  });
});

/** @jest-environment node */

import { describe, expect, it } from "@jest/globals";
import { config, proxy } from "../../../proxy";

describe("root proxy", () => {
  it("exposes the Next.js proxy convention and ignores static assets", () => {
    expect(proxy).toBeInstanceOf(Function);
    expect(config.matcher).toContain(
      "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
    );
  });
});

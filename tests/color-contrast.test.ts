import { describe, expect, it } from "@jest/globals";

type Rgb = readonly [number, number, number];

function relativeLuminance([red, green, blue]: Rgb) {
  const [r, g, b] = [red, green, blue].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(first: Rgb, second: Rgb) {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

describe("FinControl color contrast", () => {
  it.each([
    ["texto principal claro", [17, 24, 39], [246, 248, 252]],
    ["texto secundário claro", [95, 111, 133], [246, 248, 252]],
    ["ação primária clara", [255, 255, 255], [15, 118, 110]],
    ["texto principal escuro", [248, 250, 252], [11, 18, 32]],
    ["texto secundário escuro", [148, 163, 184], [11, 18, 32]],
    ["ação primária escura", [4, 47, 46], [45, 212, 191]]
  ] satisfies ReadonlyArray<readonly [string, Rgb, Rgb]>) (
    "keeps %s at WCAG AA for normal text",
    (_label, foreground, background) => {
      expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(4.5);
    }
  );

  it.each([
    ["foco claro", [37, 99, 235], [246, 248, 252]],
    ["foco escuro", [125, 211, 252], [11, 18, 32]]
  ] satisfies ReadonlyArray<readonly [string, Rgb, Rgb]>) (
    "keeps %s above the non-text contrast threshold",
    (_label, indicator, background) => {
      expect(contrastRatio(indicator, background)).toBeGreaterThanOrEqual(3);
    }
  );
});

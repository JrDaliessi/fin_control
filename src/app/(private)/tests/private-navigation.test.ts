import { describe, expect, it } from "@jest/globals";
import {
  getPrivateNavigationItemForPath,
  PRIVATE_NAVIGATION_ITEMS,
} from "../navigation/private-navigation";

describe("private navigation contract", () => {
  it("exposes only the private routes with functional flows", () => {
    const navigationItems = PRIVATE_NAVIGATION_ITEMS as ReadonlyArray<{
      desktopLabel: string;
      href: string;
      mobileLabel: string;
    }>;

    expect(
      navigationItems.map(
        ({ desktopLabel, href, mobileLabel }) => ({
          desktopLabel,
          href,
          mobileLabel,
        }),
      ),
    ).toEqual([
      {
        desktopLabel: "Visão geral",
        href: "/dashboard",
        mobileLabel: "Início",
      },
      {
        desktopLabel: "Transações",
        href: "/transactions",
        mobileLabel: "Transações",
      },
      {
        desktopLabel: "Contas",
        href: "/accounts",
        mobileLabel: "Contas",
      },
    ]);
  });

  it.each(["/", "/dashboard"])(
    "resolves %s as the overview destination",
    (pathname) => {
      expect(getPrivateNavigationItemForPath(pathname)?.href).toBe(
        "/dashboard",
      );
    },
  );

  it.each([
    ["/transactions", "/transactions"],
    ["/accounts", "/accounts"],
  ])("resolves %s by exact canonical path", (pathname, expectedHref) => {
    expect(getPrivateNavigationItemForPath(pathname)?.href).toBe(expectedHref);
  });

  it.each([
    "/cards",
    "/goals",
    "/settings",
    "/transactions/new",
    "/accounts/unknown",
  ])("does not activate an unavailable or unknown path: %s", (pathname) => {
    expect(getPrivateNavigationItemForPath(pathname)).toBeNull();
  });
});

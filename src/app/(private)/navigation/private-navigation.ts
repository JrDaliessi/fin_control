export type PrivateNavigationItem = {
  desktopLabel: string;
  href: "/accounts" | "/dashboard" | "/transactions";
  mobileLabel: string;
  paths: readonly string[];
};

export const PRIVATE_NAVIGATION_ITEMS = [
  {
    desktopLabel: "Visão geral",
    href: "/dashboard",
    mobileLabel: "Início",
    paths: ["/", "/dashboard"],
  },
  {
    desktopLabel: "Transações",
    href: "/transactions",
    mobileLabel: "Transações",
    paths: ["/transactions"],
  },
  {
    desktopLabel: "Contas",
    href: "/accounts",
    mobileLabel: "Contas",
    paths: ["/accounts"],
  },
] as const satisfies readonly PrivateNavigationItem[];

export function getPrivateNavigationItemForPath(
  pathname: string,
): PrivateNavigationItem | null {
  return (
    PRIVATE_NAVIGATION_ITEMS.find((item) =>
      item.paths.some((path) => path === pathname),
    ) ?? null
  );
}

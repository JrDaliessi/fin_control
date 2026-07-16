import clsx from "clsx";
import { ArrowLeftRight, LayoutDashboard, WalletCards } from "lucide-react";
import Link from "next/link";
import type { ComponentType } from "react";
import {
  getPrivateNavigationItemForPath,
  PRIVATE_NAVIGATION_ITEMS,
  type PrivateNavigationItem,
} from "../navigation/private-navigation";

type NavigationIcon = ComponentType<{
  "aria-hidden"?: boolean;
  className?: string;
  size?: number;
}>;

const navigationIcons: Record<PrivateNavigationItem["href"], NavigationIcon> = {
  "/accounts": WalletCards,
  "/dashboard": LayoutDashboard,
  "/transactions": ArrowLeftRight,
};

type PrivateNavigationProps = {
  pathname: string;
};

export function DesktopPrivateNavigation({
  pathname,
}: PrivateNavigationProps) {
  const activeHref = getPrivateNavigationItemForPath(pathname)?.href;

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-20 flex-col border-r border-border bg-navigation text-navigation-foreground md:flex lg:w-64">
      <Link
        className="flex min-h-16 min-w-11 items-center justify-center border-b border-navigation-muted/20 px-3 font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-navigation-accent lg:justify-start lg:px-6"
        href="/dashboard"
      >
        <span aria-hidden="true" className="text-navigation-accent lg:hidden">
          F
        </span>
        <span className="sr-only lg:not-sr-only">FinControl</span>
      </Link>

      <nav aria-label="Navegação principal" className="flex flex-1 flex-col gap-2 p-3">
        {PRIVATE_NAVIGATION_ITEMS.map((item) => {
          const Icon = navigationIcons[item.href];
          const active = activeHref === item.href;

          return (
            <Link
              aria-current={active ? "page" : undefined}
              className={clsx(
                "flex min-h-11 min-w-11 items-center justify-center gap-3 rounded-lg px-3 text-sm font-medium text-navigation-muted transition-colors hover:bg-navigation-foreground/10 hover:text-navigation-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navigation-accent lg:justify-start",
                active &&
                  "bg-navigation-foreground/10 text-navigation-foreground ring-1 ring-inset ring-navigation-accent/40",
              )}
              href={item.href}
              key={item.href}
            >
              <Icon aria-hidden={true} className="shrink-0" size={20} />
              <span className="sr-only lg:not-sr-only">{item.desktopLabel}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function MobilePrivateNavigation({ pathname }: PrivateNavigationProps) {
  const activeHref = getPrivateNavigationItemForPath(pathname)?.href;

  return (
    <nav
      aria-label="Navegação móvel"
      className="fixed inset-x-0 bottom-0 z-40 grid min-h-16 grid-cols-3 border-t border-border bg-surface px-2 pb-[env(safe-area-inset-bottom)] shadow-lg md:hidden"
    >
      {PRIVATE_NAVIGATION_ITEMS.map((item) => {
        const Icon = navigationIcons[item.href];
        const active = activeHref === item.href;

        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={clsx(
              "flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-inset",
              active
                ? "bg-surface-muted font-semibold text-primary"
                : "font-medium",
            )}
            href={item.href}
            key={item.href}
          >
            <Icon aria-hidden={true} size={20} />
            <span>{item.mobileLabel}</span>
          </Link>
        );
      })}
    </nav>
  );
}

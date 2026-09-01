import { getPrivateNavigationItemForPath } from "../navigation/private-navigation";
import { AccountPanel } from "./AccountPanel.client";

type PrivateTopbarProps = {
  email: string;
  onSignOut(): Promise<void>;
  pathname: string;
};

export function PrivateTopbar({
  email,
  onSignOut,
  pathname,
}: PrivateTopbarProps) {
  const currentItem = getPrivateNavigationItemForPath(pathname);

  return (
    <header className="sticky top-0 z-20 min-h-16 border-b border-border bg-surface pt-[env(safe-area-inset-top)]">
      <div className="flex min-h-16 min-w-0 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-tight text-primary md:hidden">
            FinControl
          </p>
          <p className="hidden truncate text-sm font-semibold text-foreground md:block">
            {currentItem?.desktopLabel ?? "Área financeira"}
          </p>
        </div>

        <AccountPanel email={email} onSignOut={onSignOut} />
      </div>
    </header>
  );
}

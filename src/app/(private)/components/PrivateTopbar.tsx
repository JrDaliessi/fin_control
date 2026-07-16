import { SignOutButton } from "@/features/auth/presentation/components/SignOutButton";
import { ThemeSwitcher } from "@/shared/components/ui/ThemeSwitcher";
import { getPrivateNavigationItemForPath } from "../navigation/private-navigation";

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
    <header className="border-b border-border bg-surface px-4 py-3 sm:px-6 lg:px-8">
      <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            FinControl
          </p>
          <p className="truncate text-lg font-semibold text-foreground">
            {currentItem?.desktopLabel ?? "Área financeira"}
          </p>
        </div>

        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center xl:justify-end">
          <p className="min-w-0 truncate text-sm text-muted-foreground">
            Sessão: <span className="font-medium text-foreground">{email}</span>
          </p>
          <ThemeSwitcher />
          <SignOutButton onSignOut={onSignOut} />
        </div>
      </div>
    </header>
  );
}

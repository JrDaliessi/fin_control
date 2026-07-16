"use client";

import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { SignOutUseCase } from "@/features/auth/application/use-cases/sign-out.use-case";
import { SupabaseAuthGateway } from "@/features/auth/infrastructure/supabase/supabase-auth.gateway";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  DesktopPrivateNavigation,
  MobilePrivateNavigation,
} from "./components/PrivateNavigation";
import { PrivateTopbar } from "./components/PrivateTopbar";

type PrivateAppShellProps = {
  children: ReactNode;
  email: string;
};

export function PrivateAppShell({ children, email }: PrivateAppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const authGateway = new SupabaseAuthGateway({
      supabaseClient: createSupabaseBrowserClient()
    });
    const useCase = new SignOutUseCase({ authGateway });

    await useCase.execute();
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="min-h-dvh bg-background text-foreground md:pl-20 lg:pl-64">
      <DesktopPrivateNavigation pathname={pathname} />
      <div className="min-w-0">
        <PrivateTopbar
          email={email}
          onSignOut={handleSignOut}
          pathname={pathname}
        />
        <div
          className="min-w-0 pb-20 md:pb-0"
          data-testid="private-shell-content"
        >
          {children}
        </div>
      </div>
      <MobilePrivateNavigation pathname={pathname} />
    </div>
  );
}

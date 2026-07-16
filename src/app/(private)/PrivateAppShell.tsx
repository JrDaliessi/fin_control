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
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-focus-ring focus:ring-offset-2"
        href="#conteudo-principal"
      >
        Pular para o conteúdo
      </a>
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
          id="conteudo-principal"
          tabIndex={-1}
        >
          {children}
        </div>
      </div>
      <MobilePrivateNavigation pathname={pathname} />
    </div>
  );
}

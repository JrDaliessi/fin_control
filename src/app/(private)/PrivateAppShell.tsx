"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { SignOutUseCase } from "@/features/auth/application/use-cases/sign-out.use-case";
import { SupabaseAuthGateway } from "@/features/auth/infrastructure/supabase/supabase-auth.gateway";
import { SignOutButton } from "@/features/auth/presentation/components/SignOutButton";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type PrivateAppShellProps = {
  children: ReactNode;
  email: string;
};

export function PrivateAppShell({ children, email }: PrivateAppShellProps) {
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
    <>
      <header className="border-b border-slate-200 bg-white px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3">
          <p className="min-w-0 truncate text-sm text-slate-600">
            Sessão: <span className="font-medium text-slate-900">{email}</span>
          </p>
          <SignOutButton onSignOut={handleSignOut} />
        </div>
      </header>
      {children}
    </>
  );
}

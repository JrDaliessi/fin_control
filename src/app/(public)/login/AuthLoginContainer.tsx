"use client";

import { useRouter } from "next/navigation";
import { SignInUseCase } from "@/features/auth/application/use-cases/sign-in.use-case";
import type { SignInWithPasswordInput } from "@/features/auth/domain/interfaces/auth.gateway";
import { SupabaseAuthGateway } from "@/features/auth/infrastructure/supabase/supabase-auth.gateway";
import { LoginPage } from "@/features/auth/presentation/pages/LoginPage";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthLoginContainerProps = {
  initialCredentials?: SignInWithPasswordInput;
};

export function AuthLoginContainer({
  initialCredentials
}: AuthLoginContainerProps) {
  const router = useRouter();

  async function handleSignIn(input: SignInWithPasswordInput) {
    const authGateway = new SupabaseAuthGateway({
      supabaseClient: createSupabaseBrowserClient()
    });
    const useCase = new SignInUseCase({ authGateway });

    await useCase.execute(input);
    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <LoginPage
      initialCredentials={initialCredentials}
      key={initialCredentials ? "demo" : "standard"}
      onSignIn={handleSignIn}
    />
  );
}

import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { GetCurrentUserUseCase } from "@/features/auth/application/use-cases/get-current-user.use-case";
import { SupabaseAuthGateway } from "@/features/auth/infrastructure/supabase/supabase-auth.gateway";
import { AuthSessionProvider } from "@/features/auth/presentation/providers/AuthSessionProvider";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PrivateAppShell } from "./PrivateAppShell";

export const dynamic = "force-dynamic";

type PrivateLayoutProps = {
  children: ReactNode;
};

export default async function PrivateLayout({ children }: PrivateLayoutProps) {
  const authGateway = new SupabaseAuthGateway({
    supabaseClient: await createSupabaseServerClient()
  });
  const user = await new GetCurrentUserUseCase({ authGateway }).execute();

  if (!user) {
    redirect("/login");
  }

  return (
    <AuthSessionProvider user={{ id: user.id, email: user.email }}>
      <PrivateAppShell email={user.email}>{children}</PrivateAppShell>
    </AuthSessionProvider>
  );
}

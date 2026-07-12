import { AuthUser } from "../../domain/entities/auth-user.entity";
import type {
  AuthGateway,
  SignInWithPasswordInput
} from "../../domain/interfaces/auth.gateway";

type SupabaseUser = {
  id: string;
  email?: string | null;
};

type SupabaseClaims = {
  sub?: string;
  email?: string;
};

export type SupabaseAuthClient = {
  auth: {
    signInWithPassword(input: SignInWithPasswordInput): Promise<{
      data: { user: SupabaseUser | null };
      error: unknown | null;
    }>;
    signOut(options: { scope: "local" }): Promise<{
      error: unknown | null;
    }>;
    getClaims(): Promise<{
      data: { claims: SupabaseClaims | null } | null;
      error: unknown | null;
    }>;
  };
};

type SupabaseAuthGatewayDependencies = {
  supabaseClient: SupabaseAuthClient;
};

export class SupabaseAuthGateway implements AuthGateway {
  private readonly supabaseClient: SupabaseAuthClient;

  constructor({ supabaseClient }: SupabaseAuthGatewayDependencies) {
    this.supabaseClient = supabaseClient;
  }

  async signInWithPassword(input: SignInWithPasswordInput): Promise<AuthUser> {
    const { data, error } = await this.supabaseClient.auth.signInWithPassword(
      input
    );

    if (error || !data.user?.email) {
      throw new Error("authentication provider rejected credentials");
    }

    return AuthUser.create({
      id: data.user.id,
      email: data.user.email
    });
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabaseClient.auth.signOut({ scope: "local" });

    if (error) {
      throw new Error("authentication provider sign out failed");
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const { data, error } = await this.supabaseClient.auth.getClaims();
    const claims = data?.claims;

    if (error || !claims?.sub || !claims.email) {
      return null;
    }

    return AuthUser.create({
      id: claims.sub,
      email: claims.email
    });
  }
}

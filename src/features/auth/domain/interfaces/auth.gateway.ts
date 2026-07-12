import type { AuthUser } from "../entities/auth-user.entity";

export type SignInWithPasswordInput = {
  email: string;
  password: string;
};

export interface AuthGateway {
  signInWithPassword(input: SignInWithPasswordInput): Promise<AuthUser>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
}

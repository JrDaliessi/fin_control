import { describe, expect, it, jest } from "@jest/globals";
import { SupabaseAuthGateway } from "../infrastructure/supabase/supabase-auth.gateway";
import { validCredentials } from "./fixtures/auth.fixtures";

type ClaimsResult = {
  data: {
    claims: { email: string; sub: string } | null;
  } | null;
  error: Error | null;
};

type SignInResult = {
  data: {
    user: { email: string; id: string } | null;
  };
  error: Error | null;
};

function createSupabaseClientStub() {
  return {
    auth: {
      getClaims: jest.fn<() => Promise<ClaimsResult>>(async () => ({
        data: {
          claims: {
            email: "usuario@example.com",
            sub: "user-1"
          }
        },
        error: null
      })),
      signInWithPassword: jest.fn<
        (input: typeof validCredentials) => Promise<SignInResult>
      >(async (input) => {
        void input;
        return {
          data: {
            user: {
              email: "usuario@example.com",
              id: "user-1"
            }
          },
          error: null
        };
      }),
      signOut: jest.fn<
        (options: { scope: "local" }) => Promise<{ error: Error | null }>
      >(async (options) => {
        void options;
        return { error: null };
      })
    }
  };
}

describe("SupabaseAuthGateway", () => {
  it("maps a password sign in to the domain user", async () => {
    const supabaseClient = createSupabaseClientStub();
    const gateway = new SupabaseAuthGateway({ supabaseClient });

    const user = await gateway.signInWithPassword(validCredentials);

    expect(supabaseClient.auth.signInWithPassword).toHaveBeenCalledWith(
      validCredentials
    );
    expect(user).toEqual(
      expect.objectContaining({
        email: "usuario@example.com",
        id: "user-1"
      })
    );
  });

  it("reads identity from verified claims", async () => {
    const supabaseClient = createSupabaseClientStub();
    const gateway = new SupabaseAuthGateway({ supabaseClient });

    await expect(gateway.getCurrentUser()).resolves.toEqual(
      expect.objectContaining({
        email: "usuario@example.com",
        id: "user-1"
      })
    );
    expect(supabaseClient.auth.getClaims).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["missing claims", { data: { claims: null }, error: null }],
    ["expired or invalid token", { data: null, error: new Error("invalid jwt") }]
  ])("returns null for %s", async (_caseName, claimsResult) => {
    const supabaseClient = createSupabaseClientStub();
    supabaseClient.auth.getClaims.mockResolvedValueOnce(claimsResult);
    const gateway = new SupabaseAuthGateway({ supabaseClient });

    await expect(gateway.getCurrentUser()).resolves.toBeNull();
  });

  it("signs out only the current session", async () => {
    const supabaseClient = createSupabaseClientStub();
    const gateway = new SupabaseAuthGateway({ supabaseClient });

    await gateway.signOut();

    expect(supabaseClient.auth.signOut).toHaveBeenCalledWith({ scope: "local" });
  });
});

import { describe, expect, it, jest } from "@jest/globals";
import { SignOutUseCase } from "../application/use-cases/sign-out.use-case";
import type { AuthUser } from "../domain/entities/auth-user.entity";
import type {
  AuthGateway,
  SignInWithPasswordInput
} from "../domain/interfaces/auth.gateway";
import { createAuthUser } from "./fixtures/auth.fixtures";

class AuthGatewayStub implements AuthGateway {
  signInWithPassword = jest.fn(
    async (input: SignInWithPasswordInput): Promise<AuthUser> => {
      void input;
      return createAuthUser();
    }
  );
  signOut = jest.fn(async () => undefined);
  getCurrentUser = jest.fn(async (): Promise<AuthUser | null> => null);
}

describe("SignOutUseCase", () => {
  it("ends the current session through the gateway", async () => {
    const authGateway = new AuthGatewayStub();
    const useCase = new SignOutUseCase({ authGateway });

    await useCase.execute();

    expect(authGateway.signOut).toHaveBeenCalledTimes(1);
  });

  it("returns a controlled error when sign out fails", async () => {
    const authGateway = new AuthGatewayStub();
    authGateway.signOut.mockRejectedValueOnce(new Error("provider unavailable"));
    const useCase = new SignOutUseCase({ authGateway });

    await expect(useCase.execute()).rejects.toThrow("sign out failed");
  });
});

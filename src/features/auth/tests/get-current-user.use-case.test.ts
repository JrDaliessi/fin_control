import { describe, expect, it, jest } from "@jest/globals";
import { GetCurrentUserUseCase } from "../application/use-cases/get-current-user.use-case";
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

describe("GetCurrentUserUseCase", () => {
  it("returns the verified current user", async () => {
    const authGateway = new AuthGatewayStub();
    authGateway.getCurrentUser.mockResolvedValueOnce(createAuthUser());
    const useCase = new GetCurrentUserUseCase({ authGateway });

    await expect(useCase.execute()).resolves.toEqual(createAuthUser());
    expect(authGateway.getCurrentUser).toHaveBeenCalledTimes(1);
  });

  it("returns null when there is no verified identity", async () => {
    const authGateway = new AuthGatewayStub();
    const useCase = new GetCurrentUserUseCase({ authGateway });

    await expect(useCase.execute()).resolves.toBeNull();
  });
});

import { describe, expect, it, jest } from "@jest/globals";
import { SignInUseCase } from "../application/use-cases/sign-in.use-case";
import type { AuthUser } from "../domain/entities/auth-user.entity";
import type {
  AuthGateway,
  SignInWithPasswordInput
} from "../domain/interfaces/auth.gateway";
import { createAuthUser, validCredentials } from "./fixtures/auth.fixtures";

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

describe("SignInUseCase", () => {
  it("normalizes the email, preserves the password and returns the user", async () => {
    const authGateway = new AuthGatewayStub();
    const useCase = new SignInUseCase({ authGateway });

    const output = await useCase.execute({
      email: " Usuario@Example.COM ",
      password: "  senha com espaços  "
    });

    expect(authGateway.signInWithPassword).toHaveBeenCalledWith({
      email: "usuario@example.com",
      password: "  senha com espaços  "
    });
    expect(output).toEqual(createAuthUser());
  });

  it.each([
    ["empty email", { email: " " }],
    ["invalid email", { email: "email-invalido" }],
    ["empty password", { password: "" }]
  ])("rejects %s before calling the gateway", async (_caseName, patch) => {
    const authGateway = new AuthGatewayStub();
    const useCase = new SignInUseCase({ authGateway });

    await expect(
      useCase.execute({ ...validCredentials, ...patch })
    ).rejects.toThrow();
    expect(authGateway.signInWithPassword).not.toHaveBeenCalled();
  });

  it("does not expose the provider error when credentials are rejected", async () => {
    const authGateway = new AuthGatewayStub();
    authGateway.signInWithPassword.mockRejectedValueOnce(
      new Error("user does not exist")
    );
    const useCase = new SignInUseCase({ authGateway });

    await expect(useCase.execute(validCredentials)).rejects.toThrow(
      "invalid credentials"
    );
    expect(authGateway.signInWithPassword).toHaveBeenCalledTimes(1);
  });
});

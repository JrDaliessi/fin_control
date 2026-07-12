import type { AuthGateway } from "../../domain/interfaces/auth.gateway";

type SignInUseCaseDependencies = {
  authGateway: AuthGateway;
};

type SignInInput = {
  email: string;
  password: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class SignInUseCase {
  private readonly authGateway: AuthGateway;

  constructor({ authGateway }: SignInUseCaseDependencies) {
    this.authGateway = authGateway;
  }

  async execute(input: SignInInput) {
    const email = input.email.trim().toLowerCase();

    if (!email || !emailPattern.test(email)) {
      throw new Error("email is invalid");
    }

    if (!input.password) {
      throw new Error("password is required");
    }

    try {
      return await this.authGateway.signInWithPassword({
        email,
        password: input.password
      });
    } catch {
      throw new Error("invalid credentials");
    }
  }
}

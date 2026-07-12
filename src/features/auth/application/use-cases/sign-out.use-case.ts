import type { AuthGateway } from "../../domain/interfaces/auth.gateway";

type SignOutUseCaseDependencies = {
  authGateway: AuthGateway;
};

export class SignOutUseCase {
  private readonly authGateway: AuthGateway;

  constructor({ authGateway }: SignOutUseCaseDependencies) {
    this.authGateway = authGateway;
  }

  async execute(): Promise<void> {
    try {
      await this.authGateway.signOut();
    } catch {
      throw new Error("sign out failed");
    }
  }
}

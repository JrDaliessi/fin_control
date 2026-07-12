import type { AuthGateway } from "../../domain/interfaces/auth.gateway";

type GetCurrentUserUseCaseDependencies = {
  authGateway: AuthGateway;
};

export class GetCurrentUserUseCase {
  private readonly authGateway: AuthGateway;

  constructor({ authGateway }: GetCurrentUserUseCaseDependencies) {
    this.authGateway = authGateway;
  }

  execute() {
    return this.authGateway.getCurrentUser();
  }
}

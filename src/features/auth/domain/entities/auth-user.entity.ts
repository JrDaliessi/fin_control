export type CreateAuthUserInput = {
  id: string;
  email: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class AuthUser {
  readonly id: string;
  readonly email: string;

  private constructor(input: CreateAuthUserInput) {
    this.id = input.id;
    this.email = input.email;
  }

  static create(input: CreateAuthUserInput): AuthUser {
    const id = input.id.trim();
    const email = input.email.trim().toLowerCase();

    if (!id) {
      throw new Error("id is required");
    }

    if (!email || !emailPattern.test(email)) {
      throw new Error("email is invalid");
    }

    return new AuthUser({ id, email });
  }
}

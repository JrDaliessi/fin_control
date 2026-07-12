import { AuthUser } from "../../domain/entities/auth-user.entity";

export const validCredentials = {
  email: "usuario@example.com",
  password: "senha-segura"
};

export function createAuthUser() {
  return AuthUser.create({
    id: "user-1",
    email: validCredentials.email
  });
}

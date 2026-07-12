import { describe, expect, it } from "@jest/globals";
import { AuthUser } from "../domain/entities/auth-user.entity";

describe("AuthUser", () => {
  it("creates a normalized authenticated user", () => {
    const user = AuthUser.create({
      id: " user-1 ",
      email: " Usuario@Example.COM "
    });

    expect(user.id).toBe("user-1");
    expect(user.email).toBe("usuario@example.com");
  });

  it.each([
    ["missing id", { id: " " }, "id"],
    ["missing email", { email: " " }, "email"],
    ["invalid email", { email: "email-invalido" }, "email"]
  ])("rejects %s", (_caseName, patch, expectedMessage) => {
    expect(() =>
      AuthUser.create({
        id: "user-1",
        email: "usuario@example.com",
        ...patch
      })
    ).toThrow(expectedMessage);
  });
});

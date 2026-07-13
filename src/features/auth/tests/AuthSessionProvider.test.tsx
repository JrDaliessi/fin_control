import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import {
  AuthSessionProvider,
  useAuthSession
} from "../presentation/providers/AuthSessionProvider";
import { createAuthUser } from "./fixtures/auth.fixtures";

function SessionConsumer() {
  const { user } = useAuthSession();

  return <p>{`${user.id}:${user.email}`}</p>;
}

describe("AuthSessionProvider", () => {
  it("makes the verified identity available to private presentation", () => {
    render(
      <AuthSessionProvider user={createAuthUser()}>
        <SessionConsumer />
      </AuthSessionProvider>
    );

    expect(
      screen.getByText("user-1:usuario@example.com")
    ).toBeInTheDocument();
  });
});

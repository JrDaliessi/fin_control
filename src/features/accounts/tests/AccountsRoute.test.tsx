import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import AccountsRoutePage from "../../../app/(private)/accounts/page";
import { AuthSessionProvider } from "../../auth/presentation/providers/AuthSessionProvider";
import { AccountSessionProvider } from "../presentation/providers/AccountSessionProvider";

describe("accounts route", () => {
  it("renders the local account flow on /accounts", () => {
    render(
      <AuthSessionProvider
        user={{ id: "user-1", email: "usuario@example.com" }}
      >
        <AccountSessionProvider>
          <AccountsRoutePage />
        </AccountSessionProvider>
      </AuthSessionProvider>
    );

    expect(
      screen.getByRole("heading", { name: "Cadastrar conta financeira" })
    ).toBeInTheDocument();
  });
});

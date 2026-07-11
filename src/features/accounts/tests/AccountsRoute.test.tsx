import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import AccountsRoutePage from "../../../app/accounts/page";
import { AccountSessionProvider } from "../presentation/providers/AccountSessionProvider";

describe("accounts route", () => {
  it("renders the local account flow on /accounts", () => {
    render(
      <AccountSessionProvider>
        <AccountsRoutePage />
      </AccountSessionProvider>
    );

    expect(
      screen.getByRole("heading", { name: "Cadastrar conta financeira" })
    ).toBeInTheDocument();
  });
});

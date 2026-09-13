import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import type { SignInWithPasswordInput } from "../domain/interfaces/auth.gateway";

jest.mock("@/app/(public)/login/AuthLoginContainer", () => ({
  AuthLoginContainer: ({
    initialCredentials
  }: {
    initialCredentials?: SignInWithPasswordInput;
  }) => (
    <p data-testid="initial-credentials">
      {initialCredentials
        ? `${initialCredentials.email}:${initialCredentials.password}`
        : "empty"}
    </p>
  )
}));

const { default: LoginRoutePage } = jest.requireActual<
  typeof import("@/app/(public)/login/page")
>("@/app/(public)/login/page");

describe("demo login route", () => {
  afterEach(() => {
    delete process.env.FINCONTROL_DEMO_EMAIL;
    delete process.env.FINCONTROL_DEMO_PASSWORD;
  });

  it("provides configured credentials only for the explicit demo link", async () => {
    process.env.FINCONTROL_DEMO_EMAIL = "testedemo@example.com";
    process.env.FINCONTROL_DEMO_PASSWORD = "senha-demo";

    render(
      await LoginRoutePage({
        searchParams: Promise.resolve({ demo: "1" })
      })
    );

    expect(screen.getByTestId("initial-credentials")).toHaveTextContent(
      "testedemo@example.com:senha-demo"
    );
  });

  it.each([
    { demo: undefined },
    { demo: "0" },
    { demo: ["1", "1"] }
  ])("keeps credentials empty for a non-canonical demo query", async (query) => {
    process.env.FINCONTROL_DEMO_EMAIL = "testedemo@example.com";
    process.env.FINCONTROL_DEMO_PASSWORD = "senha-demo";

    render(
      await LoginRoutePage({
        searchParams: Promise.resolve(query)
      })
    );

    expect(screen.getByTestId("initial-credentials")).toHaveTextContent("empty");
  });

  it("keeps credentials empty when server configuration is incomplete", async () => {
    process.env.FINCONTROL_DEMO_EMAIL = "testedemo@example.com";

    render(
      await LoginRoutePage({
        searchParams: Promise.resolve({ demo: "1" })
      })
    );

    expect(screen.getByTestId("initial-credentials")).toHaveTextContent("empty");
  });
});

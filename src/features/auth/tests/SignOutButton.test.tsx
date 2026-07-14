import { describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignOutButton } from "../presentation/components/SignOutButton";

describe("SignOutButton", () => {
  it("ends the current session and exposes progress", async () => {
    let resolveSignOut!: () => void;
    const onSignOut = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSignOut = resolve;
        })
    );
    const user = userEvent.setup();
    render(<SignOutButton onSignOut={onSignOut} />);

    await user.click(screen.getByRole("button", { name: "Sair" }));

    expect(onSignOut).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Saindo..." }))
      .toBeDisabled();
    expect(screen.getByRole("button", { name: "Saindo..." }))
      .toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("status")).toHaveTextContent("Saindo...");

    resolveSignOut();
    expect(await screen.findByText("Sessão encerrada.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sair" }))
      .toHaveAttribute("aria-busy", "false");
  });

  it("shows a controlled error and allows retry", async () => {
    const onSignOut = jest.fn(async () => {
      throw new Error("provider unavailable");
    });
    const user = userEvent.setup();
    render(<SignOutButton onSignOut={onSignOut} />);

    await user.click(screen.getByRole("button", { name: "Sair" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível encerrar a sessão. Tente novamente."
    );
    expect(screen.queryByText("provider unavailable")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sair" }))
      .toBeEnabled();
    expect(screen.getByRole("button", { name: "Sair" }))
      .toHaveAttribute("aria-busy", "false");
  });
});

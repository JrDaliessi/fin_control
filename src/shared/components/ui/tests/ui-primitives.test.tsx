import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "@jest/globals";
import { Button } from "../Button";
import { Card } from "../Card";
import { FeedbackMessage } from "../FeedbackMessage";

describe("shared UI primitives", () => {
  it("renders a primary button with safe defaults and semantic tokens", () => {
    render(<Button>Continuar</Button>);

    const button = screen.getByRole("button", { name: "Continuar" });

    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveClass(
      "min-h-11",
      "bg-primary",
      "text-primary-foreground",
      "focus-visible:ring-focus-ring",
    );
  });

  it("preserves native disabled behavior", () => {
    render(<Button disabled>Salvando</Button>);

    expect(screen.getByRole("button", { name: "Salvando" })).toBeDisabled();
  });

  it("renders a generic card without financial semantics", () => {
    render(<Card aria-label="Preferências">Conteúdo</Card>);

    expect(screen.getByLabelText("Preferências")).toHaveClass(
      "border-border",
      "bg-surface",
      "text-foreground",
    );
  });

  it("announces regular feedback without interrupting the user", () => {
    render(
      <FeedbackMessage variant="status">Preferência salva.</FeedbackMessage>,
    );

    expect(screen.getByRole("status")).toHaveTextContent("Preferência salva.");
  });

  it("announces errors immediately", () => {
    render(
      <FeedbackMessage variant="error">Não foi possível salvar.</FeedbackMessage>,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Não foi possível salvar.",
    );
  });
});

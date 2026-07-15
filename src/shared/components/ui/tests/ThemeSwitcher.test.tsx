import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { ThemeProvider } from "../../../theme/ThemeProvider";
import { ThemeSwitcher } from "../ThemeSwitcher";

describe("ThemeSwitcher", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: jest.fn(() => ({
        addEventListener: jest.fn(),
        addListener: jest.fn(),
        dispatchEvent: jest.fn(() => true),
        matches: false,
        media: "(prefers-color-scheme: dark)",
        onchange: null,
        removeEventListener: jest.fn(),
        removeListener: jest.fn(),
      })),
    });
  });

  it("offers light, dark and system as an accessible single-choice control", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>,
    );

    expect(screen.getByRole("radiogroup", { name: "Tema" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Claro" })).toHaveClass("h-4", "w-4");
    expect(screen.getByRole("radio", { name: "Escuro" })).toHaveClass("h-4", "w-4");
    expect(screen.getByRole("radio", { name: "Claro" }).closest("label")).toHaveClass(
      "min-h-11",
    );
    expect(screen.getByRole("radio", { name: "Escuro" }).closest("label")).toHaveClass(
      "min-h-11",
    );
    expect(screen.getByRole("radio", { name: "Sistema" })).toBeChecked();

    await user.click(screen.getByRole("radio", { name: "Escuro" }));

    expect(screen.getByRole("radio", { name: "Escuro" })).toBeChecked();
    expect(window.localStorage.getItem("fincontrol.theme")).toBe("dark");
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });
});

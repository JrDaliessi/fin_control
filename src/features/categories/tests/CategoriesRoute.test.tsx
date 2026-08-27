import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("@/app/(private)/categories/actions", () => ({
  createCategoryAction: jest.fn(),
  listCategoriesAction: jest.fn()
}));

const { listCategoriesAction } = jest.requireMock<
  typeof import("@/app/(private)/categories/actions")
>("@/app/(private)/categories/actions");
const { default: CategoriesRoutePage } = jest.requireActual<
  typeof import("@/app/(private)/categories/page")
>("@/app/(private)/categories/page");
const { default: CategoriesLoading } = jest.requireActual<
  typeof import("@/app/(private)/categories/loading")
>("@/app/(private)/categories/loading");
const { default: CategoriesError } = jest.requireActual<
  typeof import("@/app/(private)/categories/error")
>("@/app/(private)/categories/error");

const persistedCategory = {
  id: "07c1dad0-d669-41d3-b0c2-8ca9d7ca6e29",
  name: "Alimentação",
  kind: "expense" as const,
  createdAt: "2026-07-16T12:00:00.000Z",
  updatedAt: "2026-07-16T12:00:00.000Z"
};

describe("categories route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads owned categories and composes the persistent flow", async () => {
    jest.mocked(listCategoriesAction).mockResolvedValue([persistedCategory]);

    render(await CategoriesRoutePage());

    expect(
      screen.getByRole("heading", { name: "Cadastrar categoria" })
    ).toBeInTheDocument();
    expect(screen.getByText("Alimentação")).toBeInTheDocument();
    expect(listCategoriesAction).toHaveBeenCalledTimes(1);
  });

  it("renders an accessible loading state", () => {
    render(<CategoriesLoading />);

    expect(screen.getByRole("main")).toHaveClass("min-h-dvh");
    expect(screen.getByRole("status")).toHaveTextContent(
      "Carregando suas categorias..."
    );
  });

  it("renders a sanitized recoverable error state", async () => {
    const reset = jest.fn();
    const user = userEvent.setup();
    render(
      <CategoriesError
        error={new Error("sensitive provider detail")}
        reset={reset}
      />
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Não foi possível carregar suas categorias."
    );
    expect(screen.queryByText("sensitive provider detail")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(reset).toHaveBeenCalledTimes(1);
  });
});

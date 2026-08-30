import {
  act,
  render,
  screen,
  within
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { ExpandableChartFrame } from "../ExpandableChartFrame.client";

const requestFullscreen = jest.fn<() => Promise<void>>();
const exitFullscreen = jest.fn<() => Promise<void>>();
let fullscreenElement: Element | null;

function renderFrame(title = "Evolução do saldo") {
  return render(
    <ExpandableChartFrame title={title}>
      <div data-testid="chart-content">Conteúdo do gráfico</div>
    </ExpandableChartFrame>
  );
}

function enableNativeFullscreen() {
  Object.defineProperty(document, "fullscreenEnabled", {
    configurable: true,
    value: true
  });
}

describe("ExpandableChartFrame", () => {
  beforeEach(() => {
    fullscreenElement = null;
    document.body.style.overflow = "";
    requestFullscreen.mockReset();
    exitFullscreen.mockReset();

    Object.defineProperty(document, "fullscreenEnabled", {
      configurable: true,
      value: false
    });
    Object.defineProperty(document, "fullscreenElement", {
      configurable: true,
      get: () => fullscreenElement
    });
    Object.defineProperty(document, "exitFullscreen", {
      configurable: true,
      value: exitFullscreen
    });
    Object.defineProperty(HTMLElement.prototype, "requestFullscreen", {
      configurable: true,
      value: requestFullscreen
    });
  });

  afterEach(() => {
    document.body.style.overflow = "";
  });

  it("expands with the CSS fallback while preserving the same chart node", async () => {
    const user = userEvent.setup();
    renderFrame();
    const chartContent = screen.getByTestId("chart-content");
    const expandButton = screen.getByRole("button", {
      name: "Expandir gráfico: Evolução do saldo"
    });

    await user.click(expandButton);

    const dialog = screen.getByRole("dialog", {
      name: "Evolução do saldo"
    });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("data-expanded", "true");
    expect(screen.getByTestId("chart-content")).toBe(chartContent);
    expect(document.body).toHaveStyle({ overflow: "hidden" });
    expect(requestFullscreen).not.toHaveBeenCalled();
    expect(
      within(dialog).getByRole("button", {
        name: "Recolher gráfico: Evolução do saldo"
      })
    ).toHaveFocus();
  });

  it("restores scroll and focus when the CSS fallback is closed", async () => {
    const user = userEvent.setup();
    document.body.style.overflow = "auto";
    renderFrame();
    const expandButton = screen.getByRole("button", {
      name: "Expandir gráfico: Evolução do saldo"
    });

    await user.click(expandButton);
    await user.click(
      screen.getByRole("button", {
        name: "Recolher gráfico: Evolução do saldo"
      })
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.body).toHaveStyle({ overflow: "auto" });
    expect(expandButton).toHaveFocus();
  });

  it("closes the CSS fallback with Escape", async () => {
    const user = userEvent.setup();
    renderFrame();

    await user.click(
      screen.getByRole("button", {
        name: "Expandir gráfico: Evolução do saldo"
      })
    );
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.body).not.toHaveStyle({ overflow: "hidden" });
  });

  it("keeps keyboard focus inside the expanded dialog", async () => {
    const user = userEvent.setup();
    render(
      <>
        <ExpandableChartFrame title="Evolução do saldo">
          <div>Conteúdo do gráfico</div>
        </ExpandableChartFrame>
        <button type="button">Ação externa</button>
      </>
    );

    await user.click(
      screen.getByRole("button", {
        name: "Expandir gráfico: Evolução do saldo"
      })
    );
    const collapseButton = screen.getByRole("button", {
      name: "Recolher gráfico: Evolução do saldo"
    });
    await user.tab();

    expect(collapseButton).toHaveFocus();
    expect(screen.getByRole("button", { name: "Ação externa" })).not.toHaveFocus();
  });

  it("uses native fullscreen when available and exits through the same control", async () => {
    const user = userEvent.setup();
    enableNativeFullscreen();
    renderFrame();
    const frame = screen
      .getByRole("button", { name: "Expandir gráfico: Evolução do saldo" })
      .closest("[data-chart-frame]");
    requestFullscreen.mockImplementation(async () => {
      fullscreenElement = frame;
      document.dispatchEvent(new Event("fullscreenchange"));
    });
    exitFullscreen.mockImplementation(async () => {
      fullscreenElement = null;
      document.dispatchEvent(new Event("fullscreenchange"));
    });

    await user.click(
      screen.getByRole("button", {
        name: "Expandir gráfico: Evolução do saldo"
      })
    );
    expect(requestFullscreen).toHaveBeenCalledTimes(1);

    await user.click(
      screen.getByRole("button", {
        name: "Recolher gráfico: Evolução do saldo"
      })
    );

    expect(exitFullscreen).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("keeps the CSS fallback when the native request is rejected", async () => {
    const user = userEvent.setup();
    enableNativeFullscreen();
    requestFullscreen.mockRejectedValueOnce(new Error("fullscreen denied"));
    renderFrame();

    await user.click(
      screen.getByRole("button", {
        name: "Expandir gráfico: Evolução do saldo"
      })
    );

    expect(requestFullscreen).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("dialog", { name: "Evolução do saldo" })
    ).toBeInTheDocument();
  });

  it("synchronizes when the browser leaves native fullscreen", async () => {
    const user = userEvent.setup();
    enableNativeFullscreen();
    renderFrame();
    const frame = screen
      .getByRole("button", { name: "Expandir gráfico: Evolução do saldo" })
      .closest("[data-chart-frame]");
    requestFullscreen.mockImplementation(async () => {
      fullscreenElement = frame;
      document.dispatchEvent(new Event("fullscreenchange"));
    });

    await user.click(
      screen.getByRole("button", {
        name: "Expandir gráfico: Evolução do saldo"
      })
    );
    fullscreenElement = null;
    act(() => {
      document.dispatchEvent(new Event("fullscreenchange"));
    });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.body).not.toHaveStyle({ overflow: "hidden" });
  });

  it("restores global state when unmounted while expanded", async () => {
    const user = userEvent.setup();
    document.body.style.overflow = "clip";
    const view = renderFrame();

    await user.click(
      screen.getByRole("button", {
        name: "Expandir gráfico: Evolução do saldo"
      })
    );
    view.unmount();

    expect(document.body).toHaveStyle({ overflow: "clip" });
  });

  it("keeps multiple chart frames independent", async () => {
    const user = userEvent.setup();
    render(
      <>
        <ExpandableChartFrame title="Saldo">
          <div>Gráfico de saldo</div>
        </ExpandableChartFrame>
        <ExpandableChartFrame title="Despesas">
          <div>Gráfico de despesas</div>
        </ExpandableChartFrame>
      </>
    );

    await user.click(
      screen.getByRole("button", { name: "Expandir gráfico: Saldo" })
    );

    expect(screen.getByRole("dialog", { name: "Saldo" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Expandir gráfico: Despesas" })
    ).toBeInTheDocument();
  });
});

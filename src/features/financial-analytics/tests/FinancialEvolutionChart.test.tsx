import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest
} from "@jest/globals";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { FinancialEvolutionChartModel } from "../presentation/charts/financial-evolution-chart.model";

jest.mock(
  "../presentation/charts/echarts/build-financial-evolution-option",
  () => ({ buildFinancialEvolutionOption: jest.fn() })
);
jest.mock("../presentation/charts/echarts/echarts-client", () => ({
  initializeFinancialEvolutionChart: jest.fn()
}));

type ChartOptionStub = Readonly<{ animation: boolean }>;
type BuildOptionStub = (input: Readonly<{
  model: FinancialEvolutionChartModel;
  reducedMotion: boolean;
  theme: Readonly<Record<string, string>>;
}>) => ChartOptionStub;
type InitializeChartStub = (
  container: HTMLElement,
  options: Readonly<{ renderer: "svg" }>
) => Readonly<{
  setOption: (option: ChartOptionStub) => void;
  resize: () => void;
  dispose: () => void;
}>;

const { buildFinancialEvolutionOption } = jest.requireMock(
  "../presentation/charts/echarts/build-financial-evolution-option"
) as {
  buildFinancialEvolutionOption: jest.MockedFunction<BuildOptionStub>;
};
const { initializeFinancialEvolutionChart } = jest.requireMock(
  "../presentation/charts/echarts/echarts-client"
) as {
  initializeFinancialEvolutionChart: jest.MockedFunction<InitializeChartStub>;
};
const { FinancialEvolutionChart } = jest.requireActual<
  typeof import("../presentation/components/FinancialEvolutionChart.client")
>("../presentation/components/FinancialEvolutionChart.client");

const model: FinancialEvolutionChartModel = {
  startOnInclusive: "2026-03-01",
  endOnExclusive: "2026-03-03",
  points: [
    { civilDate: "2026-03-01", closingBalanceInCents: 10_000 },
    { civilDate: "2026-03-02", closingBalanceInCents: 12_500 }
  ]
};

const setOption = jest.fn<(option: ChartOptionStub) => void>();
const resize = jest.fn<() => void>();
const dispose = jest.fn<() => void>();
const observe = jest.fn();
const disconnect = jest.fn();
let notifyResize: ResizeObserverCallback;
type MediaQueryChangeListener = (event: MediaQueryListEvent) => void;
const mediaQueryListeners = new Set<MediaQueryChangeListener>();
const addMediaEventListener = jest.fn(
  (type: string, listener: MediaQueryChangeListener) => {
    if (type === "change") {
      mediaQueryListeners.add(listener);
    }
  }
);
const removeMediaEventListener = jest.fn(
  (type: string, listener: MediaQueryChangeListener) => {
    if (type === "change") {
      mediaQueryListeners.delete(listener);
    }
  }
);
let reducedMotionMatches = false;

class ResizeObserverMock {
  constructor(callback: ResizeObserverCallback) {
    notifyResize = callback;
  }

  observe = observe;
  disconnect = disconnect;
  unobserve = jest.fn();
}

function setReducedMotion(matches: boolean) {
  reducedMotionMatches = matches;
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: jest.fn().mockImplementation(() => ({
      get matches() {
        return reducedMotionMatches;
      },
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addEventListener: addMediaEventListener,
      removeEventListener: removeMediaEventListener,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(() => true)
    }) as unknown as MediaQueryList)
  });
}

function notifyReducedMotion(matches: boolean) {
  reducedMotionMatches = matches;
  const event = {
    matches,
    media: "(prefers-reduced-motion: reduce)"
  } as MediaQueryListEvent;

  mediaQueryListeners.forEach((listener) => listener(event));
}

describe("FinancialEvolutionChart", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mediaQueryListeners.clear();
    document.documentElement.removeAttribute("data-theme");
    Object.defineProperty(globalThis, "ResizeObserver", {
      configurable: true,
      value: ResizeObserverMock
    });
    setReducedMotion(false);
    jest.mocked(buildFinancialEvolutionOption).mockReturnValue({
      animation: true
    });
    jest.mocked(initializeFinancialEvolutionChart).mockReturnValue({
      setOption,
      resize,
      dispose
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("exposes a named graphic and initializes ECharts with SVG", () => {
    render(<FinancialEvolutionChart model={model} />);

    const graphic = screen.getByRole("img", {
      name: "Evolução do saldo por dia"
    });
    const description = screen.getByText(
      "Visualização complementar. Os mesmos valores permanecem disponíveis na tabela de evolução financeira."
    );

    const descriptionId = graphic.getAttribute("aria-describedby");
    expect(descriptionId).toBeTruthy();
    expect(description).toHaveAttribute("id", descriptionId);
    expect(graphic).toHaveClass("min-h-72", "w-full");
    expect(initializeFinancialEvolutionChart).toHaveBeenCalledTimes(1);
    const [initializedContainer, initializationOptions] =
      initializeFinancialEvolutionChart.mock.calls[0];
    expect(initializedContainer).toBe(graphic);
    expect(initializationOptions).toEqual({ renderer: "svg" });
    expect(setOption).toHaveBeenCalledWith({ animation: true });
    expect(observe).toHaveBeenCalledWith(graphic);
  });

  it("passes reduced-motion preference to the pure option builder", () => {
    setReducedMotion(true);

    render(<FinancialEvolutionChart model={model} />);

    expect(buildFinancialEvolutionOption).toHaveBeenCalledWith(
      expect.objectContaining({ model, reducedMotion: true })
    );
  });

  it("resizes through ResizeObserver and disposes resources on unmount", () => {
    const view = render(<FinancialEvolutionChart model={model} />);

    act(() => {
      notifyResize([], {} as ResizeObserver);
    });

    expect(resize).toHaveBeenCalledTimes(1);

    view.unmount();

    expect(disconnect).toHaveBeenCalledTimes(1);
    expect(dispose).toHaveBeenCalledTimes(1);
  });

  it("expands without recreating the chart instance", async () => {
    const user = userEvent.setup();
    render(<FinancialEvolutionChart model={model} />);
    const graphic = screen.getByRole("img", {
      name: "Evolução do saldo por dia"
    });

    await user.click(
      screen.getByRole("button", {
        name: "Expandir gráfico: Evolução do saldo"
      })
    );
    act(() => {
      notifyResize([], {} as ResizeObserver);
    });

    expect(
      screen.getByRole("dialog", { name: "Evolução do saldo" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Evolução do saldo por dia" })
    ).toBe(graphic);
    expect(initializeFinancialEvolutionChart).toHaveBeenCalledTimes(1);
    expect(resize).toHaveBeenCalledTimes(1);
  });

  it("disposes the chart and shows the fallback when resize setup fails", () => {
    class FailingResizeObserver {
      constructor() {
        throw new Error("resize observer unavailable");
      }
    }

    Object.defineProperty(globalThis, "ResizeObserver", {
      configurable: true,
      value: FailingResizeObserver
    });

    expect(() => render(<FinancialEvolutionChart model={model} />)).not.toThrow();
    expect(dispose).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Não foi possível carregar o gráfico. Consulte a tabela de evolução financeira."
    );
  });

  it("updates the option without creating a second chart instance", () => {
    const view = render(<FinancialEvolutionChart model={model} />);
    const updatedModel: FinancialEvolutionChartModel = {
      ...model,
      points: [
        ...model.points,
        { civilDate: "2026-03-03", closingBalanceInCents: 9_000 }
      ]
    };

    view.rerender(<FinancialEvolutionChart model={updatedModel} />);

    expect(initializeFinancialEvolutionChart).toHaveBeenCalledTimes(1);
    expect(buildFinancialEvolutionOption).toHaveBeenLastCalledWith(
      expect.objectContaining({ model: updatedModel })
    );
    expect(setOption).toHaveBeenCalledTimes(2);
  });

  it("keeps an accessible table-oriented fallback when initialization fails", () => {
    jest.mocked(initializeFinancialEvolutionChart).mockImplementationOnce(() => {
      throw new Error("chart initialization failed");
    });

    render(<FinancialEvolutionChart model={model} />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Não foi possível carregar o gráfico. Consulte a tabela de evolução financeira."
    );
  });

  it("shows an explicit empty state without initializing ECharts", () => {
    render(
      <FinancialEvolutionChart
        model={{ ...model, points: [] }}
      />
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Não há dados para exibir no gráfico neste período."
    );
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(initializeFinancialEvolutionChart).not.toHaveBeenCalled();
    expect(buildFinancialEvolutionOption).not.toHaveBeenCalled();
  });

  it("reapplies theme tokens without recreating the chart instance", async () => {
    const themeChannels = {
      light: {
        "--foreground": "17 24 39",
        "--muted-foreground": "95 111 133",
        "--primary": "15 118 110",
        "--surface": "255 255 255",
        "--border": "229 231 235"
      },
      dark: {
        "--foreground": "248 250 252",
        "--muted-foreground": "148 163 184",
        "--primary": "45 212 191",
        "--surface": "17 24 39",
        "--border": "51 65 85"
      }
    } as const;

    jest.spyOn(window, "getComputedStyle").mockImplementation(
      () =>
        ({
          getPropertyValue: (name: string) => {
            const theme =
              document.documentElement.dataset.theme === "dark"
                ? themeChannels.dark
                : themeChannels.light;
            return theme[name as keyof typeof theme] ?? "";
          }
        }) as unknown as CSSStyleDeclaration
    );

    const view = render(<FinancialEvolutionChart model={model} />);

    expect(buildFinancialEvolutionOption.mock.calls[0][0].theme).toEqual(
      expect.objectContaining({
        foreground: "rgb(17 24 39)",
        primary: "rgb(15 118 110)",
        surface: "rgb(255 255 255)"
      })
    );

    await act(async () => {
      document.documentElement.dataset.theme = "dark";
      await Promise.resolve();
    });

    expect(initializeFinancialEvolutionChart).toHaveBeenCalledTimes(1);
    expect(buildFinancialEvolutionOption).toHaveBeenCalledTimes(2);
    expect(setOption).toHaveBeenCalledTimes(2);
    expect(buildFinancialEvolutionOption.mock.calls[1][0].theme).toEqual(
      expect.objectContaining({
        foreground: "rgb(248 250 252)",
        primary: "rgb(45 212 191)",
        surface: "rgb(17 24 39)"
      })
    );

    view.unmount();

    await act(async () => {
      document.documentElement.dataset.theme = "light";
      await Promise.resolve();
    });

    expect(buildFinancialEvolutionOption).toHaveBeenCalledTimes(2);
  });

  it("uses system colors while forced colors are active and follows changes", () => {
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    const forcedColorsListeners = new Set<MediaQueryChangeListener>();
    const addForcedColorsListener = jest.fn(
      (type: string, listener: MediaQueryChangeListener) => {
        if (type === "change") {
          forcedColorsListeners.add(listener);
        }
      }
    );
    const removeForcedColorsListener = jest.fn(
      (type: string, listener: MediaQueryChangeListener) => {
        if (type === "change") {
          forcedColorsListeners.delete(listener);
        }
      }
    );
    let forcedColorsActive = true;
    const forcedColorsQuery = {
      get matches() {
        return forcedColorsActive;
      },
      media: "(forced-colors: active)",
      onchange: null,
      addEventListener: addForcedColorsListener,
      removeEventListener: removeForcedColorsListener,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(() => true)
    } as unknown as MediaQueryList;

    jest.mocked(window.matchMedia).mockImplementation((query) =>
      query === "(forced-colors: active)"
        ? forcedColorsQuery
        : reducedMotionQuery
    );

    const view = render(<FinancialEvolutionChart model={model} />);

    expect(buildFinancialEvolutionOption.mock.calls[0][0].theme).toEqual({
      border: "CanvasText",
      foreground: "CanvasText",
      mutedForeground: "CanvasText",
      primary: "Highlight",
      surface: "Canvas"
    });
    expect(addForcedColorsListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );

    act(() => {
      forcedColorsActive = false;
      forcedColorsListeners.forEach((listener) =>
        listener({ matches: false } as MediaQueryListEvent)
      );
    });

    expect(buildFinancialEvolutionOption).toHaveBeenCalledTimes(2);
    expect(buildFinancialEvolutionOption.mock.calls[1][0].theme).toEqual(
      expect.objectContaining({
        foreground: "#111827",
        primary: "#0f766e",
        surface: "#ffffff"
      })
    );

    const listener = addForcedColorsListener.mock.calls[0][1];
    view.unmount();

    expect(removeForcedColorsListener).toHaveBeenCalledWith("change", listener);
  });

  it("reacts to reduced-motion changes and removes the listener", () => {
    const view = render(<FinancialEvolutionChart model={model} />);

    expect(addMediaEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
    expect(buildFinancialEvolutionOption.mock.calls[0][0].reducedMotion).toBe(
      false
    );

    act(() => {
      notifyReducedMotion(true);
    });

    expect(buildFinancialEvolutionOption).toHaveBeenCalledTimes(2);
    expect(buildFinancialEvolutionOption.mock.calls[1][0].reducedMotion).toBe(
      true
    );

    const listener = addMediaEventListener.mock.calls[0][1];
    view.unmount();

    expect(removeMediaEventListener).toHaveBeenCalledWith("change", listener);
  });

  it("generates a unique description relationship for each chart", () => {
    render(
      <>
        <FinancialEvolutionChart model={model} />
        <FinancialEvolutionChart model={model} />
      </>
    );

    const graphics = screen.getAllByRole("img", {
      name: "Evolução do saldo por dia"
    });
    const descriptionIds = graphics.map((graphic) =>
      graphic.getAttribute("aria-describedby")
    );

    expect(descriptionIds.every(Boolean)).toBe(true);
    expect(new Set(descriptionIds)).toHaveProperty("size", 2);
    descriptionIds.forEach((descriptionId) => {
      expect(document.getElementById(descriptionId ?? "")).not.toBeNull();
    });
  });
});

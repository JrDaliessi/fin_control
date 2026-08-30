import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { act, render, screen } from "@testing-library/react";
import { FinancialEvolutionChart } from "../presentation/components/FinancialEvolutionChart.client";
import { buildFinancialEvolutionOption } from "../presentation/charts/echarts/build-financial-evolution-option";
import { initializeFinancialEvolutionChart } from "../presentation/charts/echarts/echarts-client";
import type { FinancialEvolutionChartModel } from "../presentation/charts/financial-evolution-chart.model";

jest.mock(
  "../presentation/charts/echarts/build-financial-evolution-option",
  () => ({ buildFinancialEvolutionOption: jest.fn() })
);
jest.mock("../presentation/charts/echarts/echarts-client", () => ({
  initializeFinancialEvolutionChart: jest.fn()
}));

const model: FinancialEvolutionChartModel = {
  startOnInclusive: "2026-03-01",
  endOnExclusive: "2026-03-03",
  points: [
    { civilDate: "2026-03-01", closingBalanceInCents: 10_000 },
    { civilDate: "2026-03-02", closingBalanceInCents: 12_500 }
  ]
};

const setOption = jest.fn();
const resize = jest.fn();
const dispose = jest.fn();
const observe = jest.fn();
const disconnect = jest.fn();
let notifyResize: ResizeObserverCallback;

class ResizeObserverMock {
  constructor(callback: ResizeObserverCallback) {
    notifyResize = callback;
  }

  observe = observe;
  disconnect = disconnect;
  unobserve = jest.fn();
}

function setReducedMotion(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: jest.fn().mockReturnValue({
      matches,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(() => true)
    } satisfies MediaQueryList)
  });
}

describe("FinancialEvolutionChart", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

  it("exposes a named graphic and initializes ECharts with SVG", () => {
    render(<FinancialEvolutionChart model={model} />);

    const graphic = screen.getByRole("img", {
      name: "Evolução do saldo por dia"
    });
    const description = screen.getByText(
      "Visualização complementar. Os mesmos valores permanecem disponíveis na tabela de evolução financeira."
    );

    expect(description).toHaveAttribute(
      "id",
      "financial-evolution-chart-description"
    );
    expect(graphic).toHaveAttribute(
      "aria-describedby",
      "financial-evolution-chart-description"
    );
    expect(initializeFinancialEvolutionChart).toHaveBeenCalledWith(graphic, {
      renderer: "svg"
    });
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
});

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
import type { ReactNode } from "react";
import type { FinancialCandlestickChartModel } from "../presentation/charts/financial-candlestick-chart.model";

jest.mock(
  "../presentation/charts/echarts/build-financial-candlestick-option",
  () => ({ buildFinancialCandlestickOption: jest.fn() })
);
jest.mock("../presentation/charts/echarts/echarts-client", () => ({
  initializeFinancialEvolutionChart: jest.fn()
}));

type ChartOptionStub = Readonly<{ animation: boolean }>;
type ChartClickHandler = (event: Readonly<{ dataIndex: number }>) => void;
type BuildOptionStub = (input: Readonly<{
  model: FinancialCandlestickChartModel;
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
  on: (eventName: "click", handler: ChartClickHandler) => void;
  off: (eventName: "click", handler: ChartClickHandler) => void;
}>;

const { buildFinancialCandlestickOption } = jest.requireMock(
  "../presentation/charts/echarts/build-financial-candlestick-option"
) as {
  buildFinancialCandlestickOption: jest.MockedFunction<BuildOptionStub>;
};
const { initializeFinancialEvolutionChart } = jest.requireMock(
  "../presentation/charts/echarts/echarts-client"
) as {
  initializeFinancialEvolutionChart: jest.MockedFunction<InitializeChartStub>;
};
const { FinancialCandlestickChart } = jest.requireActual<
  typeof import("../presentation/components/FinancialCandlestickChart.client")
>("../presentation/components/FinancialCandlestickChart.client");

const model: FinancialCandlestickChartModel = {
  startOnInclusive: "2026-03-01",
  endOnExclusive: "2026-03-02",
  points: [
    {
      civilDate: "2026-03-01",
      openInCents: 10_000,
      highInCents: 15_000,
      lowInCents: 9_000,
      closeInCents: 13_000,
      incomeInCents: 5_000,
      expenseInCents: 2_000,
      volumeInCents: 7_000,
      transactionCount: 2
    }
  ]
};

const setOption = jest.fn<(option: ChartOptionStub) => void>();
const resize = jest.fn<() => void>();
const dispose = jest.fn<() => void>();
const chartOn = jest.fn<(eventName: "click", handler: ChartClickHandler) => void>();
const chartOff = jest.fn<(eventName: "click", handler: ChartClickHandler) => void>();
const observe = jest.fn();
const disconnect = jest.fn();
let notifyResize: ResizeObserverCallback;
let notifyChartClick: ChartClickHandler | undefined;

class ResizeObserverMock {
  constructor(callback: ResizeObserverCallback) {
    notifyResize = callback;
  }

  observe = observe;
  disconnect = disconnect;
  unobserve = jest.fn();
}

describe("FinancialCandlestickChart", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(globalThis, "ResizeObserver", {
      configurable: true,
      value: ResizeObserverMock
    });
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: (query: string) =>
        ({
          matches: false,
          media: query,
          onchange: null,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          addListener: jest.fn(),
          removeListener: jest.fn(),
          dispatchEvent: jest.fn(() => true)
        }) as unknown as MediaQueryList
    });
    jest.mocked(buildFinancialCandlestickOption).mockReturnValue({
      animation: true
    });
    jest.mocked(initializeFinancialEvolutionChart).mockReturnValue({
      setOption,
      resize,
      dispose,
      on: chartOn,
      off: chartOff
    });
    chartOn.mockImplementation((_eventName, handler) => {
      notifyChartClick = handler;
    });
    notifyChartClick = undefined;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("exposes a named graphic and initializes one SVG renderer", () => {
    render(<FinancialCandlestickChart model={model} />);
    const graphic = screen.getByRole("img", {
      name: "Variação do saldo por dia"
    });

    expect(graphic).toHaveAccessibleDescription(
      "Visualização complementar. Os mesmos valores permanecem disponíveis na tabela de variação financeira."
    );
    const [initializedContainer, initializationOptions] =
      initializeFinancialEvolutionChart.mock.calls[0];
    expect(initializedContainer).toBe(graphic);
    expect(initializationOptions).toEqual({ renderer: "svg" });
    expect(setOption).toHaveBeenCalledWith({ animation: true });
    expect(observe).toHaveBeenCalledWith(graphic);
  });

  it("resizes and disposes resources when the renderer leaves the tree", () => {
    const view = render(<FinancialCandlestickChart model={model} />);

    act(() => notifyResize([], {} as ResizeObserver));
    expect(resize).toHaveBeenCalledTimes(1);

    view.unmount();
    expect(disconnect).toHaveBeenCalledTimes(1);
    expect(dispose).toHaveBeenCalledTimes(1);
  });

  it("updates the option without creating a second chart instance", () => {
    const view = render(<FinancialCandlestickChart model={model} />);
    const updatedModel = {
      ...model,
      points: [
        ...model.points,
        { ...model.points[0], civilDate: "2026-03-02" }
      ]
    };

    view.rerender(<FinancialCandlestickChart model={updatedModel} />);

    expect(initializeFinancialEvolutionChart).toHaveBeenCalledTimes(1);
    expect(buildFinancialCandlestickOption).toHaveBeenLastCalledWith(
      expect.objectContaining({ model: updatedModel })
    );
    expect(setOption).toHaveBeenCalledTimes(2);
  });

  it("preserves the renderer while the chart expands", async () => {
    const user = userEvent.setup();
    render(<FinancialCandlestickChart model={model} />);
    const graphic = screen.getByRole("img", {
      name: "Variação do saldo por dia"
    });

    await user.click(
      screen.getByRole("button", {
        name: "Expandir gráfico: Variação do saldo"
      })
    );

    expect(
      screen.getByRole("dialog", { name: "Variação do saldo" })
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Variação do saldo por dia" })).toBe(
      graphic
    );
    expect(initializeFinancialEvolutionChart).toHaveBeenCalledTimes(1);
  });

  it("keeps the table-oriented fallback when initialization fails", () => {
    jest.mocked(initializeFinancialEvolutionChart).mockImplementationOnce(() => {
      throw new Error("chart initialization failed");
    });

    render(<FinancialCandlestickChart model={model} />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Não foi possível carregar o gráfico. Consulte a tabela de variação financeira."
    );
  });

  it("shows an explicit empty state without initializing ECharts", () => {
    render(<FinancialCandlestickChart model={{ ...model, points: [] }} />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Não há dados para exibir no gráfico neste período."
    );
    expect(initializeFinancialEvolutionChart).not.toHaveBeenCalled();
    expect(buildFinancialCandlestickOption).not.toHaveBeenCalled();
  });

  it("maps a valid dataIndex to the exact interval and removes the listener", () => {
    const onSelectInterval = jest.fn<
      (interval: Readonly<{
        startOnInclusive: string;
        endOnExclusive: string;
      }>) => void
    >();
    const selectableModel = {
      ...model,
      points: [
        {
          ...model.points[0],
          endOnExclusive: "2026-03-02"
        }
      ]
    };
    const SelectableFinancialCandlestickChart =
      FinancialCandlestickChart as unknown as (
        props: Readonly<{
          model: typeof selectableModel;
          onSelectInterval: typeof onSelectInterval;
        }>
      ) => ReactNode;
    const view = render(
      <SelectableFinancialCandlestickChart
        model={selectableModel}
        onSelectInterval={onSelectInterval}
      />
    );

    expect(chartOn).toHaveBeenCalledWith("click", expect.any(Function));
    act(() => notifyChartClick?.({ dataIndex: 0 }));
    expect(onSelectInterval).toHaveBeenCalledWith({
      startOnInclusive: "2026-03-01",
      endOnExclusive: "2026-03-02"
    });

    view.unmount();
    expect(chartOff).toHaveBeenCalledWith("click", expect.any(Function));
  });

  it("describes the table action as the keyboard equivalent for selection", () => {
    const selectableModel = {
      ...model,
      points: [
        {
          ...model.points[0],
          endOnExclusive: "2026-03-02"
        }
      ]
    };

    render(
      <FinancialCandlestickChart
        model={selectableModel}
        onSelectInterval={jest.fn()}
      />
    );

    expect(
      screen.getByRole("img", { name: "Variação do saldo por dia" })
    ).toHaveAccessibleDescription(
      "Selecione um candle para abrir o extrato. Pelo teclado, use Ver extrato na tabela de variação financeira."
    );
  });
});

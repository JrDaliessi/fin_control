import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { ThemeProvider } from "../ThemeProvider";
import { useTheme } from "../useTheme";

const THEME_STORAGE_KEY = "fincontrol.theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

type MediaController = {
  listenerCount: () => number;
  setMatches: (matches: boolean) => void;
};

function installMatchMedia(initialMatches: boolean): MediaController {
  let matches = initialMatches;
  const listeners = new Set<(event: MediaQueryListEvent) => void>();

  const mediaQueryList = {
    addEventListener: (
      type: string,
      listener: EventListenerOrEventListenerObject,
    ) => {
      if (type === "change") {
        listeners.add(listener as (event: MediaQueryListEvent) => void);
      }
    },
    addListener: (listener: (event: MediaQueryListEvent) => void) => {
      listeners.add(listener);
    },
    dispatchEvent: () => true,
    get matches() {
      return matches;
    },
    media: DARK_QUERY,
    onchange: null,
    removeEventListener: (
      type: string,
      listener: EventListenerOrEventListenerObject,
    ) => {
      if (type === "change") {
        listeners.delete(listener as (event: MediaQueryListEvent) => void);
      }
    },
    removeListener: (listener: (event: MediaQueryListEvent) => void) => {
      listeners.delete(listener);
    },
  } satisfies MediaQueryList;

  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: jest.fn(() => mediaQueryList),
  });

  return {
    listenerCount: () => listeners.size,
    setMatches(nextMatches) {
      matches = nextMatches;
      const event = { matches, media: DARK_QUERY } as MediaQueryListEvent;
      listeners.forEach((listener) => listener(event));
    },
  };
}

function ThemeProbe() {
  const { preference, resolvedTheme, setPreference } = useTheme();

  return (
    <section>
      <output aria-label="Preferência">{preference}</output>
      <output aria-label="Tema resolvido">{resolvedTheme}</output>
      <button onClick={() => setPreference("light")} type="button">
        Usar claro
      </button>
      <button onClick={() => setPreference("system")} type="button">
        Usar sistema
      </button>
    </section>
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("restores a valid persisted preference and applies the dark selector", () => {
    installMatchMedia(false);
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");

    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );

    expect(screen.getByLabelText("Preferência")).toHaveTextContent("dark");
    expect(screen.getByLabelText("Tema resolvido")).toHaveTextContent("dark");
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });

  it("treats malformed storage as system and reacts to system changes", () => {
    const media = installMatchMedia(false);
    window.localStorage.setItem(THEME_STORAGE_KEY, "sepia");

    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );

    expect(screen.getByLabelText("Preferência")).toHaveTextContent("system");
    expect(screen.getByLabelText("Tema resolvido")).toHaveTextContent("light");
    expect(document.documentElement).not.toHaveAttribute("data-theme");

    act(() => media.setMatches(true));

    expect(screen.getByLabelText("Tema resolvido")).toHaveTextContent("dark");
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });

  it("persists an explicit preference and ignores later system changes", async () => {
    const user = userEvent.setup();
    const media = installMatchMedia(true);

    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Usar claro" }));

    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(screen.getByLabelText("Tema resolvido")).toHaveTextContent("light");
    expect(document.documentElement).not.toHaveAttribute("data-theme");

    act(() => media.setMatches(false));

    expect(screen.getByLabelText("Tema resolvido")).toHaveTextContent("light");
  });

  it("falls back to system when storage cannot be read", () => {
    installMatchMedia(true);
    const storageSpy = jest
      .spyOn(Storage.prototype, "getItem")
      .mockImplementationOnce(() => {
        throw new Error("storage unavailable");
      });

    expect(() =>
      render(
        <ThemeProvider>
          <ThemeProbe />
        </ThemeProvider>,
      ),
    ).not.toThrow();

    expect(screen.getByLabelText("Preferência")).toHaveTextContent("system");
    expect(screen.getByLabelText("Tema resolvido")).toHaveTextContent("dark");
    storageSpy.mockRestore();
  });

  it("removes the system preference listener when unmounted", () => {
    const media = installMatchMedia(false);
    const { unmount } = render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );

    expect(media.listenerCount()).toBe(1);

    unmount();

    expect(media.listenerCount()).toBe(0);
  });
});

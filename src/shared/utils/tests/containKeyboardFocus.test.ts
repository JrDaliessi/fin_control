import { afterEach, describe, expect, it } from "@jest/globals";
import { containKeyboardFocus } from "../containKeyboardFocus";

function createContainer() {
  const container = document.createElement("div");
  const firstButton = document.createElement("button");
  const middleButton = document.createElement("button");
  const lastButton = document.createElement("button");

  firstButton.textContent = "Primeiro";
  middleButton.textContent = "Intermediário";
  lastButton.textContent = "Último";
  container.append(firstButton, middleButton, lastButton);
  document.body.append(container);

  return { container, firstButton, lastButton, middleButton };
}

function createTabEvent(shiftKey = false) {
  return new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    key: "Tab",
    shiftKey,
  });
}

describe("containKeyboardFocus", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("wraps forward focus from the last control to the first", () => {
    const { container, firstButton, lastButton } = createContainer();
    const event = createTabEvent();
    lastButton.focus();

    containKeyboardFocus(event, container);

    expect(event.defaultPrevented).toBe(true);
    expect(firstButton).toHaveFocus();
  });

  it("wraps backward focus from the first control to the last", () => {
    const { container, firstButton, lastButton } = createContainer();
    const event = createTabEvent(true);
    firstButton.focus();

    containKeyboardFocus(event, container);

    expect(event.defaultPrevented).toBe(true);
    expect(lastButton).toHaveFocus();
  });

  it("preserves the browser tab order away from the focus boundaries", () => {
    const { container, middleButton } = createContainer();
    const event = createTabEvent();
    middleButton.focus();

    containKeyboardFocus(event, container);

    expect(event.defaultPrevented).toBe(false);
    expect(middleButton).toHaveFocus();
  });

  it("prevents focus from escaping a container without controls", () => {
    const container = document.createElement("div");
    const event = createTabEvent();
    document.body.append(container);

    containKeyboardFocus(event, container);

    expect(event.defaultPrevented).toBe(true);
  });

  it("ignores keys other than Tab and missing containers", () => {
    const escapeEvent = new KeyboardEvent("keydown", {
      cancelable: true,
      key: "Escape",
    });
    const tabEvent = createTabEvent();

    containKeyboardFocus(escapeEvent, document.createElement("div"));
    containKeyboardFocus(tabEvent, null);

    expect(escapeEvent.defaultPrevented).toBe(false);
    expect(tabEvent.defaultPrevented).toBe(false);
  });
});

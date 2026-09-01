const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function containKeyboardFocus(
  event: KeyboardEvent,
  container: HTMLElement | null,
) {
  if (event.key !== "Tab" || !container) {
    return;
  }

  const focusableElements =
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);

  if (!focusableElements.length) {
    event.preventDefault();
    return;
  }

  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];
  const movingBeforeFirst =
    event.shiftKey && document.activeElement === firstFocusableElement;
  const movingAfterLast =
    !event.shiftKey && document.activeElement === lastFocusableElement;

  if (!movingBeforeFirst && !movingAfterLast) {
    return;
  }

  event.preventDefault();
  (event.shiftKey ? lastFocusableElement : firstFocusableElement).focus();
}

import type { KeyboardEvent } from "react";

const MINIMUM_SCROLL_STEP_IN_PIXELS = 160;

export function handleHorizontalTableKeyDown(
  event: KeyboardEvent<HTMLDivElement>
) {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
    return;
  }

  event.preventDefault();

  const direction = event.key === "ArrowRight" ? 1 : -1;
  const scrollStep = Math.max(
    MINIMUM_SCROLL_STEP_IN_PIXELS,
    Math.floor(event.currentTarget.clientWidth * 0.8)
  );

  event.currentTarget.scrollLeft = Math.max(
    0,
    event.currentTarget.scrollLeft + direction * scrollStep
  );
}

"use client";

import clsx from "clsx";
import { Maximize2, Minimize2 } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode
} from "react";
import { containKeyboardFocus } from "@/shared/utils/containKeyboardFocus";
import { Button } from "../ui/Button";

type ExpandableChartFrameProps = Readonly<{
  children: ReactNode;
  title: string;
}>;

export function ExpandableChartFrame({
  children,
  title
}: ExpandableChartFrameProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const previousBodyOverflowRef = useRef<string | null>(null);
  const nativeFullscreenActiveRef = useRef(false);
  const fullscreenRequestIdRef = useRef(0);
  const titleId = useId();

  const restoreBodyScroll = useCallback(() => {
    const previousBodyOverflow = previousBodyOverflowRef.current;

    if (previousBodyOverflow === null) {
      return;
    }

    document.body.style.overflow = previousBodyOverflow;
    previousBodyOverflowRef.current = null;
  }, []);

  const collapse = useCallback(() => {
    fullscreenRequestIdRef.current += 1;
    nativeFullscreenActiveRef.current = false;
    setIsExpanded(false);
    openerRef.current?.focus();
  }, []);

  const expand = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const frame = frameRef.current;

    if (!frame) {
      return;
    }

    openerRef.current = event.currentTarget;
    previousBodyOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setIsExpanded(true);
    const fullscreenRequestId = fullscreenRequestIdRef.current + 1;
    fullscreenRequestIdRef.current = fullscreenRequestId;

    if (!document.fullscreenEnabled || typeof frame.requestFullscreen !== "function") {
      return;
    }

    void frame
      .requestFullscreen()
      .then(() => {
        const requestIsCurrent =
          fullscreenRequestIdRef.current === fullscreenRequestId &&
          frameRef.current === frame;

        if (!requestIsCurrent) {
          if (
            document.fullscreenElement === frame &&
            typeof document.exitFullscreen === "function"
          ) {
            void document.exitFullscreen().catch(() => undefined);
          }

          return;
        }

        nativeFullscreenActiveRef.current =
          document.fullscreenElement === frame;
      })
      .catch(() => {
        nativeFullscreenActiveRef.current = false;
      });
  }, []);

  const requestCollapse = useCallback(() => {
    const frame = frameRef.current;

    if (
      frame &&
      document.fullscreenElement === frame &&
      typeof document.exitFullscreen === "function"
    ) {
      void document.exitFullscreen().then(collapse, collapse);
      return;
    }

    collapse();
  }, [collapse]);

  useEffect(() => {
    if (!isExpanded) {
      return;
    }

    const handleFullscreenChange = () => {
      if (
        nativeFullscreenActiveRef.current &&
        document.fullscreenElement !== frameRef.current
      ) {
        collapse();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && document.fullscreenElement !== frameRef.current) {
        collapse();
        return;
      }

      containKeyboardFocus(event, frameRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("keydown", handleKeyDown);
      restoreBodyScroll();
    };
  }, [collapse, isExpanded, restoreBodyScroll]);

  return (
    <div
      aria-labelledby={isExpanded ? titleId : undefined}
      aria-modal={isExpanded ? true : undefined}
      className={clsx(
        "group/chart-frame relative grid gap-2",
        isExpanded &&
          "chart-frame-expanded fixed inset-0 z-[100] grid-rows-[auto_minmax(0,1fr)] overflow-hidden bg-background text-foreground"
      )}
      data-chart-frame=""
      data-expanded={isExpanded ? "true" : "false"}
      ref={frameRef}
      role={isExpanded ? "dialog" : undefined}
    >
      <div
        className={clsx(
          "flex items-center gap-3",
          isExpanded ? "justify-between" : "justify-end"
        )}
      >
        {isExpanded ? (
          <h2 className="text-lg font-semibold text-foreground" id={titleId}>
            {title}
          </h2>
        ) : null}
        <Button
          aria-expanded={isExpanded}
          aria-label={`${isExpanded ? "Recolher" : "Expandir"} gráfico: ${title}`}
          className="min-w-11 px-3"
          onClick={isExpanded ? requestCollapse : expand}
          title={`${isExpanded ? "Recolher" : "Expandir"} gráfico`}
          variant="ghost"
        >
          {isExpanded ? (
            <Minimize2 aria-hidden="true" size={20} />
          ) : (
            <Maximize2 aria-hidden="true" size={20} />
          )}
        </Button>
      </div>
      <div className={clsx("min-w-0", isExpanded && "h-full min-h-0")}>
        {children}
      </div>
    </div>
  );
}

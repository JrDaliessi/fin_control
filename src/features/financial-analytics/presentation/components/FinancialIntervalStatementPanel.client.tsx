"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { FinancialIntervalStatementDto } from "../../application/use-cases/list-financial-interval-statement.use-case";
import type { FinancialCandle } from "../../domain/types/financial-evolution.types";
import { formatCents } from "@/shared/utils/formatCents";
import { containKeyboardFocus } from "@/shared/utils/containKeyboardFocus";

export type FinancialIntervalStatementLoader = (
  input: Readonly<{
    startOnInclusive: string;
    endOnExclusive: string;
  }>
) => Promise<FinancialIntervalStatementDto>;

type FinancialIntervalStatementPanelProps = Readonly<{
  selectedCandle: FinancialCandle | null;
  loadStatement: FinancialIntervalStatementLoader;
  onClose: () => void;
}>;

type LoadState =
  | Readonly<{ requestKey: string; status: "loading" }>
  | Readonly<{ requestKey: string; status: "error" }>
  | Readonly<{
      requestKey: string;
      status: "success";
      statement: FinancialIntervalStatementDto;
    }>;

function formatCivilDate(civilDate: string) {
  const [year, month, day] = civilDate.split("-");
  return `${day}/${month}/${year}`;
}

function movementLabel(count: number) {
  return `${count} ${count === 1 ? "movimento" : "movimentos"}`;
}

export function FinancialIntervalStatementPanel({
  selectedCandle,
  loadStatement,
  onClose
}: FinancialIntervalStatementPanelProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const onCloseRef = useRef(onClose);
  const [reloadAttempt, setReloadAttempt] = useState(0);
  const [loadState, setLoadState] = useState<LoadState>({
    requestKey: "",
    status: "loading"
  });
  const requestKey = selectedCandle
    ? `${selectedCandle.startOnInclusive}:${selectedCandle.endOnExclusive}:${reloadAttempt}`
    : "";
  const visibleLoadState: LoadState =
    loadState.requestKey === requestKey
      ? loadState
      : { requestKey, status: "loading" };
  const isOpen = selectedCandle !== null;

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const closePanel = useCallback(() => {
    onCloseRef.current();
  }, []);

  useEffect(() => {
    if (!selectedCandle) {
      return;
    }

    let acceptsResponse = true;

    void loadStatement({
      startOnInclusive: selectedCandle.startOnInclusive,
      endOnExclusive: selectedCandle.endOnExclusive
    }).then(
      (statement) => {
        if (acceptsResponse) {
          setLoadState({ requestKey, status: "success", statement });
        }
      },
      () => {
        if (acceptsResponse) {
          setLoadState({ requestKey, status: "error" });
        }
      }
    );

    return () => {
      acceptsResponse = false;
    };
  }, [loadStatement, requestKey, selectedCandle]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const portalRoot = panelRef.current?.closest<HTMLElement>(
      "[data-financial-statement-portal]"
    );
    const backgroundStates = Array.from(document.body.children)
      .filter(
        (element): element is HTMLElement =>
          element instanceof HTMLElement &&
          element !== portalRoot &&
          !["SCRIPT", "STYLE"].includes(element.tagName)
      )
      .map((element) => ({
        ariaHidden: element.getAttribute("aria-hidden"),
        element,
        hadInertAttribute: element.hasAttribute("inert")
      }));

    for (const { element } of backgroundStates) {
      element.setAttribute("aria-hidden", "true");
      element.setAttribute("inert", "");
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closePanel();
        return;
      }

      containKeyboardFocus(event, panelRef.current);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);

      for (const { ariaHidden, element, hadInertAttribute } of backgroundStates) {
        if (ariaHidden === null) {
          element.removeAttribute("aria-hidden");
        } else {
          element.setAttribute("aria-hidden", ariaHidden);
        }

        if (!hadInertAttribute) {
          element.removeAttribute("inert");
        }
      }

      opener?.focus();
    };
  }, [closePanel, isOpen]);

  if (!selectedCandle) {
    return null;
  }

  const formattedDate = formatCivilDate(selectedCandle.startOnInclusive);

  return createPortal(
    <div data-financial-statement-portal="">
      <button
        aria-hidden="true"
        aria-label="Fechar extrato pelo fundo"
        className="fixed inset-0 z-50 cursor-default bg-navigation/70 transition-opacity motion-reduce:transition-none"
        data-testid="financial-statement-backdrop"
        onClick={closePanel}
        tabIndex={-1}
        type="button"
      />
      <div className="pointer-events-none fixed inset-0 z-[60] md:flex md:justify-end">
        <section
          aria-labelledby={titleId}
          aria-modal="true"
          className="pointer-events-auto absolute inset-x-0 bottom-0 grid max-h-[85dvh] gap-5 overscroll-contain overflow-y-auto rounded-t-2xl border border-border bg-surface pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-5 shadow-2xl transition-transform motion-reduce:transition-none md:static md:h-full md:max-h-none md:w-full md:max-w-md md:rounded-none md:border-y-0 md:border-r-0 md:p-6"
          ref={panelRef}
          role="dialog"
        >
        <header className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Intervalo selecionado
            </p>
            <h2 className="mt-1 text-xl font-semibold text-foreground" id={titleId}>
              Extrato de {formattedDate}
            </h2>
          </div>
          <button
            aria-label="Fechar extrato"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            onClick={closePanel}
            ref={closeButtonRef}
            type="button"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </header>

        <dl className="grid grid-cols-2 gap-3 rounded-xl bg-surface-muted p-4 text-sm">
          <div className="sr-only">
            Abertura: {formatCents(selectedCandle.openInCents)}
          </div>
          {[
            ["Abertura", selectedCandle.openInCents],
            ["Máxima", selectedCandle.highInCents],
            ["Mínima", selectedCandle.lowInCents],
            ["Fechamento", selectedCandle.closeInCents]
          ].map(([label, value]) => (
            <div className="min-w-0" key={label}>
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="mt-1 break-words font-semibold tabular-nums text-foreground">
                {formatCents(Number(value))}
              </dd>
            </div>
          ))}
        </dl>

        <div aria-live="polite" className="min-h-24">
          {visibleLoadState.status === "loading" ? (
            <p className="text-sm text-muted-foreground" role="status">
              Carregando extrato…
            </p>
          ) : null}

          {visibleLoadState.status === "error" ? (
            <div className="grid gap-3" role="alert">
              <p className="text-sm text-foreground">
                Não foi possível carregar o extrato deste intervalo.
              </p>
              <button
                className="min-h-11 w-fit rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                onClick={() => setReloadAttempt((attempt) => attempt + 1)}
                type="button"
              >
                Tentar novamente
              </button>
            </div>
          ) : null}

          {visibleLoadState.status === "success" ? (
            visibleLoadState.statement.items.length === 0 ? (
              <p className="text-sm text-muted-foreground" role="status">
                Nenhum lançamento neste intervalo.
              </p>
            ) : (
              <div className="grid gap-3">
                <p className="text-sm text-muted-foreground">
                  {movementLabel(visibleLoadState.statement.items.length)}
                </p>
                <ul className="divide-y divide-border rounded-xl border border-border">
                  {visibleLoadState.statement.items.map((item) => (
                    <li
                      className="flex items-start justify-between gap-4 p-4"
                      key={item.id}
                    >
                      <div className="min-w-0">
                        <p className="break-words font-medium text-foreground">
                          {item.description}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatCivilDate(item.occurredOn)} ·{" "}
                          {item.type === "income" ? "Receita" : "Despesa"}
                        </p>
                      </div>
                      <p className="shrink-0 font-semibold tabular-nums text-foreground">
                        {formatCents(item.amountInCents)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )
          ) : null}
        </div>
        </section>
      </div>
    </div>,
    document.body
  );
}

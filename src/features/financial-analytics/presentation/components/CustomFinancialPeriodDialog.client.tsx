"use client";

import { useCallback, useId, useRef, useState } from "react";
import type { FormEvent } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { resolveCustomFinancialPeriod } from "../../domain/services/resolve-financial-period";
import { Button } from "@/shared/components/ui/Button";
import { useModalDialogLifecycle } from "@/shared/hooks/useModalDialogLifecycle";

type CustomFinancialPeriodDialogProps = Readonly<{
  accessibleLabel: string;
  compactLabel: string;
  initialFrom?: string;
  initialTo?: string;
  isSelected: boolean;
  label: string;
}>;

function customPeriodErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Revise as datas e tente novamente.";
  }

  switch (error.message) {
    case "boundaries are invalid":
      return "A data inicial deve ser anterior ou igual à data final.";
    case "interval exceeds 60 years":
      return "O período personalizado pode ter no máximo 60 anos.";
    case "bucket count exceeds 60":
      return "Reduza o intervalo para exibir no máximo 60 candles.";
    default:
      return "Revise as datas e tente novamente.";
  }
}

export function CustomFinancialPeriodDialog({
  accessibleLabel,
  compactLabel,
  initialFrom = "",
  initialTo = "",
  isSelected,
  label
}: CustomFinancialPeriodDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const errorId = useId();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const closeAndReset = useCallback(() => {
    setFrom(initialFrom);
    setTo(initialTo);
    setErrorMessage(null);
    setIsOpen(false);
  }, [initialFrom, initialTo]);

  const {
    closeDialog,
    dialogRef,
    initialFocusRef,
    portalRootRef
  } = useModalDialogLifecycle<HTMLElement, HTMLInputElement>({
    isOpen,
    onClose: closeAndReset,
    returnFocusRef: triggerRef
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!from || !to) {
      event.preventDefault();
      setErrorMessage("Informe as datas inicial e final.");
      return;
    }

    try {
      resolveCustomFinancialPeriod({ from, to });
      setErrorMessage(null);
    } catch (error) {
      event.preventDefault();
      setErrorMessage(customPeriodErrorMessage(error));
    }
  }

  const fieldDescription = errorMessage
    ? `${descriptionId} ${errorId}`
    : descriptionId;

  return (
    <>
      <Button
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={accessibleLabel}
        aria-pressed={isSelected}
        className={`shrink-0 !px-2 motion-reduce:transition-none sm:!px-4 ${
          isSelected
            ? "ring-2 ring-focus-ring ring-offset-2 ring-offset-background"
            : ""
        }`}
        onClick={(event) => {
          triggerRef.current = event.currentTarget;
          setFrom(initialFrom);
          setTo(initialTo);
          setErrorMessage(null);
          setIsOpen(true);
        }}
        type="button"
        variant={isSelected ? "primary" : "secondary"}
      >
        <span className="sm:hidden">{compactLabel}</span>
        <span className="hidden sm:inline">{label}</span>
      </Button>

      {isOpen
        ? createPortal(
            <div data-custom-period-portal="" ref={portalRootRef}>
              <button
                aria-hidden="true"
                aria-label="Fechar período personalizado pelo fundo"
                className="fixed inset-0 z-50 cursor-default bg-navigation/70 transition-opacity motion-reduce:transition-none"
                data-testid="custom-period-backdrop"
                onClick={closeDialog}
                tabIndex={-1}
                type="button"
              />
              <div className="pointer-events-none fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4">
                <section
                  aria-describedby={descriptionId}
                  aria-labelledby={titleId}
                  aria-modal="true"
                  className="pointer-events-auto absolute bottom-0 grid max-h-[85dvh] w-full min-w-0 gap-5 overflow-y-auto overscroll-contain rounded-t-2xl border border-border bg-surface pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-5 shadow-2xl motion-reduce:transition-none sm:static sm:max-w-lg sm:rounded-2xl sm:p-6"
                  ref={dialogRef}
                  role="dialog"
                >
                  <header className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                        Intervalo personalizado
                      </p>
                      <h2
                        className="mt-1 text-xl font-semibold text-foreground"
                        id={titleId}
                      >
                        Escolher período personalizado
                      </h2>
                      <p
                        className="mt-2 text-sm text-muted-foreground"
                        id={descriptionId}
                      >
                        Selecione as duas datas inclusivas. O gráfico adapta os
                        candles automaticamente.
                      </p>
                    </div>
                    <button
                      aria-label="Fechar período personalizado"
                      className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                      onClick={closeDialog}
                      type="button"
                    >
                      <X aria-hidden="true" className="size-5" />
                    </button>
                  </header>

                  <form className="grid min-w-0 gap-4" method="get" noValidate onSubmit={handleSubmit}>
                    <input name="period" type="hidden" value="custom" />
                    <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                      <label className="grid min-w-0 gap-2 text-sm font-semibold text-foreground">
                        Data inicial
                        <input
                          aria-describedby={fieldDescription}
                          aria-invalid={errorMessage ? "true" : "false"}
                          className="min-h-11 min-w-0 w-full rounded-md border border-border bg-background px-3 py-2 font-normal text-foreground outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                          name="from"
                          onChange={(event) => {
                            setFrom(event.target.value);
                            setErrorMessage(null);
                          }}
                          ref={initialFocusRef}
                          required
                          type="date"
                          value={from}
                        />
                      </label>
                      <label className="grid min-w-0 gap-2 text-sm font-semibold text-foreground">
                        Data final
                        <input
                          aria-describedby={fieldDescription}
                          aria-invalid={errorMessage ? "true" : "false"}
                          className="min-h-11 min-w-0 w-full rounded-md border border-border bg-background px-3 py-2 font-normal text-foreground outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                          name="to"
                          onChange={(event) => {
                            setTo(event.target.value);
                            setErrorMessage(null);
                          }}
                          required
                          type="date"
                          value={to}
                        />
                      </label>
                    </div>

                    {errorMessage ? (
                      <p
                        className="rounded-md border border-danger/40 bg-danger/10 p-3 text-sm text-danger"
                        id={errorId}
                        role="alert"
                      >
                        {errorMessage}
                      </p>
                    ) : null}

                    <div className="grid gap-2 sm:flex sm:justify-end">
                      <Button
                        className="w-full sm:w-auto"
                        onClick={closeDialog}
                        type="button"
                        variant="secondary"
                      >
                        Cancelar
                      </Button>
                      <Button className="w-full sm:w-auto" type="submit">
                        Aplicar período
                      </Button>
                    </div>
                  </form>
                </section>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}

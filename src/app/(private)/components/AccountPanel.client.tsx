"use client";

import { UserRound, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SignOutButton } from "@/features/auth/presentation/components/SignOutButton";
import { ThemeSwitcher } from "@/shared/components/ui/ThemeSwitcher";
import { containKeyboardFocus } from "@/shared/utils/containKeyboardFocus";

type AccountPanelProps = {
  email: string;
  onSignOut(): Promise<void>;
};

export function AccountPanel({ email, onSignOut }: AccountPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();
  const titleId = useId();
  const sessionId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const closePanel = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const triggerElement = triggerRef.current;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const portalRoot = panelRef.current?.closest<HTMLElement>(
      "[data-account-panel-portal]",
    );
    const backgroundStates = Array.from(document.body.children)
      .filter(
        (element): element is HTMLElement =>
          element instanceof HTMLElement &&
          element !== portalRoot &&
          !["SCRIPT", "STYLE"].includes(element.tagName),
      )
      .map((element) => ({
        ariaHidden: element.getAttribute("aria-hidden"),
        element,
        hadInertAttribute: element.hasAttribute("inert"),
      }));

    for (const { element } of backgroundStates) {
      element.setAttribute("aria-hidden", "true");
      element.setAttribute("inert", "");
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closePanel();
        return;
      }

      containKeyboardFocus(event, panelRef.current);
    }

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

      triggerElement?.focus();
    };
  }, [closePanel, isOpen]);

  return (
    <>
      <button
        aria-controls={panelId}
        aria-expanded={isOpen}
        aria-label="Abrir painel da conta"
        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-border bg-surface-muted px-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 motion-reduce:transition-none"
        onClick={() => setIsOpen(true)}
        ref={triggerRef}
        type="button"
      >
        <UserRound aria-hidden="true" size={20} />
        <span className="hidden lg:inline">Conta</span>
      </button>

      {isOpen
        ? createPortal(
            <div data-account-panel-portal="">
              <button
                aria-hidden="true"
                aria-label="Fechar painel da conta pelo fundo"
                className="fixed inset-0 z-50 cursor-default bg-navigation/70 transition-opacity motion-reduce:transition-none"
                data-testid="account-panel-backdrop"
                onClick={closePanel}
                tabIndex={-1}
                type="button"
              />
              <div className="pointer-events-none fixed inset-0 z-[60]">
                <div
                  aria-describedby={sessionId}
                  aria-labelledby={titleId}
                  aria-modal="true"
                  className="pointer-events-auto fixed inset-x-0 bottom-0 z-[60] max-h-[min(85dvh,36rem)] overscroll-contain overflow-y-auto rounded-t-2xl border border-border bg-surface pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-4 shadow-2xl transition-transform motion-reduce:transition-none md:absolute md:inset-x-auto md:right-4 md:top-[calc(4rem+env(safe-area-inset-top))] md:bottom-auto md:w-[min(24rem,calc(100vw-2rem))] md:rounded-xl md:p-5"
                  id={panelId}
                  ref={panelRef}
                  role="dialog"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2
                        className="text-lg font-semibold text-foreground"
                        id={titleId}
                      >
                        Conta e aparência
                      </h2>
                      <p
                        className="mt-1 text-sm text-muted-foreground"
                        id={sessionId}
                      >
                        <span className="font-medium">Sessão atual</span>
                        <span className="block truncate">{email}</span>
                      </p>
                    </div>
                    <button
                      aria-label="Fechar painel da conta"
                      className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring motion-reduce:transition-none"
                      onClick={closePanel}
                      ref={closeButtonRef}
                      type="button"
                    >
                      <X aria-hidden="true" size={20} />
                    </button>
                  </div>

                  <div className="mt-5 border-t border-border pt-5">
                    <ThemeSwitcher />
                  </div>

                  <div className="mt-5 flex justify-end border-t border-border pt-5">
                    <SignOutButton onSignOut={onSignOut} />
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

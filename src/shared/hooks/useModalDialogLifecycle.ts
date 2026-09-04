import { useCallback, useEffect, useRef } from "react";
import type { RefObject } from "react";
import { containKeyboardFocus } from "@/shared/utils/containKeyboardFocus";

type UseModalDialogLifecycleInput = Readonly<{
  isOpen: boolean;
  onClose: () => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
}>;

export function useModalDialogLifecycle<
  DialogElement extends HTMLElement,
  InitialFocusElement extends HTMLElement,
>({ isOpen, onClose, returnFocusRef }: UseModalDialogLifecycleInput) {
  const portalRootRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<DialogElement | null>(null);
  const initialFocusRef = useRef<InitialFocusElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const closeDialog = useCallback(() => {
    onCloseRef.current();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const activeElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const returnFocusElement = returnFocusRef?.current ?? activeElement;
    document.body.style.overflow = "hidden";
    initialFocusRef.current?.focus();

    const backgroundStates = Array.from(document.body.children)
      .filter(
        (element): element is HTMLElement =>
          element instanceof HTMLElement &&
          element !== portalRootRef.current &&
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
        closeDialog();
        return;
      }

      containKeyboardFocus(event, dialogRef.current);
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

      returnFocusElement?.focus();
    };
  }, [closeDialog, isOpen, returnFocusRef]);

  return {
    closeDialog,
    dialogRef,
    initialFocusRef,
    portalRootRef,
  } as const;
}

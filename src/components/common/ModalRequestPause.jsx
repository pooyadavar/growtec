import { useEffect, useRef } from "react";
import { focusManager } from "@tanstack/react-query";

const MODAL_SELECTOR =
  ".MuiModal-root:not([aria-hidden='true']), .MuiDialog-root:not([aria-hidden='true']), .MuiPopover-root:not([aria-hidden='true'])";

const isVisibleModal = (element) => {
  const style = window.getComputedStyle(element);
  return style.display !== "none" && style.visibility !== "hidden";
};

const hasOpenModal = () =>
  Array.from(document.querySelectorAll(MODAL_SELECTOR)).some(isVisibleModal);

const ModalRequestPause = () => {
  const pausedRef = useRef(false);

  useEffect(() => {
    const syncFocusState = () => {
      const shouldPause = hasOpenModal();
      if (pausedRef.current === shouldPause) return;

      pausedRef.current = shouldPause;
      focusManager.setFocused(shouldPause ? false : undefined);
    };

    const observer = new MutationObserver(syncFocusState);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "style", "aria-hidden"],
      childList: true,
      subtree: true,
    });

    syncFocusState();

    return () => {
      observer.disconnect();
      focusManager.setFocused(undefined);
    };
  }, []);

  return null;
};

export default ModalRequestPause;

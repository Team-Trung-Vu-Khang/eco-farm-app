import React from "react";

/**
 * Workaround for Radix UI Dialog bug where pointer-events: none is left on body
 * after a dialog is closed.
 */
export function useDialogBugWorkaround(openStates: boolean[]) {
  React.useEffect(() => {
    const isAnyOpen = openStates.some((isOpen) => isOpen);
    if (!isAnyOpen) {
      const timer = setTimeout(() => {
        document.body.style.pointerEvents = "auto";
      }, 500);
      return () => clearTimeout(timer);
    }
  }, openStates); // eslint-disable-line react-hooks/exhaustive-deps
}

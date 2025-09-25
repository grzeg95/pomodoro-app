import {useCallback, useEffect, useRef, useState} from 'react';

let focusTrapIdCounter = 0;
const focusTrapStack: number[] = [];

type UseFocusTrapOptions = {
  active?: boolean;
  restoreFocus?: boolean;
};

export function useFocusTrap<T extends HTMLElement>(
  {active = true, restoreFocus = true}: UseFocusTrapOptions = {}
) {

  const nodeRef = useRef<T | null>(null);
  const prevFocused = useRef<HTMLElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const focusTrapId = useRef(-1);

  const setRef = useCallback((node: T | null) => {
    nodeRef.current = node;
    setIsReady(!!node);
    focusTrapId.current = focusTrapIdCounter++;
    focusTrapStack.push(focusTrapId.current);
  }, []);

  useEffect(() => {
    return () => {

      const index = focusTrapStack.indexOf(focusTrapId.current);
      focusTrapStack.splice(index, 1);

      if (focusTrapStack.length === 0) {
        focusTrapIdCounter = 0;
      }
    };
  }, []);

  useEffect(() => {

    if (!active || !isReady || focusTrapId.current === -1) return;

    const container = nodeRef.current;
    if (!container) return;

    prevFocused.current = document.activeElement as HTMLElement | null;

    const selectors = 'a[href], area[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const isTopTrap = () => focusTrapStack[focusTrapStack.length - 1] === focusTrapId.current;

    const getFocusable = () => Array.from(
      container.querySelectorAll<HTMLElement>(selectors)
    ).filter(
      el => !(el as HTMLButtonElement).disabled && el.offsetParent !== null
    );

    const handleKeyDown = (e: KeyboardEvent) => {

      if (e.key !== 'Tab' || !isTopTrap()) return;

      const focusable = getFocusable();

      if (focusable.length === 0) {
        (container as HTMLElement).focus();
        e.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first || document.activeElement === container) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    const handleFocusIn = (e: FocusEvent) => {

      if (!isTopTrap()) return;

      if (!container.contains(e.target as Node)) {
        const focusable = getFocusable();
        (focusable[0] ?? (container as HTMLElement)).focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocusIn);

    return () => {

      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocusIn);

      if (restoreFocus && prevFocused.current && prevFocused.current.focus) {
        prevFocused.current.focus();
      }

      if (container.getAttribute('tabindex') === '-1') {
        container.removeAttribute('tabindex');
      }
    };
  }, [active, isReady, restoreFocus]);

  return setRef;
}

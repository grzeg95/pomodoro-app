import {type ReactNode, type RefObject, useEffect, useImperativeHandle, useRef} from 'react';
import {createPortal} from 'react-dom';
import {useFocusTrap} from '../../../hooks/useFocusTrap';
import styles from './Dialog.module.scss';

let dialogIdCounter = 0;
const dialogStack: number[] = [];

export type DialogRef = {
  close: () => void;
};

export type DialogProps = {
  children: ReactNode;
  onClose?: () => void;
  isOpen: boolean;
  ref?: RefObject<DialogRef | null> | null;
}

export function Dialog({children, onClose, isOpen, ref}: DialogProps) {

  const dialogId = useRef(-1);
  const dialogRef = useRef<HTMLDivElement>(null);

  const trapRef = useFocusTrap({
    active: isOpen
  });

  useImperativeHandle(ref, () => {
    return {
      close() {
        onClose?.();
      }
    };
  }, [onClose]);

  function getScrollbarWidth() {

    const scrollDiv = document.createElement('div');

    scrollDiv.style.visibility = 'hidden';
    scrollDiv.style.overflow = 'scroll';
    scrollDiv.style.position = 'absolute';
    scrollDiv.style.top = '-9999px';
    scrollDiv.style.width = '100px';
    scrollDiv.style.height = '100px';

    document.body.appendChild(scrollDiv);

    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);

    return scrollbarWidth;
  }

  function isFirstDialog() {
    return dialogStack.indexOf(dialogId.current) === 0;
  }

  useEffect(() => {

    function updateScrollVisibility() {
      const visible = document.documentElement.scrollHeight > window.innerHeight;

      if (visible) {
        const scrollbarWidth = getScrollbarWidth();
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.paddingRight = '0px';
        document.body.style.overflow = 'auto';
        document.body.style.overflow = 'auto';
      }
    }

    if (isOpen) {

      dialogId.current = ++dialogIdCounter;
      dialogStack.push(dialogIdCounter);

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose?.();
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      if (isFirstDialog()) {
        updateScrollVisibility();
        window.addEventListener('resize', updateScrollVisibility);
      }

      return () => {

        if (isFirstDialog()) {
          window.removeEventListener('resize', updateScrollVisibility);
          document.body.style.paddingRight = '0px';
          document.body.style.overflow = 'auto';
          document.body.style.overflow = 'auto';
        }

        window.removeEventListener('keydown', handleKeyDown);

        const index = dialogStack.indexOf(dialogIdCounter);
        dialogStack.splice(index, 1);

        if (dialogStack.length === 0) {
          dialogIdCounter = 0;
        }
      };
    }
  }, [isOpen, onClose]);

  useEffect(() => {

    if (!isOpen) {
      onClose?.();
    }
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <>
      <div className={styles['dialog-backdrop']} onClick={() => onClose?.()}/>
      <div className={styles['dialog-wrapper']} ref={dialogRef}>
        <div className={styles['dialog-pane']} ref={trapRef}>
          {children}
        </div>
      </div>
    </>
    , document.getElementById('overlay-root')!);
}

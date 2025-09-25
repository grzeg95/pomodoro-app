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

  const scrollRef = useRef({
    y: 0,
    x: 0
  });
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

  useEffect(() => {

    if (isOpen) {

      dialogIdCounter++;
      dialogStack.push(dialogIdCounter);

      // check for removing scroll

      const sx = window.scrollX;
      const sy = window.scrollY;

      scrollRef.current.x = sx;
      scrollRef.current.y = sy;

      const body = document.body;

      if (sy > 0) {
        body.style.top = `-${sy}px`;
        body.style.left = `-${sx}px`;
        body.classList.add('no-scroll');
      }

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose?.();
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {

        const index = dialogStack.indexOf(dialogIdCounter);
        dialogStack.splice(index, 1);

        if (dialogStack.length === 0) {

          dialogIdCounter = 0;

          const body = document.body;

          if (body.classList.contains('no-scroll')) {

            body.classList.remove('no-scroll');

            window.scrollTo(scrollRef.current.x, scrollRef.current.y);
            body.style.top = 'auto';
            body.style.left = 'auto';
          }
        }

        window.removeEventListener('keydown', handleKeyDown)
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

import {type ReactNode, type RefObject, useEffect, useImperativeHandle, useRef} from 'react';
import {createPortal} from 'react-dom';
import {useFocusTrap} from '../../../hooks/useFocusTrap';
import styles from './Dialog.module.scss';

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
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose?.();
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => window.removeEventListener('keydown', handleKeyDown);
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

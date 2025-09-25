import type {ReactNode} from 'react';
import styles from './Button.module.scss';

type ButtonProps = {
  children?: ReactNode,
  onClick?: () => void,
  className?: string,
}

export function Button({children, onClick, className}: ButtonProps) {

  return (
    <button onClick={onClick} className={`${styles['button']} ${className}`}>
      <span className={styles['button-text']}>
        {children}
      </span>
    </button>
  );
}

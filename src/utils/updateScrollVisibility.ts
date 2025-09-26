import {getScrollbarWidth} from './getScrollbarWidth';

export function updateScrollVisibility() {

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

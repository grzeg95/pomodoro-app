import {updateScrollVisibility} from './updateScrollVisibility';

export function mutationObserverScrollVisibility(mutationsList: MutationRecord[]) {

  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {

      for (const entry of mutation.addedNodes as NodeListOf<HTMLElement>) {
        if (entry.id === 'scroll-div-hidden') {
          return;
        }
      }

      for (const entry of mutation.removedNodes as NodeListOf<HTMLElement>) {
        if (entry.id === 'scroll-div-hidden') {
          return;
        }
      }

      updateScrollVisibility();
    }
  }
}

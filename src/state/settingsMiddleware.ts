import {createListenerMiddleware} from '@reduxjs/toolkit';
import {settingsActions} from './settingsSlice';

export const settingsMiddleware = createListenerMiddleware();

settingsMiddleware.startListening({
  actionCreator: settingsActions.setFontFamily,
  effect: (action) => {
    document.body.style.setProperty('--font-family', action.payload.font);
  },
});

settingsMiddleware.startListening({
  actionCreator: settingsActions.setTheme,
  effect: (action) => {
    document.body.style.setProperty('--color-accent', action.payload.theme);
  },
});

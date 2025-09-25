import {configureStore} from '@reduxjs/toolkit';
import {settingsMiddleware} from './settingsMiddleware';
import settingsReducer from './settingsSlice';

export const store = configureStore({
  reducer: {
    setting: settingsReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(settingsMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

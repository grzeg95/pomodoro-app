import {type CaseReducer, createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type {FontFamily} from '../models/font-family';
import type {Theme} from '../models/theme';

export type SettingsState = {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  fontFamily: FontFamily;
  theme: Theme;
}

const initialState: SettingsState = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  fontFamily: 'Archivo Black',
  theme: '#f87070'
};

const setPomodoro: CaseReducer<SettingsState, PayloadAction<{value: number}>> = (state, action) => {
  if (action.payload.value < 60 && action.payload.value > 0) {
    state.pomodoro = action.payload.value;
  }
};

const setShortBreak: CaseReducer<SettingsState, PayloadAction<{value: number}>> = (state, action) => {
  if (action.payload.value < 60 && action.payload.value > 0) {
    state.shortBreak = action.payload.value;
  }
};

const setLongBreak: CaseReducer<SettingsState, PayloadAction<{value: number}>> = (state, action) => {
  if (action.payload.value < 60 && action.payload.value > 0) {
    state.longBreak = action.payload.value;
  }
};

const setFontFamily: CaseReducer<SettingsState, PayloadAction<{font: FontFamily}>> = (state, action) => {
  state.fontFamily = action.payload.font;
};

const setTheme: CaseReducer<SettingsState, PayloadAction<{theme: Theme}>> = (state, action) => {
  state.theme = action.payload.theme;
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setPomodoro,
    setShortBreak,
    setLongBreak,
    setFontFamily,
    setTheme
  }
});

export default settingsSlice.reducer;
export const settingsActions = settingsSlice.actions;

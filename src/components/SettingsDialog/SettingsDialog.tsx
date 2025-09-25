import {useReducer, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import type {FontFamily} from '../../models/font-family';
import type {Theme} from '../../models/theme';
import {settingsActions, type SettingsState} from '../../state/settingsSlice';
import type {AppDispatch, RootState} from '../../state/store';
import {Button} from '../ui/Button/Button';
import {Dialog, type DialogRef} from '../ui/Dialog/Dialog';
import {InputNumber} from '../ui/InputNumber/InputNumber';
import styles from './SettingsDialog.module.scss';

enum SettingsStateActions {
  POMODORO = 'POMODORO',
  SHORTBREAK = 'SHORTBREAK',
  LONGBREAK = 'LONGBREAK',
  FONTFAMILY = 'FONTFAMILY',
  THEME = 'THEME'
}

type SettingsStateAction = {
  type: SettingsStateActions.POMODORO;
  payload: {value: number};
} | {
  type: SettingsStateActions.SHORTBREAK;
  payload: {value: number};
} | {
  type: SettingsStateActions.LONGBREAK;
  payload: {value: number};
} | {
  type: SettingsStateActions.FONTFAMILY;
  payload: {value: FontFamily};
} | {
  type: SettingsStateActions.THEME;
  payload: {value: Theme};
}

function reducer(state: SettingsState, action: SettingsStateAction): SettingsState {

  switch (action.type) {
    case SettingsStateActions.POMODORO:
      return {
        ...state,
        pomodoro: action.payload.value
      }
    case SettingsStateActions.SHORTBREAK:
      return {
        ...state,
        shortBreak: action.payload.value
      }
    case SettingsStateActions.LONGBREAK:
      return {
        ...state,
        longBreak: action.payload.value
      }
    case SettingsStateActions.FONTFAMILY:
      return {
        ...state,
        fontFamily: action.payload.value
      }
    case SettingsStateActions.THEME:
      return {
        ...state,
        theme: action.payload.value
      }
    default:
      return state;
  }
}

type SettingsDialogProps = {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsDialog({ isOpen, onClose } : SettingsDialogProps) {

  const dialogRef = useRef<DialogRef | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const settings = useSelector((state: RootState) => state.setting);
  const [internalSettings, internalSettingsDispatch] = useReducer(reducer, settings);

  function handleApply() {

    dispatch(settingsActions.setPomodoro({value: internalSettings.pomodoro}));
    dispatch(settingsActions.setShortBreak({value: internalSettings.shortBreak}));
    dispatch(settingsActions.setLongBreak({value: internalSettings.longBreak}));
    dispatch(settingsActions.setFontFamily({font: internalSettings.fontFamily}));
    dispatch(settingsActions.setTheme({theme: internalSettings.theme}));

    dialogRef.current?.close();
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} ref={dialogRef}>
      <div className={styles['dialog']}>
        <div className={styles['dialog-header']}>
          <div className={styles['dialog-header-title']}>Settings</div>
          <button className={styles['dialog-close-button']} onClick={() => dialogRef.current?.close()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14">
              <path fill="#1E213F" fill-rule="evenodd" d="M11.95.636l1.414 1.414L8.414 7l4.95 4.95-1.414 1.414L7 8.414l-4.95 4.95L.636 11.95 5.586 7 .636 2.05 2.05.636 7 5.586l4.95-4.95z" opacity=".5"/>
            </svg>
          </button>
        </div>
        <hr/>
        <div className={styles['dialog-content']}>
          <div className={styles['time-settings']}>
            <div className={styles['title']}>time (minutes)</div>
            <div className={styles['times-options']}>
              <InputNumber
                min={1}
                max={59}
                value={internalSettings.pomodoro}
                onChange={(value) => {internalSettingsDispatch({type: SettingsStateActions.POMODORO, payload: {value}})}}
                label='pomodoro'
              />
              <InputNumber
                min={1}
                max={59}
                value={internalSettings.shortBreak}
                onChange={(value) => {internalSettingsDispatch({type: SettingsStateActions.SHORTBREAK, payload: {value}})}}
                label='short break'
              />
              <InputNumber
                min={1}
                max={59}
                value={internalSettings.longBreak}
                onChange={(value) => {internalSettingsDispatch({type: SettingsStateActions.LONGBREAK, payload: {value}})}}
                label='long break'
              />
            </div>
          </div>
          <hr/>
          <div className={styles['font-settings']}>
            <div className={styles['title']}>font</div>
            <div className={styles['font-options']}>
              <div
                tabIndex={0}
                className={`${styles['font-option']} ${styles['font-option-archivo-black']} ${internalSettings.fontFamily === 'Archivo Black' ? styles['font-option-selected'] : ''}`}
                onClick={() => {internalSettingsDispatch({type: SettingsStateActions.FONTFAMILY, payload: {value: 'Archivo Black'}})}}
                onKeyDown={(e) => {if (e.key === 'Enter') {internalSettingsDispatch({type: SettingsStateActions.FONTFAMILY, payload: {value: 'Archivo Black'}})}}}
              >Aa
              </div>
              <div
                tabIndex={0}
                className={`${styles['font-option']} ${styles['font-option-roboto']} ${internalSettings.fontFamily === 'Roboto' ? styles['font-option-selected'] : ''}`}
                onClick={() => {internalSettingsDispatch({type: SettingsStateActions.FONTFAMILY, payload: {value: 'Roboto'}})}}
                onKeyDown={(e) => {if (e.key === 'Enter') {internalSettingsDispatch({type: SettingsStateActions.FONTFAMILY, payload: {value:'Roboto'}})}}}
              >Aa</div>
              <div
                tabIndex={0}
                className={`${styles['font-option']} ${styles['font-option-epunda-slab']} ${internalSettings.fontFamily === 'Epunda Slab' ? styles['font-option-selected'] : ''}`}
                onClick={() => {internalSettingsDispatch({type: SettingsStateActions.FONTFAMILY, payload: {value: 'Epunda Slab'}})}}
                onKeyDown={(e) => {if (e.key === 'Enter') {internalSettingsDispatch({type: SettingsStateActions.FONTFAMILY, payload: {value: 'Epunda Slab'}})}}}
              >Aa</div>
            </div>
          </div>
          <hr/>
          <div className={styles['color-settings']}>
            <div className={styles['title']}>color</div>
            <div className={styles['color-options']}>
              <div
                tabIndex={0}
                className={`${styles['color-option']} ${styles['color-option-f87070']} ${internalSettings.theme === '#f87070' ? styles['color-option-selected'] : ''}`}
                onClick={() => {internalSettingsDispatch({type: SettingsStateActions.THEME, payload: {value: '#f87070'}})}}
                onKeyDown={(e) => {if (e.key === 'Enter') {internalSettingsDispatch({type: SettingsStateActions.THEME, payload: {value: '#f87070'}})}}}
              ></div>
              <div
                tabIndex={0}
                className={`${styles['color-option']} ${styles['color-option-6df4f8']} ${internalSettings.theme === '#6df4f8' ? styles['color-option-selected'] : ''}`}
                onClick={() => {internalSettingsDispatch({type: SettingsStateActions.THEME, payload: {value: '#6df4f8'}})}}
                onKeyDown={(e) => {if (e.key === 'Enter') {internalSettingsDispatch({type: SettingsStateActions.THEME, payload: {value: '#6df4f8'}})}}}
              ></div>
              <div
                tabIndex={0}
                className={`${styles['color-option']} ${styles['color-option-d981f9']} ${internalSettings.theme === '#d981f9' ? styles['color-option-selected'] : ''}`}
                onClick={() => {internalSettingsDispatch({type: SettingsStateActions.THEME, payload: {value: '#d981f9'}})}}
                onKeyDown={(e) => {if (e.key === 'Enter') {internalSettingsDispatch({type: SettingsStateActions.THEME, payload: {value: '#d981f9'}})}}}
              ></div>
            </div>
          </div>
          <Button onClick={handleApply} className={`${styles['apply-button']} ${settings.theme === '#6df4f8' ? styles['apply-button-black'] : ''}`}>
            Apply
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

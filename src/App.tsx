import {useState} from 'react';
import styles from './App.module.scss';
import iconLogo from './assets/logo.svg';
import {Selector} from './components/Selector/Selector';
import type {TimerOption} from './models/timer';

export function App() {

  const [timerOption, setTimerOption] = useState<TimerOption>('pomodoro');

  return (
    <div className={styles['container']}>

      <img src={iconLogo} alt='Pomodoro'/>

      <Selector items={[
        {value: 'pomodoro', label: 'pomodoro'},
        {value: 'shortBreak', label: 'short break'},
        {value: 'longBreak', label: 'long break'}
      ]} onChange={(value) => setTimerOption(value)} selected='pomodoro'/>
    </div>
  )
}

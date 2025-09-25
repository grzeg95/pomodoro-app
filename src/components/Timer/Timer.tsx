import {useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import type {Timer, TimerOption} from '../../models/timer';
import type {RootState} from '../../state/store';
import {map} from '../../utils/map';
import styles from './Timer.module.scss';

type TimerProps = {
  timerOption?: TimerOption
}

export function Timer({timerOption = 'pomodoro'}: TimerProps) {

  const settings = useSelector((state: RootState) => state.setting);
  const [timer, setTimer] = useState<Timer>({
    state: null,
    remaining: settings[timerOption] * 60,
    elapsed: 0
  });

  const timerInterval = useRef<NodeJS.Timeout | number>(-1);
  const startTime = useRef(0);

  const minutesRemaining = String(Math.floor(timer.remaining / 60)).padStart(2, '0');
  const secondsRemaining = String(timer.remaining % 60).padStart(2, '0');
  const timelineRemaining = map(timer.remaining, 0, timer.remaining, 282.999, 0);

  useEffect(() => {

    if (timer.state === 'waiting') {
      const interval = setInterval(() => {

        const timeElapsed = Math.floor((Date.now() - startTime.current) / 1000);
        const timeRemaining = (settings[timerOption] * 60) - timeElapsed;

        setTimer((oldTimer) => ({
          ...oldTimer,
          elapsed: timeElapsed,
          remaining: timeRemaining,
          state: 'running'
        }));
        timerInterval.current = interval;
      });
    }

  }, [settings, timer, timerOption]);

  useEffect(() => {

    clearInterval(timerInterval.current);
    setTimer(() => ({
      state: null,
      remaining: settings[timerOption] * 60,
      elapsed: 0
    }));
  }, [timerOption, settings]);

  function handleToggleInterval() {

    if (timer.state === null) {

      setTimer((oldTimer) => ({
        ...oldTimer,
        startTime: Date.now(),
        elapsed: 0,
        state: 'waiting'
      }));

      startTime.current = Date.now();

    } else if (timer.state === 'running') {

      clearInterval(timerInterval.current);

      setTimer((oldTimer) => ({
        ...oldTimer,
        id: -1,
        state: 'paused'
      }));
    } else if (timer.state === 'paused') {

      setTimer((oldTimer) => ({
        ...oldTimer,
        state: 'waiting'
      }));

      startTime.current = Date.now() - (timer.elapsed * 1000);
    }
  }

  return (
    <div className={styles.timer}>
      <svg viewBox="0 0 100 100">
        <circle className={styles.timeline} cx="50" cy="50" r="45" strokeWidth="3" fill="none"
                strokeDashoffset={timelineRemaining}></circle>
      </svg>
      <div className={styles.controls}>
        <div className={styles['time-remaining']}>{minutesRemaining}:{secondsRemaining}</div>
        <button className={styles['timer-button']} onClick={handleToggleInterval}>{timer.state === null ? 'Start' : timer.state === 'paused' ? 'Resume' : 'Pause'}</button>
      </div>
    </div>
  );
}

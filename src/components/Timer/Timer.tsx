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
    remaining: settings[timerOption] * 60 * 1000,
    duration: settings[timerOption] * 60 * 1000,
    elapsed: 0
  });

  const timerInterval = useRef<NodeJS.Timeout | number>(-1);
  const startTime = useRef(0);

  const minutesRemaining = String(Math.floor(timer.remaining / 60 / 1000)).padStart(2, '0');
  const secondsRemaining = String(Math.floor((timer.remaining / 1000) % 60)).padStart(2, '0');

  const timelineRemaining = map(timer.remaining, 0, timer.duration, 282.999, 0);

  useEffect(() => {

    if (timer.state === 'waiting') {

      setTimer((oldTimer) => ({
        ...oldTimer,
        state: 'running',
      }));

      const interval = setInterval(() => {

        const timeElapsed = Date.now() - startTime.current;
        let timeRemaining = (settings[timerOption] * 60 * 1000) - timeElapsed;

        if (timeRemaining < 0) {

          timeRemaining = 0;
          clearInterval(timerInterval.current);

          setTimer((oldTimer) => ({
            ...oldTimer,
            elapsed: timeElapsed,
            remaining: timeRemaining,
            state: 'done'
          }));

          return;
        }

        setTimer((oldTimer) => ({
          ...oldTimer,
          elapsed: timeElapsed,
          remaining: timeRemaining
        }));
      }, 500);

      timerInterval.current = interval;
    }

  }, [settings, timer, timerOption]);

  useEffect(() => {

    clearInterval(timerInterval.current);

    setTimer((prevState) => ({
      ...prevState,
      state: null,
      remaining: settings[timerOption] * 60 * 1000,
      duration: settings[timerOption] * 60 * 1000,
      elapsed: 0
    }));
  }, [timerOption, settings]);

  function handleTimerButton() {

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
        state: 'paused'
      }));
    } else if (timer.state === 'paused') {

      setTimer((oldTimer) => ({
        ...oldTimer,
        state: 'waiting'
      }));

      startTime.current = Date.now() - timer.elapsed;
    } else if (timer.state === 'done') {

      setTimer((oldTimer) => ({
        ...oldTimer,
        state: null,
        elapsed: 0,
        remaining: oldTimer.duration
      }));
    }
  }

  const timeButtonText = timer.state === null ? 'Start' : timer.state === 'paused' ? 'Resume' : timer.state === 'done' ? 'Reset' : 'Pause';

  return (
    <div className={styles.timer}>
      <svg viewBox="0 0 100 100">
        <circle className={styles.timeline} cx="50" cy="50" r="45" strokeWidth="3" fill="none"
                strokeDashoffset={timelineRemaining}></circle>
      </svg>
      <div className={styles.controls}>
        <div className={styles['time-remaining']}>{minutesRemaining}:{secondsRemaining}</div>
        <button className={styles['timer-button']} onClick={handleTimerButton}>{timeButtonText}</button>
      </div>
    </div>
  );
}

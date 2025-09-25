export type TimerOption = 'pomodoro' | 'shortBreak' | 'longBreak';

export type TimerState = 'paused' | 'running' | 'waiting' | 'done' | null;

export type Timer = {
  state: TimerState;
  remaining: number;
  duration: number;
  elapsed: number;
}

export type TimerOption = 'pomodoro' | 'shortBreak' | 'longBreak';

export type TimerState = 'paused' | 'running' | 'waiting' | null;

export type Timer = {
  state: TimerState;
  remaining: number;
  elapsed: number;
}

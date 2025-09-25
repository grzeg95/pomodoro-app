import styles from './InputNumber.module.scss';

type InputNumberProps = {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  label: string;
}

export function InputNumber({ min, max, value, onChange, label }: InputNumberProps) {

  function validate(value: number) {

    let nextValue = value;

    if (value <= min) {
      nextValue = min;
    } else if (value >= max) {
      nextValue = max;
    }

    onChange(nextValue);
  }

  return (
    <label className={styles['input-number-label']}>
      {label}
      <div className={styles['input-number-wrapper']}>
        <input
          className={styles['input-number']}
          min={min}
          max={max}
          value={value}
          onChange={(e) => validate(+e.target.value)}
        />
        <div className={styles['input-number-buttons']}>
          <button className={styles['input-number-button']} onClick={() => validate(value + 1)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="7">
              <path fill="none" stroke="#1E213F" stroke-opacity=".25" stroke-width="2" d="M1 6l6-4 6 4"/>
            </svg>
          </button>
          <button className={styles['input-number-button']} onClick={() => validate(value - 1)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="7">
              <path fill="none" stroke="#1E213F" stroke-opacity=".25" stroke-width="2" d="M1 1l6 4 6-4"/>
            </svg>
          </button>
        </div>
      </div>
    </label>
  )
}

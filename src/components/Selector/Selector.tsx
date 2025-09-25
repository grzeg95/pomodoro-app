import {useState} from 'react';
import type {TimerOption} from '../../models/timer';
import styles from './Selector.module.scss';

type SelectorProps = {
  items?: {value: TimerOption, label: string}[];
  onChange?: (value: TimerOption) => void;
  selected?: string;
}

export function Selector({
  items = [],
  onChange,
  selected = items[0]?.value
}: SelectorProps) {

  const [selectedItem, setSelectedItem] = useState(selected);

  function handleClick(value: TimerOption)  {

    setSelectedItem(value);

    if (value !== selectedItem) {
      onChange?.(value);
    }
  }

  return (
    <div className={styles.selector}>
      {items.map((item) => (
        <button
          key={item.value}
          className={`${styles['selector-item']} ${selectedItem === item.value ? styles['selector-item-active'] : ''}`}
          onClick={() => handleClick(item.value)}
        >{item.label}</button>
      ))}
      <div className={styles['selector-indicator']}></div>
    </div>
  )
}

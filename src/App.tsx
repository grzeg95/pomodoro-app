import styles from './App.module.scss';
import iconLogo from './assets/logo.svg';

export function App() {

  return (
    <div className={styles['container']}>

      <img src={iconLogo} alt='Pomodoro'/>
    </div>
  )
}

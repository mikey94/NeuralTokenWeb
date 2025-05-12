import styles from './loader.module.css';

export default function Loader() {
    return (
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    )
}
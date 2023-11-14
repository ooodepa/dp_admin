import styles from './Error404Page.module.css';

export default function Error404Page() {
  return (
    <div className={styles.wrapper}>
      <div>
        <h2>404</h2>
        <p>Страница не найдена</p>
      </div>
    </div>
  );
}

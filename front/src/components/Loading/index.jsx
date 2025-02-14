import styles from './styles.module.css';

export default function Loading () {
  return (
    <div className={styles.loading}>
      <div className={styles.loading__spinner}></div>
      <p>Carregando...</p>
    </div>
  );
};


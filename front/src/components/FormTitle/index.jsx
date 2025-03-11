import styles from './styles.module.css';

export default function FormTitle({ title }) {
  return (
    <h2 className={styles.formTitle}>{title}</h2>
  )
}

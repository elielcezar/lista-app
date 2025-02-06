import styles from './styles.module.css';

export default function PageTitle( {title} ) {
  return (
    <div>
        <h2 className={styles.pagetitle}>{title}</h2>      
    </div>
  )
}

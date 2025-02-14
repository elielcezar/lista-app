import styles from './styles.module.css';

export default function StatusMessage({ message, type }) {
    return (
        <>
            <div className={styles.overlay}>
                <div className={`${styles.confirmationMessage} ${styles[type]}`}>
                    <p>{message}</p>
                </div>
            </div>
        </>
    );
};
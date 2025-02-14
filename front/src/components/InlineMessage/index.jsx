import styles from './styles.module.css';

export default function StatusMessage({ message, type }) {
    return (
        <>  
            <div className={`${styles.inlineMessage} ${styles[type]}`}>
                <p>{message}</p>
            </div>
        </>
    );
};
import { useNavigate } from 'react-router-dom'
import styles from './styles.module.css'

export default function CriarTarefaBtn() {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/cadastro-tarefa')
    }
    return (
        <>
            <button className={styles.btn} onClick={handleClick}>
                +
            </button>
        </>
    )
}

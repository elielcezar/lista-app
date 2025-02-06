import { useNavigate } from 'react-router-dom'
import styles from './styles.module.css'

export default function BtnCreate({ path }) {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(path)
        console.log(path)
    }
    return (
        <>
            <button className={styles.btn} onClick={handleClick}>
                +
            </button>
        </>
    )
}

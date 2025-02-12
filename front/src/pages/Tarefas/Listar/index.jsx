import ListaTarefas from '@/components/ListaTarefas';
import styles from './styles.module.css'

export const Imoveis = () => {    

  return (
    <div id="main" className={styles.main}>
        <div className="container">            
            <ListaTarefas />
        </div>
    </div>
  )
}

export default Imoveis
import ListaTarefas from '@/components/ListaTarefas';
import styles from './style.module.css'

export const Imoveis = () => {    

  return (
    <div id="main" className={styles.main}>
        <div className="container">
            <h1>Nossos Imóveis</h1>
            <ListaTarefas />
        </div>
    </div>
  )
}

export default Imoveis
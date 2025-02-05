import ListaImoveis from '@/components/lista-imoveis';
import styles from './style.module.css'

export const Imoveis = () => {    

  return (
    <div id="main" className={styles.main}>
        <div className="container">
            <h1>Nossos Imóveis</h1>
            <ListaImoveis />
        </div>
    </div>
  )
}

export default Imoveis
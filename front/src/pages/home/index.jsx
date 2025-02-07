import ListaImoveis from '@/components/lista-imoveis';
import CriarTarefaBtn from '@/components/CriarTarefaBtn';
import PageTitle from '../../components/PageTitle';
import styles from './styles.module.css';


function Home() {   
  
  return (
    <>      
      <PageTitle title="Tarefas Ativas"/>
      <div id="main" className={styles.mainHome}>
        <div className="container">  
          <ListaImoveis />            
        </div> 
      </div>
      <CriarTarefaBtn/>  
    </>
  )
}

export default Home